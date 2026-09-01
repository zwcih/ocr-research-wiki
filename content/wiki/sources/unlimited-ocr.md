---
type: source
title: Unlimited OCR — R-SWA 恒定 KV 长文档解析
sources: [unlimited-ocr]
tags: [ocr, document-parsing, kv-cache, sliding-window-attention, long-document, decoding, baidu, back-ar-relevant]
created: 2026-07-25
updated: 2026-07-25
---

# Unlimited OCR (Unlimited OCR Works)

📄 **原文**：[arXiv:2606.23050](https://arxiv.org/abs/2606.23050) · [PDF](https://arxiv.org/pdf/2606.23050)

- **arXiv**: 2606.23050v1（2026-06-22，[[baidu]] 百度，作者含 Qunyi Xie / Shu Wei，与 [[hpd-parsing]] 同组）
## 一句话
针对长文档（几十页）AR 解码时 **textual KV cache 随序列无限增长**的痛点，在 [[deepseek-ocr]] 上把 decoder 全部 attention 层换成 **R-SWA（Reference Sliding Window Attention）**：文本 KV cache **恒定大小**，支持 32K 上下文、单次前向解析几十页；OmniDocBench v1.5 达 **93%**（超 DeepSeek-OCR baseline **+6%**）。

## 问题
统一 VLM 文档解析用 LLM 当 decoder（借语言先验提精度），但随输出序列变长，**累积 KV cache 推高显存 + 逐步拖慢解码**。长文档（多页）尤其爆炸。

## 方法：R-SWA（Reference Sliding Window Attention）
- 把 DeepSeek-OCR decoder 里**所有 attention 层全替换为 R-SWA**。
- 每个生成 token：**对全部 reference token（视觉 token + prompt）做完整注意力**，而对**已生成文本**只在 causal 滑动窗口内 attend → 活跃 KV cache **恒定大小**，不随已生成长度增长。
- "Reference" = 保住对视觉/prompt 的全局注意力（避免纯滑窗丢定位与跨页一致性），滑窗只加在文本上。
- 结合 DeepSeek-OCR encoder 高压缩率 + 恒定 KV → 上下文达 **32K**。
- **通用机制**：R-SWA 不限 OCR，是通用 parsing attention。

## 结果
- OmniDocBench v1.5 **93%**，超 DeepSeek-OCR baseline **+6%**。
- 恒定 KV cache，支持 32K 上下文（长文档显存/延迟不随页数爆炸）。

## 对 AR 解码的启示
- ⭐⭐⭐ **恒定 KV cache** 是长文档后端 AR 的关键：AR OCR 解码长文档时，R-SWA 式滑窗 + 保留视觉/prompt 参考，可把显存/延迟压成常数级，不随页数膨胀。
- ⭐⭐ 与 [[hpd-parsing]] 的 KV 隔离**互补**：HPD 靠 layout fork **分而治之隔离** KV（跨区块不互相 attend）；R-SWA 靠**滑窗压缩**同一序列内的文本 KV。两条思路可叠——分支内再用滑窗。
- ⭐ 属"减 per-step 计算"加速线（同 [[deepseek-ocr]] 压视觉 context），与"减串行步数"（[[hpd-parsing]]/[[glm-ocr]]/[[hsd]]）正交。

## 关联
- 加速线定位见 [[overview]] 「解码加速专线」；对比 [[deepseek-ocr]]（压视觉 token）、[[hpd-parsing]]（分支并发+P-MTP）、[[hsd]]（免训练投机）。
- 概念族 [[speculative-decoding]] / [[progressive-multi-token-prediction]]（不同加速族）。
