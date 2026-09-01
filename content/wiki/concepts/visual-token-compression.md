---
type: concept
title: 视觉 Token 压缩（Visual Token Compression）
sources: [layoutlite, deepseek-ocr, unlimited-ocr]
tags: [ocr, visual-token-compression, efficiency, kv-cache, vlm, back-ar-relevant]
created: 2026-08-01
updated: 2026-08-01
---

# 视觉 Token 压缩 — 削减喂给解码器的视觉 token 数

## 是什么
VLM-OCR 里高分辨率文档图会产生**海量视觉 token**，其中大量对应空白边距/冗余区域。视觉 token 压缩 = 在进入语言解码器（后端 AR）前减少视觉 token 数，从而降 prefill 延迟、FLOPs、KV cache，并缓解长上下文导致的重复/漏字/结构错。对AR OCR 解码提速是**正交且高杠杆**的手段。

## 主要流派
1. **训练无关的注意力/像素剪枝**：FastV（深层视觉 token 注意力低→按分排序剪）、PixelPrune（编码前在像素空间按预测编码删冗余 patch）、DivPrune / FitPrune。即插即用但对 OCR 细节可能误删。
2. **光学/编码器级压缩**：[[deepseek-ocr]] DeepEncoder（SAM 窗口 → 16× 压缩 → CLIP 全局），从源头把视觉 token 压到很少。
3. **KV 侧压缩**：[[unlimited-ocr]] R-SWA 滑窗恒定 KV cache（压的是解码阶段 KV，不是视觉 token 数本身）。
4. **学习式 token 选择器**：[[layoutlite]]——插在编码器与解码器间，Conv1D 判跨层特征演化 → 打分 → K-means 阈值剪枝；GRPO 用「剪前后输出 Levenshtein 一致性」当奖励免标注训练，保留 OCR 关键细粒度。
5. **显式版面驱动**：两段 pipeline（[[paddleocr-vl]]/[[mineru2.5]]）先检测框再只识别框内——等价于用检测做「哪些 token 有用」的硬选择。

## 对检测—识别组合系统的意义
- 前端 DETR 出的框天然定义「哪些视觉 token 该喂后端 AR」→ 用检测做**显式、可控**的 token 压缩，比隐式打分更准。
- 通用压缩法直接上 OCR 易误删细节；OCR 专用压缩必须以**输出一致性**为约束（LayoutLite 用 Levenshtein 奖励）。
- 压缩时务必**保留保留 token 的原始位置编码**（MRoPE 坐标），否则后端解 markdown/表格/阅读顺序会乱。
- 甜点区经验：LayoutLite 在 ~50% 压缩前几乎不掉分，之后急剧退化。

## 相关
[[deepseek-ocr]]、[[unlimited-ocr]]、[[layoutlite]]、[[omnidocbench]]、[[hpd-parsing]]（减串行步，与压 token 正交可叠）
