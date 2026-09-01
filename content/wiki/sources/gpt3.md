---
type: source
title: "Language Models are Few-Shot Learners (GPT-3)"
authors: [Brown, et al. (OpenAI)]
year: 2020
venue: NeurIPS 2020
arxiv: "2005.14165"
sources: [gpt3]
tags: [llm, nlp, scaling, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---

# Language Models are Few-Shot Learners（2020）— 深度精读

📄 **原文**：[arXiv:2005.14165](https://arxiv.org/abs/2005.14165) · [PDF](https://arxiv.org/pdf/2005.14165)

> 把自回归语言模型放大到 175B 参数后，仅靠 in-context 的少量示例（不做任何梯度更新）就能在众多 NLP 任务上媲美微调 SOTA——证明「规模本身」解锁了通用少样本能力。

## 一句话定位
GPT-3 用 175B 参数 + 300B token 训练，把「预训练后微调」范式改为「预训练 + in-context few-shot」：任务与示例全部以自然语言文本喂入 prompt，权重完全冻结。

## 核心贡献
1. **In-context learning 范式**：定义 zero-shot / one-shot / few-shot 三档，few-shot 把 K=10–100 个示例塞进 2048 的上下文窗口，模型「即时」学会任务，无需任何梯度更新或任务数据集。
2. **规模即能力**：训练 8 个模型（125M→175B，跨三个数量级），系统验证 few-shot 性能随规模平滑幂律提升；许多任务上 few-shot 与规模的差距远大于 zero-shot。
3. **涌现能力**：3 位数算术、单词重排(unscramble)、用新造词造句等需即时推理的能力随规模涌现；175B 生成的新闻人类难以辨别真伪。
4. **诚实报告局限**：明确指出 few-shot 在部分任务仍弱，且承认数据去污(bug)导致部分测试集重叠未清除。

## 架构 / 方法细节
- **架构**：沿用 GPT-2（修改初始化、pre-normalization、可逆 tokenization），但把部分层换成 **交替 dense 与 locally banded sparse attention**（类 Sparse Transformer）。FFN 中间维 = 4×d_model。
- **175B 配置**：n_layers=96, d_model=12288, n_heads=96, d_head=128, batch=3.2M token, lr=0.6e-4；上下文 n_ctx=**2048**。沿深度和宽度双向切分到多 GPU。
- **训练数据（Table 2.2）**：过滤后 Common Crawl 410B(60%)、WebText2 19B(22%)、Books1 12B(8%)、Books2 55B(8%)、Wikipedia 3B(3%)。**按质量而非大小加权**：CC/Books2 训练中见不到一遍，而 WebText2/Wikipedia 见 2.9–3.4 遍。CC 原始 45TB→过滤后 570GB(≈400B BPE token)。
- **过滤**：用 WebText 当正例训分类器筛 CC，加文档级模糊去重。
- **优化**：Adam β=(0.9,0.95)、ε=1e-8、全局梯度裁剪 1.0；lr 余弦衰减到 10%（历时 260B token），前 375M token 线性 warmup；共训 **300B token**。

## 关键结果（真实数字）
- **TriviaQA（closed-book）**：few-shot **64.3%**，超过有阅读段落的开卷微调 SOTA。
- **LAMBADA**：GPT-3 2.7B(few-shot) 已超 17B Turing-NLG 的 SOTA，175B 进一步刷新。
- **PTB 语言建模**：zero-shot 新 SOTA，领先 15 困惑度。
- **算术**：175B 能可靠做 2 位加减，13B→175B 在部分任务提升 >10%（涌现）。
- **SuperGLUE**：few-shot 接近微调 BERT-Large 水平。
- **合成新闻**：人类区分 175B 生成 vs 真实文章仅约 52%（近乎随机）。
- **算力**：GPT-3 3B 与 RoBERTa-Large 同为 ~50 petaflop/s-day，但按 Kaplan 缩放律「训更大模型、见更少 token」。

## 为什么是里程碑
- 确立「规模驱动的 in-context few-shot」为 LLM 核心能力，开启 prompt engineering 时代。
- 证明单一冻结模型可通吃翻译、QA、推理、生成，无需任务微调，直接催生 ChatGPT 路线。
- 175B 参数把「大模型」的门槛与影响力推向工业与社会层面（含偏见/滥用讨论）。

## 关联
- 自回归解码骨架：[[attention-is-all-you-need]]、[[seq2seq]]
- 缩放律指导训练配比（GPT-3 用 Kaplan 律，后被修正）：[[chinchilla]]
- 双向理解式对照：[[bert]]、[[t5]]
- 对齐/指令跟随的后继：[[instructgpt]]
- 开源复现路线：[[llama]]
