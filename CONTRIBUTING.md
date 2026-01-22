# 贡献指南 | Contributing Guide

感谢您对算法可视化项目的兴趣！本指南将帮助您了解如何参与贡献。

Thank you for your interest in the Algorithm Visualization project! This guide will help you get started with contributing.

## 目录 | Table of Contents

- [本地开发](#本地开发--local-development)
- [项目结构](#项目结构--project-structure)
- [添加新算法](#添加新算法--adding-new-algorithms)
- [添加翻译](#添加翻译--adding-translations)
- [代码规范](#代码规范--code-standards)
- [提交 PR](#提交-pr--submitting-prs)

---

## 本地开发 | Local Development

### 克隆仓库

```bash
git clone https://github.com/daichangya/animated-algorithm-guide.git
cd animated-algorithm-guide
```

### 启动本地服务器

```bash
# Python
python -m http.server 8080

# Node.js
npx serve

# PHP
php -S localhost:8080
```

访问 `http://localhost:8080`

---

## 项目结构 | Project Structure

```
├── index.html              # 首页
├── 404.html                # 404 错误页面
├── common/                 # 公共资源
│   ├── styles.css         # 全局样式
│   ├── algo-components.css # 算法页面公共组件样式
│   ├── header.js          # 页头组件（含面包屑导航）
│   ├── i18n.js            # 国际化核心
│   └── lang/translations/ # 翻译文件（按模块拆分）
├── sorting/               # 排序算法
├── sequence/              # 字符串算法
├── graph/                 # 图算法
├── search/                # 搜索算法
├── geometry/              # 计算几何
├── data-structure/        # 数据结构（B树、B+树、跳跃表）
├── en/                    # 英文版（构建生成）
└── scripts/
    ├── build-en.js        # 英文版构建脚本
    ├── build-sitemap.js   # Sitemap 生成脚本
    ├── new-algorithm.js   # 新算法脚手架工具
    └── templates/         # 脚手架模板文件
```

---

## 添加新算法 | Adding New Algorithms

### 方式一：使用脚手架工具（推荐）

```bash
node scripts/new-algorithm.js
```

交互式创建新算法页面，自动：
- 创建目录和基础文件
- 更新 `build-en.js` 配置
- 更新 `sitemap.xml`

### 方式二：手动创建

#### 步骤 1: 创建目录和文件

```bash
mkdir -p <category>/<algorithm-name>
```

| 文件 | 说明 |
|------|------|
| `index.html` | 页面结构 |
| `style.css` | 页面专有样式 |
| `script.js` | 动画逻辑 |

#### 步骤 2: HTML 结构要求

```html
<!-- body 必须添加 algo-page 类 -->
<body class="bg-decoration algo-page">

<!-- 引入公共组件样式 -->
<link rel="stylesheet" href="/common/algo-components.css">
<link rel="stylesheet" href="style.css">

<!-- 静态文本使用 data-en 属性 -->
<h1 data-en="Algorithm Name">算法名称</h1>
<button data-en="Start">开始</button>
```

#### 步骤 3: 更新首页

在 `index.html` 添加算法卡片。

#### 步骤 4: 添加翻译

在 `common/lang/translations/` 相应模块添加动态文本翻译。

#### 步骤 5: 构建并测试

```bash
npm run build:en
```

---

## 添加翻译 | Adding Translations

翻译文件位于 `common/lang/translations/` 目录，按模块组织：

| 文件 | 内容 |
|------|------|
| `common.js` | 通用 UI 文本 |
| `sorting.js` | 排序算法相关 |
| `sequence.js` | 字符串算法相关 |
| `graph.js` | 图算法相关 |
| `search.js` | 搜索算法相关 |
| `geometry.js` | 几何算法相关 |
| `data-structure.js` | 数据结构相关 |
| `dynamic.js` | 动态文本模板 |

### 动态文本翻译

```javascript
// 使用占位符
'排序完成！比较次数: {0}': 'Sorting complete! Comparisons: {0}'

// JS 中调用
window.I18n.t('排序完成！比较次数: {0}', count)
```

### 构建英文版

```bash
npm run build:en
```

---

## 代码规范 | Code Standards

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 目录 | 小写+连字符 | `bubble-sort/` |
| CSS 类 | 小写+连字符 | `.algorithm-card` |
| JS 变量 | 驼峰 | `isPaused` |

### CSS 架构

项目采用分层 CSS 架构：

| 文件 | 作用 |
|------|------|
| `common/styles.css` | 全局基础样式、CSS 变量 |
| `common/algo-components.css` | 算法页面公共组件（控制面板、表格等） |
| `<algo>/style.css` | 算法专有样式（动画、特殊节点） |

**规则：**
- 公共组件样式不要重复定义在页面 `style.css`
- 页面 `style.css` 只写该算法特有的样式
- body 标签添加 `algo-page` 类以应用统一布局

### JavaScript

- ES6+ 语法
- `async/await` 控制流程
- 动态状态文本用 `window.I18n.t()` 包裹

### 国际化

| 场景 | 方式 |
|------|------|
| 静态 HTML 文本 | 使用 `data-en` 属性 |
| 动态 JS 文本 | 使用 `window.I18n.t('中文', args)` |
| placeholder | 使用 `data-en-placeholder` 属性 |

```html
<!-- 静态文本 -->
<span data-en="Start Sorting">开始排序</span>

<!-- 输入框 placeholder -->
<input placeholder="输入数值" data-en-placeholder="Enter value">
```

```javascript
// 动态文本
updateStatus(window.I18n.t('排序完成！比较次数: {0}', count));
```

---

## 提交 PR | Submitting PRs

### 1. Fork 仓库

### 2. 创建分支

```bash
git checkout -b feature/your-feature
```

### 3. 提交更改

```bash
git commit -m "feat: add new algorithm"
```

**Commit 格式：**
- `feat:` 新功能
- `fix:` 修复
- `docs:` 文档
- `i18n:` 国际化

### 4. 推送并创建 PR

```bash
git push origin feature/your-feature
```

---

## 问题反馈 | Issues

请在 [GitHub Issues](https://github.com/daichangya/animated-algorithm-guide/issues) 提交。

---

感谢您的贡献！🎉
