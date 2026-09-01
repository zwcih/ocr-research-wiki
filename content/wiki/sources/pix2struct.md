---
type: source
title: "Pix2Struct: Screenshot Parsing as Pretraining for Visual Language Understanding"
authors: [Lee, Joshi, Turc, et al.]
year: 2022
arxiv: "2210.03347"
sources: [pix2struct]
tags: [ocr, visual-language, screenshot, pretraining, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---
# Pix2Struct (2022) — 深度精读

📄 **原文**：[arXiv:2210.03347](https://arxiv.org/abs/2210.03347) · [PDF](https://arxiv.org/pdf/2210.03347)
> 里程碑 ⭐ — 用「把网页截图解析成简化 HTML」作为预训练任务，得到一个统一的**图像→文本**视觉语言模型，覆盖文档、图表、UI、信息图等一切「视觉中呈现的语言」。

## 一句话定位
image-encoder → text-decoder 架构，预训练目标是**从被掩码的网页截图预测其简化 HTML 解析树**——网页天然提供文字、图像、版面的海量对齐监督。配合 variable-resolution 输入，微调即可通吃 9 个视觉语言任务。

## 核心贡献
1. **Screenshot parsing 预训练**：从 masked screenshot 预测 HTML-based parse。HTML 同时给出文本、图像、布局的干净信号，掩码迫使模型联合推理三者共现；实验证明比此前的合成/表面特征预训练更有效。
2. **可变分辨率输入**：为 ViT 引入 variable-resolution，**保持原始长宽比不失真**（文档/UI 长宽比差异极大），比强制 rescale 更鲁棒。
3. **灵活多模态整合**：把 VQA 的问题文本、bbox 等辅助输入直接**渲染到图像上**，无需改架构即可注入。

## 架构 / 方法细节
- **image-encoder-text-decoder**（ViT 编码 + Transformer 解码）。
- 预训练数据：从 C4 语料 URL 爬取的 **80M** 网页截图 + HTML。HTML DOM 树被压缩（只保留最大可放进序列长度的子树），并在截图上画出对应区域 bbox。
- 两个规格：**Pix2Struct-Base 282M** 与 **Pix2Struct-Large 1.3B** 参数。
- 微调统一简单：把下游输入也渲染成图+文本序列。

## 关键结果（真实数字）
- 在 **4 个领域、9 个任务** 上评测，**6/9 任务取得 SOTA**（含 DocVQA、ChartQA、AI2D、InfographicVQA、OCR-VQA、Widget Captioning、Screen2Words、TextCaps、RefExp 等）。
- 大幅超过最强无 pipeline 基线 **[[donut]]（领先 9–53 分）**，且在多任务上媲美/超过依赖 OCR pipeline 的方法。

## 为什么是里程碑
把「视觉中的语言理解」统一到一个 image→text 模型与一个自监督目标（截图→HTML），首次用网页规模的免费对齐数据做通用视觉语言预训练；variable-resolution 与「辅助输入渲染进图像」成为后续多模态文档/UI 模型的常用手法。

## 关联
- 骨干为 [[vit]]（可变分辨率改造），预训练数据取自 [[t5]] 的 C4 语料；显著超越 OCR-free 文档模型 [[donut]]。
- 与 [[nougat]]（PDF→Markdown）、[[got-ocr2]]、[[deepseek-ocr]] 同属「图像→结构化文本」生成式路线；评测覆盖图表/文档 QA，生态上与 [[omnidocbench]] 相关。
