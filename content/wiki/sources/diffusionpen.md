---
type: source
title: "DiffusionPen: Towards Controlling the Style of Handwritten Text Generation"
authors: [Nikolaidou, Retsinas, Sfikas, Liwicki]
year: 2024
venue: ECCV 2024
arxiv: "2409.06065"
sources: [diffusionpen]
tags: [htg, handwriting, latent-diffusion, few-shot, style, htr, synthetic-data]
reading: shallow
created: 2026-07-23
updated: 2026-07-23
---

# DiffusionPen — 5-shot 风格手写生成

📄 **原文**：[arXiv:2409.06065](https://arxiv.org/abs/2409.06065) · [PDF](https://arxiv.org/pdf/2409.06065)

> ⭐ **已实证生成数据能提升 HTR 识别**（"造数据提识别"最直接证据）。

## 核心
- 5-shot、Latent Diffusion。**混合风格提取器**（metric learning + classification）
  同时抓可见/不可见单词与风格。
- multi-style mixtures + noisy embeddings 增多样性与鲁棒性。
- IAM 上验证生成数据提升 HTR。

## 关联
- 专题：[[handwriting-synthesis]]；未见风格：[[mae-ldm-htg]]
