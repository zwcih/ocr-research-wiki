---
type: concept
title: Scaled Dot-Product Attention（缩放点积注意力）
sources: [attention-is-all-you-need]
tags: [attention, transformer]
created: 2026-07-23
updated: 2026-08-04
---
# Scaled Dot-Product Attention（缩放点积注意力）

## 定义
Transformer 采用的具体注意力算子：

Attention(Q,K,V) = softmax(QKᵀ / √dₖ) · V

其中 Q∈ℝ^{n×dₖ}（query）、K∈ℝ^{m×dₖ}（key）、V∈ℝ^{m×dᵥ}（value），dₖ 是 key/query 的维度。

## 逐步拆解
1. **打分 QKᵀ**：每个 query 与每个 key 做点积，衡量相关性，得到 n×m 的分数矩阵。点积越大表示越相关。
2. **缩放 /√dₖ**：把分数除以 √dₖ。
3. **softmax**：对每一行（每个 query 对所有 key）归一化成概率分布，即注意力权重。
4. **加权求和 ·V**：用权重对 value 加权平均，得到每个 query 的输出。

## 为什么要除以 √dₖ（关键设计）
当 dₖ 较大时，Q、K 各分量若近似独立、均值 0 方差 1，则点积 q·k = Σᵢ qᵢkᵢ 的方差约为 dₖ，量级随维度增大而变大。过大的分数进入 softmax 会把分布推向极端（接近 one-hot），此时 softmax 的梯度极小（饱和），训练困难。除以 √dₖ 把点积方差重新归到约 1，使 softmax 处于梯度良好的区间。这是「scaled」的由来，也是它比原始 dot-product attention 更稳定的原因。

## 为什么用点积而非加性注意力
加性注意力（Bahdanau，用一个小 MLP 打分）在小 dₖ 下效果相近，但点积可直接用高度优化的矩阵乘法（GEMM）实现，速度和显存效率高得多。加了 √dₖ 缩放后，点积注意力在大 dₖ 下也能匹敌加性注意力的效果，遂成主流。

## 掩码
在打分后、softmax 前可加掩码：把不该关注的位置分数设为 −∞（softmax 后权重→0）。用途：解码器的因果掩码（遮未来）、padding 掩码（遮补齐位）。

## 地位
是 [[self-attention]] 与 [[multi-head-attention]] 的底层算子，源自 [[attention-is-all-you-need]]。FlashAttention 等工程实现在不改变此数学定义的前提下大幅优化其显存与速度。
