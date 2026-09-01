---
type: source
title: "BERT: Pre-training of Deep Bidirectional Transformers"
authors: [Devlin, Chang, Lee, Toutanova (Google)]
year: 2018
venue: NAACL 2019
arxiv: "1810.04805"
sources: [bert]
tags: [nlp, transformer, pretraining, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---

# BERT: Pre-training of Deep Bidirectional Transformers（2018）— 深度精读

📄 **原文**：[arXiv:1810.04805](https://arxiv.org/abs/1810.04805) · [PDF](https://arxiv.org/pdf/1810.04805)

> 用「Masked LM」让 Transformer encoder 在所有层同时融合左右上下文，做深度双向预训练；只需加一层输出即可微调，横扫 11 项 NLP 任务。

## 一句话定位
BERT 把「预训练 + 微调」范式推向巅峰：一个深度双向 Transformer encoder，用完形填空式目标从无标注文本学表示，再对每个下游任务端到端微调全部参数，几乎无需任务专属结构。

## 核心贡献
1. **深度双向预训练**：论证 deep bidirectional 严格强于单向（GPT）或浅层拼接双向（ELMo 各自独立训练 L2R + R2L 再拼接）。BERT 在**每一层**都联合条件于左右上下文。
2. **Masked LM（MLM）目标**：随机遮盖 **15%** 的 WordPiece token 让模型预测——绕开「双向会让词间接看到自己」的难题。被选中的 token：**80%** 换成 `[MASK]`、**10%** 换成随机词、**10%** 保持不变（缓解 pre-train/fine-tune 间 `[MASK]` 不出现的失配）。
3. **Next Sentence Prediction（NSP）**：50% 用真实下一句(IsNext)、50% 用随机句(NotNext)，二分类，用 `[CLS]` 的表示预测，让模型学句间关系（利于 QA/NLI）。最终 NSP 准确率 97–98%。
4. **统一输入表示**：`[CLS]` + 句A + `[SEP]` + 句B；每 token 表示 = token 嵌入 + segment 嵌入 + position 嵌入之和；WordPiece 30000 词表。

## 架构 / 方法细节
- **两种规模**：BERT-BASE（L=12, H=768, A=12, **110M** 参数，刻意对齐 OpenAI GPT）；BERT-LARGE（L=24, H=1024, A=16, **340M**）。FFN 中间维 = 4H。
- **预训练数据**：BooksCorpus（800M 词）+ 英文 Wikipedia（2500M 词），共 3.3B 词，必须用文档级语料以取长连续序列。
- **预训练超参**：batch=256 序列（128k token/batch）× **1,000,000 步**（≈40 epoch）；Adam lr=1e-4、β=(0.9,0.999)、L2 衰减 0.01、前 10000 步 warmup 后线性衰减；dropout 0.1；**GELU** 激活；损失 = MLM + NSP 均值之和。90% 步用序列长 128，最后 10% 用 512 学位置嵌入。
- **算力**：BASE 用 16 个 TPU chip、LARGE 用 64 个，各训练 **4 天**。
- **微调**：极便宜，SQuAD 单 TPU ~30 分钟到 Dev F1 91.0；batch∈{16,32}、lr∈{5e-5,3e-5,2e-5}、epoch∈{2,3,4}。

## 关键结果（真实数字）
- **GLUE**：BASE 平均 79.6、LARGE **82.1**，官方榜 LARGE **80.5**（GPT 仅 72.8），MNLI **86.7**（+4.6 绝对）。
- **SQuAD v1.1**：LARGE 单模型 Test F1 **91.8**，集成 **93.2**（超人类 91.2）。
- **SQuAD v2.0**：Test F1 **83.1**（+5.1）。
- **SWAG**：LARGE **86.3**，超 ELMo 基线 +27.1、超 GPT +8.3，逼近人类专家 85.0。
- **消融（Table 5）**：去掉 NSP 显著伤 QNLI/MNLI/SQuAD；改成 LTR（单向）无 NSP 全面更差，SQuAD F1 从 88.5 掉到 77.8。加 BiLSTM 也补不回双向。
- **模型规模（Table 6）**：即便 MRPC 只有 3600 样本，更大模型仍严格更优——首次证明「充分预训练后，极大模型也能提升极小数据任务」。
- **特征式用法**：拼接顶部 4 层作特征喂 BiLSTM 做 NER，仅比全微调差 0.3 F1。

## 为什么是里程碑
- 确立「双向掩码预训练 encoder」为 NLU 理解类任务的统治范式，几乎所有理解型模型（RoBERTa、ALBERT、DeBERTa）都是其后代。
- 证明单一预训练模型 + 极简微调可通吃句级与词级任务，终结了「每任务定制架构」时代。
- 与 GPT 形成「encoder 双向理解 vs decoder 单向生成」的经典分野。

## 关联
- 骨干架构：[[attention-is-all-you-need]]、[[self-attention]]
- 静态嵌入的语境化后继：[[word2vec]]
- 单向生成式对照与竞争者：[[gpt3]]、[[t5]]
- CV 中的掩码预训练类比（MAE/ViT）：[[vit]]
- 迁移学习统一框架：[[t5]]
