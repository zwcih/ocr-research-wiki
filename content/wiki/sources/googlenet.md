---
type: source
title: "Going Deeper with Convolutions (GoogLeNet / Inception v1)"
authors: [Szegedy, Liu, Jia, Sermanet, Reed, Anguelov, Erhan, Vanhoucke, Rabinovich]
year: 2014
venue: CVPR 2015
arxiv: "1409.4842"
sources: [googlenet]
tags: [cnn, cv, imagenet, inception, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---
# GoogLeNet / Inception v1 (2014) — 深度精读

📄 **原文**：[arXiv:1409.4842](https://arxiv.org/abs/1409.4842) · [PDF](https://arxiv.org/pdf/1409.4842)
> 用 Inception 模块在同一预算下同时加深加宽网络，以 12× 更少参数拿下 ILSVRC-2014 分类冠军（top-5 6.67%）。

## 一句话定位
GoogLeNet 提出 Inception 模块——在同一层并行做 1×1/3×3/5×5 卷积和池化再拼接，并用 1×1 卷积做降维——把「近似稀疏结构、用密集组件覆盖」的思想落地，在 15 亿 multiply-add 的固定推理预算下做到 22 层深，参数比 AlexNet 少 12×却精度更高。

## 核心贡献
1. **Inception 模块（多尺度并行）**：在同一 stage 并行 1×1、3×3、5×5 卷积 + 3×3 max-pool，输出沿通道维拼接，让下一层同时抽取多尺度特征；受 Arora 等稀疏结构理论与 Hebbian「fire together, wire together」启发。
2. **1×1 卷积做降维瓶颈**：在昂贵的 3×3/5×5 前先用 1×1 卷积压缩通道，避免 stage 间输出爆炸——这是能在固定算力下同时增大深度和宽度的关键工程手段（naïve 版会算力爆炸）。
3. **计算高效、面向落地**：全网设计控制在 ~15 亿 multiply-add，可在低内存设备推理；相比同等精度的非 Inception 网络快 2–3×。
4. **辅助分类器（auxiliary classifiers）**：在 Inception(4a)、(4d) 处接小分类头，训练时以 0.3 权重加入总损失，缓解深网梯度消失、提供额外正则，推理时丢弃。
5. **用全局平均池化替代大 FC**：末端用 average pooling + 一层 linear，去掉巨型全连接层（top-1 提升约 0.6%），但 Dropout 仍必需。

## 关键架构 / 训练细节
- 22 个带参数层（含池化算 27 层），构建块约 100 个；输入 224×224 RGB 减均值，全用 ReLU。
- 低层保留传统卷积，高层才用 Inception 堆叠，其间用 stride-2 max-pool 减半分辨率；越高层 3×3/5×5 比例越大（高层特征更空间分散）。
- 训练：DistBelief 分布式，异步 SGD、momentum 0.9，lr 每 8 epoch ÷ 约 4%，Polyak averaging 出最终模型。
- 数据增强：裁剪面积在 8%–100% 均匀采样、aspect ratio 3/4–4/3，Howard 光度扰动。作者坦言采样方法一直在变、难给唯一最佳配方。
- 测试期激进裁剪：4 尺度(256/288/320/352) × 3 方位 × 6 crop × 2 镜像 = 144 crop/图，softmax 跨 crop 与模型平均。

## 关键结果（真实数字）
- **ILSVRC-2014 分类冠军：top-5 error 6.67%**（val=test），相对 2012 SuperVision 降 56.5%，相对 2013 Clarifai 降约 40%。
- 消融：单模型 1 crop 10.07% → 7 模型 144 crop 6.67%（-3.45pt）。
- 检测：mAP 43.9%（6 网 ensemble）拿下 ILSVRC-2014 检测冠军，且未用上下文模型、未做 bbox 回归。

## 为什么是里程碑
- 首次证明「精心设计的模块化 + 降维瓶颈」能在有限算力下逼近稀疏结构、以更少参数拿更高精度，开创了 Inception v2/v3/v4 系列。
- 1×1 瓶颈卷积成为后续几乎所有高效网络（含 ResNet bottleneck、MobileNet 等）的标准构件。
- 辅助分类器与全局平均池化影响深远，是深网可训练性与轻量化设计的早期范例。

## 关联
- 同届对照：[[vgg]]（纯 3×3 深堆叠）、前身 [[alexnet]]。
- 1×1 瓶颈思想被继承进残差 bottleneck：[[resnet-deep-residual-learning]]。
- 检测流水线基于 R-CNN 谱系，参见 [[faster-rcnn]]、[[mask-rcnn]]、[[yolo]]。
- 多尺度/全卷积思想与分割网络相通：[[unet]]。
