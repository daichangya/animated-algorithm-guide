/**
 * BFS/DFS遍历可视化
 * @author changyadai
 */

const CONFIG = { stepDelay: 500 };

// 树形图数据
const nodes = [
    { id: '1', x: 250, y: 40 },
    { id: '2', x: 125, y: 110 },
    { id: '3', x: 375, y: 110 },
    { id: '4', x: 62, y: 180 },
    { id: '5', x: 187, y: 180 },
    { id: '6', x: 312, y: 180 },
    { id: '7', x: 437, y: 180 },
    { id: '8', x: 62, y: 250 },
    { id: '9', x: 187, y: 250 }
];

const edges = [
    { from: '1', to: '2' }, { from: '1', to: '3' },
    { from: '2', to: '4' }, { from: '2', to: '5' },
    { from: '3', to: '6' }, { from: '3', to: '7' },
    { from: '4', to: '8' }, { from: '5', to: '9' }
];

let mode = 'bfs';
let isRunning = false;
let isPaused = false;

const modeBtns = document.querySelectorAll('.mode-btn');
const bfsPanel = document.getElementById('bfsPanel');
const dfsPanel = document.getElementById('dfsPanel');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const pauseBtn = document.getElementById('pauseBtn');
const statusText = document.getElementById('statusText');

function init() {
    renderGraph('bfsSvg');
    renderGraph('dfsSvg');
    updatePanelVisibility();
    
    // 日志记录
    if (window.AlgoLogger) {
        window.AlgoLogger.clear();
        window.AlgoLogger.info('图数据已初始化: {0} 个节点', nodes.length);
    }
}

function renderGraph(svgId) {
    const svg = document.getElementById(svgId);
    svg.innerHTML = '';
    svg.setAttribute('viewBox', '0 0 500 280');
    
    // 画边
    edges.forEach(edge => {
        const from = nodes.find(n => n.id === edge.from);
        const to = nodes.find(n => n.id === edge.to);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', from.x);
        line.setAttribute('y1', from.y);
        line.setAttribute('x2', to.x);
        line.setAttribute('y2', to.y);
        line.setAttribute('class', 'edge');
        line.setAttribute('id', `${svgId}-edge-${edge.from}-${edge.to}`);
        svg.appendChild(line);
    });
    
    // 画节点
    nodes.forEach(node => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'node');
        g.setAttribute('id', `${svgId}-node-${node.id}`);
        g.setAttribute('transform', `translate(${node.x}, ${node.y})`);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', 20);
        g.appendChild(circle);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.textContent = node.id;
        g.appendChild(text);
        
        svg.appendChild(g);
    });
    
    // 标记起点
    document.getElementById(`${svgId}-node-1`).classList.add('start');
}

function updatePanelVisibility() {
    if (mode === 'bfs') {
        bfsPanel.style.display = 'block';
        dfsPanel.style.display = 'none';
        bfsPanel.classList.add('single');
    } else if (mode === 'dfs') {
        bfsPanel.style.display = 'none';
        dfsPanel.style.display = 'block';
        dfsPanel.classList.add('single');
    } else {
        bfsPanel.style.display = 'block';
        dfsPanel.style.display = 'block';
        bfsPanel.classList.remove('single');
        dfsPanel.classList.remove('single');
    }
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

function getChildren(nodeId) {
    return edges.filter(e => e.from === nodeId).map(e => e.to);
}

function updateStatus(text) {
    statusText.textContent = window.I18n ? window.I18n.t(text) : text;
}

function renderDataStructure(containerId, items, currentItem = null) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'ds-item';
        if (item === currentItem) el.classList.add('current');
        el.textContent = item;
        container.appendChild(el);
    });
}

function renderVisitOrder(containerId, order) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    order.forEach((item, i) => {
        if (i > 0) {
            const arrow = document.createElement('span');
            arrow.className = 'order-arrow';
            arrow.textContent = '→';
            container.appendChild(arrow);
        }
        const el = document.createElement('div');
        el.className = 'ds-item visited';
        el.textContent = item;
        container.appendChild(el);
    });
}

async function bfs(svgId, queueId, orderId) {
    const queue = ['1'];
    const visited = new Set();
    const order = [];
    
    while (queue.length > 0 && isRunning) {
        renderDataStructure(queueId, queue, queue[0]);
        await delay(CONFIG.stepDelay);
        
        const current = queue.shift();
        if (visited.has(current)) continue;
        
        visited.add(current);
        order.push(current);
        
        // 高亮当前节点
        const nodeEl = document.getElementById(`${svgId}-node-${current}`);
        nodeEl.classList.remove('in-queue');
        nodeEl.classList.add('current');
        renderVisitOrder(orderId, order);
        updateStatus(window.I18n.t('BFS: 访问节点 {0}', current));
        
        await delay(CONFIG.stepDelay);
        
        // 添加子节点到队列
        const children = getChildren(current);
        for (const child of children) {
            if (!visited.has(child) && !queue.includes(child)) {
                queue.push(child);
                const childEl = document.getElementById(`${svgId}-node-${child}`);
                childEl.classList.add('in-queue');
                
                const edgeEl = document.getElementById(`${svgId}-edge-${current}-${child}`);
                if (edgeEl) edgeEl.classList.add('traversed');
            }
        }
        
        nodeEl.classList.remove('current');
        nodeEl.classList.add('visited');
        renderDataStructure(queueId, queue);
    }
    
    return order;
}

