---
type: concept
title: "AdamW（解耦权重衰减的 Adam）"
sources: [vit]
tags: [optimizer, weight-decay, training]
created: 2026-08-06
updated: 2026-08-06
---
# AdamW

Adam 的权重衰减修正版：把 **weight decay 从自适应梯度更新中解耦**，直接作用在参数上，避免原始 Adam 里 L2 正则被二阶矩 √v 扭曲。是现代 Transformer/大模型（[[vit|ViT]]、BERT、GPT 系）训练的事实标准，常配 warmup + cosine（见 [[lr-schedule]]）。

$$\theta \leftarrow \theta - \eta\cdot\frac{\hat m}{\sqrt{\hat v}+\epsilon} - \eta\lambda\theta$$

详见 [[optimizer]] 专题的 Adam/AdamW 段。

## 关联
[[optimizer]] · [[weight-decay]] · [[lr-schedule]] · [[vit]]
