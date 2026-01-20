/**
 * 国际化(i18n)核心模块
 * @author changyadai
 */

const I18n = {
    // 当前语言
    currentLang: 'zh',
    
    // 语言包缓存
    translations: {},
    
    // 支持的语言
    supportedLangs: ['zh', 'en'],
    
    /**
     * 初始化i18n
     */
    async init() {
        // 检测语言偏好
        this.currentLang = this.detectLanguage();
        
        // 加载语言包
        await this.loadLanguage(this.currentLang);
        
        // 应用翻译
        this.applyTranslations();
        
        // 更新语言切换器状态
        this.updateSwitcher();
        
        // 更新HTML lang属性
        document.documentElement.lang = this.currentLang === 'zh' ? 'zh-CN' : 'en';
    },
    
    /**
     * 检测用户语言偏好
     */
    detectLanguage() {
        // 1. 检查localStorage
        const saved = localStorage.getItem('preferred-lang');
        if (saved && this.supportedLangs.includes(saved)) {
            return saved;
        }
        
        // 2. 检测浏览器语言
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('zh')) {
            return 'zh';
        }
        
        // 3. 默认英文
        return 'en';
    },
    
    /**
     * 加载语言包
     */
    async loadLanguage(lang) {
        if (this.translations[lang]) {
            return; // 已缓存
        }
        
        try {
            // 使用fetch加载并执行语言包
            const basePath = window.location.pathname.includes('/sorting/') ||
                           window.location.pathname.includes('/sequence/') ||
                           window.location.pathname.includes('/graph/') ||
                           window.location.pathname.includes('/search/') ||
                           window.location.pathname.includes('/geometry/')
                           ? '../../common' : './common';
            
            const response = await fetch(`${basePath}/lang/${lang}.js`);
            const text = await response.text();
            
            // 解析ES模块
            const blob = new Blob([text], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const module = await import(url);
            URL.revokeObjectURL(url);
            
            this.translations[lang] = module.default;
        } catch (error) {
            console.error(`Failed to load language: ${lang}`, error);
            // 回退到中文
            if (lang !== 'zh') {
                await this.loadLanguage('zh');
            }
        }
    },
    
    /**
     * 切换语言
     */
    async switchLanguage(lang) {
        if (!this.supportedLangs.includes(lang)) return;
        if (lang === this.currentLang) return;
        
        this.currentLang = lang;
        localStorage.setItem('preferred-lang', lang);
        
        await this.loadLanguage(lang);
        this.applyTranslations();
        this.updateSwitcher();
        
        // 更新HTML lang属性
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    },
    
    /**
     * 应用翻译到DOM
     */
    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation) {
                // 检查是否是HTML内容
                if (el.hasAttribute('data-i18n-html')) {
                    el.innerHTML = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });
        
        // 处理placeholder
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation) {
                el.placeholder = translation;
            }
        });
        
        // 处理title属性
        const titles = document.querySelectorAll('[data-i18n-title]');
        titles.forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const translation = this.t(key);
            if (translation) {
                el.title = translation;
            }
        });
    },
    
    /**
     * 获取翻译文本
     * @param {string} key - 点分隔的键，如 "common.startSort"
     * @param {object} params - 可选的替换参数
     */
    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // 未找到，返回键本身
            }
        }
        
        if (typeof value !== 'string') {
            return key;
        }
        
        // 替换参数 {name} -> value
        return value.replace(/\{(\w+)\}/g, (match, name) => {
            return params[name] !== undefined ? params[name] : match;
        });
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
     * 创建语言切换器HTML
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
    }
};

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    I18n.init();
});

// 导出供外部使用
window.I18n = I18n;
