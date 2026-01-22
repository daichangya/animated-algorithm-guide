/**
 * LCS最长公共子序列可视化
 * @author changyadai
 */

// 配置
const CONFIG = {
    fillDelay: 100,
    compareDelay: 200,
    backtrackDelay: 300,
    resultDelay: 200
};

// 状态
let seqA = '';
let seqB = '';
let dp = [];
let isRunning = false;
let isPaused = false;

// DOM元素
const seqAInput = document.getElementById('seqAInput');
const seqBInput = document.getElementById('seqBInput');
const seqAChars = document.getElementById('seqAChars');
const seqBChars = document.getElementById('seqBChars');
const dpMatrix = document.getElementById('dpMatrix');
const lcsChars = document.getElementById('lcsChars');
const lcsLength = document.getElementById('lcsLength');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const pauseBtn = document.getElementById('pauseBtn');
const statusText = document.getElementById('statusText');

/**
 * 初始化
 */
function init() {
    seqA = seqAInput.value;
    seqB = seqBInput.value;
    renderSequences();
    renderDPMatrix();
    lcsChars.innerHTML = '<span style="color: rgba(255,255,255,0.4)">运行算法后显示</span>';
    lcsLength.innerHTML = '长度: <span>?</span>';
    
    // 日志记录
    if (window.AlgoLogger) {
        window.AlgoLogger.clear();
        window.AlgoLogger.info('LCS初始化: 序列A长度={0}, 序列B长度={1}', seqA.length, seqB.length);
    }
}

/**
 * 渲染序列显示
 */
function renderSequences() {
    seqAChars.innerHTML = '';
    seqBChars.innerHTML = '';
    
    seqA.split('').forEach((char, i) => {
        const el = document.createElement('div');
        el.className = 'seq-char';
        el.id = `seqA-${i}`;
        el.textContent = char;
        seqAChars.appendChild(el);
    });
    
    seqB.split('').forEach((char, i) => {
        const el = document.createElement('div');
        el.className = 'seq-char';
        el.id = `seqB-${i}`;
        el.textContent = char;
        seqBChars.appendChild(el);
    });
}

/**
 * 渲染DP矩阵（空）
 */
