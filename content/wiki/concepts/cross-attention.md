---
type: concept
title: Cross-Attention（交叉注意力）
sources: [attention-is-all-you-need]
tags: [attention, transformer, seq2seq, multimodal]
created: 2026-08-05
updated: 2026-08-05
---
# Cross-Attention（交叉注意力）

## 定义
交叉注意力（cross-attention，又称 encoder-decoder attention）让**一个序列去关注另一个序列**：Query 来自序列 A，Key/Value 来自序列 B。它是两个不同来源信息的融合桥梁。这与 [[self-attention]]（Q、K、V 全来自同一序列）形成对照——唯一区别就在于 K/V 的来源不同。

## 计算流程
设目标序列（如解码器当前状态）为 X_A∈ℝ^{m×d}，来源序列（如编码器输出）为 X_B∈ℝ^{n×d}：
- Query：Q = X_A W_Q      （来自 A，m 个）
- Key：  K = X_B W_K      （来自 B，n 个）
- Value：V = X_B W_V      （来自 B，n 个）

然后 Attention(Q,K,V)=softmax(QKᵀ/√dₖ)·V（见 [[scaled-dot-product-attention]]）。相似度矩阵是 **m×n**（不是自注意力的 n×n）：A 的每个位置对 B 的所有位置算权重，再从 B 的 Value 里加权取信息。输出长度跟着 Query（即 A）走，是 m。同样并行多头（见 [[multi-head-attention]]）。

## 直观理解
翻译时，解码器要生成第 t 个中文词，它「回头看」整句英文（编码器输出），决定此刻该重点参考英文里的哪几个词——这个「回头看别人」的动作就是交叉注意力。Self-attention 是「看自己人」，cross-attention 是「看外部序列」。

## 典型用途
1. **Seq2seq / 机器翻译**：原始 Transformer 解码器每层都有一个 cross-attention 子层，Q 来自解码器、K/V 来自编码器输出，把源语言信息注入目标语言生成。
2. **多模态融合**：文本 Query 关注图像特征 K/V（或反之），是图文对齐的常用手段（如图像描述、VQA、[[trocr]]/[[donut]] 等 OCR 的解码器读图）。
3. **OCR 后端 AR 解码**：自回归文本解码器通过 cross-attention 读取前端视觉编码器的图像特征，逐 token 生成结构化结果——**与OCR 检测与生成架构研究直接相关**（前端 DETR 检测 + 后端 AR 生成，AR 端靠 cross-attention 吃视觉特征）。
4. **DETR 系检测**：object query 通过 cross-attention 关注 CNN/backbone 提取的图像特征，query-based、去 anchor/NMS——**也正是OCR 文档检测中的核心机制**。
5. **条件生成 / 扩散模型**：Stable Diffusion 的 U-Net 用 cross-attention 让图像潜变量关注文本 prompt 的 embedding，实现「文字控制画什么」。

## 与 self-attention 对比
| | Self-Attention | Cross-Attention |
|---|---|---|
| Q 来源 | 同一序列 | 序列 A（目标） |
| K/V 来源 | 同一序列 | 序列 B（来源） |
| 相似度矩阵 | n×n | m×n |
| 作用 | 序列内部建模关系 | 两序列间信息融合 |
| 位置 | 编/解码器都有 | 解码器 / 融合层 |

## 地位
与 [[self-attention]] 一起由 [[attention-is-all-you-need|Attention Is All You Need]]（2017）确立。自注意力管「序列内」，交叉注意力管「序列间」，二者组合撑起了几乎所有 seq2seq、多模态、条件生成架构。相关：[[self-attention]]、[[multi-head-attention]]、[[scaled-dot-product-attention]]。
