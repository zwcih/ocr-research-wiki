---
type: source
title: SeqCLR — Sequence-to-Sequence Contrastive Learning for Text Recognition
sources: [seqclr]
tags: [ocr, self-supervised, contrastive-learning, representation-learning, htr, ctc, attention]
created: 2026-07-29
updated: 2026-07-29
---

# SeqCLR — 序列到序列对比学习用于文本识别

📄 **原文**：[arXiv:2012.10873](https://arxiv.org/abs/2012.10873) · [PDF](https://arxiv.org/pdf/2012.10873)

📄 **原文**：[arXiv:2012.10873](https://arxiv.org/abs/2012.10873) · [PDF](https://arxiv.org/pdf/2012.10873)
- **arXiv**：2012.10873（v1 2020-12-20），**CVPR 2021**
- **作者**：Aviad Aberdam, Ron Litman（共同一作）, Shahar Tsiper, Oron Anschel, Ron Slossberg, Shai Mazor, R. Manmatha, Pietro Perona
- **机构**：AWS / Technion / Caltech
- **一句话**：**首个把自监督对比表示学习用到文本识别的工作**。把 SimCLR 那种"整图一个向量"的对比学习扩展到"序列"，在无标签文本图像上预训练视觉表示。

## 问题动机

- 对比学习（[[contrastive-learning]]、SimCLR/MoCo）在图像分类/检测/分割上大获成功，但几乎没被用到文本识别。
- 原因：现有对比方案把**图像当原子输入**——一张图 = 一个类，增广后自己配自己是正对，其它图全是负例。
- 但文本识别里，一个词是**字符序列**，一张词图最好建模成一串相邻的图像切片（frames），每个 frame 可能是不同字符类。所以"整图对比"不适用。

## 核心方法（五个模块，见论文 Fig.4）

建立在标准文本识别四段式架构上（Transformation TPS → CNN 特征提取 map-to-sequence → BiLSTM 序列建模 → CTC/Attention 解码）。SeqCLR 的预训练框架：

1. **序列保持增广**（stochastic augmentation）：同一图增广两次得正对，但必须保证 **sequence-level alignment**。
2. **base encoder f(·)**：取识别器架构的前若干段，输出序列表示 R∈R^(F×T)，T 随图宽变化。两种取法：纯视觉特征 V，或经 BiLSTM 后的上下文特征 H（后者更好）。
3. **projection head g(·)**：预训练后丢弃。MLP 只能处理定长，所以提出两种新的能处理变长序列的 head——逐帧 MLP head、以及 BiLSTM head（补上下文）。
4. **instance-mapping m(·)**（⭐ 核心创新）：把 T 个 frame 映射成 T' 个 instance，instance 才是对比 loss 的原子单位。见 [[instance-mapping]]。
5. **对比 loss**：NCE / InfoNCE，cosine 相似度，把 Z^a、Z^b 中对应下标的 instance 拉近（正对），其它推远。

### instance-mapping 三种（论文 Fig.5）

- **All-to-instance**：所有 frame 平均成 1 个 instance（m=Avg）。对序列错位最鲁棒（适合任意形状的场景文字），但负例数最少。
- **Frame-to-instance**：每 frame 一个 instance（m=identity）。负例最多、样本效率高，但对错位敏感。
- **Window-to-instance**：每几帧一个 instance（adaptive avg pooling 定长 T'）。前两者的折中——错位鲁棒性 vs 样本效率。**综合最优**。

### 序列保持增广（论文 Fig.2/6）

- **避免**水平翻转、大幅旋转、大幅水平平移、激进水平裁剪——这些会打乱字符顺序造成 sequence-level 错位，正对配不上。
- **采用**垂直裁剪、模糊、噪声、锐化、透视/仿射变换、垂直梯度、线性对比度等不破坏阅读顺序的增广。

## 评测协议创新

- **decoder evaluation protocol**：把常用的 linear evaluation（冻结 encoder 接线性分类器）扩展到 encoder-decoder 网络——冻结自监督学到的表示，只训练一个文本 decoder（CTC 或 attention），用识别精度衡量表示质量。

## 关键结果

- 在手写（IAM/RIMES/CVL）和场景文字上，SeqCLR 学到的表示接 decoder 微调后，**显著优于非序列的 SimCLR**（同样对比学习但整图级）。
- **低监督场景涨点明显**：标注数据减少时，SeqCLR 比全监督训练更好。
- **100% 标注微调达 SOTA**（当时手写基准）：word error rate 相比降低 **IAM −9.5%、RIMES −20.8%**。

## 对 OCR 表征学习的借鉴

- 后端 AR 解码器的**视觉编码器**在手写/少见字体/多语种等标注稀缺场景，可以先用 SeqCLR 式序列对比**预训练打底**再微调。
- "**序列作为对比单位 + instance-mapping**"这个抽象比直接套 CLIP/SimCLR 更贴合结构化识别；即便后端换成 AR 生成，让编码器输出的 frame 序列表示本身更判别、更对齐字符边界，对下游解码有利。
- window-to-instance 的"错位鲁棒 vs 样本效率折中"思路，可迁移到任何需要在变长序列上做自监督/对齐的模块设计。

## 谱系位置

- 上游：[[contrastive-learning]]（SimCLR/MoCo）、CRNN/[[ctc]]（识别架构地基）
- 同类/下游：后续 OCR 自监督表示学习（如 PerSec、DiG 等把 SeqCLR 思路继续推进）
- 与库内 [[trocr]] 对照：TrOCR 走"大规模合成预训练 + Transformer"，SeqCLR 走"无标签真实图 + 序列对比"，两条降低标注依赖的不同路径
