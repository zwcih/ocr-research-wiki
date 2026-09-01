---
type: entity
title: 小红书 Xiaohongshu / RedNote hi-lab
tags: [org, ocr, document-parsing, china]
sources: [dots-ocr, firered-ocr]
created: 2026-07-23
updated: 2026-07-25
---

# 小红书 Xiaohongshu / RedNote（hi-lab · Super Intelligence Team）

小红书（国际名 RedNote）的 AI 研发团队，FireRed 系列模型出品方；文档方向在**统一 VLM 文档解析**与**通用 VLM 专家化**两条线上均产出 SOTA。

## 本 Wiki 相关工作
- [[dots-ocr]]（2025，rednote-hilab）— 单一 VLM（1.2B 视觉编码器 + 1.7B 解码器，~3B），**首次证明**一次端到端前向里联合做 layout 检测 + 内容识别 + 关系理解可行且更优；配 XDocParse 126 语言基准，OmniDocBench SOTA。是本 Wiki"分两段 vs 单模型"的关键对照组。
- [[firered-ocr]]（2026，Super Intelligence Team）— 把通用 VLM（Qwen3-VL 基座）专家化成 OCR，用"几何+语义" Data Factory + 三阶段渐进训练（含 **Format-Constrained GRPO** 强制结构语法有效性，专治表格/公式结构幻觉），OmniDocBench v1.5 总榜第一（92.94% overall），点名超越 DeepSeek-OCR 2 与 OCRVerse。

## 定位
主攻方向：**统一端到端文档解析** + **RL 治结构幻觉**。团队：hi-lab（负责 dots.ocr）+ Super Intelligence Team / FireRed 系列（ASR/TTS/Image/OCR 全栈）。活跃时间：2025–2026。OCR 谱系角色：单模型联合解析范式的重要证明者，同时代表"通用 VLM → OCR 专家"的专家化路线。
