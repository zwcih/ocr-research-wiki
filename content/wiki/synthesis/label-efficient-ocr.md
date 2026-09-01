---
type: synthesis
title: 降低标注依赖的几条路径（OCR 识别）
sources: [seqclr, trocr, crnn, donut, synthetic-data-for-ocr, handwriting-synthesis]
tags: [ocr, self-supervised, label-efficiency, synthetic-data, contrastive-learning]
created: 2026-07-29
updated: 2026-07-29
---

# 降低标注依赖的几条路径

OCR 识别（尤其手写、少见字体、多语种）最大的成本是**真实标注**。相关论文从不同角度回答同一个问题：如何减少人工标注并保持识别性能。本页对这些方法做横向梳理。

## 五条路径

### 1. 自监督对比预训练（用无标签真实图）
- 代表：[[seqclr]]。核心是 [[instance-mapping]] 把 SimCLR 的整图对比扩到序列级 + [[contrastive-learning]]。
- 收益：**无标签真实图**就能把编码器表示学好，低监督场景涨点最明显，100% 标注微调还能到 SOTA（IAM WER −9.5%）。
- 代价：需要设计序列保持增广 + 变长 projection head；预训练阶段本身不产生识别能力，要接 decoder 微调。

### 2. 大规模合成预训练（用无成本合成图）
- 代表：[[trocr]]。先在**数亿合成文本行图**上预训练，再下游微调；未用额外人工标注即媲美用私有数据的方法（IAM CER 2.89）。
- 收益：合成数据零标注成本、可无限量；配合预训练大模型权重（DeiT/BEiT + RoBERTa）红利叠加。
- 代价：合成-真实 domain gap；对手写/复杂版式，合成真实感是瓶颈 → 引出路径 4/5。

### 3. 迁移预训练大模型权重（借外部预训练）
- 代表：[[trocr]] 用 CV（DeiT/BEiT）+ NLP（RoBERTa）预训练权重初始化编解码器；[[donut]] OCR-free 也靠预训练 VLM 底座。
- 收益：把别的领域海量预训练红利直接搬进 OCR，不用自己从零学表示。
- 代价：架构被预训练模型形态约束；词表/patch 尺寸等要对齐。

### 4. 更真实的合成数据方法（提升合成质量）
- 代表：[[synthetic-data-for-ocr]]（source-of-truth / 难样本驱动 / agent 多样化）。
- 收益：从"多"转向"像 + 难"，缩小 domain gap，把路径 2 的上限抬高。

### 5. 手写文本生成 HTG（专攻手写稀缺）
- 代表：[[handwriting-synthesis]]（扩散模型 / 风格控制 / 行级生成）。
- 收益：手写是标注最贵的场景，用生成模型造带风格的手写行，直接喂识别器训练。

## 一张对照

| 路径 | 数据来源 | 关键机制 | 最适场景 | 主要代价 |
|---|---|---|---|---|
| 自监督对比 | 无标签真实图 | 序列对比 + instance-mapping | 真实图多、标注少 | 需接 decoder 微调 |
| 合成预训练 | 合成图 | 海量预训练+微调 | 印刷/规整场景 | domain gap |
| 迁移权重 | 外部预训练 | 权重初始化 | 想省表示学习 | 架构受限 |
| 真实合成 | 高质量合成 | 难样本/多样化 | 复杂版式 | 生成成本 |
| HTG | 生成手写 | 扩散+风格控制 | 手写 | 生成质量 |

## 方法组合与落地取舍

- **它们不互斥，是可叠加的 pipeline**：典型组合 = 合成/HTG 造量（路径 2/4/5）→ 无标签真实图上自监督对比预训练编码器（路径 1）→ 少量真实标注微调后端 AR 解码。
- **后端 AR 的视觉编码器**最该吃路径 1：AR 解码本身很吃标注，编码器先用 [[seqclr]] 式序列对比在无标签真实图上打底，能明显省真实标注量。instance-mapping 让 frame 表示更贴字符边界，对下游自回归解码友好。
- **前端 DETR 检测**同样受益路径 2/4/5：版式/区块检测的框标注也贵，合成文档 + 真实感增强能补。
- **优先级**：手写/多语种/少见字体这些标注最稀缺的方向，路径 1+5 组合性价比最高；印刷规整场景路径 2+3 就够。

## 相关页
[[seqclr]] · [[instance-mapping]] · [[contrastive-learning]] · [[trocr]] · [[crnn]] · [[donut]] · [[synthetic-data-for-ocr]] · [[handwriting-synthesis]]
