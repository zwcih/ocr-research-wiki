---
type: source
title: "Training Compute-Optimal Large Language Models (Chinchilla)"
authors: [Hoffmann, et al. (DeepMind)]
year: 2022
arxiv: "2203.15556"
sources: [chinchilla]
tags: [llm, scaling-law, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---

# Training Compute-Optimal Large Language Models（Chinchilla，2022）— 深度精读

📄 **原文**：[arXiv:2203.15556](https://arxiv.org/abs/2203.15556) · [PDF](https://arxiv.org/pdf/2203.15556)

> 在固定算力预算下，模型参数量 N 与训练 token 数 D 应**等比例**放大（每翻倍 N 就翻倍 D）；据此用与 Gopher 相同算力训出参数小 4×、数据多 4× 的 70B「Chinchilla」，全面超越 Gopher/GPT-3。

## 一句话定位
Chinchilla 推翻了 Kaplan(2020) 的缩放律：当时的大模型（GPT-3、Gopher、MT-NLG）都被「严重训练不足」，因为业界只顾放大参数而忽视了同步放大数据。

## 核心贡献
1. **新缩放律：N 与 D 等比放大**。三种独立方法一致得出：算力翻倍时，参数与训练 token 应各放大约 √2，即 N∝C^0.5、D∝C^0.5——对应经验法则「每参数约 20 个训练 token」。这与 Kaplan(2020)「几乎全部算力投给参数」的结论相反。
2. **实证验证（Chinchilla）**：用与 Gopher(280B) 完全相同的算力（5.76×10²³ FLOPs），训一个 **70B 参数 + 1.4 万亿 token**（参数 1/4、数据 4×）的模型。
3. **全面胜出**：Chinchilla 在众多下游任务上**一致且显著**超越 Gopher(280B)、GPT-3(175B)、Jurassic-1、MT-NLG(530B)；且推理/微调算力大幅降低。
4. **MMLU SOTA**：平均准确率 **67.5%**，比 Gopher 提升 >7%。

## 架构 / 方法细节（三种方法估计最优前沿）
- **Approach 1（固定模型、变 token 数）**：训 400 个模型（70M–16B 参数、5B–500B token），沿训练曲线取 (N,D,L)，拟合每个 FLOP 预算下最优模型大小。
- **Approach 2（IsoFLOP profiles）**：固定若干 FLOP 预算，变模型大小，对每条 IsoFLOP 曲线拟合抛物线找 loss 最低点，直接读出最优 N 与 D。
- **Approach 3（参数化 loss 拟合）**：把所有实验最终 loss 建模为 `L(N,D) = E + A/N^α + B/D^β` 的参数函数，解析求最优分配。
- **三者一致结论**：对 Gopher 的算力，最优模型应**小 4 倍、数据多 4 倍**。
- 与 Kaplan(2020) 的关键差异：Chinchilla 的分析多用 >500M 参数模型，且沿完整训练轨迹取点，故得出更「重数据」的最优前沿。
- Chinchilla 与 Gopher 用**相同架构/tokenizer**，仅改变 N/D 分配与优化，确保对比公平。

## 关键结果（真实数字）
- **Chinchilla 70B / 1.4T token** vs **Gopher 280B / 300B token**：同算力，Chinchilla 全面更优。
- **MMLU 67.5%**（+7% over Gopher）。
- 结论：GPT-3、Gopher、MT-NLG 等大模型都「训练不足」——同算力下应更小、喂更多数据。
- 附带收益：更小的模型显著降低推理与微调成本，利于下游落地。

## 为什么是里程碑
- 重写了 LLM 训练的资源分配准则，「Chinchilla-optimal（~20 token/参数）」成为业界标准起点。
- 直接启发 LLaMA 等「小模型多喂数据」路线，把推理成本纳入考量。
- 用严谨三方法交叉验证，树立缩放律实证研究范式。

## 关联
- 被推翻的前缩放律与「训练不足」的对象：[[gpt3]]
- 直接受其启发并进一步走向推理最优：[[llama]]
- 训练配方渊源：[[t5]]
- 骨干架构：[[attention-is-all-you-need]]
- 数据规模/质量权衡：[[data-quality-over-scale]]
