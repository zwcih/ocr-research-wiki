---
type: source
title: "Deep Residual Learning for Image Recognition (ResNet)"
authors: [He, Zhang, Ren, Sun]
year: 2015
venue: CVPR 2016
arxiv: "1512.03385"
sources: [resnet-deep-residual-learning]
tags: [resnet, cnn, cv, foundation, milestone]
created: 2026-07-23
updated: 2026-07-23
---

# Deep Residual Learning for Image Recognition (ResNet, 2015)

📄 **原文**：[arXiv:1512.03385](https://arxiv.org/abs/1512.03385) · [PDF](https://arxiv.org/pdf/1512.03385)

> 里程碑 ⭐ — 让神经网络真正"深"起来，是现代深度 CV/OCR backbone 的基石。

## 一句话定位

提出 **[[residual-connection|残差连接]]**（skip connection），
让极深网络（100+ 层）也能稳定训练，解决了深度增加反而退化 (degradation) 的问题。

## 核心贡献

1. **残差学习**：不直接学 H(x)，而是学残差 F(x)=H(x)−x，输出 F(x)+x。
   恒等映射更易优化，梯度可无损回传。
2. **[[residual-connection|Shortcut/Skip Connection]]**：跨层直连，几乎零额外参数。
3. 训练出 **152 层** ResNet（比 VGG 深 8 倍但复杂度更低），CIFAR 上验证到 1000 层可训。

## 关键结果

- ImageNet 分类 **top-5 error 3.57%**（ensemble），**ILSVRC 2015 分类第一名**
- 同时拿下 ImageNet 检测/定位、COCO 检测/分割多项第一
- 证明"越深越好"在有残差时成立

## 为什么是里程碑

- 残差连接成为深度学习的通用组件，[[attention-is-all-you-need|Transformer]] 内部也用残差
- ResNet 至今是检测、分割、OCR/文档版面分析 (DLA) 最常用的 backbone 之一
- 深度网络训练范式的转折点

## 关联

- Skip connection 被 [[attention-is-all-you-need|Transformer]] 的残差结构继承
- 文档智能中 DiT、LayoutLM 的视觉分支常用 ResNet/类残差 backbone
