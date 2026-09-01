---
type: entity
title: Zhipu AI（智谱）
tags: [org, ocr, document-parsing, china]
sources: [glm-ocr]
created: 2026-07-23
updated: 2026-07-25
---

# Zhipu AI（智谱 / zai-org）

清华系 AI 公司，GLM 系列大模型出品方；文档方向主攻**高效紧凑端侧 OCR**。

## 本 Wiki 相关工作
- [[glm-ocr]]（2026）— 0.9B 紧凑多模态 OCR（0.4B CogViT + 0.5B GLM decoder），用 **Multi-Token Prediction**（一步预测多 token，推理均 5.2 token/步、~50% 吞吐提升）解决 OCR 确定性任务下 AR 逐 token 太慢的痛点；系统级两阶段（PP-DocLayout-V3 版面分析 + region-level 并行识别），OmniDocBench v1.5 得 94.6，被评 OCR/紧凑模型中第一。

## 定位
主攻方向：**紧凑高效 + 加速（MTP）**，兼顾边缘部署与大规模生产。团队背景：智谱 AI + 清华。活跃时间：GLM 系列长期，OCR 方向 2026。OCR 谱系角色：清华系工业界在"小模型 + 解码加速"路线上的代表，与百度 HPD-Parsing、GLM-OCR 同处"减串行解码"这条加速线。
