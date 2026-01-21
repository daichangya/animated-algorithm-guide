/**
 * Myers差异算法可视化
 * @author changyadai
 */

// 配置
const CONFIG = {
    stepDelay: 300,
    snakeDelay: 150,
    resultDelay: 200
};

// 状态
let source = '';
let target = '';
let isRunning = false;
let isPaused = false;
let currentMode = 'string';

// DOM元素
const sourceInput = document.getElementById('sourceInput');
const targetInput = document.getElementById('targetInput');
const sourceChars = document.getElementById('sourceChars');
const targetChars = document.getElementById('targetChars');
const editGraph = document.getElementById('editGraph');
const dValueEl = document.getElementById('dValue');
const diffResult = document.getElementById('diffResult');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const pauseBtn = document.getElementById('pauseBtn');
const statusText = document.getElementById('statusText');
const modeBtns = document.querySelectorAll('.mode-btn');

/**
 * 初始化
 */
function init() {
    source = sourceInput.value;
    target = targetInput.value;
    renderSequences();
    renderEditGraph();
    diffResult.innerHTML = '<span style="color: rgba(255,255,255,0.4)">运行算法后显示差异</span>';
    dValueEl.textContent = '?';
}

/**
 * 渲染序列显示
 */
function renderSequences() {
    sourceChars.innerHTML = '';
    targetChars.innerHTML = '';
    
    source.split('').forEach((char, i) => {
        const el = document.createElement('div');
        el.className = 'seq-char';
        el.id = `src-${i}`;
        el.textContent = char;
        sourceChars.appendChild(el);
    });
    
    target.split('').forEach((char, i) => {
        const el = document.createElement('div');
        el.className = 'seq-char';
        el.id = `tgt-${i}`;
        el.textContent = char;
        targetChars.appendChild(el);
    });
}

/**
 * 渲染编辑图
 */
function renderEditGraph() {
    editGraph.innerHTML = '';
    
    const n = source.length;
    const m = target.length;
    
    // 创建头部标签行
    const headerRow = document.createElement('div');
    headerRow.className = 'graph-header';
    
    // 左上角空白
    const corner = document.createElement('div');
    corner.className = 'header-cell';
    corner.textContent = '';
    headerRow.appendChild(corner);
    
    // 源序列标签
    for (let x = 0; x <= n; x++) {
        const cell = document.createElement('div');
        cell.className = 'header-cell';
        cell.textContent = x === 0 ? '' : source[x - 1];
        headerRow.appendChild(cell);
    }
    editGraph.appendChild(headerRow);
    
    // 创建网格行
    for (let y = 0; y <= m; y++) {
        const row = document.createElement('div');
        row.className = 'graph-row';
        
        // 侧边标签
        const sideLabel = document.createElement('div');
        sideLabel.className = 'side-label';
        sideLabel.textContent = y === 0 ? '' : target[y - 1];
        row.appendChild(sideLabel);
        
        for (let x = 0; x <= n; x++) {
            const cell = document.createElement('div');
            cell.className = 'graph-cell';
            cell.id = `cell-${x}-${y}`;
            
            // 节点
            const node = document.createElement('div');
            node.className = 'graph-node';
            node.id = `node-${x}-${y}`;
            cell.appendChild(node);
            
            // 边（仅在有下一个节点时添加）
            if (x < n) {
                const hEdge = document.createElement('div');
                hEdge.className = 'graph-edge horizontal';
                hEdge.id = `edge-h-${x}-${y}`;
                cell.appendChild(hEdge);
            }
            
            if (y < m) {
                const vEdge = document.createElement('div');
                vEdge.className = 'graph-edge vertical';
                vEdge.id = `edge-v-${x}-${y}`;
                cell.appendChild(vEdge);
            }
            
            // 对角线边（字符匹配时）
            if (x < n && y < m && source[x] === target[y]) {
                const dEdge = document.createElement('div');
                dEdge.className = 'graph-edge diagonal';
                dEdge.id = `edge-d-${x}-${y}`;
                cell.appendChild(dEdge);
            }
            
            row.appendChild(cell);
        }
        
        editGraph.appendChild(row);
    }
}

/**
 * 延迟函数（支持暂停）
 */
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

/**
 * 切换暂停状态
 */
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

/**
 * 更新状态
 */
function updateStatus(text) {
    statusText.textContent = window.I18n ? window.I18n.t(text) : text;
}

/**
 * 高亮节点
 */
