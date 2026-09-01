---
type: source
title: "Deformable DETR: Deformable Transformers for End-to-End Object Detection"
authors: [Zhu, Su, Lu, Li, Wang, Dai (SenseTime / USTC / CUHK)]
year: 2020
venue: ICLR 2021
arxiv: "2010.04159"
sources: [deformable-detr]
tags: [detection, detr, deformable-attention, multi-scale, frontend, milestone]
reading: deep
created: 2026-07-23
updated: 2026-08-06
---

# Deformable DETR — 可变形注意力 + 多尺度（2020）

📄 **原文**：[arXiv:2010.04159](https://arxiv.org/abs/2010.04159) · [PDF](https://arxiv.org/pdf/2010.04159)

> ⭐ 治 [[detr]] 两大病（收敛慢、小目标弱）。**对文档这种密集小目标场景，这一篇比原始 DETR 更该学。**

## 一句话

用**稀疏采样的可变形注意力**替换 [[detr]] 中稠密的全局 self-attention：每个 query 只关注参考点周围少数几个"网络自己学出来"的采样点，并天然跨多尺度特征采样，从而把复杂度降到线性、训练从 500 epoch 缩到 50 epoch（约 10× 提速），同时显著补强小目标。它是 [[dino-detr]] 及后续所有 DETR 系检测器的实际工程基座。

## 解决的痛点：DETR 收敛慢/小目标弱的根因

[[detr]] 把检测变成集合预测，优雅但两大硬伤：**收敛极慢（500 epoch）**、**小目标差**。二者同源，根子在于 [[attention-is-all-you-need]] 的标准注意力用在特征图上：

设 backbone 输出特征图空间尺寸 $H\times W$、通道 $C$，encoder 的 self-attention 要在所有像素对之间算相关，复杂度为

$$O\big(H^2 W^2 C\big)$$

这带来两个连锁后果：

1. **训练初期注意力近乎均匀**。权重 $\propto \mathrm{softmax}(q^\top k/\sqrt{d})$ 初始时对全图 $HW$ 个位置几乎均匀分布，模型要花漫长训练才能把注意力"聚焦"到目标区域——这正是 500 epoch 的来源。
2. **算不起高分辨率**。$O(H^2W^2C)$ 关于像素数是平方级，DETR 只能用 stride-32 的单张低分辨率特征图（$H,W$ 已缩小），小目标在其上仅占一两个像素，信息被抹平，故小目标弱。而经典检测器靠 FPN 多尺度救小目标，DETR 因复杂度无力承载。

结论：**稠密全局注意力 = 慢收敛 + 无法上多尺度 = 小目标弱**。破局点是让注意力"稀疏且可学地聚焦"，并且便宜到能上多尺度。

## 核心机制

### Deformable Attention（单尺度）

借鉴 deformable convolution 的思想：不看全图，只看参考点附近一小撮位置，且位置由网络预测。对 query 特征 $z_q$、其二维参考点 $p_q$、输入特征图 $x$：

$$\text{DeformAttn}(z_q,p_q,x)=\sum_{m=1}^{M} W_m\Big[\sum_{k=1}^{K} A_{mqk}\cdot W'_m\, x(p_q+\Delta p_{mqk})\Big]$$

各符号：$m$ 索引 $M$ 个注意力头，$k$ 索引每头的 $K$ 个采样点（$K\ll HW$，论文取 $K=4$）；$W'_m$ 把值投到头子空间，$W_m$ 把各头输出投回；$\Delta p_{mqk}$ 是**采样偏移**，$A_{mqk}$ 是**注意力权重**。

关键在于 $\Delta p_{mqk}$ 和 $A_{mqk}$ **都不再由 query-key 点积算出，而是把 $z_q$ 做线性投影直接预测**：一个 $\text{Linear}(z_q)$ 输出 $3MK$ 个数，其中 $2MK$ 个走偏移（每点一个 $\Delta x,\Delta y$），$MK$ 个走权重并对 $k$ 做 softmax 归一化：

$$\sum_{k=1}^{K} A_{mqk}=1,\qquad A_{mqk}\in[0,1]$$

偏移 $\Delta p_{mqk}$ 是**实数（可为小数、可为负）**，故采样位置 $p_q+\Delta p_{mqk}$ 落在网格之间，用**双线性插值**从 $x$ 取值，保证对偏移可微、可端到端训练。复杂度里的 key 数从 $HW$ 变成常数 $K$，encoder self-attention 从平方降到**线性于像素数**。

### Multi-scale Deformable Attention（MSDeformAttn）

真正让小目标翻身的是多尺度版本。取 backbone 的 $L$ 层特征图 $\{x^l\}_{l=1}^{L}$（论文用 C3–C5 加一层，$L=4$）。参考点改用**归一化坐标** $\hat p_q\in[0,1]^2$，再由 $\phi_l$ 缩放到第 $l$ 层的分辨率：

$$\text{MSDeformAttn}(z_q,\hat p_q,\{x^l\})=\sum_{m=1}^{M} W_m\Big[\sum_{l=1}^{L}\sum_{k=1}^{K} A_{mlqk}\cdot W'_m\, x^l\big(\phi_l(\hat p_q)+\Delta p_{mlqk}\big)\Big]$$

现在权重对**全部 $L\times K$ 个采样点**联合归一化：

$$\sum_{l=1}^{L}\sum_{k=1}^{K} A_{mlqk}=1$$

一个 query 直接在 4 层特征、每层 4 个点，共 $L\cdot K=16$ 个可学位置上采样融合。**无需 FPN 的自顶向下 lateral 融合**——跨尺度信息交换由注意力本身完成，网络自己决定从哪个尺度的哪个位置取信息。小目标可从高分辨率浅层取细节，大目标从深层取语境。

### 复杂度对比

设 encoder 有 $N_q=\sum_l H_lW_l$ 个 query。标准 DETR self-attention：

$$O\big(H^2W^2\,C\big)\quad(\text{关于像素数平方})$$

MSDeformAttn encoder：

$$O\big(N_q\cdot C\,(LK)\big)=O\big(HW\,C\big)\quad(\text{关于像素数线性})$$

因每 query 只碰 $LK$ 个常数级采样点。线性复杂度让 encoder 能吃下多尺度高分辨率特征，这是 10× 提速与小目标增益的共同来源。

## 深化：参考点、two-stage、迭代精修

- **decoder 参考点来源**：decoder 的每个 object query（可学习 embedding）经一个 $\text{Linear}+\text{sigmoid}$ 预测一个 $[0,1]^2$ 的参考点 $\hat p_q$，作为该 query 的"框中心先验"。cross-attention 即以此为中心做 MSDeformAttn，等价于让 query 从"它猜测目标所在处"周围采证据，聚焦快、收敛快。
- **iterative bounding box refinement**：每层 decoder 不从零回归框，而是在**上一层预测框的基础上做相对精修**——第 $d$ 层输出 $\hat b^{d}=\sigma(\Delta b^d+\sigma^{-1}(\hat b^{d-1}))$，参考点也随之更新。逐层收窄，定位更准。
- **two-stage 变体**：把 encoder 输出的每个像素当作 **region proposal**，用一个检测头打分并回归粗框，取 top-k 作为 decoder 的初始 query 及其参考点（而非纯可学习 query）。这套"**encoder 选点做 query**"的机制被 [[dino-detr]] 的 **query selection** 直接继承并发扬。
- **为何 50 epoch 收敛**：稀疏可学采样 + 参考点先验，让注意力"出生即聚焦"，省去 DETR 从均匀分布慢慢学聚焦的漫长阶段；线性复杂度又允许多尺度，进一步稳住小目标梯度。综合 10× 提速。

## 关键结果

- COCO 上 **50 epoch** 即超过训练 **500 epoch** 的 DETR，尤其 $\text{AP}_S$（小目标）大幅提升。
- two-stage + iterative refinement + 更强 backbone 时 AP 进一步显著上探，验证多尺度稀疏注意力的可扩展性。
- 单卡显存/算力占用相对 DETR 大幅下降，工程可落地。

## 对 OCR 文档检测的启示

文档检测天然面对**密集小目标 + 大尺度跨度**（正文小字符与整块表格/印章并存），Deformable DETR 的适配价值很高：

- **多尺度稀疏采样**直击密集小字符：高分辨率浅层保留笔画细节，无需 FPN 即可跨尺度融合，小文本框召回显著优于单尺度 DETR。
- **线性复杂度**允许在整页高分辨率特征上跑 encoder，密集版面（几百个文本实例）不再爆显存。
- **参考点 + 迭代精修**天然贴合文本框定位：以行/字中心为参考点逐层收紧，对长宽比极端的文本行更稳。
- **two-stage query selection** 让 query 数随版面自适应，密集页面用更多 proposal，稀疏页面省算力。
- 检测框输出可直接喂给后端 AR decoder（[[trocr]]），与 [[vit]] backbone 亦可无缝拼接。

## 关联

- [[detr]]：被本文修复的原始集合预测检测器。
- [[dino-detr]]：继承 two-stage query selection 与迭代精修，加去噪训练集大成。
- [[attention-is-all-you-need]]：标准注意力，其稠密性正是被替换对象。
- [[trocr]]：后端 AR 文本识别，与前端检测框衔接。
- [[vit]]：可作 backbone，与可变形多尺度采样组合。
