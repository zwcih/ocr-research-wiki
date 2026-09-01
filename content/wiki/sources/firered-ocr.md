---
type: source
title: "FireRed-OCR: Specializing General VLMs into OCR Models"
authors: [Super Intelligence Team, Xiaohongshu Inc. (小红书)]
year: 2026
arxiv: "2603.01840"
sources: [firered-ocr]
tags: [ocr, document-parsing, grpo, structural-hallucination, data-factory, three-stage-training, markdown]
reading: deep
created: 2026-07-23
updated: 2026-07-25
---

# FireRed-OCR — 把通用 VLM 专家化成 OCR 模型（小红书，2026）

📄 **原文**：[arXiv:2603.01840](https://arxiv.org/abs/2603.01840) · [PDF](https://arxiv.org/pdf/2603.01840)

> ⭐ 专治**结构幻觉**（表格没闭合、公式语法错）：Format-Constrained GRPO 用 RL 强制语法有效性。这是后端 AR 出结构化输出的关键补丁。

## 一句话
系统框架把通用 VLM 专家化为高性能 OCR 模型。针对复杂文档的 **structural hallucination**，
用"几何+语义"Data Factory + **三阶段渐进训练**（含 Format-Constrained GRPO），
OmniDocBench v1.5 总榜第一（**92.94% overall**），基座为 **Qwen3-VL**（把通用 VLM 专家化成 OCR 模型），点名超越 DeepSeek-OCR 2 与 OCRVerse。

## 核心机制
- **"Geometry + Semantics" Data Factory**：非随机采样，按几何(版面)+语义双维度构造数据，共 **five rigorous stages**（Geometry-Driven Feature Extraction、Dual Indexing、Stratified Sampling 等）。
- **三阶段渐进课程**（从像素感知 → 逻辑结构生成）：
  ① Multi-task Pre-alignment（打底文档结构理解）
  ② Specialized SFT（标准化全图 Markdown 输出）
  ③ **Format-Constrained GRPO**：RL 强制 reward 三项并列——**语法有效性 + 结构完整（如表格闭合、公式语法正确）+ content accuracy（内容准确性）**。

## ⭐ 给AR OCR 后端 的可复用设计
- **Format-Constrained GRPO = 结构化输出的救命稻草**：后端 AR 生成 HTML/LaTeX/Markdown 时
  最容易犯"表格标签没闭合、公式括号不配对"这类**语法级结构幻觉**，普通交叉熵管不住。
  用 GRPO + "语法有效性奖励"直接惩罚非法结构 → 目标系统的后端必备的一道。
- **三阶段课程**：感知对齐 → SFT 标准化输出 → RL 修结构，这条 curriculum 可直接套。
- **数据双维度构造**（几何+语义）优于随机采样，呼应 [[mineru2.5-pro]] 数据引擎。

## 关联
- 同用 GRPO/RL：[[mineru2.5-pro]]、[[logics-parsing]]、[[logics-parsing-v2]]
- 数据工程：[[mineru2.5-pro]]、[[points-reader]]
- 基准：[[omnidocbench]]
