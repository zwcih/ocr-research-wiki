---
type: source
title: "Qwen3.5-Omni Technical Report"
authors: [Qwen Team, Alibaba]
year: 2026
arxiv: "2604.15804"
sources: [qwen3.5-omni]
tags: [llm, omnimodal, moe, speech, agent, qwen, milestone]
created: 2026-07-23
updated: 2026-07-23
reading: deep
---
# Qwen3.5-Omni Technical Report（阿里, 2026）— 深度精读

📄 **原文**：[arXiv:2604.15804](https://arxiv.org/abs/2604.15804) · [PDF](https://arxiv.org/pdf/2604.15804)

> 里程碑 ⭐ — 原生全模态 (omnimodal) LLM + **native omni agent**：
> 文本/图像/音频/音视频统一理解与生成，还能自主调工具、出语音、实时流式交互。

## 一句话定位
Qwen-Omni 家族最新代，规模达数千亿参数、**256K 上下文**。在 100M+ 小时音视频等异构数据上
**原生全模态预训练**。Qwen3.5-Omni-Plus 在 **215 个音频/音视频子任务上 SOTA**，
关键音频任务超越 Gemini-3.1 Pro，综合音视频理解与之持平。

## 核心创新
1. **Hybrid Attention MoE 框架**（Thinker + Talker 双组件都用）
   - 支持高效长序列推理：**10+ 小时音频理解**、**400 秒 720P 视频**(1 FPS)
2. **ARIA (Adaptive Rate Interleave Alignment)**
   - 解决流式语音合成的不稳/不自然（文本与语音 tokenizer 编码效率不匹配所致）
   - **动态对齐文本与语音单元**，显著提升对话语音的稳定性与韵律，延迟影响极小
3. **Native Omni Agent**
   - 不只感知推理，还能**行动**：自主 WebSearch、复杂 FunctionCall、生成语音、实时流式交互
4. **零样本音色定制**（用户样本即可）+ 10 语言带情感的语音生成
5. **音视频 grounding**：脚本级结构化字幕 + 精确时间同步 + 自动场景分割
6. **涌现新能力 — Audio-Visual Vibe Coding**：直接根据音视频指令写代码

## 相比前代的演进
- 从 Qwen3.5-Omni 前代 → 参数规模、上下文(256K)、音视频时长大幅提升
- Thinker-Talker 架构 + MoE 化 → 兼顾理解与实时语音生成

## 关联
- 语言底座血脉承 [[qwen3]]（同 Qwen 家族，MoE + Thinker）
- 全模态融合对照 [[phi4-mini|Phi-4-Multimodal]]（Mixture-of-LoRAs 冻结底座 vs 原生全模态预训练，两条路线）
- 视觉理解与文档/OCR 相关能力可延伸到文档智能主线
