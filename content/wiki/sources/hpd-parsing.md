---
type: source
title: HPD-Parsing — 层次并行解码文档解析
sources: [hpd-parsing]
tags: [ocr, document-parsing, decoding, parallel-decoding, mtp, speculative-decoding, kv-cache, vlm, baidu, front-detr-relevant, back-ar-relevant]
created: 2026-07-24
updated: 2026-07-25
---

# HPD-Parsing — Hierarchical Parallel Document Parsing

📄 **原文**：[arXiv:2607.18839](https://arxiv.org/abs/2607.18839) · [PDF](https://arxiv.org/pdf/2607.18839)

- **arXiv**: 2607.18839v1（2026-07-21）
- **团队**: 百度 PaddleOCR（[[baidu]]）
- **代码/权重**: github.com/PaddlePaddle/PaddleOCR · HF PaddlePaddle/HPD-Parsing
- **骨架**: InternVL3.5-1B（0.3B InternViT + 0.8B Qwen3-0.6B 改的 LLM decoder，28层/hidden 1024/GQA 16q-8kv/SwiGLU+RMSNorm）
## 一句话
统一 VLM 文档解析的瓶颈在**解码**不在编码；layout 要全局协调、区块内容却是**局部独立**的 → 用**层次并行解码 (HPD)** 把单条全页 AR 轨迹拆成「一条 layout 主分支 + 多条并发 content 分支」，再叠 P-MTP，1B 模型拿 OmniDocBench v1.6 **Overall 94.91（SOTA）**、峰值 **4,752 TPS**（最快现有模型 2.62×、vanilla AR baseline 3.06×），精度不掉。

## 问题诊断（关键动机）
- 用 InternVL3.5-1B baseline profile：输出长的样本里 **decoder 耗时 ≈ encoder 的 ~500×**。
- AR 的 active KV cache 与 per-step attention 随文档长度**持续膨胀**（每个新 token attend 全部前文）。
- 洞察：**global layout 需联合协调**（空间结构/区域关系/阅读顺序），**region content 主要 grounded 在局部视觉证据**，对远处区块依赖弱 → 单条全页 AR 是不必要的串行。

## 方法（三招）

### 1. Layout-Coordinated Parallel Decoding
- **Layout 主分支**：按阅读顺序输出结构序列，每个 layout unit = 类别 + 归一化坐标 + 路由 token `<FORK>`。
- **Content 分支**：每遇 `<FORK>`，调度器 fork 一条 content 分支，把 `<FORK>` 换成 `<CHILD>`，复用已有视觉+结构前缀 KV，开始解码该区块内容；主分支继续往下 → **多区块并发**。
- **监督掩码**（式1）：content 分支只监督 `<CHILD>` 之后的局部转写，`M_t = I(t > t_<CHILD>)`；视觉 context + 结构前缀只作 conditioning，不用重复生成。

### 2. Shared-Prefix KV Reuse + Context Isolation
- 子分支**零拷贝**复用视觉 context 和 fork 位置可见的 layout 前缀 KV → 不重新 encode 图、不重复 prefill。
- 每个 content 分支**只 attend**：共享视觉 context + 自己的结构前缀 + 自己的局部生成历史 → active attention horizon 大幅缩短。
- 与 [[unlimited-ocr]] 的 R-SWA 互补：R-SWA 是滑窗压 KV，HPD 是**分而治之隔离 KV**。

### 3. P-MTP（Progressive Multi-Token Prediction）
- 轻量 residual MLP 从 decoder hidden state 投机式预测多个未来 token（式2），渐进 loss 加权（近距离权重大、远距离衰减 + path/target 一致性）。
- 推理时每分支 draft 多 token → 并行验证 → 单步 accept 多个，**平均接受 6.6 token/步**。
- 层间/token 两个维度都缩短 AR 路径（分支并发缩「跨区块」串行，P-MTP 缩「分支内」串行）。
- 概念页：[[progressive-multi-token-prediction]]、[[speculative-decoding]]

## 推理调度（Algorithm 1）
- 在 vLLM 0.17.1 的 FCFS 上扩展：child 请求 key 排在 parent 前（bypass gate），parent 受 KV 占用阈值 τ + 并发上限 N_max 门控。
- `<FORK>` 检测 → SpawnChild + KV `fork_ptr` 零拷贝共享 → 引用计数释放（parent 所有 child DONE 后 `InterleaveOutputs` 拼回全页）。

## 训练（三阶段 staged adaptation）
1. **Stage 1 能力初始化**：全页 AR 格式打底，2.8M 样本（MinerU-2.5 Pro 标注为主），lr 1e-4，同时让 P-MTP 学 look-ahead。
2. **Stage 2 范式切换 + 难例优化**：切分支格式，100K 样本，layout 分支 + content 分支双监督，lr 1e-5。
3. **Stage 3 RL 精修**：600 hard case，按公式/表格/layout 分别构造 task-aware reward + count-based 一致性 reward，lr 5e-7。
- 配套 **difficulty-aware 数据清洗 pipeline**：特征聚类采样 → 多模型标注（PaddleOCR-VL-1.5 + MinerU-2.5 Pro + 中间 checkpoint，按 OmniDocBench 差异分 Easy/Medium/Hard）→ VLM 迭代精修 hard 例 → 难度+属性分布平衡。
- 8×A800，bf16，DeepSpeed ZeRO-1 + FlashAttention，max seq 16k，effective batch 128。

## 结果（[[omnidocbench]] v1.6）
- **Overall 94.91**（1B 参数，端到端统一解析 SOTA），超 Qianfan-OCR / Logics-Parsing-v2 / FireRed-OCR，逼近领先 pipeline 方案。
- ReadOrderEdit 0.124。
- **峰值 4,752 TPS**（BS=512）：最快现有模型 **2.62×**、vanilla AR baseline **3.06×**，精度不降。
  - ⚠️ 原文内部存在倍数不一致：摘要给 2.62×（与整体最快模型比），但正文另一处写与 DeepSeek-OCR-2 比为 PPS 1.31× / TPS **1.62×**。两个倍数语境不同，引用时需区分。

## 对检测—识别组合系统的启示
- ⭐⭐⭐ **几乎为检测—识别组合架构量身定做**：前端 DETR（query-based）出的区块框 = 天然的「layout 分支输出」。DETR 每个 query 的框可直接当 `<FORK>` 触发点，把 fork 调度接到后端 AR，让每区块**并发 AR 解码**——省掉让 AR 重新预测 layout 的一段串行。
- ⭐⭐ **KV 隔离 + shared-prefix reuse** 工程 trick + Algorithm 1（vLLM FCFS + fork + 引用计数）可直接搬到后端 serving。
- ⭐⭐ **P-MTP** 是正交增益，DETR/AR 哪套都能叠（对 grounded、可预测的 OCR 轨迹尤其有效）。
- ⭐ **content 分支只监督 `<CHILD>` 之后** 的掩码设计，避免子分支复述共享 context，值得照搬到分区块训练。
- ⭐ difficulty-aware 数据清洗（多模型共识 + 中间 checkpoint 分难度 + VLM 精修 hard 例），低标注成本，可并入现有数据引擎。

## 与同类加速方案的关系
- [[youtu-parsing]]：query+token 并行（pipeline 式，region-wise）；HPD 是**统一模型内**动态 fork，保持单模型联合优化。
- [[glm-ocr]]：MTP 加速；HPD 的 P-MTP 是其升级（progressive 加权）+ 叠了分支并发。
- [[deepseek-ocr]] / [[unlimited-ocr]]：压 context / 压 KV（减 per-step 计算）；HPD 走**减串行步数**，两条线正交可叠。
