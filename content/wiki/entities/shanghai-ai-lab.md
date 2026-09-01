---
type: entity
title: 上海人工智能实验室 / OpenDataLab（MinerU）
tags: [org, ocr, document-parsing, china]
sources: [mineru2.5, mineru2.5-pro]
created: 2026-07-23
updated: 2026-07-25
---

# 上海人工智能实验室 Shanghai AI Lab / OpenDataLab（MinerU）

上海 AI Lab 旗下数据中心化 AI 团队 **OpenDataLab**，MinerU 开源文档解析工具链出品方（最初为 InternLM 预训练清洗科学文本而生），并维护 OmniDocBench 评测基准。

## 本 Wiki 相关工作
- [[mineru2.5]]（2025）— 1.2B VLM，**coarse-to-fine 两阶段解耦**：降采样图上做高效 layout 分析 + 原生分辨率 crop 上做定向识别。是本 Wiki 前端/后端分工最干净的范式。
- [[mineru2.5-pro]]（2026）— 架构一字不改，纯靠数据工程（Data Engine 扩到 65.5M 页）+ 三阶段训练策略，OmniDocBench v1.6 得 95.69，超所有现有方法（含 200× 参数大模型）。方法论："数据 > 架构花活"。

## 定位
主攻方向：**解耦式高分辨率解析 + 数据驱动**。团队：OpenDataLab（数据全生命周期 + 标注工具 LabelU/LabelLLM + 评测 OmniDocBench）。活跃时间：MinerU 持续迭代（2.5 于 2025-09），2025–2026 密集。OCR 谱系角色：开源文档解析事实基线之一，也是"数据/训练驱动"方法论的旗帜。
