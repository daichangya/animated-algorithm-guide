/**
 * B树可视化动画控制
 * @author changyadai
 */

// ===== B树节点类 =====
class BTreeNode {
    constructor(leaf = true) {
        this.keys = [];
        this.children = [];
        this.leaf = leaf;
        this.x = 0;
        this.y = 0;
        this.width = 0;
    }
}

// ===== B树类 =====
class BTree {
    constructor(order = 4) {
        this.root = new BTreeNode();
        this.order = order;
        this.minKeys = Math.ceil(order / 2) - 1;
    }
    
    search(key, node = null) {
        if (node === null) node = this.root;
        
        let i = 0;
        while (i < node.keys.length && key > node.keys[i]) {
            i++;
        }
        
        if (i < node.keys.length && key === node.keys[i]) {
            return { node, index: i };
        } else if (node.leaf) {
            return null;
        } else {
            return this.search(key, node.children[i]);
        }
    }
    
    insert(key) {
        const root = this.root;
        if (root.keys.length === this.order - 1) {
            const newRoot = new BTreeNode(false);
            newRoot.children.push(this.root);
            this.splitChild(newRoot, 0);
            this.root = newRoot;
        }
        this.insertNonFull(this.root, key);
    }
    
    splitChild(parent, index) {
        const child = parent.children[index];
        const mid = Math.floor((this.order - 1) / 2);
        
        const newNode = new BTreeNode(child.leaf);
        newNode.keys = child.keys.splice(mid + 1);
        
        if (!child.leaf) {
            newNode.children = child.children.splice(mid + 1);
        }
        
        const promotedKey = child.keys.pop();
        parent.keys.splice(index, 0, promotedKey);
        parent.children.splice(index + 1, 0, newNode);
    }
    
    insertNonFull(node, key) {
        let i = node.keys.length - 1;
        
        if (node.leaf) {
            while (i >= 0 && key < node.keys[i]) {
                i--;
            }
            node.keys.splice(i + 1, 0, key);
        } else {
            while (i >= 0 && key < node.keys[i]) {
                i--;
            }
            i++;
            
            if (node.children[i].keys.length === this.order - 1) {
                this.splitChild(node, i);
                if (key > node.keys[i]) {
                    i++;
                }
            }
            this.insertNonFull(node.children[i], key);
        }
    }
    
    delete(key) {
        if (!this.root.keys.length) return false;
        
        const result = this.deleteFromNode(this.root, key);
        
        if (this.root.keys.length === 0 && !this.root.leaf) {
            this.root = this.root.children[0];
        }
        
        return result;
    }
    
    deleteFromNode(node, key) {
        let i = 0;
        while (i < node.keys.length && key > node.keys[i]) {
            i++;
        }
        
        if (i < node.keys.length && key === node.keys[i]) {
            if (node.leaf) {
                node.keys.splice(i, 1);
                return true;
            } else {
                return this.deleteInternalNode(node, key, i);
            }
        } else if (node.leaf) {
            return false;
        } else {
            return this.deleteFromSubtree(node, key, i);
        }
    }
    
    deleteInternalNode(node, key, index) {
        if (node.children[index].keys.length > this.minKeys) {
            const predecessor = this.getPredecessor(node.children[index]);
            node.keys[index] = predecessor;
            return this.deleteFromNode(node.children[index], predecessor);
        } else if (node.children[index + 1].keys.length > this.minKeys) {
            const successor = this.getSuccessor(node.children[index + 1]);
            node.keys[index] = successor;
            return this.deleteFromNode(node.children[index + 1], successor);
        } else {
            this.merge(node, index);
            return this.deleteFromNode(node.children[index], key);
        }
    }
    
    deleteFromSubtree(node, key, childIndex) {
        const child = node.children[childIndex];
        
        if (child.keys.length <= this.minKeys) {
            const leftSibling = childIndex > 0 ? node.children[childIndex - 1] : null;
            const rightSibling = childIndex < node.children.length - 1 ? node.children[childIndex + 1] : null;
            
            if (leftSibling && leftSibling.keys.length > this.minKeys) {
                this.borrowFromLeft(node, childIndex);
            } else if (rightSibling && rightSibling.keys.length > this.minKeys) {
                this.borrowFromRight(node, childIndex);
            } else if (leftSibling) {
                this.merge(node, childIndex - 1);
                return this.deleteFromNode(node.children[childIndex - 1], key);
            } else {
                this.merge(node, childIndex);
            }
        }
        
        return this.deleteFromNode(node.children[childIndex], key);
    }
    
    getPredecessor(node) {
        while (!node.leaf) {
            node = node.children[node.children.length - 1];
        }
        return node.keys[node.keys.length - 1];
    }
    
    getSuccessor(node) {
        while (!node.leaf) {
            node = node.children[0];
        }
        return node.keys[0];
    }
    
    borrowFromLeft(parent, childIndex) {
        const child = parent.children[childIndex];
        const leftSibling = parent.children[childIndex - 1];
        
        child.keys.unshift(parent.keys[childIndex - 1]);
        parent.keys[childIndex - 1] = leftSibling.keys.pop();
        
        if (!leftSibling.leaf) {
            child.children.unshift(leftSibling.children.pop());
        }
    }
    
