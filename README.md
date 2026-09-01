# OCR 与文档智能研究 Wiki

公开的中文研究知识库，整理 OCR、文档智能、计算机视觉与生成模型的重要论文、概念和技术脉络。

## 在线阅读

部署完成后访问：<https://zwcih.github.io/ocr-research-wiki/>

网站支持全文搜索、双向链接、关系图谱、数学公式和移动端阅读，无需安装 Obsidian。

## 内容结构

- `content/wiki/sources/`：论文与资料精读
- `content/wiki/concepts/`：理论、方法和技术概念
- `content/wiki/entities/`：研究者、机构、产品与模型
- `content/wiki/comparisons/`：并列比较
- `content/wiki/synthesis/`：跨论文专题综述

原始论文不存入仓库，页面优先链接 arXiv、DOI、OpenReview 或官方来源。

## 发布

- 推送到 `main` 后，GitHub Actions 自动构建并部署网站。
- 每周一自动生成整库 PDF，并更新 `latest-pdf` Release；也支持手动触发。

## 本地预览

```bash
npm ci
npx quartz plugin restore
npx quartz build --serve
```

网站引擎基于 [Quartz](https://quartz.jzhao.xyz/)；Quartz 源码遵循 MIT License，见 `QUARTZ-LICENSE.txt`。