function renderDPMatrix() {
    const m = seqA.length;
    const n = seqB.length;
    
    // 初始化DP数组
    dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    let html = '<thead><tr>';
    html += '<th class="corner"></th>';
    html += '<th></th>'; // 空列头
    
    for (let j = 0; j < n; j++) {
        html += `<th>${seqB[j]}</th>`;
    }
    html += '</tr></thead>';
    
    html += '<tbody>';
    for (let i = 0; i <= m; i++) {
        html += '<tr>';
        html += `<th>${i === 0 ? '' : seqA[i - 1]}</th>`;
        
        for (let j = 0; j <= n; j++) {
            const value = (i === 0 || j === 0) ? '0' : '';
            const cellClass = (i === 0 || j === 0) ? 'filled' : 'empty';
            html += `<td id="dp-${i}-${j}" class="${cellClass}">${value}</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody>';
    
    dpMatrix.innerHTML = html;
}

/**
 * 延迟函数（支持暂停）
 */
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
 * 获取DP单元格
 */
function getCell(i, j) {
    return document.getElementById(`dp-${i}-${j}`);
}

/**
 * 高亮序列字符
 */
function highlightSeqChars(aIndex, bIndex, className) {
    if (aIndex >= 0) {
        const charA = document.getElementById(`seqA-${aIndex}`);
        if (charA) charA.classList.add(className);
    }
    if (bIndex >= 0) {
        const charB = document.getElementById(`seqB-${bIndex}`);
        if (charB) charB.classList.add(className);
    }
}

/**
 * 清除序列字符高亮
 */
function clearSeqHighlights() {
    document.querySelectorAll('.seq-char').forEach(el => {
        el.classList.remove('comparing', 'matched');
    });
}

/**
 * 填充DP矩阵
 */
async function fillDPMatrix() {
    const m = seqA.length;
    const n = seqB.length;
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (!isRunning) return;
            
            const cell = getCell(i, j);
            cell.classList.add('current');
            
            // 高亮正在比较的字符
            highlightSeqChars(i - 1, j - 1, 'comparing');
            
            updateStatus(window.I18n.t('比较 A[{0}]="{1}" 和 B[{2}]="{3}"', i, seqA[i-1], j, seqB[j-1]));
            
            await delay(CONFIG.compareDelay);
            
            if (seqA[i - 1] === seqB[j - 1]) {
                // 字符匹配 - 对角线 + 1
                dp[i][j] = dp[i - 1][j - 1] + 1;
                cell.textContent = dp[i][j];
                cell.classList.add('match', 'diagonal-arrow');
                
                highlightSeqChars(i - 1, j - 1, 'matched');
                updateStatus(window.I18n.t('匹配! dp[{0}][{1}] = dp[{2}][{3}] + 1 = {4}', i, j, i-1, j-1, dp[i][j]));
            } else {
                // 不匹配 - 取上方或左方的最大值
                if (dp[i - 1][j] >= dp[i][j - 1]) {
                    dp[i][j] = dp[i - 1][j];
                    cell.classList.add('up-arrow');
                } else {
                    dp[i][j] = dp[i][j - 1];
                    cell.classList.add('left-arrow');
                }
                cell.textContent = dp[i][j];
                updateStatus(window.I18n.t('不匹配, dp[{0}][{1}] = max(dp[{2}][{1}], dp[{0}][{3}]) = {4}', i, j, i-1, j-1, dp[i][j]));
            }
            
            cell.classList.remove('current');
            cell.classList.add('filled');
            
            await delay(CONFIG.fillDelay);
            clearSeqHighlights();
        }
    }
    
    lcsLength.innerHTML = `长度: <span>${dp[m][n]}</span>`;
}

/**
 * 回溯找到LCS
 */
async function backtrackLCS() {
    const m = seqA.length;
    const n = seqB.length;
    
    let i = m;
    let j = n;
    const lcs = [];
    const pathCells = [];
    
    updateStatus('开始回溯找最长公共子序列...');
    
    while (i > 0 && j > 0) {
        if (!isRunning) return [];
        
        const cell = getCell(i, j);
        cell.classList.add('path', 'path-animate');
        pathCells.push(cell);
        
        if (seqA[i - 1] === seqB[j - 1]) {
            // 来自对角线
            lcs.unshift({ char: seqA[i - 1], aIndex: i - 1, bIndex: j - 1 });
            
            // 高亮LCS字符
            highlightSeqChars(i - 1, j - 1, 'in-lcs');
            
            updateStatus(window.I18n.t('找到LCS字符: "{0}" 在 A[{1}], B[{2}]', seqA[i-1], i, j));
            
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            // 来自上方
            i--;
            updateStatus(window.I18n.t('回溯到 dp[{0}][{1}]', i, j));
        } else {
            // 来自左方
            j--;
            updateStatus(window.I18n.t('回溯到 dp[{0}][{1}]', i, j));
        }
        
        await delay(CONFIG.backtrackDelay);
    }
    
    // 如果还需要回溯到边界
    while (i > 0 || j > 0) {
        const cell = getCell(i, j);
        if (cell) {
            cell.classList.add('path');
            pathCells.push(cell);
        }
        if (i > 0) i--;
        else if (j > 0) j--;
        await delay(CONFIG.backtrackDelay / 2);
    }
    
    // 高亮起点
    const originCell = getCell(0, 0);
    if (originCell) originCell.classList.add('path');
    
    return lcs;
}

/**
 * 显示LCS结果
 */
async function showLCSResult(lcs) {
    lcsChars.innerHTML = '';
    
    if (lcs.length === 0) {
        lcsChars.innerHTML = '<span style="color: rgba(255,255,255,0.5)">无公共子序列</span>';
        return;
    }
    
    for (let i = 0; i < lcs.length; i++) {
        if (!isRunning) return;
        
        const item = lcs[i];
        const el = document.createElement('div');
        el.className = 'lcs-char';
        el.textContent = item.char;
        el.style.animationDelay = `${i * 0.1}s`;
        lcsChars.appendChild(el);
        
        await delay(CONFIG.resultDelay);
    }
    
    // 庆祝动画
    await delay(300);
    document.querySelectorAll('.lcs-char').forEach((el, i) => {
        setTimeout(() => el.classList.add('celebrate'), i * 100);
    });
}

/**
 * 开始算法
 */
async function start() {
    if (isRunning) return;
    
    seqA = seqAInput.value;
    seqB = seqBInput.value;
    
    if (!seqA || !seqB) {
        updateStatus('请输入两个序列');
        return;
    }
    
    isRunning = true;
    isPaused = false;
    startBtn.disabled = true;
    resetBtn.disabled = true;
    if (pauseBtn) {
        pauseBtn.disabled = false;
        pauseBtn.textContent = window.I18n ? window.I18n.t('暂停') : '暂停';
        pauseBtn.classList.remove('paused');
    }
    
    // 重置显示
    renderSequences();
    renderDPMatrix();
    lcsChars.innerHTML = '';
    
    updateStatus('开始填充DP矩阵...');
    
    // 填充DP矩阵
    await fillDPMatrix();
    
    if (!isRunning) {
        reset();
        return;
    }
    
    // 回溯
    const lcs = await backtrackLCS();
    
    if (!isRunning) {
        reset();
        return;
    }
    
    // 显示结果
    await showLCSResult(lcs);
    
    updateStatus(window.I18n.t('算法完成! LCS = "{0}", 长度 = {1}', lcs.map(l => l.char).join(''), lcs.length));
    if (window.AlgoLogger) window.AlgoLogger.success('LCS = "{0}", 长度 = {1}', lcs.map(l => l.char).join(''), lcs.length);
    
    isRunning = false;
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
    isRunning = false;
    isPaused = false;
    startBtn.disabled = false;
    resetBtn.disabled = false;
    if (pauseBtn) {
        pauseBtn.disabled = true;
        pauseBtn.classList.remove('paused');
        pauseBtn.textContent = window.I18n ? window.I18n.t('暂停') : '暂停';
    }
    
    init();
    updateStatus('点击"开始算法"查看动画');
}

// 事件监听
startBtn.addEventListener('click', start);
resetBtn.addEventListener('click', reset);
if (pauseBtn) {
    pauseBtn.addEventListener('click', togglePause);
}

seqAInput.addEventListener('input', () => {
    if (!isRunning) init();
});

seqBInput.addEventListener('input', () => {
    if (!isRunning) init();
});

// 初始化
// 等待 I18n 模块加载完成后初始化
if (document.readyState === 'complete') {
    setTimeout(init, 50);
} else {
    window.addEventListener('load', () => setTimeout(init, 50));
}
