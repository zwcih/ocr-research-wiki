---
type: source
title: "Attention Is All You Need (Transformer)"
authors: [Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser, Polosukhin]
year: 2017
venue: NeurIPS 2017
arxiv: "1706.03762"
sources: [attention-is-all-you-need]
tags: [transformer, attention, nlp, foundation, milestone]
created: 2026-07-23
updated: 2026-07-23
---

# Attention Is All You Need (Transformer, 2017)

📄 **原文**：[arXiv:1706.03762](https://arxiv.org/abs/1706.03762) · [PDF](https://arxiv.org/pdf/1706.03762)

> 里程碑 ⭐ — 现代几乎所有大模型（LLM、ViT、多模态、文档 VLM）的共同祖先架构。

## 一句话定位

抛弃 RNN/CNN，纯靠 **[[self-attention|自注意力]]** 构建 seq2seq 模型，
既能高度并行训练又能建模长距离依赖，成为此后 NLP/CV/多模态的统一骨架。

## 核心贡献

1. **[[self-attention|Self-Attention]]**：序列中每个位置直接与所有位置交互，
   路径长度 O(1)，彻底解决 RNN 的长依赖与串行瓶颈。
2. **[[multi-head-attention|多头注意力]]**：并行多组注意力，捕捉不同子空间的关系（论文用 8 头，d_model=512）。
3. **[[scaled-dot-product-attention|缩放点积注意力]]**：`softmax(QKᵀ/√dₖ)V`，√dₖ 防止梯度消失。
4. **位置编码 (Positional Encoding)**：用正弦函数注入序列位置信息（无递归结构需显式补位置）。
5. **Encoder-Decoder 结构**：各 6 层，残差连接 + LayerNorm。

## 关键结果

- WMT 2014 英德翻译 **BLEU 28.4**（SOTA，超过此前含 ensemble 的模型 2+ BLEU）
- WMT 2014 英法翻译 **BLEU 41.8**，训练成本仅为当时最好模型的一小部分
- 训练可大规模并行，8 张 GPU 训练时间大幅缩短

## 为什么是里程碑

- 直接催生 [[bert|BERT]]、GPT 系列、[[vit|ViT]]、CLIP，以及所有 document-VLM 和端到端 OCR 模型
- "Attention" 成为 AI 领域此后十年的核心原语
- 论文标题句式 "X Is All You Need" 成为一个模因（见 [[textbooks-are-all-you-need|Textbooks Are All You Need]]）

## 关联

- 被后续的 [[bert|BERT]]、[[vit|ViT]] 直接继承
- 与文档智能相关：LayoutLM、GOT-OCR2.0、DeepSeek-OCR 等均以 Transformer 为骨架
