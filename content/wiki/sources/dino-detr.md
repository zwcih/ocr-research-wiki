---
type: source
title: "DINO: DETR with Improved DeNoising Anchor Boxes"
authors: [Zhang, Li, Liu, Zhang, Su, Zhu, Ni, Shum (IDEA / HKUST)]
year: 2022
venue: ICLR 2023
arxiv: "2203.03605"
sources: [dino-detr]
tags: [detection, detr, denoising, query-selection, sota, frontend, milestone]
reading: deep
created: 2026-07-23
updated: 2026-08-06
---

# DINO — DETR with Improved DeNoising Anchor Boxes (2022)

📄 **原文**：[arXiv:2203.03605](https://arxiv.org/abs/2203.03605) · [PDF](https://arxiv.org/pdf/2203.03605)

> ⭐ DETR 系的 SOTA 拐点，也是**检测前端最值得直接拿来当骨架**的一篇。首次让 DETR-like 上到 63 AP。

## 一句话

DINO 用 **Contrastive DeNoising、Mixed Query Selection、Look Forward Twice** 三招把 DETR 系收官成 SOTA：12 epoch 即达 49.4 AP，大 backbone 刷到 63.3 AP COCO——首次让 DETR 家族在收敛速度与精度上同时压过经典检测器，是作者前端 DETR 检测最值得直接当骨架的一篇。

## 前置脉络：DAB-DETR 与 DN-DETR

DINO 站在两篇同组前作之上，理解它必须先理解这两块地基。

**DAB-DETR（Dynamic Anchor Box）** 把原本抽象、语义不明的 decoder query 显式化为 **4D anchor box** $(x,y,w,h)$。query 不再是一团学出来的向量，而是"一个可被逐层修正的框"。每一层 decoder 预测相对增量 $\Delta b^{(l)}$，在 sigmoid 空间做残差 refine：

$$b^{(l)}=\sigma\!\left(\Delta b^{(l)}+\sigma^{-1}\!\left(b^{(l-1)}\right)\right)$$

其中 $\sigma$ 为 sigmoid，$\sigma^{-1}$ 为其逆（logit）。这样每层都在上一层框的基础上做相对细化，位置先验清晰、收敛更快，且宽高 $(w,h)$ 可调制 positional attention 的高斯核尺度，实现"大目标看得宽、小目标看得紧"。这一 anchor 逐层更新式是 DINO 整条 refine 链的基础。

**DN-DETR（DeNoising）** 攻击 DETR 收敛慢的病根——**二分匹配（Hungarian matching）不稳定**：训练早期同一 query 匹配的 GT 在层间/轮次间频繁跳变，优化目标像在抖动。DN 的做法是绕开匹配：把 **GT 框加噪后直接喂给 decoder，令其还原回原 GT**。这条去噪辅助任务提供了确定、稳定的监督信号，与匹配分支并行训练，收敛速度大幅提升。DINO 把这条思路推向对比化。

## 三个核心改进

### 1. Contrastive DeNoising（CDN）

DN-DETR 只教模型"把加噪框拉回 GT"，但没教它"什么时候该拒绝"——于是易产生**重复框与近邻误检**。CDN 引入**对比**：每个 GT 生成两组噪声框。

- **正样本**：噪声尺度受 $\lambda_1$ 约束，$\|\Delta\|<\lambda_1$，模型应把它**还原回该 GT**；
- **负样本**：噪声尺度落在 $\lambda_1<\|\Delta\|<\lambda_2$，即离 GT 稍远，模型应判为 **no-object** $\varnothing$。

加噪同时作用于**中心偏移**与**尺度扰动**：中心 $(x,y)$ 加位移、宽高 $(w,h)$ 缩放，两组共享同一 GT 但落在不同"距离环"上。直觉是让模型学会一条决策边界——**近的还原、稍远的拒绝**。正负样本一内一外夹逼，模型被迫在 $\lambda_1$ 半径处建立"是否为同一目标"的判据，从而**主动抑制对同一目标的重复预测和对近邻的串扰**。

CDN 组与常规匹配部分**并行**送入同一 decoder，但用 **attention mask 严格隔离**：去噪 query 之间、去噪组与匹配 query 之间互不可见，防止 GT 信息通过 self-attention **泄露**给匹配分支（否则等于作弊）。每组含正/负两部分，$2n$ 个 query（$n$ 为 GT 数），可显著扩充有效正负样本对。

### 2. Mixed Query Selection

decoder query 由**位置（anchor）**与**内容（content）**两部分构成，如何初始化直接决定收敛。

- Deformable-DETR 的 two-stage：位置与内容**都**取自 encoder 选中的 top-k 特征；
- DINO 的 mixed：仅从 encoder 输出选 top-k 特征，**用它们初始化 decoder query 的位置 anchor**，而**内容 query 保持静态、可学习**，不用选中特征当 content。

理由：encoder 选出的 top-k 特征是"初步的、可能有偏"的预测——其**位置**信息可靠、值得当强空间先验；但其**内容**特征往往对应"局部歧义/不完整"的目标，若直接拿来当 content query，反而把噪声内容注入了后续解码。保留静态可学习的 content，让内容表示从干净起点出发、由 decoder 自行细化，位置则享受 encoder 的强初始化——**各取所长**。

### 3. Look Forward Twice

DETR 系原本采用 **look forward once**：第 $i$ 层预测框时，会 **detach（截断）参考框的梯度**，即第 $i$ 层的框只由本层 loss 更新，防止梯度在层间累积失稳。DINO 反其道，让**相邻两层联合优化**框预测：用第 $i+1$ 层的辅助 loss 梯度**回流帮助第 $i$ 层参数更新**。

形式化：记第 $i$ 层预测框为 $b_i'=\text{Update}(b_{i-1},\Delta b_i)$，用于 loss 的最终框保留两层的复合更新而**不 detach**：

$$b_i^{\text{pred}}=\text{Update}\!\big(b_{i-1},\,\Delta b_i\big),\qquad b_{i+1}^{\text{pred}}=\text{Update}\!\big(b_i^{\text{pred}},\,\Delta b_{i+1}\big)$$

关键在于计算 $b_{i+1}^{\text{pred}}$ 的 loss 时，梯度可经 $b_i^{\text{pred}}$ 一路回传到第 $i$ 层参数（look forward **twice** = 向前多看一层）。因为下一层的 refine 质量本就依赖上一层给的框，让上一层"预见"并配合下一层，能得到更一致、更准的层间框细化。

## 深化：为何这么强

**12 epoch 49.4 AP、大 backbone 63.3 AP COCO SOTA** 的根因是三改进**分工解决三个瓶颈**：CDN → 匹配不稳 + 重复框，把去噪从"还原"升级为"还原+拒绝"，同时稳收敛与降误检；Mixed Query Selection → query 初始化偏弱，注入 encoder 强位置先验却不污染内容；Look Forward Twice → 层间 refine 梯度被割裂，改为联合优化让框逐层更准。三者叠加，既提速（去噪+强初始化）又提质（对比拒绝+联合 refine），故小 epoch 即高、大模型封顶。

## 对 OCR 文档检测的启示

对文档密集小目标检测而言，DINO 的三项改进具有直接参考价值：

- **CDN 替代 NMS 做去重**：文档中文本行/字符/单元格高度密集且近邻，经典 NMS 靠 IoU 阈值极易误删或漏删。CDN 让模型**在训练中内建"近还原、稍远拒绝"的判据**，天然抑制重复框与近邻串扰，端到端无需 NMS——对密集版面尤为关键。
- **Mixed Query Selection 提供版面强空间先验**：文档目标位置结构性强（栏、行、格）。用 encoder top-k **初始化 anchor** 等于把版面布局的空间先验直接灌给 decoder，而静态 content 保证不被局部歧义内容带偏，对规整版面收敛极快。
- **Look Forward Twice + DAB anchor refine 做紧致文本框定位**：逐层 $b^{(l)}=\sigma(\Delta b^{(l)}+\sigma^{-1}(b^{(l-1)}))$ 的相对细化，配合两层联合优化，能把文本框逐步收紧到紧贴笔画的紧致边界——这对下游 AR 识别的 ROI 裁剪质量至关重要。

**baseline 选型结论**：DINO 是 DETR 系速度/精度双封顶、且原生免 NMS 的检测框架，其 anchor 显式化、去噪对比、强初始化三特性与文档密集小目标高度契合。**前端检测直接以 DINO 为骨架**是当前最优起点；后接 [[trocr]] / [[got-ocr2]] 式 AR 后端即成完整 OCR 流水线。

## 关联

- [[detr]]：端到端集合预测的开山，DINO 的最终形态。
- [[deformable-detr]]：multi-scale deformable attention + two-stage，DINO 的直接骨架来源。
- [[attention-is-all-you-need]]：Transformer 与 attention mask 机制根基（CDN 隔离即靠 mask）。
- [[resnet-deep-residual-learning]] / [[vit]]：backbone 选型（ResNet 与 Swin/ViT，大 backbone 是 63.3 AP 的载体）。
- [[loss-functions]]：Hungarian 匹配、分类 + L1 + GIoU 框回归、去噪 loss。
- [[trocr]] / [[got-ocr2]]：后端 AR 生成，与 DINO 前端检测拼成 OCR 文档智能全链路。
