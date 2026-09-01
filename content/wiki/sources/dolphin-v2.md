---
type: source
title: "Dolphin-v2: Scalable Anchor Prompting for Document Parsing"
authors: [ByteDance]
year: 2026
arxiv: "2602.05384"
sources: [dolphin-v2]
tags: [ocr, document-parsing, anchor-prompting, photographed-docs, fine-grained-detection, hybrid-parsing, frontend]
reading: deep
created: 2026-07-23
updated: 2026-07-23
---

# Dolphin-v2 — 可扩展锚点提示（字节，2026）

📄 **原文**：[arXiv:2602.05384](https://arxiv.org/abs/2602.05384) · [PDF](https://arxiv.org/pdf/2602.05384)

> ⭐ 治了 v1 两个坑：① 只能处理数字文档 → 支持**拍摄/畸变文档**；② 轴对齐框不够 → **绝对像素坐标 + 21 类元素**。对检测前端检测的鲁棒性设计很有参考。

## 一句话
延续 [[dolphin]] 的 anchor prompting，两阶段升级：第一阶段做**更细粒度元素检测（21 类）
+ 阅读顺序 + 语义属性抽取**（如作者信息）；第二阶段**混合解析策略**——数字文档/拍摄文档区别对待，
用**绝对像素坐标**处理畸变，元素级并行。

## 相比 v1 的关键改进
- **通用文档**：不只数字 PDF，拍摄/扫描/畸变文档也行（两阶段做文档类型感知）。
- **绝对像素坐标**取代轴对齐 bbox：能表达旋转/透视畸变下的元素位置（拍摄文档必需）。
- **21 类细粒度元素** + 语义属性（author 等）：检测粒度更细，直接出结构化属性。
- **hybrid parsing**：按文档类型切换解析策略。
- **anchor 框架天然可扩展新元素类型**。

## ⭐ 给检测前端 DETR 的可复用设计
- **别用轴对齐 bbox**：真实文档（拍摄/扫描）有旋转透视，检测前端 DETR 应支持**旋转框/四点坐标/
  绝对像素**，否则畸变文档检测垮。DETR query 出多点坐标比出 (x,y,w,h) 更通用。
- **细粒度类别 + 语义属性**：检测阶段就多分类（21 类）并顺带抽属性，减轻后端负担。
- **文档类型感知**：前端可先判文档类型（数字/拍摄）再分流不同处理，鲁棒性大增。
- **anchor 框架可扩展**：新元素类型只加 prompt/类别，不重训整体——设计前端时预留这种扩展性。

## 关联
- 前身：[[dolphin]]
- 同细粒度检测思路：[[mineru2.5]]
- 前端骨架：[[dino-detr]]（旋转框/多点可在 query 头部扩展）
- 基准：[[omnidocbench]]
