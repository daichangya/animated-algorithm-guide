/**
 * B+树可视化动画控制
 * @author changyadai
 */

// ===== B+树节点类 =====
class BPlusNode {
    constructor(leaf = true) {
        this.keys = [];
        this.children = [];
        this.leaf = leaf;
        this.next = null;  // 叶子节点链表
        this.x = 0;
        this.y = 0;
        this.width = 0;
    }
}

// ===== B+树类 =====
class BPlusTree {
    constructor(order = 4) {
        this.root = new BPlusNode();
        this.order = order;
        this.minKeys = Math.ceil(order / 2) - 1;
    }
    
    search(key) {
        let node = this.root;
        const path = [node];
        
        while (!node.leaf) {
            let i = 0;
            while (i < node.keys.length && key >= node.keys[i]) {
                i++;
            }
            node = node.children[i];
            path.push(node);
        }
        
        const index = node.keys.indexOf(key);
        return {
            found: index !== -1,
            node,
            index,
            path
        };
    }
    
    insert(key) {
        if (this.search(key).found) return false;
        
        let node = this.root;
        
        // 如果根节点满了，先分裂
        if (node.keys.length === this.order - 1) {
            const newRoot = new BPlusNode(false);
            newRoot.children.push(this.root);
            this.splitChild(newRoot, 0);
            this.root = newRoot;
        }
        
        this.insertNonFull(this.root, key);
        return true;
    }
    
    splitChild(parent, index) {
        const child = parent.children[index];
        const mid = Math.floor(this.order / 2);
        
        const newNode = new BPlusNode(child.leaf);
        
        if (child.leaf) {
            // 叶子节点：复制中间键到新节点
            newNode.keys = child.keys.splice(mid);
            newNode.children = child.children.splice(mid);
            
            // 维护叶子链表
            newNode.next = child.next;
            child.next = newNode;
            
            // 提升第一个新节点的键
            parent.keys.splice(index, 0, newNode.keys[0]);
            parent.children.splice(index + 1, 0, newNode);
        } else {
            // 内部节点：中间键提升
            const promotedKey = child.keys[mid];
            newNode.keys = child.keys.splice(mid + 1);
            newNode.children = child.children.splice(mid + 1);
            child.keys.pop();
            
            parent.keys.splice(index, 0, promotedKey);
            parent.children.splice(index + 1, 0, newNode);
        }
    }
    
    insertNonFull(node, key) {
        if (node.leaf) {
            // 在叶子节点插入
            let i = 0;
            while (i < node.keys.length && key > node.keys[i]) {
                i++;
            }
            node.keys.splice(i, 0, key);
            node.children.splice(i, 0, key); // 在B+树中，叶子的children存储实际数据
        } else {
            // 找到正确的子节点
            let i = 0;
            while (i < node.keys.length && key >= node.keys[i]) {
                i++;
            }
            
            if (node.children[i].keys.length === this.order - 1) {
                this.splitChild(node, i);
                if (key >= node.keys[i]) {
                    i++;
                }
            }
            this.insertNonFull(node.children[i], key);
        }
    }
    
    rangeQuery(start, end) {
        const result = this.search(start);
        let node = result.node;
        
        // 找到第一个 >= start 的位置
        let i = 0;
        while (i < node.keys.length && node.keys[i] < start) {
            i++;
        }
        
        const results = [];
        
        while (node) {
            while (i < node.keys.length) {
                if (node.keys[i] > end) {
                    return results;
                }
                if (node.keys[i] >= start) {
                    results.push(node.keys[i]);
                }
                i++;
            }
            node = node.next;
            i = 0;
        }
        
        return results;
    }
    
    delete(key) {
        const result = this.search(key);
        if (!result.found) return false;
        
        this.deleteFromNode(this.root, key);
        
        if (this.root.keys.length === 0 && !this.root.leaf) {
            this.root = this.root.children[0];
        }
        
        return true;
    }
    
    deleteFromNode(node, key) {
        if (node.leaf) {
            const index = node.keys.indexOf(key);
            if (index !== -1) {
                node.keys.splice(index, 1);
                node.children.splice(index, 1);
                return true;
            }
            return false;
        }
        
        let i = 0;
        while (i < node.keys.length && key >= node.keys[i]) {
            i++;
        }
        
        const child = node.children[i];
        
        if (child.keys.length <= this.minKeys) {
            this.rebalance(node, i);
            // 重新定位
            i = 0;
            while (i < node.keys.length && key >= node.keys[i]) {
                i++;
            }
        }
        
        return this.deleteFromNode(node.children[i], key);
    }
    
