---
type: source
title: "Logics-Parsing-Omni: Unified Omni Parsing (documents/images/AV)"
authors: [Alibaba]
year: 2026
arxiv: "2603.09677"
sources: [logics-parsing-v2]
tags: [ocr, document-parsing, omni, evidence-anchoring, progressive-parsing, reading-order]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---

# Logics-Parsing-Omni — 统一全模态解析（阿里，2026）

📄 **原文**：[arXiv:2603.09677](https://arxiv.org/abs/2603.09677) · [PDF](https://arxiv.org/pdf/2603.09677)

> ⭐ 把文档解析升维成"感知→认知"的渐进范式，**evidence anchoring** 强制高层语义对齐低层事实——对抑制幻觉、保证可溯源很有用。

## 一句话
[[logics-parsing]] 的升级：Omni Parsing 框架，**统一分类法**覆盖文档/图像/音视频，
**渐进解析范式**桥接感知与认知；三层级：① Holistic Detection（时空 grounding）
② …③ **evidence anchoring** 强制"高层语义描述 ↔ 低层事实"严格对齐 → 可定位/可枚举/可溯源。

## 核心机制
- **三层级渐进**：先精确检测（空间/时空定位）→ 再逐级到高层认知，感知与认知**协同增强**可靠性。
- **Evidence anchoring**：每个高层结论必须锚定到具体的低层证据（某个框/某段），
  杜绝"凭空生成"。这是**反幻觉**的结构化约束。
- 配套 OmniParsingBench 评测。

## 对 OCR 系统设计的启示
- **evidence anchoring = 后端 AR 反幻觉的好机制**：让后端每输出一个结构化结论，都强制引用前端
  检测出的具体 region（query/框）作为证据 → 生成不脱离视觉事实。两段式设计架构天生适合：
  前端给证据(框)，后端生成必须 anchor 到它。
- **感知→认知渐进**：前端做感知(检测)、后端做认知(结构化/理解)，且论文证明二者**协同**
  （好检测帮助好理解，反之亦然）→ 支持你联合优化的方向。
- **可溯源输出**：结构化结果每项可回指原图位置，对工业/审计场景是刚需。

## 关联
- 前身：[[logics-parsing]]
- 反幻觉同题：[[firered-ocr]]（GRPO 强制语法）、[[qianfan-ocr]]（Layout-as-Thought）
- 基准：[[omnidocbench]]
