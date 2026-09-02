---
type: source
title: SCVER — 解码状态条件的高分辨率视觉证据检索
sources: [scver]
tags:
  [
    ocr,
    document-parsing,
    autoregressive-decoding,
    visual-retrieval,
    deformable-attention,
    high-resolution,
    efficiency,
    front-detr-relevant,
    back-ar-relevant,
  ]
created: 2026-09-02
updated: 2026-09-02
---

# SCVER — State-Conditioned Visual Evidence Retrieval

📄 **原文**：[arXiv:2608.28698](https://arxiv.org/abs/2608.28698) · [PDF](https://arxiv.org/pdf/2608.28698) · [代码](https://github.com/SII-sc22mc/SCVER)

- **arXiv**：2608.28698v1（2026-08-27，cs.CV）
- **团队**：复旦大学 + 上海创新研究院 + [[shanghai-ai-lab|上海人工智能实验室]] + [[bytedance|字节跳动 LarkAI]]
- **作者**：Mingxu Chai、Chenyu Liu、Ziyu Shen、Jiazheng Zhang 等

## 一句话

不再要求压缩后的全局视觉 token 一次性记住整页全部细节，而是在 **AR 解码的每一步**，用当前文本 hidden state 从压缩前的高分辨率特征图中动态采样少量局部证据；再用冻结底座 attention 的空间质心作弱监督（SGLO），把这种 latent region retrieval 训稳定。

## 问题：细节是局部的，视觉表示却是全局静态的

文档 VLM 通常先把高分辨率特征压成固定数量的视觉 token，后续每个解码步都反复读取同一份全局表示。这有两个矛盾：

1. 小字、公式符号和表格线等细节可能在 Patch Merger 中丢失；提高整页分辨率又会让视觉 token 与 attention 成本激增。
2. 每个输出 token 真正需要的证据通常只位于一个小区域，而且位置随解码状态变化；让静态全局表示保存并反复提供所有细节，计算冗余。

SCVER 将问题改写为：**当前 token 需要什么证据，就在当前步去高分辨率特征图取什么证据。**

## 方法

### 1. 粗粒度全局流 + 高分辨率证据流

视觉编码器先产生压缩前特征 $\tilde F\in\mathbb{R}^{\tilde n_v\times d}$，Patch Merger 再得到紧凑全局 token $F\in\mathbb{R}^{n_v\times d}$，其中 $n_v<\tilde n_v$。

- $F$ 负责全局结构和粗语义。
- $\tilde F$ 不整体送进 decoder，只在需要时被 SCVER 稀疏读取。

在第 $i$ 个 decoder block 中：

$$
H_i=X_{i-1}+\operatorname{Attn}(X_{i-1}),\qquad
\tilde H_i=\operatorname{SCVER}(H_i,\tilde F),\qquad
X_i=\tilde H_i+\operatorname{FFN}(\tilde H_i).
$$

### 2. token-conditioned deformable sampling

对当前 token hidden state $t$，预测：

$$
r=\sigma(tW_{ref}),\qquad \Delta=tW_{off},\qquad w=tW_{weight}.
$$

$r$ 是归一化参考点；每个 attention head 再预测 $P$ 个 offset 与权重，在 $\tilde F$ 上双线性采样：

$$
\ell_{h,p}=r+\frac{\Delta_{h,p}}{(W_f,H_f)},\qquad
t'_h=\sum_{p=1}^{P}w_{h,p}\operatorname{Bilinear}(\tilde F,\ell_{h,p}).
$$

各头结果拼接后通过残差写回 token。它与 [[deformable-detr]] 的稀疏采样同源，但 **query 不再是 object query，而是 AR 当前解码状态**；不同字符/公式 token 可以访问不同位置，并保持 KV cache 兼容。

### 3. SGLO：用冻结底座 attention 给检索点导航

只靠 token CE 间接学习二维采样位置，容易出现扩散、塌缩和训练振荡。Spatially-Guided Learning Objective（SGLO）在训练时运行两条共享底座权重的流：

- **Base stream**：关闭 SCVER、停止梯度，从原模型 causal self-attention 中取文本 token 对视觉 token 的注意力图，计算空间质心 $c_t^B$。
- **SCVER stream**：开启检索模块，由当前 hidden state 预测参考点 $r_t^S$。

用

$$
L_{ref}=\lVert r_t^S-c_t^B\rVert_2^2,\qquad L=L_{CE}+\lambda L_{ref}
$$

将原模型已有的视觉 grounding 当在线弱标签，不需要 bbox 标注。论文采用 $\lambda=0.1$；底座全部冻结，只训练新增模块，并每 4 个 decoder layer 插一次 SCVER。

## 结果

### 低分辨率时恢复细粒度能力

输入边长比例 $R=0.5$ 意味着约只保留原图 **25% 的视觉 token 面积**：

- **MinerU2.5-Pro**：PubTabNet 66.5→**90.4**，B-MOD 66.4→**92.4**，OmniDoc 78.3→**95.5**；原分辨率 OmniDoc 为 95.7。
- **MonkeyOCR-Pro**：PubTabNet 58.3→**92.8**，B-MOD 62.4→**91.3**，OmniDoc 71.3→**89.1**。

在 $R=0.7$ 时，MinerU2.5-Pro + SCVER 的 OmniDoc 为 **95.9**，略高于原分辨率 baseline 95.7；论文称在接近不掉精度的情况下计算量降低 **70% 以上**。

### 不是简单堆高分辨率特征

在 MinerU2.5-Pro 原分辨率比较中：

- baseline：HWE 95.3 / PubTabNet 90.1 / B-MOD 85.6，1.15e10 FLOPs/token；
- SCVER：**97.4 / 95.2 / 95.1**，1.21e10 FLOPs/token；
- HVFA 虽也增强多尺度特征，但成本为 1.34e10，且结果低于 SCVER。

Dolphin-1.5 消融显示：只加 SCVER 时 PubTabNet 85.9→88.1；再加 SGLO 后到 **91.9**，说明空间监督是关键而非装饰。每 4 层插一次相比每层插入，精度只低约 0.7%，计算再降约 10%。

## 对“前端 DETR + 后端 AR”的启示

- ⭐⭐⭐ **DETR 框可以替代 SGLO 的模糊 attention centroid，成为显式 region prior。** 对每个前端 query/区块，把 box/mask 传给后端，约束 SCVER 的参考点和 offsets 在对应区域内；这样既保留 token 级细采样，又避免 AR 自己重新发现版面。
- ⭐⭐⭐ **检测框不是只拿来 crop。** 可以把 query embedding、box geometry 与高分辨率 feature map 一起作为 AR 的可检索记忆；当前字符 token 决定在框内哪个位置取细节。
- ⭐⭐ **全局低分辨率 + 局部按需高分辨率**比“每个框都预先裁成高分辨率再全量编码”更省，尤其适合一页数十区块但每一步只生成一个区块内容的场景。
- ⭐⭐ SCVER 的 deformable sampler 与前端 [[deformable-detr]] / [[dino-detr]] 技术栈相容，可复用多尺度特征和 CUDA kernel；前端输出还能给 SGLO 提供比 attention centroid 更强的监督。
- ⭐ **边界**：原论文主要验证生成式文档解析、识别和 VQA，并明确把 layout detection 实验放在附录；它不是新的文本检测器，价值主要在“检测之后如何让 AR 精确取证”。

## 开源状态

代码仓库已提供基于 MinerU2.5-Pro 的训练、adapter 保存和 Transformers 推理实现，冻结完整 backbone，只更新高分辨率视觉投影及 decoder 中的 SCVER 模块；公开了公式识别/OCR Parquet 数据。当前开源范围不等于论文全部多底座实验。

## 关联

- 前端骨架：[[detr]]、[[deformable-detr]]、[[dino-detr]]、[[rt-doclayout]]。
- 后端视觉压缩与加速：[[visual-token-compression]]、[[layoutlite]]、[[deepseek-ocr]]、[[unlimited-ocr]]。
- 两段式系统：[[mineru2.5]]、[[mineru2.5-pro]]、[[hpd-parsing]]、[[parser-oriented-refinement]]。
