/**
 * 快速排序可视化动画控制
 * @author changyadai
 */

// 配置
const CONFIG = {
    arraySize: 10,
    minValue: 20,
    maxValue: 280,
    compareDelay: 400,
    swapDelay: 450,
    maxDepth: 8
};

// 状态
let array = [];
let isSorting = false;
let currentDepth = 0;

// DOM 元素
const arrayContainer = document.getElementById('arrayContainer');
const depthBars = document.getElementById('depthBars');
const partitionText = document.getElementById('partitionText');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const statusText = document.getElementById('statusText');

/**
 * 初始化深度指示器
 */
function initDepthIndicator() {
    depthBars.innerHTML = '';
    for (let i = 0; i < CONFIG.maxDepth; i++) {
        const bar = document.createElement('div');
        bar.className = 'depth-bar';
        bar.id = `depth-${i}`;
        depthBars.appendChild(bar);
    }
}

/**
 * 更新深度指示器
 */
function updateDepth(depth) {
    currentDepth = depth;
    for (let i = 0; i < CONFIG.maxDepth; i++) {
        const bar = document.getElementById(`depth-${i}`);
        if (bar) {
            bar.classList.toggle('active', i <= depth);
        }
    }
}

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
    initDepthIndicator();
}

/**
 * 渲染数组
 */
function renderArray() {
    arrayContainer.innerHTML = '';
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.id = `bar-${index}`;
        bar.style.height = `${value}px`;
        bar.dataset.index = index;
        bar.textContent = Math.floor(value / 10);
        arrayContainer.appendChild(bar);
    });
}

/**
 * 延迟函数
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 更新状态文本
 */
function updateStatus(text) {
    statusText.textContent = text;
}

/**
 * 更新分区信息
 */
function updatePartitionInfo(text) {
    partitionText.textContent = text;
}

/**
 * 获取柱状条元素
 */
function getBar(index) {
    return document.getElementById(`bar-${index}`);
}

/**
 * 清除所有状态类
 */
function clearAllStates() {
    document.querySelectorAll('.bar').forEach(bar => {
        bar.classList.remove('pivot', 'left-pointer', 'right-pointer', 'comparing', 'swapping', 'in-partition', 'out-of-partition');
    });
}

/**
 * 标记分区范围
 */
function markPartition(low, high) {
    document.querySelectorAll('.bar').forEach((bar, index) => {
        if (index >= low && index <= high) {
            bar.classList.add('in-partition');
            bar.classList.remove('out-of-partition');
        } else if (!bar.classList.contains('sorted')) {
            bar.classList.add('out-of-partition');
            bar.classList.remove('in-partition');
        }
    });
}

/**
 * 创建火花粒子效果
 */
function createSparks(element) {
    const rect = element.getBoundingClientRect();
    const containerRect = arrayContainer.getBoundingClientRect();
    
    for (let i = 0; i < 8; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark-particle';
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        spark.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
        spark.style.top = `${rect.top - containerRect.top + rect.height / 3}px`;
        spark.style.setProperty('--tx', `${tx}px`);
        spark.style.setProperty('--ty', `${ty}px`);
        
        arrayContainer.appendChild(spark);
        
        setTimeout(() => spark.remove(), 600);
    }
}

/**
 * 创建基准就位爆炸效果
 */
function createPivotExplosion(element) {
    const rect = element.getBoundingClientRect();
    const containerRect = arrayContainer.getBoundingClientRect();
    
    const explosion = document.createElement('div');
    explosion.className = 'pivot-explosion';
    explosion.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
    explosion.style.top = `${rect.top - containerRect.top + rect.height / 2}px`;
    
    arrayContainer.appendChild(explosion);
    
    setTimeout(() => explosion.remove(), 500);
}

/**
 * 高亮基准元素
 */
function highlightPivot(index) {
    const bar = getBar(index);
    if (bar) {
        bar.classList.add('pivot');
        createSparks(bar);
    }
}

/**
 * 高亮指针
 */
function highlightPointers(leftIdx, rightIdx) {
    // 清除之前的指针
    document.querySelectorAll('.left-pointer, .right-pointer').forEach(bar => {
        bar.classList.remove('left-pointer', 'right-pointer');
    });
    
    const leftBar = getBar(leftIdx);
    const rightBar = getBar(rightIdx);
    
    if (leftBar && !leftBar.classList.contains('pivot')) {
        leftBar.classList.add('left-pointer');
    }
    if (rightBar && !rightBar.classList.contains('pivot')) {
        rightBar.classList.add('right-pointer');
    }
}

/**
 * 交换两个元素
 */
async function swap(i, j) {
    if (i === j) return;
    
    const bar1 = getBar(i);
    const bar2 = getBar(j);
    
    bar1.classList.add('swapping');
    bar2.classList.add('swapping');
    
    // 计算需要移动的距离
    const diff = j - i;
    bar1.style.transform = `translateX(${diff * 56}px)`;
    bar2.style.transform = `translateX(${-diff * 56}px)`;
    
    await delay(CONFIG.swapDelay);
    
    // 交换数组值
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    
    // 重新渲染交换后的元素
    bar1.style.height = `${array[i]}px`;
    bar1.textContent = Math.floor(array[i] / 10);
    bar1.style.transform = '';
    
    bar2.style.height = `${array[j]}px`;
    bar2.textContent = Math.floor(array[j] / 10);
    bar2.style.transform = '';
    
    bar1.classList.remove('swapping');
    bar2.classList.remove('swapping');
}

