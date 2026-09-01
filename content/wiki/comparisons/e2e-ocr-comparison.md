---
type: comparison
title: "端到端 OCR / 文档解析模型横评"
sources: [got-ocr2, deepseek-ocr, ovis-ocr2, glm-ocr, monkeyocr-v2, nougat, donut, trocr]
tags: [ocr, document-ai, comparison, benchmark]
created: 2026-07-23
updated: 2026-07-23
---

# 端到端 OCR / 文档解析模型横评

> 聚焦 2021–2026 的端到端 / OCR-free 路线，对比参数、核心创新、评测。

## 主力对比（新一代端到端小模型）

| 模型                       | 年份   | 机构       | 参数                           | 核心创新                                                    | 关键评测                             |
| ------------------------ | ---- | -------- | ---------------------------- | ------------------------------------------------------- | -------------------------------- |
| [[got-ocr2\|GOT-OCR2.0]] | 2024 | 学界       | 580M（80M enc + 0.5B dec）     | 统一端到端 OCR-2.0，高压缩 encoder，可交互 region OCR                | 密集 OCR 强，通吃公式/表格/乐谱              |
| [[deepseek-ocr]]         | 2024 | DeepSeek | —                            | Contexts Optical Compression（文本→vision token）           | 10× 压缩 97% 精度，20× ~60%           |
| [[ovis-ocr2]]            | 2026 | 阿里       | 0.8B                         | 端到端 + RL + on-policy 蒸馏 + 模型融合                          | **OmniDocBench v1.6 96.58 SOTA** |
| [[glm-ocr]]              | 2026 | 智谱       | 0.9B（CogViT 0.4B + GLM 0.5B） | Multi-Token Prediction 加速确定性解码                          | **OmniDocBench v1.5 94.6 第一**    |
| [[monkeyocr-v2]]         | 2026 | —        | （视觉底座）                       | 图→文生成 + 像素级重建，文档原生 encoder；开源 MonkeyDoc v2（1.13亿图/17语言） | 即插即用提升下游（CRNN 58.7%→67.3%）       |

## 前代 / 铺路模型

| 模型 | 年份 | 路线 | 特点 |
|---|---|---|---|
| [[trocr]] | 2021 | 端到端识别 | ViT 编码 + 文本解码，抛弃 CNN+RNN+CTC |
| [[donut]] | 2021 | OCR-free | 图像 → 结构化 JSON，OCR-free 先驱 |
| [[nougat]] | 2023 | OCR-free | 学术 PDF → LaTeX Markdown，Swin + mBART |

## 关键观察

1. **参数越做越小**：从数十亿 LVLM → 0.5–0.9B 专用模型登顶主流榜
2. **两种"小而强"路径**：
   - 训一个强端到端小模型（[[got-ocr2]]/[[ovis-ocr2]]/[[glm-ocr]]）
   - 或训一块可替换的视觉底座（[[monkeyocr-v2]]），后端随便接
3. **效率创新分化**：光学压缩（[[deepseek-ocr]]）/ MTP 解码（[[glm-ocr]]）/ RL+蒸馏（[[ovis-ocr2]]）
4. **评测榜**：OmniDocBench 已到 94–96 高位 → 榜单趋于饱和，
   [[gdp-pdf-benchmark|GDP.pdf]] 这类 grounded 推理榜（最好仅 30.7%）暴露真正差距

## 选型建议（粗略）
- 要极致精度上榜：[[ovis-ocr2]]（96.58）
- 边缘/低成本部署：[[glm-ocr]]（0.9B + MTP）
- 长文档省 token：[[deepseek-ocr]]（光学压缩）
- 自建 pipeline 想换个强 encoder：[[monkeyocr-v2]]

## 关联
- 演进脉络见 [[ocr-evolution]]；路线之争见 [[visual-compression-vs-reconstruction]]
