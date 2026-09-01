---
type: entity
title: LandingAI
tags: [org, commercial, document-ai]
sources: [lai-ade-gen2, lai-signatures-stamps-seals]
created: 2026-07-23
updated: 2026-07-25
---

# LandingAI

Andrew Ng（吴恩达）创办的公司，商业文档智能平台 **Agentic Document Extraction (ADE)** 出品方，主打"为 AI agent 设计"的结构化文档抽取。

## 本 Wiki 相关工作
- [[lai-ade-gen2|ADE Gen2 / DPT-3]]（2026）— 第二代 ADE，由 **DPT-3 系列基础模型**驱动，从整体版面到行/单元格逐层解析，输出面向 agent 消费的结构化结果 + 细粒度引用；按返回字符数（内容复杂度）计费而非按页。
- [[lai-signatures-stamps-seals|attestation 检测]]（2026）— **attestation detection**：在 parse 阶段检测签名/印章/钢印（传统 OCR 当噪声丢弃），赋类型、转写文字、记录位置，让"签了吗/盖了吗"成为可查询的结构化字段。

## 定位
主攻方向：**商业化 agentic 文档抽取**（面向下游 AI agent 的结构化输出 + 引用溯源 + attestation）。团队：LandingAI（Andrew Ng 创立）。活跃时间：ADE 持续迭代，Gen2 于 2026。OCR 谱系角色：本 Wiki 中商业闭源文档智能平台的代表，视角偏产品/经济性/agent 集成，与开源专家模型形成对照。
