---
type: concept
title: Instance-Mapping（序列对比的实例映射）
sources: [seqclr]
tags: [ocr, contrastive-learning, self-supervised, sequence]
created: 2026-07-29
updated: 2026-07-29
---

# Instance-Mapping — 把序列特征图切成对比学习的原子实例

[[seqclr]] 提出的核心机制，解决"如何在变长序列特征图上做对比学习"。

## 问题

标准对比学习（SimCLR/MoCo）把每张图的特征图 flatten 成**单个向量**当作一个 instance（= 一个类）。文本识别里：
1. 特征图尺寸随图宽变化，flatten 处理不了变长；
2. 更本质地，特征图有**序列结构**，不代表单一类别（一行字含多个字符）。

## 做法

把序列特征图的 T 个 frame，通过映射函数 m(·) 变成 T' 个 **instance**，instance 才是对比 loss 的原子单位。三种（论文 Fig.5）：

| 映射 | m(·) | instance 数 | 特点 |
|---|---|---|---|
| All-to-instance | Avg（全帧平均） | N（每图 1 个） | 对序列错位最鲁棒（适合任意形状场景文字）；负例最少 |
| Window-to-instance | adaptive avg pooling（定长 T'） | N·T' | 折中，**综合最优** |
| Frame-to-instance | identity（逐帧） | Σ Tᵢ | 负例最多、样本效率高；对错位最敏感 |

## 为什么重要

- **无需 memory bank 或改架构**就能扩大每 batch 的负例数——一张图按宽度可产生任意多 instance，从每张图里就抽出多个正对 + 多个负例（sub-word 级对比）。
- 权衡本质：**错位鲁棒性 vs 样本效率**。平均越多越抗错位但负例越少。
- 配套需要 sequence-level alignment 的增广（避免翻转/水平裁剪）+ 能处理变长的 projection head（逐帧 MLP / BiLSTM）。

## 迁移价值

任何"变长序列 + 自监督/对齐"的场景都可借鉴这个"把序列切成可控数量原子单位再对比/对齐"的抽象，对目标系统的前端 DETR + 后端 AR 编码器预训练有参考意义。
