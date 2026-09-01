---
type: concept
title: "Learning Rate Schedule 学习率调度专题（warmup / cosine / step）"
sources: [vit]
tags: [learning-rate, schedule, training, foundation]
created: 2026-08-06
updated: 2026-08-06
---
# 学习率调度专题（Learning Rate Schedule）

## 为什么要调度学习率
学习率 $\eta$ 是训练中最敏感的超参数。设 $\theta_{t+1}=\theta_t-\eta\nabla L$：$\eta$ 过大步长过长，在损失谷底附近**震荡**甚至发散；$\eta$ 过小更新缓慢、收敛耗时且易陷平坦区。理想策略**先大后小**——早期用较大 $\eta$ 快速逼近极小值区域，后期用较小 $\eta$ 精细收敛。这一"随训练进程动态调整 $\eta$"的过程即学习率调度，是现代深度学习（尤其配合 [[optimizer]]）的标配。

## Warmup（预热）
Warmup 指训练**开头若干步**将 η 从很小值线性升至目标值，再进入正常调度。必要性有二：
1. **早期梯度不稳**：随机初始化下开头梯度方向噪声大、幅度大，直接用大 η 易把参数推离到坏区域导致发散。
2. **Adam 二阶矩估计不准**：Adam 类早期累积的二阶矩 $v_t$ 样本极少、方差大，自适应步长不可靠。Warmup 给 $v_t$ 一段预热积累时间，避免早期错误的大幅更新。这正是 Transformer 训练几乎必须 warmup 的原因。

线性 warmup：第 $t$ 步（$t\le t_w$）$\eta_t=\eta_{\max}\cdot t/t_w$。

## 主流 Schedule
- **Step decay**：每隔固定 epoch 将 $\eta$ 乘衰减因子 $\gamma$（如每 30 epoch ×0.1）：$\eta_t=\eta_0\cdot\gamma^{\lfloor t/s\rfloor}$。简单稳健，CNN 常用。
- **Exponential decay**：$\eta_t=\eta_0\cdot e^{-\lambda t}$，平滑连续衰减。
- **Cosine annealing**：按余弦从 $\eta_{\max}$ 降到 $\eta_{\min}$：
  $$\eta_t=\eta_{\min}+\tfrac12(\eta_{\max}-\eta_{\min})(1+\cos\frac{t\pi}{T})$$
  前期衰减慢、末期快，收敛平滑、泛化好。
- **Cosine with warmup**：先线性 warmup 到 η_max 再 cosine 退火——Transformer/ViT 事实标准。
- **Linear warmup + linear decay**：warmup 后线性降至 0，BERT 等常用。
- **Warm restarts (SGDR)**：cosine 退火到底后**周期性重启**回 $\eta_{\max}$，帮助跳出局部极小、探索多个盆地，周期可递增。
- **OneCycle**：单周期内 $\eta$ 先升后降（并常反向调 momentum），配大 $\eta$ 实现"超收敛"，训练快。
- **ReduceLROnPlateau**：按**验证指标**自适应——val loss 连续若干 epoch 不降才 $\times\gamma$ 降 $\eta$，无需预设曲线。

## 实践总纲
- **Transformer / [[vit|ViT]]**：linear warmup + cosine decay，warmup 约占总步数 5–10%。
- **CNN 图像分类**：step decay 经典可靠；追求速度用 OneCycle。
- **调优期**：ReduceLROnPlateau 省心自适应。
- 原则：**warmup 几乎总有益**，cosine 泛化优于 step，restarts 适合需强探索的任务。

## 关联
[[optimizer]] · [[vit]]
