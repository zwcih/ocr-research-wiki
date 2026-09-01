---
type: source
title: "Denoising Diffusion Probabilistic Models (DDPM)"
authors: [Ho, Jain, Abbeel (UC Berkeley)]
year: 2020
venue: NeurIPS 2020
arxiv: "2006.11239"
sources: [ddpm]
tags: [generative, diffusion, cv, milestone]
created: 2026-07-23
updated: 2026-07-23
reading: deep
---
# DDPM (2020) — 深度精读

📄 **原文**：[arXiv:2006.11239](https://arxiv.org/abs/2006.11239) · [PDF](https://arxiv.org/pdf/2006.11239)

> 里程碑 ⭐ — 现代扩散生成模型的奠基作，Stable Diffusion/DALL-E 的理论源头。

## 一句话定位
定义一个逐步**加噪**（前向马尔可夫链）再学习**去噪**（反向链）的过程，从纯高斯噪声
逐步生成高质量图像。

## 核心贡献与机制
1. **前向过程**：对图像逐步加高斯噪声共 T 步，最终变纯噪声；可解析地一步采样到任意 t
2. **反向过程**：训练神经网络（U-Net）预测每步噪声，逐步去噪还原
3. **简化训练目标**：推导出与 denoising score matching / Langevin dynamics 的联系，
   最终目标简化为**预测噪声 ε 的加权 MSE**（简单稳定）
4. 可解释为渐进式有损解压缩 / 自回归解码的推广

## 关键结果
- 无条件 CIFAR-10 达 **FID 3.17**（当时 SOTA），Inception score 9.46
- 生成质量与稳定性超过同期 GAN（无模式崩溃、训练稳）

## 为什么是里程碑
- 奠定扩散模型范式，引爆后续文生图（Stable Diffusion、DALL-E 2、Imagen）
- 提供比 GAN 更稳定的高质量生成路线

## 关联
- 主干网络常用 [[unet]]；后续多模态生成、文档图像合成/增强的潜在工具
- 与 [[clip]]（文生图的文本引导）常组合使用
