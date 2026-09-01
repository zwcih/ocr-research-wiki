---
type: synthesis
title: "手写文本合成 (HTG) — 为 OCR 造手写训练数据的方法专题"
sources: [diffbrush, mae-ldm-htg, diffusionpen, one-dm, stylusai, vatr, ovis-ocr2, points-reader]
tags: [synthesis, synthetic-data, handwriting, htg, diffusion, ocr, training-data]
created: 2026-07-23
updated: 2026-07-23
---

# 手写文本合成 (HTG) — 为 OCR 造手写训练数据的方法专题

> 本页聚焦用于 OCR 训练的**手写文本合成数据**。
> 手写和印刷体合成（见 [[synthetic-data-for-ocr]]）本质不同：印刷体靠 HTML+字体渲染即可
> （source-of-truth 天然成立），**手写的核心难点是笔迹的自然性 + 风格多样性**——
> 没法用"选个字体"糊弄，必须**生成模型**造。

## 0. 为什么手写要单独一套方法

- **印刷体**：字形确定，HTML/字体渲染 → 图 + 标签 + bbox 全自动，标签零噪声（source-of-truth）。
- **手写**：同一个字每次写都不一样，笔画粗细/倾斜/连笔/间距因人而异。选字体渲染出来的"假手写字体"
  太规整、多样性差，OCR 学了泛化不到真实手写 → **必须用生成模型学真实笔迹分布**。
- 手写 GT 文本是已知的（预期让它写什么就写什么），所以 HTG 的挑战不在"内容标签"，
  而在 **①风格逼真且多样 ②内容(文字)不写错 ③能生成整行而非孤立单词**。

## 1. 架构演进：GAN 时代 → 扩散时代

- **GAN/Transformer 时代（~2020–2023）**：GANwriting、Handwriting Transformers(HWT)、
  [[vatr|VATr]]。few-shot 风格 + one-hot/字形内容，但训练不稳、多样性有限。
  - **[[vatr|VATr]]** 的关键遗产：把文本内容表示成 **GNU Unifont 字形图像序列**（"visual archetypes"）
    而非 one-hot → **罕见字符**能借与常见字符的视觉相似性被更好生成。**这招我可直接借**
    （造罕见字/生僻符号的手写数据）。
- **扩散时代（2024–）**：Latent Diffusion 成 SOTA，风格保真度和多样性大幅超 GAN。下面全是扩散。

## 2. 三个关键维度 + 代表作

### 维度 A：风格控制需要几个样本（样本量越少越好铺量）
- **one-shot：[[one-dm|One-DM]]**（单样本模仿任意风格）。核心 = **style-enhanced module 抽高频信息**
  （字符倾斜、连笔等风格线索），从单个稀疏样本稳健抽风格，甚至超过用 10+ 样本的旧法。
  → **门槛最低**：给一个新写手/新语言一张样本就能铺风格多样性。
- **5-shot：[[diffusionpen|DiffusionPen]]**。**混合风格提取器**（metric learning + classification）
  同时抓可见/不可见的单词与风格；还用 multi-style mixtures + noisy embeddings 加多样性。
  → **已在 IAM 实证生成数据能提升 HTR 识别**（"造数据提识别"最直接的证据）。
- **未见风格泛化：[[mae-ldm-htg|MAE-LDM]]**（Semi-Supervised Adaptation）。用 **masked autoencoder
  学风格条件** → 生成训练时**没见过**的书写风格；专门的 content encoder + classifier-free guidance。
  → **核心卖点就是"为下游造训练图"**，且提**半监督适配**：IAM 训练、RIMES 验证，适配无标注新数据集。

### 维度 B：生成粒度（单词 → 文本行）
- 单词级：One-DM / DiffusionPen / StylusAI / MAE-LDM。
- **行级：[[diffbrush|DiffBrush]]**（Beyond Isolated Words，ICCV 2025）——**最值得关注的一篇**。
  - 显式处理**词间垂直对齐 / 水平间距**等 inter-word 关系（单词级方法造不出真实排版）。
  - **content-decoupled style learning**：用**列/行方向 masking** 把风格与内容解耦，兼顾词内+词间风格。
  - **multi-scale content learning**：**行判别器 + 词判别器**双重保证——全局连贯 + 局部字符准确。
  - → 直接生成整行手写，最贴合真实 OCR/HTR 的**行级训练样本**。

### 维度 C：跨语言 / 多脚本
- **[[stylusai|StylusAI]]**（英↔德）：条件扩散，条件含文本+写手风格 **+ 合成打印体图像**，
  当 **image-to-image** 处理增强风格适配；打印体图像同时是**内容锚点**保跨语言可读。发布 37 种德语风格 DHSD。
  → 造**非英语/多语种**手写数据时参考。
- One-DM 也支持多语言（高频风格抽取不依赖语言）。

## 3. 内容(文字)正确性怎么保证 —— 手写合成的隐藏难点

生成模型容易"写飘"（字形对但不是目标字、或连笔糊成别的字），几种解法：
- **判别器约束**（DiffBrush 的**词判别器**）：局部字符准确性专门判。
- **内容锚点**（StylusAI 的打印体图像、VATr 的字形图像）：给模型一个"应该长这样"的视觉参照。
- **content encoder + 融合条件**（MAE-LDM）：内容与风格分开编码再融合。
- 对 OCR 系统：合成手写数据后**必须用一个可靠 OCR 回读校验**（类似 [[ovis-ocr2]] 的渲染回比对），
  写错的样本丢弃或降权——否则脏标签污染训练。

## 4. 对 OCR 系统造 OCR 数据的行动清单（优先级）

1. **DiffBrush（行级）** — 首选。直接生成整行手写，覆盖单词级方法造不出的排版/间距，最贴 HTR。
2. **MAE-LDM 2412.15853（半监督适配）** — 要把 OCR 迁到**无标注新数据集/新域**时，用它半监督造风格。
3. **DiffusionPen（5-shot）** — 已实证提升 HTR，稳妥选择。
4. **One-DM（one-shot）** — 低门槛快速铺风格/语言多样性。
5. **StylusAI** — 多语种（非英文）手写。
6. **VATr 的 visual-archetype 内容编码** — 造**罕见字/生僻符号**手写时借这招。

**流程建议**（接 [[synthetic-data-for-ocr]] 的框架）：
- 真实手写数据集（IAM/RIMES/CASIA 等）当风格参考 →
- 选 HTG 模型按我想要的 GT 文本生成整行手写图（GT 文本已知=零标注） →
- **前端 DETR 的框**：手写行合成时记录每行/每词的渲染 bbox（DiffBrush 是行级，需自己配词切分或用词判别器对齐）→
- **OCR 回读校验**筛掉写错的 → 混入真实数据训练（合成补覆盖，真实补 realism）。

## 5. 坑
- **假手写字体 ≠ 手写合成**：字体渲染的手写体太规整，泛化差，别偷懒。
- **风格坍缩**：GAN 易模式坍缩，扩散好很多，但仍要 multi-style mixture / noisy embedding 保多样性。
- **内容漂移**：一定要判别器/内容锚点 + OCR 回读双保险。
- **行级 bbox 对齐**：行级生成模型不一定给词级框，前端 DETR 要词框时需额外对齐。

## 关联
- 印刷体/通用合成框架：[[synthetic-data-for-ocr]]
- source-of-truth / 回读校验思想：[[ovis-ocr2]]
- 半监督/自改进造数据：[[points-reader]]、[[mae-ldm-htg]]
- 里程碑：[[vatr]]（扩散前的经典基线）
