---
type: synthesis
title: "OCR/文档解析的合成数据 — 方法专题"
sources: [ovis-ocr2, points-reader, mineru2.5-pro, firered-ocr, textbooks-are-all-you-need, donut, nougat, pix2struct, unirec-opendoc]
tags: [synthesis, synthetic-data, data-engine, ocr, document-parsing, training-data]
created: 2026-07-23
updated: 2026-07-23
---

# OCR/文档解析的合成数据 — 方法专题

> 真实标注昂贵且可能带有 parser 噪声；合成数据提供了**规模、可控性和精确 GT**。本页汇总主要方法与常见问题。

## 0. 为什么合成数据对 OCR 系统特别重要

- **前端 DETR 需要海量精确框标注** → 真人标框贵到离谱；合成数据从 DOM/结构源**自动出紧致 bbox**，
  完美 GT，零标注成本。
- **后端 AR 需要 (图, 结构化文本) 对** → 真实文档的 GT 靠 OCR parser 反标，会带 parser 噪声；
  合成可做到**标签确定性**。
- **覆盖长尾/难例**：真实数据里罕见的复杂表格、多列、手写、旋转，可按需合成放大。

## 1. 黄金原则：source-of-truth（[[ovis-ocr2]] 最典范）

> **图像和标签都从同一份结构源（HTML）生成，而不是"渲染完再解析图得标签"。**

- 好处：训练 target **确定性**、零 parser 噪声。这是合成数据能不能用的分水岭。
- 反例：如果研究者渲染出图再用 OCR 反标，等于把 parser 的错也学进去了 → 合成的意义大打折扣。
- 对 OCR 系统：合成表格/公式一定从 HTML/LaTeX 源同时出图 + 出标签 + 出 bbox（DOM 几何）。

## 2. OvisOCR2 的完整合成 pipeline（当前最细的范本）

五步闭环（细节见 [[ovis-ocr2]]）：

1. **Hard sample mining（难样本驱动，不随机合成）**
   - 从**失败案例**挖难样本：表格密集/不规则结构/页眉页脚干扰/手写/页码歧义/复杂阅读顺序。
   - 相似难例归成 **synthesis family**——一个模板覆盖**一类**失败模式，避免过拟合单页。
   - 洞见：**把观察到的错误变成可扩展的数据生成器**。
2. **多模态模型 → 初始 HTML 模板**
   - 从难样本推断视觉/结构意图，生成 HTML 模板；需定位的元素用**显式 DOM span/wrapper**
     → 渲染时可取**紧致 bbox**（给前端 DETR 干净框）。
3. **Agent-based 多样化**
   - agent 编辑扩展模板：内容级（语义字段/文本长度/数值/公式/术语）+ 结构级（表格结构/章节层级/
     页面组织/区域位置）随机化。
   - 受 **validity 约束**：必须可渲染、可转合法 Markdown、类别合规；配 domain 随机内容池
     → 规模 + 结构多样 + 标签干净三者兼得。
4. **序列化出 Markdown GT + 阅读顺序**
   - 按元素类型分别序列化（文本→MD；表格→HTML 片段；公式→LaTeX；视觉区域→`<img>` 带
     [0,1000) 归一化坐标）。**阅读顺序按文档类型规则**（单列 vs 多列分区遍历）。
5. **Playwright 渲染 + DOM 几何**
   - 浏览器渲染保真实排版/表格线/换行；从 DOM 记录 element bbox；增强（旋转/几何扰动）时
     **坐标同步变换**。最后 preview-and-iteration 质检。

## 3. 其他路线的合成数据做法

- **[[points-reader]] — 无蒸馏 + 迭代自改进 (ISS)**：不靠大模型蒸馏（蒸馏会传噪声），
  先合成打底，再让模型在真实文档上跑 → 筛高质量输出回灌 → 迭代逼近真实分布。
  **适合没有强 teacher 时**用合成 + 自产自销闭环。
- **[[mineru2.5-pro]] — Data Engine（数据>架构的铁证）**：架构不改，围绕 coverage/difficulty/
  quality 三轴构造 65.5M 页，+2.71 分打过 200× 大模型。核心论点：**失败模式一致 → 瓶颈在数据不在架构**。
- **[[firered-ocr]] — "几何 + 语义" Data Factory**：非随机采样，按几何(版面)+语义双维度构造，
  优于随机 → 数据分布要**主动设计**而非碰运气。
- **[[donut]] — SynthDoG**：早期经典合成引擎，用中/日/韩/英 Wikipedia 各生成 0.5M 合成文档做预训练，
  **摆脱对真实标注文档的依赖**。是"合成打底预训练"的开山之一。
- **[[textbooks-are-all-you-need|phi]]**：LLM 生成"教科书级"合成数据 + 严格筛选 → 小模型高性能。
  给文档智能的启示：**质量 > 规模**，合成要配筛选。
- **[[nougat]] / [[pix2struct]]**：学术 PDF↔源码对齐、网页截图↔DOM——本质也是"从结构源造 (图,文) 对"，
  和 source-of-truth 一脉相承。

## 4. 合成数据的坑（各家踩过的）

- **realism gap（合成↔真实差距）**：naive 合成缺真实感（扫描噪声、字体、背景、畸变）。
  → 解法：真实 pipeline 补分布（Ovis 双 pipeline）、增强（旋转/退化）、ISS 回灌真实分布。
- **parser 噪声**：真实数据反标 + 合成"渲染后反解析"都会引入 → source-of-truth 根治。
- **过拟合单一模板**：随机合成或单模板 → synthesis family 归类 + agent 多样化解决。
- **标签失效**：多样化时改坏了结构 → validity 约束（可渲染/可转合法标签）兜底。
- **蒸馏传噪声**：从大模型蒸标签会把大模型的结构错误传下去（POINTS-Reader 的核心批判）。

## 5. 目标系统的合成数据行动清单

1. **source-of-truth**：HTML/LaTeX 结构源同时出「图 + Markdown/HTML 标签 + DOM bbox」。
2. **难样本驱动**：从我模型失败案例挖难例 → 归 synthesis family → 造模板放大（不随机合成）。
3. **DOM span 取紧致 bbox** → 直接喂前端 DETR，合成数据自带完美框 GT。
4. **agent 多样化 + validity 约束**：规模与标签正确性兼得。
5. **Playwright 渲染** + 增强时坐标同步变换（旋转/透视，配合 [[dolphin-v2]] 的绝对坐标需求）。
6. **真实 pipeline 补 realism**：合成打底覆盖结构，真实数据补视觉分布，双管齐下。
7. **质检保守**（Ovis 原则）：只筛不改，别用自由生成"修复"标签。
8. **没有 teacher 就上 ISS**（POINTS-Reader）：合成 + 迭代自改进回灌。

## 关联
- 最细范本：[[ovis-ocr2]]
- 数据>架构：[[mineru2.5-pro]]、[[data-quality-over-scale]]、[[textbooks-are-all-you-need]]
- 无蒸馏自改进：[[points-reader]]
- 早期合成引擎：[[donut]]、[[nougat]]、[[pix2struct]]
- 数据工厂：[[firered-ocr]]
