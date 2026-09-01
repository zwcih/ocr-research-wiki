---
type: concept
title: "Noisy-Label / 伪标签学习（带噪标签、合成数据、突破软标签天花板）"
sources: [vit]
tags: [noisy-label, pseudo-label, distillation, data, ocr, training]
created: 2026-08-07
updated: 2026-08-07
---
# 带噪标签 / 伪标签学习（Noisy-Label Learning）

## 为什么单独成章
用其他模型产出的**伪标签**或**合成数据**训练时，标签本身带噪。对 OCR 造数据尤其关键：数据便宜但脏，如何在脏标签上训出超过标注 teacher 的模型，是核心工程问题。[[label-smoothing]] 只能抗随机噪声、防过度自信，**对系统性错误无解**。

## 核心矛盾：两类错误，两套策略
- **随机噪声**：分散、无结构，梯度平均会稀释，模型天然有一定抗性。
- **系统性错误 pattern**：teacher 在某类样本上**一致地错**（OCR 里如 "0"↔"O"、"rn"↔"m" 稳定混淆，某版式下漏检表格线）。错误相关、可被 student 学到并复制 → student **继承 teacher 的盲区**。这才是软标签质量的天花板。label smoothing 撒均匀噪声，不知错在哪，完全无能为力。

## 突破软标签限制的方法

### 1. 打破单一 teacher —— 用分歧定位错误
- **多 teacher / co-training**：架构或数据不同的多个模型跑伪标签。**一致同意** → 高置信可信；**互相分歧** → 大概率系统错误区，送人工核验或降权/丢弃。系统错误常是某模型特有，投票能暴露它。
- **不确定性估计**：MC-dropout / 深度集成算伪标签方差，高方差样本不可信。

### 2. 少量高质量真值当"锚" —— 纠系统 bias
系统错误最有效的破法是**一小批干净人工标注**（哪怕 1–5%）：
- **两阶段/混合训练**：伪标签预训练 + 真值微调（真值放最后主导收敛方向）。
- **loss 加权**：真值样本给更高权重。
- **confusion-aware relabeling**：在真值集上量出 teacher 的**混淆矩阵**，反向修正伪标签分布——已知 teacher 系统性把 A 标成 B，就在训练目标里补偿。

### 3. 噪声鲁棒损失 & 样本选择
- **抗噪 loss**：GCE（Generalized Cross-Entropy）、Symmetric CE、bootstrapping loss——对高 loss 样本自动降敏，避免死记错标签（见 [[loss-functions]]）。
- **small-loss trick（Co-teaching）**：训练早期 **loss 小的样本更可能是对的**（DNN 先学简单/正确 pattern，后期才记噪声）。每 batch 只用 loss 最小的一部分更新；两个网络互筛样本（co-teaching）防止单模型自我强化错误。

### 4. 让 student 反超 teacher
- **渐进式自训练（self-training / noisy student）**：只留 teacher 高置信伪标签 → student 训好后回头**重标**低置信样本 → 迭代。关键：student 加**更强正则/增广、更大模型**，才能超过 teacher 而非复制它。
- **一致性正则（FixMatch 式）**：同一无标注样本加不同增广，要求输出一致——不依赖标签正确性，靠结构先验涨点，绕过软标签瓶颈。

### 5. OCR 领域招（最实用）
- **语言模型/词典后验约束**：OCR 系统错误常违反语言先验（乱码串、形近混淆）。用 LM 或词典给伪标签打分，剔除不合语言的。
- **多视图一致性交叉验证**：同一文档不同分辨率/增广下预测不一致的区域 = 可疑，重标或弃用。
- **难例挖掘**：已知系统混淆对（形近字、密集小字、复杂表格）**定向补真值标注**，针对性消 bias。

## 总纲
label smoothing 只能抗**随机**噪声、防过度自信；**系统性错误 pattern 靠它无解**。突破要靠：多模型分歧检测 + 少量真值锚定纠偏 + 抗噪 loss / small-loss 样本选择 + 一致性 / 自训练迭代 + 领域先验（LM/词典）过滤。核心思想——**别让 student 无差别信任 teacher，要给它独立的"对错信号来源"**（真值、多模型共识、语言先验、样本 loss 动态），它才能突破软标签天花板。

## 与 label smoothing / 知识蒸馏的关系
- **伪标签本质接近蒸馏软标签**：若产出数据的模型比你强，直接用它**软输出**训 = 知识蒸馏，通常优于伪硬标签。
- **不要在伪标签上再叠 [[label-smoothing]]**：它已软化/带噪，机械平滑是二次污染。
- 数据按来源分流：真标注可平滑（$\epsilon=0.1$）；模型伪标签走**置信度过滤 + 软标签蒸馏 + 抗噪 loss**。

## 关联
[[label-smoothing]] · [[loss-functions]] · [[data-quality-over-scale]] · [[vit]]
