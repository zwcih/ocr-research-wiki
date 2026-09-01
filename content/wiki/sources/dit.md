---
type: source
title: "DiT: Self-supervised Pre-training for Document Image Transformer"
authors: [Li, Lv, Cui, et al.]
year: 2022
arxiv: "2203.02378"
sources: [dit]
tags: [ocr, document-ai, self-supervised, pretraining, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---
# DiT (2022) — 深度精读

📄 **原文**：[arXiv:2203.02378](https://arxiv.org/abs/2203.02378) · [PDF](https://arxiv.org/pdf/2203.02378)
> 里程碑 ⭐ — 首个**纯自监督、无需任何人工标注文档**的文档图像 Transformer 骨干，用文档专属 dVAE + BEiT 式 MIM 预训练，成为一系列纯视觉 Document AI 任务的通用 backbone。

## 一句话定位
借鉴 [[mae]]/BEiT 的 Masked Image Modeling，但把视觉 token 换成**在大规模文档图像上重训的 dVAE**，只用 4200 万张无标注文档图（IIT-CDIP）预训练一个 ViT，就在文档分类、版面分析、表格检测、OCR 文本检测四类纯视觉任务上全面刷 SOTA。

## 核心贡献
1. **文档域自监督骨干**：不依赖任何人工标注文档图像（文档 AI 没有 ImageNet 那样的标注大集），纯用无标注数据学到文档内部的全局 patch 关系。
2. **文档专属 dVAE**：BEiT 用的是自然图像 dVAE，DiT 在**大规模文档图像上重训 dVAE**，让离散视觉 token 更贴合文档结构，再用 MIM 恢复被掩码 patch 的视觉 token。
3. **一个骨干打通四类纯视觉 Document AI 任务**，无需 task-specific 视觉设计。

## 架构 / 方法细节
- 输入文档图 resize 到 224×224，切 16×16 patch → 线性嵌入喂 ViT。
- 预训练：随机掩码部分 patch，让模型预测被掩 patch 对应的 dVAE 视觉 token（MIM Head），交叉熵损失；不依赖标注。
- 预训练数据：**IIT-CDIP** 拆单页后共 **4200 万张**无标注文档图像。
- 下游：分类接线性头；检测/版面用 DiT 作 Mask R-CNN/Cascade 骨干。

## 关键结果（真实数字，新 SOTA）
- **文档图像分类 RVL-CDIP：91.11 → 92.69**
- **文档版面分析 PubLayNet (mAP)：91.0 → 94.9**
- **表格检测 ICDAR 2019 cTDaR (F1)：94.23 → 96.55**
- **OCR 文本检测 (FUNSD 等)：93.07 → 94.29**
- 在相似参数量下超过监督预训练与 CNN 骨干。

## 为什么是里程碑
证明「文档域自监督预训练」比在自然图像上预训练更适配 Document AI，且**完全不用标注**即可拿全面 SOTA；DiT 成为纯视觉文档任务（版面/表格/检测）的标准骨干，与文本+版面多模态的 [[layoutlmv3]] 互补，共同支撑现代文档理解流水线。

## 关联
- 自监督策略源自 [[mae]]/BEiT，骨干为 [[vit]]；与多模态文档模型 [[layoutlmv3]] 是同团队互补工作（一个纯视觉骨干、一个文本+图像多模态）。
- 为版面分析/表格检测提供骨干，服务于下游 OCR 与文档解析（[[craft]]、[[got-ocr2]]、[[deepseek-ocr]]），评测生态与 [[omnidocbench]] 相关。
