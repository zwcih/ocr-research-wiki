---
type: source
title: "Training LMs to Follow Instructions with Human Feedback (InstructGPT/RLHF)"
authors: [Ouyang, et al. (OpenAI)]
year: 2022
arxiv: "2203.02155"
sources: [instructgpt]
tags: [llm, rlhf, alignment, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---

# Training Language Models to Follow Instructions with Human Feedback（InstructGPT，2022）— 深度精读

📄 **原文**：[arXiv:2203.02155](https://arxiv.org/abs/2203.02155) · [PDF](https://arxiv.org/pdf/2203.02155)

> 用「监督微调 → 训练奖励模型 → PPO 强化学习」三步 RLHF 对齐 GPT-3；结果 1.3B 的 InstructGPT 输出竟被人类偏好于 100× 大的 175B GPT-3。

## 一句话定位
InstructGPT 把 RLHF（Reinforcement Learning from Human Feedback）工程化为标准三步流程，证明「对齐人类偏好」比「单纯放大参数」更能提升有用性——这是 ChatGPT 的直接技术前身。

## 核心贡献
1. **三步 RLHF 流程**：(1) SFT：用标注者示范数据监督微调 GPT-3；(2) RM：让标注者对模型多个输出排序，训练奖励模型预测偏好；(3) PPO：以 RM 为奖励信号用 PPO 强化学习优化策略。
2. **对齐 > 规模**：1.3B InstructGPT 输出被偏好于 175B GPT-3；175B InstructGPT 相对 175B GPT-3 胜率 **85±3%**，相对 few-shot GPT-3 胜率 **71±4%**。
3. **多维改善**：真实性提升（封闭域幻觉率 41%→**21%**）、毒性下降，且对公开 NLP 基准几乎无回退。
4. **PPO-ptx 缓解 alignment tax**：在 PPO 中混入预训练梯度，修复了纯对齐导致的公开数据集性能回退（「对齐税」）。

## 架构 / 方法细节
- **模型规模**：1.3B / 6B / 175B，全用 GPT-3 架构。奖励模型基于 6B 版本。
- **数据来源**：40 名经筛选测试的合同标注者（Upwork/ScaleAI）；prompt 来自 OpenAI API Playground 提交 + 标注者自写；过滤 PII，每用户 ID 限 200 条。
- **三个数据集**：SFT ≈ **13k** 训练 prompt；RM ≈ **33k** 训练 prompt（含排序对比）；PPO ≈ **31k** prompt（仅用于 RLHF，无人工标签）。
- **SFT 训练**：16 epoch、余弦学习率衰减、残差 dropout 0.2；虽 1 epoch 后已过拟合验证损失，但更多 epoch 仍提升 RM 分与人类偏好。
- **RM**：把最后 unembedding 层换成标量输出，用 pairwise 排序损失训练，预测哪个输出更受偏好。
- **PPO 目标**：最大化 RM 奖励，同时每 token 加 **KL 惩罚**（相对 SFT 模型）防过度优化 RM；value function 从 RM 初始化；PPO-ptx 额外混入预训练损失（系数 γ，PPO 版 γ=0）。KL 系数 β 与预训练系数 γ 控制两项强度。

## 关键结果（真实数字）
- **偏好胜率**：1.3B PPO-ptx > 175B GPT-3；175B InstructGPT 对 175B GPT-3 达 85%、对 few-shot GPT-3 达 71%。
- **真实性（TruthfulQA）**：幻觉率 41%→21%，更可靠遵守显式约束。
- **毒性（RealToxicityPrompts）**：被指示「保持尊重」时毒性显著低于 GPT-3。
- **对齐税**：纯 PPO 在公开 NLP 数据集有回退，PPO-ptx 在不损失偏好分的前提下修复。
- 仍会犯简单错误，说明 RLHF 非万能，但性价比远超单纯扩参。

## 为什么是里程碑
- 确立 RLHF 为 LLM 对齐的标准方法（SFT+RM+PPO 三件套），直接催生 ChatGPT。
- 证明「人类偏好对齐」的样本效率极高：小模型 + 对齐 > 大模型无对齐。
- 首次系统量化「alignment tax」并给出缓解方案，成为后续对齐研究基线。

## 关联
- 被对齐的基座模型：[[gpt3]]
- 骨干架构：[[attention-is-all-you-need]]
- 指令数据/text-to-text 思路渊源：[[t5]]
- 开源对齐路线的基座：[[llama]]
- 双向理解式对照：[[bert]]
