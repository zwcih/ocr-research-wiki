---
type: source
title: "One-DM: One-Shot Diffusion Mimicker for Handwritten Text Generation"
authors: [Dai, Zhang, Ke, Guo, Huang (SCUT / NUS / Skywork)]
year: 2024
venue: ECCV 2024
arxiv: "2409.04004"
sources: [one-dm]
tags: [htg, handwriting, diffusion, one-shot, style, synthetic-data]
reading: shallow
created: 2026-07-23
updated: 2026-07-23
---

# One-DM — 单样本手写风格模仿（SCUT，ECCV 2024）

📄 **原文**：[arXiv:2409.04004](https://arxiv.org/abs/2409.04004) · [PDF](https://arxiv.org/pdf/2409.04004)

> ⭐ 门槛最低：**单个**参考样本就能模仿任意书写风格。

## 核心
- **style-enhanced module**：从单样本抽**高频信息**（字符倾斜、连笔等风格线索），
  在稀疏前景+噪声背景下稳健抽风格。
- 风格特征 + 文本内容融合成 merged condition 引导扩散。
- 单样本超过旧法用 10+ 样本；支持多语言。

## 对 OCR 合成数据的启示
一张样本即可为新写手/新语言铺风格多样性，快速铺量。

## 关联
- 专题：[[handwriting-synthesis]]；行级后作：[[diffbrush]]
