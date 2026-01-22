/**
 * 归并排序可视化动画控制
 * @author changyadai
 */

// 配置
const CONFIG = {
    arraySize: 8,
    minValue: 10,
    maxValue: 99,
    divideDelay: 600,
    mergeDelay: 400,
    compareDelay: 300
};

// 状态
let array = [];
let isSorting = false;
let isPaused = false;
let treeNodes = [];

// DOM 元素
const treeVisualization = document.getElementById('treeVisualization');
const leftItems = document.getElementById('leftItems');
const rightItems = document.getElementById('rightItems');
const resultItems = document.getElementById('resultItems');
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
    renderArray();
    renderInitialTree();
    clearMergeArea();
    
    // 日志记录
    if (window.AlgoLogger) {
        window.AlgoLogger.clear();
        window.AlgoLogger.info('生成随机数组: {0} 个元素', array.length);
        window.AlgoLogger.log('数据: [{0}]', array.join(', '));
    }
}

/**
 * 渲染主数组
 */
function renderArray() {
    arrayContainer.innerHTML = '';
    array.forEach((value, index) => {
        const item = document.createElement('div');
        item.className = 'array-item';
        item.id = `array-${index}`;
        
        const indexLabel = document.createElement('span');
        indexLabel.className = 'index';
        indexLabel.textContent = index;
        
        item.appendChild(indexLabel);
        item.appendChild(document.createTextNode(value));
        arrayContainer.appendChild(item);
    });
}

/**
 * 渲染初始递归树
 */
function renderInitialTree() {
    treeVisualization.innerHTML = '';
    treeNodes = [];
    
    // 创建第一层（原始数组）
    const level0 = document.createElement('div');
    level0.className = 'tree-level';
    level0.id = 'tree-level-0';
    
    const node = createTreeNode(array, 0, array.length - 1, 'node-0-0');
    level0.appendChild(node);
    treeVisualization.appendChild(level0);
}

/**
 * 创建树节点
 */
function createTreeNode(arr, start, end, id) {
    const node = document.createElement('div');
    node.className = 'tree-node';
    node.id = id;
    node.dataset.start = start;
    node.dataset.end = end;
    
    for (let i = start; i <= end; i++) {
        const item = document.createElement('div');
        item.className = 'tree-item';
        item.textContent = array[i];
        node.appendChild(item);
    }
    
    return node;
}

/**
 * 添加树层级
 */
function addTreeLevel(levelIndex) {
    let level = document.getElementById(`tree-level-${levelIndex}`);
    if (!level) {
        level = document.createElement('div');
        level.className = 'tree-level';
        level.id = `tree-level-${levelIndex}`;
        treeVisualization.appendChild(level);
    }
    return level;
}

/**
 * 延迟函数（支持暂停）
 */
