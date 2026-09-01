#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import YAML from "yaml"

const root = process.cwd()
const configPath = path.join(root, "quartz.config.yaml")
const lockPath = path.join(root, "quartz.lock.json")
const filteredLockPath = path.join(root, ".quartz", "enabled-quartz.lock.json")

function pluginName(source) {
  if (source.startsWith("github:")) {
    const repo = source.slice("github:".length).split("#", 1)[0]
    return path.posix.basename(repo).replace(/\.git$/, "")
  }

  const withoutProtocol = source.replace(/^git\+/, "").split("#", 1)[0]
  return path.basename(withoutProtocol.replace(/[\\/]$/, "")).replace(/\.git$/, "")
}

function createEnabledLock() {
  const config = YAML.parse(fs.readFileSync(configPath, "utf8"))
  const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"))
  const enabledNames = config.plugins
    .filter((plugin) => plugin.enabled === true)
    .map((plugin) => pluginName(plugin.source))

  const missing = enabledNames.filter((name) => lock.plugins[name] === undefined)
  if (missing.length > 0) {
    throw new Error(`Enabled plugins missing from quartz.lock.json: ${missing.join(", ")}`)
  }

  const plugins = Object.fromEntries(enabledNames.map((name) => [name, lock.plugins[name]]))
  return { lock: { ...lock, plugins }, enabledCount: enabledNames.length }
}

const { lock, enabledCount } = createEnabledLock()
fs.mkdirSync(path.dirname(filteredLockPath), { recursive: true })
fs.writeFileSync(filteredLockPath, `${JSON.stringify(lock, null, 2)}\n`)
console.log(`Prepared lockfile for ${enabledCount} enabled Quartz plugins.`)

if (process.argv.includes("--prepare-only")) {
  process.exit(0)
}

const originalLock = fs.readFileSync(lockPath)
let result
try {
  fs.copyFileSync(filteredLockPath, lockPath)
  result = spawnSync("npx", ["quartz", "plugin", "restore"], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  })
} finally {
  fs.writeFileSync(lockPath, originalLock)
}

if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)
