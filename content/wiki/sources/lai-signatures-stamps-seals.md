---
type: source
title: "Detecting Signatures, Stamps and Seals (ADE Attestation Detection)"
authors: [LandingAI]
year: 2026
venue: LandingAI Blog
url: "https://landing.ai/blog/detecting-signatures-stamps-seals"
sources: [lai-signatures-stamps-seals]
tags: [document-ai, landingai, attestation, ocr]
created: 2026-07-23
updated: 2026-07-23
reading: deep
---
# Detecting Signatures, Stamps and Seals — ADE Attestation Detection (2026)
> ADE 在解析阶段自动检测"让文档生效"的签名/印章/钢印，把它变成可查询字段。

## 一句话定位
传统 OCR 把签名、印章当噪声丢弃。ADE 的 **attestation detection** 在 parse 阶段检测这些
"认证标记"，赋类型、转写其中文字、记录页面位置，让"这份文档签了吗/盖了吗"成为结构化字段。

## 核心机制
- **attestation** 定义："认证、印章或签名区域"
- 四种固定类型标签（可叠加）：
  - `[SIGNED]` 手写/湿签
  - `[E-SIGNED]` 电子签名
  - `[STAMPED]` 印章
  - `[SEALED]` 官方钢印
  - 叠加示例：既盖章又签名 → `[STAMPED][SIGNED]`
- 输出两种形式：
  - **markdown 字段**：`[TYPE]` 标签 + 转写文字
  - **structure 字段 (JSON)**：`type:"attestation"` 块节点 + bounding box + 行级 grounding
- 区域内的内容描述（如 `[HANDWRITTEN_SIGNATURE]`）是**每文档生成的、可变**，只有 `[ILLEGIBLE_SIGNATURE]`/`[ILLEGIBLE_TEXT]` 是硬编码
- **需要 DPT-3 Pro** 模型（DPT-3 Fast 只解析文本/表格，不检测 attestation）

## 适用场景（靠标记定生死的文档）
贸易/海关（原产地证 GSP Form A、提单）、政府备案（营业执照、州务卿印章）、
公证文书、合同法律、金融银行、证书文凭、质检合规文件等。

## 为什么值得记
- 揭示纯文本 OCR 的**结构性盲区**：官方性/权威性标记
- 是 [[lai-ade-gen2|ADE Gen2]] 平台的一个具体能力

## 关联
- [[lai-ade-gen2]] 平台能力之一；对照 [[layoutlmv3]] 的版面/实体理解
