---
type: concept
title: Mixture-of-LoRAs（模态 LoRA 混合）
sources: [phi4-mini]
tags: [lora, multimodal, architecture]
created: 2026-07-23
updated: 2026-08-04
---
# Mixture-of-LoRAs（模态 LoRA 混合）

## 背景：LoRA 是什么
LoRA（Low-Rank Adaptation）是参数高效微调法：冻结原权重 W，只训练一个低秩增量 ΔW=BA（B、A 是小矩阵，秩 r≪d），推理时用 W+BA。好处是可训参数极少、可插拔、不改动底座。

## Mixture-of-LoRAs 的做法
[[phi4-mini|Phi-4-Multimodal]] 提出：在**完全冻结**的语言 backbone 上，为**每个模态**（视觉、语音）各训练一套独立的 LoRA adapter + 对应的编码器/投影，再配模态路由，让一个模型同时处理多模态。

## 为什么优雅
1. **语言能力零损伤**：底座权重一点不动，纯语言任务性能完全保留——避免了多模态微调常见的「学了看图、忘了说话」的灾难性遗忘。
2. **模态互不干扰**：各模态走各自的 LoRA，视觉训练不污染语音路径，反之亦然。
3. **可无限扩展**：新增一个模态 = 再挂一套 LoRA，无需重训已有部分，模块化、可组合。
4. **参数高效**：每模态只多一点低秩参数，媲美全量微调的效果。

## 相对其他多模态融合的优势
- 相比 cross-attention 注入式（Flamingo、LLaMA-Vision）：不改底座结构、不牵动语言权重，训练更稳、扩展更干净。
- 相比全量多模态微调：省算力、无遗忘、可插拔。

## 对文档智能的启示（本 wiki）
文档理解可作为一个**可插拔 LoRA 模态**挂到通用语言/多模态底座上——训练文档 OCR/版面能力时不损伤底座通用能力，且能与视觉、语音等其他模态 LoRA 并存组合。对研究者想在通用底座上加 OCR 能力的路线有参考价值。
