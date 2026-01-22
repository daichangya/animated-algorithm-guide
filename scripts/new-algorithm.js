#!/usr/bin/env node
/**
 * 新算法脚手架脚本
 * 一键生成新算法的目录结构和模板文件
 * @author changyadai
 * 
 * 用法:
 *   node scripts/new-algorithm.js <category/algo-slug> <中文名> <English Name>
 * 
 * 示例:
 *   node scripts/new-algorithm.js data-structure/b-tree "B树" "B-Tree"
 *   node scripts/new-algorithm.js sorting/insertion-sort "插入排序" "Insertion Sort"
 */

const fs = require('fs');
const path = require('path');

// 项目根目录
const ROOT_DIR = path.join(__dirname, '..');
const TEMPLATES_DIR = path.join(__dirname, 'templates');

// 颜色输出
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    red: '\x1b[31m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// 解析命令行参数
function parseArgs() {
    const args = process.argv.slice(2);
    
    if (args.length < 3) {
        log('用法: node scripts/new-algorithm.js <category/algo-slug> <中文名> <English Name>', 'yellow');
        log('示例: node scripts/new-algorithm.js data-structure/b-tree "B树" "B-Tree"', 'cyan');
        process.exit(1);
    }
    
    const pathArg = args[0];
    const zhName = args[1];
    const enName = args[2];
    
    // 解析路径
    const parts = pathArg.split('/');
    if (parts.length !== 2) {
        log('错误: 路径格式应为 category/algo-slug', 'red');
        process.exit(1);
    }
    
    return {
        category: parts[0],
        algoSlug: parts[1],
        zhName,
        enName,
        fullPath: pathArg
    };
}

// 生成类名（驼峰命名）
function toClassName(slug) {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

// 替换模板变量
function replaceTemplateVars(content, vars) {
    let result = content;
    
    for (const [key, value] of Object.entries(vars)) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        result = result.replace(regex, value);
    }
    
    return result;
}

// 创建算法目录和文件
function createAlgorithmFiles(config) {
    const { category, algoSlug, zhName, enName, fullPath } = config;
    const algoDir = path.join(ROOT_DIR, category, algoSlug);
    
    // 检查目录是否已存在
    if (fs.existsSync(algoDir)) {
        log(`错误: 目录已存在 ${fullPath}`, 'red');
        process.exit(1);
    }
    
    // 创建目录
    fs.mkdirSync(algoDir, { recursive: true });
    log(`✓ 创建目录: ${fullPath}/`, 'green');
    
    // 模板变量
    const templateVars = {
        category,
        algoSlug,
        zhName,
        enName,
        className: toClassName(algoSlug),
        zhSubtitle: `观察${zhName}的工作过程`,
        enSubtitle: `Watch how ${enName} works`,
        zhDescription: `${zhName}是一种高效的数据结构，支持快速的查找、插入和删除操作。`,
        enDescription: `${enName} is an efficient data structure that supports fast search, insert, and delete operations.`
    };
    
    // 复制并处理模板文件
    const templateFiles = ['index.html', 'script.js', 'style.css'];
    
    for (const file of templateFiles) {
        const templatePath = path.join(TEMPLATES_DIR, file);
        const destPath = path.join(algoDir, file);
        
        if (!fs.existsSync(templatePath)) {
            log(`警告: 模板文件不存在 ${file}`, 'yellow');
            continue;
        }
        
        let content = fs.readFileSync(templatePath, 'utf-8');
        content = replaceTemplateVars(content, templateVars);
        
        fs.writeFileSync(destPath, content);
        log(`✓ 创建文件: ${fullPath}/${file}`, 'green');
    }
    
    return templateVars;
}

// 更新 build-en.js 文件列表（如果是硬编码模式）
function updateBuildEnJs(config) {
    const buildEnPath = path.join(ROOT_DIR, 'scripts/build-en.js');
    let content = fs.readFileSync(buildEnPath, 'utf-8');
    
    // 检查是否使用硬编码列表
    if (!content.includes('const HTML_FILES = [')) {
        log('ℹ build-en.js 使用自动扫描模式，无需更新', 'cyan');
        return;
    }
    
    // 查找 HTML_FILES 数组并添加新条目
    const newEntry = `    '${config.category}/${config.algoSlug}/index.html',`;
    
    // 在 geometry/convex-hull 之后添加（按分类排序）
    const insertPoint = content.indexOf("'geometry/convex-hull/index.html'");
    if (insertPoint !== -1) {
        const lineEnd = content.indexOf('\n', insertPoint);
        content = content.slice(0, lineEnd + 1) + newEntry + '\n' + content.slice(lineEnd + 1);
        
        fs.writeFileSync(buildEnPath, content);
        log(`✓ 更新 build-en.js: 添加 ${config.fullPath}/index.html`, 'green');
    } else {
        log('⚠ 无法自动更新 build-en.js，请手动添加', 'yellow');
    }
}

// 生成 sitemap 条目
function generateSitemapEntry(config) {
    const { category, algoSlug } = config;
    const today = new Date().toISOString().split('T')[0];
    
    return `
  <!-- ${config.zhName} -->
  <url>
    <loc>https://algo.jsdiff.com/${category}/${algoSlug}/</loc>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="https://algo.jsdiff.com/${category}/${algoSlug}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://algo.jsdiff.com/en/${category}/${algoSlug}/"/>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://algo.jsdiff.com/en/${category}/${algoSlug}/</loc>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="https://algo.jsdiff.com/${category}/${algoSlug}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://algo.jsdiff.com/en/${category}/${algoSlug}/"/>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
}

// 打印后续步骤
function printNextSteps(config) {
    log('\n=== 创建完成 ===', 'green');
    log(`\n📁 已创建: ${config.fullPath}/`, 'cyan');
    log('   ├── index.html');
    log('   ├── script.js');
    log('   └── style.css');
    
    log('\n📋 后续步骤:', 'yellow');
    log('1. 编辑 script.js 实现核心算法逻辑');
    log('2. 编辑 index.html 完善页面内容和 data-en 翻译');
    log('3. 编辑 style.css 调整样式');
    log('4. 在 index.html 首页添加算法卡片');
    log('5. 运行 npm run build 生成英文版');
    
    log('\n📝 Sitemap 条目（复制到 sitemap.xml）:', 'cyan');
    console.log(generateSitemapEntry(config));
}

// 主函数
function main() {
    log('=== 新算法脚手架 ===\n', 'cyan');
    
    const config = parseArgs();
    
    log(`分类: ${config.category}`, 'cyan');
    log(`路径: ${config.algoSlug}`, 'cyan');
    log(`中文名: ${config.zhName}`, 'cyan');
    log(`英文名: ${config.enName}`, 'cyan');
    log('');
    
    // 创建文件
    createAlgorithmFiles(config);
    
    // 更新 build-en.js
    updateBuildEnJs(config);
    
    // 打印后续步骤
    printNextSteps(config);
}

main();
