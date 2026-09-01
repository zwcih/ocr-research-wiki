---
type: source
title: "LayoutLMv3: Pre-training for Document AI with Unified Text and Image Masking"
authors: [Huang, Lv, Cui, Lu, Wei]
year: 2022
arxiv: "2204.08387"
sources: [layoutlmv3]
tags: [ocr, document-understanding, layout, pretraining, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---
# LayoutLMv3 (2022) — 深度精读

📄 **原文**：[arXiv:2204.08387](https://arxiv.org/abs/2204.08387) · [PDF](https://arxiv.org/pdf/2204.08387)
> 里程碑 ⭐ — 用**统一的文本+图像掩码**预训练 Document AI，首次让图像模态也走「linear patch + 离散 token 重建」，架构极简却在文本中心与图像中心任务上双 SOTA。

## 一句话定位
一个多模态 Transformer 同时吃「文本 token + 版面 bbox + 图像 patch」，用三个统一目标（MLM 重建文字、MIM 重建图像 patch、WPA 对齐文字与 patch）预训练，成为文本中心（表单/收据/DocVQA）与图像中心（分类/版面分析）任务通用的预训练底座。

## 核心贡献
1. **图像模态统一为 linear patch + 离散 token 重建**：不再用 CNN/Faster R-CNN 抽区域特征（如 LayoutLMv2/DocFormer），而是学 [[vit]]/ViLT 直接切 raw patch 做线性嵌入——大幅降算力、去掉笨重视觉骨干。
2. **对称的 MLM + MIM 目标**：文字端掩码重建 word token，图像端**对称地**掩码重建离散 image token（用 dVAE 的 8192 词表，而非原始像素/区域特征），学到高层版面结构。
3. **Word-Patch Alignment (WPA)**：新提出的跨模态对齐目标——预测某个文字对应的图像 patch 是否被掩码，显式建立文字↔patch 对齐。

## 架构 / 方法细节
- 统一多模态 Transformer；图像 224×224、patch=16、共 M=196 个 patch；文本嵌入含 1D 位置 + 2D 版面框（segment-level bbox）。
- 三个预训练头：MLM Head / MIM Head / WPA Head，联合优化。
- 规格：BASE（约 133M）与 LARGE（约 368M）。

## 关键结果（真实数字）
- **FUNSD（表单理解, F1）：BASE 90.29 / LARGE 92.08**，显著超前作。
- **CORD（收据, F1）：约 96.56**（LARGE 96.99）。
- **RVL-CDIP（文档分类, Acc）：约 95.44 / LARGE 95.5+**。
- **DocVQA（ANLS）：约 83.37**（LARGE 更高）。
- **PubLayNet（版面分析, mAP）**同样 SOTA。
- 在这五大基准上以**更简单架构 + 更少参数**取得 SOTA。

## 为什么是里程碑
把 Document AI 预训练从「文字 BERT + 重型视觉区域特征」简化为「文字与图像都用统一掩码 + linear patch」，既省算力又提精度，成为 OCR-dependent 文档理解的强基线与工业默认；与 OCR-free 路线（[[donut]]）形成两条主线的代表。

## 关联
- 文本目标继承 [[bert]] 的 MLM，图像目标类 [[mae]]/BEiT 的掩码重建，patch 嵌入学 [[vit]]。
- 属 OCR-dependent 文档理解代表，与 OCR-free 的 [[donut]]、[[nougat]] 对比；后续统一多模态 OCR 大模型（[[got-ocr2]]、[[deepseek-ocr]]、[[monkeyocr-v2]]）在 [[omnidocbench]] 上延续版面/结构化评测。
