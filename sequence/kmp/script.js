/**
 * KMP字符串匹配可视化
 * @author changyadai
 */

const CONFIG = {
    buildDelay: 200,
    matchDelay: 300
};

let text = '';
let pattern = '';
let next = [];
let isRunning = false;
let isPaused = false;

const textInput = document.getElementById('textInput');
const patternInput = document.getElementById('patternInput');
const prefixTable = document.getElementById('prefixTable');
const textRow = document.getElementById('textRow');
const patternRow = document.getElementById('patternRow');
const matchResults = document.getElementById('matchResults');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const pauseBtn = document.getElementById('pauseBtn');
const statusText = document.getElementById('statusText');

function init() {
    text = textInput.value;
    pattern = patternInput.value;
    renderPrefixTable();
    renderMatchArea();
    matchResults.innerHTML = '-';
    updateStatus('点击开始查看KMP匹配过程');
    
    // 日志记录
    if (window.AlgoLogger) {
        window.AlgoLogger.clear();
        window.AlgoLogger.info('KMP初始化: 文本长度={0}, 模式长度={1}', text.length, pattern.length);
        window.AlgoLogger.log('文本: "{0}"', text);
        window.AlgoLogger.log('模式: "{0}"', pattern);
    }
}

function renderPrefixTable() {
    prefixTable.innerHTML = '';
    
    for (let i = 0; i < pattern.length; i++) {
        const item = document.createElement('div');
        item.className = 'prefix-item';
        item.id = `prefix-${i}`;
        
        const charEl = document.createElement('div');
        charEl.className = 'prefix-char';
        charEl.textContent = pattern[i];
        
        const valueEl = document.createElement('div');
        valueEl.className = 'prefix-value';
        valueEl.id = `prefix-val-${i}`;
        valueEl.textContent = '-';
        
        item.appendChild(charEl);
        item.appendChild(valueEl);
        prefixTable.appendChild(item);
    }
}

