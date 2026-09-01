---
type: concept
title: FCA — Flexible Character Accuracy（阅读顺序无关的字符精度）
sources: [ocr-vs-mllm-benchmark]
tags: [ocr, metric, evaluation, reading-order]
created: 2026-07-28
updated: 2026-07-28
---

# FCA — Flexible Character Accuracy

- 出处：Clausner, Pletschacher & Antonacopoulos (2020), *Pattern Recognition Letters* 131, 390–397
- 在本 wiki 首次出现于 [[ocr-vs-mllm-benchmark]]

## 是什么

一种 **edit-distance 型、对阅读顺序不变(reading-order-independent)** 的字符级 OCR 评测指标。它以**灵活方式**比较识别文本与 ground-truth 的子串（以行/line 为单元匹配），从而**把"字符识别精度"与"版面分析/序列化误差"解耦**。

## 为什么重要

标准 CA(=1−CER) 严格按字符序列对齐，一旦系统输出的**阅读顺序**与 GT 不一致（多栏、表格、复杂版面很常见），即使每个字都认对了，CA 也会暴跌。FCA 不受阅读序影响，所以：

- **FCA − CA 的 gap** 成了诊断信号：gap 大 = 误差主要来自阅读序/序列化，而非字符误识；gap 小 = 误差是真·字符误识/遗漏
- 实例（[[ocr-vs-mllm-benchmark]]）：DeepSeek-OCR 在 SROIE 上 FCA-CA gap ≈16.2，Gemini 2.0 Flash ≈5 → 生成式解码的阅读序问题；Qwen2.5-VL-3B gap ≈2 → 阅读序处理可靠

## 计算约定

- FCA 以**行(line)为单元**运作。原生返回行级转写的 OCR 引擎直接用其行结果
- 多模态 LLM 返回纯文本时，按输出里的换行符 `\n` 切出行单元

## 相关指标

- **CA / WA** = 1 − CER / WER（字符/词准确率，严格对齐）
- **NED**（Normalized Edit Distance）：放宽 reference-length 归一的字符级补充度量
- 对比基准视角另见 [[omnidocbench]]

## 对 OCR 评测与诊断的价值

评此类要输出复杂版面结构的模型时，**必须报 FCA + NED**，只看 CA 会把阅读序错误和字符错误混为一谈。FCA-CA gap 可作为**训练/调试信号**，专门定位后端 AR 解码的阅读序/serialization 缺陷——而前端 DETR 的 query-based 检测正好能给阅读序提供显式锚点。
