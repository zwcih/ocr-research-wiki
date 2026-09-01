---
type: source
title: "VATr: Handwritten Text Generation from Visual Archetypes"
authors: [Pippi, Cascianelli, Cucchiara (Univ. Modena)]
year: 2023
venue: CVPR 2023
arxiv: "2303.15269"
sources: [vatr]
tags: [htg, handwriting, transformer, few-shot, visual-archetype, rare-characters, milestone]
reading: shallow
created: 2026-07-23
updated: 2026-07-23
---

# VATr — 从视觉原型生成手写（Modena，CVPR 2023）

📄 **原文**：[arXiv:2303.15269](https://arxiv.org/abs/2303.15269) · [PDF](https://arxiv.org/pdf/2303.15269)

> ⭐ 扩散时代前的经典基线；**visual-archetype 内容编码**这招造罕见字仍可借。

## 核心
- Transformer few-shot 风格 HTG，大规模合成数据预训练获未见写手稳健风格。
- **把文本内容表示成 GNU Unifont 字形图像序列（visual archetypes）** 而非 one-hot →
  **罕见字符**能借与常见字符的视觉相似性被更好生成。

## 关联
- 专题：[[handwriting-synthesis]]；扩散后作对比基线：[[one-dm]]/[[diffusionpen]]
