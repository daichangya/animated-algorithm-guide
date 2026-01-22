#!/usr/bin/env node
/**
 * Sitemap 自动生成脚本
 * 根据目录结构自动生成 sitemap.xml
 * @author changyadai
 */

const fs = require('fs');
const path = require('path');

// 项目根目录
const ROOT_DIR = path.join(__dirname, '..');
const SITE_URL = 'https://algo.jsdiff.com';

// 算法分类目录列表
const CATEGORY_DIRS = [
    'sorting',
    'sequence',
    'graph',
    'search',
    'geometry',
    'data-structure'
];

// 获取今天的日期
function getToday() {
    return new Date().toISOString().split('T')[0];
}

// 生成单个 URL 条目
function generateUrlEntry(path, priority = 0.8, includeAlternate = true) {
    const zhUrl = path ? `${SITE_URL}/${path}` : `${SITE_URL}/`;
    const enUrl = path ? `${SITE_URL}/en/${path}` : `${SITE_URL}/en/`;
    const today = getToday();
    
    let alternateLinks = '';
    if (includeAlternate) {
        alternateLinks = `
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${zhUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${zhUrl}"/>`;
    }
    
    return `  <url>
    <loc>${zhUrl}</loc>${alternateLinks}
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// 生成英文版 URL 条目
function generateEnUrlEntry(path, priority = 0.8) {
    const zhUrl = path ? `${SITE_URL}/${path}` : `${SITE_URL}/`;
    const enUrl = path ? `${SITE_URL}/en/${path}` : `${SITE_URL}/en/`;
    const today = getToday();
    
    return `  <url>
    <loc>${enUrl}</loc>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${zhUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${zhUrl}"/>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// 扫描算法页面
function scanAlgorithmPages() {
    const pages = [];
    
    for (const category of CATEGORY_DIRS) {
        const categoryPath = path.join(ROOT_DIR, category);
        
        if (!fs.existsSync(categoryPath)) {
            continue;
        }
        
        const subDirs = fs.readdirSync(categoryPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        
        for (const subDir of subDirs) {
            const indexPath = path.join(categoryPath, subDir, 'index.html');
            
            if (fs.existsSync(indexPath)) {
                pages.push({
                    category,
                    slug: subDir,
                    path: `${category}/${subDir}/`
                });
            }
        }
    }
    
    return pages;
}

// 生成完整的 sitemap
function generateSitemap() {
    const pages = scanAlgorithmPages();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- 首页 -->
${generateUrlEntry('', 1.0)}
${generateEnUrlEntry('', 1.0)}
`;
    
    // 按分类分组
    const categoryNames = {
        'sorting': '排序算法',
        'sequence': '字符串算法',
        'graph': '图算法',
        'search': '搜索优化',
        'geometry': '计算几何',
        'data-structure': '数据结构'
    };
    
    let currentCategory = '';
    
    for (const page of pages) {
        if (page.category !== currentCategory) {
            currentCategory = page.category;
            sitemap += `
  <!-- ${categoryNames[currentCategory] || currentCategory} -->`;
        }
        
        sitemap += `
${generateUrlEntry(page.path)}
${generateEnUrlEntry(page.path)}
`;
    }
    
    // 添加文档页面
    sitemap += `
  <!-- 对比评测文章 -->
  <url>
    <loc>${SITE_URL}/docs/comparison/</loc>
    <lastmod>${getToday()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/docs/comparison/vs-visualgo.html</loc>
    <lastmod>${getToday()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/docs/comparison/vs-usfca.html</loc>
    <lastmod>${getToday()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/docs/comparison/vs-toptal.html</loc>
    <lastmod>${getToday()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
`;
    
    return sitemap;
}

// 主函数
function main() {
    console.log('=== 生成 Sitemap ===\n');
    
    const pages = scanAlgorithmPages();
    console.log(`发现 ${pages.length} 个算法页面`);
    
    const sitemap = generateSitemap();
    const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
    
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`\n✓ 已生成: sitemap.xml`);
    console.log(`  包含 ${pages.length * 2 + 2} 个 URL（中英文各 ${pages.length + 1} 个 + 文档页面）`);
}

main();
