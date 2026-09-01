import fs from "node:fs"
import path from "node:path"

const pluginNames = ["explorer", "graph", "search"]
let patchedFiles = 0
const verifiedPlugins = new Set()

function patchFile(file) {
  const original = fs.readFileSync(file, "utf8")
  let content = original

  // These community plugins currently assume that every site is hosted at /.
  content = content.replaceAll(
    'fetch("/static/contentIndex.json")',
    "fetch(window.__quartzContentIndex)",
  )

  if (file.includes(`${path.sep}explorer${path.sep}`)) {
    content = content
      .replaceAll('h.href="/"+(g||"")', 'h.href=window.__quartzUrl(g||"")')
      .replaceAll('n.href="/"+u.data.slug', "n.href=window.__quartzUrl(u.data.slug)")
  }

  if (file.includes(`${path.sep}search${path.sep}`)) {
    content = content
      .replaceAll('m.href="/"+e.slug', "m.href=window.__quartzUrl(e.slug)")
      .replace(/(\w+)\.href="\/"\+(\w+)\.slug/g, "$1.href=window.__quartzUrl($2.slug)")
  }

  if (file.includes(`${path.sep}graph${path.sep}`)) {
    content = content
      .replaceAll("window.location.pathname", "window.__quartzCurrentSlug()")
      .replaceAll("window.location.href=l", "window.location.href=window.__quartzUrl(l)")
      .replaceAll("window.location.href=f", "window.location.href=window.__quartzUrl(f)")
  }

  if (content !== original) {
    fs.writeFileSync(file, content)
    patchedFiles++
  }

  const pluginName = pluginNames.find((name) => file.includes(`${path.sep}${name}${path.sep}`))
  if (!pluginName) return

  const requiredMarkers = {
    explorer: ["window.__quartzContentIndex", "window.__quartzUrl"],
    graph: ["window.__quartzContentIndex", "window.__quartzCurrentSlug", "window.__quartzUrl"],
    search: ["window.__quartzContentIndex", "window.__quartzUrl"],
  }
  if (requiredMarkers[pluginName].every((marker) => content.includes(marker))) {
    verifiedPlugins.add(pluginName)
  }
}

for (const pluginName of pluginNames) {
  const dist = path.join(".quartz", "plugins", pluginName, "dist")
  if (!fs.existsSync(dist)) {
    throw new Error(`Quartz plugin is not restored: ${dist}`)
  }

  for (const entry of fs.readdirSync(dist, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".js")) continue
    patchFile(path.join(entry.parentPath, entry.name))
  }
}

const unverifiedPlugins = pluginNames.filter((name) => !verifiedPlugins.has(name))
if (unverifiedPlugins.length > 0) {
  throw new Error(
    `Quartz subpath patch could not be verified for: ${unverifiedPlugins.join(", ")}; upstream output may have changed`,
  )
}

if (patchedFiles > 0) {
  console.log(`Patched ${patchedFiles} Quartz plugin bundles for subpath hosting`)
} else {
  console.log("Quartz plugin bundles are already patched for subpath hosting")
}
