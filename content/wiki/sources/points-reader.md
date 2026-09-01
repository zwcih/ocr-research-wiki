---
type: source
title: "POINTS-Reader: Distillation-Free Adaptation of VLMs for Document Conversion"
authors: [Tencent WeChat]
year: 2025
arxiv: "2509.01215"
sources: [points-reader]
tags: [ocr, document-parsing, distillation-free, synthetic-data, self-improvement, end-to-end]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---

# POINTS-Reader — 无蒸馏自改进文档转换（腾讯微信，2025）

📄 **原文**：[arXiv:2509.01215](https://arxiv.org/abs/2509.01215) · [PDF](https://arxiv.org/pdf/2509.01215)

> ⭐ 数据方法论：**不靠蒸馏大模型**，纯合成数据 + 迭代自改进，也能训出好后端。对 OCR 系统没有大 teacher 时怎么造数据很有用。

## 一句话
提出**全自动、distillation-free** 框架：不依赖从大模型蒸馏，而用①合成数据构造 + ②
**迭代自改进 (Iterative Self-improvement Stage, ISS)** 缩小合成↔真实差距；端到端单趟直出。

## 核心论点 & 方法
- **反对蒸馏**：靠蒸馏大模型会**掩盖学生模型真实能力**，且大模型自身在表格/公式也不可靠 →
  蒸出来的标签有噪声。
- **两阶段**：① 无蒸馏地构造训练集（合成表格/公式/版面）；② **ISS 迭代自改进**——
  模型自己在真实文档上跑 → 筛高质量输出 → 回灌训练 → 迭代逼近真实分布。

## 对 OCR 系统设计的启示
- **没有强 teacher 也能训**：训练自己的 OCR 模型时若没有可蒸的大模型（或不想被其能力上限锁死），
  ISS 这套"自产自销迭代提纯"是可行路径。
- **合成数据 + 迭代自改进**闭环：先合成打底（覆盖结构多样性），再用真实数据自筛回灌
  （补真实分布）——对表格/公式这种结构化输出尤其有效。
- **警惕蒸馏噪声**：大模型在复杂结构上本就会错，蒸馏会把错传下去。目标系统的后端 AR 若追求结构精度，
  数据要自己把关，别无脑蒸。
- 呼应 [[mineru2.5-pro]]（数据>架构）、[[textbooks-are-all-you-need]]（合成高质量数据）。

## 关联
- 数据驱动同道：[[mineru2.5-pro]]、[[textbooks-are-all-you-need]]、[[data-quality-over-scale]]
- 基准：[[omnidocbench]]
