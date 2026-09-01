---
type: source
title: "Extracting and Composing Robust Features with Denoising Autoencoders (DAE)"
authors: [Vincent, Larochelle, Bengio, Manzagol]
year: 2008
venue: ICML 2008
sources: [dae]
tags: [self-supervised, denoising, representation-learning, foundational]
created: 2026-07-29
updated: 2026-07-29
---

# DAE (2008) — 去噪自编码器，denoising 信号的源头

📄 **原文**：[DOI:10.1145/1390156.1390294](https://doi.org/10.1145/1390156.1390294)

📄 ICML 2008，Vincent/Larochelle/Bengio/Manzagol（Université de Montréal）

## 一句话
提出一个无监督表示学习原则：**让表示对输入的部分损坏（corruption）鲁棒**。把输入随机破坏（如置零/加噪）后，训练 autoencoder **从损坏版本重建干净原图**，逼它学到有意义的高层特征，而不是退化成 identity 映射。

## 核心贡献
- **denoising criterion**：corrupt → encode → decode 回 clean。破坏输入是关键，否则 autoencoder 学恒等映射没用。
- 可从**流形学习 / 信息论 / 生成模型**多个视角解释：学到的是把损坏点拉回数据流形的映射。
- **stacked DAE** 可用于深层网络的逐层无监督预初始化（2008 年深度网络还难训，这是当时的破局点之一）。
- 实验证明"破坏输入"在分类基准上带来惊人优势。

## 为什么现在还重要（与 OCR 表征学习直接相关）
- **denoising 是一切 masked/corruption 式自监督的祖先**：BERT 的 MLM、[[beit]]/[[simmim]]/[[mae]] 的 MIM，本质都是"corrupt 输入 → 重建"的 denoising，只是 corruption 换成了 masking。BEiT 论文自己就说 MIM 来自"denoising auto-encoding idea"。
- OCR encoder 预训练 里把 **denoising 作为独立信号**，就是回到 DAE 的一般形式：corruption 不限于 mask（可以是高斯噪声、模糊、椒盐、笔画扰动等），比纯 MIM 的"遮块"更丰富，对**手写/低质文档扫描**尤其对味（真实退化就是各种噪声）。
- 组合逻辑：MIM = 结构化 corruption（遮块重建上下文）；denoising = 一般 corruption（去噪重建，抗真实退化）；SeqCLR = 判别对比。三者覆盖 "生成×去噪×判别" 三面。

## 谱系
denoising 血统 → [[beit]]/[[simmim]]/[[mae]]（MIM 是 masking 式 denoising）→ [[dig]]（文本识别里把 MIM+对比合流）。见 [[label-efficient-ocr]]。
