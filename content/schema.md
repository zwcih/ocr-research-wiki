---
type: about
title: 内容约定
updated: 2026-09-01
---

# 内容约定

## 目录

- `wiki/sources/`：每份论文或资料对应一个精读页。
- `wiki/entities/`：研究者、机构、产品与模型。
- `wiki/concepts/`：理论、方法和技术概念。
- `wiki/comparisons/`：并列比较。
- `wiki/synthesis/`：跨资料专题综述。
- `wiki/index.md`：总目录；`wiki/overview.md`：全局概要。

## Frontmatter

每页使用 YAML frontmatter，常见字段包括：

```yaml
---
type: source | entity | concept | comparison | synthesis
title: 页面标题
sources: [source-slug]
tags: [ocr, detection]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

论文页应优先提供 arXiv、DOI、OpenReview 或作者官方页面，不在仓库中重复保存论文 PDF。

新增或修改 source 页后运行 `npm run update-recent`，刷新首页“最近更新”列表；列表按 `created` 日期倒序展示最近 12 篇文章。

## 链接与语言

- 内部交叉引用使用 `[[页面slug]]` 或 `[[页面slug|显示文字]]`。
- 页面以中文书写；专有名词、模型名和必要术语保留英文。
- 数值、排名和论文结论应注明适用的 benchmark、版本和比较范围。
