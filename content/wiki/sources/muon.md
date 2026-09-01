---
type: source
title: "Muon: MomentUm Orthogonalized by Newton-Schulz"
authors:
  - Keller Jordan
  - Yuchen Jin
  - Vlado Boza
  - You Jiacheng
  - Franz Cesista
  - Laker Newhouse
  - Jeremy Bernstein
year: 2024
venue: Blog writeup (kellerjordan.github.io) + Muon is Scalable (Moonshot 2025)
url: https://kellerjordan.github.io/posts/muon/
  - muon
tags:
  - optimizer
  - training
  - orthogonalization
  - newton-schulz
  - spectral
  - milestone
  - infra
reading: deep
created: 2026-08-13
updated: 2026-08-13
---

# Muon — MomentUm Orthogonalized by Newton-Schulz (2024)

📄 **原文**：[Keller Jordan 原始 writeup](https://kellerjordan.github.io/posts/muon/) · [官方实现](https://github.com/KellerJordan/Muon) · [modded-nanogpt 速通记录](https://github.com/KellerJordan/modded-nanogpt) · 规模化验证 [Moonshot《Muon is Scalable for LLM Training》(2025)](https://arxiv.org/abs/2502.16982)

> ⭐ 不是模型而是**优化器**。刷新 NanoGPT / CIFAR-10 训练速度记录，后被 Moonshot Kimi 用于万亿级 MoE 实训。对造模型的人，这是 AdamW 之外当前最值得试的 hidden-layer 优化器。

## 一句话

Muon 只优化神经网络**隐藏层的 2D 权重矩阵**：先用标准 SGD-momentum 生成更新量，再用 **Newton-Schulz 迭代**把这个更新矩阵**近似正交化**（把所有奇异值拉到约等于 1）后才施加到参数上——等价于把更新替换成它 SVD 里的 $UV^\top$，从而均衡各方向的学习步长，收敛更快、成本更低。

## 名字拆解

**M**oment**U**m **O**rthogonalized by **N**ewton-Schulz。三个关键词就是全部：动量 → 正交化 → 用 Newton-Schulz 实现正交化。

## 核心机制

### 更新流程

对每个 2D 隐藏层权重 $W$：

1. 常规动量：$M_t = \mu M_{t-1} + G_t$（$G_t$ 为梯度，$\mu$ 动量系数）
2. **正交化**：$O_t = \mathrm{NewtonSchulz5}(M_t)$
3. 施加：$W_t = W_{t-1} - \eta\, O_t$

关键就是第 2 步——把动量更新矩阵替换成离它最近的半正交矩阵：

$$\mathrm{Ortho}(G) = \arg\min_O \{ \|O - G\|_F : O^\top O = I \ \text{或}\ OO^\top = I \}$$

若 $G=USV^\top$ 是 SVD，则 $\mathrm{Ortho}(G)=UV^\top$——**保留方向、把所有奇异值置 1**。

### 为什么用 Newton-Schulz 而不是 SVD

正交化的"标准答案"是 SVD 取 $UV^\top$，但 SVD 在 GPU 上太慢。Muon 改用五次多项式的 Newton-Schulz 迭代逼近：

```python
def newtonschulz5(G, steps=5, eps=1e-7):
    assert G.ndim == 2
    a, b, c = (3.4445, -4.7750, 2.0315)
    X = G.bfloat16()
    X /= (X.norm() + eps)
    if G.size(0) > G.size(1):
        X = X.T
    for _ in range(steps):
        A = X @ X.T
        B = b * A + c * A @ A
        X = a * X + B @ X
    if G.size(0) > G.size(1):
        X = X.T
    return X
```

原理：每步 $G' = aG + b(GG^\top)G + c(GG^\top)^2G = U(aS+bS^3+cS^5)V^\top$——迭代只作用在奇异值 $S$ 上（左右奇异向量 $U,V$ 不变），系数 $(a,b,c)=(3.4445,-4.7750,2.0315)$ 经调优使多项式在 $[0,1]$ 上快速把奇异值推向 1。**关键工程点**：Newton-Schulz 能在 **bfloat16** 下稳定运行（对比 Shampoo 的 coupled Newton 必须 float32），因此在现代 GPU 上很快，仅 5 步即可。

### 为什么正交化更新有用

作者的经验观察：transformer 里 2D 参数的更新矩阵（无论 SGD-momentum 还是 Adam 产生的）**条件数极高、近似低秩**——更新被少数几个主方向主导。正交化把被压制的"稀有方向"（幅度小但对学习重要）的尺度提上来，让各方向均衡学习。理论侧则源自 Bernstein & Newhouse (2024) 对 Shampoo 的分析——Muon 可看作 Shampoo 的一种简化/近似。

## 适用范围（重要工程约定）

- **只用于隐藏层的 2D 矩阵**（各层 weight matrix）。
- **标量、向量、embedding、输入层、输出层（含 LM head）→ 仍用 AdamW**。
- 4D 卷积核可把后三维 flatten 成 2D 后用 Muon。
- 实践中 Muon 和 AdamW **混合使用**：大部分 hidden weight 交给 Muon，其余交给 AdamW。

## 结果

- CIFAR-10 训到 94% 的速度记录：3.3 → **2.6 A100-秒**。
- NanoGPT speedrun（FineWeb 3.28 val loss）提速 **1.35×**。
- 扩展到 774M、1.5B 参数持续有提速；1.5B 训到 GPT-2 XL 级 HellaSwag 只需 10 个 8×H100-小时，AdamW 要 13.3 小时。
- **规模化落地**：Moonshot《Muon is Scalable》补上 weight decay + per-parameter update RMS 缩放两处改动，把 Muon 用到万亿参数级 MoE（Kimi），相比 AdamW 计算最优点约省一半 FLOPs。

## 与其他方法的关系

- **Shampoo**（Gupta 2018）：Muon 理论上可视作 Shampoo 的高效近似，但用 Newton-Schulz + bfloat16 替代其昂贵的矩阵求根。
- **Adam/AdamW**：Muon 只替代隐藏 2D 层，其余仍靠 AdamW；两者互补而非替代。
- **谱范数视角**：正交化 = 把更新约束到谱范数意义下的"单位步"，与 spectral/muP 类工作同源。

## 对 OCR 模型训练的启示

Muon 是 OCR 模型训练侧可研究的优化杠杆，与具体架构无关：

- **前端 DETR 的 attention/FFN 大矩阵**正是 Muon 的目标——这些层更新普遍高条件数、近似低秩，正交化能提上被压制的方向，对 query-based 检测这种收敛本就慢、匹配不稳的训练尤其可能提速。
- **后端 AR decoder**（transformer 堆叠）与 NanoGPT 同构，Muon 在此有最直接的速度记录背书。
- **落地成本低**：官方 PyTorch 实现即插即用，把 2D hidden weight 归 Muon、embedding/LM head/LayerNorm 归 AdamW 即可。训练受限于算力时值得优先试——省 FLOPs ≈ 省钱省时间。
- **注意点**：learning rate 需重调（Muon 的等效步长与 AdamW 不同）；embedding 与输出层务必留给 AdamW，别一股脑全塞 Muon。

## 关联

- [[attention-is-all-you-need]]：Muon 主要作用于 transformer 的 2D 权重，速度记录都在 GPT 类模型上取得。
- [[detr]] / [[dino-detr]]：前端检测骨架，其大矩阵是 Muon 的施加对象。
- [[chinchilla]]：计算最优训练——Muon 的价值正是在同等 FLOPs 下走得更远。
- [[adamw]]：Muon 的互补搭档，非 2D 隐藏层仍归它。
