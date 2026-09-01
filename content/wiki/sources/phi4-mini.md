---
type: source
title: "Phi-4-Mini / Phi-4-Multimodal Technical Report (Mixture-of-LoRAs)"
authors: [Microsoft]
year: 2025
arxiv: "2503.01743"
sources: [phi4-mini]
tags: [llm, multimodal, small-model, lora, phi, speech, milestone]
created: 2026-07-23
updated: 2026-07-23
reading: deep
---
# Phi-4-Mini / Phi-4-Multimodal（Microsoft, 2025）— 深度精读

📄 **原文**：[arXiv:2503.01743](https://arxiv.org/abs/2503.01743) · [PDF](https://arxiv.org/pdf/2503.01743)

> 里程碑 — 用 **Mixture-of-LoRAs** 在**冻结的语言底座**上叠加视觉/语音模态，
> 小模型 (3.8B) 同时拿下强语言、代码、多模态、语音，且模态互不干扰、可无限扩展。

## 一句话定位
两个模型共享同一语言 backbone：
- **Phi-4-Mini**：3.8B 纯语言模型，高质量 web + 合成数据训练，数学/代码媲美 2× 大小的模型
- **Phi-4-Multimodal**：在**完全冻结**的 Phi-4-Mini 上，用模态特定 LoRA + 编码器/投影器，
  在**单一 checkpoint** 内支持 text / text+image / speech+audio / speech+image 多种推理模式

---

## 一、核心创新：Mixture-of-LoRAs（本篇灵魂）

传统多模态做法的通病：为接入视觉/语音要**微调基础语言模型**，往往**损伤原有语言能力**，
于是被迫为不同模态部署多个模型（资源受限设备尤其吃力）。此前替代方案也各有缺陷：
- Flamingo/LLaMA-Vision 式**加 cross-attention 层** → 视觉基准掉分
- NVLM 混合框架 → 只测了有限语言基准，未覆盖 SFT 后续阶段

**Phi-4 的解法**：base LM **整个冻结**，为每个模态训练独立 LoRA：
- **LoRA_V**（视觉）370M + 视觉 encoder/projector 440M
- **LoRA_A**（语音/音频）460M + audio encoder/projector 460M（rank=320）
- 模态特定 router 让多模态组合推理时**互不干扰**

**收益**：
1. 语言能力零损伤（base 冻结）
2. 效果超过 cross-attention 设计，媲美全量微调
3. **高度可扩展**：新模态 = 加一个新 LoRA，不影响已有模态

这是对 [[data-quality-over-scale|phi 数据哲学]] 之外的**架构层杠杆**。

---

## 二、语言模型架构要点

- decoder-only Transformer（承 [[attention-is-all-you-need]]），**32 层**，hidden 3072
- **词表扩到 200K**（o200k_base），强化多语言
- **Group Query Attention (GQA)**：24 query heads / 8 KV heads → **KV cache 降到 1/3**，长上下文更省
- **128K 上下文**（LongRoPE），fractional RoPE（25% 注意力维度位置无关）
- tied input/output embedding 省显存

## 三、多模态架构细节

- **视觉**：SigLIP-400M encoder（LLM2CLIP 微调，448×448）+ 2 层 MLP projector + LoRA_V；
  **动态 multi-crop** 策略（比 InternVL2 更省，避免小图被拉伸到不合理尺寸），SFT 阶段最多 36 crop
- **语音/音频**：80 维 log-Mel + 3 卷积层 + **24 conformer blocks**（1024 dim），子采样率 8 → 80ms token rate；
  128K 上下文理论支持最长 **2.8 小时音频**

## 四、训练 pipeline（分阶段冻结）

1. 语言训练（预训练 **5T tokens** + 后训练）
2. **冻结 LM** → 视觉训练四阶段（projector 对齐 → 联合视觉 → 生成式 VL → 多帧到 64K）
3. **冻结 LM** → 语音训练两阶段（2M 小时 ASR 预训练对齐 → 100M SFT 解锁指令跟随）
4. vision-speech 联合训练
5. （实验版）推理增强：60B CoT 预训练 → 200K 精选 CoT SFT → 300K 偏好对 **Roll-Out DPO**

## 五、关键结果

- **语言/推理**：3.8B 数学代码媲美 2× 大模型；实验推理版比肩甚至超过 **DeepSeek-R1-Distill-Qwen-7B / Llama-8B**
- **视觉**：MMMU/MathVista/ChartQA/DocVQA/OCRBench 等平均 **71+**，同尺寸 SOTA；ShareGPT4o 上比对手高 10+ 分
- **语音**：**OpenASR 榜第一**（语音 LoRA 仅 460M！），WER 比 HF 最佳模型相对好 5.5%；
  首个开源具备**语音摘要**能力的模型；支持 8 种语言 ASR/AST

## 六、对文档智能/OCR 的启示

- 多模态预训练数据里**大量 PDF/真实图像的 OCR 合成数据** + 图表/表格理解 → OCRBench/DocVQA 强
- **可插拔 LoRA 范式**对文档场景友好：文档理解可作为一个专用 LoRA 挂到强语言 backbone，
  不牺牲通用能力（对照 [[monkeyocr-v2]] 的"文档原生底座"是另一种思路：LoRA 挂载 vs 重训编码器）

## 关联
- phi 血脉承 [[textbooks-are-all-you-need|phi-1]]，[[microsoft-research]] 出品
- 语言骨架 [[attention-is-all-you-need|Transformer]]；视觉对齐思路对照 [[clip]]
- LoRA 挂载 vs [[monkeyocr-v2]] 文档原生编码器，是两种"接文档能力"的路线
