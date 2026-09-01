---
type: source
title: "Agentic Document Extraction Gen2 (DPT-3 family)"
authors: [LandingAI]
year: 2026
venue: LandingAI Blog
url: "https://landing.ai/blog/introducing-agentic-document-extraction-gen2"
sources: [lai-ade-gen2]
tags: [document-ai, commercial, landingai, dpt3, ocr]
created: 2026-07-23
updated: 2026-07-23
reading: deep
---
# Agentic Document Extraction Gen2 / DPT-3 (LandingAI, 2026)
> 商业文档智能平台的第二代，主打"为 AI agent 设计"的文档抽取。

## 一句话定位
LandingAI 推出的 **DPT-3 系列基础模型**驱动的第二代 Agentic Document Extraction (ADE)，
从整体版面到行/单元格逐层解析，输出面向 AI agent 消费的结构化结果 + 细粒度引用。

## 三大主题
1. **规模化的经济性 (Affordability at scale)**
   - 按**返回字符数**（内容复杂度）计费，而非按页；内容少的页最便宜
   - 服务层级：Priority 1.0x / Standard 0.5x / Batch 0.375x
2. **Agent-ready 输出**：为 AI agent 消费设计，不只是给人读
3. **原子级引用 (Atomic citations)**：行级、词级引用，支撑脱敏/溯源等下游

## DPT-3 模型家族
- **DPT-3 Pro**（GA）：高精度，处理极端复杂文档——手写、不一致勾选框、中文/阿拉伯文、扫描件/拍照件
- **DPT-3 Fast**（2026-08 预览）：Latin 文字数字文本/表格的低成本档，对标低价 OCR
- **Auto-select**（Q3/Q4 2026）：在 Pro/Fast 间智能路由

## 为什么值得记
- 代表**商业文档智能**从"给人读的 OCR"转向"给 agent 用的结构化 + 溯源"范式
- 与开源端到端 OCR（[[got-ocr2]]、[[deepseek-ocr]]）形成对照：商业侧更重工程化定价/引用/多语种鲁棒

## 关联
- 属 document-AI，理念承 [[layoutlmv3]] 的多模态文档理解、OCR-free（[[donut]]）路线
- 其 attestation 检测能力详见 [[lai-signatures-stamps-seals]]
- 文档 AI 的评测难点见 [[gdp-pdf-benchmark]]