    rebalance(parent, childIndex) {
        const child = parent.children[childIndex];
        const leftSibling = childIndex > 0 ? parent.children[childIndex - 1] : null;
        const rightSibling = childIndex < parent.children.length - 1 ? parent.children[childIndex + 1] : null;
        
        if (leftSibling && leftSibling.keys.length > this.minKeys) {
            // 从左兄弟借
            if (child.leaf) {
                child.keys.unshift(leftSibling.keys.pop());
                child.children.unshift(leftSibling.children.pop());
                parent.keys[childIndex - 1] = child.keys[0];
            } else {
                child.keys.unshift(parent.keys[childIndex - 1]);
                parent.keys[childIndex - 1] = leftSibling.keys.pop();
                child.children.unshift(leftSibling.children.pop());
            }
        } else if (rightSibling && rightSibling.keys.length > this.minKeys) {
            // 从右兄弟借
            if (child.leaf) {
                child.keys.push(rightSibling.keys.shift());
                child.children.push(rightSibling.children.shift());
                parent.keys[childIndex] = rightSibling.keys[0];
            } else {
                child.keys.push(parent.keys[childIndex]);
                parent.keys[childIndex] = rightSibling.keys.shift();
                child.children.push(rightSibling.children.shift());
            }
        } else if (leftSibling) {
            // 与左兄弟合并
            if (child.leaf) {
                leftSibling.keys = leftSibling.keys.concat(child.keys);
                leftSibling.children = leftSibling.children.concat(child.children);
                leftSibling.next = child.next;
            } else {
                leftSibling.keys.push(parent.keys[childIndex - 1]);
                leftSibling.keys = leftSibling.keys.concat(child.keys);
                leftSibling.children = leftSibling.children.concat(child.children);
            }
            parent.keys.splice(childIndex - 1, 1);
            parent.children.splice(childIndex, 1);
        } else if (rightSibling) {
            // 与右兄弟合并
            if (child.leaf) {
                child.keys = child.keys.concat(rightSibling.keys);
                child.children = child.children.concat(rightSibling.children);
                child.next = rightSibling.next;
            } else {
                child.keys.push(parent.keys[childIndex]);
                child.keys = child.keys.concat(rightSibling.keys);
                child.children = child.children.concat(rightSibling.children);
            }
            parent.keys.splice(childIndex, 1);
            parent.children.splice(childIndex + 1, 1);
        }
    }
    
    getLeaves() {
        let node = this.root;
        while (!node.leaf) {
            node = node.children[0];
        }
        
        const leaves = [];
        while (node) {
            leaves.push(node);
            node = node.next;
        }
        return leaves;
    }
}

// ===== 可视化配置 =====
const CONFIG = {
    nodeHeight: 36,
    keyWidth: 40,
    keyGap: 3,
    levelGap: 65,
    nodeGap: 25,
    animationDuration: 400,
    colors: {
        internal: '#0ea5e9',
        leaf: '#22c55e',
        leafLink: '#22c55e',
        highlight: '#eab308',
        range: '#a855f7'
    }
};

// ===== 状态 =====
let tree = new BPlusTree(4);
let isAnimating = false;
let highlightedNodes = [];
let rangeHighlight = [];

// ===== DOM 元素 =====
const svg = document.getElementById('treeSvg');
const visualizationContainer = document.getElementById('visualizationContainer');
const inputValue = document.getElementById('inputValue');
const insertBtn = document.getElementById('insertBtn');
const searchBtn = document.getElementById('searchBtn');
const rangeBtn = document.getElementById('rangeBtn');
const deleteBtn = document.getElementById('deleteBtn');
const resetBtn = document.getElementById('resetBtn');
const randomBtn = document.getElementById('randomBtn');
const demoBtn = document.getElementById('demoBtn');
const orderSelect = document.getElementById('orderSelect');
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
    { action: 'insert', value: 35 },
    { action: 'insert', value: 40 },
    { action: 'range', start: 25, end: 50 },
    { action: 'delete', value: 30 }
];

// ===== 工具函数 =====
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateStatus(text, ...args) {
    let translated = window.I18n ? window.I18n.t(text) : text;
    // 支持占位符替换：{0}, {1}, ...
    args.forEach((arg, i) => {
        translated = translated.replace(`{${i}}`, arg);
    });
    statusText.textContent = translated;
}

