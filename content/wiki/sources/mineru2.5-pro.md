---
type: source
title: "MinerU2.5-Pro: Data-Driven Document Parsing (same 1.2B architecture)"
authors: [OpenDataLab / Shanghai AI Lab]
year: 2026
arxiv: "2604.04771"
sources: [mineru2.5-pro]
tags: [ocr, document-parsing, data-engine, training-strategy, grpo, omnidocbench, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---

# MinerU2.5-Pro — 纯数据/训练驱动的文档解析（2026）

📄 **原文**：[arXiv:2604.04771](https://arxiv.org/abs/2604.04771) · [PDF](https://arxiv.org/pdf/2604.04771)

> ⭐ **架构一字不改，只靠数据+训练策略就 +2.71 分打过 200× 参数的大模型**。对 OCR 系统造模型是当头一棒的方法论：数据 > 架构花活。

## 一句话
保持 [[mineru2.5]] 的 1.2B 架构**完全不变**，只做数据工程 + 训练策略：
Data Engine 扩到 **65.5M 页**（围绕覆盖度/难度/质量共设计），三阶段渐进训练，
OmniDocBench v1.6 拿 **95.69**，超所有现有方法（含 200× 参数的大模型）。

## 核心论点（这篇的灵魂）
> 不同架构/规模的模型**失败模式高度一致** → 说明瓶颈是**共享的训练数据缺陷**，
> 不是架构差异。所以把力气全砸在数据 + 训练策略上。

## 方法
- **Data Engine**：围绕 coverage（覆盖各种文档）/ difficulty（难样本）/ quality（标注质量）
  三轴共同设计，产出 65.5M 页训练数据。
- **三阶段渐进训练**：① 大规模预训练 → ② 难样本微调 → ③ **GRPO 对齐**，
  分别吃不同质量层级的数据。
- **顺带修基准**：纠正 OmniDocBench v1.5 的元素匹配偏差 + 加 Hard 子集 → 更有区分度的 v1.6。

## 对 OCR 系统设计的启示
- **别一上来卷架构**：这篇实证——同架构下数据+训练能吃到 +2.71 且超大模型。检测前端DETR/后端AR
  定型后，**回报最高的是数据引擎**（合成 + 难样本挖掘 + 质量控制），不是继续改网络。
- **失败模式一致性**是个好诊断工具：如果目标模型和别人错在同样地方，先怀疑数据不是架构。
- **三阶段渐进 + GRPO**：预训练→难样本→RL 对齐，这套配方可直接套到目标系统的训练 pipeline；
  GRPO 尤其用于抑制结构幻觉（[[firered-ocr]] 也用了同招）。
- 呼应 [[textbooks-are-all-you-need|phi]] / [[data-quality-over-scale]]：数据质量优先的又一铁证。

## 关联
- 基座：[[mineru2.5]]
- 数据质量主题：[[data-quality-over-scale]]、[[textbooks-are-all-you-need]]
- 同用 GRPO 抑幻觉：[[firered-ocr]]
- 基准：[[omnidocbench]]
