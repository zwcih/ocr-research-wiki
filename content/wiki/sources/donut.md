---
type: source
title: "OCR-free Document Understanding Transformer (Donut)"
authors: [Kim, Hong, Yim, et al.]
year: 2022
arxiv: "2111.15664"
sources: [donut]
tags: [ocr, document-understanding, ocr-free, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---
# Donut (2022) — 深度精读

📄 **原文**：[arXiv:2111.15664](https://arxiv.org/abs/2111.15664) · [PDF](https://arxiv.org/pdf/2111.15664)
> 里程碑 ⭐ — 第一个 **OCR-free** 的视觉文档理解 (VDU) 模型：不接任何外部 OCR 引擎，直接从文档图像端到端生成结构化 JSON。

## 一句话定位
把「文档理解」从「先 OCR 抽文字 → 再 NLP 理解」的两段式流水线，压缩成**一个图像 encoder + 一个文本 decoder** 的端到端模型；输入文档图，直接自回归输出结构化信息（JSON），彻底摆脱 OCR 依赖及其误差传播、速度与维护成本。

## 核心贡献
1. **OCR-free VDU 范式**：首个基于 Transformer、不依赖任何 OCR 模块的文档理解模型；避开 OCR 错误上限、语言/领域适配成本高、推理慢等痛点。
2. **合成数据引擎 SynthDoG**：自建可扩展文档生成器，用中/日/韩/英 Wikipedia 各生成 **0.5M** 样本做预训练，摆脱对真实标注文档的依赖。
3. **预训练 = 伪 OCR 任务**：预训练目标是「读出图中所有文字」（text reading），让模型先学会看懂文档，再在下游任务微调（分类、信息抽取、DocVQA）。

## 架构 / 方法细节
- **视觉 encoder**：**Swin Transformer**（shifted-window 多头注意力），把文档图切非重叠 patch，最后一层输出喂给文本 decoder。
- **文本 decoder**：**BART**（多语言预训练 BART 初始化，速度考虑只取前 4 层），自回归生成 token 序列。
- **输出转换**：生成的 token 串用简单正则转成目标 JSON（含嵌套结构如 items>item>{name,count,price}）。
- **分辨率**：Train Ticket / CORD 用到 960×1280、1280×960 等高分辨率提升细粒度识别。

## 关键结果（真实数字）
- **文档分类 RVL-CDIP：95.30%**，超过 LayoutLM/LayoutLMv2，且参数更少、速度约 **2×** 快，还无需额外 OCR 引擎参数。
- **信息抽取**：CORD（收据）F1/Acc 达 SOTA（1280×960 时约 91.1 acc）；Train Ticket、私有业务数据集全部拿到最好分数（F1 与 TED-based accuracy 双指标）。
- **DocVQA：ANLS 67.5**，无 OCR 却能与依赖外部 OCR 的基线竞争；在手写文档等 OCR 易错场景更鲁棒。
- 局限：受端到端输入分辨率限制，超大图中的极小文字可能漏读。

## 为什么是里程碑
证明「无 OCR、端到端图→结构化输出」这条路可行且在速度与精度上都能胜过 OCR-dependent 方案，开创 OCR-free VDU 方向，直接启发后续把 OCR/文档解析统一进单一生成式模型的思路（[[nougat]]、[[got-ocr2]]、[[deepseek-ocr]]）。

## 关联
- 视觉骨干 Swin 属 [[vit]] 家族；文本 decoder 用 [[bert]]-时代的 seq2seq BART；对比 OCR-dependent 的 [[layoutlmv3]]。
- 与 [[trocr]] 同为生成式 OCR 思路，但 Donut 面向**整页文档 → 结构化输出**；后继 [[nougat]]（学术 PDF→Markdown）、[[got-ocr2]]、[[deepseek-ocr]] 沿此路线扩展。
