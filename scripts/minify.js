/**
 * CSS/JS 压缩脚本
 * @author changyadai
 * 
 * 使用原生 JavaScript 进行简单压缩，无需额外依赖
 * 生产环境建议使用 esbuild 或 terser 获得更好效果
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// 简单的 CSS 压缩（移除注释、多余空白）
function minifyCSS(css) {
    return css
        // 移除注释
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // 移除多余空白
        .replace(/\s+/g, ' ')
        // 移除选择器周围的空白
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*,\s*/g, ',')
        // 移除最后一个分号（可选）
        .replace(/;}/g, '}')
        .trim();
}

// 简单的 JS 压缩（移除注释、多余空白）
// 注意：这是非常基础的压缩，不会混淆变量名
function minifyJS(js) {
    return js
        // 移除单行注释（注意不移除 URL 中的 //）
        .replace(/(?<!:)\/\/(?!["']).*$/gm, '')
        // 移除多行注释
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // 压缩多余空白（保留字符串内的空白）
        .replace(/(\s)\s+/g, '$1')
        // 移除行首行尾空白
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n')
        .trim();
}

// 递归获取所有指定类型的文件
function getFiles(dir, extensions, files = []) {
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            // 跳过 node_modules, .git, dist, en（英文版单独处理）
            if (!['node_modules', '.git', 'dist', 'en', 'docs'].includes(item)) {
                getFiles(fullPath, extensions, files);
            }
        } else if (extensions.some(ext => item.endsWith(ext))) {
            files.push(fullPath);
        }
    }
    
    return files;
}

// 处理文件
function processFiles() {
    console.log('=== Minifying CSS/JS Files ===\n');
    
    // 确保 dist 目录存在
    if (fs.existsSync(DIST_DIR)) {
        fs.rmSync(DIST_DIR, { recursive: true });
    }
    fs.mkdirSync(DIST_DIR, { recursive: true });
    
    // 获取所有 CSS 和 JS 文件
    const cssFiles = getFiles(ROOT_DIR, ['.css']);
    const jsFiles = getFiles(ROOT_DIR, ['.js'])
        .filter(f => !f.includes('scripts/')); // 排除构建脚本
    
    let cssStats = { files: 0, originalSize: 0, minifiedSize: 0 };
    let jsStats = { files: 0, originalSize: 0, minifiedSize: 0 };
    
    // 处理 CSS 文件
    console.log('Processing CSS files...');
    for (const file of cssFiles) {
        const relativePath = path.relative(ROOT_DIR, file);
        const destPath = path.join(DIST_DIR, relativePath);
        
        // 确保目录存在
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        
        const content = fs.readFileSync(file, 'utf8');
        const minified = minifyCSS(content);
        
        fs.writeFileSync(destPath, minified);
        
        cssStats.files++;
        cssStats.originalSize += content.length;
        cssStats.minifiedSize += minified.length;
        
        const savings = ((1 - minified.length / content.length) * 100).toFixed(1);
        console.log(`  ✓ ${relativePath} (${savings}% smaller)`);
    }
    
    // 处理 JS 文件
    console.log('\nProcessing JS files...');
    for (const file of jsFiles) {
        const relativePath = path.relative(ROOT_DIR, file);
        const destPath = path.join(DIST_DIR, relativePath);
        
        // 确保目录存在
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        
        const content = fs.readFileSync(file, 'utf8');
        const minified = minifyJS(content);
        
        fs.writeFileSync(destPath, minified);
        
        jsStats.files++;
        jsStats.originalSize += content.length;
        jsStats.minifiedSize += minified.length;
        
        const savings = ((1 - minified.length / content.length) * 100).toFixed(1);
        console.log(`  ✓ ${relativePath} (${savings}% smaller)`);
    }
    
    // 打印统计
    console.log('\n=== Minification Complete ===');
    console.log(`CSS: ${cssStats.files} files, ${formatSize(cssStats.originalSize)} → ${formatSize(cssStats.minifiedSize)} (${((1 - cssStats.minifiedSize / cssStats.originalSize) * 100).toFixed(1)}% savings)`);
    console.log(`JS:  ${jsStats.files} files, ${formatSize(jsStats.originalSize)} → ${formatSize(jsStats.minifiedSize)} (${((1 - jsStats.minifiedSize / jsStats.originalSize) * 100).toFixed(1)}% savings)`);
    console.log(`\nOutput: ${DIST_DIR}`);
    console.log('\n💡 Tip: For production, consider using esbuild or terser for better compression.');
}

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// 运行
processFiles();
