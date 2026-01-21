# Animated Algorithm Guide | 算法可视化学习平台

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Website](https://img.shields.io/badge/Website-algo.jsdiff.com-green)](https://algo.jsdiff.com)

Welcome to the Algorithm Visualization Learning Platform! This platform helps you deeply understand algorithm principles through interactive animations.

欢迎来到算法可视化学习平台！通过交互式动画深入理解经典算法的工作原理。

🌐 **Live Demo / 在线演示**: [algo.jsdiff.com](https://algo.jsdiff.com)

## Features | 特性

- 🎬 **Smooth Animations** - Carefully designed CSS animations for clear visualization
- 🎮 **Interactive Controls** - Pause, reset, and customize input data
- 📚 **Detailed Explanations** - Principles, complexity analysis, and real-world applications
- 🌍 **Internationalization** - Full support for Chinese and English (static generation)
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🚀 **Zero Dependencies** - Pure HTML/CSS/JavaScript, no frameworks required
- 🌙 **Dark Mode** - Eye-friendly dark theme design

## Algorithms | 算法列表

### Sorting Algorithms | 排序算法 (4)
- **Bubble Sort** | 冒泡排序 - O(n²)
- **Heap Sort** | 堆排序 - O(n log n)
- **Quick Sort** | 快速排序 - O(n log n)
- **Merge Sort** | 归并排序 - O(n log n)

### String Algorithms | 字符串算法 (3)
- **Myers Diff** | Myers差异算法 - O((N+M)D)
- **LCS** | 最长公共子序列 - O(MN)
- **KMP** | KMP字符串匹配 - O(N+M)

### Graph Algorithms | 图算法 (3)
- **Dijkstra** | Dijkstra最短路径 - O((V+E)logV)
- **BFS/DFS** | 广度/深度优先搜索 - O(V+E)
- **A\*** | A*寻路算法 - O(E)

### Search & Optimization | 搜索与优化 (2)
- **Binary Search** | 二分查找 - O(log n)
- **0/1 Knapsack** | 0/1背包问题 - O(NW)

### Computational Geometry | 计算几何 (1)
- **Convex Hull** | 凸包算法 (Graham Scan) - O(n log n)

## Tech Stack | 技术栈

- HTML5
- CSS3 (Animations, Flexbox, Grid)
- JavaScript (ES6+ Modules)
- SVG / Canvas for visualizations

## Project Structure | 项目结构

```
├── index.html              # Homepage | 首页
├── common/                 # Shared resources | 公共资源
│   ├── styles.css         # Global styles | 全局样式
│   ├── i18n.js            # Internationalization core | 国际化核心
│   └── lang/              
│       └── translations.js # Chinese-English dictionary | 中英文翻译字典
├── sorting/               # Sorting algorithms | 排序算法
├── sequence/              # String algorithms | 字符串算法
├── graph/                 # Graph algorithms | 图算法
├── search/                # Search & optimization | 搜索优化
├── geometry/              # Computational geometry | 计算几何
└── docs/                  # Documentation | 文档
    └── auto-i18n-architecture.md  # i18n architecture docs | i18n架构文档
```

## Internationalization | 国际化

This project uses a **static generation** approach for i18n:

- HTML source is written in Chinese (default language)
- English version is pre-built to `/en/` directory via `npm run build:en`
- Language switching redirects between `/` (Chinese) and `/en/` (English)
- Each language version has its own SEO-friendly URLs with proper hreflang tags

### Adding Translations | 添加翻译

Simply edit `common/lang/translations.js`:

```javascript
'新的中文文本': 'New English text',
```

For detailed architecture, see [docs/auto-i18n-architecture.md](docs/auto-i18n-architecture.md).

## Local Development | 本地开发

Simply serve the files with any static file server:

```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx serve

# Using PHP
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

## Contributing | 贡献

Contributions are welcome! Feel free to:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### i18n Contribution Checklist

When adding new content:

- [ ] Add Chinese text in HTML (default)
- [ ] Add translation entry in `common/lang/translations.js`
- [ ] Test language switching on your changes

## License | 许可证

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author | 作者

Built with ❤️ for algorithm learners everywhere.

---

If you find this project helpful, please give it a ⭐!

如果这个项目对你有帮助，请点个 ⭐ 支持一下！
