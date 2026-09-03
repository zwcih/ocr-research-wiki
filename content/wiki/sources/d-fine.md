---
type: source
title: D-FINE — 用细粒度分布精修重定义 DETR 框回归
sources: [d-fine]
tags:
  [
    object-detection,
    detr,
    real-time-detection,
    bbox-regression,
    distribution-refinement,
    self-distillation,
    localization,
    front-detr-relevant,
  ]
created: 2026-09-03
updated: 2026-09-03
---

# D-FINE — Fine-grained Distribution Refinement for DETR

📄 **原文**：[arXiv:2410.13842](https://arxiv.org/abs/2410.13842) · [PDF](https://arxiv.org/pdf/2410.13842) · [OpenReview](https://openreview.net/forum?id=MFZjrTFE7h) · [代码/权重](https://github.com/Peterande/D-FINE)

- **会议**：ICLR 2025 Spotlight
- **arXiv**：2410.13842v1（2024-10-17，cs.CV）
- **团队**：中国科学技术大学 + 合肥综合性国家科学中心人工智能研究院
- **作者**：Yansong Peng、Hebei Li、Peixi Wu、Yueyi Zhang、Xiaoyan Sun、Feng Wu

## 一句话

把 DETR 每层“直接回归四个确定坐标”改成“为上下左右四条边预测离散偏移分布，并逐层修 distribution logits”；再让最终层的精确分布反向蒸馏浅层，在几乎不增加推理成本的情况下显著提高定位精度。

## 问题：确定坐标不是好的框中间表示

普通检测器把边界表示为 `(x,y,w,h)`，或参考点到四条边的确定距离，相当于用 Dirac delta 描述边界。这种做法有三项不足：

1. **无法表达不确定性**：遮挡、模糊、小目标和低对比边缘不一定存在唯一清晰坐标；
2. **监督不够细**：L1/GIoU 主要约束完整框，难以细致指导每条边如何调整；
3. **层间知识难传递**：坐标只有一个数，不像 soft probability distribution 那样携带可蒸馏的定位结构。

GFocal/DFL 已用离散分布回归边距，但依赖 anchor、只做一次预测，且均匀 bin 对小幅精修仍偏粗。D-FINE 将 distribution regression 放进 anchor-free DETR，并让 decoder 各层迭代精修。

## FDR：Fine-grained Distribution Refinement

### 初始框与四条边分布

第一层通过普通 regression head 预测初始框

$$
b^0=\{x,y,W,H\},
$$

将其写成中心 $c^0=\{x,y\}$ 和到上、下、左、右的初始边距 $d^0=\{t,b,l,r\}$。同时，D-FINE head 为每条边输出 $N+1$ 个离散 offset bin 的概率。

第 $l$ 层的精修结果是：

$$
d^l=d^0+\{H,H,W,W\}\sum_{n=0}^{N}W(n)P_r^l(n).
$$

修正量按初始框的高/宽缩放，因此同一分布可以适配不同目标尺度。

### decoder 精修的是分布 logits

后续层不重新独立预测坐标，而是预测上一层 distribution logits 的残差：

$$
P_r^l(n)=\operatorname{Softmax}\left(\Delta logits^l(n)+logits^{l-1}(n)\right).
$$

这样每一层都围绕同一个初始框逐步收窄或移动四条边分布，形成可解释的“粗定位 → 细定位”轨迹。

### 非均匀映射：近处精、远处跨度大

$W(n)$ 不是普通线性等距 bin：

- 中心附近曲率小、bin 更细，初始框已经较准时可以做微小边缘调整；
- 两端变化更陡，初始框偏得较远时仍能产生大修正。

消融中 $N=32$ 最好；从 32 增到 64/128 不再提升。固定映射参数优于将其设为可学习参数，说明一个稳定的 residual coordinate system 比额外自由度更容易优化。

### FGL：直接监督边界分布

Fine-Grained Localization Loss 将 GT 相对初始框的 offset 映射到相邻两个 bin，按距离线性插值计算 CE，并乘预测框 IoU。除传统 L1/IoU loss 外，每层因此获得“每条边的概率质量该移向哪里”的显式监督；高 IoU 样本会被鼓励形成更集中、更确定的分布。

## GO-LSD：Global Optimal Localization Self-Distillation

最终 decoder layer 通常包含最精确的定位分布，GO-LSD 将其作为在线 teacher 蒸馏给前面各层，不需要训练额外教师模型。

### 为什么不能只按最终层匹配蒸馏

DETR 的 Hungarian matching 在不同 decoder layer 间可能变化：某个 query 在浅层定位很好但分类分数低，未必出现在最终层的一对一匹配中。GO-LSD 因此：

1. 每层分别执行 Hungarian matching；
2. 合并所有层的 matching index，形成 union set；
3. 最终层分布通过 KL 蒸馏到前 $L-1$ 层；
4. 分类仍保持严格 one-to-one，避免产生重复框。

### DDF：匹配和未匹配 query 分开加权

Decoupled Distillation Focal Loss 对两组 query 使用不同权重：

- matched prediction 按 IoU 加权，保留“低分类置信度但框很准”的定位知识；
- unmatched prediction 按分类 confidence 加权；
- 再按 matched/unmatched 数量归一，避免数量悬殊的一组支配 loss。

论文使用 temperature $T=5$ 时最好。它形成双向协同：最终层教浅层更早定位准确；浅层变准后，深层只需修更小 residual，最终 teacher 自身也继续改善。

## 结果

### 可插入多种 DETR

COCO val2017、相同训练周期下加入 FDR + GO-LSD：

| 模型                      | 原始 AP | 加入后 AP | 增益 |
| ------------------------- | ------: | --------: | ---: |
| Deformable DETR，12 epoch |    43.7 |      47.1 | +3.4 |
| DAB-DETR，12 epoch        |    44.2 |      49.5 | +5.3 |
| DN-DETR，12 epoch         |    46.0 |      49.7 | +3.7 |
| DINO，12 epoch            |    49.0 |      51.6 | +2.6 |
| DINO，24 epoch            |    50.4 |      52.4 | +2.0 |

参数量和推理计算基本不变，说明主要增益来自定位表示和训练信号，而不是扩大模型。

### 完整实时检测器

在 COCO val2017、TensorRT FP16、NVIDIA T4、batch size 1 条件下：

- **D-FINE-L**：31M 参数 / 91 GFLOPs / 8.07 ms（约 124 FPS）/ **54.0 AP**；
- **D-FINE-X**：62M / 202 GFLOPs / 12.89 ms（约 78 FPS）/ **55.8 AP**；
- Objects365 预训练后，论文版本分别达到 **57.1 / 59.3 AP**。

完整 D-FINE 还对 RT-DETR 做了轻量化：移除 decoder projection、加入 Target Gating、用 GELAN 并减半 hidden dimension、按尺度不均匀分配 sampling point，并采用 RT-DETRv2 训练策略。相对 RT-DETR-HGNetv2-L baseline，最终 AP 53.0→54.0，同时延迟降 13%、GFLOPs 降 17%。因此“更快”不来自 FDR 本身，而来自轻量化；FDR/GO-LSD 用来补回并超过轻量化损失。

### 蒸馏消融

在不做轻量化、专门比较蒸馏时：

- baseline：53.0 AP；
- Logit Mimicking：52.6；
- Feature Imitation：52.9；
- FDR：53.8；
- vanilla Localization Distillation：53.7；
- **GO-LSD：54.5**。

GO-LSD 相对 baseline 每 epoch 训练时间约增加 6%，显存约增加 2%；推理时不需要 teacher。

## 对 OCR 文本检测前端的启示

- ⭐⭐⭐ **细长文字框尤其需要 per-edge refinement。** 上下边界几像素偏差就可能切掉笔画或混入邻行；FDR 将四条边独立建模，比直接回归 `(x,y,w,h)` 更符合文本框误差结构。
- ⭐⭐⭐ **可直接作为 DINO 前端的定位头候选。** 论文已验证 DINO 12/24 epoch 分别 +2.6/+2.0 COCO AP；object query、Hungarian matching、NMS-free set prediction 和 [[deformable-detr|deformable attention]] 都可保留。
- ⭐⭐ **分布本身可成为检测→AR 的不确定性接口。** 这是迁移设想、并非论文实验：分布宽时给后端扩大 crop 或保留更多边缘视觉 token，分布尖锐时使用紧框；比只传最终坐标多一层可靠性信息。
- ⭐⭐ **GO-LSD 适合稳定多层 query 定位。** 文档密集小目标下 layer-wise matching 更容易抖动，union matching 能保留“分类暂弱、定位已好”的 query，而不是过早丢掉其监督。
- ⭐ **旋转框、多边形与 mask 仍需重新设计。** 论文只验证轴对齐 bbox；把 FDR 扩展为角度分布、四点坐标或 polygon 控制点分布是合理研究方向，但不是已有结论。

## 在目标系统中的位置

建议技术栈可写成：

```text
DINO / Deformable DETR
  + D-FINE FDR 定位头与 GO-LSD
  + RT-DocLayout 的 mask / reading-order head
  + Parser-Oriented Refinement 的 retention / ordering interface
  → 后端 AR
```

D-FINE 负责把框修准；[[rt-doclayout]] 负责 mask 和阅读顺序；[[parser-oriented-refinement]] 则建立在 D-FINE-L 上，继续解决哪些 query 存活、如何有序交给后端的问题。三者是连续关系，不是替代关系。

## 局限与使用边界

- 论文只在通用目标检测 COCO/Objects365 上验证，没有文本检测或文档版面专项实验；对 OCR 的收益需要单独实验。
- FDR 仍以初始轴对齐框和四边距离为基础；严重弯曲文字、任意形状文本不能只靠它解决。
- Objects365 预训练结果不能与纯 COCO 训练结果混比；官方仓库也提示相关 checkpoint 的商用许可需服从 Objects365 数据条款。

## 关联

- 技术前序：[[detr]]、[[deformable-detr]]、[[dino-detr]]、[[loss-functions]]。
- 文档检测落地：[[rt-doclayout]]、[[parser-oriented-refinement]]。
- 困难文本的定位—识别联合监督：[[armorocr]]。
