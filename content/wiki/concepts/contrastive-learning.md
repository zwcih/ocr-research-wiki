---
type: concept
title: Contrastive Learning（对比学习 / 自监督表示学习）
sources: [seqclr]
tags: [self-supervised, representation-learning, contrastive-learning]
created: 2026-07-29
updated: 2026-07-29
---

# Contrastive Learning — 对比学习

自监督表示学习的主流范式：**最大化同一数据不同增广视图表示间的一致性**，同时把来自其它数据的表示推远。可视为"每张图自成一类"的分类任务。

## 关键脉络（本 wiki 涉及）

- **SimCLR**：增广 pipeline + projection head，把表示映到算 loss 的空间，整图级 InfoNCE。
- **MoCo**：momentum 编码器 + 队列/memory bank 扩大负例。
- **BYOL/DINO**：teacher-student 蒸馏，可不用负例。
- 损失通常是 **InfoNCE / NCE**，cosine 相似度 + 温度 τ。

## 用于文本识别的扩展

标准对比学习把图像当**原子输入**（整图一向量），不适合序列结构的文本。[[seqclr]] 通过 [[instance-mapping]] 把它扩展到 sequence-to-sequence，是首个用于文本识别的自监督对比方法。

（stub，可随后续论文扩充）
