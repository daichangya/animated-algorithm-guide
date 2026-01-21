# 静态多语言架构

## 概述

本项目采用**静态生成**方案实现国际化，通过构建脚本生成独立的英文版页面到 `/en/` 目录，支持搜索引擎优化（SEO）。

## 目录结构

```
/
├── index.html                 # 中文首页
├── sorting/                   # 中文排序算法页面
├── sequence/                  # 中文序列算法页面
├── graph/                     # 中文图算法页面
├── search/                    # 中文搜索算法页面
├── geometry/                  # 中文几何算法页面
├── en/                        # 英文版（构建生成）
│   ├── index.html
│   ├── sorting/
│   ├── sequence/
│   ├── graph/
│   ├── search/
│   └── geometry/
├── common/
│   ├── i18n.js               # 语言切换逻辑
│   ├── lang/
│   │   └── translations.js   # 中英文对照字典
│   └── styles.css
└── scripts/
    └── build-en.js           # 英文版构建脚本
```

## 工作原理

### 构建流程

```
npm run build:en
        │
        ▼
┌─────────────────────────────┐
│ scripts/build-en.js         │
│                             │
│ 1. 读取 translations.js     │
│ 2. 遍历所有中文 HTML 文件   │
│ 3. 替换中文文本为英文       │
│ 4. 更新 <html lang="en">    │
│ 5. 添加 hreflang 标签       │
│ 6. 调整相对路径             │
│ 7. 输出到 /en/ 目录         │
└─────────────────────────────┘
        │
        ▼
   /en/ 目录生成
```

### 语言切换

```javascript
// common/i18n.js
switchLanguage(lang) {
    const path = window.location.pathname;
    
    if (lang === 'en' && !path.startsWith('/en/')) {
        // 中文 -> 英文：跳转到 /en/...
        window.location.href = '/en' + path;
    } else if (lang === 'zh' && path.startsWith('/en/')) {
        // 英文 -> 中文：移除 /en 前缀
        window.location.href = path.replace(/^\/en/, '');
    }
}
```

### SEO 配置

每个页面都包含 hreflang 标签：

```html
<!-- 中文页面 -->
<link rel="alternate" hreflang="zh-CN" href="https://algo.jsdiff.com/" />
<link rel="alternate" hreflang="en" href="https://algo.jsdiff.com/en/" />
<link rel="alternate" hreflang="x-default" href="https://algo.jsdiff.com/" />

<!-- 英文页面 -->
<link rel="alternate" hreflang="zh-CN" href="https://algo.jsdiff.com/" />
<link rel="alternate" hreflang="en" href="https://algo.jsdiff.com/en/" />
<link rel="alternate" hreflang="x-default" href="https://algo.jsdiff.com/" />
```

## 使用方法

### 添加新翻译

1. 编辑 `common/lang/translations.js`
2. 添加中英文对照：
   ```javascript
   '新的中文文本': 'New English text',
   ```
3. 运行构建脚本：
   ```bash
   npm run build:en
   ```

### 添加新页面

1. 在 `scripts/build-en.js` 的 `HTML_FILES` 数组中添加新路径
2. 确保 `translations.js` 包含该页面的所有中文文本
3. 运行构建脚本

### 部署

```bash
# 构建英文版
npm run build:en

# 部署到 Vercel（自动）
git add .
git commit -m "Update English version"
git push
```

## 优势

| 特性 | 说明 |
|------|------|
| SEO 友好 | 独立的英文 URL，搜索引擎可完整索引 |
| 性能优秀 | 纯静态页面，无运行时翻译开销 |
| 缓存友好 | 每个语言版本可独立缓存 |
| 易于维护 | 只需维护一个翻译字典 |

## 注意事项

1. **构建后检查**：运行构建后检查 `/en/` 目录的页面是否正确翻译
2. **翻译完整性**：确保 `translations.js` 包含所有需要翻译的文本
3. **路径正确性**：英文版页面的资源路径需要正确指向 `/common/` 目录
4. **Git 忽略**：可选择将 `/en/` 添加到 `.gitignore`，在 CI/CD 中构建

## 扩展

### 添加更多语言

1. 创建新的翻译字典，如 `translations-ja.js`
2. 修改 `build-en.js` 支持多语言输出
3. 更新 hreflang 标签包含新语言
4. 更新语言切换器 UI
