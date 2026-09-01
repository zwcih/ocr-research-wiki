---
type: source
title: OCR 系统 vs 多模态 LLM 的系统性评测（Caravani et al., 2027）
sources: [ocr-vs-mllm-benchmark]
tags: [ocr, benchmark, mllm, evaluation, latency, cost, fine-tuning, fca]
created: 2026-07-28
updated: 2026-07-28
---

# Assessing and comparing document OCR systems in the era of Large Language Models

📄 **原文**：[DOI:10.1016/j.ipm.2026.105047](https://doi.org/10.1016/j.ipm.2026.105047)

- 出处：*Information Processing and Management* 64 (2027) 105047，Elsevier，CC BY 开放获取
- 作者：Valerio Caravani, Riccardo De Cesaris, Paolo Merialdo（Roma Tre University + myBiros.com，工业博士）
- DOI: 10.1016/j.ipm.2026.105047
## 一句话

第一个把**传统 OCR 引擎、商业云 OCR、商业多模态 LLM、开源多模态 LLM 四类共 16 个系统**放在同一框架下横评的工作，且把**延迟(latency) 和 金钱成本(cost) 提升为一等评测维度**，不只看精度。结论：**没有单一范式全面胜出**——结构化/印刷版面靠专用 OCR 更稳，非结构化/手写靠多模态 LLM 更强。

## 与已有 benchmark 的区别

- [[omnidocbench]]：只评文档解析（PDF→结构化），不评原始文本转写，不含运营维度
- OCRBench V2：只评多模态 LLM 的视觉文本理解任务，不含传统/商业 OCR 引擎，无延迟/成本
- 本文缺口填补：**同时**覆盖传统引擎+商业云+多模态 LLM，**同时**评精度+延迟+成本，面向真实转写场景

## 评测的 16 个系统（四类）

**开源 OCR 引擎**（Table 1）
- Tesseract 5.0：隐式版面分析检测 + LSTM-CTC 识别（仅 CPU）
- DocTR 0.8.1：DBNet(ResNet-50) 检测 + CRNN(VGG16-BN) 识别
- PaddleOCR 2.3：PP-OCRv3，MobileNetV3 检测 + SVTR-LCNet 识别

**商业云 OCR**（Table 2）
- Azure AI Vision v4.0 / Azure Document Intelligence
- GCP Cloud Vision OCR / Document AI OCR
- AWS Textract

**开源多模态 LLM**（Table 3）
- Gemma 3 4B（SigLIP，Pan&Scan 分块 896×896）——纯文本输出
- Qwen2.5-VL 3B（ViT-L，CLIP 式）——文本+bbox
- PaddleOCR-VL 0.9B（NaViT + ERNIE-4.5-0.3B）——JSON/Markdown
- [[deepseek-ocr|DeepSeek-OCR]] 3.3B（DeepEncoder SAM/CLIP + DeepSeek3B-MoE-A570M）——JSON/Markdown

**商业多模态 LLM**（Table 4）
- GPT-4o (2024-08-06)、Gemini 2.0 Flash、Claude Haiku 4.5、Mistral Document AI
- 均测了有/无 Chain-of-Thought (CoT) 两种 prompt

## 数据集（4 个，覆盖真实场景，Table 5）

| 数据集 | 类型 | 特点 |
|---|---|---|
| SROIE | 印刷小票 | ICDAR2019，1000 张，低质量印刷、非标版面、扫描噪声 |
| IAM | 手写文本(HTR) | 1539 页 / 657 书写者，裁出手写区 |
| FUNSD | 噪声扫描表单 | RVL-CDIP 抽 199 张，低分辨率+噪声+多样版面 |
| FOX | 稠密多栏文档 | 112 英 + 100 中，单栏/双栏/混栏，>1000 词/页，按阅读序序列化 |

单页级评测；FOX 无 bbox 标注，故无法做传统 OCR 的监督微调。

## 评测指标（5.4）

- **CA（Character Accuracy）= 1 − CER**，**WA（Word Accuracy）= 1 − WER**
- **FCA（Flexible Character Accuracy）**：见 [[fca]]，edit-distance 型，**对阅读顺序不变**，解耦字符识别精度与版面分析/序列化误差；对复杂版面尤其重要。LLM 纯文本输出按 `\n` 切行单元
- **NED（Normalized Edit Distance）**：放宽 reference-length 归一的字符级补充度量
- 中文只报字符级（CA/FCA/NED），因中文无空格分词
- 另加 **延迟**（含 API 网络时延）和 **金钱成本**（LLM 按 token 计价；开源按基础设施折算）

## 关键结果（按场景）

**SROIE（印刷小票，结构化）**：商业云 OCR 领先，Amazon Textract 与 Azure Vision 峰值最高、置信区间窄。开源里 DocTR 最强、逼近商业。**PaddleOCR 微调(FT)后字符级涨 ~4**。商业 LLM 抱团（Mistral Document AI 最强）。Gemini 2.0 Flash 的 FCA-CA gap 大(~5)=阅读序问题。Claude Haiku 4.5 无 CoT 反常：CA 82.73 但 WA 92.36。开源 LLM 里 Qwen2.5-VL-3B 意外强(CA 94.43/FCA 96.38)；**DeepSeek-OCR FCA-CA gap 高达 ~16.2**（很多错来自阅读序/生成 artefact 而非字符误识）。

**IAM（手写，非结构化）**：趋势反转，**多模态 LLM 明显碾压专用 OCR 引擎**。Mistral Document AI 最佳(CA 97.29/WA 96.97/FCA 97.46)，Gemini 2.0 Flash-CoT 紧随。开源 LLM 里 **Qwen2.5-VL-3B 最强(CA 96.94/FCA 97.07)**，且 CoT 无增益。开源 OCR 引擎不微调时惨败（CA 45.58~70.03）。⚠️ 作者提醒：公开手写基准上的 LLM 优势幅度需谨慎看待，可能有训练集暴露(training-set exposure)。

**FUNSD / FOX**：DeepSeek-OCR 与 Gemma 3 的 FCA-CA 背离最明显，说明相当比例误差来自阅读序不一致 + 生成 artefact，而非字符误识。

## CoT 影响

对 Claude Haiku 4.5 和 Gemini 2.0 Flash 为正；GPT-4o 边际/微弱；Qwen2.5-VL-3B 在手写上无增益。

## 结论

1. **商业 OCR 引擎仍是生产级最成熟可靠**：精度/可扩展/成本平衡最好
2. **开源引擎轻量微调(如 PaddleOCR-FT)是有效策略**：低复杂度低成本拿到专用场景竞争力
3. **多模态 LLM 在非结构化/手写上强**，是传统 OCR 的**互补组件**，但算力足迹与推理延迟仍限制实时落地
4. 选型看文档类型/吞吐/延迟/成本：结构化大规模→OCR 流水线；异构/非结构化→多模态 LLM

## 对 OCR 系统设计的启示

- **阅读顺序是硬骨头**：多个 LLM(含 DeepSeek-OCR) 的 FCA-CA 大 gap 证明生成式解码的阅读序/serialization 误差是主要失分点，不是字符识别本身。→ 目标系统的**后端 AR 解码要专门处理版面阅读序**（显式 layout grounding / 结构化 token），这正是 query-based 检测(前端 DETR)能提供的锚点优势
- **评测要用 FCA + NED**：光看 CA/CER 会低估或误判，FCA 对阅读序不变，适合评此类复杂版面输出。见 [[fca]]
- **hybrid OCR-grounded 架构**是作者点名的未来方向：确定性 OCR 引擎给出显式转写作为 grounding context 喂给多模态 LLM——**这几乎就是"前端确定性检测/识别 + 后端 AR 生成"的思路背书**，尤其在法律/医疗/金融等对 factual correctness 苛刻、不容生成 artefact 的高风险场景
- **微调价值**：PaddleOCR-FT 证明小规模领域自适应性价比高，目标系统的模型也该保留低成本微调路径
- **生成 artefact 是 LLM-OCR 的原罪**：非确定性输出 + 幻觉在高风险场景不可接受，确定性前端是护城河

## 未来方向（作者列）

多页/跨页处理、非拉丁/RTL 语种(阿拉伯语)、分辨率鲁棒性(低 DPI/倾斜/噪声)、prompt 策略系统性探索、语义指标(entity-level F1)、下游任务传播分析、**多模态 LLM 组件级分析(vision encoder vs text decoder 各自贡献)**、能耗/碳足迹、**hybrid OCR-grounded 架构**、量化分离视觉识别贡献 vs 语言先验贡献。
