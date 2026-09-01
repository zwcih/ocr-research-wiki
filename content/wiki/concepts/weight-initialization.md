---
type: concept
title: "Weight Initialization 参数初始化专题（Xavier / He）"
sources: [vit, resnet-deep-residual-learning]
tags: [initialization, training, foundation]
created: 2026-08-06
updated: 2026-08-06
---
# 参数初始化专题（Weight Initialization）

参数初始化决定训练能否顺利开始。深层网络第一次前向/反向传播的数值行为几乎完全由初始权重分布决定；初始化不当会让网络在第一步就陷入无法学习的状态。

## 为什么初始化至关重要
**对称性必须被打破。** 若所有权重初始化为同一常数（尤其全 0），同层所有神经元接收相同输入、产生相同输出、获得相同梯度，整个训练保持一致，网络有效容量退化为单个神经元——**对称性无法打破**。故初始权重必须带随机性。

**方差必须被控制。** 若每层权重过大，激活与梯度在层间反复放大 → **梯度爆炸**（溢出、loss 变 NaN）；过小则反复衰减 → **梯度消失**（深层收不到有效梯度）。理想目标：每层激活方差与梯度方差在前向、反向中都大致稳定，不随深度指数增减。

## 梯度消失与爆炸
线性层 $y=Wx$，输入维 $n_{in}$。权重 iid、均值 0、方差 $\sigma^2$，则 $\mathrm{Var}(y) \approx n_{in}\cdot\sigma^2\cdot\mathrm{Var}(x)$。要 $\mathrm{Var}(y)=\mathrm{Var}(x)$，需 $\sigma^2 = 1/n_{in}$。**固定小高斯（如 $\mathcal{N}(0,0.01)$）忽略了 $n_{in}$**，在宽层/深层会使激活逐层坍缩至 0，是早期深网难训的重要原因。

## Xavier / Glorot 初始化
针对 tanh、sigmoid 等在 0 附近近似线性的对称激活，兼顾前向（$n_{in}$）与反向（$n_{out}$）的折中：

$$\mathrm{Var}(W) = \frac{2}{n_{in}+n_{out}}$$

均匀形式 $W \sim U[-\sqrt{6/(n_{in}+n_{out})},\ \sqrt{6/(n_{in}+n_{out})}]$。使激活与梯度方差在深层间近似守恒，是对称激活的默认选择。

## He / Kaiming 初始化
对 [[relu|ReLU]]，负半轴置零，期望上损失一半方差，Xavier 偏小。He 据此加补偿因子 2：

$$\mathrm{Var}(W) = \frac{2}{n_{in}}$$

即 $W \sim \mathcal{N}(0, 2/n_{in})$

使极深 ReLU 网络（如 ResNet）稳定收敛，是所有 ReLU 系激活的标准初始化。

## 其他方法
**正交初始化（Orthogonal）** 将权重初始化为正交矩阵（奇异值为 1），保持信号范数，对 RNN 等需长程传播的结构尤为有益。

## Transformer 与大模型的特殊做法
深层 [[vit|ViT]] 与 GPT 系对初始化更敏感：
- **[[normalization|LayerNorm]] 降敏感度**：每层重新标准化激活，使网络对权重尺度不再高度依赖。
- **[[residual-connection|残差]]分支缩放**：残差累加使方差随深度线性增长，常将残差分支按 $1/\sqrt{2N}$（$N$ 层数）缩放，或如 GPT-2 将投影层权重按 $1/\sqrt{N}$ 缩小。
- **小尺度基线**：大模型普遍用 $\mathcal{N}(0,0.02)$ 一类较小标准差起步，再叠加按层数缩放。

## 实践总纲
- ReLU / GELU 系：优先 **He/Kaiming**。
- tanh / sigmoid：**Xavier/Glorot**。
- RNN 循环权重：考虑**正交初始化**。
- Transformer / 大模型：小高斯基线 + 残差分支按层数缩放 + LayerNorm。

一句话原则：**让每层的激活方差与梯度方差在深度方向上保持稳定。**

## 关联
[[relu]] · [[normalization]] · [[residual-connection]] · [[vit]]
