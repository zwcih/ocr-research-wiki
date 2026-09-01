---
type: source
title: "MonkeyOCRv2: A Visual-Text Foundation Model for Document AI"
authors: [Liu, Li, Zhang, ..., Bai (HUST / Kingsoft)]
year: 2026
arxiv: "2607.11562"
sources: [monkeyocr-v2]
tags: [ocr, document-ai, visual-encoder, foundation-model, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-25
---
# MonkeyOCRv2 (2026) — 深度精读

📄 **原文**：[arXiv:2607.11562](https://arxiv.org/abs/2607.11562) · [PDF](https://arxiv.org/pdf/2607.11562)
> 里程碑 ⭐ — 提出**文档专属视觉基础模型**：主流视觉编码器在自然图像上预训练，无法胜任密集文字与字符级笔画感知；MonkeyOCRv2 用「图→文生成 + 像素级重建」联合预训练，成为文档智能的通用视觉底座。

## 一句话定位
不做又一个端到端 OCR，而是造一个**文档原生的视觉 encoder**：在 1.13 亿文档图像上联合学「图像→文本生成」（对齐视觉与文字内容）和「像素级文档重建」（保留字符笔画与版面细节），替换现有编码器即可全面提升下游文档任务。

## 核心贡献
1. **MonkeyDoc v2 —— 已知最大文档图像预训练语料**：**1.13 亿张图像、覆盖 17 种语言**（远超 ImageNet/SA-1B 这类自然图像集在文档域的适配）。
2. **双目标预训练**：image-to-text generation（视觉表示对齐文字）+ pixel-level reconstruction（保住字符笔画/布局），产出 document-native 表征，弥合自然图像编码器与文档图像的鸿沟（对比 [[clip]]/SigLIP 只做全局语义对齐）。
3. **即插即用提升五大任务**：替换原编码器后，文本识别、公式识别、文本检测、文档篡改检测、重叠文本分割**五项全面提升**——如把 **[[crnn]] 整体识别率从 58.7% 提到 67.3%**，让 110M 的 UniMERNet-T 反超 325M 的 UniMERNet-B。

## 架构 / 方法细节
- encoder-only 视觉基础模型，联合 text generation 与 pixel reconstruction 双头预训练。
- 可作为 MLLM 的视觉编码器：**冻结 encoder + 轻量语言模型**即得 0.7B 文档解析模型。
- 强调字符级视觉感知（dense text / fine-grained strokes），这是自然图像编码器缺失的能力。

## 关键结果（真实数字）
- **0.7B 文档解析模型在 MDPBench（17 语言，数字原生+拍照文档）刷新开源 SOTA**：超过此前最好的 3B **dots.mocr 达 2.8% 绝对分**，而视觉编码器**小约 11×**；另超 **PaddleOCR-VL-1.6 达 8.3%**。
- **OmniDocBench 上超越远大得多的通用 VLM**，如 **Qwen3-VL-235B 与 GPT-5.2**。
- 冻结编码器驱动的文档理解模型，在**相同训练设置下于 8 个基准全面超过基于 CLIP / DINO / SAM 的对手**。

## 为什么是里程碑
论证「面向文档的视觉预训练」本身可作为文档智能的基础模型——像素级重建 + 图文生成让编码器学到字符笔画级感知；用小得多的编码器击败数百 B 的通用 VLM，重塑文档 AI 的骨干选择。

## 关联
- 作为视觉底座提升传统识别器 [[crnn]] 与检测/公式模型；对比全局对齐的 [[clip]]、自监督的 [[mae]]/DINO、分割的 SAM。
- 属统一文档 OCR 一代（[[got-ocr2]]、[[deepseek-ocr]]、[[glm-ocr]]、[[ovis-ocr2]]）中「造更好视觉 encoder」的路线；主评测 [[omnidocbench]]。
