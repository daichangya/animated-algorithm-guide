/**
 * 堆排序可视化动画控制
 * @author changyadai
 */

// 配置
const CONFIG = {
    arraySize: 10,           // 数组大小
    minValue: 10,            // 最小值
    maxValue: 99,            // 最大值
    compareDelay: 500,       // 比较延迟（毫秒）
    swapDelay: 600,          // 交换动画时长（毫秒）
    treeWidth: 1000,         // 树容器宽度
    treeHeight: 300,         // 树容器高度
    nodeRadius: 25           // 节点半径
};

// 状态
let array = [];
let heapSize = 0;
let isSorting = false;
let isPaused = false;

// DOM 元素
const heapTreeContainer = document.getElementById('heapTreeContainer');
const treeNodes = document.getElementById('treeNodes');
const treeLines = document.getElementById('treeLines');
const arrayContainer = document.getElementById('arrayContainer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const pauseBtn = document.getElementById('pauseBtn');
const statusText = document.getElementById('statusText');

/**
 * 生成随机数组
 */
function generateArray() {
    array = [];
    for (let i = 0; i < CONFIG.arraySize; i++) {
        const value = Math.floor(Math.random() * (CONFIG.maxValue - CONFIG.minValue + 1)) + CONFIG.minValue;
        array.push(value);
    }
    heapSize = array.length;
    renderAll();
}

/**
 * 渲染所有视图
 */
function renderAll() {
    renderTree();
    renderArray();
}

/**
 * 计算树节点位置
 */
function getNodePosition(index, totalNodes) {
    const containerWidth = heapTreeContainer.offsetWidth || CONFIG.treeWidth;
    const containerHeight = heapTreeContainer.offsetHeight || CONFIG.treeHeight;
    
    // 计算层级
    const level = Math.floor(Math.log2(index + 1));
    const maxLevel = Math.floor(Math.log2(totalNodes)) + 1;
    
    // 计算在当前层的位置
    const levelStart = Math.pow(2, level) - 1;
    const positionInLevel = index - levelStart;
    const nodesInLevel = Math.pow(2, level);
    
    // 计算x坐标（均匀分布）
    const levelWidth = containerWidth * 0.9;
    const spacing = levelWidth / nodesInLevel;
    const startX = (containerWidth - levelWidth) / 2 + spacing / 2;
    const x = startX + positionInLevel * spacing;
    
    // 计算y坐标
    const verticalSpacing = (containerHeight - 80) / maxLevel;
    const y = 50 + level * verticalSpacing;
    
    return { x, y, level };
}

/**
 * 渲染树形视图
 */
function renderTree() {
    treeNodes.innerHTML = '';
    treeLines.innerHTML = '';
    
    const n = array.length;
    
    // 先绘制连接线
    for (let i = 0; i < n; i++) {
        const pos = getNodePosition(i, n);
        
        // 绘制到子节点的连线
        const leftChild = 2 * i + 1;
        const rightChild = 2 * i + 2;
        
        if (leftChild < n) {
            const childPos = getNodePosition(leftChild, n);
            createLine(i, leftChild, pos.x, pos.y, childPos.x, childPos.y);
        }
        
        if (rightChild < n) {
            const childPos = getNodePosition(rightChild, n);
            createLine(i, rightChild, pos.x, pos.y, childPos.x, childPos.y);
        }
    }
    
    // 绘制节点
    for (let i = 0; i < n; i++) {
        const pos = getNodePosition(i, n);
        const node = document.createElement('div');
        node.className = 'tree-node' + (i === 0 ? ' root' : '');
        node.id = `node-${i}`;
        node.dataset.index = i;
        node.textContent = array[i];
        node.style.left = `${pos.x}px`;
        node.style.top = `${pos.y}px`;
        
        // 如果在堆范围外，标记为已排序
        if (i >= heapSize) {
            node.classList.add('sorted');
        }
        
        treeNodes.appendChild(node);
    }
}

/**
 * 创建连接线
 */
function createLine(parentIndex, childIndex, x1, y1, x2, y2) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('class', 'tree-line');
    line.id = `line-${parentIndex}-${childIndex}`;
    treeLines.appendChild(line);
}

/**
 * 渲染数组视图
 */
