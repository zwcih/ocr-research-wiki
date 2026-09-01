---
type: source
title: "dots.ocr: Multilingual Document Layout Parsing (1.2B vision encoder + 1.7B decoder, ~3B)"
authors: [rednote (Xiaohongshu) hi-lab]
year: 2025
arxiv: "2512.02498"
sources: [dots-ocr]
tags: [ocr, document-parsing, unified-vlm, layout, multilingual, end-to-end, frontend, backend]
reading: deep
created: 2026-07-23
updated: 2026-07-25
---

# dots.ocr — 统一单模型文档版面解析（小红书，2025）

📄 **原文**：[arXiv:2512.02498](https://arxiv.org/abs/2512.02498) · [PDF](https://arxiv.org/pdf/2512.02498)

> ⭐ 与目标系统"检测+生成分两段"**相反的对照组**：单一 VLM 一趟里联合做 layout 检测+识别+关系理解。读它是为了想清楚"我为什么要分两段"。

## 一句话
单一 VLM（**1.2B 视觉编码器 + 1.7B 解码器**，整模约 **~3B**；解码器基于 Qwen2.5-1.5B + tied embedding = 1.7B），**首次证明**在**一次端到端前向**里联合学 layout 检测、内容识别、
关系理解（三位一体）是可行且更优的；配 XDocParse 126 语言基准，OmniDocBench SOTA。

## 核心论点
文档解析需要三个互联子任务：① layout detection ② content recognition ③ relational
understanding（阅读顺序/从属关系）。传统靠**碎片化多阶段 pipeline**，早期错误会级联污染后续。
dots.ocr 主张：**统一到单个 VLM 端到端联合学**，消除级联误差。

## 对检测—识别组合系统的启示
- **这是目标系统的"反方辩友"**：它证明单模型联合学能 work 且避免级联误差。采用两段式设计（DETR + AR）的
  **代价**正是它攻击的点——两段拼接处会有误差传递。设计时要专门处理：让前端检测的不确定性
  能传给后端（软标签/query embedding 而非硬 crop），减少级联。
- **relational understanding 别漏**：阅读顺序、单元格从属、图文关联——如果检测前端只出框、后端只
  识别，**关系建模会落到缝里**。要么前端 DETR 的 query 之间显式建关系（decoder self-attn 本就能），
  要么后端解码时重建顺序。这篇提醒你把"关系"当一等公民。
- **多语言 layout**：126 语言的版面差异大，前端检测要对非拉丁/竖排/混排鲁棒。
- 权衡结论：单模型省了拼接、但难分别优化；两段式好优化、但要治级联。没有免费午餐。

## 关联
- 对照（单模型端到端）：[[got-ocr2]]、[[ovis-ocr2]]
- 对照（两段解耦）：[[mineru2.5]]、[[paddleocr-vl]]
- 关系/阅读顺序也重点处理：[[logics-parsing]]
- 基准：[[omnidocbench]]