    borrowFromRight(parent, childIndex) {
        const child = parent.children[childIndex];
        const rightSibling = parent.children[childIndex + 1];
        
        child.keys.push(parent.keys[childIndex]);
        parent.keys[childIndex] = rightSibling.keys.shift();
        
        if (!rightSibling.leaf) {
            child.children.push(rightSibling.children.shift());
        }
    }
    
    merge(parent, index) {
        const left = parent.children[index];
        const right = parent.children[index + 1];
        
        left.keys.push(parent.keys[index]);
        left.keys = left.keys.concat(right.keys);
        
        if (!left.leaf) {
            left.children = left.children.concat(right.children);
        }
        
        parent.keys.splice(index, 1);
        parent.children.splice(index + 1, 1);
    }
}

// ===== 可视化配置 =====
const CONFIG = {
    nodeHeight: 40,
    keyWidth: 45,
    keyGap: 4,
    levelGap: 70,
    nodeGap: 30,
    animationDuration: 400,
    colors: {
        node: '#8b5cf6',
        nodeHover: '#a78bfa',
        key: '#ffffff',
        highlight: '#22c55e',
        searching: '#eab308',
        notFound: '#ef4444',
        edge: '#6366f1'
    }
};

// ===== 状态 =====
let tree = new BTree(4);
let isAnimating = false;
let highlightedNodes = [];

// ===== DOM 元素 =====
const svg = document.getElementById('treeSvg');
const visualizationContainer = document.getElementById('visualizationContainer');
const inputValue = document.getElementById('inputValue');
const insertBtn = document.getElementById('insertBtn');
const searchBtn = document.getElementById('searchBtn');
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
    { action: 'insert', value: 5 },
    { action: 'insert', value: 15 },
    { action: 'search', value: 30 },
    { action: 'delete', value: 25 }
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
    node.width = node.keys.length * CONFIG.keyWidth + (node.keys.length - 1) * CONFIG.keyGap + 20;
    
    if (node.leaf || node.children.length === 0) {
        node.x = leftBound;
        return leftBound + node.width + CONFIG.nodeGap;
    }
    
    let currentLeft = leftBound;
    const childPositions = [];
    
    for (const child of node.children) {
        const childCenter = currentLeft + (child.keys.length * CONFIG.keyWidth + 20) / 2;
        childPositions.push(childCenter);
        currentLeft = calculateLayout(child, level + 1, currentLeft);
    }
    
    const firstChildCenter = childPositions[0];
    const lastChildCenter = childPositions[childPositions.length - 1];
    node.x = (firstChildCenter + lastChildCenter) / 2 - node.width / 2;
    
    return currentLeft;
}

