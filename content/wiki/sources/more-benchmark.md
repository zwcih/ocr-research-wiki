---
type: source
title: MORE — 149 语种多语言文档解析基准
sources: [more-benchmark]
tags: [ocr, document-parsing, benchmark, multilingual, evaluation, teds, cdm, tencent, reading-order, front-detr-relevant]
created: 2026-08-01
updated: 2026-08-01
---

# MORE — A Multilingual Document Parsing Benchmark and Evaluation

📄  · [arXiv abs](https://arxiv.org/abs/2607.02956) · [PDF](https://arxiv.org/pdf/2607.02956)

- **arXiv**: 2607.02956（2026）
- **团队**: 腾讯（[[tencent]]，Shenzhen）；Long Xu, Binghong Wu, Tinghao Yu, Hao Feng 等
- **性质**: **评测基准**（不是模型）。腾讯自曝利益冲突：作者均为腾讯员工，而 HunyuanOCR（本基准评测对象之一）由腾讯开发。

> ⚠️ **名称核对**：arXiv 2607.02956 对应 **MORE 多语言基准**，本页按论文实际内容整理。

## 一句话
现有主流基准（[[omnidocbench]]/OLMBench/FoxBench）几乎只测中英，把其他语言当噪声丢掉，导致长尾语言**没有金标准可验证**——MORE 是**首个覆盖 149 语种、6 大文字系统**的真实文档解析基准，且首次把 **code block / catalog（目录）** 等结构元素纳入评测；结果显示表面「支持数百语言」的宣传在严格评测下大量崩塌，复杂版面检测仍是主要瓶颈。

## 基准构建
- **数据来源真实**：仿 CCpdf 爬 2000 万+ PDF → 启发式去噪 + 版面密度筛（要富结构不要纯文本）→ 语言分类（FastText）→ **排除中英与未标注**（narrow 到 ~570 万）以突出长尾。
- **分层采样**：每语种最多取 10 个 PDF、每 PDF 随机抽 1 页 → 最终 **1,237 页** curated；保留真实文档的**结构稀疏性**（对比 Flores-101 那种强制 1D 对齐的翻译语料）。
- **标注 pipeline**：模型辅助（多模型出候选：dots.ocr/PaddleOCR-VL/Qwen-VL 等 → 归一化 Markdown）+ **人工精修**保证 GT 可靠。表格/目录部分由 HunyuanOCR + PaddleOCR-VL 生成后过滤。
- **语种分布**（按 Wikipedia 文字系统分类）：Latin 53.69%｜Cyrillic 17.45%｜其余含 Arabic、Chinese、及 Other（希腊/希伯来/格鲁吉亚等）5.37%——非拉丁脚本合计近半。

## 三大贡献
1. **最大语言规模**：首个 149 语种文档解析基准，远超以往，对齐当前 SOTA 模型的语言宣称。
2. **扩展结构评测**：除文本/表/公式外，纳入 **code block、catalog**（长尾场景天然稀疏但反映真实复杂度）。
3. **详尽横评**：对现有先进模型全面评测，建立长尾语言 baseline，验证基准区分力。

## 评测指标
- **Table**: TEDS（树编辑距离，评 HTML 结构完整性）。
- **Formula**: CDM（Character Detection Matching，渲染 LaTeX 成图做空间匹配）。
- 文本识别、公式、表格、code、catalog 分项，且分 **decoupled（人工版面 crop 后测识别）** 与 **layout-dependent（端到端，含版面检测/阅读顺序）** 两套。

## 关键结果（要核实数字均出自原文表）
- **总体（decoupled，Table 4）**：**HunyuanOCR 92.42** 居首，大幅超亚军 **PaddleOCR-VL 87.96**；Formula/Table/Code/Catalog 四项第一。通用 VLM（Qwen 系 83–84）落后，尤其结构解析。
- **文本识别（Table 6）**：HunyuanOCR 89.32 与 dots.ocr 89.06 领先接近；dots.ocr 拿下 Latin(97.83)/Other，HunyuanOCR 强在中文与梵文；PaddleOCR-VL 阿拉伯语最高(80.45)。Latin/中文近饱和(>94%)，**梵文最难(max 63.10)**。
- **6 大脚本总体（Table 5）**：HunyuanOCR 90.17 主导 5/6；dots.ocr 86.52 在长尾「Other」泛化最好(84.08)；Qwen3-VL-2B / PaddleOCR-VL 在此指标跌破 60%，暴露长尾泛化缺陷。
- **公式（Table 7）**：HunyuanOCR 一致性最好(avg 90.98)；PaddleOCR-VL 平均第三但拿最多单项第一(7 项)；DeepSeekOCR/MinerU2.5 波动大（DeepSeekOCR 威尔士语 100 却越南语 0）。
- **复杂脚本（梵文）**：需足够参数规模——Qwen3-VL-2B(70.69) 显著超 PaddleOCR-VL(63.27)，轻量 MinerU2.5 崩到 24.15。参数量是复杂脚本瓶颈。
- ⭐ **Layout-dependent 端到端（Table 12）**：加上版面约束后**全面暴跌**——HunyuanOCR 从 92.42 掉到 **76.08**。分项碎片化：dots.ocr 文本最强(88.46)、DeepSeekOCR 表格最强(78.32)、HunyuanOCR code 最强(97.07)。**专用模型端到端更抗跌**：dots.ocr 端到端 80.68 反超登顶。**复杂版面检测仍是首要瓶颈。**

## 对检测—识别组合系统的启示
- ⭐⭐⭐ **最强背书：decoupled 92.42 → layout-dependent 76.08 的 ~16 分暴跌，证明瓶颈在版面检测/阅读顺序，不在字符识别**——这说明强化版面检测与阅读顺序建模具有直接价值：识别（后端 AR）已近饱和，端到端天花板卡在「框对不对、读序对不对」。把前端 DETR 做强，直接补这块最大失分。
- ⭐⭐ **专用模型端到端更抗跌（dots.ocr 反超）** vs 通用 VLM decoupled 高但端到端塌——支持「专门优化版面+识别的结构化路线」优于「大通用 VLM 硬解」，即两段式/结构化建模的价值。
- ⭐⭐ **长尾语言 + 梵文等复杂脚本需要参数规模**：后端 AR 编码器容量不能太小，否则复杂脚本崩（MinerU2.5 24.15）；训练数据要覆盖长尾脚本的真实版面分布。
- ⭐ **评测方法论**：自己模型上线前应同时报 decoupled（隔离识别）+ layout-dependent（端到端，OmniDocBench quick match 协议）两套分，才不被 decoupled 的高分假象误导；表格用 TEDS、公式用 CDM。
- ⭐ **真实长尾数据构造**：仿 CCpdf 大规模爬 + 密度/结构筛 + 多模型出候选 + 人工精修，是低成本造多语种真实评测/训练集的可复用流程；保留真实结构稀疏性而非强制对齐。

## 相关
- 被评测模型：[[hunyuan-ocr]]、[[paddleocr-vl]]、[[mineru2.5]]、[[deepseek-ocr]]、dots.ocr（[[xiaohongshu]]）、Qwen3-VL、Gemini 3。
- 对比基准：[[omnidocbench]]（本文沿用其 quick match 协议做 layout-dependent 评测）、[[gdp-pdf-benchmark]]、[[ocr-vs-mllm-benchmark]]（同样把端到端真实条件当一等评测维度）。
