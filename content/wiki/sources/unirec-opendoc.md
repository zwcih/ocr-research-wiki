---
type: source
title: "UniRec-0.1B: Unified Text and Formula Recognition (0.1B)"
authors: [Fudan FVL Lab]
year: 2025
arxiv: "2512.21095"
sources: [unirec-opendoc]
tags: [ocr, recognition, tiny-model, hierarchical-supervision, semantic-decoupled-tokenizer, formula, table, backend]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---

# UniRec-0.1B — 0.1B 统一文本/公式识别（复旦，2025）

📄 **原文**：[arXiv:2512.21095](https://arxiv.org/abs/2512.21095) · [PDF](https://arxiv.org/pdf/2512.21095)

> ⭐ OpenDoc-0.1B 系统背后的识别核心。**0.1B 打过大模型**靠两招：层次监督 + 语义解耦 tokenizer。对AR OCR 后端 做极小高精识别器直接可用。

## 一句话
0.1B 参数统一识别模型，多层级做文本 + 公式（+表格）识别。两个关键设计：
① **hierarchical supervision**（层次监督，显式引导结构理解）
② **semantic-decoupled tokenizer**（语义解耦 tokenizer，把文本表示与公式表示分开）。
在 OmniDocBench 上以 0.1B 超过通用 VLM 和主流文档解析专家模型（且更快）。

> 注：没有名为 "OpenDoc" 的独立论文；OpenDoc-0.1B 是承载 UniRec + PP-DocLayoutV2 的解析系统，
> 本页记录其识别核心 UniRec-0.1B。

## 核心机制
- **Hierarchical supervision**：不只监督最终字符串，还在**结构层级**（行/公式块/表格结构）
  上加监督信号，显式教模型"结构长什么样"，而非死记序列。
- **Semantic-decoupled tokenizer**：文本 token 和公式(LaTeX) token **分开表示**，
  避免二者互相干扰（模型常把公式当乱码文本、或把文本当公式）。

## ⭐ 给AR OCR 后端 的可复用设计
- **语义解耦 tokenizer 直接可搬**：AR OCR 后端 同时出文本 + 公式 + 表格时，混在一个词表里会互相
  污染（[[mineru2.5]] 早期也遇到公式被输出成 unicode）。给文本/公式/表格结构**分设 token 空间**
  能显著减少这类错。
- **层次监督**：识别不只监督最终字符串，也监督中间结构 → 后端对表格嵌套/公式结构更稳。
- **0.1B 够用**：region-level 识别器（前端检测后逐元素识别）**不需要大模型**，0.1B 级 + 好设计
  就能超大模型且快。适合检测定位后逐元素识别的轻量系统。

## 关联
- 后端识别同道：[[trocr]]、[[got-ocr2]]
- 公式/结构处理：[[nougat]]、[[mineru2.5]]
- 小模型高精：[[hunyuan-ocr]]、[[mineru2.5-pro]]
- 基准：[[omnidocbench]]
