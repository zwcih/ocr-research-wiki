---
type: source
title: "MinerU2.5: A Decoupled VLM for Efficient High-Resolution Document Parsing"
authors: [OpenDataLab / Shanghai AI Lab]
year: 2025
arxiv: "2509.22186"
sources: [mineru2.5]
tags: [ocr, document-parsing, vlm, decoupled, high-resolution, coarse-to-fine, frontend, backend]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---

# MinerU2.5 — 解耦式高分辨率文档解析 VLM（上海AI Lab，2025）

📄 **原文**：[arXiv:2509.22186](https://arxiv.org/abs/2509.22186) · [PDF](https://arxiv.org/pdf/2509.22186)

> ⭐ **coarse-to-fine 解耦**把 layout 和识别彻底分开——这套"降采样做全局版面 + 原分辨率 crop 做识别"是检测与识别模块分工最干净的范式。

## 一句话
1.2B VLM，**coarse-to-fine 两阶段解耦**：① 在**降采样图**上做高效 layout 分析（避开高分辨率
算力开销）；② 在**原生分辨率 crop** 上做定向内容识别（保住密集文本/复杂表格/公式细节）。

## 架构要点（对 OCR 系统最相关）
- **Stage 1 全局 layout**：故意用低分辨率整页图 → 快、省，只求"结构在哪、什么类型、
  阅读顺序"。**这就是纯前端检测该做的事**。
- **Stage 2 局部识别**：按 layout 结果从**原图**抠出高分辨率 crop，逐个精识别。
  **这就是纯后端 AR 生成该做的事**。
- 训练：Stage 0 模态对齐 → Stage 1 文档解析预训练 → 后续微调。

## 对检测—识别组合系统的启示
- **"降采样定位 / 原分辨率识别"= 高分辨率文档的算力解法**：检测前端 DETR 在低分辨率整页跑
  （快 + 全局阅读顺序），后端 AR 只在高分辨率 crop 上跑（准）→ 两端各用最合适的分辨率，
  这是这篇最值钱的工程洞见，直接可搬。
- **解耦 = 可分别优化/替换**：前端换 DETR 系、后端换目标系统的 AR 解码器，互不绑死。
- **layout 引导 crop**：检测框直接决定后端输入，避免整页解码的长序列与幻觉。
- 对照 [[deepseek-ocr]] 的"整页光学压缩"路线——MinerU 反其道而行（**不压缩、按需 crop
  原分辨率**），需要权衡：全局压缩省 token vs 局部原分辨率保精度。见 [[visual-compression-vs-reconstruction]]。

## 关联
- 升级版：[[mineru2.5-pro]]（架构不变，纯数据/训练驱动再涨点）
- 同两阶段：[[paddleocr-vl]]、[[dolphin]]
- 路线张力：[[deepseek-ocr]]、[[monkeyocr-v2]]、[[visual-compression-vs-reconstruction]]
- 基准：[[omnidocbench]]
