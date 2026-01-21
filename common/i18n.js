/**
 * 国际化(i18n)核心模块 - 混合方案
 * 静态HTML生成（SEO友好）+ 运行时JS翻译
 * @author changyadai
 */

import { translations } from './lang/translations.js';

const I18n = {
    currentLang: 'zh',
    supportedLangs: ['zh', 'en'],
    translations: translations,
    
    /**
     * 初始化
     */
    init() {
        this.currentLang = this.detectLanguage();
        this.updateSwitcher();
        document.documentElement.lang = this.currentLang === 'zh' ? 'zh-CN' : 'en';
    },

    /**
     * 检测当前语言
     * 基于 URL 路径判断（/en/ 开头为英文）
     */
    detectLanguage() {
        const path = window.location.pathname;
        if (path.startsWith('/en/') || path === '/en') {
            return 'en';
        }
        return 'zh';
    },

    /**
     * 切换语言 - 通过页面跳转实现
     */
    switchLanguage(lang) {
        if (!this.supportedLangs.includes(lang)) return;
        if (lang === this.currentLang) return;
        
        const path = window.location.pathname;
        let newPath;
        
        if (lang === 'en' && !path.startsWith('/en/')) {
            // 中文 -> 英文：添加 /en 前缀
            newPath = '/en' + (path === '/' ? '/index.html' : path);
        } else if (lang === 'zh' && path.startsWith('/en/')) {
            // 英文 -> 中文：移除 /en 前缀
            newPath = path.replace(/^\/en/, '') || '/';
        } else if (lang === 'zh' && path === '/en') {
            newPath = '/';
        } else {
            return;
        }
        
        // 跳转到新页面
        window.location.href = newPath;
    },
    
    /**
     * 更新语言切换器UI状态
     */
    updateSwitcher() {
        const switcher = document.querySelector('.lang-switcher');
        if (!switcher) return;
        
        switcher.querySelectorAll('.lang-btn').forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            btn.classList.toggle('active', lang === this.currentLang);
        });
    },
    
    /**
     * 创建语言切换器（如果不存在）
     */
    createSwitcher() {
        const switcher = document.createElement('div');
        switcher.className = 'lang-switcher';
        switcher.innerHTML = `
            <button class="lang-btn" data-lang="zh">中文</button>
            <button class="lang-btn" data-lang="en">EN</button>
        `;

        switcher.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });

        return switcher;
    },
    
    /**
     * 获取翻译（支持占位符参数）
     * 中文页面返回原文，英文页面返回翻译
     * @param {string} text - 中文原文（可包含 {0}, {1} 等占位符）
     * @param {...any} args - 替换占位符的参数
     * @returns {string} - 翻译后的文本或原文
     */
    t(text, ...args) {
        // 中文页面直接返回原文，但仍需替换占位符
        if (this.currentLang === 'zh') {
            let result = text;
            args.forEach((arg, i) => {
                result = result.replace(new RegExp(`\\{${i}\\}`, 'g'), arg);
            });
            return result;
        }
        
        // 英文页面进行翻译
        if (!text || typeof text !== 'string') {
            return text;
        }
        
        // 规范化空白
        const normalized = text.trim().replace(/\s+/g, ' ');
        
        let result = text;
        
        // 先尝试完全匹配
        if (this.translations[normalized]) {
            result = this.translations[normalized];
        } else if (this.translations[text]) {
            // 尝试原文匹配
            result = this.translations[text];
        } else {
            // 部分替换：按中文长度降序匹配
            const sortedEntries = Object.entries(this.translations)
                .filter(([cn]) => result.includes(cn))
                .sort((a, b) => b[0].length - a[0].length);
            
            for (const [cn, en] of sortedEntries) {
                result = result.split(cn).join(en);
            }
        }
        
        // 替换占位符 {0}, {1}, {2}...
        args.forEach((arg, i) => {
            result = result.replace(new RegExp(`\\{${i}\\}`, 'g'), arg);
        });
        
        return result;
    }
};

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    I18n.init();
    
    // 为语言切换按钮添加事件
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            I18n.switchLanguage(lang);
        });
    });
});

// 暴露到全局
window.I18n = I18n;

export default I18n;
