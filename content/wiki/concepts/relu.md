---
type: concept
title: ReLU（修正线性单元）
sources: [alexnet]
tags: [activation, cnn, training]
created: 2026-08-04
updated: 2026-08-04
---
# ReLU（Rectified Linear Unit / 修正线性单元）

## 定义
ReLU 是一个逐元素非线性激活函数：

f(x) = max(0, x) = x·𝟙[x>0]

即负输入截断为 0，正输入原样通过。其导数极简：x>0 时为 1，x<0 时为 0（x=0 处不可导，实现中通常约定取 0 或 1）。

## 为什么有效
1. **缓解梯度消失**：sigmoid/tanh 在两端饱和，导数趋近 0，深层网络反向传播时梯度连乘迅速衰减。ReLU 在正区间导数恒为 1，梯度可无损穿过任意多层，是训练深层网络的关键。
2. **收敛快**：[[alexnet|AlexNet]] 论文实测在 CIFAR-10 上 ReLU 达到 25% 训练误差比等价的 tanh 网络快约 6 倍，正是这个加速使大规模深度 CNN 训练变得可行。
3. **计算极廉**：只需一次比较/取最大，无指数运算，前向和反向都比 sigmoid/tanh 快得多。
4. **稀疏激活**：负输入被置 0，使隐层表示天然稀疏（部分神经元不激活），被认为有助于表示解耦与泛化。

## 缺点：神经元死亡（Dying ReLU）
若某神经元的加权和长期落在负区，其梯度恒为 0，权重再也得不到更新，该神经元永久「死亡」。过大的学习率或不当初始化会加剧此问题。缓解手段包括较小学习率、合适初始化（如 He 初始化，专为 ReLU 设计）、以及使用下述变体。

## 主要变体
- **LeakyReLU**：负区给一个小斜率 α（如 0.01），f(x)=max(αx, x)，让负区仍有梯度，避免死亡。
- **PReLU**：把 α 变成可学习参数。
- **ELU / SELU**：负区用指数曲线，输出均值更接近 0，有自归一化性质。
- **GELU / Swish**：平滑近似版，在 Transformer 时代成为主流（见 [[gelu]]）。

## 在架构中的地位
由 [[alexnet|AlexNet]]（2012）推广后成为深度 CNN 的默认激活，[[vgg|VGG]]、[[resnet-deep-residual-learning|ResNet]] 等经典网络的卷积层后普遍接 ReLU。[[attention-is-all-you-need|Transformer]] 原始 FFN 也用 ReLU，但后续 BERT/GPT 等多改用更平滑的 [[gelu|GELU]]。
