---
type: source
title: "An Image is Worth 16x16 Words (Vision Transformer, ViT)"
authors: [Dosovitskiy, et al. (Google)]
year: 2020
venue: ICLR 2021
arxiv: "2010.11929"
sources: [vit]
tags: [transformer, cv, milestone]
created: 2026-07-23
updated: 2026-08-06
reading: deep
---
# Vision Transformer (ViT, 2020) — 深度精读

📄 **原文**：[arXiv:2010.11929](https://arxiv.org/abs/2010.11929) · [PDF](https://arxiv.org/pdf/2010.11929)

> 里程碑 ⭐ — 把纯 Transformer 直接用到图像，统一 CV 与 NLP 架构，证明"大数据 > 归纳偏置"。

## 一句话定位
把图像切成 16×16 patch，线性嵌入成 token 序列，像处理 NLP 单词一样喂进标准
[[attention-is-all-you-need|Transformer]] 编码器，抛弃 CNN 卷积归纳偏置。

## 核心贡献
1. **图像 patch 化为 token**：$H \times W$ 图 → $N$ 个 patch（如 16×16），每个 flatten + 线性投影 = patch embedding
2. 加 **[CLS] token** + 可学习 1D 位置编码，纯 Transformer encoder
3. 提出 hybrid 变体（CNN 特征图上取 patch）

## 输入表示与公式 1–4

输入图像 $x \in \mathbb{R}^{H \times W \times C}$，大写 $\mathbb{R}$ = 实数集，即 $x$ 是形状 $H \times W \times C$ 的实数张量（$H$ 高、$W$ 宽、$C$ 通道数，RGB 为 3）。切成 $N$ 个 $P \times P$ patch，展平后每个是 $P^2 \cdot C$ 维，序列长度 $N = HW/P^2$。

**(1) Patch Embedding + 位置编码 + [class] token**

$$
z_0 = [\, x_{\text{class}} ;\, x_p^1 E ;\, x_p^2 E ;\, \cdots ;\, x_p^N E \,] + E_{\text{pos}}
$$

- $x_p^i$：第 $i$ 个展平 patch（$\in \mathbb{R}^{P^2 \cdot C}$）
- $E \in \mathbb{R}^{(P^2 \cdot C) \times D}$：可学习线性投影，映射到 $D$ 维
- $x_{\text{class}}$：可学习 [class] token，拼在序列最前，其输出用于分类
- $E_{\text{pos}} \in \mathbb{R}^{(N+1) \times D}$：可学习位置编码
- $z_0 \in \mathbb{R}^{(N+1) \times D}$：encoder 输入序列

**(2) MSA 子层（每层 $\ell = 1 \dots L$）**

$$
z'_\ell = \text{MSA}\big(\text{LN}(z_{\ell-1})\big) + z_{\ell-1}
$$

先 LayerNorm 再多头自注意力，残差连接。MSA 是 **global** 的：每个 token 与所有 token 交互。

**(3) MLP 子层（每层 $\ell = 1 \dots L$）**

$$
z_\ell = \text{MLP}\big(\text{LN}(z'_\ell)\big) + z'_\ell
$$

两层全连接 + GELU，先 LN 再残差。MLP 是逐 token（**local**）作用。

**(4) 分类头输出**

$$
y = \text{LN}\big(z_L^0\big)
$$

$z_L^0$ = 第 $L$ 层输出序列里 [class] token 那一行（上标 0 = 序列第 0 位）；LN 后作为图像表示接分类头。

## 归纳偏置：为什么"只有 MLP 层是 local"
论文强调 ViT 图像专属归纳偏置比 CNN 弱得多。原文大意：ViT 中只有 MLP 层是 local 且平移等变（translationally equivariant），self-attention 是 global 的。

- **MLP 层**逐 patch 独立作用——同一套权重套在每个 patch 向量上，只处理当前 token 自己的特征，不跨 token 混信息 → 感受野只有"自己"= local；所有位置共享权重 = 平移等变。
- **Self-attention (MSA)** 每个 token 与序列里所有其他 token 算注意力并加权聚合，一上来就全局交互 = global。

对照 CNN：卷积核天生局部 + 平移等变，locality 是"硬编码"进整个网络的强归纳偏置。ViT 几乎去掉这种硬约束——全局 attention 不带 locality 假设，唯一还保留 local/平移等变的就剩逐 patch 的 MLP。所以 ViT 缺的归纳偏置要靠大数据补。（此外 2D 邻域结构用得极少：只在切 patch 和微调调分辨率位置编码时用到；位置编码初始化不含 2D 信息，patch 间空间关系从头学。）

## 高分辨率微调 + 2D 位置编码插值
预训练用较低分辨率（如 224），微调 downstream 常用更高分辨率（如 384）。patch 大小 P 不变 → patch 数 N=HW/P² 变多、序列变长。patch 投影 E 和 Transformer 权重与分辨率无关可复用，但位置编码 E_pos 是按位置一一学出来的，只有原来 N 个，数量对不上，多出的位置没有对应编码。

做法（**2D 插值**）：预训练 1D 位置编码本质对应原图 $\sqrt{N} \times \sqrt{N}$ 的 patch 网格。
1. 把 1D 位置编码按原 2D 排布 reshape 回 $\sqrt{N} \times \sqrt{N}$ 网格（每点 $D$ 维向量）；
2. 对该 2D 网格做**双三次插值（bicubic）**放大到新分辨率的网格尺寸（如 $384/16=24 \to$ 插到 $24 \times 24$）；
3. 拉平回 1D 接着微调。[class] token 的那个位置编码不参与插值，单独保留。

为何合理：位置编码编码的是 patch 在图里的空间位置，相邻位置空间上应平滑变化，bicubic 正是在已知网格点间平滑补出中间编码，故能保持原空间语义，让新增 patch 拿到合理位置信号。论文点明：这个"按 2D 结构 reshape 再插值"是 ViT 里极少数手工注入的 2D 归纳偏置之一（另一个是最初切 patch），其余空间关系全靠模型学。

## Inspecting ViT：ViT 到底学到了什么（可视化分析）
论文用一组可视化"打开黑盒"，验证抛掉 CNN 卷积归纳偏置后，纯 attention + 大数据是否也能自主习得合理的视觉处理机制。看三样：

1. **第一层 patch embedding 投影**：把公式(1)线性投影 E 的主成分可视化，学到的基函数像**边缘检测器、颜色/纹理低频基**，与 CNN 第一层卷积核惊人相似——不硬编码卷积也能学出合理底层特征提取器。
2. **位置编码自发长出 2D 结构**：位置编码 1D 随机初始化、从头学，本不含 2D 信息。算各位置编码间**余弦相似度**发现：相近 patch 更相似，且自动浮现**行列二维网格结构**（同行/同列相似度更高）——ViT 从数据自学出图像 2D 空间拓扑。
3. **注意力距离（mean attention distance）**：类比 CNN 感受野，按注意力权重加权算被关注位置到 query 的平均像素距离。结果：**低层**就同时有局部 head（距离小，像 CNN 早期卷积）和全局 head（距离大）；**高层**几乎全是大距离、全局整合。且**大数据预训练后低层局部 head 才更充分出现**——局部性是"学"出来的而非天生。

**目的**：三点合起来（底层滤波器像卷积 + 位置编码自发 2D + 注意力分层局部到全局）构成证据链，说明 ViT 能从数据中自主习得原本靠架构硬编码的视觉先验，为"大数据 > 归纳偏置"核心论点提供可解释性支撑。

## 关键机制与发现
- **在中等数据集（ImageNet）从头训练，ViT 略逊于同规模 ResNet** —— 因为缺卷积的平移不变性等归纳偏置
- **大规模预训练（JFT-300M）后反超**：数据规模压过归纳偏置（"large scale training trumps inductive bias"）
- 迁移到 ImageNet/CIFAR-100/VTAB 等达 SOTA，且预训练算力更省

## 关键结果
- ViT-H/14 在 JFT 预训练后 ImageNet top-1 ~88.5%，超过 BiT (ResNet) 且训练成本更低

## 评估预训练质量：classification vs regression
论文不看预训练本身 loss，而看**迁移下游的表现**来衡量预训练好坏（数据越大下游越好 = "大数据 > 归纳偏置"的量化证据）。两种评估：

- **主力：classification（fine-tune + softmax）**：换新分类头（linear→K 类）整网微调，标准 cross-entropy，报 top-1 accuracy。ImageNet/CIFAR/Pets/VTAB 等主指标。
- **补充：few-shot linear 评估用 regression**：在极少样本（5-shot 等）下，**冻结** backbone，把分类当成"回归到 one-hot"解。设冻结特征 $X$、one-hot 目标 $Y$，解闭式**岭回归** $W = (X^\top X + \lambda I)^{-1} X^\top Y$，推理取输出向量最大分量的类。

**为何 few-shot 用回归而非 softmax**：有**闭式解、不用迭代训练**，在超小样本上又快又稳、不受 SGD 调参和随机性干扰；few-shot 要跑大量数据集×shot 配置，回归成本极低、可复现，适合作"快速探针"衡量特征质量；小样本下 softmax+GD 易过拟合/不稳，闭式岭回归更 robust。注意这只是一个廉价、稳定的**线性探针**，不是把模型本身改成回归任务。

## 为什么是里程碑
- 打通 CV 与 NLP 的统一架构，是 [[clip]]、[[mae]]、几乎所有 document-VLM / 端到端 OCR 视觉编码器的基础
- 确立"预训练 + 迁移"在视觉的 Transformer 范式

## 关联
- 承 [[attention-is-all-you-need|Transformer]]；[[mae]] 用它做自监督，[[clip]] 用它做视觉编码
- 对照 CNN 谱系 [[resnet-deep-residual-learning|ResNet]]