function highlightNode(x, y, className) {
    const node = document.getElementById(`node-${x}-${y}`);
    if (node) {
        node.classList.add(className);
    }
}

/**
 * 高亮边
 */
function highlightEdge(x1, y1, x2, y2, className) {
    let edgeId;
    if (x2 === x1 + 1 && y2 === y1) {
        edgeId = `edge-h-${x1}-${y1}`;
    } else if (x2 === x1 && y2 === y1 + 1) {
        edgeId = `edge-v-${x1}-${y1}`;
    } else if (x2 === x1 + 1 && y2 === y1 + 1) {
        edgeId = `edge-d-${x1}-${y1}`;
    }
    
    const edge = document.getElementById(edgeId);
    if (edge) {
        edge.classList.add(className);
    }
}

/**
 * 创建蛇形轨迹效果
 */
function createSnakeTrail(x, y) {
    const cell = document.getElementById(`cell-${x}-${y}`);
    if (!cell) return;
    
    const trail = document.createElement('div');
    trail.className = 'snake-trail';
    trail.style.left = '50%';
    trail.style.top = '50%';
    trail.style.transform = 'translate(-50%, -50%)';
    cell.appendChild(trail);
    
    setTimeout(() => trail.remove(), 500);
}

/**
 * Myers算法 - 简化版用于可视化
 */
async function myersDiff() {
    const n = source.length;
    const m = target.length;
    const max = n + m;
    
    // V数组：V[k] = x，表示在对角线k上到达的最远x坐标
    const v = new Array(2 * max + 1).fill(-1);
    v[max + 1] = 0; // 从(0,0)开始，k=0时x=0
    
    const trace = []; // 记录每一步的V数组状态
    
    // 寻找最短编辑脚本
    for (let d = 0; d <= max; d++) {
        if (!isRunning) return null;
        
        dValueEl.textContent = d;
        updateStatus(window.I18n.t('探索编辑距离 D = {0}', d));
        
        const vCopy = [...v];
        trace.push(vCopy);
        
        for (let k = -d; k <= d; k += 2) {
            if (!isRunning) return null;
            
            // 决定是从上方还是左方来
            let x;
            if (k === -d || (k !== d && v[max + k - 1] < v[max + k + 1])) {
                x = v[max + k + 1]; // 从上方来（插入）
            } else {
                x = v[max + k - 1] + 1; // 从左方来（删除）
            }
            
            let y = x - k;
            
            // 起始点
            const startX = x;
            const startY = y;
            
            if (x >= 0 && x <= n && y >= 0 && y <= m) {
                highlightNode(x, y, 'visited');
                await delay(CONFIG.stepDelay);
            }
            
            // 沿对角线移动（匹配字符）
            while (x < n && y < m && source[x] === target[y]) {
                if (!isRunning) return null;
                
                const prevX = x;
                const prevY = y;
                x++;
                y++;
                
                highlightNode(x, y, 'visited');
                highlightEdge(prevX, prevY, x, y, 'visited');
                createSnakeTrail(x, y);
                
                // 高亮匹配的字符
                const srcChar = document.getElementById(`src-${prevX}`);
                const tgtChar = document.getElementById(`tgt-${prevY}`);
                if (srcChar) srcChar.classList.add('highlight');
                if (tgtChar) tgtChar.classList.add('highlight');
                
                await delay(CONFIG.snakeDelay);
                
                if (srcChar) srcChar.classList.remove('highlight');
                if (tgtChar) tgtChar.classList.remove('highlight');
            }
            
            v[max + k] = x;
            
            // 检查是否到达终点
            if (x >= n && y >= m) {
                updateStatus(window.I18n.t('找到最短路径! 编辑距离 D = {0}', d));
                
                // 回溯路径
                await backtrack(trace, n, m);
                return d;
            }
        }
        
        await delay(CONFIG.stepDelay);
    }
    
    return max;
}

/**
 * 回溯找到最短路径
 */
