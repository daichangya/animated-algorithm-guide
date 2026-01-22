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

## 执行日志模块 | Execution Logger Module

### 功能概述

执行日志模块 (`AlgoLogger`) 用于记录和显示算法执行的每一步，帮助用户理解算法的工作过程。

**主要功能：**
- 实时记录算法执行步骤
- 支持多种日志级别（info, step, success, warn, error, log）
- 支持复制所有日志到剪贴板
- 支持折叠/展开日志面板
- 自动清空和限制日志数量（防止内存溢出）
- 支持中英文双语

### 在算法页面中集成

#### 步骤 1: 引入日志模块

在算法页面的 `index.html` 中添加：

```html
<link rel="stylesheet" href="/common/logger.css">
<script src="/common/logger.js"></script>
```

#### 步骤 2: 记录初始化数据

在初始化函数中记录初始数据：

```javascript
function init() {
    // 初始化数据
    array = generateArray();
    
    // 记录日志
    if (window.AlgoLogger) {
        window.AlgoLogger.clear();
        window.AlgoLogger.info('生成随机数组: {0} 个元素', array.length);
        window.AlgoLogger.log('数据: [{0}]', array.join(', '));
    }
}
```

#### 步骤 3: 记录执行步骤

在算法执行过程中记录关键步骤：

```javascript
async function bubbleSort() {
    if (window.AlgoLogger) {
        window.AlgoLogger.step('开始冒泡排序');
    }
    
    for (let i = 0; i < n - 1; i++) {
        // 记录比较操作
        if (window.AlgoLogger) {
            window.AlgoLogger.log('比较: 位置{0}({1}) vs 位置{2}({3})', 
                j+1, array[j], j+2, array[j+1]);
        }
        
        if (array[j] > array[j + 1]) {
            // 记录交换操作
            if (window.AlgoLogger) {
                window.AlgoLogger.log('交换: {0} ↔ {1}', array[j], array[j+1]);
            }
            swap(j, j + 1);
        }
    }
    
    // 记录完成
    if (window.AlgoLogger) {
        window.AlgoLogger.success('排序完成: 比较{0}次, 交换{1}次', comparisons, swaps);
    }
}
```

### 日志级别说明

| 级别 | 方法 | 用途 | 图标 |
|------|------|------|------|
| **info** | `AlgoLogger.info()` | 一般信息（初始化、配置等） | ℹ️ |
| **step** | `AlgoLogger.step()` | 关键步骤（算法开始、阶段转换） | 🔵 |
| **log** | `AlgoLogger.log()` | 常规日志（比较、交换、访问等） | - |
| **success** | `AlgoLogger.success()` | 成功操作（完成、找到结果） | ✅ |
| **warn** | `AlgoLogger.warn()` | 警告信息（未找到、边界情况） | ⚠️ |
| **error** | `AlgoLogger.error()` | 错误信息（异常、失败） | ❌ |

### 占位符使用

日志消息支持占位符，使用 `{0}`, `{1}`, `{2}` 等：

```javascript
// 单个参数
window.AlgoLogger.info('生成随机数组: {0} 个元素', array.length);

// 多个参数
window.AlgoLogger.log('比较: 位置{0}({1}) vs 位置{2}({3})', 
    j+1, array[j], j+2, array[j+1]);

// 数组数据
window.AlgoLogger.log('数据: [{0}]', array.join(', '));
```

### 初始化数据日志规范

**必须记录的内容：**

1. **排序算法**: 数组长度和完整数组数据
   ```javascript
   window.AlgoLogger.info('生成随机数组: {0} 个元素', array.length);
   window.AlgoLogger.log('数据: [{0}]', array.join(', '));
   ```

2. **图算法**: 节点列表和边列表（含权重）
   ```javascript
   window.AlgoLogger.info('图数据已初始化: {0} 个节点', nodes.length);
   window.AlgoLogger.log('节点: [{0}]', nodes.map(n => n.id).join(', '));
   window.AlgoLogger.log('边: [{0}]', edges.map(e => `${e.from}→${e.to}(w:${e.weight})`).join(', '));
   ```

3. **序列算法**: 序列内容
   ```javascript
   window.AlgoLogger.info('LCS初始化: 序列A长度={0}, 序列B长度={1}', seqA.length, seqB.length);
   window.AlgoLogger.log('序列A: "{0}"', seqA);
   window.AlgoLogger.log('序列B: "{0}"', seqB);
   ```

4. **几何算法**: 点坐标
   ```javascript
   window.AlgoLogger.info('生成 {0} 个随机点', points.length);
   window.AlgoLogger.log('点坐标: [{0}]', points.map((p, i) => 
       `P${i}(${Math.round(p.x)},${Math.round(p.y)})`).join(', '));
   ```

### 初始化时机

确保在 `AlgoLogger` 初始化完成后再记录日志。对于页面加载时的初始化，使用延迟执行：

```javascript
// 方式1: 在 init() 函数中（推荐）
function init() {
    // ... 初始化代码 ...
    
    if (window.AlgoLogger) {
        window.AlgoLogger.clear();
        window.AlgoLogger.info('初始化完成');
    }
}

// 页面加载时延迟初始化
if (document.readyState === 'complete') {
    setTimeout(init, 50);
} else {
    window.addEventListener('load', () => setTimeout(init, 50));
}
```

### API 参考

**主要方法：**

- `AlgoLogger.init(targetSelector)` - 手动初始化（通常自动调用）
- `AlgoLogger.clear()` - 清空所有日志
- `AlgoLogger.log(text, ...args)` - 记录常规日志
- `AlgoLogger.info(text, ...args)` - 记录信息日志
- `AlgoLogger.step(text, ...args)` - 记录步骤日志
- `AlgoLogger.success(text, ...args)` - 记录成功日志
- `AlgoLogger.warn(text, ...args)` - 记录警告日志
- `AlgoLogger.error(text, ...args)` - 记录错误日志
- `AlgoLogger.copy()` - 复制所有日志到剪贴板
- `AlgoLogger.toggle()` - 折叠/展开日志面板
- `AlgoLogger.setMaxLogs(max)` - 设置最大日志数量（默认500）

### 最佳实践

1. **初始化时清空日志**: 每次初始化时调用 `AlgoLogger.clear()`
2. **记录完整数据**: 初始化时记录完整的初始数据（数组、图结构等）
3. **使用合适的日志级别**: 根据信息类型选择合适的级别
4. **使用占位符**: 使用 `{0}`, `{1}` 等占位符，支持翻译
5. **延迟初始化**: 确保在 `AlgoLogger` 准备好后再记录日志

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
