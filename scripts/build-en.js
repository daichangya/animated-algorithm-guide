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

// 算法分类目录列表
const CATEGORY_DIRS = [
    'sorting',
    'sequence', 
    'graph',
    'search',
    'geometry',
    'data-structure'  // 新增数据结构分类
];

/**
 * 自动扫描目录获取 HTML 文件列表
 */
function scanHtmlFiles() {
    const files = ['index.html', '404.html'];  // 根目录文件
    
    for (const category of CATEGORY_DIRS) {
        const categoryPath = path.join(ROOT_DIR, category);
        
        if (!fs.existsSync(categoryPath)) {
            continue;  // 跳过不存在的目录
        }
        
        // 获取分类下的所有子目录
        const subDirs = fs.readdirSync(categoryPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        
        for (const subDir of subDirs) {
            const indexPath = path.join(category, subDir, 'index.html');
            const fullPath = path.join(ROOT_DIR, indexPath);
            
            if (fs.existsSync(fullPath)) {
                files.push(indexPath);
            }
        }
    }
    
    return files;
}

// 动态获取 HTML 文件列表
const HTML_FILES = scanHtmlFiles();

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
        'dynamic.js',
        'data-structure.js'
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
    // 获取当前文件所在目录的相对路径
    const dirPath = path.dirname(relativePath);
    
    // 替换本地资源（style.css, script.js）指向原始位置（中文版目录）
    // 使用绝对路径，更简洁
    html = html.replace(/href="style\.css"/g, `href="/${dirPath}/style.css"`);
    html = html.replace(/src="script\.js"/g, `src="/${dirPath}/script.js"`);
    
    // common/ 已经是绝对路径 /common/，无需调整
    
    // 替换首页链接为英文版首页（绝对路径）
    html = html.replace(/href="\.\.\/\.\.\/index\.html"/g, `href="/en/"`);
    
    // 替换算法页面链接（保持在 /en/ 目录内，使用绝对路径）
    html = html.replace(/href="(sorting|sequence|graph|search|geometry)\/([^"]+)\/index\.html"/g, (match, category, algo) => {
        return `href="/en/${category}/${algo}/"`;
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
    
    // 处理 data-en 属性：提取英文内容替换中文，并移除 data-en 属性
    // 支持多种标签：p, span, h1-h6, li, div, td, th, button, option 等
    html = html.replace(/<([a-z][a-z0-9]*)\s([^>]*?)data-en="([^"]+)"([^>]*)>([^<]*)<\/\1>/gi, 
        (match, tag, attrsBefore, enText, attrsAfter, zhText) => {
            // 合并属性，移除 data-en
            const attrs = (attrsBefore + attrsAfter).trim();
            if (attrs) {
                return `<${tag} ${attrs}>${enText}</${tag}>`;
            }
            return `<${tag}>${enText}</${tag}>`;
        }
    );
    
    // 处理 option 元素的 data-en 属性（自闭合情况）
    html = html.replace(/<option\s([^>]*?)data-en="([^"]+)"([^>]*)>([^<]*)<\/option>/gi,
        (match, attrsBefore, enText, attrsAfter, zhText) => {
            const attrs = (attrsBefore + attrsAfter).trim();
            if (attrs) {
                return `<option ${attrs}>${enText}</option>`;
            }
            return `<option>${enText}</option>`;
        }
    );
    
    // 处理 data-placeholder-en 属性
    html = html.replace(/placeholder="[^"]*"\s*data-placeholder-en="([^"]+)"/gi, 
        (match, enPlaceholder) => {
            return `placeholder="${enPlaceholder}"`;
        }
    );
    
    // 处理自闭合或有子元素的 data-en（更复杂的情况）
    // 匹配带有 data-en 的元素，替换其直接文本子节点
    html = html.replace(/(<[^>]+)\sdata-en="([^"]+)"([^>]*>)/gi, (match, tagStart, enText, tagEnd) => {
        // 移除 data-en 属性，后续通过翻译字典或保留原文
        // 这里我们记录下来，用于后续处理
        return `${tagStart}${tagEnd}`.replace(/\s+>/g, '>');
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
    
    // 3. 更新 hreflang 标签（先移除已有的，再添加新的）
    // 移除已有的 hreflang 标签和注释
    html = html.replace(/\s*<!-- Hreflang Tags for SEO -->\s*/g, '');
    html = html.replace(/\s*<link\s+rel="alternate"\s+hreflang="[^"]+"\s+href="[^"]+"\s*\/?>\s*/g, '');
    
    // 添加新的 hreflang 标签
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
    
    // 5. 调整路径
    const depth = relativePath.split('/').length - 1;
    if (depth > 0) {
        html = adjustPaths(html, relativePath);
    }
    // 首页和所有页面：common/ 已经是绝对路径 /common/，无需调整
    // 算法链接保持相对路径（在 /en/ 目录内）
    
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
