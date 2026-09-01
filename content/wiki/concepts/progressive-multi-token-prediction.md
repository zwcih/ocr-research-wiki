---
type: concept
title: Progressive Multi-Token Prediction (P-MTP)
sources: [hpd-parsing, glm-ocr]
tags: [decoding, mtp, speculative-decoding, acceleration]
created: 2026-07-24
updated: 2026-07-24
---

# Progressive Multi-Token Prediction (P-MTP)

多 token 预测（MTP）的进阶版：不是每步只出下一个 token，而是用一个**轻量 residual MLP** 从 decoder hidden state **投机式预测多个未来 token**，单步 draft → 并行验证 → accept 若干个，从而压缩 AR 解码步数。属 [[speculative-decoding]] 家族。

## "Progressive" 是什么
- 对 look-ahead 深度 k 采用**渐进 loss 加权** W_{t,k}：k=0 是标准 next-token（权重 1），k≥1 用距离衰减 + path/target 一致性信号，**down-weight 不可靠的远距离预测**。
- 越远的推测越难，权重越小 → 训练稳定，避免长程 draft 拖累。

## 相对普通 MTP 的差异
- [[glm-ocr]] 用的是标准 MTP（每步推进多 token）。
- P-MTP 加了渐进加权 + 与主任务联合优化的掩码（式2），对**局部 grounded、轨迹可预测**的 OCR content 分支尤其有效。

## 效果（见 [[hpd-parsing]]）
- 在 HPD-Parsing 里平均 **accept 6.6 token/步**，layout 与 content 分支都用。
- 与「分支并发」正交：并发缩跨区块串行，P-MTP 缩分支内串行。

## 对 AR 解码的意义
文档 OCR 的输出高度 grounded 于局部视觉证据、轨迹相对可预测 → 是 speculative/MTP 的理想场景。前端 DETR + 后端 AR 架构里，P-MTP 可正交叠在 AR 解码上提吞吐。