/**
 * 分区函数
 */
async function partition(low, high, depth) {
    // 选择最右边的元素作为基准
    const pivotValue = array[high];
    const pivotBar = getBar(high);
    
    updatePartitionInfo(`分区 [${low} - ${high}], 基准值: ${Math.floor(pivotValue / 10)}`);
    markPartition(low, high);
    highlightPivot(high);
    
    await delay(CONFIG.compareDelay);
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (!isSorting) return -1;
        
        highlightPointers(i + 1, j);
        updateStatus(`比较: 元素[${j}]=${Math.floor(array[j] / 10)} 与 基准=${Math.floor(pivotValue / 10)}`);
        
        const currentBar = getBar(j);
        currentBar.classList.add('comparing');
        
        await delay(CONFIG.compareDelay);
        
        if (array[j] < pivotValue) {
            i++;
            if (i !== j) {
                updateStatus(`交换: 元素[${i}] 和 元素[${j}]`);
                await swap(i, j);
            }
        }
        
        currentBar.classList.remove('comparing');
    }
    
    // 将基准放到正确的位置
    const pivotFinalPos = i + 1;
    if (pivotFinalPos !== high) {
        updateStatus(`基准就位: 移动到位置 ${pivotFinalPos}`);
        await swap(pivotFinalPos, high);
    }
    
    // 标记基准已排序
    const finalPivotBar = getBar(pivotFinalPos);
    finalPivotBar.classList.remove('pivot');
    finalPivotBar.classList.add('sorted');
    createPivotExplosion(finalPivotBar);
    
    await delay(300);
    
    return pivotFinalPos;
}

/**
 * 快速排序主函数
 */
async function quickSort(low, high, depth = 0) {
    if (!isSorting) return;
    
    updateDepth(depth);
    
    if (low < high) {
        updateStatus(`递归深度: ${depth}, 处理范围: [${low} - ${high}]`);
        
        const pivotIndex = await partition(low, high, depth);
        
        if (pivotIndex === -1 || !isSorting) return;
        
        // 清除当前分区的指针和状态
        clearAllStates();
        
        // 递归排序左半部分
        await quickSort(low, pivotIndex - 1, depth + 1);
        
        if (!isSorting) return;
        
        // 递归排序右半部分
        await quickSort(pivotIndex + 1, high, depth + 1);
    } else if (low === high) {
        // 单个元素，直接标记为已排序
        const bar = getBar(low);
        if (bar && !bar.classList.contains('sorted')) {
            bar.classList.add('sorted');
        }
    }
    
    // 回溯时更新深度
    updateDepth(Math.max(0, depth - 1));
}

/**
 * 完成动画
 */
async function celebrateCompletion() {
    const bars = document.querySelectorAll('.bar');
    
    for (let i = 0; i < bars.length; i++) {
        bars[i].classList.add('celebrate');
        createSparks(bars[i]);
        await delay(60);
    }
    
    await delay(500);
    
    bars.forEach(bar => bar.classList.remove('celebrate'));
}

/**
 * 开始排序
 */
async function startSorting() {
    if (isSorting) return;
    
    isSorting = true;
    startBtn.disabled = true;
    resetBtn.disabled = true;
    
    // 重置所有状态
    document.querySelectorAll('.bar').forEach(bar => {
        bar.classList.remove('sorted', 'pivot', 'left-pointer', 'right-pointer', 'comparing', 'swapping', 'in-partition', 'out-of-partition');
    });
    
    updateStatus('开始快速排序...');
    updatePartitionInfo('开始分区...');
    
    await quickSort(0, array.length - 1, 0);
    
    if (isSorting) {
        // 确保所有元素都标记为已排序
        document.querySelectorAll('.bar').forEach(bar => {
            bar.classList.add('sorted');
            bar.classList.remove('in-partition', 'out-of-partition');
        });
        
        await celebrateCompletion();
        
        updateStatus('排序完成！');
        updatePartitionInfo('所有元素已排序');
    }
    
    isSorting = false;
    startBtn.disabled = false;
    resetBtn.disabled = false;
}

/**
 * 重置
 */
function reset() {
    isSorting = false;
    startBtn.disabled = false;
    resetBtn.disabled = false;
    
    // 清除粒子
    document.querySelectorAll('.spark-particle, .pivot-explosion').forEach(p => p.remove());
    
    generateArray();
    updateDepth(0);
    updateStatus('点击"开始排序"查看动画');
    updatePartitionInfo('点击开始查看分区过程');
}

// 事件监听
startBtn.addEventListener('click', startSorting);
resetBtn.addEventListener('click', reset);

// 初始化
generateArray();
