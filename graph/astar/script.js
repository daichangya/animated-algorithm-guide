/**
 * A*寻路算法可视化
 * @author changyadai
 */

const CONFIG = {
    rows: 15,
    cols: 20,
    stepDelay: 50
};

let grid = [];
let startPos = { row: 7, col: 2 };
let endPos = { row: 7, col: 17 };
let isRunning = false;
let isDrawing = false;

const gridEl = document.getElementById('grid');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const clearWallsBtn = document.getElementById('clearWallsBtn');
const statusText = document.getElementById('statusText');

function init() {
    grid = [];
    for (let r = 0; r < CONFIG.rows; r++) {
        grid[r] = [];
        for (let c = 0; c < CONFIG.cols; c++) {
            grid[r][c] = {
                row: r, col: c,
                isWall: false,
                g: Infinity, h: 0, f: Infinity,
                parent: null
            };
        }
    }
    renderGrid();
}

function renderGrid() {
    gridEl.innerHTML = '';
    gridEl.style.gridTemplateColumns = `repeat(${CONFIG.cols}, 28px)`;
    
    for (let r = 0; r < CONFIG.rows; r++) {
        for (let c = 0; c < CONFIG.cols; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${r}-${c}`;
            
            if (r === startPos.row && c === startPos.col) {
                cell.classList.add('start');
            } else if (r === endPos.row && c === endPos.col) {
                cell.classList.add('end');
            } else if (grid[r][c].isWall) {
                cell.classList.add('wall');
            }
            
            cell.addEventListener('mousedown', () => startDrawing(r, c));
            cell.addEventListener('mouseenter', () => draw(r, c));
            cell.addEventListener('mouseup', stopDrawing);
            
            gridEl.appendChild(cell);
        }
    }
    
    document.addEventListener('mouseup', stopDrawing);
}

function startDrawing(r, c) {
    if (isRunning) return;
    if ((r === startPos.row && c === startPos.col) || 
        (r === endPos.row && c === endPos.col)) return;
    
    isDrawing = true;
    toggleWall(r, c);
}

function draw(r, c) {
    if (!isDrawing || isRunning) return;
    if ((r === startPos.row && c === startPos.col) || 
        (r === endPos.row && c === endPos.col)) return;
    
    if (!grid[r][c].isWall) {
        toggleWall(r, c);
    }
}

function stopDrawing() {
    isDrawing = false;
}

function toggleWall(r, c) {
    grid[r][c].isWall = !grid[r][c].isWall;
    const cell = document.getElementById(`cell-${r}-${c}`);
    cell.classList.toggle('wall');
}

function heuristic(a, b) {
    // 曼哈顿距离
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function getNeighbors(node) {
    const neighbors = [];
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    for (const [dr, dc] of dirs) {
        const nr = node.row + dr;
        const nc = node.col + dc;
        
        if (nr >= 0 && nr < CONFIG.rows && nc >= 0 && nc < CONFIG.cols) {
            if (!grid[nr][nc].isWall) {
                neighbors.push(grid[nr][nc]);
            }
        }
    }
    
    return neighbors;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateStatus(text) {
    statusText.textContent = text;
}

async function astar() {
    const start = grid[startPos.row][startPos.col];
    const end = grid[endPos.row][endPos.col];
    
    start.g = 0;
    start.h = heuristic(start, end);
    start.f = start.h;
    
    const openSet = [start];
    const closedSet = new Set();
    
    while (openSet.length > 0 && isRunning) {
        // 找f值最小的节点
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift();
        
        const currentId = `${current.row}-${current.col}`;
        
        if (current.row === end.row && current.col === end.col) {
            // 找到路径
            await reconstructPath(current);
            updateStatus('找到最短路径!');
            return true;
        }
        
        closedSet.add(currentId);
        
        // 更新UI
        const cellEl = document.getElementById(`cell-${current.row}-${current.col}`);
        if (current !== start) {
            cellEl.classList.remove('open');
            cellEl.classList.add('closed');
        }
        
        updateStatus(`探索节点 (${current.row}, ${current.col}), f=${current.f}`);
        
        // 检查邻居
        for (const neighbor of getNeighbors(current)) {
            const neighborId = `${neighbor.row}-${neighbor.col}`;
            
            if (closedSet.has(neighborId)) continue;
            
            const tentativeG = current.g + 1;
            
            if (tentativeG < neighbor.g) {
                neighbor.parent = current;
                neighbor.g = tentativeG;
                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                    
                    const neighborEl = document.getElementById(`cell-${neighbor.row}-${neighbor.col}`);
                    if (neighbor !== end) {
                        neighborEl.classList.add('open');
                    }
                }
            }
        }
        
        await delay(CONFIG.stepDelay);
    }
    
    updateStatus('未找到路径!');
    return false;
}

async function reconstructPath(endNode) {
    const path = [];
    let current = endNode;
    
    while (current) {
        path.unshift(current);
        current = current.parent;
    }
    
    for (const node of path) {
        if ((node.row === startPos.row && node.col === startPos.col) ||
            (node.row === endPos.row && node.col === endPos.col)) continue;
        
        const cellEl = document.getElementById(`cell-${node.row}-${node.col}`);
        cellEl.classList.remove('open', 'closed');
        cellEl.classList.add('path');
        await delay(30);
    }
}

async function start() {
    if (isRunning) return;
    isRunning = true;
    startBtn.disabled = true;
    
    // 重置状态但保留墙
    for (let r = 0; r < CONFIG.rows; r++) {
        for (let c = 0; c < CONFIG.cols; c++) {
            const node = grid[r][c];
            node.g = Infinity;
            node.h = 0;
            node.f = Infinity;
            node.parent = null;
            
            const cell = document.getElementById(`cell-${r}-${c}`);
            cell.classList.remove('open', 'closed', 'path', 'current');
        }
    }
    
    await astar();
    
    isRunning = false;
    startBtn.disabled = false;
}

function reset() {
    isRunning = false;
    startBtn.disabled = false;
    init();
    updateStatus('绘制障碍物后点击开始');
}

function clearWalls() {
    if (isRunning) return;
    for (let r = 0; r < CONFIG.rows; r++) {
        for (let c = 0; c < CONFIG.cols; c++) {
            grid[r][c].isWall = false;
        }
    }
    renderGrid();
}

startBtn.addEventListener('click', start);
resetBtn.addEventListener('click', reset);
clearWallsBtn.addEventListener('click', clearWalls);

init();
