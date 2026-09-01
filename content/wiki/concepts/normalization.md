---
type: concept
title: "Normalization 归一化专题（BN / LN / IN / GN）"
sources: [vit, resnet-deep-residual-learning]
tags: [normalization, training, deep-learning, foundation]
created: 2026-08-06
updated: 2026-08-06
---
# Normalization 归一化专题

## 是什么 / 做什么
神经网络训练时，每层输入分布随前层参数更新不断漂移（internal covariate shift），导致梯度不稳、学习率难调、收敛慢。Normalization 在网络内部把某层激活值重新标准化（减均值、除标准差）拉回稳定分布（均值≈0、方差≈1），再用可学习的 $\gamma$（缩放）、$\beta$（平移）还原表达能力。

好处：训练更稳更快、可用更大学习率、对初始化不敏感、部分方法带轻微正则效果。

## 统一公式
所有方法本质是同一个式子：

$$\hat y = \frac{x - \mu}{\sqrt{\sigma^2 + \epsilon}},\quad \mathrm{out} = \gamma\cdot\hat y + \beta$$

差异**只在 $\mu$、$\sigma$ 在哪个维度统计**。这是各方法唯一分水岭。设激活张量形状 [N, C, H, W]（batch、通道、高、宽）。

## 四种方法

| 方法 | 统计维度 | 依赖 batch？ | 典型场景 |
|---|---|---|---|
| **Batch Norm (BN)** | 每通道 C，在 (N,H,W) 上 | 是 | CNN 默认（CV 大 batch） |
| **Layer Norm (LN)** | 每样本 N，在 (C,H,W)/特征维 上 | 否 | Transformer/NLP、ViT |
| **Instance Norm (IN)** | 每样本每通道，在 (H,W) 上 | 否 | 风格迁移 |
| **Group Norm (GN)** | 每样本，通道分 G 组，在 (组内C,H,W) 上 | 否 | 检测/分割、小 batch |

- **BN**：同一通道跨整个 batch 和空间归一化，依赖 batch 里其他样本。
- **LN**：单样本内跨所有通道归一化，完全不看 batch。
- **IN**：单样本单通道只跨空间。
- **GN**：LN 与 IN 的折中——G=1 即 LN，G=C 即 IN。

## 各自区别 / 用在哪
- **BN**：CNN 默认，效果好、带轻微正则。弱点：**依赖 batch size**——小 batch（检测/分割/大分辨率）统计噪声大性能崩；且训练用 batch 统计、推理用滑动平均，train/eval 行为不一致。
- **GN**：专为解决 BN 小 batch 问题提出，统计与 batch size 无关，batch=1 也稳，检测/分割/显存吃紧任务常替代 BN。
- **LN**：Transformer/NLP 标配（[[vit|ViT]] 用它）。序列长度可变、batch 不规整时，LN 对每 token 独立归一化，不受 batch 影响，训练推理一致。见公式 (2)(3) 里的 LN。
- **IN**：风格迁移，归掉每图每通道的对比度/风格统计。

## 一句话总纲
本质同一个标准化公式，只是统计维度不同；**选哪个取决于能否依赖 batch 维度**——能就 BN，不能就 GN/LN。

## 关联
- [[vit|ViT]] 用 LayerNorm（Pre-LN，公式 2/3）
- [[resnet-deep-residual-learning|ResNet]] 用 BatchNorm
- 常与 [[residual-connection|残差连接]]、[[gelu]]/[[relu]] 一起构成 Transformer/CNN 基础模块
