---
type: entity
title: 华中科技大学 HUST（白翔组）
tags: [org, ocr, text-recognition, china, academia]
sources: [crnn, monkeyocr-v2]
created: 2026-07-23
updated: 2026-07-25
---

# 华中科技大学 HUST（白翔 Xiang Bai 组）

华中科技大学计算机视觉团队，白翔（Xiang Bai）领衔，是 OCR/场景文本识别的奠基性学术源头之一，横跨从经典识别到文档视觉基础模型。

## 本 Wiki 相关工作
- [[crnn]]（2015，Shi, Bai, Yao）— 把图像文本行识别统一为"序列识别"，CNN+RNN+CTC 三件套端到端训练，长期是 OCR 识别主力范式。奠基里程碑。
- [[monkeyocr-v2]]（2026，HUST / Kingsoft，Liu…Bai）— 提出**文档专属视觉基础模型**：在 1.13 亿文档图像（17 语言）上联合学"图→文生成 + 像素级重建"，产出 document-native 编码器，即插即用提升五大文档任务（如把 CRNN 识别率 58.7%→67.3%）。

## 定位
主攻方向：**场景/文档文本识别的底层表征**——从 CRNN 的序列范式到 MonkeyOCR-v2 的文档原生视觉底座。团队：白翔组（长期 OCR/文本检测识别高产）。活跃时间：2015 至今，2026 与金山合作产出 MonkeyOCR-v2。OCR 谱系角色：识别范式的学术源头之一，且在"为文档造专属编码器"方向领跑。
