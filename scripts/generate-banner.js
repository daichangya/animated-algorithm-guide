/**
 * 生成算法演示 GIF 宣传图
 * 使用 Puppeteer 录制快速排序动画并生成 GIF
 */

const puppeteer = require('puppeteer');
const GIFEncoder = require('gifencoder');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const http = require('http');
const fs = require('fs');

const PORT = 8080;
const OUTPUT_PATH = path.join(__dirname, '..', 'banner.gif');
const TEMP_DIR = path.join(__dirname, '..', '.temp-screenshots');
const PAGE_URL = `http://localhost:${PORT}/sorting/bubble-sort/`;
const FPS = 10; // 帧率
const DURATION = 15000; // 录制时长（毫秒）
const FRAME_INTERVAL = 1000 / FPS; // 每帧间隔

/**
 * 启动简单的 HTTP 服务器
 */
function startServer() {
    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            // 移除查询参数
            let urlPath = req.url.split('?')[0];
            
            // 处理根路径
            if (urlPath === '/') {
                urlPath = '/index.html';
            }
            
            // 处理目录路径（以 / 结尾的路径，添加 index.html）
            if (urlPath.endsWith('/') && urlPath !== '/') {
                urlPath = urlPath + 'index.html';
            }
            
            // 构建文件路径
            const filePath = path.join(__dirname, '..', urlPath);
            
            // 安全检查：确保文件在项目目录内
            const projectRoot = path.join(__dirname, '..');
            if (!filePath.startsWith(projectRoot)) {
                res.writeHead(403);
                res.end('Forbidden');
                return;
            }
            
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    // 如果是目录路径且文件不存在，尝试添加 index.html
                    if (urlPath.endsWith('/') || !path.extname(filePath)) {
                        const indexPath = path.join(filePath, 'index.html');
                        fs.readFile(indexPath, (indexErr, indexData) => {
                            if (indexErr) {
                                res.writeHead(404);
                                res.end('Not Found: ' + urlPath);
                                return;
                            }
                            res.writeHead(200, { 
                                'Content-Type': 'text/html; charset=utf-8',
                                'Cache-Control': 'no-cache'
                            });
                            res.end(indexData);
                        });
                        return;
                    }
                    res.writeHead(404);
                    res.end('Not Found: ' + urlPath);
                    return;
                }
                
                // 设置 MIME 类型
                const ext = path.extname(filePath);
                const mimeTypes = {
                    '.html': 'text/html; charset=utf-8',
                    '.css': 'text/css; charset=utf-8',
                    '.js': 'application/javascript; charset=utf-8',
                    '.json': 'application/json',
                    '.svg': 'image/svg+xml',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.gif': 'image/gif',
                    '.ico': 'image/x-icon'
                };
                
                res.writeHead(200, { 
                    'Content-Type': mimeTypes[ext] || 'text/plain',
                    'Cache-Control': 'no-cache'
                });
                res.end(data);
            });
        });
        
        server.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
            resolve(server);
        });
        
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Please close the application using it.`);
            }
            reject(err);
        });
    });
}

/**
 * 等待指定时间
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 确保临时目录存在
 */
function ensureTempDir() {
    if (!fs.existsSync(TEMP_DIR)) {
        fs.mkdirSync(TEMP_DIR, { recursive: true });
    }
}

/**
 * 清理临时文件
 */
function cleanupTempFiles() {
    if (fs.existsSync(TEMP_DIR)) {
        const files = fs.readdirSync(TEMP_DIR);
        files.forEach(file => {
            fs.unlinkSync(path.join(TEMP_DIR, file));
        });
        fs.rmdirSync(TEMP_DIR);
    }
}

/**
 * 将截图转换为 GIF
 */
async function createGifFromScreenshots(screenshotFiles) {
    console.log('🎨 Creating GIF from screenshots...');
    
    if (screenshotFiles.length === 0) {
        throw new Error('No screenshots to process');
    }
    
    // 读取第一张图片获取尺寸
    const firstImage = await loadImage(screenshotFiles[0]);
    const width = 1200;
    const height = 800;
    
    // 创建 GIF 编码器
    const encoder = new GIFEncoder(width, height);
    encoder.createReadStream().pipe(fs.createWriteStream(OUTPUT_PATH));
    
    encoder.start();
    encoder.setRepeat(0); // 0 = 无限循环
    encoder.setDelay(FRAME_INTERVAL); // 帧延迟（毫秒）
    encoder.setQuality(10); // 质量 1-30，值越小质量越好但文件越大
    
    // 创建画布
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // 处理每一帧
    for (let i = 0; i < screenshotFiles.length; i++) {
        const image = await loadImage(screenshotFiles[i]);
        ctx.drawImage(image, 0, 0, width, height);
        encoder.addFrame(ctx);
        console.log(`  Processed frame ${i + 1}/${screenshotFiles.length}`);
    }
    
    encoder.finish();
    console.log(`✅ GIF created: ${OUTPUT_PATH}`);
}

/**
 * 主函数
 */
async function generateBanner() {
    let server;
    let browser;
    
    try {
        console.log('🚀 Starting banner generation...');
        
        // 启动本地服务器
        console.log('📡 Starting local server...');
        server = await startServer();
        await delay(1000); // 等待服务器完全启动
        
        // 启动浏览器
        console.log('🌐 Launching browser...');
        browser = await puppeteer.launch({
            headless: 'new', // 使用新的 headless 模式
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: {
                width: 1200,
                height: 800
            }
        });
        
        // 准备临时目录
        ensureTempDir();
        
        const page = await browser.newPage();
        
        // 设置视口
        await page.setViewport({ width: 1200, height: 800 });
        
        console.log('📹 Navigating to quick sort page...');
        await page.goto(PAGE_URL, { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });
        
        // 等待页面完全加载
        console.log('⏳ Waiting for page to load...');
        await delay(3000); // 增加等待时间
        
        // 调试：检查页面标题和URL
        const pageTitle = await page.title();
        const pageUrl = page.url();
        console.log(`📄 Page loaded: ${pageTitle}`);
        console.log(`🔗 Current URL: ${pageUrl}`);
        
        // 调试：检查页面内容
        const bodyContent = await page.evaluate(() => document.body ? document.body.innerHTML.substring(0, 200) : 'No body');
        console.log(`📝 Body preview: ${bodyContent}...`);
        
        // 尝试多种方式查找元素
        console.log('🔍 Looking for #arrayContainer...');
        const elementExists = await page.evaluate(() => {
            return !!document.getElementById('arrayContainer');
        });
        console.log(`✅ Element exists: ${elementExists}`);
        
        if (!elementExists) {
            // 如果元素不存在，尝试等待更长时间或检查页面结构
            console.log('⚠️  Element not found, waiting longer...');
            await delay(5000);
            
            // 再次检查
            const stillExists = await page.evaluate(() => {
                return !!document.getElementById('arrayContainer');
            });
            
            if (!stillExists) {
                // 截图用于调试
                await page.screenshot({ path: path.join(__dirname, '..', 'debug-page.png'), fullPage: true });
                console.log('📸 Debug screenshot saved to debug-page.png');
                throw new Error('Element #arrayContainer not found after extended wait. Check debug-page.png');
            }
        }
        
        // 等待算法容器存在
        await page.waitForSelector('#arrayContainer', { timeout: 20000 });
        console.log('✅ Found #arrayContainer');
        
        // 等待数组内容渲染完成（等待容器内有子元素）
        console.log('⏳ Waiting for array to render...');
        await page.waitForFunction(
            () => {
                const container = document.getElementById('arrayContainer');
                return container && container.children.length > 0;
            },
            { timeout: 20000 }
        );
        console.log('✅ Array rendered');
        
        await delay(1000); // 额外等待确保动画准备就绪
        
        // 点击开始排序按钮
        console.log('▶️  Clicking start button...');
        const startButton = await page.$('#startBtn');
        if (startButton) {
            await startButton.click();
        } else {
            throw new Error('Start button not found');
        }
        
        // 开始截图录制
        console.log('🎬 Starting screenshot recording...');
        const screenshotFiles = [];
        const totalFrames = Math.ceil(DURATION / FRAME_INTERVAL);
        const startTime = Date.now();
        
        for (let i = 0; i < totalFrames; i++) {
            const screenshotPath = path.join(TEMP_DIR, `frame-${i.toString().padStart(4, '0')}.png`);
            await page.screenshot({ 
                path: screenshotPath,
                type: 'png',
                fullPage: false
            });
            screenshotFiles.push(screenshotPath);
            
            // 计算下一帧的时间
            const elapsed = Date.now() - startTime;
            const nextFrameTime = (i + 1) * FRAME_INTERVAL;
            if (nextFrameTime > elapsed) {
                await delay(nextFrameTime - elapsed);
            }
            
            if ((i + 1) % 10 === 0) {
                console.log(`  Captured ${i + 1}/${totalFrames} frames...`);
            }
        }
        
        console.log(`✅ Captured ${screenshotFiles.length} frames`);
        
        // 将截图转换为 GIF
        await createGifFromScreenshots(screenshotFiles);
        
        // 清理临时文件
        console.log('🧹 Cleaning up temporary files...');
        cleanupTempFiles();
        
    } catch (error) {
        console.error('❌ Error generating banner:', error);
        throw error;
    } finally {
        // 清理
        if (browser) {
            await browser.close();
        }
        if (server) {
            server.close();
        }
    }
}

// 运行脚本
if (require.main === module) {
    generateBanner()
        .then(() => {
            console.log('\n✨ Banner generation process completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Failed to generate banner:', error);
            process.exit(1);
        });
}

module.exports = { generateBanner };
