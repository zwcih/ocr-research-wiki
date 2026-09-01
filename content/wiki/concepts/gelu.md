---
type: concept
title: GELU（高斯误差线性单元）
sources: [bert, attention-is-all-you-need]
tags: [activation, transformer, training]
created: 2026-08-04
updated: 2026-08-04
---
# GELU（Gaussian Error Linear Unit / 高斯误差线性单元）

## 定义
GELU 是一个平滑的非线性激活，把输入按其在标准正态分布下「被保留的概率」加权：

GELU(x) = x · Φ(x)

其中 Φ(x) 是标准正态分布的累积分布函数（CDF），Φ(x)=P(X≤x), X∼N(0,1)。等价地 GELU(x) = x·½[1+erf(x/√2)]。

直觉：ReLU 用硬阈值 𝟙[x>0] 做门控（非 0 即 1），GELU 用 x 自身的分位数 Φ(x) 做「软门控」——输入越大越可能被完整保留，越小越可能被压向 0，是一种随机正则思想（借鉴 Dropout/zoneout 的「按输入大小随机丢弃」）的确定性期望形式。

## 常用近似
精确式含 erf，早期为省算力用近似（现代框架多已直接算精确 erf，但近似仍常见）：
- **tanh 近似**：GELU(x) ≈ 0.5x(1 + tanh[√(2/π)(x + 0.044715x³)])
- **sigmoid 近似**：GELU(x) ≈ x·σ(1.702x)（即近似等于 SiLU/Swish 的一个特例）

## 与 ReLU 的对比
- **处处平滑可导**：不像 ReLU 在 0 处有折点，GELU 曲线光滑，梯度连续，优化更稳定。
- **允许小负输出**：x 略小于 0 时 GELU 输出一个小负值（非直接截断为 0），保留了负区的少量信息，缓解「神经元死亡」。
- **非单调**：在负区先略降再回升到 0，这种轻微非单调被认为增强了表达能力。
- 代价是比 ReLU 略贵（需算 erf 或 tanh），但在 Transformer 里相对注意力开销可忽略。

## 在架构中的地位
GELU 由 Hendrycks & Gimpel（2016）提出，因 [[bert|BERT]] 采用而广泛流行，随后成为 Transformer 系 FFN 的事实标准激活：GPT-2/3、[[vit|ViT]]、[[t5|T5]]（用 ReLU/GeGLU 变体）等大量沿用。相对 [[relu|ReLU]] 更平滑、相对 Swish/SiLU 概率解释更清晰，是当前大模型最常见的激活之一。其后 GLU 家族（GeGLU=GELU 门控）在 LLaMA 等模型中进一步替代纯 GELU FFN。
