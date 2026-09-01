---
type: source
title: "Ovis-OCR2: 0.8B End-to-End Document Parsing (OmniDocBench SOTA)"
authors: [Alibaba]
year: 2026
arxiv: "2607.13639"
sources: [ovis-ocr2]
tags: [ocr, document-parsing, end-to-end, small-model, data-engine, synthetic-data, distillation, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-25
---

# Ovis-OCR2 — 0.8B 端到端文档解析（阿里，2026）

📄 **原文**：[arXiv:2607.13639](https://arxiv.org/abs/2607.13639) · [PDF](https://arxiv.org/pdf/2607.13639)

> ⭐ 0.8B 端到端打过榜首的 pipeline 方法。**最值钱的是它的 data engine（尤其合成数据 pipeline）**——详见 [[synthetic-data-for-ocr]] 专题。

## 一句话
0.8B 端到端文档解析模型，OmniDocBench **v1.6** SOTA（**96.58**），**首次让端到端超过榜单领先的 pipeline 方法**。基座为 **Qwen3.5-0.8B**（Qwen3.5 家族最小模型）后训练。
核心不是网络花活，而是 **data engine（真实+合成双 pipeline）** + 适配长输出的 training recipe +
teacher/student 蒸馏融合。

## ⭐ Data Engine（这篇的灵魂，两条互补 pipeline）

### 真实数据 pipeline
- 用专门 OCR parser（如 MinerU2.5-Pro）把真实文档图转成训练标注。
- **归一化**：公式统一成 LaTeX-style Markdown；表格必须是合法 HTML `<table>` 结构。
- **保守质检**（不重写只筛选）：公式渲染回去比对、visual-region bbox 渲染核对；
  子集只偶发小错→保留，频繁错→整块剔除。目的是"别让脏数据污染语料"，不做自由生成修复。

### 合成数据 pipeline —— **source-of-truth 原则**
> 图像和 Markdown target **都从同一份 HTML 源**生成，而不是"渲染完再解析图得标签" →
> 标签**确定性**、零 parser 噪声。这是合成数据质量的关键设计。

五步（详见 [[synthetic-data-for-ocr]]）：
1. **Hard sample mining**：不随机合成，而从失败案例挖难样本（表格密集/不规则结构/页眉页脚干扰/
   手写/页码歧义/复杂阅读顺序），把相似难例归成 synthesis family（一个模板覆盖一类失败模式）。
2. **多模态模型生成初始 HTML 模板**：从难样本推断视觉/结构意图 → HTML 模板，
   需精确定位的元素用显式 DOM span/wrapper（渲染时能取紧致 bbox）。
3. **Agent-based HTML 多样化**：agent 编辑扩展模板，内容级（语义字段/文本长度/数值/公式/术语）
   + 结构级（表格结构/章节层级/页面组织/视觉区域位置）随机化；受 validity 约束
   （必须可渲染、可转合法 Markdown、类别合规），配 domain 随机内容池。
4. **Markdown ground truth**：从 HTML 源按元素类型序列化（文本→MD；表格→HTML 片段；
   公式→LaTeX；视觉区域→`<img>` 带 [0,1000) 归一化坐标）。**阅读顺序按文档类型规则**
   （单列上下左右、多列先分列再遍历）。
5. **Playwright 渲染**图像 + 从 DOM 记录 element-level 几何（紧致 bbox），
   增强（旋转/几何扰动）时坐标同步变换。最后 preview-and-iteration 质检。

### 训练：teacher/student + 融合
- Teacher 分支：4B SFT → 4B RL(结构反馈)得对齐 policy。
- Student 分支：0.8B SFT init → **On-policy Distillation (OPD)** + Model Fusion(加权平均)。

## 对 OCR 系统设计的启示
- **source-of-truth 合成**：需要合成表格/公式/版面数据，一定从 HTML/结构源同时出图和标签，
  别渲染完再 OCR 反标——否则引入 parser 噪声。
- **hard-sample-centric 合成**：从我模型的失败案例挖难样本 → 归类 → 造模板 → 放大，
  比随机合成高效得多（把错误变成可扩展的数据生成器）。
- **agent 多样化 + validity 约束**：用 agent 扩模板但强制"可渲染+可转合法标签"，规模与质量兼得。
- **Playwright 渲染取紧致 bbox**：DOM span 直接给检测前端 DETR 干净的框标注（合成数据自带完美 GT 框）。
- **OPD 蒸馏**：大 teacher 对齐后蒸给 0.8B student，是端到端小模型上量的关键。

## 关联
- 合成数据专题：[[synthetic-data-for-ocr]] ⭐
- 用它做 teacher parser：[[mineru2.5-pro]]
- 端到端 vs pipeline：[[dots-ocr]]、[[e2e-ocr-comparison]]
- 基准：[[omnidocbench]]
