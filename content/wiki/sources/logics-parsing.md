---
type: source
title: "Logics-Parsing: End-to-End LVLM with RL for Layout & Reading Order"
authors: [Alibaba]
year: 2025
arxiv: "2509.19760"
sources: [logics-parsing]
tags: [ocr, document-parsing, reinforcement-learning, reading-order, layout, html-output, end-to-end]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---

# Logics-Parsing — RL 优化版面与阅读顺序的端到端 LVLM（阿里，2025）

📄 **原文**：[arXiv:2509.19760](https://arxiv.org/abs/2509.19760) · [PDF](https://arxiv.org/pdf/2509.19760)

> ⭐ 用 **RL + 精设计奖励**专治"复杂版面 & 阅读顺序"——这正是纯识别学不好、需要显式优化的部分。

## 一句话
基于 Qwen2.5-VL-7B 的端到端 LVLM，**加强化学习**：精心设计 reward 来优化复杂版面分析
和阅读顺序推断，输出结构化 HTML。

## 核心机制
- **layout 中心**：把版面分析和阅读顺序当核心难点（而非附属），端到端一模搞定。
- **RL + reward 设计**：为"复杂版面正确性"和"阅读顺序正确性"设计奖励，用 RL 优化——
  因为这类**结构/顺序**目标难用普通监督损失直接刻画。
- **结构化 HTML 输出**：直接产出带结构的 HTML（表格/嵌套/顺序都在里面）。

## 对检测—识别组合系统的启示
- **阅读顺序用 RL 而非硬监督**：顺序是全局排列问题，逐 token 交叉熵不好教。如果检测与识别模块
  在阅读顺序上吃力，可像这篇用 RL + 顺序奖励（edit distance / 序关系奖励）来优化。
- **结构正确性做 reward**：表格嵌套、单元格从属这种结构对错，用 reward 比 token loss 更贴目标。
- **HTML 作为结构化输出目标**：后端 AR 直出 HTML 能同时表达内容 + 结构 + 顺序，比纯 markdown
  表达力强（尤其复杂表格）。
- 呼应 [[mineru2.5-pro]]/[[firered-ocr]] 都用 RL(GRPO) 收尾——RL 对齐正成为文档解析标配。

## 关联
- 升级：[[logics-parsing-v2]]（Omni 统一分类法 + 证据锚定）
- 阅读顺序/关系也重点处理：[[dots-ocr]]、[[dolphin]]
- 同用 RL：[[mineru2.5-pro]]、[[firered-ocr]]
- 基准：[[omnidocbench]]
