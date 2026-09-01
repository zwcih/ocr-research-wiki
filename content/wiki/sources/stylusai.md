---
type: source
title: "StylusAI: Stylistic Adaptation for Robust German Handwritten Text Generation"
authors: [Riaz, Saifullah, Agne, Dengel, Ahmed (DFKI)]
year: 2024
venue: ICDAR 2024
arxiv: "2407.15608"
sources: [stylusai]
tags: [htg, handwriting, diffusion, cross-lingual, image-to-image, synthetic-data]
reading: shallow
created: 2026-07-23
updated: 2026-07-23
---

# StylusAI — 跨语言手写风格迁移（DFKI，ICDAR 2024）

📄 **原文**：[arXiv:2407.15608](https://arxiv.org/abs/2407.15608) · [PDF](https://arxiv.org/pdf/2407.15608)

> ⭐ 多语种（非英文）手写数据时参考。

## 核心
- 条件扩散（Transformer 文本编码 + U-Net 去噪），条件含文本 + 写手风格 **+ 合成打印体图像**。
- 当 **image-to-image** 处理增强风格适配；打印体图像即**内容锚点**保跨语言可读。
- 英↔德风格迁移，发布 37 种德语风格数据集 DHSD。

## 关联
- 专题：[[handwriting-synthesis]]
