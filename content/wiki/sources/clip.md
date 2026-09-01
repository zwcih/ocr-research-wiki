---
type: source
title: "Learning Transferable Visual Models From NL Supervision (CLIP)"
authors: [Radford, et al. (OpenAI)]
year: 2021
arxiv: "2103.00020"
sources: [clip]
tags: [multimodal, cv, nlp, milestone]
created: 2026-07-23
updated: 2026-08-06
reading: deep
---
# CLIP (2021) — 深度精读

📄 **原文**：[arXiv:2103.00020](https://arxiv.org/abs/2103.00020) · [PDF](https://arxiv.org/pdf/2103.00020)

## 一句话定位

CLIP（Contrastive Language–Image Pre-training）用 4 亿对互联网「图像–文本」在共享嵌入空间做对比预训练，把**自然语言当作监督信号**，从而获得可**零样本迁移**到任意视觉分类任务的图文对齐表征。它是现代多模态大模型（含 document VLM）视觉–语言对齐的奠基工作。

## 核心贡献

1. **自然语言监督的规模化**：放弃固定标签集，用图文对的弱监督，把「监督」从 1000 类扩展到开放词表。
2. **对比目标替代生成/预测目标**：不预测每张图的确切 caption（太难、太慢），只需判别「哪段文本配哪张图」，训练效率提升约 4 倍。
3. **零样本迁移范式**：推理时把类别名嵌入模板变成文本原型，图像分类退化为图文余弦相似度检索，无需任何下游标注。
4. **鲁棒性突破**：在自然分布偏移下（ImageNet-R/A/Sketch 等）远超同精度的 ImageNet 监督模型。

## 关键机制：对称对比预训练的数学细节

设一个 batch 有 N 对 (I_i, T_i)。两个塔并行编码：

- **Image encoder**（ResNet 或 [[vit]]）→ f_i^img
- **Text encoder**（Transformer，架构承自 [[attention-is-all-you-need]]，取 `[EOS]` 位表征）→ f_i^txt

各自经线性投影到同一 d 维共享空间，再做 **L2 归一化**得单位向量 u_i, v_i（归一化使内积等于余弦相似度）。

构造 N×N 相似度矩阵，含**可学习温度** τ：

logits_{ij} = (u_i · v_j) / τ

对角线 (i,i) 为正样本，其余 N²−N 个为负样本。损失是**双向对称交叉熵**（即对称 InfoNCE，见 [[contrastive-learning]] 与 [[loss-functions]]）：

L = ½( CE_{img→txt} + CE_{txt→img} )

即分别按行、按列做 softmax 交叉熵，标签为对角索引。二者平均保证图检文与文检图对称。

**温度 τ 的作用**：τ 缩放 logits 尖锐度。τ 小 → 分布更尖，强化 hard negative 的梯度，但过小易数值不稳/过拟合噪声；τ 大 → 分布平缓，梯度弱。CLIP 让 τ 作为参数学习（实现上优化 log(1/τ) 并 clip 上限，防训练早期塌缩），省去手调。

## 为什么自然语言监督能零样本迁移

固定标签把每个类压成无语义的 one-hot；自然语言把类别嵌入连续语义空间，"dog" 与 "puppy" 天然靠近。预训练学到的是**通用图文对齐几何**而非某个封闭任务的判别边界。因此下游只要能用文字描述类别，就能落进同一空间做检索——迁移不靠再训练，靠语言的组合泛化。

## 零样本推理怎么做

1. 取下游类别名 {c_k}，套模板（如 `"a photo of a {c}."`）生成文本，经 text encoder + 投影 + L2 归一化，得每类**文本原型** v_k。
2. 测试图像编码 → u。
3. 预测 k̂ = argmax_k (u · v_k)（最大余弦）。

文本原型即「用语言现造的分类器权重」，权重维度 = 类数，可任意增删类别。

### Prompt engineering 与 prompt ensembling

- **Prompt engineering**：裸类名有歧义/分布不匹配（训练文本多为完整句）。加模板消歧，如 Oxford Pets 用 `"a photo of a {c}, a type of pet."`；OCR/纹理类可换 `"the number {c}."` 等领域模板。
- **Prompt ensembling**：对同一类用多条模板（论文 ImageNet 用 80 条）分别编码，**在归一化后的嵌入空间取平均**得更稳原型，再归一化。两招合计带来约 +3.5% ImageNet 提升，几乎零成本。

## 数据：WIT 4 亿对与规模的重要性

CLIP 自建 **WIT（WebImageText）**：从互联网收集 **4 亿**图文对，以约 50 万 query 平衡覆盖。规模是能力来源——零样本迁移能力随算力/数据近似平滑提升，最大模型训了数千 GPU-天。对比目标 + 大 batch（负样本多）+ 海量弱监督数据，三者缺一不可。

## Linear probe 表现与鲁棒性

- **Linear probe**：冻结 CLIP 特征、只训线性分类器，在 20+ 数据集上普遍胜过同规模自监督/监督特征，说明表征本身线性可分性强。
- **鲁棒性**：一个在标准 ImageNet 匹配 ResNet-50 精度的零样本 CLIP，在 ImageNet-Sketch/A/R 等分布偏移集上**准确率下降幅度显著更小**。原因：它没有过拟合 ImageNet 的伪相关，而是学到了跨域的语义对齐。

## 局限

- **细粒度/计数/抽象弱**：区分车型、数物体个数、判断距离等系统性偏弱。
- **对 prompt 敏感**：措辞、模板显著影响零样本精度。
- **OOD 极端仍失效**：如 MNIST 手写数字零样本仅约 88%。
- **数据偏见**：继承互联网文本的社会偏见，需下游审计。
- 训练算力与数据门槛极高。

## 为什么是里程碑

CLIP 确立了「**对比图文对齐 + 语言即分类器**」范式，是从封闭标签视觉迈向开放词表、可提示视觉的转折点。它把 NLP 的零样本/提示思想成功移植到视觉，直接催生了 DALL·E 2、Stable Diffusion（用 CLIP 文本条件）、GroundingDINO、SAM 提示化、以及几乎所有多模态 LLM 的视觉塔。

## 对 OCR / 文档 VLM 的意义

- **对齐是多模态 document LLM 的基石**：现代 document LLM 普遍以 CLIP 式对齐好的视觉编码器（多为 [[vit]]）接入语言模型。CLIP 提供了「让像素与文字可比」的通用几何。
- **弱监督启示**：文档领域天然存在海量「图像–文本」弱配对（扫描页 ↔ OCR 文本、图表 ↔ 标题），CLIP 式对比预训练是低标注成本获取文档表征的可行路径。
- **零样本文档理解**：用 prompt 原型可对版式/票据类型/印章等做零样本分类，减少定制标注。
- 局限也提示：CLIP 对**密集文字与计数弱**，纯 CLIP 编码器不足以读文档，需与更强 patch/高分辨率视觉编码及生成式解码结合，这正是 [[phi4-mini]]、[[qwen3.5-omni]] 等 document/omni 模型的演进方向。

## 关联

- 视觉编码器：[[vit]]；文本塔源流：[[attention-is-all-you-need]]
- 目标函数：[[contrastive-learning]]、[[loss-functions]]
- 对照的自监督范式：[[mae]]（生成式掩码重建 vs. 判别式对比）
- 下游多模态模型：[[phi4-mini]]、[[qwen3.5-omni]]
