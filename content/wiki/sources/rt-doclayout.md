---
type: source
title: RT-DocLayout — 实时端到端文档版面分析（含阅读顺序）
sources: [rt-doclayout]
tags: [ocr, document-layout-analysis, dla, detr, rt-detr, detection, segmentation, reading-order, baidu, front-detr-relevant]
created: 2026-07-25
updated: 2026-07-25
---

# RT-DocLayout (PP-DocLayoutV3)

📄 **原文**：[arXiv:2606.23344](https://arxiv.org/abs/2606.23344) · [PDF](https://arxiv.org/pdf/2606.23344)

- **arXiv**: 2606.23344v1（2026-06-22，cs.CV）
- **团队**: 百度 PaddlePaddle（[[baidu]]，与 [[hpd-parsing]] 同组，作者含 Cheng Cui / Manhui Lin）
- **开源名**: PP-DocLayoutV3；权重 HF PaddlePaddle/PP-DocLayoutV3
## 一句话
一个 **33M 参数**、基于 **RT-DETR** 的纯视觉端到端版面分析前端：**单个 query-based decoder 一次前向**同时做分类 + 检测框 + **像素级 mask** + **阅读顺序**，OmniDocBench v1.5 及真实畸变基准 Overall **92.46%** / **132.1 FPS**（A100 bs32），SOTA 且实时。**明确定位为文档解析系统的前端（front-end for document parsing）**。

## 问题
- 级联 pipeline（检测器 + GNN/启发式排序）→ 误差传播、脆弱。
- 大 VLM（LayoutLMv3/DiT/MinerU/Dolphin）→ 精度好但算力重，且只用**轴对齐框**，在弯曲/透视/倾斜文档上无法隔离元素，背景/邻元素干扰下游 OCR。

## 方法（统一 mask-centric 多任务）
- **骨架**：扩展 [[detr]] 系的 **RT-DETR**，加一个 mask 检测头 → 像素精确分割，在畸变页上纯净隔离元素。
- **query-based decoder**：N 个 object query，每个 query 同时编码空间 + 结构语义，一次前向输出 类别/框/mask/阅读顺序 —— **非自回归、确定性解码**（替掉 AR 生成和级联 pipeline）。
- **阅读顺序内嵌 decoder**（不像 PP-DocLayoutV2 用解耦 pointer-network）：
  - 成对先后分数（式1）`S_{i,j} = (q_i^T W_q^T W_k q_j − q_j^T W_q^T W_k q_i)/√d_h`，**反对称** `S_{i,j}=−S_{j,i}`，>0 表示 i 在 j 前。
  - 推理用**投票排序**（式2）`V_j = Σ_i σ(S_{i,j})` = j 前面元素的期望数，升序排 → 全局一致阅读顺序。
- **损失**（式3）六项加权和 K={cls,bbox,giou,mask,dice,order}，权重 λ_cls=4/bbox=5/giou=2/mask=5/dice=5/**order=50**。
  - order 权重极高的原因：①梯度稀释——order loss 作用在 O(N²) 对上，每对梯度被 ~N/2 稀释，而其它 object 级 loss 是 O(N)；②其它 loss 有 deep supervision（每层都算，L 层 = L 倍梯度），order 只在最后一层算。
  - cls 用 focal（α=0.25, γ=2.0）；box 用 ℓ1+GIoU；mask 用 BCE+Dice，仿 MaskDINO 用 point-based 采样（12544 点/mask，75% 分给不确定区）；Hungarian 二分匹配。

## 结果
- **Overall 92.46% / 132.1 FPS / 33M 参数**（A100 bs32，下游识别用 PaddleOCR-VL-1.5-0.9B）。
- 六维鲁棒性（Raw/Scanning/Warping/Screen-Photography/Illumination/Skew）全面最高，超 PP-DocLayoutV2（87.12/110.9）、MinerU2.5（86.61/**2.4 FPS**）、Dolphin-v2（71.44/**0.9 FPS**）、DocLayout-YOLO（76.27/107.4）。
- 像素 mask 显著提升下游整页重建质量（vs 纯框方法）。

## 对检测—识别组合系统的启示
- ⭐⭐⭐ **这就是文档版面检测的一种完整实现**，且与 [[hpd-parsing]] 同组 → 两篇天然串成一栈：RT-DocLayout 出 layout（框+mask+阅读顺序）→ 每个 query 的框当 `<FORK>` 触发 → HPD 式后端 AR 并发解码内容。
- ⭐⭐⭐ **阅读顺序内嵌 query（反对称成对分数 + 投票排序）**：非常干净的做法，避免独立 pointer-net/GNN 后处理，可直接用在前端；反对称约束 + O(N²) order loss 高权重是实操 trick。
- ⭐⭐ **像素级 mask 而非轴对齐框**：畸变文档下给后端 AR 一个「纯净 crop」，减少背景/邻元素污染——对拍摄/扫描件识别质量关键。仿 MaskDINO 的 point-based mask 采样省算力。
- ⭐⭐ **统一 query 一次前向出 4 种输出（非 AR）**：前端保持轻量非自回归，把 AR 成本全留给后端内容生成，符合「前端检测省、后端生成精」的分工。
- ⭐ order loss 的梯度稀释分析 → 多任务 DETR 训练时给关系类 loss 加大权重的通用经验。

## 关联
- [[detr]] / RT-DETR 骨架；对比 DLAFormer（type-wise query 统一 label space）、PP-DocLayoutV2（解耦 pointer-net）。
- 前端 → 后端衔接的下一步加速见 [[hpd-parsing]]（layout fork 并发 AR）。
