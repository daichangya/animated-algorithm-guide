/**
 * 公共工具函数
 * @author changyadai
 */

/**
 * 延迟函数（支持暂停）
 * @param {number} ms - 延迟毫秒数
 * @param {Function} getIsSorting - 返回是否正在运行的函数
 * @param {Function} getIsPaused - 返回是否暂停的函数
 * @returns {Promise}
 */
export function delay(ms, getIsSorting, getIsPaused) {
    return new Promise(resolve => {
        const startTime = Date.now();
        
        const checkPause = () => {
            // 如果已停止，立即解析
            if (getIsSorting && !getIsSorting()) {
                resolve();
                return;
            }
            // 如果暂停中，继续等待
            if (getIsPaused && getIsPaused()) {
                setTimeout(checkPause, 50);
            } else {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, ms - elapsed);
                if (remaining <= 0) {
                    resolve();
                } else {
                    setTimeout(resolve, remaining);
                }
            }
        };
        
        setTimeout(checkPause, ms);
    });
}

/**
 * 简单延迟函数（不支持暂停）
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise}
 */
export function simpleDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 更新状态文本（自动翻译）
 * @param {HTMLElement} statusEl - 状态元素
 * @param {string} text - 状态文本
 * @param {...any} args - 替换参数
 */
export function updateStatusText(statusEl, text, ...args) {
    if (!statusEl) return;
    
    if (window.I18n) {
        statusEl.textContent = window.I18n.t(text, ...args);
    } else {
        // 简单的占位符替换
        let result = text;
        args.forEach((arg, i) => {
            result = result.replace(new RegExp(`\\{${i}\\}`, 'g'), arg);
        });
        statusEl.textContent = result;
    }
}

/**
 * 创建算法控制器
 * 统一管理排序/算法状态（运行、暂停、重置）
 * @param {Object} options - 配置选项
 * @returns {Object} - 控制器对象
 */
export function createAlgorithmController(options = {}) {
    const {
        startBtn,
        resetBtn,
        pauseBtn,
        statusEl,
        onStart,
        onReset,
        defaultStatus = '点击"开始"查看动画'
    } = options;
    
    let isSorting = false;
    let isPaused = false;
    
    const controller = {
        get isSorting() { return isSorting; },
        get isPaused() { return isPaused; },
        
        /**
         * 开始算法
         */
        async start() {
            if (isSorting) return;
            
            isSorting = true;
            isPaused = false;
            
            if (startBtn) startBtn.disabled = true;
            if (resetBtn) resetBtn.disabled = true;
            if (pauseBtn) {
                pauseBtn.disabled = false;
                pauseBtn.textContent = window.I18n ? window.I18n.t('暂停') : '暂停';
                pauseBtn.classList.remove('paused');
            }
            
            updateStatusText(statusEl, '排序开始...');
            
            if (onStart) {
                await onStart();
            }
            
            this.finish();
        },
        
        /**
         * 切换暂停状态
         */
        togglePause() {
            isPaused = !isPaused;
            
            if (isPaused) {
                if (pauseBtn) {
                    pauseBtn.textContent = window.I18n ? window.I18n.t('继续') : '继续';
                    pauseBtn.classList.add('paused');
                }
                updateStatusText(statusEl, '已暂停 - 点击继续');
            } else {
                if (pauseBtn) {
                    pauseBtn.textContent = window.I18n ? window.I18n.t('暂停') : '暂停';
                    pauseBtn.classList.remove('paused');
                }
                updateStatusText(statusEl, '运行中...');
            }
        },
        
        /**
         * 重置
         */
        reset() {
            isSorting = false;
            isPaused = false;
            
            if (startBtn) startBtn.disabled = false;
            if (resetBtn) resetBtn.disabled = false;
            if (pauseBtn) {
                pauseBtn.disabled = true;
                pauseBtn.classList.remove('paused');
                pauseBtn.textContent = window.I18n ? window.I18n.t('暂停') : '暂停';
            }
            
            updateStatusText(statusEl, defaultStatus);
            
            if (onReset) {
                onReset();
            }
        },
        
        /**
         * 完成（内部调用）
         */
        finish() {
            isSorting = false;
            isPaused = false;
            
            if (startBtn) startBtn.disabled = false;
            if (resetBtn) resetBtn.disabled = false;
            if (pauseBtn) {
                pauseBtn.disabled = true;
                pauseBtn.classList.remove('paused');
            }
        },
        
        /**
         * 停止运行（外部中断）
         */
        stop() {
            isSorting = false;
            isPaused = false;
        },
        
        /**
         * 更新状态
         */
        updateStatus(text, ...args) {
            updateStatusText(statusEl, text, ...args);
        },
        
        /**
         * 延迟（支持暂停）
         */
        delay(ms) {
            return delay(ms, () => isSorting, () => isPaused);
        }
    };
    
    // 绑定事件
    if (startBtn) {
        startBtn.addEventListener('click', () => controller.start());
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', () => controller.reset());
    }
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => controller.togglePause());
    }
    
    return controller;
}

/**
 * 生成随机整数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number}
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成随机数组
 * @param {number} size - 数组大小
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number[]}
 */
export function randomArray(size, min = 10, max = 99) {
    return Array.from({ length: size }, () => randomInt(min, max));
}

/**
 * 交换数组元素
 * @param {any[]} arr - 数组
 * @param {number} i - 索引1
 * @param {number} j - 索引2
 */
export function swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
}

/**
 * 深拷贝数组
 * @param {any[]} arr - 数组
 * @returns {any[]}
 */
export function cloneArray(arr) {
    return [...arr];
}

/**
 * 防抖函数
 * @param {Function} fn - 原函数
 * @param {number} wait - 等待时间
 * @returns {Function}
 */
export function debounce(fn, wait = 300) {
    let timer = null;
    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), wait);
    };
}

/**
 * 节流函数
 * @param {Function} fn - 原函数
 * @param {number} limit - 时间限制
 * @returns {Function}
 */
export function throttle(fn, limit = 100) {
    let lastRun = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastRun >= limit) {
            lastRun = now;
            fn.apply(this, args);
        }
    };
}
