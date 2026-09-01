---
type: concept
title: Speculative Decoding（投机解码）
sources: [hpd-parsing]
tags: [decoding, acceleration, mtp]
created: 2026-07-24
updated: 2026-07-24
---

# Speculative Decoding（投机解码）

一类加速自回归解码的通用范式：用一个**便宜的 draft 机制**一次性猜出多个未来 token，再用主模型**并行验证**，接受最长的正确前缀。单步能 accept 多个 token → 减少串行解码轮数，输出分布与逐 token 解码等价（verify 保证）。

## 常见形态
- **草稿模型 + 大模型验证**（经典 speculative decoding）。
- **Multi-Token Prediction (MTP)**：模型自带轻量头预测多 token（自投机），如 [[glm-ocr]]。
- **[[progressive-multi-token-prediction]]（P-MTP）**：MTP + 渐进 loss 加权，[[hpd-parsing]] 用。
- **DFlash 类**（HunyuanOCR-1.5）：并行 draft 生成。

## 为什么适合 OCR/文档解析
文档内容高度 grounded 于局部视觉证据，生成轨迹**相对可预测** → draft 命中率高、accept 长度长（HPD 里达 6.6 token/步），加速收益显著。是「后端 AR」提吞吐的正交手段。