// ===== 渲染 =====
function render() {
    const totalWidth = calculateLayout(tree.root);
    const height = getTreeHeight(tree.root) * CONFIG.levelGap + 100;
    
    svg.setAttribute('width', Math.max(totalWidth + 50, visualizationContainer.clientWidth - 40));
    svg.setAttribute('height', height);
    svg.innerHTML = '';
    
    // 定义渐变和阴影
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
        <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#a78bfa"/>
            <stop offset="100%" style="stop-color:#7c3aed"/>
        </linearGradient>
        <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#4ade80"/>
            <stop offset="100%" style="stop-color:#22c55e"/>
        </linearGradient>
        <linearGradient id="searchGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#fcd34d"/>
            <stop offset="100%" style="stop-color:#eab308"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.3"/>
        </filter>
    `;
    svg.appendChild(defs);
    
    renderNode(tree.root);
}

function getTreeHeight(node) {
    if (!node || node.leaf) return 1;
    let maxHeight = 0;
    for (const child of node.children) {
        maxHeight = Math.max(maxHeight, getTreeHeight(child));
    }
    return maxHeight + 1;
}

function renderNode(node, parent = null, childIndex = 0) {
    if (!node) return;
    
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('btree-node');
    
    // 绘制连接线
    if (parent) {
        const parentCenterX = parent.x + parent.width / 2;
        const childCenterX = node.x + node.width / 2;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const startY = parent.y + CONFIG.nodeHeight;
        const endY = node.y;
        const midY = (startY + endY) / 2;
        
        line.setAttribute('d', `M ${parentCenterX} ${startY} C ${parentCenterX} ${midY}, ${childCenterX} ${midY}, ${childCenterX} ${endY}`);
        line.setAttribute('stroke', CONFIG.colors.edge);
        line.setAttribute('stroke-width', '2');
        line.setAttribute('fill', 'none');
        line.setAttribute('opacity', '0.6');
        svg.insertBefore(line, svg.firstChild);
    }
    
    // 绘制节点背景
    const isHighlighted = highlightedNodes.includes(node);
    const gradient = isHighlighted ? 'url(#highlightGradient)' : 'url(#nodeGradient)';
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', node.x);
    rect.setAttribute('y', node.y);
    rect.setAttribute('width', node.width);
    rect.setAttribute('height', CONFIG.nodeHeight);
    rect.setAttribute('rx', '8');
    rect.setAttribute('fill', gradient);
    rect.setAttribute('filter', 'url(#shadow)');
    g.appendChild(rect);
    
    // 绘制键值
    node.keys.forEach((key, i) => {
        const keyX = node.x + 10 + i * (CONFIG.keyWidth + CONFIG.keyGap);
        
        // 键背景
        const keyRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        keyRect.setAttribute('x', keyX);
        keyRect.setAttribute('y', node.y + 6);
        keyRect.setAttribute('width', CONFIG.keyWidth);
        keyRect.setAttribute('height', CONFIG.nodeHeight - 12);
        keyRect.setAttribute('rx', '4');
        keyRect.setAttribute('fill', 'rgba(255,255,255,0.15)');
        g.appendChild(keyRect);
        
        // 键值文本
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', keyX + CONFIG.keyWidth / 2);
        text.setAttribute('y', node.y + CONFIG.nodeHeight / 2 + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', CONFIG.colors.key);
        text.setAttribute('font-size', '14');
        text.setAttribute('font-weight', '600');
        text.textContent = key;
        g.appendChild(text);
    });
    
    svg.appendChild(g);
    
    // 递归渲染子节点
    for (let i = 0; i < node.children.length; i++) {
        renderNode(node.children[i], node, i);
    }
}

// ===== 操作 =====
async function insert() {
    const value = parseInt(inputValue.value);
    if (isNaN(value) || value < 1 || value > 999) {
        updateStatus('请输入1-999之间的有效数值');
        return;
    }
    
    if (tree.search(value)) {
        updateStatus('{0} 已存在', value);
        if (window.AlgoLogger) window.AlgoLogger.warn('值已存在: {0}', value);
        return;
    }
    
    if (isAnimating) return;
    isAnimating = true;
    
    updateStatus('正在插入: {0}', value);
    if (window.AlgoLogger) window.AlgoLogger.step('插入操作: {0}', value);
    tree.insert(value);
    render();
    
    await delay(CONFIG.animationDuration);
    updateStatus('插入完成: {0}', value);
    if (window.AlgoLogger) window.AlgoLogger.success('插入成功: {0}', value);
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
    
    // 逐层搜索动画
    let node = tree.root;
    while (node) {
        highlightedNodes.push(node);
        render();
        await delay(CONFIG.animationDuration);
        
        let i = 0;
        while (i < node.keys.length && value > node.keys[i]) {
            i++;
        }
        
        if (i < node.keys.length && value === node.keys[i]) {
            updateStatus('找到: {0}', value);
            if (window.AlgoLogger) window.AlgoLogger.success('查找成功: {0}', value);
            await delay(CONFIG.animationDuration);
            highlightedNodes = [];
            render();
            isAnimating = false;
            return;
        }
        
        if (node.leaf) break;
        node = node.children[i];
    }
    
    updateStatus('未找到: {0}', value);
    if (window.AlgoLogger) window.AlgoLogger.warn('未找到: {0}', value);
    highlightedNodes = [];
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
    tree = new BTree(order);
    highlightedNodes = [];
    isAnimating = false;
    inputValue.value = '';
    render();
    updateStatus('数据结构已初始化');
    
    // 日志记录
    if (window.AlgoLogger) {
        window.AlgoLogger.clear();
        window.AlgoLogger.info('B树初始化: 阶数={0}', order);
    }
}

function generateRandom() {
    reset();
    
    const count = Math.floor(Math.random() * 8) + 5;
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
    if (window.AlgoLogger) {
        window.AlgoLogger.success('随机生成 {0} 个值', count);
        window.AlgoLogger.log('数据: [{0}]', Array.from(values).join(', '));
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
            tree.insert(step.value);
            highlightedNodes = [];
            render();
            await delay(CONFIG.animationDuration * 2);
        } else if (step.action === 'search') {
            updateStatus('正在查找: {0}', step.value);
            highlightedNodes = [];
            
            // 模拟搜索路径
            let node = tree.root;
            while (node) {
                highlightedNodes.push(node);
                render();
                await delay(CONFIG.animationDuration);
                
                let i = 0;
                while (i < node.keys.length && step.value > node.keys[i]) i++;
                
                if (i < node.keys.length && step.value === node.keys[i]) {
                    updateStatus('找到: {0}', step.value);
                    break;
                } else if (node.leaf) {
                    updateStatus('未找到: {0}', step.value);
                    break;
                } else {
                    node = node.children[i];
                }
            }
            await delay(CONFIG.animationDuration * 2);
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
    
    // 演示结束
    isDemo = false;
    isDemoPaused = false;
    insertBtn.disabled = false;
    searchBtn.disabled = false;
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
    deleteBtn.disabled = false;
    randomBtn.disabled = false;
    resetBtn.disabled = false;
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
orderSelect.addEventListener('change', () => {
    stopDemo();
    reset();
});

inputValue.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') insert();
});

// 响应式调整
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
