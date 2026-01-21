#!/usr/bin/env node
/**
 * 静态英文版生成脚本
 * 将中文 HTML 页面翻译为英文版，输出到 /en/ 目录
 * @author changyadai
 */

const fs = require('fs');
const path = require('path');

// 项目根目录
const ROOT_DIR = path.join(__dirname, '..');
const EN_DIR = path.join(ROOT_DIR, 'en');
const SITE_URL = 'https://algo.jsdiff.com';

// 需要处理的 HTML 文件列表
const HTML_FILES = [
    'index.html',
    'sorting/bubble-sort/index.html',
    'sorting/heap-sort/index.html',
    'sorting/quick-sort/index.html',
    'sorting/merge-sort/index.html',
    'sequence/myers-diff/index.html',
    'sequence/lcs/index.html',
    'sequence/kmp/index.html',
    'graph/dijkstra/index.html',
    'graph/bfs-dfs/index.html',
    'graph/astar/index.html',
    'search/binary-search/index.html',
    'search/knapsack/index.html',
    'geometry/convex-hull/index.html'
];

// 解析单个翻译模块文件
function parseTranslationModule(filePath) {
    const translations = {};
    
    if (!fs.existsSync(filePath)) {
        console.warn(`Translation module not found: ${filePath}`);
        return translations;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 匹配单引号键值对：'key': 'value' 或 'key': "value"
    const regex = /'([^']+)':\s*(['"])((?:[^\\]|\\.)*?)\2/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        // 处理转义字符
        const value = match[3]
            .replace(/\\'/g, "'")
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
        translations[match[1]] = value;
    }
    
    return translations;
}

// 加载翻译字典（从多个模块文件）
function loadTranslations() {
    const translationsDir = path.join(ROOT_DIR, 'common/lang/translations');
    const moduleFiles = [
        'common.js',
        'homepage.js',
        'sorting.js',
        'sequence.js',
        'graph.js',
        'search.js',
        'geometry.js',
        'seo.js',
        'dynamic.js'
    ];
    
    let allTranslations = {};
    
    for (const moduleFile of moduleFiles) {
        const modulePath = path.join(translationsDir, moduleFile);
        const moduleTranslations = parseTranslationModule(modulePath);
        allTranslations = { ...allTranslations, ...moduleTranslations };
    }
    
    console.log(`Loaded ${Object.keys(allTranslations).length} translation entries from ${moduleFiles.length} modules`);
    return allTranslations;
}

// 翻译文本
function translateText(text, translations) {
    if (!text || !text.trim()) return text;
    
    // 规范化：去除首尾空白
    const trimmedText = text.trim();
    
    // 1. 先尝试完整匹配（规范化后）
    if (translations[trimmedText]) {
        // 保留原始的前导和尾随空白
        const leadingSpace = text.match(/^\s*/)[0];
        const trailingSpace = text.match(/\s*$/)[0];
        return leadingSpace + translations[trimmedText] + trailingSpace;
    }
    
    let result = text;
    
    // 2. 按中文长度降序排序，优先匹配长文本
    const sortedEntries = Object.entries(translations)
        .filter(([cn]) => result.includes(cn))
        .sort((a, b) => b[0].length - a[0].length);
    
    for (const [cn, en] of sortedEntries) {
        result = result.split(cn).join(en);
    }
    
    return result;
}

// 生成 hreflang 标签
function generateHreflangTags(relativePath, isEnglish = false) {
    const zhUrl = `${SITE_URL}/${relativePath}`.replace(/\/index\.html$/, '/').replace(/\/$/, '') || SITE_URL;
    const enUrl = `${SITE_URL}/en/${relativePath}`.replace(/\/index\.html$/, '/').replace(/\/$/, '');
    
    return `
    <!-- Hreflang Tags for SEO -->
    <link rel="alternate" hreflang="zh-CN" href="${zhUrl === SITE_URL ? SITE_URL + '/' : zhUrl}" />
    <link rel="alternate" hreflang="en" href="${enUrl}/" />
    <link rel="alternate" hreflang="x-default" href="${zhUrl === SITE_URL ? SITE_URL + '/' : zhUrl}" />`;
}

