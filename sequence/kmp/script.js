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

const textInput = document.getElementById('textInput');
const patternInput = document.getElementById('patternInput');
const prefixTable = document.getElementById('prefixTable');
const textRow = document.getElementById('textRow');
const patternRow = document.getElementById('patternRow');
const matchResults = document.getElementById('matchResults');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const statusText = document.getElementById('statusText');

function init() {
    text = textInput.value;
    pattern = patternInput.value;
    renderPrefixTable();
    renderMatchArea();
    matchResults.innerHTML = '-';
    updateStatus('点击开始查看KMP匹配过程');
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
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateStatus(msg) {
    statusText.textContent = msg;
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
            updateStatus(`位置${i}: P[${i}]='${pattern[i]}' ≠ P[${j}]='${pattern[j]}', 回退 j=${next[j-1]}`);
            await delay(CONFIG.buildDelay);
            j = next[j - 1];
        }
        
        if (pattern[i] === pattern[j]) {
            j++;
            updateStatus(`位置${i}: P[${i}]='${pattern[i]}' = P[${j-1}]='${pattern[j-1]}', next[${i}]=${j}`);
        } else {
            updateStatus(`位置${i}: 无匹配前缀, next[${i}]=0`);
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
        
        updateStatus(`比较 T[${i}]='${text[i]}' 与 P[${j}]='${pattern[j]}'`);
        await delay(CONFIG.matchDelay);
        
        while (j > 0 && text[i] !== pattern[j]) {
            // 失配，利用next数组回退
            textBox.classList.remove('comparing');
            if (patternBox) {
                patternBox.classList.remove('comparing');
                patternBox.classList.add('mismatch');
            }
            
            updateStatus(`失配! 利用next[${j-1}]=${next[j-1]}回退`);
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
                
                updateStatus(`找到匹配! 位置: ${matchPos}`);
                
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
    startBtn.disabled = true;
    
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
            updateStatus(`匹配完成! 共找到 ${matches.length} 处匹配`);
        }
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

textInput.addEventListener('input', () => { if (!isRunning) init(); });
patternInput.addEventListener('input', () => { if (!isRunning) init(); });

init();
