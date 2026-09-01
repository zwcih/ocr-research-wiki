---
type: source
title: "LLaMA: Open and Efficient Foundation Language Models"
authors: [Touvron, et al. (Meta)]
year: 2023
arxiv: "2302.13971"
sources: [llama]
tags: [llm, open-source, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---

# LLaMA: Open and Efficient Foundation Language Models（2023）— 深度精读

📄 **原文**：[arXiv:2302.13971](https://arxiv.org/abs/2302.13971) · [PDF](https://arxiv.org/pdf/2302.13971)

> 只用公开数据、把小模型训到远超 Chinchilla 最优 token 量（7B 训 1T token 仍在降 loss），做出 13B 就超越 175B GPT-3、65B 媲美 Chinchilla-70B/PaLM-540B 的开放基座模型。

## 一句话定位
LLaMA 重新定义「计算最优」：Chinchilla 算的是**训练**最优，而 LLaMA 追求**推理**最优——用更多 token 把小模型练透，让部署成本更低，并全程只用公开数据以支持开源。

## 核心贡献
1. **推理最优 vs 训练最优**：不追求给定训练算力下的最优，而是给定目标性能下推理最省。故 7B/13B 也训到 1T token、33B/65B 训到 1.4T token，远超 Chinchilla 推荐量。
2. **全公开数据**：与 Chinchilla/PaLM/GPT-3 不同，仅用公开可得数据，使工作可开源。
3. **强性能小模型**：**LLaMA-13B 在多数基准上超过 GPT-3（175B），小 10×**；LLaMA-65B 与 Chinchilla-70B、PaLM-540B 竞争。
4. **持续下降的 loss**：观察到 7B 模型在 1T token 后 loss 仍在改善，佐证「小模型多喂 token」策略。

## 架构 / 方法细节
- **数据混合（1.4T token，Table 1）**：CommonCrawl 67%(3.3TB)、C4 15%(783GB)、Github 4.5%(仅 Apache/BSD/MIT)、Wikipedia 4.5%(20 语言)、Books 4.5%(Gutenberg+Books3)、ArXiv 2.5%、StackExchange 2%。多数 token 只用一次，Wikipedia/Books 约 2 epoch。
- **三处架构改进**：
  - **Pre-normalization + RMSNorm**（借鉴 GPT-3/Zhang&Sennrich）提升训练稳定性——归一化子层输入而非输出。
  - **SwiGLU 激活**（借鉴 PaLM）替代 ReLU，中间维用 `2/3·4d`。
  - **RoPE 旋转位置编码**（借鉴 GPTNeo）替代绝对位置嵌入，每层注入。
- **规模配置（Table 2）**：7B(d=4096,32头,32层)、13B(d=5120,40头,40层)、33B(d=6656,52头,60层)、65B(d=8192,64头,80层)。
- **优化器**：AdamW β=(0.9,0.95)、余弦 lr 衰减到峰值 10%、weight decay 0.1、梯度裁剪 1.0、2000 步 warmup；batch=4M token。
- **Tokenizer**：BPE(SentencePiece)，数字拆成单个数位，未知字符回退到字节。
- **高效实现**：xformers 的高效 causal multi-head attention（不存注意力权重、不算被 mask 的分数）+ 手写 backward 做激活 checkpointing。

## 关键结果（真实数字）
- **LLaMA-13B > GPT-3 175B** 在多数常识/推理基准（BoolQ, PIQA, HellaSwag, WinoGrande, ARC 等），参数少 10×。
- **LLaMA-65B** 与 Chinchilla-70B、PaLM-540B 竞争；33B/65B 训 1.4T token。
- 7B 模型 1T token 后 loss 仍下降，说明未到饱和。

## 为什么是里程碑
- 开放权重（社区很快泄漏/开放）点燃了开源 LLM 爆发（Alpaca、Vicuna、Llama-2、Mistral 等全部由此起步）。
- 把「推理成本」放到与训练成本同等重要的位置，改变了业界的规模取舍。
- 证明纯公开数据也能训出 SOTA 级基座，降低了复现门槛。

## 关联
- 修正/被超越的缩放律：[[chinchilla]]
- 被 13B 超越的对照：[[gpt3]]
- 骨干架构：[[attention-is-all-you-need]]、[[self-attention]]
- 数据来源之一：[[t5]]（C4）
- 后续对齐路线：[[instructgpt]]
- 数据质量优先思想：[[data-quality-over-scale]]、[[textbooks-are-all-you-need]]