// 调整英文版的相对路径
function adjustPaths(html, relativePath) {
    const depth = relativePath.split('/').length - 1;
    const prefix = '../'.repeat(depth + 1);
    
    // 获取当前文件所在目录的相对路径
    const dirPath = path.dirname(relativePath);
    
    // 替换本地资源（style.css, script.js）指向原始位置（中文版目录）
    if (depth > 0) {
        html = html.replace(/href="style\.css"/g, `href="${prefix}${dirPath}/style.css"`);
        html = html.replace(/src="script\.js"/g, `src="${prefix}${dirPath}/script.js"`);
    }
    
    // 替换 common/ 路径
    html = html.replace(/href="\.\.\/\.\.\/common\//g, `href="${prefix}common/`);
    html = html.replace(/href="common\//g, `href="${prefix}common/`);
    html = html.replace(/src="\.\.\/\.\.\/common\//g, `src="${prefix}common/`);
    html = html.replace(/src="common\//g, `src="${prefix}common/`);
    
    // 替换首页链接
    html = html.replace(/href="\.\.\/\.\.\/index\.html"/g, `href="${prefix}en/index.html"`);
    html = html.replace(/href="index\.html"/g, `href="${prefix}en/index.html"`);
    
    // 替换算法页面链接（保持在 /en/ 目录内）
    // 只匹配 HTML 页面链接，不匹配资源文件
    html = html.replace(/href="(sorting|sequence|graph|search|geometry)\/([^"]+)\/index\.html"/g, (match, category, algo) => {
        return `href="${prefix}en/${category}/${algo}/index.html"`;
    });
    html = html.replace(/href="\.\.\/\.\.\/\.\.\/(sorting|sequence|graph|search|geometry)\/([^"]+)\/index\.html"/g, (match, category, algo) => {
        return `href="${prefix}en/${category}/${algo}/index.html"`;
    });
    
    return html;
}

