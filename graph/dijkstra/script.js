/**
 * Dijkstra最短路径可视化
 * @author changyadai
 */

const CONFIG = {
    stepDelay: 600,
    nodeRadius: 25
};

// 图数据
const nodes = [
    { id: 'A', x: 100, y: 200 },
    { id: 'B', x: 250, y: 80 },
    { id: 'C', x: 250, y: 320 },
    { id: 'D', x: 450, y: 80 },
    { id: 'E', x: 450, y: 320 },
    { id: 'F', x: 600, y: 200 }
];

const edges = [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 8 },
    { from: 'C', to: 'E', weight: 10 },
    { from: 'D', to: 'E', weight: 2 },
    { from: 'D', to: 'F', weight: 6 },
    { from: 'E', to: 'F', weight: 3 }
];

let startNode = 'A';
let distances = {};
let previous = {};
let visited = new Set();
let isRunning = false;
let isPaused = false;

const svg = document.getElementById('graphSvg');
const distanceTable = document.getElementById('distanceTable');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const pauseBtn = document.getElementById('pauseBtn');
const statusText = document.getElementById('statusText');

function init() {
    renderGraph();
    initDistances();
    renderDistanceTable();
    updateStatus('点击节点选择起点，然后开始算法');
    
    // 日志记录
    if (window.AlgoLogger) {
        window.AlgoLogger.clear();
        window.AlgoLogger.info('图数据已初始化: {0} 个节点', nodes.length);
        window.AlgoLogger.log('节点: [{0}]', nodes.map(n => n.id).join(', '));
        window.AlgoLogger.log('边: [{0}]', edges.map(e => `${e.from}→${e.to}(w:${e.weight})`).join(', '));
    }
}

function renderGraph() {
    const width = svg.clientWidth || 700;
    const height = 400;
    
    svg.innerHTML = '';
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    
    // 画边
    edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', fromNode.x);
        line.setAttribute('y1', fromNode.y);
        line.setAttribute('x2', toNode.x);
        line.setAttribute('y2', toNode.y);
        line.setAttribute('class', 'edge');
        line.setAttribute('id', `edge-${edge.from}-${edge.to}`);
        svg.appendChild(line);
        
        // 权重标签
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', midX);
        text.setAttribute('y', midY - 8);
        text.setAttribute('class', 'weight-label');
        text.setAttribute('id', `weight-${edge.from}-${edge.to}`);
        text.textContent = edge.weight;
        svg.appendChild(text);
    });
    
    // 画节点
    nodes.forEach(node => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'node');
        g.setAttribute('id', `node-${node.id}`);
        g.setAttribute('transform', `translate(${node.x}, ${node.y})`);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', CONFIG.nodeRadius);
        g.appendChild(circle);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.textContent = node.id;
        g.appendChild(text);
        
        g.addEventListener('click', () => selectStartNode(node.id));
        svg.appendChild(g);
    });
    
    highlightStartNode();
}

function selectStartNode(nodeId) {
    if (isRunning) return;
    startNode = nodeId;
    highlightStartNode();
    initDistances();
    renderDistanceTable();
    updateStatus('已选择起点: {0}', nodeId);
}

function highlightStartNode() {
    document.querySelectorAll('.node').forEach(n => n.classList.remove('start'));
    const startEl = document.getElementById(`node-${startNode}`);
    if (startEl) startEl.classList.add('start');
}

function initDistances() {
    distances = {};
    previous = {};
    visited = new Set();
    
    nodes.forEach(node => {
        distances[node.id] = node.id === startNode ? 0 : Infinity;
        previous[node.id] = null;
    });
}

function renderDistanceTable() {
    distanceTable.innerHTML = '';
    
    nodes.forEach(node => {
        const item = document.createElement('div');
        item.className = 'dist-item';
        item.id = `dist-${node.id}`;
        
        if (node.id === startNode) item.classList.add('start');
        if (visited.has(node.id)) item.classList.add('finalized');
        
        const nodeLabel = document.createElement('div');
        nodeLabel.className = 'dist-node';
        nodeLabel.textContent = node.id;
        
        const distValue = document.createElement('div');
        distValue.className = 'dist-value';
        distValue.id = `dist-val-${node.id}`;
        
        if (distances[node.id] === Infinity) {
            distValue.textContent = '∞';
            distValue.classList.add('infinity');
        } else {
            distValue.textContent = distances[node.id];
        }
        
        item.appendChild(nodeLabel);
        item.appendChild(distValue);
        distanceTable.appendChild(item);
    });
}

// 使用公共工具函数
const updateStatus = (text, ...args) => {
    if (window.AlgoUtils) {
        window.AlgoUtils.updateStatus(statusText, text, ...args);
    } else {
        statusText.textContent = window.I18n ? window.I18n.t(text, ...args) : text;
    }
};

