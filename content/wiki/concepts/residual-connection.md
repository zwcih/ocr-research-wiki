---
type: concept
title: Residual Connection（残差/跳跃连接）
sources: [resnet-deep-residual-learning]
tags: [resnet, cnn, architecture]
created: 2026-07-23
updated: 2026-08-04
---
# Residual Connection（残差连接 / Skip Connection）

## 定义
不让一个网络块直接输出目标映射 H(x)，而是让它学习**残差** F(x)=H(x)−x，最终输出 F(x)+x。即在块的输入与输出间加一条恒等「跳跃连接」（shortcut），把输入直接加到块的输出上。

## 解决的问题：退化（degradation）
[[resnet-deep-residual-learning|ResNet]] 观察到：单纯堆更多层，训练误差反而**上升**——这不是过拟合（训练误差就高），也不是梯度消失（有 BN 时梯度尚可），而是深层「恒等映射都学不好」的优化难题。若新增层最优解就是恒等，普通网络却难以让一堆非线性层逼近恒等。

## 为什么有效
1. **恒等易得**：残差结构下，要实现恒等映射只需让 F(x)→0（把权重压到 0），远比让一堆非线性层拟合出恒等容易。于是「加层至少不会变差」有了保证，深网络可训。
2. **梯度高速公路**：反向传播时，∂(F(x)+x)/∂x = ∂F/∂x + 1，那个「+1」使梯度可绕过块无损直达浅层，缓解梯度消失，让上百层甚至上千层网络可训练（ResNet-152、ResNet-1001）。
3. **损失曲面更平滑**：后续研究（Li et al. 2018）可视化显示 skip connection 显著平滑损失地形，利于优化。

## 结构细节
- shortcut 通常是恒等（无参数），维度不匹配时用 1×1 卷积或线性投影对齐（ResNet 的 projection shortcut）。
- 一个残差块内一般是 2–3 层卷积 + BN + ReLU；Pre-activation 版（BN-ReLU-Conv 顺序）梯度传导更顺。

## 广泛影响
残差连接已成现代深度网络的通用基建：[[attention-is-all-you-need|Transformer]] 每个子层都是 x + Sublayer(x) 并配 LayerNorm；[[vit|ViT]]、U-Net（[[unet]]，跳连接拼接特征）、DenseNet（密集连接）等都源于同一思想。可以说没有残差连接就没有当今的深层网络。
