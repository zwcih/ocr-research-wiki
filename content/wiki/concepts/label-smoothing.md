---
type: concept
title: "Label Smoothing 标签平滑"
sources: [vit]
tags: [regularization, label-smoothing, training, loss, foundation]
created: 2026-08-06
updated: 2026-08-06
---
# Label Smoothing（标签平滑）

## 解决什么问题
它针对**过度自信（overconfidence）**。用标准 one-hot 目标训练分类/生成时，交叉熵逼模型把正确类的 softmax 概率推向 1、其余推向 0。为逼近 1，正确类 logit 要被拉向 +∞，导致：权重越训越大、对训练标签过拟合、**概率校准（calibration）变差**（预测置信度与实际正确率对不上），且对标签噪声毫无抵抗。

## 做法
把硬标签软化。设 $K$ 个类别、平滑系数 $\epsilon$：

$$y'_i = (1-\epsilon) \cdot y_i + \epsilon/K$$

正确类目标从 1 降到 $1-\epsilon+\epsilon/K$，其余各类从 0 抬到 $\epsilon/K$。常取 **$\epsilon=0.1$**。交叉熵照常算（见 [[loss-functions]]），只是目标分布从尖峰变成"主峰 + 均匀底噪"。

## 为什么有效
模型不再被要求输出无穷 logit——正确类与错误类 logit 之差被约束在有限间隔，于是权重不炸、置信度校准更好、泛化更稳、对错标更鲁棒。代价是训练集准确率/似然略降（本就不该追求 100%），属良性正则。可视为一种在标签空间加噪的[[weight-decay|正则化]]。

## 在哪用
- Transformer 分类头、机器翻译、语言模型
- **AR OCR 解码器的逐 token 交叉熵**（[[vit|ViT]] 视觉编码 + AR 解码路线）
- 检测的分类分支
- 常配 $\epsilon=0.1$。**知识蒸馏场景一般不叠加**（软标签已有类似作用）。

## 为什么知识蒸馏不叠加 label smoothing
Label smoothing（LS）与知识蒸馏（KD）都把尖锐的硬标签换成**软化目标分布**，都起正则、抑制过度自信的作用——作用重叠，故不叠加。关键差别在软标签的**信息含量**：

- **LS 撒的是均匀噪声**：把 $\epsilon$ 机械平摊到所有错误类，对"猫和狗比猫和卡车更像"这种类间关系一无所知。
- **KD 的 teacher 软标签带类间相似结构（dark knowledge）**：告诉 student"这是猫，但 15% 像狗、0.1% 像卡车"，这个非均匀的相对分布正是 KD 价值所在。

在 KD 上再叠 LS，等于往 teacher 精心给出的结构化软分布里**注入均匀噪声**，把类间相似信息抹平、拉向均匀，削弱 dark knowledge。Müller et al. (2019) 还发现 LS 会**收紧同类特征簇、抹掉类间 logit 的细粒度结构**，恰恰破坏 KD 依赖的信息。一句话：**LS 是"无知识的均匀软化"，KD 是"有知识的结构化软化"，KD 已包含并超越 LS 的作用，再叠反而污染 teacher 的暗知识**。

> 延伸：当训练数据本身就是**其他模型产出的伪标签/合成数据**（带噪、可能有系统性错误 pattern）时，同样**不宜再机械叠加 LS**——伪标签已接近软标签性质。正确做法见 [[noisy-label-learning]]。

## 关联
[[loss-functions]] · [[weight-decay]] · [[noisy-label-learning]] · [[vit]]
