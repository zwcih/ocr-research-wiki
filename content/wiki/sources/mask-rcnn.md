---
type: source
title: "Mask R-CNN"
authors: [He, Gkioxari, Dollár, Girshick]
year: 2017
venue: ICCV 2017
arxiv: "1703.06870"
sources: [mask-rcnn]
tags: [cv, instance-segmentation, detection, roialign, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---
# Mask R-CNN (2017) — 深度精读

📄 **原文**：[arXiv:1703.06870](https://arxiv.org/abs/1703.06870) · [PDF](https://arxiv.org/pdf/1703.06870)
> 在 Faster R-CNN 上并联一条逐像素 mask 分支，配 RoIAlign 修正量化错位，做出高质量实例分割，且几乎零额外开销。

## 一句话定位
Mask R-CNN 把 Faster R-CNN 从「检测框 + 类别」扩展为「检测框 + 类别 + 逐实例分割 mask」，核心是用 **RoIAlign** 取代有量化误差的 RoIPool，并把 mask 预测与分类**解耦**（每类一张二值 mask、用 sigmoid 而非 softmax 竞争），在 COCO 实例分割、目标检测、人体关键点三个赛道全部夺得单模型最佳，且仅比 Faster R-CNN 多一点点开销、约 5fps。

## 核心贡献
1. **并行 mask 分支**：在每个 RoI 上，除已有的分类 + 框回归两分支外，并联一个小型 FCN，输出 K 个类各一张 m×m 的二值 mask（K 为类别数）。
2. **mask 与 class 解耦**：mask 分支用逐像素 sigmoid + 二值交叉熵，只对 GT 类别对应的那张 mask 计损失；类别由分类分支决定。这避免了各类 mask 相互竞争（softmax 多类竞争会显著掉点），是精度关键设计。
3. **RoIAlign（消除量化错位）**：RoIPool 在把浮点 RoI 映射到特征网格、以及分 bin 时做两次取整量化，导致特征与输入错位，对像素级 mask 危害大。RoIAlign 改用双线性插值在精确浮点位置采样、不做任何量化，显著提升 mask 精度（尤其在严格 IoU 阈值下）。
4. **通用可扩展框架**：把 mask 分支换成「每个关键点一张 one-hot mask」即可做人体姿态估计，验证框架的通用性。
5. **简单高效**：训练简单、只加小开销，可搭配 ResNet / ResNet-FPN / ResNeXt 等骨干灵活替换，深/强骨干持续涨点。

## 关键方法细节
- 结构 = backbone（特征提取，ResNet-FPN 效果最好）+ RPN（沿用 Faster R-CNN 生成 proposal）+ 三分支 head（cls / box / mask）。
- 多任务损失 L = L_cls + L_box + L_mask；L_mask 为平均二值交叉熵，仅在 GT 类的 mask 上计算。
- mask 分支是 FCN，保留空间结构（不像分类那样压成向量），对每个 RoI 独立输出 m×m（如 28×28）掩码。
- RoIAlign 对每个 bin 取固定采样点、双线性插值后聚合（avg/max），对采样点数不敏感。
- 关键点任务：每个关键点建模为 K 张 m×m one-hot mask，训练用 softmax over m² 定位单点。

## 关键结果（真实数字）
- COCO 三赛道全部拿下单模型最佳：实例分割、bbox 检测、人体关键点检测均超越所有已有单模型条目（含 COCO 2016 冠军）。
- RoIAlign 相对 RoIPool 在高 IoU（如 AP75）上带来大幅提升，是掩码质量提升的主因（论文消融明确指出量化错位的危害）。
- 运行约 5fps，仅比 Faster R-CNN 增加很小开销。

## 为什么是里程碑
- 确立「检测 + 实例分割」统一框架，成为实例分割领域多年基线与工业标准（Detectron/Detectron2 的核心）。
- RoIAlign 揭示并修复了 region-based 方法长期存在的特征量化错位问题，影响所有需要空间精度的 RoI 任务。
- 「解耦分类与 mask」的设计思想广泛影响后续分割/多任务网络。

## 关联
- 直接基座：[[faster-rcnn]]（RPN + anchor + RoIPool）。
- 骨干：[[resnet-deep-residual-learning]]、[[vgg]]、[[alexnet]]。
- 语义/实例分割的另一经典范式：[[unet]]（encoder-decoder + skip）。
- 单阶段检测对照：[[yolo]]。
