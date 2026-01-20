/**
 * 二分查找可视化
 * @author changyadai
 */

const CONFIG = { stepDelay: 800 };

let array = [];
let target = 42;
let isRunning = false;

const arrayContainer = document.getElementById('arrayContainer');
const indexRow = document.getElementById('indexRow');
const targetInput = document.getElementById('targetInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
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
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateStatus(text) {
    statusText.textContent = text;
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
        
        updateStatus(`第${step}步: 检查中点 arr[${mid}] = ${array[mid]}`);
        
        await delay(CONFIG.stepDelay);
        
        if (array[mid] === target) {
            // 找到目标
            compareOp.textContent = '=';
            compareOp.className = 'compare-op equal';
            
            const item = document.getElementById(`item-${mid}`);
            item.classList.add('found');
            
            updateStatus(`找到目标! 位置: ${mid}, 共 ${step} 步`);
            return mid;
        } else if (array[mid] < target) {
            // 目标在右半部分
            compareOp.textContent = '<';
            compareOp.className = 'compare-op less';
            updateStatus(`${array[mid]} < ${target}, 搜索右半部分`);
            
            await delay(CONFIG.stepDelay / 2);
            left = mid + 1;
        } else {
            // 目标在左半部分
            compareOp.textContent = '>';
            compareOp.className = 'compare-op greater';
            updateStatus(`${array[mid]} > ${target}, 搜索左半部分`);
            
            await delay(CONFIG.stepDelay / 2);
            right = mid - 1;
        }
    }
    
    // 未找到
    document.querySelectorAll('.array-item').forEach(item => {
        item.classList.add('not-found');
    });
    updateStatus(`未找到目标 ${target}`);
    return -1;
}

async function start() {
    if (isRunning) return;
    
    target = parseInt(targetInput.value) || 42;
    
    isRunning = true;
    startBtn.disabled = true;
    
    resetLabels();
    renderArray();
    
    await binarySearch();
    
    isRunning = false;
    startBtn.disabled = false;
}

function reset() {
    isRunning = false;
    startBtn.disabled = false;
    init();
}

startBtn.addEventListener('click', start);
resetBtn.addEventListener('click', reset);
targetInput.addEventListener('change', () => {
    if (!isRunning) {
        target = parseInt(targetInput.value) || 42;
    }
});

init();
