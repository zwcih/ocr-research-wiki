---
type: index
title: Index — 内容目录
updated: 2026-09-02
---

# Index — 内容目录

导航入口。查询时先读这里定位相关页。共 81 篇 source（里程碑论文 + 前沿工作）。

> 📄 每篇 source 页标题下有**原文链接**（arXiv、DOI 或官方页面），可一键跳转。

## Sources — 基础 / 架构
- [[attention-is-all-you-need]] — Transformer，纯注意力，现代大模型祖先（2017）⭐
- [[resnet-deep-residual-learning]] — 残差连接，极深网络可训（2015）⭐

## Sources — 计算机视觉
- [[alexnet]] — 点燃深度学习的 ImageNet 冠军（2012）⭐
- [[vgg]] — 3×3 小卷积堆叠，经典 backbone（2014）
- [[googlenet]] — Inception 模块 + 1×1 卷积（2014）
- [[faster-rcnn]] — 两阶段检测基石，RPN（2015）
- [[yolo]] — 单阶段实时检测开山（2015）
- [[unet]] — 编码解码+skip，分割经典（2015）
- [[mask-rcnn]] — 实例分割统一框架（2017）

## Sources — DETR 系检测
- [[detr]] — 集合预测 + 二分匹配 + object query，去 anchor/NMS 开山（2020）⭐
- [[deformable-detr]] — 可变形注意力 + 多尺度，治慢收敛/小目标（2020）⭐
- [[dino-detr]] — 对比去噪 + 混合query选择，DETR系 SOTA 拐点（2022）⭐
- [[rt-doclayout]] — 百度 33M RT-DETR，单query一次前向出 分类/框/像素mask/阅读顺序，92.46/132.1FPS（2026）⭐⭐⭐ 前端最新实现
- [[parser-oriented-refinement]] — D-FINE上加结构精修，NMS-free retention+共享排序稳定「检测→解析器」界面（2026）⭐⭐⭐
- [[vit]] — Vision Transformer，统一 CV/NLP（2020）⭐
- [[clip]] — 图文对比，零样本多模态（2021）⭐
- [[mae]] — 视觉自监督的 BERT 时刻（2021）
- [[beit]] — 图像版 BERT，MIM 开山（预测 visual token，2021）
- [[simmim]] — 最简 MIM（直接回归像素，2021）
- [[dae]] — 去噪自编码器，denoising 信号源头（ICML 2008）
- [[ddpm]] — 扩散生成模型奠基（2020）⭐

## Sources — 语言模型 / LLM
- [[word2vec]] — 词向量时代开端（2013）
- [[seq2seq]] — 编码解码框架确立（2014）
- [[bert]] — 双向预训练，横扫 NLP（2018）⭐
- [[gpt3]] — few-shot / in-context learning（2020）⭐
- [[t5]] — text-to-text 统一框架（2019）
- [[instructgpt]] — RLHF 对齐，ChatGPT 前身（2022）⭐
- [[llama]] — 开源基础模型起点（2023）⭐
- [[chinchilla]] — 修正 scaling law（2022）⭐
- [[textbooks-are-all-you-need]] — phi-1，数据质量优先（2023）⭐
- [[phi4-mini]] — 微软 Phi-4-Mini/Multimodal，Mixture-of-LoRAs（2025）（深读）
- [[qwen3]] — 阿里 Qwen3，thinking双模统一 + thinking budget（2025）⭐（深读）
- [[qwen3.5-omni]] — 阿里原生全模态 + omni agent + ARIA（2026）⭐（深读）

