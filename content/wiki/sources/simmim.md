---
type: source
title: "SimMIM: A Simple Framework for Masked Image Modeling"
authors: [Xie, Zhang, Cao, Lin, Bao, Yao, Dai, Hu]
year: 2021
arxiv: "2111.09886"
sources: [simmim]
tags: [self-supervised, mim, masked-image-modeling, vit, pretraining]
created: 2026-07-29
updated: 2026-07-29
---

# SimMIM (2021) — 最简 MIM：直接回归像素就够

📄 [arXiv:2111.09886](https://arxiv.org/abs/2111.09886) · MSRA（Han Hu 等）

## 一句话
把 MIM 剥到最简：**不要** block-wise 掩码、**不要** dVAE/聚类 tokenizer，就随机遮 patch + **直接 ℓ1 回归被遮位置的 RGB 原始像素** + **一层线性 head**，照样学到强表示。

## 三个关键发现（消融得出）
1. **随机掩码 + 适中偏大的 patch size（如 32）** 就是强 pretext；掩码块要够大，逼模型做语义推理而非复制邻近像素。
2. **直接回归原始 RGB 像素**（ℓ1）不比 [[beit]] 那种复杂的 patch-classification 差。
3. **prediction head 可轻到一层线性层**，不比重的差。

## 结果
- ViT-B 在 ImageNet-1K 上自预训练 → 微调 83.8% top-1（超前最好 +0.6%）。
- SwinV2-H（650M）仅用 IN-1K 达 87.1%；帮 3B 的 SwinV2-G 用 **40× 更少标注** 达 SOTA。

## 对 OCR 系统 recognizer encoder 的价值
- **MIM 分支首选做法**：SimMIM 证明"随机掩码 + 像素回归 + 轻 head"这套极简配方最省事又有效，比 BEiT 的 tokenizer 路线工程负担小。
- [[dig]]（文本识别自监督）的 MIM 分支正是这个思路（patch-aligned 随机掩码 + 像素重建）。
- 目标系统的 MIM+denoising+SeqCLR 组合里，MIM 部分按 SimMIM 配方起步最稳；掩码率/patch size 是主要调参点。
- 与 [[mae]] 区别：MAE 编码器只吃可见 patch（省算力）、掩码率 75%；SimMIM 编码全图（含掩码 token）、掩码率略低但实现更直白。