function delay(ms) {
    return new Promise(resolve => {
        const startTime = Date.now();
        const checkPause = () => {
            if (!isSorting) { resolve(); return; }
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
 * 设置阶段
 */
function setPhase(phase) {
    document.querySelectorAll('.phase').forEach(p => p.classList.remove('active'));
    document.querySelector(`.${phase}-phase`).classList.add('active');
}

/**
 * 清空合并区域
 */
function clearMergeArea() {
    leftItems.innerHTML = '';
    rightItems.innerHTML = '';
    resultItems.innerHTML = '';
}

/**
 * 高亮数组范围
 */
function highlightArrayRange(start, end, className = 'in-range') {
    document.querySelectorAll('.array-item').forEach((item, idx) => {
        item.classList.remove('in-range', 'left-part', 'right-part', 'merging');
        if (idx >= start && idx <= end) {
            item.classList.add(className);
        }
    });
}

/**
 * 更新数组显示
 */
function updateArrayDisplay(start, values) {
    values.forEach((val, i) => {
        const item = document.getElementById(`array-${start + i}`);
        if (item) {
            item.lastChild.textContent = val;
            array[start + i] = val;
        }
    });
}

/**
 * 显示合并过程
 */
async function showMerge(leftArr, rightArr, start) {
    clearMergeArea();
    
    // 显示左子数组
    leftArr.forEach((val, i) => {
        const item = document.createElement('div');
        item.className = 'merge-item left';
        item.id = `left-${i}`;
        item.textContent = val;
        leftItems.appendChild(item);
    });
    
    // 显示右子数组
    rightArr.forEach((val, i) => {
        const item = document.createElement('div');
        item.className = 'merge-item right';
        item.id = `right-${i}`;
        item.textContent = val;
        rightItems.appendChild(item);
    });
    
    await delay(CONFIG.mergeDelay);
    
    // 合并过程
    const result = [];
    let i = 0, j = 0;
    
    while (i < leftArr.length && j < rightArr.length) {
        if (!isSorting) return result;
        
        // 高亮比较的元素
        const leftItem = document.getElementById(`left-${i}`);
        const rightItem = document.getElementById(`right-${j}`);
        
        if (leftItem) leftItem.classList.add('active');
        if (rightItem) rightItem.classList.add('active');
        
        updateStatus(window.I18n.t('比较: {0} vs {1}', leftArr[i], rightArr[j]));
        await delay(CONFIG.compareDelay);
        
        if (leftArr[i] <= rightArr[j]) {
            result.push(leftArr[i]);
            if (leftItem) {
                leftItem.classList.remove('active');
                leftItem.classList.add('used');
            }
            i++;
        } else {
            result.push(rightArr[j]);
            if (rightItem) {
                rightItem.classList.remove('active');
                rightItem.classList.add('used');
            }
            j++;
        }
        
        // 添加到结果
        const resultItem = document.createElement('div');
        resultItem.className = 'merge-item result';
        resultItem.textContent = result[result.length - 1];
        resultItems.appendChild(resultItem);
        
        // 更新主数组
        const arrayItem = document.getElementById(`array-${start + result.length - 1}`);
        if (arrayItem) {
            arrayItem.classList.add('merging');
            arrayItem.lastChild.textContent = result[result.length - 1];
        }
        
        await delay(CONFIG.mergeDelay);
    }
    
    // 处理剩余元素
    while (i < leftArr.length) {
        if (!isSorting) return result;
        
        const leftItem = document.getElementById(`left-${i}`);
        if (leftItem) leftItem.classList.add('used');
        
        result.push(leftArr[i]);
        
        const resultItem = document.createElement('div');
        resultItem.className = 'merge-item result';
        resultItem.textContent = leftArr[i];
        resultItems.appendChild(resultItem);
        
        const arrayItem = document.getElementById(`array-${start + result.length - 1}`);
        if (arrayItem) {
            arrayItem.classList.add('merging');
            arrayItem.lastChild.textContent = result[result.length - 1];
        }
        
        i++;
        await delay(CONFIG.mergeDelay / 2);
    }
    
    while (j < rightArr.length) {
        if (!isSorting) return result;
        
        const rightItem = document.getElementById(`right-${j}`);
        if (rightItem) rightItem.classList.add('used');
        
        result.push(rightArr[j]);
        
        const resultItem = document.createElement('div');
        resultItem.className = 'merge-item result';
        resultItem.textContent = rightArr[j];
        resultItems.appendChild(resultItem);
        
        const arrayItem = document.getElementById(`array-${start + result.length - 1}`);
        if (arrayItem) {
            arrayItem.classList.add('merging');
            arrayItem.lastChild.textContent = result[result.length - 1];
        }
        
        j++;
        await delay(CONFIG.mergeDelay / 2);
    }
    
    return result;
}

/**
 * 归并排序主函数
 */
async function mergeSort(arr, start, end, depth = 0) {
    if (!isSorting) return arr;
    
    if (start >= end) {
        return [arr[0]];
    }
    
    const mid = Math.floor((start + end) / 2);
    
    // 分解阶段
    setPhase('divide');
    updateStatus(window.I18n.t('分解: [{0} - {1}] → [{0} - {2}] 和 [{3} - {1}]', start, end, mid, mid + 1));
    
    // 高亮当前处理范围
    highlightArrayRange(start, end, 'in-range');
    
    // 在树中显示分解
    const levelIndex = depth + 1;
    const level = addTreeLevel(levelIndex);
    
    const leftNodeId = `node-${levelIndex}-${start}`;
    const rightNodeId = `node-${levelIndex}-${mid + 1}`;
    
    // 添加左子节点
    if (!document.getElementById(leftNodeId)) {
        const leftNode = createTreeNode(array, start, mid, leftNodeId);
        leftNode.classList.add('active');
        level.appendChild(leftNode);
    }
    
    // 添加右子节点
    if (!document.getElementById(rightNodeId)) {
        const rightNode = createTreeNode(array, mid + 1, end, rightNodeId);
        level.appendChild(rightNode);
    }
    
    await delay(CONFIG.divideDelay);
    
    // 递归处理左半部分
    const leftArr = array.slice(start, mid + 1);
    const sortedLeft = await mergeSort(leftArr, start, mid, depth + 1);
    
    if (!isSorting) return arr;
    
    // 更新左子节点为已完成
    const leftNode = document.getElementById(leftNodeId);
    if (leftNode) {
        leftNode.classList.remove('active');
        leftNode.classList.add('completed');
    }
    
    // 递归处理右半部分
    const rightNode = document.getElementById(rightNodeId);
    if (rightNode) rightNode.classList.add('active');
    
    const rightArr = array.slice(mid + 1, end + 1);
    const sortedRight = await mergeSort(rightArr, mid + 1, end, depth + 1);
    
    if (!isSorting) return arr;
    
    if (rightNode) {
        rightNode.classList.remove('active');
        rightNode.classList.add('completed');
    }
    
    // 合并阶段
    setPhase('merge');
    updateStatus(window.I18n.t('合并: [{0} - {1}] 与 [{2} - {3}]', start, mid, mid + 1, end));
    
    // 高亮合并范围
    for (let i = start; i <= end; i++) {
        const item = document.getElementById(`array-${i}`);
        if (item) {
            if (i <= mid) {
                item.classList.add('left-part');
            } else {
                item.classList.add('right-part');
            }
        }
    }
    
    // 更新树节点显示合并中
    const parentNode = document.getElementById(`node-${depth}-${start}`) || document.getElementById('node-0-0');
    if (parentNode) {
        parentNode.classList.add('merging');
    }
    
    await delay(CONFIG.mergeDelay);
    
    // 执行合并
    const actualLeft = array.slice(start, mid + 1);
    const actualRight = array.slice(mid + 1, end + 1);
    const merged = await showMerge(actualLeft, actualRight, start);
    
    if (!isSorting) return arr;
    
    // 更新数组
    for (let i = 0; i < merged.length; i++) {
        array[start + i] = merged[i];
    }
    
    // 更新树节点为已完成
    if (parentNode) {
        parentNode.classList.remove('merging');
        parentNode.classList.add('completed');
        // 更新节点内容
        parentNode.innerHTML = '';
        for (let i = start; i <= end; i++) {
            const item = document.createElement('div');
            item.className = 'tree-item';
            item.textContent = array[i];
            parentNode.appendChild(item);
        }
    }
    
    // 移除合并高亮
    for (let i = start; i <= end; i++) {
        const item = document.getElementById(`array-${i}`);
        if (item) {
            item.classList.remove('left-part', 'right-part', 'merging', 'in-range');
        }
    }
    
    await delay(CONFIG.mergeDelay);
    
    return merged;
}

/**
 * 完成动画
 */
async function celebrateCompletion() {
    const items = document.querySelectorAll('.array-item');
    
    for (let i = 0; i < items.length; i++) {
        items[i].classList.add('sorted', 'celebrate');
        await delay(60);
    }
    
    await delay(500);
    
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
    
    // 重置状态
    document.querySelectorAll('.array-item').forEach(item => {
        item.classList.remove('sorted', 'in-range', 'left-part', 'right-part', 'merging');
    });
    document.querySelectorAll('.tree-node').forEach(node => {
        node.classList.remove('active', 'merging', 'completed');
    });
    
    updateStatus('开始归并排序...');
    if (window.AlgoLogger) window.AlgoLogger.step('开始归并排序');
    clearMergeArea();
    
    await mergeSort(array, 0, array.length - 1, 0);
    
    if (isSorting) {
        await celebrateCompletion();
        updateStatus('排序完成！');
        if (window.AlgoLogger) window.AlgoLogger.success('排序完成');
        clearMergeArea();
    }
    
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
    
    generateArray();
    setPhase('divide');
    updateStatus('点击"开始排序"查看动画');
}

// 事件监听
startBtn.addEventListener('click', startSorting);
resetBtn.addEventListener('click', reset);
if (pauseBtn) {
    pauseBtn.addEventListener('click', togglePause);
}

// 初始化 - 等待 AlgoLogger 模块加载完成
if (document.readyState === 'complete') {
    setTimeout(generateArray, 50);
} else {
    window.addEventListener('load', () => setTimeout(generateArray, 50));
}