async function backtrack(trace, n, m) {
    let x = n;
    let y = m;
    const path = [];
    const edits = [];
    
    for (let d = trace.length - 1; d >= 0 && (x > 0 || y > 0); d--) {
        const v = trace[d];
        const k = x - y;
        const max = source.length + target.length;
        
        let prevK;
        if (k === -d || (k !== d && v[max + k - 1] < v[max + k + 1])) {
            prevK = k + 1; // 从上方来（插入）
        } else {
            prevK = k - 1; // 从左方来（删除）
        }
        
        const prevX = v[max + prevK];
        const prevY = prevX - prevK;
        
        // 对角线移动（匹配）
        while (x > prevX && y > prevY) {
            path.unshift({ x, y, type: 'keep', char: source[x - 1] });
            x--;
            y--;
        }
        
        // 水平或垂直移动
        if (d > 0) {
            if (x === prevX) {
                // 垂直移动 - 插入
                path.unshift({ x, y, type: 'insert', char: target[y - 1] });
                y--;
            } else {
                // 水平移动 - 删除
                path.unshift({ x, y, type: 'delete', char: source[x - 1] });
                x--;
            }
        }
    }
    
    // 高亮路径
    updateStatus('高亮最短编辑路径...');
    
    let px = 0, py = 0;
    highlightNode(0, 0, 'path');
    
    for (const step of path) {
        if (!isRunning) return;
        
        const nextX = step.type === 'insert' ? px : px + 1;
        const nextY = step.type === 'delete' ? py : py + 1;
        
        highlightEdge(px, py, nextX, nextY, 'path');
        highlightNode(nextX, nextY, 'path');
        
        await delay(CONFIG.resultDelay);
        
        px = nextX;
        py = nextY;
    }
    
    // 显示差异结果
    await showDiffResult(path);
}

/**
 * 显示差异结果
 */
async function showDiffResult(path) {
    diffResult.innerHTML = '';
    
    for (const step of path) {
        if (!isRunning) return;
        
        const item = document.createElement('div');
        item.className = `diff-item ${step.type}`;
        item.textContent = step.char;
        diffResult.appendChild(item);
        
        // 高亮对应的序列字符
        if (step.type === 'delete') {
            // 找到源序列中的字符并标记
        } else if (step.type === 'insert') {
            // 找到目标序列中的字符并标记
        }
        
        await delay(CONFIG.resultDelay);
    }
    
    // 庆祝动画
    await delay(300);
    document.querySelectorAll('.diff-item').forEach((item, i) => {
        setTimeout(() => item.classList.add('celebrate'), i * 50);
    });
}

/**
 * 开始算法
 */
async function start() {
    if (isRunning) return;
    
    source = sourceInput.value;
    target = targetInput.value;
    
    if (!source || !target) {
        updateStatus('请输入源序列和目标序列');
        return;
    }
    
    isRunning = true;
    isPaused = false;
    startBtn.disabled = true;
    resetBtn.disabled = true;
    if (pauseBtn) {
        pauseBtn.disabled = false;
        pauseBtn.textContent = window.I18n ? window.I18n.t('暂停') : '暂停';
        pauseBtn.classList.remove('paused');
    }
    
    // 重置显示
    renderSequences();
    renderEditGraph();
    diffResult.innerHTML = '';
    
    updateStatus('开始Myers差异算法...');
    
    const d = await myersDiff();
    
    if (isRunning && d !== null) {
        updateStatus(window.I18n.t('算法完成! 最小编辑距离: {0}', d));
    }
    
    isRunning = false;
    isPaused = false;
    startBtn.disabled = false;
    resetBtn.disabled = false;
    if (pauseBtn) {
        pauseBtn.disabled = true;
        pauseBtn.classList.remove('paused');
    }
}

/**
 * 重置
 */
function reset() {
    isRunning = false;
    isPaused = false;
    startBtn.disabled = false;
    resetBtn.disabled = false;
    if (pauseBtn) {
        pauseBtn.disabled = true;
        pauseBtn.classList.remove('paused');
        pauseBtn.textContent = window.I18n ? window.I18n.t('暂停') : '暂停';
    }
    
    init();
    updateStatus('点击"开始算法"查看动画');
}

// 事件监听
startBtn.addEventListener('click', start);
resetBtn.addEventListener('click', reset);
if (pauseBtn) {
    pauseBtn.addEventListener('click', togglePause);
}

sourceInput.addEventListener('input', () => {
    if (!isRunning) init();
});

targetInput.addEventListener('input', () => {
    if (!isRunning) init();
});

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        
        if (currentMode === 'line') {
            sourceInput.placeholder = '每行一个元素，用逗号分隔';
            targetInput.placeholder = '每行一个元素，用逗号分隔';
        } else {
            sourceInput.placeholder = '输入源序列';
            targetInput.placeholder = '输入目标序列';
        }
    });
});

// 初始化
// 等待 I18n 模块加载完成后初始化
if (document.readyState === 'complete') {
    setTimeout(init, 50);
} else {
    window.addEventListener('load', () => setTimeout(init, 50));
}
