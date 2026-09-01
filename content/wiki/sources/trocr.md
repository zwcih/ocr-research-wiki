---
type: source
title: "TrOCR: Transformer-based Optical Character Recognition with Pre-trained Models"
authors: [Li, Lv, Cui, et al.]
year: 2021
arxiv: "2109.10282"
sources: [trocr]
tags: [ocr, text-recognition, transformer, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---
# TrOCR (2021) — 深度精读

📄 **原文**：[arXiv:2109.10282](https://arxiv.org/abs/2109.10282) · [PDF](https://arxiv.org/pdf/2109.10282)
> 里程碑 ⭐ — 第一个**纯 Transformer、无 CNN 无 CTC** 的端到端 OCR 识别模型，用预训练视觉+语言模型初始化，在印刷/手写/场景文字三类上同时刷 SOTA。

## 一句话定位
把文本行识别彻底做成「图像 Transformer 编码器 + 文本 Transformer 解码器」的生成式 seq2seq：encoder 吃图像 patch，decoder 自回归吐 wordpiece，无需 CNN 骨干、无需 CTC、无需复杂前后处理。

## 核心贡献
1. **纯 Transformer 编解码 OCR**：抛弃「CNN encoder + RNN/CTC decoder」的混合范式（见 [[crnn]]），首次证明 vanilla Transformer 编解码在 OCR 上能做到 SOTA。
2. **善用大规模预训练权重**：encoder 用 **DeiT / BEiT** 初始化，decoder 用 **RoBERTa** 初始化，把 CV 与 NLP 的预训练红利同时引入 OCR。
3. **三任务通吃**：同一架构在 printed（SROIE）、handwritten（IAM）、scene text 三类数据上都拿 SOTA，且无需 task-specific 模块。

## 架构 / 方法细节
- **Encoder**：图像 resize 到 384×384，切成 16×16 patch 展平成序列（+[CLS]），走标准 Transformer 编码器（ViT/DeiT/BEiT 式）。
- **Decoder**：原版 Transformer 解码器，插入 encoder-decoder cross-attention，attention mask 保证自回归；隐状态经线性层投到 wordpiece 词表（用 RoBERTa/BPE 词表，非字符级）。
- **三个规格**：TrOCR-Small **62M**（DeiT-Small enc + MiniLM dec）、TrOCR-Base **334M**（BEiT-Base enc + RoBERTa-Large dec）、TrOCR-Large **558M**（BEiT-Large enc + RoBERTa-Large dec）。
- **两阶段预训练**：先在数亿合成文本行图上预训练，再在下游数据微调；数据增强含 RandAugment、erosion、downscaling 等。

## 关键结果（真实数字）
- **SROIE (印刷收据, Task2) F1 = 96.59**（TrOCR-Large），登顶 SROIE leaderboard，超过之前所有方法。
- **IAM (手写) CER = 2.89**（TrOCR-Large），刷新 SOTA；且**未用任何额外人工标注数据**即可媲美用内部私有数据的 Diaz et al. 2021。TrOCR-Base CER 3.42。
- **Scene text**（IIIT5K/SVT/IC13/IC15/SVTP/CT80）多数基准 SOTA（IIIT5K 上因含符号样本略逊）。
- 推理速度：base 与 small 差距不大；small 参数少一半、速度约快一倍，适合部署。

## 为什么是里程碑
标志 OCR 识别从「CNN+CTC」正式迈入「预训练 Transformer 生成式」时代；「视觉编码器 + 语言解码器 + 自回归生成」成为之后 [[donut]]、[[nougat]]、[[got-ocr2]]、[[deepseek-ocr]] 等文档/OCR 大模型的通用骨架。

## 关联
- 取代 [[crnn]]+[[ctc]] 的经典识别范式；encoder 用 [[vit]]/DeiT/[[mae]]-类（BEiT）初始化，decoder 用 [[bert]]-家族的 RoBERTa。
- 是生成式文档 OCR [[donut]]、[[nougat]]、[[got-ocr2]]、[[deepseek-ocr]] 的直接思想源头；底层依赖 [[attention-is-all-you-need]]。