function renderArray() {
    arrayContainer.innerHTML = '';
    array.forEach((value, index) => {
        const item = document.createElement('div');
        item.className = 'array-item';
        item.id = `array-${index}`;
        item.dataset.index = index;
        
        const indexLabel = document.createElement('span');
        indexLabel.className = 'index';
        indexLabel.textContent = index;
        
        item.appendChild(indexLabel);
        item.appendChild(document.createTextNode(value));
        
        // 如果在堆范围外，标记为已排序
        if (index >= heapSize) {
            item.classList.add('sorted', 'out-of-heap');
        }
        
        arrayContainer.appendChild(item);
    });
}

/**
 * 延迟函数（支持暂停）
 */
function delay(ms) {
    return new Promise(resolve => {
        const startTime = Date.now();
        let remaining = ms;
        
        const checkPause = () => {
            if (!isSorting) {
                resolve();
                return;
            }
            if (isPaused) {
                setTimeout(checkPause, 50);
            } else {
                const elapsed = Date.now() - startTime;
                remaining = Math.max(0, ms - elapsed);
                if (remaining <= 0) {
                    resolve();
                } else {
                    setTimeout(resolve, remaining);
                }
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
 * 更新状态文本
 */
function updateStatus(text) {
    statusText.textContent = window.I18n ? window.I18n.t(text) : text;
}

/**
 * 高亮节点（树和数组同步）
 */
function highlightNodes(indices, className = 'comparing') {
    indices.forEach(i => {
        const node = document.getElementById(`node-${i}`);
        const arrayItem = document.getElementById(`array-${i}`);
        if (node) node.classList.add(className);
        if (arrayItem) arrayItem.classList.add(className);
    });
    
    // 高亮相关连线
    if (indices.length === 2) {
        const [parent, child] = indices[0] < indices[1] ? indices : [indices[1], indices[0]];
        const line = document.getElementById(`line-${parent}-${child}`);
        if (line) line.classList.add('active');
    }
}

/**
 * 移除高亮
 */
function removeHighlight(indices) {
    indices.forEach(i => {
        const node = document.getElementById(`node-${i}`);
        const arrayItem = document.getElementById(`array-${i}`);
        if (node) node.classList.remove('comparing', 'swapping');
        if (arrayItem) arrayItem.classList.remove('comparing', 'swapping');
    });
    
    // 移除连线高亮
    document.querySelectorAll('.tree-line.active').forEach(line => {
        line.classList.remove('active');
    });
}

/**
 * 创建粒子效果
 */
function createParticles(x, y) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'heap-particle';
        particle.style.left = `${x + (Math.random() - 0.5) * 30}px`;
        particle.style.top = `${y + (Math.random() - 0.5) * 30}px`;
        heapTreeContainer.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) particle.remove();
        }, 800);
    }
}

/**
 * 交换两个元素（带动画）
 */
async function swap(i, j) {
    const nodeI = document.getElementById(`node-${i}`);
    const nodeJ = document.getElementById(`node-${j}`);
    const arrayI = document.getElementById(`array-${i}`);
    const arrayJ = document.getElementById(`array-${j}`);
    
    // 添加交换样式
    highlightNodes([i, j], 'swapping');
    
    // 创建粒子效果
    if (nodeI && nodeJ) {
        const posI = getNodePosition(i, array.length);
        const posJ = getNodePosition(j, array.length);
        createParticles(posI.x, posI.y);
        createParticles(posJ.x, posJ.y);
    }
    
    await delay(CONFIG.swapDelay / 2);
    
    // 交换数组值
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    
    // 更新显示
    if (nodeI) nodeI.textContent = array[i];
    if (nodeJ) nodeJ.textContent = array[j];
    if (arrayI) {
        arrayI.lastChild.textContent = array[i];
    }
    if (arrayJ) {
        arrayJ.lastChild.textContent = array[j];
    }
    
    await delay(CONFIG.swapDelay / 2);
    
    removeHighlight([i, j]);
}

/**
 * 堆调整（下沉）
 */
async function heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    // 比较左子节点
    if (left < n) {
        updateStatus(window.I18n.t('比较: 节点[{0}]={1} 与 左子节点[{2}]={3}', i, array[i], left, array[left]));
        highlightNodes([i, left]);
        await delay(CONFIG.compareDelay);
        
        if (array[left] > array[largest]) {
            largest = left;
        }
        removeHighlight([i, left]);
    }
    
    // 比较右子节点
    if (right < n) {
        updateStatus(window.I18n.t('比较: 节点[{0}]={1} 与 右子节点[{2}]={3}', largest, array[largest], right, array[right]));
        highlightNodes([largest, right]);
        await delay(CONFIG.compareDelay);
        
        if (array[right] > array[largest]) {
            largest = right;
        }
        removeHighlight([largest, right]);
    }
    
    // 如果最大值不是根节点，则交换
    if (largest !== i) {
        updateStatus(window.I18n.t('交换: 节点[{0}]={1} 与 节点[{2}]={3}', i, array[i], largest, array[largest]));
        await swap(i, largest);
        
        // 递归调整被影响的子树
        if (!isSorting) return;
        await heapify(n, largest);
    }
}

