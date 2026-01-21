/**
 * 公共工具函数
 * @author changyadai
 */

/**
 * 延迟函数（支持暂停）
 * @param {number} ms - 延迟毫秒数
 * @param {Function} isPausedFn - 返回是否暂停的函数
 * @returns {Promise}
 */
export function delay(ms, isPausedFn) {
    return new Promise(resolve => {
        const check = () => {
            if (isPausedFn && isPausedFn()) {
                setTimeout(check, 100);
            } else {
                setTimeout(resolve, ms);
            }
        };
        check();
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
export function updateStatus(statusEl, text, ...args) {
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
