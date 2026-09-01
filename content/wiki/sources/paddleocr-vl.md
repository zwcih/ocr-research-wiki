---
type: source
title: "PaddleOCR-VL: 0.9B Ultra-Compact VLM for Document Parsing"
authors: [Baidu PaddlePaddle Team]
year: 2025
arxiv: "2510.14528"
sources: [paddleocr-vl]
tags: [ocr, document-parsing, vlm, small-model, layout, omnidocbench, frontend, backend]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---

# PaddleOCR-VL — 0.9B 超紧凑文档解析 VLM（百度，2025）

📄 **原文**：[arXiv:2510.14528](https://arxiv.org/abs/2510.14528) · [PDF](https://arxiv.org/pdf/2510.14528)

> ⭐ 两阶段 = layout 检测 → 元素级识别，正好对应你"前端检测 + 后端生成"的思路，且做到 0.9B 超小。

## 一句话
0.9B 紧凑 VLM：**NaViT 式动态分辨率视觉编码器** + **ERNIE-4.5-0.3B** 语言模型。
先做 layout 分析定位元素，再对每个元素做细粒度识别；OmniDocBench v1.0/v1.5 SOTA，支持 109 语言。

## 架构要点
- **视觉编码器 NaViT-style 动态分辨率**：不强制 resize 成固定尺寸，按原始长宽比/分辨率打包
  patch → 保住小字细节，避免文档缩放失真。
- **两阶段 pipeline**：① layout 检测（版面元素定位 + 分类 + 阅读顺序）② element-level
  recognition（对每个区域分别识别文本/公式/表格）。
- **超小 LM**：ERNIE-4.5-0.3B 当解码器，整机 0.9B 却打过大模型。

## 对检测—识别组合系统的启示
- **两阶段解耦 = 和此类 OCR 架构同构**：它的"layout 检测→元素识别"就是你"前端定位→后端生成"
  的产品化验证，证明这条路能在 <1B 规模做到 SOTA。
- **NaViT 动态分辨率编码器**：对文档小字/密集场景，比固定分辨率强很多，
  检测与识别模块共享的视觉编码器可以直接考虑这个方案。
- **element-level recognition**：检测出区域后**逐元素**喂后端识别（而非整页一次解码），
  天然适配"检测 query → region crop → AR 生成"的衔接，且能并行。
- **小 LM 够用**：后端 AR 解码器不必大，0.3B 级别 + 好数据即可，降低你训练/部署成本。

## 关联
- 同路线两阶段：[[mineru2.5]]（解耦更彻底）、[[dolphin]]（analyze-then-parse）
- 前端参考：[[dino-detr]]；后端参考：[[trocr]]/[[got-ocr2]]
- 基准：[[omnidocbench]]
