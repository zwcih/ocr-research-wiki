---
type: source
title: "Faster R-CNN: Towards Real-Time Object Detection with Region Proposal Networks"
authors: [Ren, He, Girshick, Sun]
year: 2015
venue: NeurIPS 2015 / TPAMI
arxiv: "1506.01497"
sources: [faster-rcnn]
tags: [cv, detection, rpn, anchor, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---
# Faster R-CNN (2015) — 深度精读

📄 **原文**：[arXiv:1506.01497](https://arxiv.org/abs/1506.01497) · [PDF](https://arxiv.org/pdf/1506.01497)
> 用 Region Proposal Network 把候选框生成塞进检测网络本身、共享卷积特征，使 region proposal 近乎零成本，实现端到端近实时检测。

## 一句话定位
Faster R-CNN 提出 RPN——一个与检测网络共享全图卷积特征、在每个位置同时回归框和 objectness 的全卷积子网，取代慢速的 Selective Search，把候选框生成边际成本压到 ~10ms，与 Fast R-CNN 合成单一统一网络，在 VGG-16 下达 5fps 且刷新 VOC/COCO SOTA。

## 核心贡献
1. **Region Proposal Network (RPN)**：在最后共享卷积特征图上滑一个 n×n（n=3）小网络，映射到 256/512-d 中间特征后接两个 1×1 sibling 卷积——reg（框坐标）和 cls（是否物体），本身即全卷积网络，可端到端训练专门生成 proposal。
2. **Anchor（多尺度回归参照）**：每个滑窗位置预测 k 个相对参照框的 proposal，默认 3 尺度(128²/256²/512²)×3 长宽比(1:1/1:2/2:1)=9 anchor；用「anchor 金字塔」取代图像金字塔/滤波器金字塔，只需单尺度图和单尺寸滤波器，省大量算力。
3. **共享卷积、统一网络**：RPN 与 Fast R-CNN 共享底层卷积，用「RPN 是检测网络的 attention，告诉它往哪看」的视角把两者合一。
4. **4 步交替训练**：训 RPN → 用其 proposal 训 Fast R-CNN → 用检测网初始化 RPN 只调 RPN 独有层（此时开始共享）→ 固定共享层微调 Fast R-CNN 独有层。也给出近似联合训练（省 25–50% 时间）。
5. **平移不变、参数少**：anchor 与其回归函数平移不变；输出层参数仅 ~2.8×10⁴（对比 MultiBox 的 6.1×10⁶），过拟合风险更低。

## 关键方法细节
- 损失：多任务 = cls（object/not-object 的 log loss，Ncls=256 mini-batch 归一化）+ λ·reg（仅正 anchor 激活的 smooth-L1，Nreg≈2400 归一化），默认 λ=10（1–100 内不敏感）。
- 正样本：与某 GT 的 IoU 最高，或 IoU>0.7；负样本：对所有 GT IoU<0.3。每图随机采 256 anchor、正负比最多 1:1。
- 边界处理：训练忽略跨界 anchor（1000×600 图约 2 万 anchor→约 6000 参与），否则不收敛；测试时对全图跑 RPN 并把越界框裁到边界。
- proposal 用 cls 分数做 NMS（IoU 阈 0.7），留约 2000，取 top-N 送检测；测试单尺度 s=600、总 stride 16。
- 消融关键结论：去掉 reg 只用 anchor 框 mAP 从 69.9→52.1（好框主要靠回归）；去 cls 且 N=100 掉到 44.6（cls 分数决定 top 排序质量）；单 anchor 比 9 anchor 掉 3–4 个点。

## 关键结果（真实数字）
- PASCAL VOC 2007：VGG-16 共享 RPN 300 proposal mAP **69.9%**（07）/ **73.2%**（07+12）/ 78.8%（+COCO），优于 SS 基线且 proposal 近零成本。
- 速度：VGG-16 全流程 198ms（**5fps**），其中 RPN 仅 10ms；ZF 网 17fps。对比 SS+Fast R-CNN 的 1830ms/0.5fps。
- MS COCO：VGG-16 test-dev mAP@.5 42.7% / mAP@[.5,.95] 21.9%。换 ResNet-101 升到 48.4/27.2，是 He 等拿下 ILSVRC & COCO 2015 检测/定位/分割多项冠军的基础。

## 为什么是里程碑
- 首次把「候选框生成」也变成可学习、可共享特征的神经网络模块，终结了外部手工 proposal（Selective Search/EdgeBoxes）时代。
- Anchor 机制成为此后一代检测器（SSD、RetinaNet、Mask R-CNN 等）的通用设计语言。
- 证明检测精度能随骨干变强（VGG→ResNet-101）持续提升，奠定「两阶段检测」范式。

## 关联
- 骨干：[[vgg]]、[[resnet-deep-residual-learning]]、[[alexnet]]（早期 R-CNN 骨干）、[[googlenet]]（MultiBox 用其骨干）。
- 直接扩展到实例分割：[[mask-rcnn]]（在 RoI 上加 mask 分支 + RoIAlign）。
- 单阶段对照路线：[[yolo]]。
- RPN 被作者以「attention 告诉网络往哪看」类比：[[attention-is-all-you-need]]。
