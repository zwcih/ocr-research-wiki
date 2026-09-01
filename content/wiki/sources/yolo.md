---
type: source
title: "You Only Look Once: Unified, Real-Time Object Detection (YOLO)"
authors: [Redmon, Divvala, Girshick, Farhadi]
year: 2015
venue: CVPR 2016
arxiv: "1506.02640"
sources: [yolo]
tags: [cv, detection, real-time, one-stage, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---
# YOLO (2015) — 深度精读

📄 **原文**：[arXiv:1506.02640](https://arxiv.org/abs/1506.02640) · [PDF](https://arxiv.org/pdf/1506.02640)
> 把目标检测重构成一个「单次前向、直接回归框和类概率」的问题，一张网跑到底，实时 45fps（Fast YOLO 155fps）。

## 一句话定位
YOLO 抛弃「先提候选框再分类」的多阶段流水线，把整幅图划成 S×S 网格，用单个卷积网络一次性回归所有框坐标 + 置信度 + 类概率，端到端直接优化检测指标，是「单阶段（one-stage）实时检测」范式的开山之作。

## 核心贡献
1. **检测=回归的统一模型**：整图输入、单次网络评估，同时预测全图所有类的所有框——网络对全图做全局推理，隐式编码上下文，比 Fast R-CNN 少一半以上的背景误检。
2. **网格 + anchor-free 直接回归**：图分 S×S 网格，物体中心落在哪格哪格负责；每格预测 B 个框（各含 x,y,w,h,confidence）和 C 个条件类概率，输出编码为 S×S×(B·5+C) 张量。VOC 上 S=7,B=2,C=20 → 7×7×30。
3. **极致速度**：base YOLO 在 Titan X 上 45fps、Fast YOLO 155fps，是当时最快的通用检测器，延迟 <25ms 可处理实时视频流。
4. **强泛化**：在自然图训练、艺术品（Picasso/People-Art）测试时，AP 下降远小于 R-CNN/DPM——因为 YOLO 建模了物体的尺寸、形状和空间关系而非局部像素。
5. **可与 Fast R-CNN 互补融合**：用 YOLO 剔除 Fast R-CNN 的背景误检，把最佳 Fast R-CNN 从 71.8 提到 75.0 mAP（+3.2），且因错误类型不同，收益非简单集成。

## 关键架构 / 方法细节
- 网络受 GoogLeNet 启发：24 卷积层 + 2 全连接层，用交替 1×1 降维 + 3×3 卷积替代 Inception；Fast YOLO 只用 9 卷积层。
- 预训练：前 20 卷积层在 ImageNet 224×224 上训约一周（single-crop top-5 88%），检测时加 4 卷积 + 2 FC 并把分辨率升到 448×448，末层线性激活、其余用 leaky ReLU(0.1)。
- 损失：sum-squared error，但用 λcoord=5 加大坐标损失、λnoobj=0.5 压低无物体格的置信度损失以稳训练；对 w,h 取平方根，让小框误差权重更高；每格只让与 GT IoU 最高的那个预测器「负责」，促成尺寸/长宽比专门化。
- 训练：VOC07+12 上 135 epoch，batch 64，momentum 0.9，decay 5e-4；lr 先从 1e-3 缓升到 1e-2，再 1e-2(75)→1e-3(30)→1e-4(30)；Dropout 0.5 + 随机缩放平移(±20%) + HSV 曝光/饱和度扰动。
- 推理：每图仅 98 个框，NMS 加 2–3 mAP。
- 局限（论文自陈）：每格仅 2 框 1 类，难处理成群小物体（如鸟群）；对新长宽比泛化差；主要误差来源是定位不准。

## 关键结果（真实数字）
- PASCAL VOC 2007：**YOLO 63.4 mAP @ 45fps**；Fast YOLO 52.7 mAP @ 155fps（是其他实时检测器 2×精度）；YOLO-VGG16 66.4 @ 21fps。
- 误差剖析：YOLO 定位误差 19.0% 但背景误检仅 4.75%；Fast R-CNN 背景误检高达 13.6%（约 3× YOLO）。
- VOC 2012：YOLO 57.9 mAP（接近原始 R-CNN），在 bottle/sheep/tv 等小物体上落后 8–10%，但 cat/train 更高。

## 为什么是里程碑
- 开创单阶段实时检测范式，与两阶段 Faster R-CNN 形成检测器两大流派，直接催生 YOLOv2/v3…及 SSD、RetinaNet。
- 证明「全图全局推理」能显著降低背景误检，并带来跨域强泛化。
- 把检测做成可端到端联合优化的单一网络，极大简化了工程落地。

## 关联
- 两阶段对照：[[faster-rcnn]]（RPN + anchor）、其骨干 [[vgg]]。
- 骨干灵感来源：[[googlenet]]（1×1 降维 + 3×3）。
- 实例分割方向的两阶段代表：[[mask-rcnn]]。
- 早期检测谱系起点：[[alexnet]]（R-CNN 骨干）。
