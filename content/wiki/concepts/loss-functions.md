---
type: concept
title: "Loss Functions 损失函数专题"
sources: [vit, ctc]
tags: [loss, training, detection, ocr, foundation]
created: 2026-08-06
updated: 2026-08-06
---
# 损失函数专题（Loss Functions）

## 一、定义与本质
**损失函数（loss function）** 衡量预测 $\hat y$ 与真值 $y$ 的差距，是可微标量 $L(\hat y, y)$。训练本质是用梯度下降最小化训练集上损失的期望：

$$\theta^* = \arg\min_\theta \mathbb{E}_{(x,y)}[ L(f_\theta(x), y) ]$$

损失的选择由任务性质（分类/回归/检测/序列生成）与数据特性（是否不平衡、含噪）共同决定，直接影响梯度形态与收敛行为。

## 二、分类损失
### Cross-Entropy / NLL
logits 经 **softmax** 得 $p_i = e^{z_i}/\sum_j e^{z_j}$，对 one-hot 真值 $y$：

$$L_{CE} = -\sum_i y_i \cdot \log p_i = -\log p_y$$

等价于负对数似然（**NLL**）。语言模型与 **AR 自回归生成** 中逐 token 求和：

$$L = -\sum_{t=1}^T \log p_\theta(y_t | y_{<t}, x)$$

这也是 OCR 后端 AR 解码器的默认训练目标。

### Label Smoothing
硬 one-hot 软化为 $y_i' = (1-\epsilon)y_i + \epsilon/K$（$K$ 类别数），缓解过度自信、改善校准与泛化，Transformer 类常取 $\epsilon=0.1$。

## 三、回归损失
- **MSE（L2）**：$(\hat y - y)^2$，对大误差敏感，易被离群点主导。
- **L1（MAE）**：$|\hat y - y|$，对离群点鲁棒，但零点不可导。
- **Smooth L1 / Huber**：误差小用 L2、大用 L1：

$$L_\delta = \begin{cases} \frac{1}{2}(\hat y - y)^2 & \text{if } |\hat y - y| < \delta \\ \delta(|\hat y - y| - \frac{1}{2}\delta) & \text{else} \end{cases}$$

  广泛用于检测框坐标回归。

## 四、检测损失（重点）
### IoU 系列 loss
直接以交并比优化框，比逐坐标回归更贴合评测指标。
- **IoU loss**：1−IoU，但两框不相交时梯度消失。
- **GIoU**：引入最小闭包框惩罚，解决不相交问题。
- **DIoU**：加中心点距离项，收敛更快。
- **CIoU**：DIoU 基础上再加长宽比一致性项，综合最优。

### Focal Loss
解决前景/背景 **类别不平衡**，在 CE 上加调制因子压低易分样本：

$$L_{FL} = -\alpha_t \cdot (1-p_t)^\gamma \cdot \log p_t$$

$\gamma$（常取 2）使模型聚焦难样本。

### DETR：Set Prediction + 匈牙利匹配
DETR 将检测视为 **集合预测（set prediction）**，输出固定数量框，无需 NMS。训练用 **匈牙利算法（Hungarian）** 求预测与真值的最优 **二分匹配（bipartite matching）**：

$$\hat\sigma = \arg\min_\sigma \sum_i L_{match}(y_i, \hat y_{\sigma(i)})$$

匹配代价综合类别概率与框相似度；匹配确定后对配对样本计算分类 CE + 框损失（L1 + GIoU），未匹配预测监督为「no object」。前端检测即基于此范式（backbone 常用 [[vit|ViT]]）。

## 五、序列 / AR 生成损失
AR 生成在 **teacher forcing** 下训练：解码每步以真值前缀 $y_{<t}$ 为输入，对当前 token 算**逐 token 交叉熵**（即第二节 AR 目标）。训练高效，但有训练/推理暴露偏差（exposure bias）。无对齐标注的序列（部分 OCR 场景）可改用 [[ctc]] 损失做端到端对齐。

## 六、关联
- 表示学习的对比损失 **InfoNCE** 见 [[contrastive-learning]]
- 无显式对齐的序列识别见 [[ctc]]
- 检测/识别 backbone 见 [[vit]]