const delay = (ms) => {
    if (window.AlgoUtils) {
        return window.AlgoUtils.delay(ms, () => isRunning, () => isPaused);
    } else {
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
};

function togglePause() {
    if (window.AlgoUtils) {
        window.AlgoUtils.togglePause({
            getIsPaused: () => isPaused,
            setIsPaused: (val) => { isPaused = val; },
            pauseBtn: pauseBtn,
            statusEl: statusText
        });
    } else {
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
}

function getMinDistanceNode() {
    let minDist = Infinity;
    let minNode = null;
    
    for (const node of nodes) {
        if (!visited.has(node.id) && distances[node.id] < minDist) {
            minDist = distances[node.id];
            minNode = node.id;
        }
    }
    
    return minNode;
}

function getNeighbors(nodeId) {
    const neighbors = [];
    edges.forEach(edge => {
        if (edge.from === nodeId && !visited.has(edge.to)) {
            neighbors.push({ node: edge.to, weight: edge.weight });
        }
        if (edge.to === nodeId && !visited.has(edge.from)) {
            neighbors.push({ node: edge.from, weight: edge.weight });
        }
    });
    return neighbors;
}

async function dijkstra() {
    while (true) {
        if (!isRunning) return;
        
        const current = getMinDistanceNode();
        if (current === null) break;
        
        // 高亮当前节点
        const nodeEl = document.getElementById(`node-${current}`);
        const distEl = document.getElementById(`dist-${current}`);
        nodeEl.classList.add('current');
        distEl.classList.add('current');
        
        updateStatus('处理节点 {0}，当前距离: {1}', current, distances[current]);
        if (window.AlgoLogger) window.AlgoLogger.log('访问节点 {0}, 距离: {1}', current, distances[current]);
        await delay(CONFIG.stepDelay);
        
        // 检查邻居
        const neighbors = getNeighbors(current);
        
        for (const neighbor of neighbors) {
            if (!isRunning) return;
            
            // 高亮正在检查的边
            const edgeId1 = `edge-${current}-${neighbor.node}`;
            const edgeId2 = `edge-${neighbor.node}-${current}`;
            const edgeEl = document.getElementById(edgeId1) || document.getElementById(edgeId2);
            if (edgeEl) edgeEl.classList.add('considering');
            
            const newDist = distances[current] + neighbor.weight;
            
            updateStatus('检查边 {0}-{1}，新距离: {2} + {3} = {4}', current, neighbor.node, distances[current], neighbor.weight, newDist);
            await delay(CONFIG.stepDelay);
            
            if (newDist < distances[neighbor.node]) {
                distances[neighbor.node] = newDist;
                previous[neighbor.node] = current;
                
                // 更新距离显示
                const neighborDistEl = document.getElementById(`dist-${neighbor.node}`);
                const neighborValEl = document.getElementById(`dist-val-${neighbor.node}`);
                neighborValEl.textContent = newDist;
                neighborValEl.classList.remove('infinity');
                neighborDistEl.classList.add('updated');
                
                if (edgeEl) {
                    edgeEl.classList.remove('considering');
                    edgeEl.classList.add('relaxed');
                }
                
                updateStatus('更新 {0} 的距离: {1}', neighbor.node, newDist);
                await delay(CONFIG.stepDelay / 2);
                
                neighborDistEl.classList.remove('updated');
            } else {
                if (edgeEl) edgeEl.classList.remove('considering');
            }
        }
        
        // 标记节点为已访问
        visited.add(current);
        nodeEl.classList.remove('current');
        nodeEl.classList.add('finalized');
        distEl.classList.remove('current');
        distEl.classList.add('finalized');
        
        await delay(CONFIG.stepDelay / 2);
    }
    
    // 高亮最短路径
    await highlightShortestPaths();
    updateStatus('算法完成! 所有最短路径已找到');
    if (window.AlgoLogger) window.AlgoLogger.success('算法完成: 所有最短路径已找到');
}

async function highlightShortestPaths() {
    // 清除所有边的高亮
    document.querySelectorAll('.edge').forEach(e => {
        e.classList.remove('considering', 'relaxed');
    });
    
    // 高亮所有最短路径边
    for (const node of nodes) {
        if (previous[node.id]) {
            const from = previous[node.id];
            const to = node.id;
            const edgeEl = document.getElementById(`edge-${from}-${to}`) || 
                          document.getElementById(`edge-${to}-${from}`);
            if (edgeEl) {
                edgeEl.classList.add('path');
                await delay(200);
            }
        }
    }
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
    
    // 重置状态
    initDistances();
    renderDistanceTable();
    document.querySelectorAll('.node').forEach(n => {
        n.classList.remove('current', 'visited', 'finalized');
    });
    document.querySelectorAll('.edge').forEach(e => {
        e.classList.remove('considering', 'relaxed', 'path');
    });
    highlightStartNode();
    
    await dijkstra();
    
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
    
    initDistances();
    renderGraph();
    renderDistanceTable();
    updateStatus('点击节点选择起点，然后开始算法');
}

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
