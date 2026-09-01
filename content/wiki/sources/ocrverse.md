---
type: source
title: "OCRVerse: Towards Holistic OCR in End-to-End"
authors: [DocTron-hub]
year: 2026
arxiv: "2601.21639"
sources: [ocrverse]
tags: [ocr, holistic-ocr, end-to-end, data-engineering, sft-rl, text-centric, vision-centric]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---

# OCRVerse — 端到端"整体 OCR"（2026）

📄 **原文**：[arXiv:2601.21639](https://arxiv.org/abs/2601.21639) · [PDF](https://arxiv.org/pdf/2601.21639)

> ⭐ 提出 "holistic OCR"：把文本中心(文档) + 视觉中心(图表/网页/科学图) OCR **统一到一个端到端模型**，别再分家。

## 一句话
首个端到端 **holistic OCR**：统一处理 text-centric（普通文档）和 vision-centric
（图表 charts、网页 web pages、科学图 plots）两类 OCR；靠**全面数据工程** + **两阶段 SFT + RL**
多域训练，避免碎片 pipeline 的幻觉（错误阅读顺序、漏内容）。

## 核心论点 & 方法
- **holistic 范式**：传统方法要么 pipeline（灵活但微调贵）、要么 VLM 端到端（简洁但幻觉多）。
  OCRVerse 主张一个模型通吃文本类 + 视觉类文档。
- **两条互补策略**：① 全面数据工程覆盖 text-centric + composites（图表/网页/科学图）
  ② 两阶段 SFT + RL 多域训练。

## 对 OCR 系统设计的启示
- **别只盯文档文本**：真实场景有大量 **vision-centric** 内容（图表、网页截图、科学 plot），
  它们的"OCR"是要理解结构/数值/坐标轴，不只是认字。检测前端检测 + 后端生成要预留这类元素
  （chart→表格化、plot→数据点），否则覆盖不全。
- **多域数据工程**是通用能力的前提：单一文档域训不出通吃。
- **SFT + RL 两段**：先 SFT 学格式，再 RL 修多域鲁棒性——又一个 SFT→RL 配方佐证。

## 关联
- 图表/复杂元素也覆盖：[[dots-ocr]]、[[youtu-parsing]]
- SFT+RL 训练：[[firered-ocr]]、[[logics-parsing]]
- 基准：[[omnidocbench]]
