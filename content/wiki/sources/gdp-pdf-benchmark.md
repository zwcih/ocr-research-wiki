---
type: source
title: "GDP.pdf: Benchmarking Grounded Multimodal Reasoning over Professional PDF Documents"
authors: [Garre, Ritchie, Mehta, Chen (Surge AI)]
year: 2026
arxiv: "2607.11192"
sources: [gdp-pdf-benchmark]
tags: [ocr, benchmark, document-reasoning, multimodal, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---
# GDP.pdf (2026) — 深度精读

📄 **原文**：[arXiv:2607.11192](https://arxiv.org/abs/2607.11192) · [PDF](https://arxiv.org/pdf/2607.11192)
> 里程碑 ⭐ — 由各行业**在职专家**出题的专业 PDF 文档推理基准；只保留「让至少两个前沿多模态模型实质翻车」的题，暴露真实工作场景下 SOTA 模型的巨大差距。

## 一句话定位
不再孤立测 OCR / 版面 / 图表 / 表格 QA，而是直接问「行业从业者真正会对某份 PDF 提的问题」——福利手册、租约、数据表、临床指南、施工图纸——衡量模型在长、格式多变、证据分散的真实文档上做**接地 (grounded) 多模态推理**的能力。

## 核心贡献
1. **对抗式、专业出题**：题目由**十个领域的在职专业人士**撰写，且只有当**至少两个前沿多模态模型以「实质错误」方式失败**（答错、漏掉决定性证据、或凭空捏造，而非风格差异）时才收录——保证难度与现实相关性。
2. **细粒度评测协议**：每题配 **atomic criteria rubric**，同时报告**分级 rubric 分**与**严格的 task-level pass rate**；每题按**三层 11 种能力**打标签（文本抽取与 grounding、表格/图表理解、交叉引用、空间推理、对无支撑问题的 abstention 弃权）。
3. **公开 100 题基准**（HuggingFace: surgeai/GDP.pdf）。

## 方法 / 数据细节
- 100 道 question–document 对，覆盖多页表格、侧栏、图例、脚注、末尾修订 (amendments) 等复杂结构，还考背景知识（如「tier」是什么）与跨页证据（结论所在脚注可能离相关流程图三页远）。
- 评测 **17 个前沿模型**（截至 2026 年 7 月）。

## 关键结果（真实数字）
- **最好的模型仅通过 30.7% 的题目，最差的只有 2%**——现有 SOTA 在真实文档工作流上远未及格。
- 标准视觉推理套件上的高分**不能预测**在这些日常经济活动文档上的表现。
- 错误集中于少数反复出现的失效模式：表格错位、图表误读、跳过脚注/例外条款、平面图符号数错、扫描噪声、以及被后续修订取代的旧文本。

## 为什么是里程碑
把文档 AI 评测从「学术化 visual QA」拉回「真实专业工作」，用对抗式收题揭示 OCR/解析类模型即便刷爆 [[omnidocbench]] 也难以胜任现实文档推理；为下一代文档模型指明「grounding + 长文档 + 弃权」等真痛点。

## 关联
- 是对 [[omnidocbench]] 等「能力孤立评测」的补充与批判——高分不等于能用；直接考验 [[got-ocr2]]、[[deepseek-ocr]]、[[glm-ocr]]、[[monkeyocr-v2]]、[[ovis-ocr2]] 等模型的真实推理上限。
- 面向 [[donut]]/[[pix2struct]] 之后 DocVQA 一脉的进阶版：从「问事实」到「问需多步接地推理的专业问题」。
