---
type: source
title: "General OCR Theory: Towards OCR-2.0 via a Unified End-to-end Model (GOT)"
authors: [Wei, Liu, Chen, et al.]
year: 2024
arxiv: "2409.01704"
sources: [got-ocr2]
tags: [ocr, ocr-2.0, unified, end-to-end, milestone]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---
# GOT-OCR2.0 (2024) — 深度精读

📄 **原文**：[arXiv:2409.01704](https://arxiv.org/abs/2409.01704) · [PDF](https://arxiv.org/pdf/2409.01704)
> 里程碑 ⭐ — 提出 **General OCR Theory (OCR-2.0)**：把一切人造光学信号（文字、公式、分子式、表格、图表、乐谱、几何图）统一为「character」，用一个 580M 的端到端小模型全部识别。

## 一句话定位
用「高压缩视觉 encoder + 长上下文语言 decoder」的极简 encoder-decoder，把 OCR-1.0 时代那套「检测→裁剪→识别」多模块流水线，替换为一个统一、低成本、可交互（region-level / 坐标或颜色引导）的端到端模型。

## 核心贡献
1. **OCR-2.0 理论**：定义新一代 OCR 应满足——(a) 端到端统一架构（低维护）、(b) 训练/推理低成本（专注感知识别而非像 LVLM 那样做推理聊天）、(c) 通用性（识别乐谱/图表/几何/分子式，并支持格式化输出如公式与表格）。
2. **统一小模型 GOT (580M)**：**80M 高压缩视觉 encoder（1024×1024 输入）+ 0.5B 长上下文 decoder（支持 8K token）**，比动辄数十亿参数的 LVLM 便宜得多，却在密集 OCR 上更强。
3. **实用工程**：支持 **dynamic resolution**（>2K 超高清图切子块）与 **multi-page OCR**，并具备交互式区域识别。

## 架构 / 方法细节
- 视觉 encoder → 线性连接层（1024×768，映射通道到 decoder 维度）→ 语言 decoder，seamless encoder-decoder。
- **三阶段训练**：Stage 1 用 tiny **OPT-125M** 高效预训练视觉 encoder 适配 OCR（约 5M 图文对，3M 场景文字 + 文档级数据，PDF 取自 Common Crawl）；Stage 2 把 encoder 接到更大的新 decoder（选用 **Qwen 0.5B**，参数小但多语言知识足）做通用 OCR 数据训练（乐谱/公式/图表等）；Stage 3 冻结 encoder，仅定制/后训 decoder 提升特性。
- 与 Qwen-VL（CLIP-G 巨编码器）、Vary（并联新视觉词表）对比，GOT encoder 更小巧且压缩率高，A4 PDF 页只需少量 token。

## 关键结果（真实数字）
- **580M 总参数**即在文档级密集 OCR、场景文字、公式、表格、乐谱、几何、图表等多任务上达到/超越 SOTA，且 token 消耗低（高压缩 encoder 让整页 PDF 用极少 token 表示）。
- 支持格式化输出（Markdown/LaTeX 公式、表格）与交互式坐标/颜色引导的 region OCR；dynamic resolution + multi-page 使其在长文档与超高清图上实用。

## 为什么是里程碑
把碎片化的 OCR 任务收敛为「一个理论 + 一个统一端到端小模型」，用远小于 LVLM 的代价拿到强感知能力，明确了 OCR-2.0 的设计原则；直接影响后续统一 OCR/文档大模型（[[deepseek-ocr]]、[[glm-ocr]]、[[monkeyocr-v2]]、[[ovis-ocr2]]）。

## 关联
- 沿 [[trocr]]/[[donut]]/[[nougat]] 的生成式 encoder-decoder 路线，decoder 用 [[t5]] 之后的 Qwen 语言模型；对比 CLIP 巨编码器方案（[[clip]]）。
- 是 [[deepseek-ocr]]、[[glm-ocr]]、[[monkeyocr-v2]]、[[ovis-ocr2]] 的重要前身，评测常参照 [[omnidocbench]]。
