/**
 * 公共 Tab 切换和代码语言切换模块
 * @author changyadai
 */

/**
 * 初始化 Tab 切换功能
 * 自动为所有 .tabs-container 内的 .tab-btn 和 .tab-content 绑定切换逻辑
 */
export function initTabs() {
    document.querySelectorAll('.tabs-container').forEach(container => {
        const tabBtns = container.querySelectorAll('.tab-btn');
        const tabContents = container.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除所有 active 类
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // 激活当前 tab
                btn.classList.add('active');
                const tabId = btn.dataset.tab;
                const targetContent = container.querySelector(`#${tabId}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    });
}

/**
 * 初始化代码语言切换功能
 * 自动为所有 .code-lang-tabs 内的按钮绑定切换逻辑
 */
export function initCodeLangTabs() {
    document.querySelectorAll('.code-lang-tabs').forEach(container => {
        const langBtns = container.querySelectorAll('.code-lang-btn');
        const codeContainer = container.closest('.tab-content') || container.parentElement;
        
        if (!codeContainer) return;
        
        const codeBlocks = codeContainer.querySelectorAll('.code-block');
        
        langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除所有 active 类
                langBtns.forEach(b => b.classList.remove('active'));
                codeBlocks.forEach(c => c.classList.remove('active'));
                
                // 激活当前语言
                btn.classList.add('active');
                const lang = btn.dataset.lang;
                const targetBlock = codeContainer.querySelector(`#${lang}-code`);
                if (targetBlock) {
                    targetBlock.classList.add('active');
                }
            });
        });
    });
}

/**
 * 初始化语言切换器（中英文切换）
 * 配合 i18n.js 使用
 */
export function initLangSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (window.I18n) {
                window.I18n.switchLanguage(lang);
            }
        });
    });
}

/**
 * 初始化所有交互功能
 * 在页面加载时调用此函数
 */
export function initAllInteractions() {
    initTabs();
    initCodeLangTabs();
    initLangSwitcher();
}

// 自动初始化（当作为模块导入时）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllInteractions);
} else {
    initAllInteractions();
}
