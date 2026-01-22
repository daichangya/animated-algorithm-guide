/**
 * 0/1背包问题可视化
 * @author changyadai
 */

const CONFIG = { stepDelay: 150 };

const items = [
    { name: 'Gem', nameZh: '宝石', icon: '💎', weight: 1, value: 6 },
    { name: 'Gold Coin', nameZh: '金币', icon: '🪙', weight: 2, value: 10 },
    { name: 'Crown', nameZh: '王冠', icon: '👑', weight: 3, value: 12 },
    { name: 'Potion', nameZh: '药水', icon: '🧪', weight: 2, value: 8 },
    { name: 'Scroll', nameZh: '卷轴', icon: '📜', weight: 4, value: 15 }
];

// 获取翻译后的物品名称
function getItemName(item) {
    // 如果是英文页面，使用 name；否则使用 nameZh
    if (window.location.pathname.includes('/en/')) {
        return item.name;
    }
    return item.nameZh;
}

const capacity = 8;
let dp = [];
let isRunning = false;
let isPaused = false;

const itemsList = document.getElementById('itemsList');
const dpTable = document.getElementById('dpTable');
const maxValueEl = document.getElementById('maxValue');
const selectedItemsEl = document.getElementById('selectedItems');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const pauseBtn = document.getElementById('pauseBtn');
const statusText = document.getElementById('statusText');

function init() {
    renderItems();
    renderDPTable();
    maxValueEl.textContent = '?';
    selectedItemsEl.innerHTML = '<span style="color:rgba(255,255,255,0.4)">-</span>';
    updateStatus('点击开始查看DP填表过程');
    
    // 日志记录
    if (window.AlgoLogger) {
        window.AlgoLogger.clear();
        window.AlgoLogger.info('背包问题初始化: {0} 个物品, 容量 = {1}', items.length, capacity);
        window.AlgoLogger.log('物品列表: [{0}]', items.map((item, i) => 
            `${i+1}.${getItemName(item)} (w:${item.weight}, v:${item.value})`
        ).join(', '));
    }
}

function renderItems() {
    itemsList.innerHTML = '';
    const t = window.I18n ? window.I18n.t.bind(window.I18n) : (s) => s;
    items.forEach((item, i) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.id = `item-${i}`;
        card.innerHTML = `
            <span class="item-icon">${item.icon}</span>
            <span class="item-name">${getItemName(item)}</span>
            <div class="item-stats">
                <span class="item-weight">${t('重量')}: ${item.weight}</span>
                <span class="item-value">${t('价值')}: ${item.value}</span>
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
            
            updateStatus(window.I18n.t('物品{0}({1}), 容量{2}: max(不选{3}, 选{4}) = {5}', i, item.icon, w, notTake, take, dp[i][w]));
            
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
    
    const t2 = window.I18n ? window.I18n.t.bind(window.I18n) : (x) => x;
    updateStatus(t2('回溯找出选中的物品...'));
    
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
    
    updateStatus(window.I18n.t('完成！ 最大价值: {0}', dp[items.length][capacity]));
    if (window.AlgoLogger) window.AlgoLogger.success('完成: 最大价值 = {0}', dp[items.length][capacity]);
}

async function start() {
    if (isRunning) return;
    isRunning = true;
    isPaused = false;
    startBtn.disabled = true;
    if (pauseBtn) {
        pauseBtn.disabled = false;
        pauseBtn.textContent = window.I18n ? window.I18n.t('暂停') : '暂停';
        pauseBtn.classList.remove('paused');
    }
    
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

// 等待 I18n 模块加载完成后初始化
if (document.readyState === 'complete') {
    setTimeout(init, 50);  // 给 i18n.js 加载时间
} else {
    window.addEventListener('load', () => setTimeout(init, 50));
}
