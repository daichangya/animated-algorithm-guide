/**
 * 冒泡排序可视化动画控制
 * @author changyadai
 */

// 配置
const CONFIG = {
    arraySize: 10,           // 数组大小
    minValue: 20,            // 最小值
    maxValue: 280,           // 最大值
    compareDelay: 400,       // 比较延迟（毫秒）
    swapDelay: 450,          // 交换动画时长（毫秒）
    bubbleCount: 5           // 每次产生的气泡数量
};

// 状态
let array = [];
let isSorting = false;

// DOM 元素
const arrayContainer = document.getElementById('arrayContainer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
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
}

/**
 * 渲染数组为柱状图
 */
function renderArray() {
    arrayContainer.innerHTML = '';
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${value}px`;
        bar.dataset.index = index;
        bar.dataset.value = value;
        bar.textContent = Math.floor(value / 10); // 显示简化的数值
        arrayContainer.appendChild(bar);
    });
}

/**
 * 获取所有柱状条元素
 */
function getBars() {
    return document.querySelectorAll('.bar');
}

/**
 * 延迟函数
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 高亮比较的元素
 */
async function highlightComparing(index1, index2) {
    const bars = getBars();
    bars[index1].classList.add('comparing');
    bars[index2].classList.add('comparing');
    
    // 创建冒泡效果
    createBubbles(bars[index1]);
    createBubbles(bars[index2]);
    
    await delay(CONFIG.compareDelay);
}

/**
 * 移除高亮
 */
function removeHighlight(index1, index2) {
    const bars = getBars();
    bars[index1].classList.remove('comparing', 'swapping');
    bars[index2].classList.remove('comparing', 'swapping');
}

/**
 * 创建气泡粒子效果
 */
function createBubbles(barElement) {
    const rect = barElement.getBoundingClientRect();
    const containerRect = arrayContainer.getBoundingClientRect();
    
    for (let i = 0; i < CONFIG.bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // 随机位置在柱子宽度范围内
        const offsetX = rect.left - containerRect.left + Math.random() * rect.width;
        const offsetY = rect.top - containerRect.top + rect.height * 0.8;
        
        bubble.style.left = `${offsetX}px`;
        bubble.style.top = `${offsetY}px`;
        bubble.style.width = `${6 + Math.random() * 8}px`;
        bubble.style.height = bubble.style.width;
        bubble.style.animationDelay = `${Math.random() * 0.2}s`;
        bubble.style.animationDuration = `${0.8 + Math.random() * 0.4}s`;
        
        arrayContainer.appendChild(bubble);
        
        // 动画结束后移除气泡
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.remove();
            }
        }, 1500);
    }
}

/**
 * 交换两个元素（带动画）
 */
async function swap(index1, index2) {
    const bars = getBars();
    const bar1 = bars[index1];
    const bar2 = bars[index2];
    
    bar1.classList.add('swapping');
    bar2.classList.add('swapping');
    
    // 添加移动动画类
    bar1.classList.add('move-right');
    bar2.classList.add('move-left');
    
    // 创建更多气泡效果表示交换
    createBubbles(bar1);
    createBubbles(bar2);
    
    await delay(CONFIG.swapDelay);
    
    // 移除动画类
    bar1.classList.remove('move-right');
    bar2.classList.remove('move-left');
    
    // 实际交换 DOM 元素
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
    
    // 更新显示
    bar1.style.height = `${array[index1]}px`;
    bar1.textContent = Math.floor(array[index1] / 10);
    bar1.dataset.value = array[index1];
    
    bar2.style.height = `${array[index2]}px`;
    bar2.textContent = Math.floor(array[index2] / 10);
    bar2.dataset.value = array[index2];
}

/**
 * 标记元素为已排序
 */
function markSorted(index) {
    const bars = getBars();
    bars[index].classList.add('sorted');
}

/**
 * 更新状态文本
 */
function updateStatus(text) {
    statusText.textContent = text;
}

/**
 * 冒泡排序主函数（异步，支持动画）
 */
async function bubbleSort() {
    const n = array.length;
    let comparisons = 0;
    let swaps = 0;
    
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        
        for (let j = 0; j < n - i - 1; j++) {
            if (!isSorting) return; // 检查是否被中断
            
            comparisons++;
            updateStatus(`正在比较: 位置 ${j + 1} 和 位置 ${j + 2}`);
            
            // 高亮正在比较的元素
            await highlightComparing(j, j + 1);
            
            if (array[j] > array[j + 1]) {
                updateStatus(`交换: ${Math.floor(array[j] / 10)} 和 ${Math.floor(array[j + 1] / 10)}`);
                await swap(j, j + 1);
                swapped = true;
                swaps++;
            }
            
            // 移除高亮
            removeHighlight(j, j + 1);
        }
        
        // 标记当前轮次的最大值已到位
        markSorted(n - i - 1);
        
        // 如果没有交换发生，说明已经有序
        if (!swapped) {
            // 标记剩余所有元素为已排序
            for (let k = 0; k < n - i - 1; k++) {
                markSorted(k);
            }
            break;
        }
    }
    
    // 标记第一个元素
    markSorted(0);
    
    // 完成动画
    await celebrateCompletion();
    
    updateStatus(`排序完成！比较次数: ${comparisons}, 交换次数: ${swaps}`);
}

/**
 * 完成时的庆祝动画
 */
async function celebrateCompletion() {
    const bars = getBars();
    
    for (let i = 0; i < bars.length; i++) {
        bars[i].classList.add('celebrate');
        createBubbles(bars[i]);
        await delay(80);
    }
    
    await delay(600);
    
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
    
    // 移除所有之前的状态类
    const bars = getBars();
    bars.forEach(bar => {
        bar.classList.remove('sorted', 'comparing', 'swapping');
    });
    
    updateStatus('排序开始...');
    
    await bubbleSort();
    
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
    
    // 清除所有气泡
    document.querySelectorAll('.bubble').forEach(b => b.remove());
    
    generateArray();
    updateStatus('点击"开始排序"查看动画');
}

// 事件监听
startBtn.addEventListener('click', startSorting);
resetBtn.addEventListener('click', reset);

// 初始化
generateArray();
