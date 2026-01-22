/**
 * 凸包算法可视化 (Graham Scan)
 * @author changyadai
 */

const CONFIG = { stepDelay: 400 };

let points = [];
let hull = [];
let isRunning = false;
let isPaused = false;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const stackContent = document.getElementById('stackContent');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const statusText = document.getElementById('statusText');

function init() {
    generateRandomPoints();
}

function generateRandomPoints() {
    points = [];
    const margin = 50;
    const count = 15 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < count; i++) {
        points.push({
            x: margin + Math.random() * (canvas.width - 2 * margin),
            y: margin + Math.random() * (canvas.height - 2 * margin)
        });
    }
    
    hull = [];
    render();
    updateStack([]);
    updateStatus(window.I18n.t('已生成 {0} 个点', points.length));
    
    // 日志记录
    if (window.AlgoLogger) {
        window.AlgoLogger.clear();
        window.AlgoLogger.info('生成 {0} 个随机点', points.length);
    }
}

function render(sortedPoints = null, currentLine = null, checkLine = null) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 画凸包边
    if (hull.length > 1) {
        ctx.beginPath();
        ctx.moveTo(hull[0].x, hull[0].y);
        for (let i = 1; i < hull.length; i++) {
            ctx.lineTo(hull[i].x, hull[i].y);
        }
        if (hull.length > 2) {
            ctx.lineTo(hull[0].x, hull[0].y);
        }
        ctx.strokeStyle = '#84cc16';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 填充
        ctx.fillStyle = 'rgba(132, 204, 22, 0.1)';
        ctx.fill();
    }
    
    // 画检查线
    if (checkLine) {
        ctx.beginPath();
        ctx.moveTo(checkLine[0].x, checkLine[0].y);
        ctx.lineTo(checkLine[1].x, checkLine[1].y);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // 画当前考虑的线
    if (currentLine) {
        ctx.beginPath();
        ctx.moveTo(currentLine[0].x, currentLine[0].y);
        ctx.lineTo(currentLine[1].x, currentLine[1].y);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    // 画所有点
    const displayPoints = sortedPoints || points;
    displayPoints.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        
        if (sortedPoints && i === 0) {
            // 起始点
            ctx.fillStyle = '#22c55e';
        } else if (hull.includes(p)) {
            ctx.fillStyle = '#84cc16';
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        }
        
        ctx.fill();
        
        // 点索引
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '10px sans-serif';
        ctx.fillText(i, p.x + 8, p.y - 8);
    });
}

function updateStack(stack, currentIdx = -1, checkIdx = -1) {
    stackContent.innerHTML = '';
    
    if (stack.length === 0) {
        const t = window.I18n ? window.I18n.t.bind(window.I18n) : (s) => s;
        stackContent.innerHTML = `<span style="color:rgba(255,255,255,0.4)">${t('空')}</span>`;
        return;
    }
    
    stack.forEach((idx, i) => {
        if (i > 0) {
            const arrow = document.createElement('span');
            arrow.className = 'stack-arrow';
            arrow.textContent = '→';
            stackContent.appendChild(arrow);
        }
        
        const item = document.createElement('span');
        item.className = 'stack-item';
        item.textContent = `P${idx}`;
        
        if (i === stack.length - 1 && currentIdx === idx) {
            item.classList.add('current');
        }
        if (checkIdx >= 0 && i === stack.length - 2) {
            item.classList.add('checking');
        }
        
        stackContent.appendChild(item);
    });
}

function updateStatus(text) {
    statusText.textContent = window.I18n ? window.I18n.t(text) : text;
}

function delay(ms) {
    return new Promise(resolve => {
        const startTime = Date.now();
        const checkPause = () => {
            if (!isRunning) { resolve(); return; }
            if (isPaused) {
                setTimeout(checkPause, 50);
            } else {
                const remaining = Math.max(0, ms - (Date.now() - startTime));
                if (remaining <= 0) resolve();
                else setTimeout(resolve, remaining);
            }
        };
        setTimeout(checkPause, ms);
    });
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseBtn.textContent = window.I18n ? window.I18n.t('继续') : '继续';
        pauseBtn.classList.add('paused');
        updateStatus('已暂停 - 点击继续');
    } else {
        pauseBtn.textContent = window.I18n ? window.I18n.t('暂停') : '暂停';
        pauseBtn.classList.remove('paused');
        updateStatus('运行中...');
    }
}