## Sources — OCR / 文档智能
- [[crnn]] — CNN+RNN+CTC，文本行识别经典（2015）⭐
- [[craft]] — 字符区域感知文本检测（2019）
- [[armorocr]] — 困难视觉文本的定位/识别/spotting 四任务联合强化；AdvSpot 区域级基准（2026）⭐⭐⭐
- [[seqclr]] — 首个文本识别自监督对比学习，序列级 instance-mapping（CVPR 2021）⭐
- [[dig]] — ⭐⭐ 对比+MIM 双分支文本识别自监督（“读与写”，ACM MM 2022，encoder pretrain 直接参考）
- [[trocr]] — 纯 Transformer 端到端识别（2021）
- [[donut]] — OCR-free 文档理解（2021）⭐
- [[nougat]] — 学术 PDF→Markdown，擅公式（2023）
- [[layoutlmv3]] — 文档多模态预训练代表（2022）⭐
- [[dit]] — 文档图像自监督 backbone（2022）
- [[pix2struct]] — 截图解析预训练 VLM（2022）
- [[got-ocr2]] — 统一端到端 OCR-2.0（2024）⭐
- [[deepseek-ocr]] — 光学上下文压缩（2024）⭐
- [[layoutlite]] — 元蓝科技/北师大，即插即用 token 级隐式版面分析，Conv1D 判信息量+GRPO 免标注训练，50% 视觉token压缩几乎不掉分、prefill/FLOPs/KV降40%+（2026）⭐⭐
- [[scver]] — AR 每步按 hidden state 从压缩前高分辨率特征做 deformable 检索；低分辨率近无损（2026）⭐⭐⭐
- [[unlimited-ocr]] — 百度 R-SWA 恒定 KV cache，32K 上下文单次解析几十页，OmniDocBench v1.5 93%（2026）⭐⭐
- [[monkeyocr-v2]] — 视觉重建路线 + 文档原生底座，MonkeyDoc v2 1.13亿图像（2026）⭐
- [[ovis-ocr2]] — 阿里 0.8B 端到端，OmniDocBench SOTA 96.58（2026）⭐
- [[glm-ocr]] — 智谱 0.9B，Multi-Token Prediction 加速解码（2026）
- [[lai-ade-gen2]] — LandingAI ADE Gen2 / DPT-3，商业文档抽取（2026）
- [[lai-signatures-stamps-seals]] — ADE 签名/印章/钢印检测（2026）
- [[gdp-pdf-benchmark]] — 专业 PDF grounded 推理基准，最好模型仅 30.7%（2026）⭐
- [[more-benchmark]] — 腾讯 149 语种多语言文档解析基准，含 code/catalog；decoupled→layout-dependent 暴跌16分证瓶颈在版面/阅读序（2026）⭐
- [[ocr-vs-mllm-benchmark]] — ⭐ 传统OCR/商业云/商业LLM/开源LLM 16系统横评，首把延迟+成本设为一等维度；无单一范式全胜，结构化靠OCR、手写靠LLM（IPM 2027）

## Sources — OmniDocBench leaderboard 上的 specialist 模型（⭐ 直接竞品/参考，2025-2026）
### 两段解耦（检测→识别，和此类 OCR 架构同构）
- [[paddleocr-vl]] — 百度 0.9B，NaViT 编码器+ERNIE-0.3B，layout→元素识别
- [[mineru2.5]] — 上海AI Lab 1.2B，降采样做 layout + 原分辨率 crop 做识别（解耦最彻底）⭐
- [[mineru2.5-pro]] — 架构不变，纯数据/训练驱动 +2.71 分打过 200× 大模型（2026）⭐
- [[dolphin]] — 字节 analyze-then-parse，异构锦点提示 + 元素并行解析⭐
- [[dolphin-v2]] — 细粒度 21 类 + 拍摄文档 + 绝对像素坐标（2026）
- [[youtu-parsing]] — 腾讯优图，token并行+query并行解码，5-11× 加速（2026）⭐⭐
### 单模型端到端 / 统一
- [[hpd-parsing]] — 百度 1B，层次并行解码(layout主分支fork并发content分支)+P-MTP，OmniDocBench v1.6 SOTA 94.91 / 4752 TPS（2026）⭐⭐⭐ DETR框直接当fork点
- [[dots-ocr]] — 小红书 1.7B，单 VLM 联合 layout+识别+关系（两段式的反方对照）
- [[hunyuan-ocr]] — 腾讯 1B，统一感知+语义（spotting/parsing/IE/翻译）
- [[qianfan-ocr]] — 百度千帆 4B，Layout-as-Thought 可选思考先出结构（2026）⭐
- [[ocrverse]] — holistic OCR，文本中心+视觉中心（图表/网页/科学图）统一（2026）
### 训练/数据/识别方法
- [[points-reader]] — 腾讯微信，无蒸馏 + 合成数据 + 迭代自改进(ISS)
- [[logics-parsing]] — 阿里，RL 优化复杂版面+阅读顺序，输出 HTML
- [[logics-parsing-v2]] — Omni 统一分类法 + evidence anchoring 证据锦定（2026）
- [[firered-ocr]] — 小红书，Format-Constrained GRPO 治结构幻觉（2026）⭐
- [[unirec-opendoc]] — 复旦 0.1B，层次监督 + 语义解耦 tokenizer（后端识别核心）⭐

