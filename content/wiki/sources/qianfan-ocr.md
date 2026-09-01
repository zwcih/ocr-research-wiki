---
type: source
title: "Qianfan-OCR: Unified End-to-End Document Intelligence (Layout-as-Thought)"
authors: [Baidu Qianfan]
year: 2026
arxiv: "2603.13398"
sources: [qianfan-ocr]
tags: [ocr, document-intelligence, end-to-end, layout-as-thought, thinking, reading-order, omnidocbench]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---

# Qianfan-OCR — Layout-as-Thought 统一端到端（百度千帆，2026）

📄 **原文**：[arXiv:2603.13398](https://arxiv.org/abs/2603.13398) · [PDF](https://arxiv.org/pdf/2603.13398)

> ⭐ **Layout-as-Thought**：端到端模型可选先"想"出版面（框+类型+阅读顺序）再出内容——把两段式的结构先验塞进单模型的 thinking 阶段。对 OCR 系统"要不要显式检测"这个核心抉择极有启发。

## 一句话
4B 端到端模型，统一 parsing + layout analysis + 文档理解。针对"端到端丢失显式版面分析"的痛点，
提出 **Layout-as-Thought**：`⟨think⟩` 触发的**可选思考阶段**，模型**先生成结构化 layout
（bbox + 元素类型 + 阅读顺序）再出最终结果**。OmniDocBench v1.5 端到端模型第一。

## 核心机制
- **Layout-as-Thought**：把"版面分析"变成 CoT 里的思考步——不是独立检测模块，而是解码时
  先吐结构化 layout 表示，再基于它生成内容。
- **两个好处**：① 恢复了 pipeline 用户依赖的显式 layout（可拿到框/类型/顺序）；
  ② 对复杂/杂乱/非常规阅读顺序的文档，**结构先验帮助消歧**，识别更准。
- **可选**：简单文档可跳过 thinking 直接出结果，省算力。

## ⭐ 用于架构抉择的关键启发
- **"隐式检测" vs "显式前端 DETR" 的中间路线**：Qianfan 不用独立检测器，而让**同一个 AR 模型
  先生成 layout 再生成内容**（layout 当 thought）。这是两段式设计架构的**对照方案**——
  值得想：目标系统的前端 DETR 相比"AR 先吐 layout"，优势是（并行、专门优化、精确框）、
  劣势是（多一个模块、拼接误差）。
- **结构先验消歧**：无论显式检测还是 layout-as-thought，"先定结构再识别内容"都能提升复杂版面
  精度 → 印证你"先检测后生成"方向正确。
- **可选思考**：后端 AR 可设计成"难文档才启用结构思考"，平衡精度与速度。

## 关联
- 显式两段对照：[[mineru2.5]]、[[paddleocr-vl]]、[[dolphin]]
- 阅读顺序/结构先验：[[logics-parsing]]、[[dots-ocr]]
- 基准：[[omnidocbench]]