// ===== 布局计算 =====
function calculateLayout(node, level = 0, leftBound = 0) {
    if (!node) return leftBound;
    
    node.y = level * CONFIG.levelGap + 50;
    node.width = node.keys.length * CONFIG.keyWidth + (node.keys.length - 1) * CONFIG.keyGap + 16;
    
    if (node.leaf || node.children.length === 0) {
        node.x = leftBound;
        return leftBound + node.width + CONFIG.nodeGap;
    }
    
    let currentLeft = leftBound;
    const childPositions = [];
    
    for (const child of node.children) {
        const childWidth = child.keys.length * CONFIG.keyWidth + 16;
        const childCenter = currentLeft + childWidth / 2;
        childPositions.push(childCenter);
        currentLeft = calculateLayout(child, level + 1, currentLeft);
    }
    
    const firstChildCenter = childPositions[0];
    const lastChildCenter = childPositions[childPositions.length - 1];
    node.x = (firstChildCenter + lastChildCenter) / 2 - node.width / 2;
    
    return currentLeft;
}

function getTreeHeight(node) {
    if (!node || node.leaf) return 1;
    let maxHeight = 0;
    for (const child of node.children) {
        maxHeight = Math.max(maxHeight, getTreeHeight(child));
    }
    return maxHeight + 1;
}

// ===== 渲染 =====
function render() {
    const totalWidth = calculateLayout(tree.root);
    const height = getTreeHeight(tree.root) * CONFIG.levelGap + 120;
    
    svg.setAttribute('width', Math.max(totalWidth + 50, visualizationContainer.clientWidth - 40));
    svg.setAttribute('height', height);
    svg.innerHTML = '';
    
    // 定义渐变
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
        <linearGradient id="internalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#38bdf8"/>
            <stop offset="100%" style="stop-color:#0284c7"/>
        </linearGradient>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#4ade80"/>
            <stop offset="100%" style="stop-color:#16a34a"/>
        </linearGradient>
        <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#fcd34d"/>
            <stop offset="100%" style="stop-color:#d97706"/>
        </linearGradient>
        <linearGradient id="rangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#c084fc"/>
            <stop offset="100%" style="stop-color:#9333ea"/>
        </linearGradient>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="${CONFIG.colors.leafLink}"/>
        </marker>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.25"/>
        </filter>
    `;
    svg.appendChild(defs);
    
    renderNode(tree.root);
    renderLeafLinks();
}

function renderNode(node, parent = null) {
    if (!node) return;
    
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('bplus-node');
    
    // 绘制到父节点的连接线
    if (parent) {
        const parentCenterX = parent.x + parent.width / 2;
        const childCenterX = node.x + node.width / 2;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const startY = parent.y + CONFIG.nodeHeight;
        const endY = node.y;
        const midY = (startY + endY) / 2;
        
        line.setAttribute('d', `M ${parentCenterX} ${startY} C ${parentCenterX} ${midY}, ${childCenterX} ${midY}, ${childCenterX} ${endY}`);
        line.setAttribute('stroke', node.leaf ? CONFIG.colors.leaf : CONFIG.colors.internal);
        line.setAttribute('stroke-width', '2');
        line.setAttribute('fill', 'none');
        line.setAttribute('opacity', '0.5');
        svg.insertBefore(line, svg.firstChild);
    }
    
    // 确定节点样式
    const isHighlighted = highlightedNodes.includes(node);
    const isRange = rangeHighlight.some(k => node.keys.includes(k));
    
    let gradient = node.leaf ? 'url(#leafGradient)' : 'url(#internalGradient)';
    if (isHighlighted) gradient = 'url(#highlightGradient)';
    if (isRange) gradient = 'url(#rangeGradient)';
    
    // 节点背景
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', node.x);
    rect.setAttribute('y', node.y);
    rect.setAttribute('width', node.width);
    rect.setAttribute('height', CONFIG.nodeHeight);
    rect.setAttribute('rx', '6');
    rect.setAttribute('fill', gradient);
    rect.setAttribute('filter', 'url(#shadow)');
    g.appendChild(rect);
    
    // 绘制键值
    node.keys.forEach((key, i) => {
        const keyX = node.x + 8 + i * (CONFIG.keyWidth + CONFIG.keyGap);
        
        // 键背景
        const keyRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        keyRect.setAttribute('x', keyX);
        keyRect.setAttribute('y', node.y + 5);
        keyRect.setAttribute('width', CONFIG.keyWidth);
        keyRect.setAttribute('height', CONFIG.nodeHeight - 10);
        keyRect.setAttribute('rx', '3');
        keyRect.setAttribute('fill', 'rgba(255,255,255,0.2)');
        
        if (rangeHighlight.includes(key)) {
            keyRect.setAttribute('fill', 'rgba(255,255,255,0.4)');
        }
        
        g.appendChild(keyRect);
        
        // 键值文本
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', keyX + CONFIG.keyWidth / 2);
        text.setAttribute('y', node.y + CONFIG.nodeHeight / 2 + 4);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '13');
        text.setAttribute('font-weight', '600');
        text.textContent = key;
        g.appendChild(text);
    });
    
    // 叶子节点标记
    if (node.leaf) {
        const leafMarker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        leafMarker.setAttribute('cx', node.x + node.width - 6);
        leafMarker.setAttribute('cy', node.y + 6);
        leafMarker.setAttribute('r', '3');
        leafMarker.setAttribute('fill', '#fff');
        leafMarker.setAttribute('opacity', '0.7');
        g.appendChild(leafMarker);
    }
    
    svg.appendChild(g);
    
    // 递归渲染子节点
    if (!node.leaf) {
        for (const child of node.children) {
            renderNode(child, node);
        }
    }
}

function renderLeafLinks() {
    const leaves = tree.getLeaves();
    
    for (let i = 0; i < leaves.length - 1; i++) {
        const current = leaves[i];
        const next = leaves[i + 1];
        
        const startX = current.x + current.width;
        const startY = current.y + CONFIG.nodeHeight / 2;
        const endX = next.x;
        const endY = next.y + CONFIG.nodeHeight / 2;
        
        const midX = (startX + endX) / 2;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`);
        path.setAttribute('stroke', CONFIG.colors.leafLink);
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-dasharray', '4,2');
        path.setAttribute('marker-end', 'url(#arrowhead)');
        path.setAttribute('opacity', '0.6');
        svg.appendChild(path);
    }
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
    
    if (tree.insert(value)) {
        render();
        await delay(CONFIG.animationDuration);
        updateStatus('插入完成: {0}', value);
        if (window.AlgoLogger) window.AlgoLogger.success('插入成功: {0}', value);
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
    highlightedNodes = [];
    rangeHighlight = [];
    
    const result = tree.search(value);
    
    // 逐层显示路径
    for (const node of result.path) {
        highlightedNodes.push(node);
        render();
        await delay(CONFIG.animationDuration);
    }
    
    if (result.found) {
        updateStatus('找到: {0}', value);
        if (window.AlgoLogger) window.AlgoLogger.success('查找成功: {0}', value);
    } else {
        updateStatus('未找到: {0}', value);
        if (window.AlgoLogger) window.AlgoLogger.warn('未找到: {0}', value);
    }
    
    await delay(CONFIG.animationDuration);
    highlightedNodes = [];
    render();
    isAnimating = false;
}

