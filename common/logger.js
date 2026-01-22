/**
 * 算法执行日志模块
 * 用于记录和显示算法执行的每一步
 * @author changyadai
 */

const AlgoLogger = (function() {
    // 私有变量
    let container = null;
    let logList = null;
    let isCollapsed = false;
    let maxLogs = 500;  // 防止内存溢出
    let logCount = 0;
    
    // 日志级别配置
    const LEVELS = {
        log: { icon: '', class: 'log-default' },
        step: { icon: '🔵', class: 'log-step' },
        success: { icon: '✅', class: 'log-success' },
        warn: { icon: '⚠️', class: 'log-warn' },
        error: { icon: '❌', class: 'log-error' },
        info: { icon: 'ℹ️', class: 'log-info' }
    };
    
    /**
     * 翻译文本
     */
    function t(text, ...args) {
        let translated = window.I18n ? window.I18n.t(text) : text;
        args.forEach((arg, i) => {
            translated = translated.replace(`{${i}}`, arg);
        });
        return translated;
    }
    
    /**
     * 获取当前时间字符串
     */
    function getTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString('zh-CN', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    }
    
    /**
     * 检测是否为英文页面
     */
    function isEnglishPage() {
        return window.location.pathname.startsWith('/en/') || 
               document.documentElement.lang === 'en';
    }
    
    /**
     * 创建日志面板 HTML
     */
    function createPanel() {
        const isEn = isEnglishPage();
        const panel = document.createElement('div');
        panel.className = 'algo-logger';
        panel.innerHTML = `
            <div class="algo-logger-header">
                <span class="algo-logger-title">
                    <span class="algo-logger-icon">📋</span>
                    <span>${isEn ? 'Execution Log' : '执行日志'}</span>
                </span>
                <div class="algo-logger-controls">
                    <button class="algo-logger-btn copy-btn" title="${isEn ? 'Copy All' : '复制全部'}">
                        📄
                    </button>
                    <button class="algo-logger-btn clear-btn" title="${isEn ? 'Clear Log' : '清空日志'}">
                        🗑️
                    </button>
                    <button class="algo-logger-btn toggle-btn" title="${isEn ? 'Collapse/Expand' : '折叠/展开'}">
                        ▼
                    </button>
                </div>
            </div>
            <div class="algo-logger-body">
                <ul class="algo-logger-list"></ul>
            </div>
        `;
        return panel;
    }
    
    /**
     * 添加日志条目
     */
    function addLog(level, text, ...args) {
        if (!logList) return;
        
        // 限制日志数量
        if (logCount >= maxLogs) {
            const firstChild = logList.firstChild;
            if (firstChild) {
                logList.removeChild(firstChild);
            }
        } else {
            logCount++;
        }
        
        const config = LEVELS[level] || LEVELS.log;
        const translatedText = t(text, ...args);
        
        const li = document.createElement('li');
        li.className = `algo-logger-item ${config.class}`;
        
        const timestamp = getTimestamp();
        const icon = config.icon ? `<span class="log-icon">${config.icon}</span>` : '';
        
        li.innerHTML = `
            <span class="log-time">[${timestamp}]</span>
            ${icon}
            <span class="log-text">${translatedText}</span>
        `;
        
        logList.appendChild(li);
        
        // 自动滚动到最新
        const body = container.querySelector('.algo-logger-body');
        if (body) {
            body.scrollTop = body.scrollHeight;
        }
    }
    
    /**
     * 初始化日志模块
     */
    function init(targetSelector) {
        // 如果已经初始化，直接返回
        if (container) return;
        
        // 查找目标容器
        let target;
        if (targetSelector) {
            target = document.querySelector(targetSelector);
        }
        if (!target) {
            target = document.querySelector('.container');
        }
        if (!target) {
            console.warn('AlgoLogger: 找不到目标容器');
            return;
        }
        
        // 创建日志面板
        container = createPanel();
        
        // 插入到页面（在 info 区域后面，或者在 container 末尾）
        const infoSection = target.querySelector('.info');
        if (infoSection && infoSection.nextSibling) {
            target.insertBefore(container, infoSection.nextSibling);
        } else {
            // 插入到 tabs-container 之前
            const tabsContainer = target.querySelector('.tabs-container');
            if (tabsContainer) {
                target.insertBefore(container, tabsContainer);
            } else {
                target.appendChild(container);
            }
        }
        
        // 获取日志列表
        logList = container.querySelector('.algo-logger-list');
        
        // 绑定事件
        const toggleBtn = container.querySelector('.toggle-btn');
        const clearBtn = container.querySelector('.clear-btn');
        const copyBtn = container.querySelector('.copy-btn');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggle);
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', clear);
        }
        if (copyBtn) {
            copyBtn.addEventListener('click', copyAllLogs);
        }
        
        // 记录初始化日志
        addLog('info', '日志模块已初始化');
    }
    
    /**
     * 切换折叠状态
     */
    function toggle() {
        if (!container) return;
        
        isCollapsed = !isCollapsed;
        container.classList.toggle('collapsed', isCollapsed);
        
        const toggleBtn = container.querySelector('.toggle-btn');
        if (toggleBtn) {
            toggleBtn.textContent = isCollapsed ? '▶' : '▼';
        }
    }
    
    /**
     * 清空日志
     */
    function clear() {
        if (!logList) return;
        logList.innerHTML = '';
        logCount = 0;
        addLog('info', '日志已清空');
    }
    
    /**
     * 复制所有日志到剪贴板
     */
    function copyAllLogs() {
        if (!logList) return;
        
        const lines = [];
        logList.querySelectorAll('.algo-logger-item').forEach(item => {
            const time = item.querySelector('.log-time')?.textContent || '';
            const text = item.querySelector('.log-text')?.textContent || '';
            lines.push(`${time} ${text}`);
        });
        
        const content = lines.join('\n');
        
        navigator.clipboard.writeText(content).then(() => {
            // 显示复制成功提示
            showCopyToast();
        }).catch(err => {
            console.error('复制失败:', err);
        });
    }
    
    /**
     * 显示复制成功提示
     */
    function showCopyToast() {
        const isEn = isEnglishPage();
        const toast = document.createElement('div');
        toast.className = 'algo-logger-toast';
        toast.textContent = isEn ? 'Copied to clipboard' : '已复制到剪贴板';
        
        container.appendChild(toast);
        
        // 动画显示
        setTimeout(() => toast.classList.add('show'), 10);
        
        // 2秒后移除
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
    
    /**
     * 设置最大日志条数
     */
    function setMaxLogs(max) {
        maxLogs = max;
    }
    
    // 公开 API
    return {
        init: init,
        log: (text, ...args) => addLog('log', text, ...args),
        step: (text, ...args) => addLog('step', text, ...args),
        success: (text, ...args) => addLog('success', text, ...args),
        warn: (text, ...args) => addLog('warn', text, ...args),
        error: (text, ...args) => addLog('error', text, ...args),
        info: (text, ...args) => addLog('info', text, ...args),
        clear: clear,
        toggle: toggle,
        copy: copyAllLogs,
        setMaxLogs: setMaxLogs
    };
})();

// 导出到全局
window.AlgoLogger = AlgoLogger;

// 页面加载完成后自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => AlgoLogger.init(), 0);
    });
} else {
    setTimeout(() => AlgoLogger.init(), 0);
}
