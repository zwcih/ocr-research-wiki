---
type: source
title: HSD — 免训练层次投机解码加速文档解析
sources: [hsd]
tags: [ocr, document-parsing, decoding, speculative-decoding, parallel-decoding, training-free, kv-cache, back-ar-relevant]
created: 2026-07-25
updated: 2026-07-25
---

# HSD — Hierarchical Speculative Decoding（免训练加速）

📄 **原文**：[arXiv:2602.12957](https://arxiv.org/abs/2602.12957) · [PDF](https://arxiv.org/pdf/2602.12957)

- **arXiv**: 2602.12957v3（v3 2026-06-29，cs.CV）· 代码 github.com/whlscut/HSD
- **团队**: 华南理工 SCUT + 上海AI Lab + 中科院深圳先进院 + 南京大学（作者 Wenhui Liao 等，Lianwen Jin/Yu Qiao 组）
## 一句话
**免训练、即插即用**地加速端到端 VLM 文档解析：用轻量 pipeline drafter 先切区块 + 出粗草稿，做**两阶段投机验证**——Stage 1 区块级**并行验证**(要效率)，Stage 2 全页验证(补回全局一致性)。HunyuanOCR 上 OmniDocBench v1.5 **近无损 2.78×**，长文档最高 **7.04×**。

## 问题
端到端 VLM parser 精度高、全局一致，但**延迟 ∝ 输出长度**（全页 AR）。Hybrid 方法把页切区块独立并行解码（快），但**区块独立 → 丢跨区块 context → 阅读顺序/多列/跨栏一致性受损**，且传播 layout 错误。目标：**既要区块并行的快，又要全页一致**，且不改架构、不重训。

## 方法（HSD = 两阶段投机验证 + DSV）
- **Drafter**：轻量 pipeline 模型（layout 检测切语义区块：段落/表/公式/图）一次前向出**区块划分 + 每区块粗预测**，直接当 speculative draft。
- **Stage 1 区块级并行验证**：端到端 parser 并行验证各区块草稿（无全页 context，可能有区块间不一致/继承 pipeline 错误）。
- **Stage 2 全页级验证**：以 Stage 1 精修输出为条件做全页验证，恢复跨区块一致性；因输入已精修，**只需中等步数**即可对齐。
- **DSV（Decoupled Speculative Verification）** 进一步提速：
  - 与传统投机解码（反复刷新 draft token 保前缀同步）不同，**直接复用 pipeline 一次前向的区块预测当 draft** → 大幅省 draft 生成成本。
  - 解耦引入 **prefix–draft 错位**（预生成 draft 与 VLM 当前生成前缀不对齐）→ 用 **draft–target matching** 解决对齐（verifier 接受第一个 mismatch 前的最长匹配前缀）。
  - **prefix-tree batching**：对多个候选匹配段高效并行验证。

## 结果（HunyuanOCR，near-lossless）
- OmniDocBench v1.5 **2.78×**、olmOCR-Bench **2.46×**、（第三基准）**3.29×**。
- 长文档解析最高 **7.04×**。
- 跨模型/文档类型/语言均近无损（accuracy 基本不掉）。

## 对 AR 解码的启示
- ⭐⭐⭐ **免训练、即插即用**：AR OCR 解码 不想重训就想提速时，这是最低成本方案。与需要训练但精度可控的 [[hpd-parsing]] 形成 tradeoff 对照（同思路：都利用 layout 结构把全页 AR 拆区块并行）。
- ⭐⭐⭐ **两阶段验证保全局一致**：解决「区块独立并行丢阅读顺序」的痛点——先区块并行、再全页轻量验证补一致性，可接入已有版面检测得到的区块。
- ⭐⭐ **DSV 复用 pipeline 一次前向预测当 draft**（不反复刷新）+ draft–target 最长前缀匹配 + prefix-tree batching：是把「已有 pipeline 检测/识别结果」当投机草稿的工程范式，前端 DETR/pipeline 的输出可直接复用当 draft。
- 与 [[speculative-decoding]] / [[progressive-multi-token-prediction]] 同族：HSD 走**免训练、区块级**投机，P-MTP 走**训练内、token 级**多预测，可叠。

## 关联
- 同思路对照 [[hpd-parsing]]（要训练，layout fork 并发 + P-MTP，SOTA 精度）；HSD（免训练，pipeline draft + 两阶段验证，近无损加速）。
- 概念 [[speculative-decoding]]。