/**
 * 构建最大堆
 */
async function buildMaxHeap() {
    const n = array.length;
    
    // 从最后一个非叶子节点开始，向上进行堆调整
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        if (!isSorting) return;
        updateStatus(window.I18n.t('构建堆: 调整节点 {0}', i));
        await heapify(n, i);
    }
}

/**
 * 标记节点为已排序
 */
function markSorted(index) {
    const node = document.getElementById(`node-${index}`);
    const arrayItem = document.getElementById(`array-${index}`);
    
    if (node) node.classList.add('sorted');
    if (arrayItem) {
        arrayItem.classList.add('sorted', 'out-of-heap');
    }
}

/**
 * 堆排序主函数
 */
async function heapSort() {
    const n = array.length;
    heapSize = n;
    
    // 第一阶段：构建最大堆
    updateStatus('第一阶段：构建最大堆...');
    await delay(500);
    await buildMaxHeap();
    
    if (!isSorting) return;
    
    updateStatus('最大堆构建完成！开始排序...');
    await delay(500);
    
    // 第二阶段：逐个取出最大元素
    for (let i = n - 1; i > 0; i--) {
        if (!isSorting) return;
        
        heapSize = i;
        
        updateStatus(window.I18n.t('交换根节点[0]={0} 与 末尾节点[{1}]={2}', array[0], i, array[i]));
        await swap(0, i);
        
        // 标记已排序
        markSorted(i);
        
        // 调整剩余堆
        updateStatus(window.I18n.t('调整堆: 当前堆大小 = {0}', i));
        await heapify(i, 0);
    }
    
    // 标记第一个元素
    markSorted(0);
    
    // 完成动画
    await celebrateCompletion();
    
    updateStatus('排序完成！');
}

/**
 * 完成时的庆祝动画
 */
async function celebrateCompletion() {
    const nodes = document.querySelectorAll('.tree-node');
    const items = document.querySelectorAll('.array-item');
    
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].classList.add('celebrate');
        items[i].classList.add('celebrate');
        
        const pos = getNodePosition(i, array.length);
        createParticles(pos.x, pos.y);
        
        await delay(80);
    }
    
    await delay(500);
    
    nodes.forEach(node => node.classList.remove('celebrate'));
    items.forEach(item => item.classList.remove('celebrate'));
}

/**
 * 开始排序
 */
async function startSorting() {
    if (isSorting) return;
    
    isSorting = true;
    isPaused = false;
    startBtn.disabled = true;
    resetBtn.disabled = true;
    if (pauseBtn) {
        pauseBtn.disabled = false;
        pauseBtn.textContent = window.I18n ? window.I18n.t('暂停') : '暂停';
        pauseBtn.classList.remove('paused');
    }
    
    // 重置视图状态
    heapSize = array.length;
    document.querySelectorAll('.sorted').forEach(el => el.classList.remove('sorted'));
    document.querySelectorAll('.out-of-heap').forEach(el => el.classList.remove('out-of-heap'));
    
    updateStatus('排序开始...');
    
    await heapSort();
    
    isSorting = false;
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
    isSorting = false;
    isPaused = false;
    startBtn.disabled = false;
    resetBtn.disabled = false;
    if (pauseBtn) {
        pauseBtn.disabled = true;
        pauseBtn.classList.remove('paused');
        pauseBtn.textContent = window.I18n ? window.I18n.t('暂停') : '暂停';
    }
    
    // 清除粒子
    document.querySelectorAll('.heap-particle').forEach(p => p.remove());
    
    generateArray();
    updateStatus('点击"开始排序"查看动画');
}

/**
 * 窗口大小改变时重新渲染树
 */
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (!isSorting) {
            renderTree();
        }
    }, 200);
});

// 事件监听
startBtn.addEventListener('click', startSorting);
resetBtn.addEventListener('click', reset);
if (pauseBtn) {
    pauseBtn.addEventListener('click', togglePause);
}

// 初始化
generateArray();