async function rangeQuery() {
    const input = inputValue.value;
    const match = input.match(/(\d+)\s*[-~到]\s*(\d+)/);
    
    if (!match) {
        updateStatus('请输入范围 (如: 10-50 或 10~50)');
        return;
    }
    
    const start = parseInt(match[1]);
    const end = parseInt(match[2]);
    
    if (isAnimating) return;
    isAnimating = true;
    
    updateStatus('范围查询: {0} - {1}', start, end);
    if (window.AlgoLogger) window.AlgoLogger.step('范围查询: {0} - {1}', start, end);
    highlightedNodes = [];
    
    const results = tree.rangeQuery(start, end);
    rangeHighlight = results;
    render();
    
    await delay(CONFIG.animationDuration * 2);
    
    if (results.length > 0) {
        updateStatus('找到 {0} 个结果: {1}', results.length, results.join(', '));
        if (window.AlgoLogger) window.AlgoLogger.success('范围查询成功: 找到 {0} 个结果', results.length);
    } else {
        updateStatus('范围内没有数据');
        if (window.AlgoLogger) window.AlgoLogger.warn('范围内没有数据');
    }
    
    await delay(CONFIG.animationDuration * 3);
    rangeHighlight = [];
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
    
    if (tree.delete(value)) {
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
    const order = parseInt(orderSelect.value);
    tree = new BPlusTree(order);
    highlightedNodes = [];
    rangeHighlight = [];
    isAnimating = false;
    inputValue.value = '';
    render();
    updateStatus('数据结构已初始化');
    
    // 日志记录
    if (window.AlgoLogger) {
        window.AlgoLogger.clear();
        window.AlgoLogger.info('B+树初始化: 阶数={0}', order);
    }
}

function generateRandom() {
    reset();
    
    const count = Math.floor(Math.random() * 10) + 6;
    const values = new Set();
    
    while (values.size < count) {
        values.add(Math.floor(Math.random() * 99) + 1);
    }
    
    for (const val of values) {
        tree.insert(val);
    }
    
    render();
    updateStatus('已生成 {0} 个随机值', count);
    
    // 日志记录
    if (window.AlgoLogger) window.AlgoLogger.success('随机生成 {0} 个值', count);
}

// ===== 演示功能 =====
async function runDemo() {
    if (isDemo) {
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
    
    reset();
    isDemo = true;
    isDemoPaused = false;
    
    insertBtn.disabled = true;
    searchBtn.disabled = true;
    rangeBtn.disabled = true;
    deleteBtn.disabled = true;
    randomBtn.disabled = true;
    resetBtn.disabled = true;
    demoBtn.textContent = window.I18n ? window.I18n.t('⏸ 暂停') : '⏸ 暂停';
    
    updateStatus('演示开始...');
    
    for (const step of DEMO_SEQUENCE) {
        while (isDemoPaused) {
            await delay(100);
            if (!isDemo) break;
        }
        if (!isDemo) break;
        
        if (step.action === 'insert') {
            updateStatus('正在插入: {0}', step.value);
            tree.insert(step.value);
            highlightedNodes = [];
            render();
            await delay(CONFIG.animationDuration * 2);
        } else if (step.action === 'search') {
            updateStatus('正在查找: {0}', step.value);
            highlightedNodes = [];
            
            let node = tree.root;
            while (node) {
                highlightedNodes.push(node);
                render();
                await delay(CONFIG.animationDuration);
                
                let i = 0;
                while (i < node.keys.length && step.value >= node.keys[i]) i++;
                
                if (node.isLeaf) {
                    if (i > 0 && node.keys[i - 1] === step.value) {
                        updateStatus('找到: {0}', step.value);
                    } else {
                        updateStatus('未找到: {0}', step.value);
                    }
                    break;
                } else {
                    node = node.children[i];
                }
            }
            await delay(CONFIG.animationDuration * 2);
            highlightedNodes = [];
            render();
        } else if (step.action === 'range') {
            updateStatus('范围查询: {0} - {1}', step.start, step.end);
            highlightedNodes = [];
            
            // 找到起始位置
            let node = tree.root;
            while (node && !node.isLeaf) {
                highlightedNodes.push(node);
                render();
                await delay(CONFIG.animationDuration);
                let i = 0;
                while (i < node.keys.length && step.start >= node.keys[i]) i++;
                node = node.children[i];
            }
            
            // 遍历叶子节点
            const results = [];
            while (node) {
                highlightedNodes.push(node);
                render();
                await delay(CONFIG.animationDuration);
                for (const key of node.keys) {
                    if (key >= step.start && key <= step.end) {
                        results.push(key);
                    }
                    if (key > step.end) break;
                }
                if (node.keys[node.keys.length - 1] > step.end) break;
                node = node.next;
            }
            
            updateStatus('范围查询结果: [{0}]', results.join(', '));
            await delay(CONFIG.animationDuration * 3);
            highlightedNodes = [];
            render();
        } else if (step.action === 'delete') {
            updateStatus('正在删除: {0}', step.value);
            tree.delete(step.value);
            highlightedNodes = [];
            render();
            await delay(CONFIG.animationDuration * 2);
        }
    }
    
    isDemo = false;
    isDemoPaused = false;
    insertBtn.disabled = false;
    searchBtn.disabled = false;
    rangeBtn.disabled = false;
    deleteBtn.disabled = false;
    randomBtn.disabled = false;
    resetBtn.disabled = false;
    demoBtn.textContent = window.I18n ? window.I18n.t('▶ 演示') : '▶ 演示';
    updateStatus('演示完成');
}

function stopDemo() {
    isDemo = false;
    isDemoPaused = false;
    insertBtn.disabled = false;
    searchBtn.disabled = false;
    rangeBtn.disabled = false;
    deleteBtn.disabled = false;
    randomBtn.disabled = false;
    resetBtn.disabled = false;
    demoBtn.textContent = window.I18n ? window.I18n.t('▶ 演示') : '▶ 演示';
}

// ===== 事件监听 =====
insertBtn.addEventListener('click', insert);
searchBtn.addEventListener('click', search);
rangeBtn.addEventListener('click', rangeQuery);
deleteBtn.addEventListener('click', deleteValue);
resetBtn.addEventListener('click', () => {
    stopDemo();
    reset();
});
randomBtn.addEventListener('click', generateRandom);
demoBtn.addEventListener('click', runDemo);
orderSelect.addEventListener('change', () => {
    stopDemo();
    reset();
});

inputValue.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') insert();
});

window.addEventListener('resize', () => {
    if (tree.root.keys.length > 0) {
        render();
    }
});

// 初始化 - 等待 I18n 模块加载完成
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(reset, 0));
} else {
    setTimeout(reset, 0);  // 确保模块脚本先执行
}
