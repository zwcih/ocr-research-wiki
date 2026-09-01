---
type: source
title: "End-to-End Object Detection with Transformers (DETR)"
authors: [Carion, Massa, Synnaeve, Usunier, Kirillov, Zagoruyko (Facebook AI)]
year: 2020
venue: ECCV 2020
arxiv: "2005.12872"
sources: [detr]
tags: [detection, detr, transformer, set-prediction, milestone, frontend]
reading: deep
created: 2026-07-23
updated: 2026-08-06
---

# DETR — End-to-End Object Detection with Transformers (2020)

📄 **原文**：[arXiv:2005.12872](https://arxiv.org/abs/2005.12872) · [PDF](https://arxiv.org/pdf/2005.12872)

> ⭐ DETR 系检测的开山工作。

## 一句话

DETR（DEtection TRansformer）把目标检测重构为**集合预测（set prediction）**问题：用 CNN backbone 提特征、Transformer encoder-decoder 直接并行输出一个固定大小的预测集合，再用**二分匹配（bipartite matching）**做一对一监督，从而彻底移除 anchor、proposal 与 NMS 等手工组件，成为第一个真正端到端的检测器。

## 解决的痛点

传统检测器（[[faster-rcnn]]、[[yolo]]）本质是**间接**预测：先密集铺设大量 anchor/proposal 做逐框回归+分类，再靠近似重复（near-duplicate）后处理。这带来两个结构性负担：

- **NMS 不可微、含阈值超参**，把去重逻辑排除在训练之外，性能对其敏感；
- anchor 尺度/比例/密度需人工设计，且正负样本分配（label assignment）规则复杂。

DETR 的洞见：检测的本质是预测一个**无序集合**，"去重"应由损失函数内生强制，而非事后修补。它用匈牙利匹配把去重变成训练信号，让模型学会"每个物体只出一个框"。

## 核心机制

### 架构

1. **Backbone**：CNN（[[resnet-deep-residual-learning]]）提取特征图 $f\in\mathbb{R}^{C\times H\times W}$（典型 $C=2048$）。
2. **降维+展平**：$1\times1$ 卷积把通道降到 $d$（如 256），空间展平为 $d\times HW$ 的 token 序列，叠加**固定正弦位置编码**（Transformer 排列不变，需注入空间信息）。
3. **Encoder**：多层 self-attention，对全部空间位置做全局交互，建模长程依赖与实例分离（[[attention-is-all-you-need]]）。
4. **Decoder**：输入 $N$ 个 **object query**（$N=100$ 个可学习位置嵌入），**并行（非自回归）**解码；每层做 query 间 self-attention（互相协调、隐式去重）+ 对 encoder 输出的 cross-attention（定位物体）。
5. **FFN 预测头**：每个 query 独立输出 $(\text{class}, \text{box})$，框以归一化中心+宽高表示；类别含额外的 $\varnothing$（no-object）类。

object query 可理解为**可学习的"槽位/探针"**，每个 query 专注图像中某种空间区域与尺度模式，是并行、置换不变解码的关键。

### 二分匹配（一对一，天然去重、免 NMS）

模型输出固定 $N$ 个预测（$N$ 远大于图中物体数），真值集合 padding 到 $N$（用 $\varnothing$ 填充）。先在预测与真值间求**最优一对一置换**：

$$\hat{\sigma} = \arg\min_{\sigma \in \mathfrak{S}_N} \sum_{i=1}^N \mathcal{L}_{match}(y_i, \hat{y}_{\sigma(i)})$$

$\mathfrak{S}_N$ 为 $N$ 元置换群，由**匈牙利算法**在 $O(N^3)$ 内求解全局最优匹配。匹配代价对每个真值 $y_i=(c_i,b_i)$（$c_i$ 为类别、$b_i$ 为框）定义为：

$$\mathcal{L}_{match}(y_i,\hat y_{\sigma(i)}) = -\mathbb{1}_{\{c_i \neq \varnothing\}}\,\hat{p}_{\sigma(i)}(c_i) + \mathbb{1}_{\{c_i \neq \varnothing\}}\,\mathcal{L}_{box}(b_i, \hat{b}_{\sigma(i)})$$

分类项用**概率**（非 log），使其与框项量纲可比；对 $\varnothing$ 真值不计代价。**一对一约束**意味着一个物体只能被一个 query 认领——这正是**去重被写进训练目标**、从而免 NMS 的根源。

### 匈牙利损失（最终训练目标）

固定最优匹配 $\hat\sigma$ 后，计算可反传的训练损失：

$$\mathcal{L}_{Hungarian}(y,\hat y)=\sum_{i=1}^N \Big[ -\log \hat{p}_{\hat\sigma(i)}(c_i) + \mathbb{1}_{\{c_i\neq\varnothing\}}\,\mathcal{L}_{box}(b_i,\hat{b}_{\hat\sigma(i)}) \Big]$$

分类改用标准 **NLL（$-\log$）**。由于绝大多数 query 匹配到 $\varnothing$，类别极度不平衡，故对 no-object 类的 log 概率项**降权 ÷10** 以平衡训练。参见 [[loss-functions]]。

### 框损失（L1 + GIoU）

$$\mathcal{L}_{box}=\lambda_{iou}\,\mathcal{L}_{iou}(b_i,\hat{b}_{\sigma(i)})+\lambda_{L1}\,\|b_i-\hat{b}_{\sigma(i)}\|_1$$

**为何不能单用 L1**：L1 误差与框的绝对尺度成正比——相同相对误差下，大框贡献的 loss 远大于小框，尺度不公平且对物体大小敏感。GIoU 是**尺度不变**的重叠度量，补偿这一偏差。二者组合并按 batch 内目标数归一化。

$$\text{GIoU}=\text{IoU}-\frac{|C\setminus(A\cup B)|}{|C|},\qquad \mathcal{L}_{GIoU}=1-\text{GIoU}$$

其中 $A,B$ 为两框，$C$ 为二者的**最小闭包框（smallest enclosing box）**。相比 IoU，GIoU 在两框**不相交**时仍提供非零梯度（IoU 恒为 0 无梯度），缓解回归的梯度消失。

### Auxiliary decoding losses

在**每一层 decoder** 的输出上都接共享的预测 FFN 并施加匈牙利损失（各层 FFN 参数共享、加 LayerNorm）。这为深层 decoder 提供中间监督，稳定训练、加速收敛、并显式约束每层输出正确的物体数。

## 代价/短板

- **收敛极慢**：需约 **500 epoch**（远超 Faster R-CNN 的数十 epoch），因全局 attention 与二分匹配学习困难。
- **小目标弱**：仅用 backbone **单尺度**特征（$H/32$），缺多尺度金字塔，小目标 AP 明显落后。
- **匹配早期不稳**：训练初期 query 与真值的匹配剧烈跳变，监督信号不一致，减慢收敛。

这些短板直接催生后续工作：[[deformable-detr]] 用**多尺度可变形注意力**（稀疏采样关键点）把 500 epoch 压到 ~50 并大幅提升小目标；[[dino-detr]] 引入**去噪训练（denoising）+ 对比去噪 + 混合 query**，稳定匹配、进一步提速提精度，成为 DETR 系 SOTA 主线。

## 对 OCR 文档检测的启示

在 OCR 文档智能场景中，DETR 提供了多项可迁移能力：

- **免 NMS 的集合预测**：文档中文本行/字符/表格单元高度密集且常粘连，NMS 阈值极难调；一对一匹配天然规避粘连误删。
- **object query 作为版面槽位**：可扩展为面向文本实例的 query，输出 $(\text{polygon/box},\text{class})$，直接对接后端 [[trocr]] 式 AR 识别，形成检测→识别端到端管线。
- **auxiliary loss + GIoU**：稳定密集小框回归；GIoU 的尺度不变性对文档中大标题与小脚注混排尤为关键。

**适配警示**：原版 DETR 单尺度、$N=100$、收敛慢，对文档**密集小目标**（一页数百字符）先天不利。落地应取 **Deformable/DINO 变体**：增大 query 数、引入多尺度（可结合 [[vit]] 或 FPN 特征），并用去噪训练稳定匹配。

## 关联

[[faster-rcnn]] · [[yolo]] · [[attention-is-all-you-need]] · [[resnet-deep-residual-learning]] · [[deformable-detr]] · [[dino-detr]] · [[trocr]] · [[loss-functions]] · [[vit]]
