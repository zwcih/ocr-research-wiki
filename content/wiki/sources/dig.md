---
type: source
title: "DiG: Reading and Writing — Discriminative and Generative Modeling for Self-Supervised Text Recognition"
authors: [Yang, Liao, Lu, Wang, Zhu, Luo, Tian]
year: 2022
arxiv: "2207.00193"
sources: [dig]
tags: [ocr, text-recognition, self-supervised, mim, contrastive-learning, milestone]
created: 2026-07-29
updated: 2026-07-29
---

# DiG (2022) — ⭐ 对比学习 + MIM 双分支的文本识别自监督（跟此类 OCR 架构几乎一致）

📄 [arXiv:2207.00193](https://arxiv.org/abs/2207.00193)（ACM MM 2022） · Huawei + HUST（Minghui Liao / Mingkun Yang）
> ⭐⭐ **这篇是研究者 MIM+denoising+SeqCLR encoder pretrain 最直接的参考**：它就是把 contrastive（SeqCLR 式）+ MIM 结合在一个 ViT encoder 上做文本识别自监督。

## 一句话（"读与写"）
人类学认字靠**读**（判别）+**写**（生成）。DiG 对应地把两种自监督信号合到一个共享 ViT encoder：
- **contrastive learning 分支** = "读" = 判别（学区分不同文本图，SeqCLR/[[contrastive-learning]] 血统）
- **masked image modeling 分支** = "写" = 生成（**首次把 MIM 用于文本识别**，学上下文生成）

## 方法细节
- **输入两视图**：masked view Xₘ + augmented view Xₐ，都喂进同一个 **ViT encoder F(·)**，得 fₘ、fₐ。
- **对比分支**：fₘ、fₐ 过 patch head P(·)，用 SeqCLR 式序列级对比（还借了 [[instance-mapping]] 思路把 feature 切成 instance；见 [[seqclr]]）。数据增广沿用 SeqCLR + 额外 color jitter/gray。online/target 双分支（BYOL/MoCo 式）。
- **MIM 分支**：**patch-aligned 随机掩码，patch size 4×4，掩码率 0.6**，重建被遮区域（SimMIM 式像素级，见 [[simmim]]）。
- 两个 loss 联合训练，共享 encoder。

## 结果
- 在**不规则场景文字**数据集上，比之前自监督文本识别方法（SeqCLR/PerSec）高 **10.2%–20.2%**。
- 用它预训练的识别器在 11 个基准上平均超之前 SOTA **5.3%**（同等模型规模）。
- 预训练模型迁到其它文本相关任务也涨点明显。

## 对 OCR 系统 recognizer encoder pretrain 的直接借鉴
- **架构级模板**：DiG 已经验证"共享 ViT encoder + 对比分支（SeqCLR）+ MIM 分支"在文本识别上有效、可叠加。进一步加入 denoising 信号 = 在 MIM 之外再引入去噪目标（[[dae]] 血统），本质是把 corruption 类型扩得更丰富。
- **超参可抄**：patch 4×4、掩码率 0.6、序列保持增广 + color jitter/gray。
- **双分支平衡**：对比学"判别/边界"，MIM/denoising 学"上下文/生成"，两者互补——这正是你三信号组合的理论依据。
- **注意**：DiG 是场景文字为主；若做文档/手写，增广和掩码策略要按 domain 调。

## 谱系
上游：[[seqclr]]（序列对比）+ [[simmim]]/[[beit]]/[[mae]]（MIM）+ [[dae]]（去噪）。是 [[label-efficient-ocr]] 里"自监督对比"路径与"MIM"路径的合流点。