// 叉积：判断转向
function cross(o, a, b) {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

// 极角排序
function polarAngleSort(points, pivot) {
    return points.slice().sort((a, b) => {
        const angleA = Math.atan2(a.y - pivot.y, a.x - pivot.x);
        const angleB = Math.atan2(b.y - pivot.y, b.x - pivot.x);
        if (angleA !== angleB) return angleA - angleB;
        // 角度相同，按距离排序
        const distA = (a.x - pivot.x) ** 2 + (a.y - pivot.y) ** 2;
        const distB = (b.x - pivot.x) ** 2 + (b.y - pivot.y) ** 2;
        return distA - distB;
    });
}

async function grahamScan() {
    if (points.length < 3) {
        updateStatus('至少需要3个点');
        return;
    }
    
    // 找最低点（y最大，y相同取x最小）
    let lowestIdx = 0;
    for (let i = 1; i < points.length; i++) {
        if (points[i].y > points[lowestIdx].y ||
            (points[i].y === points[lowestIdx].y && points[i].x < points[lowestIdx].x)) {
            lowestIdx = i;
        }
    }
    
    const pivot = points[lowestIdx];
    updateStatus(window.I18n.t('找到最低点 P{0}', lowestIdx));
    await delay(CONFIG.stepDelay);
    
    // 极角排序
    const sorted = polarAngleSort(points, pivot);
    const sortedIndices = sorted.map(p => points.indexOf(p));
    
    updateStatus('按极角排序点集');
    render(sorted);
    await delay(CONFIG.stepDelay);
    
    // Graham Scan
    const stack = [sortedIndices[0], sortedIndices[1]];
    hull = [sorted[0], sorted[1]];
    updateStack(stack);
    render(sorted);
    await delay(CONFIG.stepDelay);
    
    for (let i = 2; i < sorted.length; i++) {
        if (!isRunning) return;
        
        const currentPoint = sorted[i];
        const currentIdx = sortedIndices[i];
        
        updateStatus(window.I18n.t('考虑点 P{0}', currentIdx));
        
        // 检查是否需要弹出栈顶
        while (stack.length > 1) {
            const top = sorted[sortedIndices.indexOf(stack[stack.length - 1])];
            const secondTop = sorted[sortedIndices.indexOf(stack[stack.length - 2])];
            
            // 显示检查线
            render(sorted, [secondTop, currentPoint], [secondTop, top]);
            updateStack(stack, currentIdx, stack[stack.length - 2]);
            
            const crossProduct = cross(secondTop, top, currentPoint);
            
            if (crossProduct <= 0) {
                // 右转或共线，弹出栈顶
                updateStatus(window.I18n.t('P{0} 不在凸包上，弹出', stack[stack.length - 1]));
                await delay(CONFIG.stepDelay);
                
                stack.pop();
                hull.pop();
                updateStack(stack);
                render(sorted);
                await delay(CONFIG.stepDelay / 2);
            } else {
                break;
            }
        }
        
        // 压入当前点
        stack.push(currentIdx);
        hull.push(currentPoint);
        updateStack(stack, currentIdx);
        render(sorted);
        
        updateStatus(window.I18n.t('将 P{0} 加入凸包', currentIdx));
        await delay(CONFIG.stepDelay);
    }
    
    // 完成
    render(sorted);
    updateStatus(window.I18n.t('凸包完成! 共 {0} 个顶点', hull.length));
    if (window.AlgoLogger) window.AlgoLogger.success('凸包完成: {0} 个顶点', hull.length);
}

async function start() {
    if (isRunning) return;
    if (points.length < 3) {
        updateStatus('请至少添加3个点');
        return;
    }
    
    isRunning = true;
    isPaused = false;
    startBtn.disabled = true;
    if (pauseBtn) {
        pauseBtn.disabled = false;
        pauseBtn.textContent = window.I18n ? window.I18n.t('暂停') : '暂停';
        pauseBtn.classList.remove('paused');
    }
    
    hull = [];
    render();
    updateStack([]);
    
    await grahamScan();
    
    isRunning = false;
    isPaused = false;
    startBtn.disabled = false;
    if (pauseBtn) {
        pauseBtn.disabled = true;
        pauseBtn.classList.remove('paused');
    }
}

function clear() {
    isRunning = false;
    isPaused = false;
    startBtn.disabled = false;
    if (pauseBtn) {
        pauseBtn.disabled = true;
        pauseBtn.classList.remove('paused');
        pauseBtn.textContent = window.I18n ? window.I18n.t('暂停') : '暂停';
    }
    points = [];
    hull = [];
    render();
    updateStack([]);
    updateStatus('点击画布添加点');
}

// 点击添加点
canvas.addEventListener('click', (e) => {
    if (isRunning) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    points.push({ x, y });
    hull = [];
    render();
    updateStatus(window.I18n.t('已添加 {0} 个点', points.length));
});

startBtn.addEventListener('click', start);
if (pauseBtn) {
    pauseBtn.addEventListener('click', togglePause);
}
generateBtn.addEventListener('click', generateRandomPoints);
clearBtn.addEventListener('click', clear);

// 等待 I18n 模块加载完成后初始化
if (document.readyState === 'complete') {
    setTimeout(init, 50);
} else {
    window.addEventListener('load', () => setTimeout(init, 50));
}
