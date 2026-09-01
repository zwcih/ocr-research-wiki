---
type: concept
title: Multi-Head Attention（多头注意力）
sources: [attention-is-all-you-need]
tags: [attention, transformer]
created: 2026-07-23
updated: 2026-08-04
---
# Multi-Head Attention（多头注意力）

## 定义
不做单一的高维注意力，而是把 Q、K、V 分别线性投影到 h 组低维子空间，在每组里独立并行做一次 [[scaled-dot-product-attention]]（一个「头」），再把 h 个头的输出拼接、经一个输出投影融合：

MultiHead(Q,K,V) = Concat(head₁,…,head_h)·W_O
head_i = Attention(QW_Qⁱ, KW_Kⁱ, VW_Vⁱ)

## 为什么要多头
1. **多子空间捕捉多种关系**：单头注意力的加权平均会把不同类型的关联「糊」在一起。多头让每个头在不同的表示子空间里学习不同的关注模式——有的头看语法邻接、有的看指代、有的看长程语义。
2. **表达力提升而算力不增**：原论文令每头维度 dₖ=dᵥ=d_model/h，把维度切分到各头，因此 h 个头的总计算量与一个全维单头相当，几乎「免费」获得多视角能力。
3. **稳定性**：多个头的集成降低了单一注意力分布的方差。

## 原论文超参
d_model=512，h=8 头，每头 dₖ=dᵥ=64。

## Transformer 里的三处用法
- **编码器自注意力**：Q/K/V 均来自上一层编码器输出。
- **解码器掩码自注意力**：加因果掩码防看未来。
- **编码器-解码器交叉注意力**：Q 来自解码器，K/V 来自编码器输出。

## 后续演化
- **MQA（Multi-Query Attention）/ GQA（Grouped-Query Attention）**：多个 query 头共享一组或少数几组 K/V 头，大幅减小推理时 KV cache 显存，被 LLaMA-2/3 等大模型采用。
- 各头可视化研究发现存在冗余头，可剪枝。

## 地位
[[self-attention]] 与整个 Transformer（[[attention-is-all-you-need]]）的标准配置，也是 [[vit|ViT]] 等视觉/多模态模型的核心模块。