## Sources — 手写文本生成 (HTG，造手写合成数据用)
- [[diffbrush]] — 行级手写生成，词间对齐/间距，行+词双判别器（最贴 HTR）⭐
- [[one-dm]] — 单样本模仿任意风格，高频风格抽取（门槛最低）
- [[diffusionpen]] — 5-shot，混合风格提取器，实证提升 HTR⭐
- [[mae-ldm-htg]] — MAE 风格条件 + 半监督适配未见数据集⭐
- [[stylusai]] — 跨语言风格迁移，打印体图像当内容锦点
- [[vatr]] — visual-archetype 字形编码，造罕见字（扩散前经典基线）

## Entities

### 机构 / 实验室
**海外**
- [[google-deepmind]] — Transformer/BERT/T5/ViT/Pix2Struct/Chinchilla 之源
- [[openai]] — CLIP/GPT-3/InstructGPT，生成式+RLHF 范式
- [[meta-fair]] — DETR/MAE/LLaMA/Nougat，检测式+生成式 OCR 双线源头
- [[microsoft-research]] — 文档智能重镇（LayoutLM/TrOCR/DiT/phi）
- [[idea]] — DINO-DETR，DETR 系检测核心
- [[sensetime]] — Deformable-DETR
- [[uc-berkeley]] — DDPM 扩散范式诞生地
- [[dfki]] — StylusAI（德国 AI 研究中心）
- [[univ-modena]] — VATR 手写生成（摩德纳大学）

**国内厂 / 实验室 / 高校**
- [[alibaba]] — Qwen/Ovis-OCR2/Logics-Parsing
- [[baidu]] — PaddleOCR-VL/Qianfan-OCR
- [[tencent]] — 混元/优图/微信 OCR 全布局
- [[bytedance]] — Dolphin 系锚点提示解析
- [[deepseek]] — DeepSeek-OCR 光学上下文压缩
- [[zhipu]] — GLM-OCR（智谱+清华）
- [[xiaohongshu]] — FireRed-OCR/dots.ocr
- [[shanghai-ai-lab]] — MinerU 系（OpenDataLab）
- [[hust]] — MonkeyOCR/CRNN（华中科技大学，白翔系）
- [[fudan-fvl]] — UniRec-OpenDoc（复旦）
- [[scut]] — DiffBrush/One-DM 手写生成（华南理工）
- [[kingsoft]] — MonkeyOCR 合作（金山）
- [[landingai]] — 商业文档智能 ADE 平台

### 人物 / 研究者
- [[kaiming-he]] 何恺明 — ResNet/R-CNN 系/MAE
- [[xiang-bai]] 白翔 — CRNN→MonkeyOCR，OCR 中坚
- [[furu-wei]] 韦福如 — MSRA 文档智能统领
- [[lei-cui]] 崔磊 — LayoutLM/TrOCR/DiT
- [[lukasz-blecher]] — Nougat 一作
- [[geewook-kim]] 金基旭 — Donut，OCR-free 开创
- [[youngmin-baek]] 白泳民 — CRAFT 文本检测
- [[kenton-lee]] — BERT/Pix2Struct
- [[ilya-sutskever]] — AlexNet/seq2seq/GPT
- [[ashish-vaswani]] — Transformer 一作
- [[alec-radford]] — CLIP/GPT 系
- [[geoffrey-hinton]] 辛顿 — 深度学习教父/AlexNet

