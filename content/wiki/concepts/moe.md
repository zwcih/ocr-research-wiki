---
type: concept
title: Mixture-of-Experts（MoE，专家混合）
sources: [qwen3, qwen3.5-omni]
tags: [architecture, llm, efficiency]
created: 2026-07-23
updated: 2026-08-04
---
# Mixture-of-Experts（MoE，专家混合）

## 定义
MoE 把网络里的某些层（通常是 Transformer 的 FFN）替换成一组并列的「专家」子网络 + 一个「路由器（gating network）」。对每个输入 token，路由器只挑选少数几个专家（如 top-2）来处理，其余专家不参与计算。于是模型拥有巨大的**总参数量**，但每个 token 只激活其中一小部分（**激活参数量**小）。

## 核心机制
1. **路由（gating）**：路由器对 token 的表示打分，选出 top-k 专家并给出加权系数（softmax）。
2. **稀疏激活**：只有被选中的 k 个专家前向计算，输出按门控权重加权求和。
3. **稀疏 = 解耦容量与算力**：这是 MoE 的关键价值——可以把参数量（记忆/知识容量）扩到很大，而每 token 的 FLOPs 只随激活专家数增长，从而「参数很多但推理便宜」。

## 关键工程难点
- **负载均衡**：路由器易「偏科」，把大多数 token 送给少数专家，其余专家饿死。需加**负载均衡辅助损失**（load balancing loss）或用无辅助损失的均衡策略，鼓励专家使用均匀。
- **容量因子与丢弃**：每个专家有处理上限（capacity），超出的 token 被丢弃或走残差，需权衡。
- **训练稳定性与通信**：专家分布在多卡上，路由带来 all-to-all 通信开销；大规模训练需专门并行（expert parallelism）。
- **推理显存**：虽然激活参数少，但**全部专家参数都要驻留显存**，显存需求仍随总参数增长。

## 代表实例（本 wiki）
- [[qwen3|Qwen3]] 旗舰 Qwen3-235B-A22B：总参数 235B，每 token 只激活 22B。
- [[qwen3.5-omni|Qwen3.5-Omni]]：Hybrid Attention + MoE。
- 更广谱系：Switch Transformer、Mixtral、DeepSeek-MoE 等。

## 地位与启示
MoE 是当前大模型「便宜地变大」的主流扩容路线，让万亿级参数在可接受推理成本下成为可能。对文档/OCR 大模型的启示：可用 MoE 在不显著增加激活成本的前提下扩大模型知识容量，或让不同专家专注不同文档类型/语种。
