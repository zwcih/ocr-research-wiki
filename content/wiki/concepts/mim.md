---
type: concept
title: Masked Image Modeling (MIM) — 掩码图像建模
sources: [beit, simmim, mae, dig]
tags: [self-supervised, mim, denoising, pretraining]
created: 2026-07-29
updated: 2026-07-29
---

# Masked Image Modeling (MIM)

视觉自监督主流范式：遮住部分 image patch，让编码器**重建被遮内容**，从而学到语义表示。本质是 masking 式的 denoising（源头 [[dae]]），视觉版的 BERT MLM。

## 三种代表做法

| 方法 | 预测目标 | 掩码 | 编码器 | 特点 |
|---|---|---|---|---|
| [[beit]] | 离散 visual token（dVAE） | block-wise | 全图 | 需 tokenizer |
| [[simmim]] | 原始 RGB 像素（ℓ1） | 随机、大 patch(32) | 全图 | 极简、一层 head |
| [[mae]] | 原始像素 | 随机 75% 高掩码 | 仅可见 patch（非对称） | 省算力 |

结论趋同：**直接回归像素 + 随机掩码 + 轻 head** 就够（SimMIM/MAE），不必 tokenizer。

## 与 denoising / contrastive 的关系
- MIM ⊂ denoising：masking 是一种结构化 corruption（[[dae]]）。denoising 更一般（噪声/模糊等）。
- MIM 学**生成/上下文**，contrastive（[[seqclr]]/[[contrastive-learning]]）学**判别**，互补 → [[dig]] 在文本识别里把两者合流。

## 用于文本识别 encoder
[[dig]] 首次把 MIM 用于文本识别（patch 4×4、掩码率 0.6、像素重建），与对比分支共享 ViG encoder。见 [[label-efficient-ocr]]。
