---
type: concept
title: OmniDocBench（文档解析基准）
sources: [ovis-ocr2, monkeyocr-v2]
tags: [benchmark, document-ai, ocr]
created: 2026-07-23
updated: 2026-08-04
---
# OmniDocBench（文档解析基准）

## 是什么
当前最主流的**端到端文档解析（document parsing）评测基准**之一，用于衡量模型把整页文档图转成结构化内容（Markdown/HTML）的综合能力。覆盖多类型真实文档：学术论文、书籍、报纸、教材、财报、试卷、手写等，标注了文字、表格、公式、阅读顺序等多个维度。

## 评什么维度
- **文本**：字符/文本块识别准确率（编辑距离/CER 类）。
- **表格**：结构+内容，常用 TEDS（Tree-Edit-Distance Similarity）。
- **公式**：LaTeX 识别，常用 CDM 等。
- **阅读顺序（reading order）**：多栏/复杂版面下内容序列化是否正确——这是端到端解析最难也最能区分模型的维度。
- 综合成 overall 分（越高越好，如百分制/编辑距离归一）。

## 两种评测范式（重要）
- **decoupled / quick match**：分模块对齐后评，弱化版面/阅读序影响，更看纯识别。
- **layout-dependent / end-to-end**：完整评端到端输出，含版面与阅读序——很多模型在这套下大幅掉分（见 [[more-benchmark]] 里 HunyuanOCR 端到端跌 ~16 分）。上线务必两套都报。

## 版本与榜单动态
基准持续迭代（v1.5 / v1.6 / v1.7 …），分数逐版刷新：[[ovis-ocr2]] 在 v1.6 达 96.58 SOTA；[[monkeyocr-v2]]、[[got-ocr2]]、[[deepseek-ocr]]、[[paddleocr-vl]]、[[mineru2.5]] 等均以此为主参照。与偏推理/grounding 的 [[gdp-pdf-benchmark]] 互补。

## 对检测—识别组合系统的意义
- 阅读顺序维度直接考验后端 AR 的序列化；[[fca|FCA]]−CA gap 可辅助定位阅读序 vs 字符误识。
