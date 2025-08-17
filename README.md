# Animated Algorithm Guide

一个交互式的算法学习平台，通过动画演示和详细说明帮助理解各种算法的工作原理。

## 项目简介

本项目旨在通过可视化的方式展示各种算法的工作过程，帮助学习者更直观地理解算法的原理和执行流程。每个算法都配备了：

- 详细的文字说明
- 代码实现（Python和Java）
- 动画演示
- 实例分析
- 练习题

## 当前实现的算法

### 排序算法
- 冒泡排序 (Bubble Sort)
- 快速排序 (Quick Sort)
- 归并排序 (Merge Sort)
- 堆排序 (Heap Sort)

更多算法正在持续添加中...

## 技术栈

- MkDocs：文档网站框架
- Python：算法实现
- Java：算法实现
- JavaScript：动画效果
- HTML/CSS：页面样式

## 安装和使用

1. 克隆仓库
```bash
git clone https://github.com/daichangya/animated-algorithm-guide.git
cd animated-algorithm-guide
```

2. 安装依赖
```bash
pip install mkdocs
pip install mkdocs-material
```

3. 本地运行
```bash
mkdocs serve
```

4. 访问网站
打开浏览器访问 `http://127.0.0.1:8000`

## 项目结构

```
animated-algorithm-guide/
├── docs/                    # 文档目录
│   ├── index.md            # 首页
│   └── sorting/            # 排序算法
│       ├── bubble-sort.md
│       ├── quick-sort.md
│       ├── merge-sort.md
│       └── heap-sort.md
├── mkdocs.yml              # MkDocs配置文件
└── README.md              # 项目说明
```

## 如何贡献

我们欢迎任何形式的贡献，包括但不限于：

1. 添加新的算法
2. 改进现有算法的解释
3. 优化动画效果
4. 修复错误
5. 改进文档

贡献步骤：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详细信息

## 联系方式

如果你有任何问题或建议，欢迎通过以下方式联系我们：

- 提交 Issue
- 发送 Pull Request
- 通过 Email 联系

## 致谢

感谢所有为这个项目做出贡献的开发者们！
