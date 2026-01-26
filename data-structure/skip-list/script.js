/**
 * 跳跃表可视化动画控制
 * @author changyadai
 */

// ===== 跳跃表节点类 =====
class SkipListNode {
    constructor(key, level) {
        this.key = key;
        this.forward = new Array(level + 1).fill(null);
        this.level = level;
    }
}

// ===== 跳跃表类 =====
class SkipList {
    constructor(maxLevel = 6, p = 0.5) {
        this.maxLevel = maxLevel;
        this.p = p;
        this.level = 0;
        this.head = new SkipListNode(-Infinity, maxLevel);
    }
    
    randomLevel() {
        let level = 0;
        while (Math.random() < this.p && level < this.maxLevel) {
            level++;
        }
        return level;
    }
    
    search(key) {
        const path = [];
        let current = this.head;
        
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].key < key) {
                path.push({ node: current, level: i, action: 'right' });
                current = current.forward[i];
            }
            path.push({ node: current, level: i, action: 'down' });
        }
        
        current = current.forward[0];
        const found = current && current.key === key;
        
        if (found) {
            path.push({ node: current, level: 0, action: 'found' });
        }
        
        return { found, node: current, path };
    }
    
    insert(key) {
        const update = new Array(this.maxLevel + 1).fill(null);
        let current = this.head;
        
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].key < key) {
                current = current.forward[i];
            }
            update[i] = current;
        }
        
        // 检查是否已存在
        current = current.forward[0];
        if (current && current.key === key) {
            return null; // 已存在
        }
        
        const newLevel = this.randomLevel();
        
        if (newLevel > this.level) {
            for (let i = this.level + 1; i <= newLevel; i++) {
                update[i] = this.head;
            }
            this.level = newLevel;
        }
        
        const newNode = new SkipListNode(key, newLevel);
        
        for (let i = 0; i <= newLevel; i++) {
            newNode.forward[i] = update[i].forward[i];
            update[i].forward[i] = newNode;
        }
        
        return newNode;
    }
    
    delete(key) {
        const update = new Array(this.maxLevel + 1).fill(null);
        let current = this.head;
        
        for (let i = this.level; i >= 0; i--) {
            while (current.forward[i] && current.forward[i].key < key) {
                current = current.forward[i];
            }
            update[i] = current;
        }
        
        current = current.forward[0];
        
        if (!current || current.key !== key) {
            return false;
        }
        
        for (let i = 0; i <= this.level; i++) {
            if (update[i].forward[i] !== current) break;
            update[i].forward[i] = current.forward[i];
        }
        
        while (this.level > 0 && !this.head.forward[this.level]) {
            this.level--;
        }
        
        return true;
    }
    
    toArray() {
        const result = [];
        let current = this.head.forward[0];
        while (current) {
            result.push({
                key: current.key,
                level: current.level
            });
            current = current.forward[0];
        }
        return result;
    }
    
    getNodes() {
        const nodes = [];
        let current = this.head;
        while (current) {
            nodes.push(current);
            current = current.forward[0];
        }
        return nodes;
    }
}

// ===== 可视化配置 =====
const CONFIG = {
    nodeWidth: 50,
    nodeHeight: 32,
    levelHeight: 45,
    nodeGap: 15,
    leftPadding: 80,
    topPadding: 30,
    animationDuration: 350,
    colors: {
        levels: ['#22c55e', '#eab308', '#f97316', '#ef4444', '#ec4899', '#a855f7', '#8b5cf6', '#6366f1'],
        head: '#64748b',
        highlight: '#00d9ff',
        path: '#22c55e'
    }
};

// ===== 状态 =====
let skipList = new SkipList(6, 0.5);
let isAnimating = false;
let highlightPath = [];
let highlightedNode = null;

