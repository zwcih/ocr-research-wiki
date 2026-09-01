---
type: source
title: "An End-to-End Trainable Neural Network for Image-based Sequence Recognition (CRNN)"
authors: [Shi, Bai, Yao]
year: 2015
arxiv: "1507.05717"
sources: [crnn]
tags: [ocr, text-recognition, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---
# CRNN (2015) — 深度精读

📄 **原文**：[arXiv:1507.05717](https://arxiv.org/abs/1507.05717) · [PDF](https://arxiv.org/pdf/1507.05717)
> 里程碑 ⭐ — 把图像文本行识别统一为「序列识别」问题，CNN+RNN+CTC 三件套端到端训练，长期是 OCR 识别的主力范式。

## 一句话定位
用 CNN 从整张词图抽出**帧级特征序列**，双向 LSTM 建模上下文，最后用 **CTC** 无对齐转写成不定长标签串——无需字符切分、无需固定长度、无需预设词典。

## 核心贡献
1. **统一框架**：把特征提取（conv layers）、序列建模（recurrent layers）、转写（transcription layer）整合进一个网络，用**单一损失函数联合训练**，端到端可训（对比此前各模块分开训）。
2. **不定长天然处理**：从「OK」(2字符) 到「congratulations」(15字符) 都不用横向尺度归一化或字符分割。
3. **无词典约束**：既能 lexicon-free 也能 lexicon-based，都拿到 SOTA；不像 Jaderberg 等 [22] 被限制在 90k 词典分类。
4. **模型极小**：全部层权重共享、无全连接分类头，**仅 8.3M 参数、33MB RAM**（单精度），远小于同期基于 CNN 变体的方法。
5. **通用性**：不仅场景文字，还能识别乐谱（music score）序列，验证范式普适。

## 架构 / 方法细节
- **Conv layers**：基于 VGG-VeryDeep，做了 tweak（把部分 max-pool 改成 1×2 矩形窗）以适配文本行的宽长形状，输出一列特征向量序列（每列对应原图一个感受野竖条）。
- **Recurrent layers**：**深层双向 LSTM (BLSTM)**，对每一帧输出字符分布，捕捉如「il」「cl」这类需上下文才能判的组合。RNN 误差通过 "Map-to-Sequence" 桥回传给 conv。
- **Transcription (CTC)**：用 CTC 的条件概率把 per-frame 预测边缘化掉空白/重复得到最终串；lexicon-free 用近似最优路径解码，lexicon-based 用近似前缀搜索（参数 δ，实验取 δ=3 平衡精度与速度）。
- **训练**：ADADELTA（无需手调学习率，比 momentum 收敛快）；训练数据用 Jaderberg 合成的 **8M** 词图。

## 关键结果（真实数字）
无词典 (None) 场景文字识别准确率：
- **IIIT5k 81.2 / SVT 80.8 / IC03 89.4 / IC13 86.7**（无约束）
- 有词典时更高：IIIT5k 50-lexicon **97.6**，IC03 50-lexicon **98.7**，SVT 50-lexicon **96.4**
- 多项超越当时 SOTA（PhotoOCR 用了 7.9M 真实词图，CRNN 仅合成数据即可媲美/超越），且模型只有 8.3M 参数。
- 乐谱识别 (Table 4) 上 fragment accuracy 明显优于商业软件，证明范式通用。

## 为什么是里程碑
把「识别」从「先切字符再分类」的脆弱流水线，变成「一个网络 + 一个损失」的端到端序列建模；CNN+RNN+CTC 成为之后近十年 OCR 识别的事实标准，直到 Transformer/生成式 OCR 出现才被取代。

## 关联
- 转写核心依赖 [[ctc]]，视觉骨干借鉴 [[vgg]]。
- 是端到端生成式 OCR（[[trocr]]、[[got-ocr2]]、[[deepseek-ocr]]）出现前的主流识别方案；与检测方法 [[craft]] 组成经典「检测+识别」两阶段 OCR。
