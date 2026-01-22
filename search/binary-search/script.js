/**
 * 二分查找可视化
 * @author changyadai
 */

const CONFIG = { stepDelay: 800 };

let array = [];
let target = 42;
let isRunning = false;
let isPaused = false;

const arrayContainer = document.getElementById('arrayContainer');
const indexRow = document.getElementById('indexRow');
const targetInput = document.getElementById('targetInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const pauseBtn = document.getElementById('pauseBtn');
const statusText = document.getElementById('statusText');

const leftLabel = document.getElementById('leftLabel');
const midLabel = document.getElementById('midLabel');
const rightLabel = document.getElementById('rightLabel');

const midValue = document.getElementById('midValue');
const targetValue = document.getElementById('targetValue');
const compareOp = document.getElementById('compareOp');
const stepCount = document.getElementById('stepCount');
const rangeLeft = document.getElementById('rangeLeft');
const rangeRight = document.getElementById('rangeRight');

function init() {
    // 生成有序数组
    array = [];
    let val = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < 20; i++) {
        array.push(val);
        val += Math.floor(Math.random() * 8) + 1;
    }
    
    renderArray();
    resetLabels();
    updateStatus('输入目标值后点击开始');
    
    // 日志记录
    if (window.AlgoLogger) {
        window.AlgoLogger.clear();
        window.AlgoLogger.info('生成有序数组: {0} 个元素, 范围 [{1}, {2}]', array.length, array[0], array[array.length-1]);
        window.AlgoLogger.log('数据: [{0}]', array.join(', '));
    }
}

function renderArray() {
    arrayContainer.innerHTML = '';
    indexRow.innerHTML = '';
    
    array.forEach((val, i) => {
        const item = document.createElement('div');
        item.className = 'array-item';
        item.id = `item-${i}`;
        item.textContent = val;
        arrayContainer.appendChild(item);
        
        const idx = document.createElement('div');
        idx.className = 'index-item';
        idx.textContent = i;
        indexRow.appendChild(idx);
    });
}

function resetLabels() {
    leftLabel.classList.remove('visible');
    midLabel.classList.remove('visible');
    rightLabel.classList.remove('visible');
    
    midValue.textContent = '-';
    targetValue.textContent = '-';
    compareOp.textContent = '?';
    compareOp.className = 'compare-op';
    stepCount.textContent = '0';
    rangeLeft.textContent = '0';
    rangeRight.textContent = array.length - 1;
}

function updatePointerPositions(left, mid, right) {
    const items = document.querySelectorAll('.array-item');
    const containerRect = arrayContainer.getBoundingClientRect();
    
    if (left >= 0 && left < items.length) {
        const itemRect = items[left].getBoundingClientRect();
        leftLabel.style.left = `${itemRect.left - containerRect.left + itemRect.width / 2 - 15}px`;
        leftLabel.classList.add('visible');
    }
    
    if (mid >= 0 && mid < items.length) {
        const itemRect = items[mid].getBoundingClientRect();
        midLabel.style.left = `${itemRect.left - containerRect.left + itemRect.width / 2 - 15}px`;
        midLabel.classList.add('visible');
    }
    
    if (right >= 0 && right < items.length) {
        const itemRect = items[right].getBoundingClientRect();
        rightLabel.style.left = `${itemRect.left - containerRect.left + itemRect.width / 2 - 15}px`;
        rightLabel.classList.add('visible');
    }
}

function updateArrayDisplay(left, right, mid = -1) {
    document.querySelectorAll('.array-item').forEach((item, i) => {
        item.className = 'array-item';
        
        if (i >= left && i <= right) {
            item.classList.add('in-range');
            if (i === left) item.classList.add('left');
            if (i === right) item.classList.add('right');
            if (i === mid) item.classList.add('mid');
        } else {
            item.classList.add('out-range');
        }
    });
    
    rangeLeft.textContent = left;
    rangeRight.textContent = right;
}

function delay(ms) {
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

function updateStatus(text) {
    statusText.textContent = window.I18n ? window.I18n.t(text) : text;
}

async function binarySearch() {
    let left = 0;
    let right = array.length - 1;
    let step = 0;
    
    targetValue.textContent = target;
    
    while (left <= right && isRunning) {
        step++;
        stepCount.textContent = step;
        
        const mid = Math.floor((left + right) / 2);
        
        updateArrayDisplay(left, right, mid);
        updatePointerPositions(left, mid, right);
        
        midValue.textContent = array[mid];
        
        updateStatus(window.I18n.t('第{0}步: 检查中点 arr[{1}] = {2}', step, mid, array[mid]));
        
        await delay(CONFIG.stepDelay);
        
        if (array[mid] === target) {
            // 找到目标
            compareOp.textContent = '=';
            compareOp.className = 'compare-op equal';
            
            const item = document.getElementById(`item-${mid}`);
            item.classList.add('found');
            
            updateStatus(window.I18n.t('找到目标! 位置: {0}, 共 {1} 步', mid, step));
            if (window.AlgoLogger) window.AlgoLogger.success('找到目标: 位置 {0}, 共 {1} 步', mid, step);
            return mid;
        } else if (array[mid] < target) {
            // 目标在右半部分
            compareOp.textContent = '<';
            compareOp.className = 'compare-op less';
            updateStatus(window.I18n.t('{0} < {1}, 搜索右半部分', array[mid], target));
            
            await delay(CONFIG.stepDelay / 2);
            left = mid + 1;
        } else {
            // 目标在左半部分
            compareOp.textContent = '>';
            compareOp.className = 'compare-op greater';
            updateStatus(window.I18n.t('{0} > {1}, 搜索左半部分', array[mid], target));
            
            await delay(CONFIG.stepDelay / 2);
            right = mid - 1;
        }
    }
    
    // 未找到
    document.querySelectorAll('.array-item').forEach(item => {
        item.classList.add('not-found');
    });
    updateStatus(window.I18n.t('未找到目标 {0}', target));
    if (window.AlgoLogger) window.AlgoLogger.warn('未找到目标: {0}', target);
    return -1;
}

async function start() {
    if (isRunning) return;
    
    target = parseInt(targetInput.value) || 42;
    
    isRunning = true;
    isPaused = false;
    startBtn.disabled = true;
    if (pauseBtn) {
        pauseBtn.disabled = false;
        pauseBtn.textContent = window.I18n ? window.I18n.t('暂停') : '暂停';
        pauseBtn.classList.remove('paused');
    }
    
    resetLabels();
    renderArray();
    
    await binarySearch();
    
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
    init();
}

startBtn.addEventListener('click', start);
resetBtn.addEventListener('click', reset);
if (pauseBtn) {
    pauseBtn.addEventListener('click', togglePause);
}
targetInput.addEventListener('change', () => {
    if (!isRunning) {
        target = parseInt(targetInput.value) || 42;
    }
});

// 等待 I18n 模块加载完成后初始化
if (document.readyState === 'complete') {
    setTimeout(init, 50);
} else {
    window.addEventListener('load', () => setTimeout(init, 50));
}