// 处理单个 HTML 文件
function processHtmlFile(relativePath, translations) {
    const srcPath = path.join(ROOT_DIR, relativePath);
    const destPath = path.join(EN_DIR, relativePath);
    
    console.log(`Processing: ${relativePath}`);
    
    // 读取源文件
    let html = fs.readFileSync(srcPath, 'utf-8');
    
    // 1. 更新 html lang 属性
    html = html.replace(/<html\s+lang="zh-CN">/g, '<html lang="en">');
    
    // 2. 翻译所有中文文本
    // 翻译 title 标签
    html = html.replace(/<title>([^<]+)<\/title>/g, (match, content) => {
        return `<title>${translateText(content, translations)}</title>`;
    });
    
    // 翻译 meta 标签
    html = html.replace(/<meta\s+([^>]*content=")([^"]+)(")/g, (match, prefix, content, suffix) => {
        return `<meta ${prefix}${translateText(content, translations)}${suffix}`;
    });
    html = html.replace(/<meta\s+([^>]*name="application-name"\s+content=")([^"]+)(")/g, (match, prefix, content, suffix) => {
        return `<meta ${prefix}${translateText(content, translations)}${suffix}`;
    });
    
    // 更新 og:locale
    html = html.replace(/og:locale"\s+content="zh_CN"/g, 'og:locale" content="en_US"');
    
    // 翻译正文中的所有中文（排除 script, style, pre, code 标签内的内容）
    // 先保护代码块
    const codeBlockPlaceholders = [];
    html = html.replace(/<pre[^>]*>[\s\S]*?<\/pre>/gi, (match) => {
        codeBlockPlaceholders.push(match);
        return `__CODE_BLOCK_${codeBlockPlaceholders.length - 1}__`;
    });
    
    // 翻译 HTML 标签之间的文本
    html = html.replace(/>([^<]+)</g, (match, text) => {
        if (/[\u4e00-\u9fa5]/.test(text)) {
            return `>${translateText(text, translations)}<`;
        }
        return match;
    });
    
    // 还原代码块
    html = html.replace(/__CODE_BLOCK_(\d+)__/g, (match, index) => {
        return codeBlockPlaceholders[parseInt(index)];
    });
    
    // 翻译 placeholder 属性
    html = html.replace(/placeholder="([^"]+)"/g, (match, content) => {
        if (/[\u4e00-\u9fa5]/.test(content)) {
            return `placeholder="${translateText(content, translations)}"`;
        }
        return match;
    });
    
    // 翻译 title 属性
    html = html.replace(/title="([^"]+)"/g, (match, content) => {
        if (/[\u4e00-\u9fa5]/.test(content)) {
            return `title="${translateText(content, translations)}"`;
        }
        return match;
    });
    
    // 翻译 aria-label 属性
    html = html.replace(/aria-label="([^"]+)"/g, (match, content) => {
        if (/[\u4e00-\u9fa5]/.test(content)) {
            return `aria-label="${translateText(content, translations)}"`;
        }
        return match;
    });
    
    // 3. 添加 hreflang 标签
    const hreflangTags = generateHreflangTags(relativePath, true);
    html = html.replace(/<\/head>/, `${hreflangTags}\n</head>`);
    
    // 4. 更新 canonical URL 为英文版
    html = html.replace(
        /rel="canonical"\s+href="([^"]+)"/g,
        (match, url) => {
            if (url.includes(SITE_URL)) {
                const newUrl = url.replace(SITE_URL, `${SITE_URL}/en`);
                return `rel="canonical" href="${newUrl}"`;
            }
            return match;
        }
    );
    
    // 5. 调整相对路径
    const depth = relativePath.split('/').length - 1;
    if (depth > 0) {
        html = adjustPaths(html, relativePath);
    } else {
        // 首页
        html = html.replace(/href="common\//g, 'href="../common/');
        html = html.replace(/src="common\//g, 'src="../common/');
        // 首页内的算法链接指向 /en/ 内
        html = html.replace(/href="(sorting|sequence|graph|search|geometry)\//g, 'href="$1/');
    }
    
    // 6. 确保目标目录存在
    const destDir = path.dirname(destPath);
    fs.mkdirSync(destDir, { recursive: true });
    
    // 7. 写入目标文件
    fs.writeFileSync(destPath, html);
    console.log(`  -> Generated: en/${relativePath}`);
}

// 清理 /en/ 目录（保留 docs 子目录）
function cleanEnDir() {
    if (!fs.existsSync(EN_DIR)) {
        fs.mkdirSync(EN_DIR);
        return;
    }
    
    // 获取 /en/ 目录下的所有内容
    const items = fs.readdirSync(EN_DIR);
    
    // 需要保留的目录列表
    const preserveDirs = ['docs'];
    
    for (const item of items) {
        const itemPath = path.join(EN_DIR, item);
        
        // 跳过需要保留的目录
        if (preserveDirs.includes(item)) {
            console.log(`Preserving: en/${item}/`);
            continue;
        }
        
        // 删除其他文件和目录
        fs.rmSync(itemPath, { recursive: true });
    }
}

// 主函数
function main() {
    console.log('=== Building English Version ===\n');
    
    // 清理 /en/ 目录（保留 docs 子目录）
    cleanEnDir();
    
    // 加载翻译字典
    console.log('Loading translations...');
    const translations = loadTranslations();
    console.log(`Loaded ${Object.keys(translations).length} translation entries\n`);
    
    // 处理每个 HTML 文件
    for (const file of HTML_FILES) {
        processHtmlFile(file, translations);
    }
    
    console.log('\n=== Build Complete ===');
    console.log(`Generated ${HTML_FILES.length} English pages in /en/ directory`);
}

main();