async function dfs(svgId, stackId, orderId) {
    const stack = ['1'];
    const visited = new Set();
    const order = [];
    
    while (stack.length > 0 && isRunning) {
        renderDataStructure(stackId, [...stack].reverse(), stack[stack.length - 1]);
        await delay(CONFIG.stepDelay);
        
        const current = stack.pop();
        if (visited.has(current)) continue;
        
        visited.add(current);
        order.push(current);
        
        // 高亮当前节点
        const nodeEl = document.getElementById(`${svgId}-node-${current}`);
        nodeEl.classList.remove('in-queue');
        nodeEl.classList.add('current');
        renderVisitOrder(orderId, order);
        updateStatus(window.I18n.t('DFS: 访问节点 {0}', current));
        
        await delay(CONFIG.stepDelay);
        
        // 添加子节点到栈（逆序以保持左到右顺序）
        const children = getChildren(current).reverse();
        for (const child of children) {
            if (!visited.has(child)) {
                stack.push(child);
                const childEl = document.getElementById(`${svgId}-node-${child}`);
                childEl.classList.add('in-queue');
                
                const edgeEl = document.getElementById(`${svgId}-edge-${current}-${child}`);
                if (edgeEl) edgeEl.classList.add('traversed');
            }
        }
        
        nodeEl.classList.remove('current');
        nodeEl.classList.add('visited');
        renderDataStructure(stackId, [...stack].reverse());
    }
    
    return order;
}

async function start() {
    if (isRunning) return;
    isRunning = true;
    isPaused = false;
    startBtn.disabled = true;
    if (pauseBtn) {
        pauseBtn.disabled = false;
        pauseBtn.textContent = window.I18n ? window.I18n.t('暂停') : '暂停';
        pauseBtn.classList.remove('paused');
    }
    
    // 重置图形
    renderGraph('bfsSvg');
    renderGraph('dfsSvg');
    document.getElementById('bfsQueue').innerHTML = '';
    document.getElementById('dfsStack').innerHTML = '';
    document.getElementById('bfsOrder').innerHTML = '';
    document.getElementById('dfsOrder').innerHTML = '';
    
    if (mode === 'bfs') {
        await bfs('bfsSvg', 'bfsQueue', 'bfsOrder');
        updateStatus('BFS遍历完成!');
        if (window.AlgoLogger) window.AlgoLogger.success('BFS遍历完成');
    } else if (mode === 'dfs') {
        await dfs('dfsSvg', 'dfsStack', 'dfsOrder');
        updateStatus('DFS遍历完成!');
        if (window.AlgoLogger) window.AlgoLogger.success('DFS遍历完成');
    } else {
        // 并行执行
        await Promise.all([
            bfs('bfsSvg', 'bfsQueue', 'bfsOrder'),
            dfs('dfsSvg', 'dfsStack', 'dfsOrder')
        ]);
        updateStatus('BFS/DFS对比完成!');
    }
    
    isRunning = false;
    isPaused = false;
    startBtn.disabled = false;
    if (pauseBtn) {
        pauseBtn.disabled = true;
        pauseBtn.classList.remove('paused');
    }
}

function reset() {
    isRunning = false;
    isPaused = false;
    startBtn.disabled = false;
    if (pauseBtn) {
        pauseBtn.disabled = true;
        pauseBtn.classList.remove('paused');
        pauseBtn.textContent = window.I18n ? window.I18n.t('暂停') : '暂停';
    }
    renderGraph('bfsSvg');
    renderGraph('dfsSvg');
    document.getElementById('bfsQueue').innerHTML = '';
    document.getElementById('dfsStack').innerHTML = '';
    document.getElementById('bfsOrder').innerHTML = '';
    document.getElementById('dfsOrder').innerHTML = '';
    updateStatus('选择模式后点击开始');
}

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isRunning) return;
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mode = btn.dataset.mode;
        updatePanelVisibility();
        reset();
    });
});

startBtn.addEventListener('click', start);
resetBtn.addEventListener('click', reset);
if (pauseBtn) {
    pauseBtn.addEventListener('click', togglePause);
}

// 等待 I18n 模块加载完成后初始化
if (document.readyState === 'complete') {
    setTimeout(init, 50);
} else {
    window.addEventListener('load', () => setTimeout(init, 50));
}
