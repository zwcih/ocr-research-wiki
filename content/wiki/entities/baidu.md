---
type: entity
title: 百度 Baidu / PaddleOCR
sources: [hpd-parsing, paddleocr-vl, qianfan-ocr]
tags: [org, ocr, document-parsing, china]
created: 2026-07-23
updated: 2026-07-25
---

# 百度 Baidu / PaddleOCR

百度旗下 OCR/文档智能开源生态（PaddlePaddle / PaddleOCR / 千帆），文档解析领域高产、且擅长把工程加速与端到端范式结合。

## 本 Wiki 相关工作
- [[paddleocr-vl]]（2025）— 0.9B 超紧凑文档解析 VLM（NaViT 动态分辨率 + ERNIE-4.5-0.3B），layout→元素识别两阶段，OmniDocBench v1.0/v1.5 SOTA，支持 109 语言。
- [[qianfan-ocr]]（2026，百度千帆）— 4B 端到端统一 parsing/layout/理解，提出 **Layout-as-Thought**（⟨think⟩ 可选思考阶段先出结构化 layout 再出内容），OmniDocBench v1.5 端到端模型第一。
- [[hpd-parsing]]（2026-07）— Hierarchical Parallel Decoding，层次并行解码（layout 主分支 + 多条 content 并发分支 + P-MTP），OmniDocBench v1.6 Overall 94.91 / 峰值 4,752 TPS。

## 定位
主攻方向：**紧凑 VLM 文档解析 + 解码加速 + 端到端范式创新**。从 PaddleOCR-VL 的小模型两阶段，到 Qianfan-OCR 的 Layout-as-Thought，再到 HPD-Parsing 的并行解码，三条线覆盖了"前端检测 + 后端生成"与"减串行"两大加速路线，是本 Wiki 高相关的中国工业界参考。活跃时间：长期（PaddleOCR 生态多年），2025–2026 密集产出。OCR 谱系角色：开源文档智能生态的主要工业推手之一。
