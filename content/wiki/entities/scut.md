---
type: entity
title: 华南理工大学 SCUT（DLVC-Lab）
tags: [org, htg, handwriting, china, academia]
sources: [one-dm, diffbrush]
created: 2026-07-23
updated: 2026-07-25
---

# 华南理工大学 SCUT（DLVC-Lab）

华南理工大学深度学习与视觉计算实验室（DLVC-Lab），在**扩散手写文本生成（HTG）**方向连续产出，从单词级到文本行级持续推进。

## 本 Wiki 相关工作
- [[one-dm]]（ECCV 2024，Dai…黄双萍）— 单样本手写风格模仿：**style-enhanced module** 从单个参考样本抽高频信息（倾斜/连笔）稳健抽风格，与文本内容融合引导扩散。门槛最低（单样本即可）。
- [[diffbrush]]（ICCV 2025，Dai…，One-DM 同组）— 首批把扩散用于手写**文本行**生成之一：直接生成整行（含词间距/对齐/连笔），content-decoupled style learning + multi-scale content learning，风格 + 内容双强，解决单词级方法固定词间距不真实的问题。

## 定位
主攻方向：**扩散式手写风格模仿**，从单词级（One-DM）演进到行级（DiffBrush）。团队：DLVC-Lab（文本检测/识别/文档分析 + HTG，与 NUS/MiroMind/Skywork 合作）。活跃时间：2024–2025。HTG 谱系角色：扩散时代手写合成的中国学术主力，行级生成的开创者之一，为 OCR 训练提供高保真合成数据。
