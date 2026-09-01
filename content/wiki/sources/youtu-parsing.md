---
type: source
title: "Youtu-Parsing: High-Parallelism Decoding for Document Parsing"
authors: [Tencent Youtu Lab]
year: 2026
arxiv: "2601.20430"
sources: [youtu-parsing]
tags: [ocr, document-parsing, parallel-decoding, token-parallelism, query-parallelism, region-prompt, backend, frontend]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---

# Youtu-Parsing — 高并行解码文档解析（腾讯优图，2026）

📄 **原文**：[arXiv:2601.20430](https://arxiv.org/abs/2601.20430) · [PDF](https://arxiv.org/pdf/2601.20430)

> ⭐⭐ **这篇对AR OCR 后端 最关键**：token 并行 + query 并行，5–11× 加速，直击自回归解码慢的死穴。而且是"ViT + LLM + 区域提示解码"的解耦架构，和此类 OCR 架构高度同构。

## 一句话
Native ViT 编码器 + prompt-guided **Youtu-LLM-2B**，解耦 + 特征复用框架下引入
**高并行解码**：① **token parallelism**（每步并发生成最多 64 个候选 token）
② **query parallelism**（多个 bbox 内容同时预测）→ 比传统自回归快 **5–11×**，
尤其适合表格这种高度结构化场景。

## 核心机制（两种并行）
- **Token parallelism**：单次推理并发出 up-to-64 个 token（类似多 token 预测 / 推测解码），
  不再一个一个吐 → 结构化内容（表格单元格）狂加速。
- **Query parallelism**：**多个检测框(region)的内容同时解码**——每个 region 一个 query，
  互不依赖，一起跑。这正是"检测框→并行识别"。
- **Region-prompted decoding**：用检测出的区域当 prompt 引导后端只解码该区域。

## 对检测—识别组合系统的启示
- **query parallelism = 两段式设计的天然红利**：前端 DETR 出 N 个 query/框，后端**并行**对
  N 个 region 解码（而非整页顺序 AR）→ 吞吐直接上一个量级。采用两段式设计的最大效率优势就在这。
- **token parallelism 治 AR 慢**：后端解码结构化内容（表格/公式）时，多 token 并发生成，
  参考 [[glm-ocr]] 的 Multi-Token Prediction，二者可结合。
- **feature reuse**：ViT 特征在检测和识别间复用，省算力——检测与识别模块共享编码器时照做。
- **区域提示**：检测框直接当 prompt 约束后端解码范围，减少长序列和跑偏。

## 关联
- 并行/加速解码同题：[[glm-ocr]]（MTP）、[[dolphin]]（元素并行）
- 两段解耦：[[mineru2.5]]、[[paddleocr-vl]]
- 前端：[[dino-detr]]；基准：[[omnidocbench]]
