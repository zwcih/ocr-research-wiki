---
type: source
title: "BEiT: BERT Pre-Training of Image Transformers"
authors: [Bao, Dong, Piao, Wei]
year: 2021
arxiv: "2106.08254"
sources: [beit]
tags: [self-supervised, mim, masked-image-modeling, vit, pretraining]
created: 2026-07-29
updated: 2026-07-29
---

# BEiT (2021) — 图像版 BERT，MIM 的开山之一

📄 [arXiv:2106.08254](https://arxiv.org/abs/2106.08254) · MSRA + HIT（[[furu-wei]]/Li Dong）

## 一句话
把 BERT 的 masked language modeling 搬到视觉：**masked image modeling (MIM)**。随机遮住部分 image patch，让 ViT 编码器**恢复被遮 patch 的"visual token"**（不是原始像素）。

## 核心设计
- **两种视图**：image patch（16×16）+ visual token（离散 token）。先用一个 **dVAE tokenizer** 把图 tokenize 成离散视觉 token 作为预测目标。
- **预训练目标**：遮住部分 patch → ViT 编码 corrupted 图 → 预测被遮位置的 visual token（分类任务，非像素回归）。
- **为什么不直接回归像素**：作者认为 pixel-level 恢复会把建模力浪费在短程依赖和高频细节上 → 用离散 token 逼模型学语义。（[[mae]]/[[simmim]] 后来证明直接回归像素也行，见下）
- 预训练后丢弃 MIM head，编码器接下游任务微调。

## 意义 / 与其它 MIM 的关系
- **MIM 路线的奠基工作之一**（与 [[mae]]、[[simmim]] 并列），把"denoising auto-encoding"思想（源头 [[dae]]）正式引入 ViT 预训练。
- BEiT = 离散 token 目标 + tokenizer；[[mae]] = 非对称编解码 + 高掩码率像素回归；[[simmim]] = 极简像素回归、无需 tokenizer。三者是 MIM 的三种主要做法。
- 对 OCR 系统 recognizer encoder 的 MIM 分支：BEiT 的"预测离散目标"思路可选，但工程上 SimMIM 式直接像素回归更简单，DiG 也是走像素级 MIM（见 [[dig]]）。
