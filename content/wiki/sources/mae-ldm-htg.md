---
type: source
title: "Semi-Supervised Adaptation of Diffusion Models for HTG (MAE style condition)"
authors: [Brandenbusch (TU Dortmund)]
year: 2024
arxiv: "2412.15853"
sources: [mae-ldm-htg]
tags: [htg, handwriting, diffusion, mae, semi-supervised, unseen-style, synthetic-data]
reading: shallow
created: 2026-07-23
updated: 2026-07-23
---

# MAE-LDM HTG — 半监督适配 + 未见风格生成（TU Dortmund，2024）

📄 **原文**：[arXiv:2412.15853](https://arxiv.org/abs/2412.15853) · [PDF](https://arxiv.org/pdf/2412.15853)

> ⭐ 核心卖点就是"为下游模型造训练图"；要把 OCR 迁到无标注新数据集时最对口。

## 核心
- **masked autoencoder 学风格条件** → 生成训练时**未见过**的书写风格。
- 专门 content encoder + classifier-free guidance 调质量。
- **半监督**训练方案：IAM 训练、RIMES 验证对未见数据集的适配提升。

## 关联
- 专题：[[handwriting-synthesis]]；半监督/自改进同道：[[points-reader]]
