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

const svg = document.getElementById('graphSvg');
const distanceTable = document.getElementById('distanceTable');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const statusText = document.getElementById('statusText');

function init() {
    renderGraph();
    initDistances();
    renderDistanceTable();
    updateStatus('点击节点选择起点，然后开始算法');
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
    updateStatus(`已选择起点: ${nodeId}`);
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

function updateStatus(text) {
    statusText.textContent = text;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
        
        updateStatus(`处理节点 ${current}，当前距离: ${distances[current]}`);
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
            
            updateStatus(`检查边 ${current}-${neighbor.node}，新距离: ${distances[current]} + ${neighbor.weight} = ${newDist}`);
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
                
                updateStatus(`更新 ${neighbor.node} 的距离: ${newDist}`);
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
    startBtn.disabled = true;
    
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
    startBtn.disabled = false;
}

function reset() {
    isRunning = false;
    startBtn.disabled = false;
    
    initDistances();
    renderGraph();
    renderDistanceTable();
    updateStatus('点击节点选择起点，然后开始算法');
}

startBtn.addEventListener('click', start);
resetBtn.addEventListener('click', reset);

init();
