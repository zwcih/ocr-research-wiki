---
type: synthesis
title: "端到端 OCR / 文档解析的演进史"
sources: [crnn, craft, trocr, donut, nougat, pix2struct, got-ocr2, deepseek-ocr, monkeyocr-v2, ovis-ocr2, glm-ocr]
tags: [ocr, document-ai, synthesis, roadmap]
created: 2026-07-23
updated: 2026-07-23
---

# 端到端 OCR / 文档解析的演进史

> 一条从"多模块流水线"走向"单一端到端模型"、再走向"视觉即上下文"的主线。

## 三个时代（借 [[got-ocr2|GOT-OCR2.0]] 的 OCR-1.0 / OCR-2.0 之分）

### OCR-1.0 时代：检测 + 识别的多模块流水线
- **[[craft]]（2019）** 负责检测：字符区域热图 + 亲和力，处理任意形状文本
- **[[crnn]]（2015）** 负责识别：CNN+RNN+[[ctc]]，端到端识别文本行但仍是 pipeline 的一环
- 特点：每个子模块单独训练，误差逐级传播，工程复杂

### OCR-2.0 过渡：端到端 + OCR-free
- **[[trocr]]（2021）**：纯 Transformer（[[vit]] 编码 + 文本解码），抛弃 CNN+RNN+CTC，端到端识别
- **[[donut]]（2021）**：OCR-free 先驱，图像直接 → 结构化输出（JSON），避免外部 OCR 误差
- **[[nougat]]（2023）**：学术 PDF → 带 LaTeX 公式的 Markdown，Swin encoder + mBART decoder
- **[[pix2struct]]（2022）**：截图 → 简化 HTML 预训练，通用视觉语言理解

### OCR-2.0 成熟：统一端到端小模型
- **[[got-ocr2|GOT-OCR2.0]]（2024）**：580M 统一模型（80M 高压缩视觉 encoder + 0.5B 长上下文 decoder），
  通吃文字/公式/表格/乐谱/几何，提出 OCR-2.0 理念，可交互 region-level OCR
- **[[deepseek-ocr]]（2024）**：**Contexts Optical Compression** —— 把文本压成 vision token，
  10× 压缩下 97% 精度，把 OCR 提升到"用图像压缩长上下文"的高度
- **[[ovis-ocr2]]（2026，阿里）**：0.8B 端到端，OmniDocBench v1.6 **96.58 登顶**，
  首次让端到端压过 pipeline 榜首；训练用 RL + on-policy 蒸馏把大模型能力压进小模型
- **[[glm-ocr]]（2026，智谱）**：0.9B（CogViT 0.4B + GLM 0.5B），**Multi-Token Prediction** 提速，
  OmniDocBench v1.5 **94.6 第一**
- **[[monkeyocr-v2]]（2026）**：换个思路——不做又一个端到端模型，而是造**文档原生视觉底座**，
  用像素级重建保真，即插即用提升下游（[[crnn]] 识别 58.7%→67.3%）

## 三条清晰的技术趋势

1. **架构收敛**：多模块流水线 → 单一 encoder-decoder 端到端
2. **模型变小变强**：从数十亿参数 LVLM → 0.5–0.9B 专用小模型登顶主流榜（[[got-ocr2]]/[[ovis-ocr2]]/[[glm-ocr]]）
3. **效率成为新前沿**：光学压缩（[[deepseek-ocr]]）、多 token 解码（[[glm-ocr]] MTP）、
   RL+蒸馏（[[ovis-ocr2]]）—— 精度到顶后开始卷 token 效率与部署成本

## 两个开放张力（见 [[visual-compression-vs-reconstruction|视觉压缩vs视觉重建]]）
- **视觉压缩 vs 视觉重建**：[[deepseek-ocr]] 压得狠 vs [[monkeyocr-v2]] 保真优先
- **端到端大一统 vs 可替换底座**：造整个模型 vs 造一块通用视觉 encoder

## 评测参照
- [[omnidocbench]]（解析能力）+ [[gdp-pdf-benchmark|GDP.pdf]]（grounded 推理，最好模型仅 30.7%）