// ===== DOM 元素 =====
const svg = document.getElementById('skipListSvg');
const visualizationContainer = document.getElementById('visualizationContainer');
const levelLabels = document.getElementById('levelLabels');
const inputValue = document.getElementById('inputValue');
const insertBtn = document.getElementById('insertBtn');
const searchBtn = document.getElementById('searchBtn');
const deleteBtn = document.getElementById('deleteBtn');
const resetBtn = document.getElementById('resetBtn');
const randomBtn = document.getElementById('randomBtn');
const demoBtn = document.getElementById('demoBtn');
const probSelect = document.getElementById('probSelect');
const maxLevelSelect = document.getElementById('maxLevelSelect');
const statusText = document.getElementById('statusText');

// ===== 演示模式状态 =====
let isDemo = false;
let isDemoPaused = false;

// ===== 演示序列 =====
const DEMO_SEQUENCE = [
    { action: 'insert', value: 50 },
    { action: 'insert', value: 25 },
    { action: 'insert', value: 75 },
    { action: 'insert', value: 10 },
    { action: 'insert', value: 30 },
    { action: 'insert', value: 60 },
    { action: 'insert', value: 90 },
    { action: 'insert', value: 5 },
    { action: 'search', value: 60 },
    { action: 'delete', value: 25 }
];

// ===== 工具函数 =====
// 使用公共工具函数
const updateStatus = (text, ...args) => {
    if (window.AlgoUtils) {
        window.AlgoUtils.updateStatus(statusText, text, ...args);
    } else {
        let translated = window.I18n ? window.I18n.t(text) : text;
        args.forEach((arg, i) => {
            translated = translated.replace(`{${i}}`, arg);
        });
        statusText.textContent = translated;
    }
};

