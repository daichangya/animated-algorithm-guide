/**
 * 0/1背包问题可视化
 * @author changyadai
 */

const CONFIG = { stepDelay: 150 };

const items = [
    { name: '宝石', icon: '💎', weight: 1, value: 6 },
    { name: '金币', icon: '🪙', weight: 2, value: 10 },
    { name: '王冠', icon: '👑', weight: 3, value: 12 },
    { name: '药水', icon: '🧪', weight: 2, value: 8 },
    { name: '卷轴', icon: '📜', weight: 4, value: 15 }
];

const capacity = 8;
let dp = [];
let isRunning = false;

const itemsList = document.getElementById('itemsList');
const dpTable = document.getElementById('dpTable');
const maxValueEl = document.getElementById('maxValue');
const selectedItemsEl = document.getElementById('selectedItems');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const statusText = document.getElementById('statusText');

function init() {
    renderItems();
    renderDPTable();
    maxValueEl.textContent = '?';
    selectedItemsEl.innerHTML = '<span style="color:rgba(255,255,255,0.4)">-</span>';
    updateStatus('点击开始查看DP填表过程');
}

function renderItems() {
    itemsList.innerHTML = '';
    items.forEach((item, i) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.id = `item-${i}`;
        card.innerHTML = `
            <span class="item-icon">${item.icon}</span>
            <span class="item-name">${item.name}</span>
            <div class="item-stats">
                <span class="item-weight">重${item.weight}</span>
                <span class="item-value">值${item.value}</span>
            </div>
        `;
        itemsList.appendChild(card);
    });
}

function renderDPTable() {
    // 初始化DP数组
    dp = Array(items.length + 1).fill(null).map(() => 
        Array(capacity + 1).fill(0)
    );
    
    let html = '<thead><tr><th class="corner"></th>';
    for (let w = 0; w <= capacity; w++) {
        html += `<th>${w}</th>`;
    }
    html += '</tr></thead><tbody>';
    
    for (let i = 0; i <= items.length; i++) {
        html += '<tr>';
        html += `<th class="row-header">${i === 0 ? '0' : items[i-1].icon}</th>`;
        for (let w = 0; w <= capacity; w++) {
            html += `<td id="dp-${i}-${w}">0</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody>';
    
    dpTable.innerHTML = html;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateStatus(text) {
    statusText.textContent = text;
}

function getCell(i, w) {
    return document.getElementById(`dp-${i}-${w}`);
}

async function fillDP() {
    for (let i = 1; i <= items.length; i++) {
        const item = items[i - 1];
        const itemCard = document.getElementById(`item-${i - 1}`);
        itemCard.classList.add('considering');
        
        for (let w = 0; w <= capacity; w++) {
            if (!isRunning) return;
            
            const cell = getCell(i, w);
            cell.classList.add('current');
            
            // 不选择当前物品
            const notTake = dp[i - 1][w];
            
            // 选择当前物品（如果装得下）
            let take = 0;
            if (item.weight <= w) {
                take = dp[i - 1][w - item.weight] + item.value;
                
                // 高亮来源单元格
                const fromCell = getCell(i - 1, w - item.weight);
                fromCell.classList.add('from');
            }
            
            dp[i][w] = Math.max(notTake, take);
            cell.textContent = dp[i][w];
            
            updateStatus(`物品${i}(${item.icon}), 容量${w}: max(不选${notTake}, 选${take}) = ${dp[i][w]}`);
            
            await delay(CONFIG.stepDelay);
            
            cell.classList.remove('current');
            cell.classList.add('filled');
            
            // 清除from高亮
            document.querySelectorAll('.from').forEach(c => c.classList.remove('from'));
        }
        
        itemCard.classList.remove('considering');
    }
    
    maxValueEl.textContent = dp[items.length][capacity];
}

async function backtrack() {
    const selected = [];
    let w = capacity;
    
    updateStatus('回溯找出选中的物品...');
    
    for (let i = items.length; i > 0 && w > 0; i--) {
        if (!isRunning) return;
        
        const cell = getCell(i, w);
        cell.classList.add('path');
        
        if (dp[i][w] !== dp[i - 1][w]) {
            // 选择了物品i
            selected.unshift(i - 1);
            const itemCard = document.getElementById(`item-${i - 1}`);
            itemCard.classList.add('selected');
            
            w -= items[i - 1].weight;
        }
        
        await delay(CONFIG.stepDelay * 2);
    }
    
    // 显示选中物品
    selectedItemsEl.innerHTML = '';
    for (const idx of selected) {
        const el = document.createElement('span');
        el.className = 'selected-item';
        el.textContent = items[idx].icon;
        selectedItemsEl.appendChild(el);
        await delay(200);
    }
    
    updateStatus(`完成! 最大价值: ${dp[items.length][capacity]}`);
}

async function start() {
    if (isRunning) return;
    isRunning = true;
    startBtn.disabled = true;
    
    renderDPTable();
    document.querySelectorAll('.item-card').forEach(c => {
        c.classList.remove('considering', 'selected');
    });
    selectedItemsEl.innerHTML = '';
    maxValueEl.textContent = '?';
    
    await fillDP();
    
    if (isRunning) {
        await backtrack();
    }
    
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

init();
