---
type: source
title: "HunyuanOCR: Commercial-grade Lightweight 1B OCR VLM"
authors: [Tencent Hunyuan]
year: 2025
arxiv: "2511.19575"
sources: [hunyuan-ocr]
tags: [ocr, vlm, small-model, unified, spotting, translation, end-to-end]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---

# HunyuanOCR — 商用级轻量 1B OCR VLM（腾讯，2025）

📄 **原文**：[arXiv:2511.19575](https://arxiv.org/abs/2511.19575) · [PDF](https://arxiv.org/pdf/2511.19575)

> ⭐ 1B 单模型统一"感知(spotting/parsing) + 语义(信息抽取/翻译)"，证明小模型也能全能。

## 一句话
1B 参数轻量 VLM：**Native ViT 视觉编码器 + MLP adapter + 轻量 LLM**，
统一做 text spotting、文档 parsing、信息抽取(IE)、图像翻译；<3B 模型里 OCRBench SOTA，
ICDAR2025 小模型赛冠军，甚至打过商用 API 和 Qwen3-VL-4B。

## 架构要点
- **Native ViT**：原生分辨率视觉编码（同 NaViT 思路），保小字细节。
- **MLP adapter** 连接视觉与 LLM（极简对齐，非 Q-Former 那种重结构）。
- **一个模型多任务**：感知类（定位+识别）与语义类（抽取+翻译）共享，靠 prompt 区分任务。

## 对 OCR 系统设计的启示
- **极简连接器 (MLP adapter)**：视觉→LLM 不必上重型 resampler，MLP 够用且省参数——
  AR OCR 后端 接视觉特征时可先试最简方案。
- **多任务统一**：spotting/parsing/IE/翻译共用一套，说明AR OCR 后端 解码器可以靠 prompt
  扩展到"识别之外"的语义任务（抽取、翻译），一模多用。
- **1B 打过 4B**：再次印证小而精 + 好数据 > 堆参数，和 [[mineru2.5-pro]] 一个结论。

## 关联
- 同"native 分辨率编码器"：[[paddleocr-vl]]
- 小模型高性能：[[mineru2.5-pro]]、[[ovis-ocr2]]、[[glm-ocr]]
- 基准：[[omnidocbench]]