const delay = (ms) => {
    if (window.AlgoUtils) {
        return window.AlgoUtils.simpleDelay(ms);
    } else {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// ===== 渲染层级标签 =====
function renderLevelLabels() {
    levelLabels.innerHTML = '';
    const maxLevel = parseInt(maxLevelSelect.value);
    
    for (let i = maxLevel; i >= 0; i--) {
        const label = document.createElement('div');
        label.className = 'level-label';
        label.style.backgroundColor = CONFIG.colors.levels[i % CONFIG.colors.levels.length];
        label.textContent = `L${i}`;
        levelLabels.appendChild(label);
    }
}

// ===== 渲染 =====
function render() {
    const nodes = skipList.getNodes();
    const maxLevel = skipList.level;
    const displayMaxLevel = parseInt(maxLevelSelect.value);
    
    const width = Math.max(
        nodes.length * (CONFIG.nodeWidth + CONFIG.nodeGap) + CONFIG.leftPadding + 50,
        visualizationContainer.clientWidth - 40
    );
    const height = (displayMaxLevel + 1) * CONFIG.levelHeight + CONFIG.topPadding + 50;
    
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.innerHTML = '';
    
    // 定义渐变和标记
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // 为每个层级创建渐变
    CONFIG.colors.levels.forEach((color, i) => {
        defs.innerHTML += `
            <linearGradient id="levelGradient${i}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:${color}"/>
                <stop offset="100%" style="stop-color:${adjustColor(color, -30)}"/>
            </linearGradient>
        `;
    });
    
    defs.innerHTML += `
        <linearGradient id="headGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#94a3b8"/>
            <stop offset="100%" style="stop-color:#475569"/>
        </linearGradient>
        <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#22d3ee"/>
            <stop offset="100%" style="stop-color:#0891b2"/>
        </linearGradient>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#888"/>
        </marker>
        <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    `;
    svg.appendChild(defs);
    
    // 绘制节点和连接
    nodes.forEach((node, index) => {
        const x = CONFIG.leftPadding + index * (CONFIG.nodeWidth + CONFIG.nodeGap);
        
        // 绘制每一层
        for (let level = 0; level <= (node === skipList.head ? displayMaxLevel : node.level); level++) {
            const y = CONFIG.topPadding + (displayMaxLevel - level) * CONFIG.levelHeight;
            
            // 绘制到下一个节点的连接线
            if (node.forward[level]) {
                const nextIndex = nodes.indexOf(node.forward[level]);
                const nextX = CONFIG.leftPadding + nextIndex * (CONFIG.nodeWidth + CONFIG.nodeGap);
                
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x + CONFIG.nodeWidth);
                line.setAttribute('y1', y + CONFIG.nodeHeight / 2);
                line.setAttribute('x2', nextX);
                line.setAttribute('y2', y + CONFIG.nodeHeight / 2);
                line.setAttribute('stroke', CONFIG.colors.levels[level % CONFIG.colors.levels.length]);
                line.setAttribute('stroke-width', '2');
                line.setAttribute('opacity', '0.6');
                line.setAttribute('marker-end', 'url(#arrowhead)');
                svg.appendChild(line);
            }
            
            // 绘制节点
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.classList.add('skiplist-node');
            
            const isHead = node === skipList.head;
            const isHighlighted = highlightedNode === node;
            const isInPath = highlightPath.some(p => p.node === node && p.level === level);
            
            let fill = isHead ? 'url(#headGradient)' : `url(#levelGradient${level % CONFIG.colors.levels.length})`;
            if (isHighlighted) fill = 'url(#highlightGradient)';
            
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', x);
            rect.setAttribute('y', y);
            rect.setAttribute('width', CONFIG.nodeWidth);
            rect.setAttribute('height', CONFIG.nodeHeight);
            rect.setAttribute('rx', '6');
            rect.setAttribute('fill', fill);
            
            if (isInPath) {
                rect.setAttribute('stroke', CONFIG.colors.highlight);
                rect.setAttribute('stroke-width', '3');
                rect.setAttribute('filter', 'url(#glow)');
            }
            
            g.appendChild(rect);
            
            // 节点文本
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x + CONFIG.nodeWidth / 2);
            text.setAttribute('y', y + CONFIG.nodeHeight / 2 + 5);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', 'white');
            text.setAttribute('font-size', '13');
            text.setAttribute('font-weight', '600');
            text.textContent = isHead ? 'HEAD' : node.key;
            g.appendChild(text);
            
            svg.appendChild(g);
        }
        
        // 绘制垂直连接线（塔）
        if (node !== skipList.head && node.level > 0) {
            for (let level = 0; level < node.level; level++) {
                const y1 = CONFIG.topPadding + (displayMaxLevel - level) * CONFIG.levelHeight + CONFIG.nodeHeight;
                const y2 = CONFIG.topPadding + (displayMaxLevel - level - 1) * CONFIG.levelHeight;
                
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x + CONFIG.nodeWidth / 2);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x + CONFIG.nodeWidth / 2);
                line.setAttribute('y2', y2);
                line.setAttribute('stroke', '#666');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('stroke-dasharray', '3,2');
                svg.insertBefore(line, svg.firstChild);
            }
        }
    });
}

