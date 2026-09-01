---
type: source
title: "GLM-OCR Technical Report"
authors: [Duan, Xue, Wang, et al. (Zhipu AI / Tsinghua)]
year: 2026
arxiv: "2603.10910"
sources: [glm-ocr]
tags: [ocr, document-parsing, compact, multi-token-prediction, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-25
---
# GLM-OCR (2026) — 深度精读

📄 **原文**：[arXiv:2603.10910](https://arxiv.org/abs/2603.10910) · [PDF](https://arxiv.org/pdf/2603.10910)
> 里程碑 ⭐ — 智谱 0.9B 紧凑多模态 OCR 模型，用 Multi-Token Prediction 提速，仅 0.9B 参数在 OmniDocBench v1.5 上得 **94.6**，为所有被评 OCR/紧凑模型中第一（通用大模型 GPT-5.2 更高，达 95.2）。

## 一句话定位
面向真实文档理解的**高效紧凑**模型：0.4B CogViT 视觉编码 + 0.5B GLM 语言解码 = 0.9B，靠 MTP（一步预测多 token）解决 OCR 这类确定性任务下自回归逐 token 解码太慢的问题，兼顾边缘部署与大规模生产。

## 核心贡献
1. **0.9B 紧凑架构却 SOTA**：CogViT (0.4B) + 轻量跨模态 connector + GLM decoder (0.5B)，在 [[omnidocbench]] v1.5 上 **94.6 分**，为被评 OCR/紧凑模型中第一，超过更大的对手。
2. **Multi-Token Prediction (MTP)**：训练时让模型**一步预测 10 个 token**，推理平均每步生成 **5.2 token**，带来约 **50% 吞吐提升**；通过参数共享把 MTP 的额外显存开销压到很低。
3. **系统级两阶段流水线**：先用 **PP-DocLayout-V3** 做版面分析，再对各区域**并行 region-level 识别**，兼顾结构准确与吞吐。

## 架构 / 方法细节
- 建立在 GLM-V encoder–decoder 框架上；CogViT 在大规模图文数据上训练。
- MTP 同时用于训练与推理，显著提升训练效率与解码吞吐，同时保持识别精度。
- 输出为结构化文本（Markdown/LaTeX 公式、表格结构、KIE 字段等）。
- 面向工程三大需求：复杂内容（表格/公式/代码/印章）强、低延迟高吞吐、易集成与领域适配。

## 关键结果（真实数字）
- **OmniDocBench v1.5：94.6**，在所有被评 **OCR/紧凑模型**中**排名第一**，而参数仅 0.9B（对比 PaddleOCR-VL、MinerU2.5 等更大模型）。⚠️ 注意：原文对比表中通用大模型 **GPT-5.2 得 95.2 更高**，故非绝对第一。
- 其它 benchmark：OCRBench-Text **94.0**、UniMERNet **96.5**、KIE 类 **85.2**，佐证全能。
- 在文档解析、文字/公式转写、表格结构恢复、关键信息抽取 (KIE) 上均达到 competitive/SOTA。
- MTP 带来约 50% 吞吐提升，适配资源受限边缘与大规模生产。

## 为什么是里程碑
证明**小模型 + MTP 高效解码**可在文档解析上击败更大模型，把「精度」与「吞吐/成本」同时推进；MTP 引入 OCR 是解码效率上的重要工程创新。

## 关联
- 属 [[got-ocr2]] / [[deepseek-ocr]] 之后的统一 OCR 大模型一代，走「小而快 + 结构化输出」路线；视觉骨干 CogViT 属 [[vit]]/[[clip]] 系。
- 主评测 [[omnidocbench]]；同赛道对手 [[monkeyocr-v2]]、[[ovis-ocr2]]、[[deepseek-ocr]]。