## Concepts
- [[noisy-label-learning]] — 带噪/伪标签学习（突破软标签天花板）
- [[label-smoothing]] — 标签平滑（抗过度自信正则）
- [[adamw]] — AdamW（解耦权重衰减的 Adam）
- [[weight-decay]] — 正则化与 Weight Decay（L1/L2/AdamW 解耦）
- [[lr-schedule]] — 学习率调度（warmup/cosine/step）
- [[loss-functions]] — 损失函数专题（CE/回归/检测DETR+Focal/AR）
- [[weight-initialization]] — 参数初始化（Xavier/He）
- [[optimizer]] — Optimizer 优化器专题（SGD/Momentum/Adam/AdamW）
- [[muon]] — Muon（MomentUm Orthogonalized by Newton-Schulz，正交化更新，隐藏层2D矩阵专用）⭐
- [[normalization]] — Normalization 归一化专题（BN/LN/IN/GN）
- [[self-attention]] / [[cross-attention]] / [[multi-head-attention]] / [[scaled-dot-product-attention]] — 注意力机制
- [[denoise]] — 去噪（信号还原 + 扩散模型核心）
- [[residual-connection]] — 残差/跳跃连接
- [[relu]] — ReLU 修正线性单元（非饱和激活）
- [[dropout]] — Dropout 随机失活（正则/抗过拟合）
- [[gelu]] — GELU 高斯误差线性单元（Transformer 主流激活）
- [[data-quality-over-scale]] — 数据质量优先
- [[mixture-of-loras]] — 模态 LoRA 混合（冻结底座接多模态）
- [[moe]] — Mixture-of-Experts 专家混合
- [[ctc]] — 序列无对齐解码
- [[contrastive-learning]] — 对比学习/自监督表示（SimCLR/MoCo 脉络）
- [[mim]] — 掩码图像建模（BEiT/SimMIM/MAE 三种做法）
- [[instance-mapping]] — 序列对比的实例映射（All/Window/Frame-to-instance）
- [[omnidocbench]] — 文档解析基准
- [[visual-token-compression]] — 视觉 token 压缩（削减喂后端解码器的视觉token，提速降KV；FastV/DeepSeek-OCR/LayoutLite）
- [[speculative-decoding]] — 投机解码（draft+并行验证减串行步）；另见免训练区块版 [[hsd]]
- [[progressive-multi-token-prediction]] — P-MTP，渐进加权多token预测
- [[fca]] — Flexible Character Accuracy，阅读顺序无关的字符精度；FCA-CA gap 诊断阅读序 vs 字符误识

## Synthesis（综合分析）
- [[ocr-evolution]] — 端到端 OCR/文档解析演进史（OCR-1.0→2.0 三个时代）
- [[visual-compression-vs-reconstruction]] — 视觉压缩 vs 视觉重建路线之争
- [[synthetic-data-for-ocr]] — ⭐ 合成数据方法专题（source-of-truth / 难样本驱动 / agent 多样化）
- [[handwriting-synthesis]] — ⭐ 手写文本合成(HTG)专题（扩散模型 / 风格控制 / 行级生成）
- [[citation-graph]] — ⭐ 引用关系图谱：按被引次数排序，一眼看哪些文章最重要（2026-07-25）
- [[label-efficient-ocr]] — ⭐ 降低标注依赖的五条路径（自监督对比/合成预训/迁移权重/真实合成/HTG），对前端DETR+后端AR 的叠加 pipeline（2026-07-29）

## Comparisons（对比）
- [[e2e-ocr-comparison]] — 端到端 OCR 模型横评（参数/创新/评测表）

## Queries（问答归档）
_（空）_