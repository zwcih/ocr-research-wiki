---
type: source
title: "Textbooks Are All You Need (phi-1)"
authors: [Gunasekar, Zhang, Aneja, et al. (Microsoft Research)]
year: 2023
arxiv: "2306.11644"
sources: [textbooks-are-all-you-need]
tags: [llm, data-quality, phi, small-model, milestone]
created: 2026-07-23
updated: 2026-07-23
---

# Textbooks Are All You Need (phi-1, 2023)

📄 **原文**：[arXiv:2306.11644](https://arxiv.org/abs/2306.11644) · [PDF](https://arxiv.org/pdf/2306.11644)

> 里程碑 ⭐ — "数据质量 > 数据规模/模型规模"路线的代表作，开启 phi 小模型系列。

## 一句话定位

用高质量、"教科书级"的合成 + 筛选数据，训练出仅 **1.3B 参数**的 phi-1，
在代码生成上媲美甚至超过大得多的模型，挑战"更大即更强"的 scaling 惯性。

## 核心贡献

1. **[[data-quality-over-scale|数据质量优先]]**：精心筛选"教科书质量"的网络代码数据
   + 用 GPT-3.5 生成的合成教科书与练习题。
2. 小模型 + 小数据也能强：phi-1 仅 1.3B 参数、约 7B tokens 训练。
3. 揭示：数据质量对能力涌现的影响可能超过单纯堆参数/堆算力。

## 关键结果

- phi-1 在 **HumanEval 达 50.6%** pass@1，**MBPP 55.5%**
- 参数量比同等表现模型小一个数量级，训练成本大幅降低

## 为什么是里程碑

- 沿用 [[attention-is-all-you-need|Attention Is All You Need]] 的标题模因，成为"数据中心 AI"标志
- 催生 phi-1.5 / phi-2 / phi-3 系列，推动小模型 (SLM) 与合成数据研究热潮
- 对文档智能/OCR 有启示：高质量领域数据的合成与筛选同样是关键杠杆

## 关联

- 与 [[data-quality-over-scale|数据质量优先]] 理念直接相关
- 标题呼应 [[attention-is-all-you-need|Transformer]]
