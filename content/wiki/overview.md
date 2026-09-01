---
type: overview
title: Overview — 全局概要
updated: 2026-07-28
---

# Overview — 全局概要

聚焦 **OCR / 文档智能 / AI**，持续增量维护。

## 当前状态

已摄入 **64 篇** source（其中 60 篇 reading:deep 深度精读；3 篇地基论文
Transformer/ResNet/phi-1 为标准精读），覆盖从深度学习
起点到最新端到端 OCR 的完整技术谱系，包括 OmniDocBench leaderboard 上 15 篇
specialist 文档解析模型。

**解码加速专线（后端 AR 关键）**：随文档解析吞吐需求上升，出现一批压解码成本的工作——[[deepseek-ocr]]（压视觉 context）/[[unlimited-ocr]]（R-SWA 压 KV）走「减 per-step 计算」；[[glm-ocr]]（MTP）/[[youtu-parsing]]（query+token 并行）/[[hpd-parsing]]（层次并行解码：layout 主分支 fork 多 content 分支并发 + P-MTP，OmniDocBench v1.6 SOTA 94.91/4752 TPS）走「减串行步数」；另有**免训练**的 [[hsd]]（pipeline draft 两阶段投机验证，HunyuanOCR 近无损 2.78×/长文档 7.04×）与 HPD 形成 tradeoff。**HPD-Parsing 对检测—识别组合系统具有较高参考价值**：前端 [[detr]] 系 query 出的区块框天然就是它的「layout 分支输出」，可直接当 `<FORK>` 触发后端 AR 并发解码。另一条**视觉 token 压缩**线（[[visual-token-compression]]）与减串行步正交：[[layoutlite]] 用小模块 Conv1D 判 token 信息量 + GRPO 免标注剪枝，50% 压缩几乎不掉分、prefill/FLOPs/KV 降40%+，且“删某区token只影响该区输出”直接坐实两段式假设。

## 技术主线（一条脉络）

**架构地基** → [[attention-is-all-you-need|Transformer]] + [[resnet-deep-residual-learning|ResNet]]（残差）
是一切的骨架。

**视觉演进** → [[alexnet]]→[[vgg]]→[[googlenet]]→[[resnet-deep-residual-learning|ResNet]]（CNN 时代）
→ [[vit]]→[[clip]]→[[mae]]（Transformer/多模态时代）；检测分割线 [[faster-rcnn]]/[[yolo]]/[[mask-rcnn]]/[[unet]]；
**DETR 检测线** [[detr]]→[[deformable-detr]]→[[dino-detr]]（query-based，去 anchor/NMS），文档落地为 [[rt-doclayout]]（RT-DETR 单query出框/mask/阅读顺序）+ [[parser-oriented-refinement]]（稳定检测→解析器界面，NMS-free）；生成线 [[ddpm]]。

**语言演进** → [[word2vec]]→[[seq2seq]]→[[bert]]/[[gpt3]]/[[t5]] → 对齐 [[instructgpt]]
→ 开源与规模律 [[llama]]/[[chinchilla]] → 数据中心 [[textbooks-are-all-you-need|phi]]。

**OCR/文档智能（主战场）** → 传统两阶段 [[craft]]+[[crnn]]([[ctc]])
→ 端到端 [[trocr]] → OCR-free [[donut]]/[[nougat]]/[[pix2struct]]
→ 多模态预训练 [[layoutlmv3]]/[[dit]]
→ 新一代统一端到端 [[got-ocr2]]/[[deepseek-ocr]]；商业平台 [[lai-ade-gen2|LandingAI ADE Gen2]]（含 [[lai-signatures-stamps-seals|attestation检测]]）；评测前沿 [[gdp-pdf-benchmark|GDP.pdf]]（最好模型仅30.7%）+ [[ocr-vs-mllm-benchmark|OCR vs 多模态LLM 系统评测]]（16系统横评，首把延迟/成本设为一等维度，评价指标引入阅读序无关的 [[fca|FCA]]）；多语言维度 [[more-benchmark|MORE]]（149语种，decoupled→layout-dependent 暴跌~16分，坐实版面/阅读序才是端到端瓶颈）。
新锐端到端 [[ovis-ocr2]]（0.8B，OmniDocBench 96.58 SOTA）、
[[monkeyocr-v2]]（视觉重建 + 文档原生底座，与 [[deepseek-ocr]] 光学压缩形成**路线张力**）；
多模态小模型 [[phi4-mini]]（Mixture-of-LoRAs）。

## 关键玩家
- [[microsoft-research]]（TrOCR/LayoutLM/DiT/phi）、Google（ViT/T5/Pix2Struct）、
  OpenAI（CLIP/GPT/InstructGPT）、Meta（LLaMA/Nougat/MAE）、[[deepseek]]、Naver Clova（CRAFT/Donut）

## 演进中的判断
现代 OCR/文档智能 = **Transformer 骨架 + 强视觉编码器 + 高质量领域数据**，
且正从"检测+识别两阶段"快速收敛到"单一端到端模型直出结构化结果"，
效率竞争（如光学压缩、长上下文）成为新前沿。

## 下一步可做
- 建 comparisons 页（端到端 OCR 方案横评、OmniDocBench 榜单）
- 补充 benchmark、更多国产 OCR 模型
- 深挖某篇（读全文细化对应 source 页）

## 已提炼的综合页
- [[ocr-evolution]] — 端到端 OCR 演进史
- [[visual-compression-vs-reconstruction]] — 视觉压缩 vs 视觉重建之争
- [[e2e-ocr-comparison]] — 端到端 OCR 模型横评
