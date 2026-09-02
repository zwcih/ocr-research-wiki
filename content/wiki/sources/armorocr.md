---
type: source
title: ArmorOCR — 困难视觉文本的定位、识别与 Spotting 联合强化
tags:
  [
    ocr,
    scene-text,
    text-spotting,
    localization,
    adversarial-ocr,
    self-distillation,
    grpo,
    benchmark,
    front-detr-relevant,
    back-ar-relevant,
  ]
sources: [armorocr]
created: 2026-09-02
updated: 2026-09-02
---

# ArmorOCR — Grounded Adversarial OCR Perception

📄 **原文**：[arXiv:2608.20122](https://arxiv.org/abs/2608.20122) · [PDF](https://arxiv.org/pdf/2608.20122) · [代码/权重](https://github.com/ant-research/ArmorOCR)

- **arXiv**：2608.20122v1（2026-08-20，cs.CV）
- **团队**：蚂蚁集团 + 上海交通大学 + 华东师范大学
- **底座**：Qwen3-VL-8B-Instruct

## 一句话

把“模型有没有真的看见困难文字”拆成 **text→bbox 定位、bbox→text 识别、bbox-text 全量 spotting、区域化 VQA** 四个可验证任务：先把 resize/拉伸/旋转/翻转/压缩后才显现的文字感知能力蒸馏进原图 student，再用四种 task-conditioned GRPO reward 联合强化，推理时只看原图一次。

## 问题：答对文字，不等于定位到了文字

现有 OCR benchmark 多评转录结果，难以区分模型是：

- 真正定位并读出了目标区域；
- 根据全局上下文或语言先验猜对；
- 看漏/看错区域但碰巧得到正确答案。

而旋转、镜像、小字、低对比、图案覆盖、点线编码等“人能读、模型看不见”的 adversarial OCR pattern，常要在推理时额外 crop、resize、flip 才能恢复。ArmorOCR 的目标是把这些变换揭示的证据**内化到参数中**，避免部署时反复调用视觉工具。

## AdvSpot：区域级困难 OCR 基准

AdvSpot 包含 **390 张图、397 个 grounded VQA 对**，每个目标区域带 bbox、转录、感知类型和区域问题。它按失败机制分成 5 大类、13 个子类：

1. **Spatial Manipulation**：旋转、镜像、小字；
2. **Glyph Variation**：艺术字、手写；
3. **Visual Encoding**：符号、点、线编码；
4. **Contextual Blending**：AIGC 融合、低对比、图案覆盖；
5. **Imaging Degradation**：拍摄与后处理退化。

相比 AdvOCR / SmuggleBench，它新增 bbox 和 region-aware QA，可同时报告答案准确率与定位 IoU。但截至 2026-09-02，代码与评测脚本已开源，**完整 AdvSpot 数据仍标为 Coming Soon**。

## 方法：两阶段训练

### Stage 1：Observation-Transferred Self-Distillation

student 只接收原图 $x$ 与任务 prompt；同底座冻结 teacher 额外看到一个 privileged transformed view $T(x)$。候选变换包括 resize、stretch、rotation、flip、compression，由 Qwen3-VL-235B-A22B-Instruct judge 选择识别最好的视图。

student 先按当前策略生成 on-policy trajectory，teacher 在同一前缀上给 token 分布指导。论文没有对所有 token 等权蒸馏，而是区分：

- **analysis token**：用置信门控 generalized JSD；只有 teacher 比 student 更有把握时才加强指导，避免传播错误分析；
- **answer token**：用 forward KL 强监督，因为它们直接决定 OCR 转录；
- **结构标签 token**：不参与蒸馏。

因此训练目标不是记住变换图，而是让原图 student 吸收“变换后才看见的视觉证据”。

### Stage 2：task-conditioned GRPO

构造四类任务，每类使用可直接计算的 reward：

- **text-to-bbox**：给文字找区域，$R_{t2b}=\operatorname{IoU}(\hat b,b^*)$；
- **bbox-to-text**：给框读文字，$R_{b2t}=1-\operatorname{ED}(\hat t,t^*)/\max(|\hat t|,|t^*|)$；
- **full spotting**：同时输出多组 bbox-text，仅当 IoU≥0.5 且归一化编辑相似度≥0.9 才算匹配，reward 为 pair-level F1；
- **grounded VQA**：区域答案包含匹配。

Stage 1 使用 50K 合成样本，Stage 2 使用 70K 更难样本；每个 prompt 采样 8 条 rollout。四种 reward 的消融均会退化，说明定位、识别和联合 spotting 监督互补。

## 结果

### AdvSpot

| 模型                | Avg. Acc. | Avg. IoU |
| ------------------- | --------: | -------: |
| Qwen3-VL-8B（底座） |      31.2 |     49.1 |
| Qwen3-VL-32B        |      35.3 |     51.9 |
| GPT-5               |      30.0 |     35.0 |
| Gemini-2.5 Flash    |      32.3 |     28.0 |
| **ArmorOCR**        |  **55.7** | **63.3** |

ArmorOCR 相对自己的 8B 底座准确率提高 **24.5 个百分点**。提升在视觉编码和上下文融合型文本上尤其明显，例如 AIGC Fusion Text 2.5→75.0、Line Encoding 6.7→60.0；但 Stylized Glyphs 只有 30.0，Tiny Text 56.7，也说明并未解决所有困难文本。

### 两阶段缺一不可

- 仅 Stage 2：IoU 61.2 / Acc. 39.8；
- 仅 Stage 1：IoU 58.7 / Acc. 48.9；
- 两阶段完整：**63.3 / 55.7**。

Stage 2 对定位提升大，但仅靠 reward 无法充分学会隐藏文字的感知；Stage 1 先获得感知能力，Stage 2 才能把它对齐到 grounding 任务。

### 一般 OCR 基本保持

不加入额外普通 OCR 数据时，ArmorOCR 与底座在 OCRBench、CCOCR、OCRBench-v2 上接近，例如 OCRBench 73.2→72.5、CCOCR 91.2→89.4、OCRBench-v2 63.9→63.2。代价是小幅普通能力回落，并非完全无损。

## 对文本检测前端的启示

- ⭐⭐⭐ **四任务互为 cycle supervision**：text→box 与 box→text 双向约束，再用 full spotting F1 检查成对一致性。对 DETR 前端，可在 Hungarian matching 之外加入“框必须能被识别、文字必须能反查到框”的闭环监督。
- ⭐⭐⭐ **困难检测增强不必只做输入 augmentation。** transformed-view teacher → original-view student 的做法能把旋转、镜像、缩放、压缩揭示的定位信号蒸馏回原图模型；可改造成 DINO teacher/student 的 query/box 蒸馏。
- ⭐⭐ **reward 要同时看位置和内容。** 仅 bbox IoU 会鼓励框准但读错，纯 edit similarity 会允许语言猜测；spotting reward 将 IoU 与转录阈值联合后再算 pair-level F1，更适合训练“检测→识别”系统的最终接口。
- ⭐⭐ AdvSpot 的 13 类 taxonomy 可以直接用作 hard-case 合成课程：先几何/退化，再 glyph/encoding/context blending；比随机 augmentation 更接近真实失败机制。
- ⭐ **边界**：ArmorOCR 是 8B LMM 的 post-training 方法，不是轻量 DETR 检测器；它的绝对增益不能直接外推到纯视觉 detector，且 AdvSpot 规模仅 390 图、完整数据尚未发布。

## 与目标架构如何结合

一个可验证的迁移方案是：

1. 前端 [[dino-detr]] 输出 query、bbox/mask；
2. 后端 AR 对每个 query 生成文本；
3. 训练时同时抽 text→query/bbox、query/bbox→text 和全页 spotting 三类 batch；
4. transformed-view teacher 给原图 detector 蒸馏匹配后的 query/box；
5. 最终 reward/指标用 box IoU × text similarity 的联合匹配，而不是分别报检测和识别。

这与 [[parser-oriented-refinement]] 的 retention/order 联合界面互补：前者决定“哪些 query 存活、以什么顺序交付”，ArmorOCR 思路确保“每个存活 query 的位置与内容确实一致”。

## 关联

- 文本检测基线：[[craft]]；query-based 前端：[[detr]]、[[dino-detr]]、[[rt-doclayout]]。
- 两段式接口：[[parser-oriented-refinement]]、[[hpd-parsing]]。
- 训练方法：[[denoise]]（变换视图恢复信号）、[[loss-functions]]（IoU/编辑距离/匹配）。
