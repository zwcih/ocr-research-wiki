import fs from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"

const root = process.cwd()
const sourceDir = path.join(root, "content", "wiki", "sources")
const indexPath = path.join(root, "content", "index.md")
const startMarker = "<!-- recent-sources:start -->"
const endMarker = "<!-- recent-sources:end -->"
const limit = 12

const normalizeDate = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  return String(value ?? "").slice(0, 10)
}

const entries = await Promise.all(
  (await fs.readdir(sourceDir))
    .filter((name) => name.endsWith(".md"))
    .map(async (name) => {
      const raw = await fs.readFile(path.join(sourceDir, name), "utf8")
      const { data } = matter(raw)
      const created = normalizeDate(data.created)
      const updated = normalizeDate(data.updated ?? data.created)
      return {
        slug: name.slice(0, -3),
        title: String(data.title ?? name.slice(0, -3)),
        created,
        updated,
      }
    }),
)

const latest = entries
  .filter((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry.created))
  .sort(
    (a, b) =>
      b.created.localeCompare(a.created) ||
      b.updated.localeCompare(a.updated) ||
      a.title.localeCompare(b.title, "zh-CN"),
  )
  .slice(0, limit)

const block = [
  startMarker,
  "",
  "## 最近更新",
  "",
  ...latest.map(
    ({ created, slug, title }) => `- **${created}** · [[wiki/sources/${slug}|${title}]]`,
  ),
  "",
  "[[wiki/index|查看全部文章 →]]",
  "",
  endMarker,
].join("\n")

const index = await fs.readFile(indexPath, "utf8")
const start = index.indexOf(startMarker)
const end = index.indexOf(endMarker)
if (start === -1 || end === -1 || end < start) {
  throw new Error(`Missing recent-source markers in ${indexPath}`)
}

const next = `${index.slice(0, start)}${block}${index.slice(end + endMarker.length)}`
if (next !== index) {
  await fs.writeFile(indexPath, next)
  console.log(`Updated ${path.relative(root, indexPath)} with ${latest.length} recent sources.`)
} else {
  console.log("Recent source list is already up to date.")
}
