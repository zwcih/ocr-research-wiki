---
type: source
title: "Qwen3 Technical Report"
authors: [Qwen Team, Alibaba]
year: 2025
arxiv: "2505.09388"
sources: [qwen3]
tags: [llm, moe, reasoning, multilingual, qwen, milestone]
created: 2026-07-23
updated: 2026-07-23
reading: deep
---
# Qwen3 Technical Report（阿里, 2025）— 深度精读

📄 **原文**：[arXiv:2505.09388](https://arxiv.org/abs/2505.09388) · [PDF](https://arxiv.org/pdf/2505.09388)

> 里程碑 ⭐ — 把 **thinking / non-thinking 双模式统一进单一模型**，
> 并用 thinking budget 让用户按需分配推理算力；36T tokens、119 语言、全系 Apache 2.0 开源。

## 一句话定位
Qwen 系列最新代，dense + MoE 全谱系（**0.6B–235B**），旗舰 **Qwen3-235B-A22B**（MoE，
总 235B / 激活 22B）。核心是把"聊天优化模型"和"专用推理模型"合二为一。

## 核心创新
1. **thinking / non-thinking 双模统一**
   - 复杂多步推理走 thinking mode，快速响应走 non-thinking mode，**同一模型内动态切换**
   - 不再需要在 GPT-4o 式 chat 模型 与 QwQ 式 reasoning 模型间切换
2. **Thinking Budget（思考预算）**
   - 用户可细粒度控制模型花多少推理算力 → 按任务复杂度平衡延迟与性能
3. **Strong-to-Weak 蒸馏建小模型**
   - 用旗舰模型知识蒸馏出小模型，**蒸馏在性能与训练效率上都显著优于直接 RL**
   - 大幅降低小模型的构建算力
4. **119 语言**（Qwen2.5 是 29 → 119），36T tokens 预训练

## 架构要点
- 6 个 dense（0.6/1.7/4/8/14/32B）+ 2 个 MoE（30B-A3B / 235B-A22B）
- dense 沿用 [[attention-is-all-you-need|Transformer]] + **GQA** + SwiGLU + RoPE
- 相比 Qwen2 **去掉 QKV-bias，引入 QK-Norm**（提升训练稳定性）

## 训练
- **预训练三阶段**：30T 通用知识 → 知识密集(STEM/代码)增强推理 → 长上下文扩到 32K
- 数据扩充有意思：**用 Qwen2.5-VL 从海量 PDF 抽文本**（与文档智能相关！），
  Qwen2.5-Math / Qwen2.5-Coder 生成领域合成数据
- **后训练多阶段**：长 CoT 冷启动 → 数学/代码 RL → thinking+non-thinking 数据统一微调 → 通用 RL

## 关键结果
- Qwen3-235B-A22B 在 AIME'24 达 **85.7**，多项代码/数学/agent 基准 SOTA
- 与更大 MoE 及闭源模型竞争，全系 Apache 2.0

## 关联
- 承 Qwen2.5；下一代全模态版见 [[qwen3.5-omni]]
- 数据管线用 Qwen2.5-VL 抽 PDF → 呼应文档智能主线
- 双模统一/thinking budget 是当前 reasoning-model 融合趋势的代表