function renderMatchArea(patternOffset = 0) {
    textRow.innerHTML = '';
    patternRow.innerHTML = '';
    
    // 渲染文本行
    for (let i = 0; i < text.length; i++) {
        const box = document.createElement('div');
        box.className = 'char-box text';
        box.id = `text-${i}`;
        box.textContent = text[i];
        textRow.appendChild(box);
    }
    
    // 渲染模式串行（带偏移）
    for (let i = 0; i < patternOffset; i++) {
        const spacer = document.createElement('div');
        spacer.className = 'char-box spacer';
        patternRow.appendChild(spacer);
    }
    
    for (let i = 0; i < pattern.length; i++) {
        const box = document.createElement('div');
        box.className = 'char-box pattern';
        box.id = `pattern-${i}`;
        box.textContent = pattern[i];
        patternRow.appendChild(box);
    }
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

function updateStatus(msg) {
    statusText.textContent = window.I18n ? window.I18n.t(msg) : msg;
}

async function buildNextArray() {
    next = new Array(pattern.length).fill(0);
    
    updateStatus('构建前缀表...');
    
    // 第一个字符的next值为0
    document.getElementById('prefix-val-0').textContent = '0';
    document.getElementById('prefix-0').classList.add('building');
    await delay(CONFIG.buildDelay);
    document.getElementById('prefix-0').classList.remove('building');
    
    let j = 0;
    
    for (let i = 1; i < pattern.length; i++) {
        if (!isRunning) return;
        
        const prefixItem = document.getElementById(`prefix-${i}`);
        prefixItem.classList.add('building');
        
        while (j > 0 && pattern[i] !== pattern[j]) {
            updateStatus(window.I18n.t('位置{0}: P[{0}]=\'{1}\' ≠ P[{2}]=\'{3}\', 回退 j={4}', i, pattern[i], j, pattern[j], next[j-1]));
            await delay(CONFIG.buildDelay);
            j = next[j - 1];
        }
        
        if (pattern[i] === pattern[j]) {
            j++;
            updateStatus(window.I18n.t('位置{0}: P[{0}]=\'{1}\' = P[{2}]=\'{3}\', next[{0}]={4}', i, pattern[i], j-1, pattern[j-1], j));
        } else {
            updateStatus(window.I18n.t('位置{0}: 无匹配前缀, next[{0}]=0', i));
        }
        
        next[i] = j;
        document.getElementById(`prefix-val-${i}`).textContent = j;
        
        await delay(CONFIG.buildDelay);
        prefixItem.classList.remove('building');
    }
    
    updateStatus('前缀表构建完成!');
    await delay(500);
}

async function kmpMatch() {
    const matches = [];
    let j = 0;
    
    updateStatus('开始KMP匹配...');
    
    for (let i = 0; i < text.length; i++) {
        if (!isRunning) return matches;
        
        // 更新模式串位置
        renderMatchArea(i - j);
        await delay(100);
        
        // 高亮当前比较位置
        const textBox = document.getElementById(`text-${i}`);
        const patternBox = document.getElementById(`pattern-${j}`);
        
        textBox.classList.add('comparing');
        if (patternBox) patternBox.classList.add('comparing');
        
        updateStatus(window.I18n.t('比较 T[{0}]=\'{1}\' 与 P[{2}]=\'{3}\'', i, text[i], j, pattern[j]));
        await delay(CONFIG.matchDelay);
        
        while (j > 0 && text[i] !== pattern[j]) {
            // 失配，利用next数组回退
            textBox.classList.remove('comparing');
            if (patternBox) {
                patternBox.classList.remove('comparing');
                patternBox.classList.add('mismatch');
            }
            
            updateStatus(window.I18n.t('失配! 利用next[{0}]={1}回退', j-1, next[j-1]));
            await delay(CONFIG.matchDelay);
            
            j = next[j - 1];
            
            // 重新渲染
            renderMatchArea(i - j);
            await delay(200);
            
            const newPatternBox = document.getElementById(`pattern-${j}`);
            textBox.classList.add('comparing');
            if (newPatternBox) newPatternBox.classList.add('comparing');
            
            await delay(CONFIG.matchDelay);
        }
        
        if (text[i] === pattern[j]) {
            // 匹配成功
            textBox.classList.remove('comparing');
            textBox.classList.add('match');
            const pBox = document.getElementById(`pattern-${j}`);
            if (pBox) {
                pBox.classList.remove('comparing');
                pBox.classList.add('match');
            }
            
            j++;
            
            if (j === pattern.length) {
                // 找到完整匹配
                const matchPos = i - pattern.length + 1;
                matches.push(matchPos);
                
                // 高亮匹配区域
                for (let k = matchPos; k <= i; k++) {
                    document.getElementById(`text-${k}`).classList.add('found');
                }
                
                updateStatus(window.I18n.t('找到匹配! 位置: {0}', matchPos));
                
                // 添加结果
                addMatchResult(matchPos);
                
                await delay(CONFIG.matchDelay * 2);
                
                // 继续查找
                j = next[j - 1];
            }
        } else {
            textBox.classList.remove('comparing');
        }
    }
    
    return matches;
}

function addMatchResult(pos) {
    if (matchResults.innerHTML === '-') {
        matchResults.innerHTML = '';
    }
    
    const el = document.createElement('span');
    el.className = 'match-pos';
    el.textContent = `位置 ${pos}`;
    matchResults.appendChild(el);
}

async function start() {
    if (isRunning) return;
    
    text = textInput.value;
    pattern = patternInput.value;
    
    if (!text || !pattern) {
        updateStatus('请输入文本串和模式串');
        return;
    }
    
    isRunning = true;
    isPaused = false;
    startBtn.disabled = true;
    if (pauseBtn) {
        pauseBtn.disabled = false;
        pauseBtn.textContent = window.I18n ? window.I18n.t('暂停') : '暂停';
        pauseBtn.classList.remove('paused');
    }
    
    matchResults.innerHTML = '-';
    renderPrefixTable();
    renderMatchArea();
    
    await buildNextArray();
    
    if (isRunning) {
        const matches = await kmpMatch();
        
        if (matches.length === 0) {
            updateStatus('未找到匹配');
            matchResults.innerHTML = '<span style="color:#ef4444">无匹配</span>';
        } else {
            updateStatus(window.I18n.t('匹配完成! 共找到 {0} 处匹配', matches.length));
            if (window.AlgoLogger) window.AlgoLogger.success('匹配完成: 找到 {0} 处匹配', matches.length);
        }
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

textInput.addEventListener('input', () => { if (!isRunning) init(); });
patternInput.addEventListener('input', () => { if (!isRunning) init(); });

// 等待 I18n 模块加载完成后初始化
if (document.readyState === 'complete') {
    setTimeout(init, 50);
} else {
    window.addEventListener('load', () => setTimeout(init, 50));
}
