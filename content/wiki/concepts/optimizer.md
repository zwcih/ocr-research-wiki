---
type: concept
title: "Optimizer 优化器专题（SGD / Momentum / AdaGrad / RMSProp / Adam / AdamW）"
sources: [vit, resnet-deep-residual-learning]
tags: [optimizer, training, deep-learning, foundation]
created: 2026-08-06
updated: 2026-08-06
---
# Optimizer 优化器专题

## 优化器做什么
训练目标是最小化损失 $L(\theta)$（$\theta$ = 模型所有参数）。优化器决定**每一步怎么更新 $\theta$**。基础框架是梯度下降：

$$\theta \leftarrow \theta - \eta \cdot g, \quad g = \nabla_\theta L$$

（损失对参数的梯度），$\eta$ = 学习率

梯度指向损失上升最快方向，取负朝下降走。各优化器的花样都在改进“用 $g$ 更新 $\theta$”这步：如何利用历史梯度、如何自适应调每个参数步长、如何加动量。

## 方法谱系

**1. SGD（随机梯度下降）**
每步用一个 mini-batch 估计梯度：

$$\theta \leftarrow \theta - \eta \cdot g$$

简单、泛化常最好；但收敛慢、对 $\eta$ 敏感、易在沟壑震荡。

**2. SGD + Momentum（动量）**
累积历史梯度的指数移动平均当"速度"，像小球滚下山积惯性：

$$v \leftarrow \beta \cdot v + g; \quad \theta \leftarrow \theta - \eta \cdot v$$

（$\beta \approx 0.9$）。冲过小震荡、加速收敛。

**3. Nesterov Momentum**
先按当前动量"前瞻"一步再算梯度，收敛更准。

**4. AdaGrad**
每参数自适应学习率，累积历史梯度平方，频繁更新的参数步长自动变小。缺点：分母单调累加，后期学习率衰减近零、训练停滞。

**5. RMSProp**
修 AdaGrad——梯度平方累积改成指数移动平均（有遗忘），学习率不会衰到零。适合非平稳目标、RNN。

**6. Adam（Adaptive Moment Estimation）** ⭐ 最常用
Momentum + RMSProp 合体。维护一阶矩 $m$（动量）与二阶矩 $v$（梯度平方 EMA）：

$$m \leftarrow \beta_1 \cdot m + (1-\beta_1) \cdot g; \quad v \leftarrow \beta_2 \cdot v + (1-\beta_2) \cdot g^2$$

偏差校正 $\hat m$、$\hat v$（修早期偏向 0），再

$$\theta \leftarrow \theta - \eta \cdot \frac{\hat m}{\sqrt{\hat v} + \epsilon}$$

默认 $\beta_1=0.9$, $\beta_2=0.999$。收敛快、对 $\eta$ 鲁棒、开箱即用。

**7. AdamW** ⭐ Transformer/大模型事实标准
Adam 权重衰减修正版。原始 Adam 把 L2 正则耦合进自适应梯度里效果打折；AdamW 把 **weight decay 从梯度更新解耦**、直接作用在参数上。ViT、BERT、GPT 系都用它。

## 怎么选（实践总纲）
- **CNN（CV）**：SGD+Momentum 常泛化最好，但要调 $\eta$ + schedule、收敛慢。
- **Transformer/NLP/大模型/[[vit|ViT]]**：**AdamW** 默认，配 warmup + cosine 衰减。
- 想快速出结果不调参：Adam/AdamW。
- 追极致泛化愿调参：SGD+Momentum。
- 一句话：**SGD 泛化好但难调，Adam/AdamW 好用鲁棒，是现代深度学习默认**。

## 学习率调度（配套，常与优化器一起用）
优化器定"方向和相对步长"，学习率 schedule 定"$\eta$ 随训练怎么变"：warmup（开头小 $\eta$ 预热防发散）、cosine/step 衰减（后期减小 $\eta$ 精调）。Transformer 训练几乎必配 warmup + cosine。

## 关联
- [[vit|ViT]] 等 Transformer 用 AdamW
- [[resnet-deep-residual-learning|ResNet]] 等 CNN 常用 SGD+Momentum
- 与 [[normalization]]、[[residual-connection|残差连接]] 同属训练稳定性基础