function adjustColor(hex, amount) {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

// ===== 操作 =====
async function insert() {
    const value = parseInt(inputValue.value);
    if (isNaN(value) || value < 1 || value > 999) {
        updateStatus('请输入1-999之间的有效数值');
        return;
    }
    
    if (isAnimating) return;
    isAnimating = true;
    
    updateStatus('正在插入: {0}', value);
    if (window.AlgoLogger) window.AlgoLogger.step('插入操作: {0}', value);
    
    const result = skipList.insert(value);
    
    if (result) {
        highlightedNode = result;
        render();
        await delay(CONFIG.animationDuration * 2);
        highlightedNode = null;
        render();
        updateStatus('插入完成: {0} (层级: {1})', value, result.level);
        if (window.AlgoLogger) window.AlgoLogger.success('插入成功: {0}, 层级: {1}', value, result.level);
    } else {
        updateStatus('{0} 已存在', value);
        if (window.AlgoLogger) window.AlgoLogger.warn('值已存在: {0}', value);
    }
    
    inputValue.value = '';
    isAnimating = false;
}

async function search() {
    const value = parseInt(inputValue.value);
    if (isNaN(value)) {
        updateStatus('请输入有效的数值');
        return;
    }
    
    if (isAnimating) return;
    isAnimating = true;
    
    updateStatus('正在查找: {0}', value);
    if (window.AlgoLogger) window.AlgoLogger.step('查找操作: {0}', value);
    highlightPath = [];
    highlightedNode = null;
    
    const result = skipList.search(value);
    
    // 逐步显示搜索路径
    for (const step of result.path) {
        highlightPath.push(step);
        render();
        await delay(CONFIG.animationDuration);
    }
    
    if (result.found) {
        highlightedNode = result.node;
        render();
        updateStatus('找到: {0}', value);
        if (window.AlgoLogger) window.AlgoLogger.success('查找成功: {0}', value);
    } else {
        updateStatus('未找到: {0}', value);
        if (window.AlgoLogger) window.AlgoLogger.warn('未找到: {0}', value);
    }
    
    await delay(CONFIG.animationDuration * 2);
    highlightPath = [];
    highlightedNode = null;
    render();
    isAnimating = false;
}

async function deleteValue() {
    const value = parseInt(inputValue.value);
    if (isNaN(value)) {
        updateStatus('请输入有效的数值');
        return;
    }
    
    if (isAnimating) return;
    isAnimating = true;
    
    updateStatus('正在删除: {0}', value);
    if (window.AlgoLogger) window.AlgoLogger.step('删除操作: {0}', value);
    
    if (skipList.delete(value)) {
        render();
        await delay(CONFIG.animationDuration);
        updateStatus('删除完成: {0}', value);
        if (window.AlgoLogger) window.AlgoLogger.success('删除成功: {0}', value);
    } else {
        updateStatus('未找到: {0}', value);
        if (window.AlgoLogger) window.AlgoLogger.warn('删除失败: {0} 不存在', value);
    }
    
    inputValue.value = '';
    isAnimating = false;
}

function reset() {
    const maxLevel = parseInt(maxLevelSelect.value);
    const p = parseFloat(probSelect.value);
    
    skipList = new SkipList(maxLevel, p);
    highlightPath = [];
    highlightedNode = null;
    isAnimating = false;
    inputValue.value = '';
    
    renderLevelLabels();
    render();
    updateStatus('数据结构已初始化');
    
    // 日志记录
    if (window.AlgoLogger) {
        window.AlgoLogger.clear();
        window.AlgoLogger.info('跳跃表初始化: 最大层数={0}, 概率={1}', maxLevel, p);
    }
}

function generateRandom() {
    reset();
    
    const count = Math.floor(Math.random() * 8) + 5;
    const values = new Set();
    
    while (values.size < count) {
        values.add(Math.floor(Math.random() * 99) + 1);
    }
    
    for (const val of Array.from(values).sort((a, b) => a - b)) {
        skipList.insert(val);
    }
    
    render();
    updateStatus('已生成 {0} 个随机值', count);
    
    // 日志记录
    if (window.AlgoLogger) {
        window.AlgoLogger.success('随机生成 {0} 个值', count);
        window.AlgoLogger.log('数据: [{0}]', Array.from(values).sort((a, b) => a - b).join(', '));
    }
}

// ===== 演示功能 =====
async function runDemo() {
    if (isDemo) {
        // 如果已在演示中，切换暂停/继续
        if (isDemoPaused) {
            isDemoPaused = false;
            demoBtn.textContent = window.I18n ? window.I18n.t('⏸ 暂停') : '⏸ 暂停';
            return;
        } else {
            isDemoPaused = true;
            demoBtn.textContent = window.I18n ? window.I18n.t('▶ 继续') : '▶ 继续';
            updateStatus('演示已暂停');
            return;
        }
    }
    
    // 开始新演示
    reset();
    isDemo = true;
    isDemoPaused = false;
    
    // 禁用其他按钮
    insertBtn.disabled = true;
    searchBtn.disabled = true;
    deleteBtn.disabled = true;
    randomBtn.disabled = true;
    resetBtn.disabled = true;
    probSelect.disabled = true;
    maxLevelSelect.disabled = true;
    demoBtn.textContent = window.I18n ? window.I18n.t('⏸ 暂停') : '⏸ 暂停';
    
    updateStatus('演示开始...');
    
    for (const step of DEMO_SEQUENCE) {
        // 检查暂停
        while (isDemoPaused) {
            await delay(100);
            if (!isDemo) break;
        }
        if (!isDemo) break;
        
        if (step.action === 'insert') {
            updateStatus('正在插入: {0}', step.value);
            skipList.insert(step.value);
            highlightPath = [];
            highlightedNode = null;
            render();
            await delay(CONFIG.animationDuration * 2);
        } else if (step.action === 'search') {
            updateStatus('正在查找: {0}', step.value);
            highlightPath = [];
            highlightedNode = null;
            
            // 模拟搜索路径
            let current = skipList.head;
            const path = [];
            
            for (let i = skipList.level; i >= 0; i--) {
                while (current.forward[i] && current.forward[i].value < step.value) {
                    path.push({ node: current, level: i });
                    current = current.forward[i];
                }
                path.push({ node: current, level: i });
            }
            
            // 逐步显示搜索路径
            for (const p of path) {
                highlightPath = path.slice(0, path.indexOf(p) + 1);
                render();
                await delay(CONFIG.animationDuration / 2);
                if (!isDemo) break;
            }
            
            if (current.forward[0] && current.forward[0].value === step.value) {
                highlightedNode = current.forward[0];
                render();
                updateStatus('找到: {0}', step.value);
            } else {
                updateStatus('未找到: {0}', step.value);
            }
            await delay(CONFIG.animationDuration * 2);
            highlightPath = [];
            highlightedNode = null;
            render();
        } else if (step.action === 'delete') {
            updateStatus('正在删除: {0}', step.value);
            skipList.delete(step.value);
            highlightPath = [];
            highlightedNode = null;
            render();
            await delay(CONFIG.animationDuration * 2);
        }
    }
    
    // 演示结束
    isDemo = false;
    isDemoPaused = false;
    insertBtn.disabled = false;
    searchBtn.disabled = false;
    deleteBtn.disabled = false;
    randomBtn.disabled = false;
    resetBtn.disabled = false;
    probSelect.disabled = false;
    maxLevelSelect.disabled = false;
    demoBtn.textContent = window.I18n ? window.I18n.t('▶ 演示') : '▶ 演示';
    updateStatus('演示完成');
}

function stopDemo() {
    isDemo = false;
    isDemoPaused = false;
    insertBtn.disabled = false;
    searchBtn.disabled = false;
    deleteBtn.disabled = false;
    randomBtn.disabled = false;
    resetBtn.disabled = false;
    probSelect.disabled = false;
    maxLevelSelect.disabled = false;
    demoBtn.textContent = window.I18n ? window.I18n.t('▶ 演示') : '▶ 演示';
}

// ===== 事件监听 =====
insertBtn.addEventListener('click', insert);
searchBtn.addEventListener('click', search);
deleteBtn.addEventListener('click', deleteValue);
resetBtn.addEventListener('click', () => {
    stopDemo();
    reset();
});
randomBtn.addEventListener('click', generateRandom);
demoBtn.addEventListener('click', runDemo);
probSelect.addEventListener('change', () => {
    stopDemo();
    reset();
});
maxLevelSelect.addEventListener('change', () => {
    stopDemo();
    reset();
});

inputValue.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') insert();
});

window.addEventListener('resize', () => {
    render();
});

// 初始化 - 等待 I18n 模块加载完成
renderLevelLabels();
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(reset, 0));
} else {
    setTimeout(reset, 0);  // 确保模块脚本先执行
}
