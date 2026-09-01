---
type: source
title: "DeepSeek-OCR: Contexts Optical Compression"
authors: [DeepSeek-AI]
year: 2025
arxiv: "2510.18234"
sources: [deepseek-ocr]
tags: [ocr, optical-compression, vision-token, moe, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-25
---
# DeepSeek-OCR (2025) — 深度精读

📄 **原文**：[arXiv:2510.18234](https://arxiv.org/abs/2510.18234) · [PDF](https://arxiv.org/pdf/2510.18234)
> 里程碑 ⭐ — 提出「Contexts Optical Compression」：把长文本用**光学 2D 映射**压成极少 vision token，10× 压缩下仍有 97% OCR 精度，为「用图像压缩长上下文」开辟新思路。

## 一句话定位
不只是 OCR 模型，而是验证一个大胆命题——**用图像作为文本上下文的压缩介质**。一页文字渲染成图，用远少于文本 token 数的 vision token 表示，再由 decoder 高精度还原文字；从而把 LLM 长上下文成本大幅降低。

## 核心贡献
1. **Contexts Optical Compression 概念**：把「文本 token」压成「vision token」，实验证明当文本 token 数 ≤ vision token 数的 **10 倍（压缩比 <10×）时，OCR 解码精度达 97%**；即使压缩比 **20× 精度仍约 60%**——对长上下文压缩、记忆遗忘等研究极具启发。
2. **DeepEncoder（高压缩视觉编码器）**：核心组件，在**高分辨率输入下仍保持低激活、输出可控的极少 vision token**，通过多档压缩比灵活取舍精度/token 数。
   - **真实串联结构（对造前端最有价值）**：**window attention (SAM) → 16× 卷积压缩器 → global attention (CLIP)**。设计意图：高分辨率下先用**窗口注意力扁住大量 token 的激活**，再压 16× 后才上**全局注意力**。这个“先局部窗口扑激活、压缩后再全局”对造 OCR 前端处理高分辨密集页非常有借鉴价值。
3. **极致 token 效率**：在 OmniDocBench 上，**仅用 100 vision tokens/页就超过 GOT-OCR2.0（256 tokens/页）**；用 <800 vision tokens 就超过 MinerU2.0（平均 6000+ tokens/页），效率碾压。

## 架构 / 方法细节
- 两部分：**DeepEncoder**（视觉编码 + 高压缩）+ **DeepSeek3B-MoE-A570M** 解码器（3B MoE，激活约 570M 参数），兼顾能力与推理成本。
- DeepEncoder 串联全局感受野组件与压缩模块，支持多种分辨率/压缩档（含 Gundam / Gundam-M 200dpi 等高分辨率模式）应对超密文档。
- 训练目标围绕 OCR 还原，天然可**为 LLM/VLM 生产训练数据**（大规模文档→文本）。

## 关键结果（真实数字）
- **压缩比 <10× → 97% 精度；20× → 约 60% 精度**（Fox benchmark 上文本/视觉 token 比与精度关系）。
- **OmniDocBench**：100 vision tokens 超 GOT-OCR2.0(256)；<800 tokens 超 MinerU2.0(6000+)；Gundam 模式 edit/精度指标进一步领先（如整体识别率达 90%+ 量级）。
- 生产可用：单卡日处理海量页面，规模化生成 LLM/VLM 预训练语料。

## 为什么是里程碑
把 OCR 从「识别任务」升华为「上下文压缩范式」——第一次系统论证「一图胜千 token」，为长上下文 LLM 提供全新的光学压缩路线；同时在 token 效率上重新定义文档解析 SOTA。

## 关联
- 延续 [[got-ocr2]] 的统一 OCR-2.0 思路但更强调 token 压缩效率；decoder 为 DeepSeek 系 MoE 语言模型。
- 视觉编码理念与 [[vit]]/[[clip]] 相关；评测主战场 [[omnidocbench]]，同赛道对手含 [[glm-ocr]]、[[monkeyocr-v2]]、[[ovis-ocr2]]。
