---
type: concept
title: Self-Attention（自注意力）
sources: [attention-is-all-you-need]
tags: [attention, transformer]
created: 2026-07-23
updated: 2026-08-05
---
# Self-Attention（自注意力）

## 定义
自注意力让一个序列中每个位置直接「关注」同一序列里所有位置（包括自身），用其他位置的信息加权聚合来更新自己的表示。区别于 encoder-decoder attention（Q 来自一个序列、K/V 来自另一个，见 [[cross-attention]]），自注意力的 Q、K、V 都由同一输入序列线性投影得到。

## 计算流程
输入序列 X∈ℝ^{n×d}，用三个可学习矩阵投影：
- Query：Q = XW_Q
- Key：K = XW_K
- Value：V = XW_V

然后 Attention(Q,K,V)=softmax(QKᵀ/√dₖ)·V（见 [[scaled-dot-product-attention]]）。QKᵀ 得到 n×n 的相似度矩阵，softmax 归一化成注意力权重，再对 V 加权求和。实践中并行运行多组（见 [[multi-head-attention]]）。

## 三大优势（相对 RNN/CNN）
1. **路径长度 O(1)**：任意两个位置间的信息传递只需一步（一次注意力），而 RNN 需 O(n) 步、CNN 需 O(log n) 或 O(n/k) 层。因此长距离依赖更易学习——这是 Transformer 建模长程关系的核心。
2. **完全可并行**：不像 RNN 必须按时间步串行，自注意力对整个序列一次矩阵运算完成，充分利用 GPU，训练大幅提速。
3. **可解释性**：注意力权重矩阵可视化，能看到模型在关注哪些位置。

## 代价与缓解
- **O(n²) 复杂度**：相似度矩阵是 n×n，序列越长显存/算力平方增长，长文档/高分辨率图是瓶颈。缓解方向包括稀疏注意力（Longformer/BigBird）、线性注意力、滑窗（如 [[unlimited-ocr]] 的 R-SWA）、FlashAttention（不降复杂度但降显存与 IO）。
- **无位置信息**：注意力本身对输入顺序置换等变（permutation-equivariant），需额外注入位置编码（正弦/可学习/RoPE 等）才能感知顺序。

## 变体
- **Masked（causal）self-attention**：解码器中用下三角掩码遮住未来位置，保证自回归生成时第 i 位只看得到 ≤i 的位置。
- **Cross-attention（交叉注意力）**：Q 来自一个序列、K/V 来自另一个序列，用于 seq2seq 融合与多模态。详见独立页 [[cross-attention]]。

## 地位
由 [[attention-is-all-you-need|Attention Is All You Need]]（2017）确立为 Transformer 的核心机制，取代 RNN/CNN 成为 NLP、CV（[[vit|ViT]]）、多模态、OCR 的通用骨架。相关：[[cross-attention]]、[[multi-head-attention]]、[[scaled-dot-product-attention]]、[[residual-connection]]。
