---
type: source
title: "Dolphin: Document Image Parsing via Heterogeneous Anchor Prompting"
authors: [ByteDance]
year: 2025
arxiv: "2505.14059"
sources: [dolphin]
tags: [ocr, document-parsing, anchor-prompting, parallel-decoding, two-stage, analyze-then-parse, frontend, backend]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---

# Dolphin — 异构锚点提示的文档解析（字节，2025）

📄 **原文**：[arXiv:2505.14059](https://arxiv.org/abs/2505.14059) · [PDF](https://arxiv.org/pdf/2505.14059)

> ⭐ **“analyze-then-parse” + 元素级并行解析**：检测结果作为 anchor 送入识别模块，各元素可以并行解码。

## 一句话
两阶段 "analyze-then-parse"：① 第一阶段按**阅读顺序**生成一串 layout 元素（异构：文本/表格/
公式…），这些元素当 **anchor**；② 把每个 anchor + 任务专属 prompt 喂回同一模型，
**并行**解析各元素内容。轻量 + 并行 → 高效。

## 核心机制：Heterogeneous Anchor Prompting (HAP)
- **anchor = 第一阶段检出的版面元素**（带类型），已排好阅读顺序。
- 第二阶段：`anchor + task-specific prompt` → 模型对该元素做识别。不同类型元素配不同 prompt
  （表格→HTML、公式→LaTeX、文本→纯文本）。
- **并行**：所有 anchor 的第二阶段解析可同时跑（互不依赖）→ 比整页顺序解码快得多。

## 对检测—识别组合系统的启示
- **这就是你"检测→生成"衔接的教科书做法**：前端 DETR 出的每个 query/框 = 一个 anchor，
  后端 AR **逐 anchor 并行**生成 → 既解耦又高效，避免整页长序列解码。
- **task-specific prompt 按元素类型分流**：表格/公式/文本用不同 prompt + 输出格式，
  后端一个 AR 解码器靠 prompt 切换，省得为每类训独立 decoder。
- **阅读顺序在第一阶段就定**：前端检测时顺带出顺序（DETR query 间的关系可建模），
  后端只管识别，关系不落缝里（回应 [[dots-ocr]] 的担忧）。
- **并行解码 = 效率关键**：文档几百个元素，并行比自回归整页快一个量级，
  对 OCR 系统后端吞吐至关重要（另见 [[youtu-parsing]] 的并行解码）。

## 关联
- 升级：[[dolphin-v2]]（更细粒度检测 + 拍摄文档 + 绝对坐标）
- 同两阶段：[[mineru2.5]]、[[paddleocr-vl]]
- 并行解码：[[youtu-parsing]]
- 基准：[[omnidocbench]]
