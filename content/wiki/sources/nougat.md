---
type: source
title: "Nougat: Neural Optical Understanding for Academic Documents"
authors: [Blecher, et al. (Meta)]
year: 2023
arxiv: "2308.13418"
sources: [nougat]
tags: [document-ai, ocr, formula, milestone]
created: 2026-07-23
updated: 2026-07-25
reading: deep
---
# Nougat (2023) — 深度精读

📄 **原文**：[arXiv:2308.13418](https://arxiv.org/abs/2308.13418) · [PDF](https://arxiv.org/pdf/2308.13418)

> 里程碑 — 端到端把学术 PDF 页面图像转成带 LaTeX 公式的 Markdown，OCR-free。

## 一句话定位
一个 transformer VDU（Visual Document Understanding）模型，输入文档页图像，直接输出
结构化 Markdown（含数学公式的 LaTeX），无需任何外部 OCR 或版面分析工具。

## 核心贡献与架构
1. **视觉 encoder + 文本 decoder**（总参数 **350M**，渲染 **96 DPI**）：
   - encoder 用 **Swin Transformer**（层次化视觉特征）
   - decoder 用 **mBART** 式自回归文本解码（仅 **10 层**），输出 Markdown token
   - 💡 对造模型的启示：**后端 AR 不必大**——350M 总参 / decoder 仅 10 层就能做学术公式 markdown。
2. **OCR-free 端到端**：图像 → markup，避免传统 OCR pipeline 的误差传播
3. **大规模训练对构造**：从 arXiv 的 LaTeX 源码 + 编译 PDF 自动配对，
   构建页面图像 ↔ Markdown 的训练数据（含公式、表格）
4. 擅长**数学公式**与科学排版

## 关键机制
- 针对重复退化问题加入抗重复机制
- 处理跨页元素、阅读顺序

## 为什么是里程碑
- 把学术文档解析推进到端到端"图像→可编辑 Markdown"，尤其解决公式识别难题
- OCR-free 路线的代表，影响后续统一端到端 OCR

## 关联
- OCR-free 承 [[donut]]；encoder-decoder 生成思路对照 [[trocr]]/[[t5]]
- 与 [[got-ocr2]]、[[deepseek-ocr]]、[[monkeyocr-v2]] 同属端到端文档解析谱系
