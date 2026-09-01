---
type: entity
title: Google DeepMind（含 Google Research）
tags: [org]
sources: [attention-is-all-you-need, bert, t5, vit, pix2struct, chinchilla]
created: 2026-07-23
updated: 2026-07-25
---
# Google DeepMind（含 Google Research）

**一句话定位**：现代深度学习基础设施的奠基者——Transformer 及其 NLP/CV 后裔几乎都源自谷歌体系。

**主攻方向**：基础架构与大模型、NLP 预训练、视觉 Transformer、多模态文档/截图理解、Scaling Law 与算力最优训练、AGI 研究。

**代表作**：
- [[attention-is-all-you-need|Transformer]]——2017 年 Google Brain / Google Research，重定义序列建模。
- [[bert]]（2018，编码器双向预训练）、[[t5]]（2019，text-to-text 统一范式）——NLP 预训练两座里程碑。
- [[vit]]（2020，Vision Transformer，将 Transformer 引入视觉）。
- [[pix2struct]]（截图解析式预训练，视觉语言/文档理解）。
- [[chinchilla]]（DeepMind，算力最优 Scaling Law，参数-数据配比经典结论）。

**活跃时间**：Google Brain（2011 起）与 DeepMind（2010 创立、2014 被谷歌收购）长期领跑；2023 年 4 月两者合并为 Google DeepMind，Demis Hassabis 任 CEO；Google Research 仍作为独立部门运行。

**在 OCR 谱系里的角色**：并非专攻 OCR，但提供了全行业赖以生存的底层积木——Transformer / ViT 是几乎所有现代 OCR/文档解析 VLM 的骨架，[[pix2struct]] 更是"截图→结构"端到端文档理解的早期范式。
