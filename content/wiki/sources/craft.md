---
type: source
title: "Character Region Awareness for Text Detection (CRAFT)"
authors: [Baek, Lee, Han, Yun, Lee]
year: 2019
arxiv: "1904.01941"
sources: [craft]
tags: [ocr, text-detection, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---
# CRAFT (2019) — 深度精读

📄 **原文**：[arXiv:1904.01941](https://arxiv.org/abs/1904.01941) · [PDF](https://arxiv.org/pdf/1904.01941)
> 里程碑 ⭐ — 用「字符区域感知」做文本检测：预测字符中心热图 + 字符间 affinity 热图，天然支持任意形状/弯曲文本。

## 一句话定位
不直接回归词框，而是让 CNN 输出两张像素级热图——**region score**（每像素是某字符中心的概率）和 **affinity score**（相邻字符间连接的概率）——再用连通/分水岭把字符聚成词。因此对弯曲、长文本、多语言极其鲁棒。

## 核心贡献
1. **字符级 + affinity 双热图表示**：region 定位单字符，affinity 决定哪些字符属于同一个词，摆脱固定 anchor/词框回归的形状限制。
2. **弱监督训练解决无字符标注问题**：公开数据集只有词级框，作者用合成数据（有字符框）先训 interim model，再让它在真实词图上预测字符 region → 分水岭切出伪字符框（pseudo-GT），并用置信度加权，逐步自举。
3. **任意形状文本**：因为聚合在像素级进行，可沿字符局部极大线生成多边形，天然覆盖 curved text（TotalText/CTW-1500）。

## 架构 / 方法细节
- **骨干 + 解码**：VGG16-BN 编码器 + 类 **U-Net** 的 skip 解码器聚合低层特征，最终输出 2 通道（region、affinity）。
- **GT 生成**：不用二值分割，而是把字符框渲染成**各向同性 2D 高斯**（透视变换贴到框内）；affinity GT 由相邻字符框的上下三角中心构成 affinity box，再贴高斯。这种连续热图比硬分割更好学。
- **推理**：对两图阈值化 → 连通分量标注 (CCL) → 求最小外接旋转矩形得 QuadBox；曲文再走多边形（局部极大线 + 中心线 + 倾角控制点）流程。
- **弱监督损失**：伪 GT 用 region score 置信度 `sconf` 加权，避免早期不准的伪标签污染训练。

## 关键结果（真实数字，H-mean）
- **IC13 (DetEval) 95.2**（R 93.1 / P 97.4），**IC15 86.9**（R 84.3 / P 89.8），**IC17 (MLT) 73.9**，**MSRA-TD500 82.9**，速度 **8.6 FPS**。
- 弯曲文本（多边形数据集）：**TotalText H 83.6**（R 79.9 / P 87.6），**CTW-1500 H 83.5**（R 81.1 / P 86.0），显著超过 TextSnake 等。
- 在多数公开基准上刷新 SOTA，尤其在长/弯/多语言文本上优势明显。

## 为什么是里程碑
把文本检测从「词级框回归」下沉到「字符级像素热图 + affinity 聚合」，一举解决任意形状文本这一长期难题；CRAFT 成为工业界与开源 OCR（如 EasyOCR）默认检测器，是「检测+识别」两阶段流水线里检测端的经典基线。

## 关联
- 检测端经典方案，常与识别端 [[crnn]] / [[trocr]] 组成两阶段 OCR 流水线。
- 解码结构借鉴 [[resnet-deep-residual-learning]] 时代的 U-Net skip 思想；后续端到端生成式 OCR（[[got-ocr2]]、[[deepseek-ocr]]、[[nougat]]）逐渐把检测+识别合并进单一模型。
