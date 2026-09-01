---
type: source
title: "Very Deep Convolutional Networks for Large-Scale Image Recognition (VGG)"
authors: [Simonyan, Zisserman]
year: 2014
venue: ICLR 2015
arxiv: "1409.1556"
sources: [vgg]
tags: [cnn, cv, imagenet, depth, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---
# VGG (2014) — 深度精读

📄 **原文**：[arXiv:1409.1556](https://arxiv.org/abs/1409.1556) · [PDF](https://arxiv.org/pdf/1409.1556)
> 用清一色 3×3 卷积把网络堆到 16–19 层，证明「深度本身」是 ImageNet 精度的关键变量。

## 一句话定位
VGG 系统性地把其他架构变量固定住，只增加深度（11→19 层），并用极小的 3×3 卷积核作为唯一构件，得出「网络越深、表示越强」这一核心结论；VGG16/VGG19 因结构极简、迁移性极好，成为此后数年 CV 领域的标准骨干。

## 核心贡献
1. **全 3×3 卷积的规整深堆叠**：所有卷积核统一为 3×3（stride 1、pad 1，保持分辨率），仅靠堆叠层数改变深度；配置 A(11)→E(19) 只在深度上递增，做成一个干净的深度消融。
2. **用小核堆叠替代大核的理论论证**：两层 3×3 感受野等于 5×5，三层等于 7×7，但三层 3×3 只需 27C² 参数，比单层 7×7 的 49C² 少 81%，且多插两次 ReLU 使决策函数更非线性、更具判别力——相当于对大核施加分解式正则。
3. **深度即精度的实证**：论文实验直接证明 depth 是提升精度的主因，且当把 B 网的每对 3×3 换成等感受野的 5×5 时 top-1 error 上升约 7%，坐实「深 + 小核 > 浅 + 大核」。
4. **多尺度训练/测试（scale jittering）**：训练时把最短边 S 从 [256,512] 随机采样，测试时在多个尺度 Q 上跑并平均后验，显著提升精度。
5. **可复用的通用特征**：把预训练网倒数第二层 4096-D 激活当作图像描述子 + 线性 SVM，无需微调即在 VOC/Caltech 上刷 SOTA，开启「ImageNet 预训练 → 下游迁移」范式。

## 关键架构 / 训练细节
- 结构：数个 3×3 conv 堆 + 5 个 2×2/stride2 max-pool，通道从 64 每过一次 pool 翻倍到 512；末端 FC-4096 / FC-4096 / FC-1000 + softmax。
- LRN 被验证无益（A-LRN 不优于 A），故 B–E 均不用归一化。1×1 卷积（配置 C）加非线性有帮助，但捕捉空间上下文的 3×3（D）仍更强（D>C）。
- 训练：SGD，batch 256，momentum 0.9，weight decay 5e-4，前两个 FC 用 Dropout 0.5；lr 初始 1e-2、验证不降则 ÷10（共降 3 次），74 epoch / 370K iter 收敛。
- 深层初始化难题：先训浅层 A，再用 A 的前 4 卷积层和后 3 FC 层初始化更深网络（后来发现用 Glorot 初始化也可）。
- 测试期把 FC 转成卷积（第一个 FC→7×7 conv、后两个→1×1 conv），做全卷积 dense 评估；dense 与 multi-crop 互补，融合更好。四块 Titan Black 上单网训练 2–3 周。

## 关键结果（真实数字）
- 单网最好：**24.4% / 7.0% top-1/top-5 test error**（配置 E，multi-crop & dense）。
- 双网（D+E）ensemble：top-5 **6.8%**（val），提交时 7 网 ensemble 为 7.3%。
- ILSVRC-2014：分类第 2 名（GoogLeNet 6.7% 略胜），定位第 1 名（25.3% error）。
- 迁移：VOC-2007 mAP 89.3%、Caltech-256 mean recall 86.2%（D+E），大幅超越先前手工/浅层表示。

## 为什么是里程碑
- 把「加深网络」从经验直觉变成有对照实验支撑的结论，直接推动了后续更深网络的探索。
- VGG16/19 结构极简、权重公开，成为检测、分割、caption、风格迁移等无数任务的默认骨干与感知损失来源。
- 暴露了纯堆叠在 ~19 层饱和的问题，为解决更深退化的残差学习埋下伏笔。

## 关联
- 前身与对照：[[alexnet]]（大核）、同届的 [[googlenet]]（Inception）。
- 直接后继、破解深度退化：[[resnet-deep-residual-learning]]。
- 作为检测/分割骨干：[[faster-rcnn]]、[[mask-rcnn]]、[[unet]]。
- 视觉主干范式最终被 Transformer 取代：[[vit]]。
