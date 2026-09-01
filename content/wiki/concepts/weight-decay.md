---
type: concept
title: "Regularization 与 Weight Decay（正则化专题）"
sources: [vit]
tags: [regularization, weight-decay, training, foundation]
created: 2026-08-06
updated: 2026-08-06
---
# 正则化与 Weight Decay（正则化专题）

## 定义
**正则化（Regularization）** 指在训练中引入额外约束或惩罚，限制模型复杂度，以提升在未见数据上的泛化能力。核心是在经验风险之外附加对参数的偏好，使解倾向于"更简单"的形式。

## 为什么需要
深度模型参数量巨大，容易**过拟合（overfitting）**：训练集损失极低，测试集表现差——本质是记忆了噪声而非规律。正则化通过约束假设空间，缩小训练误差与泛化误差的差距，是控制方差、提升泛化的关键。

## L2 正则化（Weight Decay）
在损失中加入权重平方惩罚：

$$\tilde L(\theta) = L(\theta) + \frac{\lambda}{2} \cdot \|\theta\|_2^2$$

梯度为 $\nabla \tilde L = g + \lambda\theta$，故 SGD 更新为：

$$\theta \leftarrow \theta - \eta(g + \lambda\theta) = (1-\eta\lambda)\theta - \eta g$$

每步都将权重按 $(1-\eta\lambda)$ 收缩，故称 **weight decay（权重衰减）**。它使权重趋向 0，抑制单个特征的过度影响，等价于对参数施加高斯先验。

## L1 正则化与稀疏性
惩罚项改为绝对值 $\lambda\|\theta\|_1$，梯度贡献为 $\lambda \cdot \text{sign}(\theta)$。对每个权重施加恒定拉力，能将不重要权重精确压到 0，产生**稀疏解**，可用于特征选择。L2 只让权重变小，L1 才产生稀疏。

## L2 正则 vs Weight Decay：Adam 中的差异
SGD 里"L2 惩罚"与"权重衰减"等价，但在自适应优化器中**不再等价**。Adam 将 L2 梯度项 $\lambda\theta$ 一并除以二阶矩 $\sqrt{v}$，导致大梯度参数实际衰减更弱、正则强度被扭曲。**解耦权重衰减**将收缩独立于自适应缩放：

$$\theta \leftarrow \theta - \eta \cdot \frac{\hat m}{\sqrt{\hat v}+\epsilon} - \eta\lambda\theta$$

这正是 [[optimizer|AdamW]] 的动机，也是现代 Transformer 训练的默认做法。

## 其他正则手段一览
- **Data augmentation（数据增强）**：对输入随机变换，等价扩充数据分布，隐式约束。
- **Early stopping（早停）**：验证损失回升前停止，限制有效参数更新量。
- **Label smoothing（标签平滑）**：one-hot 目标软化为 $(1-\epsilon)$ 与均匀分布混合，抑制过度自信。
- **[[dropout]]**：随机置零激活，近似大量子网络集成。
- **[[normalization]]**：BatchNorm/LayerNorm 通过噪声与尺度约束带来**隐式正则**效果。

## 怎么选与实践
- **典型 $\lambda$**：CNN 常用 1e-4 ~ 1e-3；[[vit|ViT]] 等 Transformer 常用 0.01 ~ 0.1（配 AdamW）。
- 优先对权重施加衰减，**bias、LayerNorm/BatchNorm 参数通常不衰减**。
- 数据充足时增强 + 适度 weight decay 往往优于强 L2。
- 大模型以 AdamW 解耦衰减为基线，再叠加 dropout / label smoothing 微调。

## 关联
[[optimizer]] · [[dropout]] · [[normalization]] · [[vit]]
