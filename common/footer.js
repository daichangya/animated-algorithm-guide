/**
 * 公共页脚组件
 * @author changyadai
 */

// 检测当前语言
function getCurrentLang() {
    return window.location.pathname.includes('/en/') ? 'en' : 'zh';
}

// 页脚 HTML 模板
function getFooterHTML(lang) {
    const isEnglish = lang === 'en';
    
    const links = isEnglish ? {
        sorting: 'Sorting Algorithms',
        sequence: 'String Algorithms',
        graph: 'Graph Algorithms',
        search: 'Search & Optimization',
        geometry: 'Computational Geometry'
    } : {
        sorting: '排序算法',
        sequence: '字符串算法',
        graph: '图算法',
        search: '搜索优化',
        geometry: '计算几何'
    };
    
    const copyright = isEnglish 
        ? '© 2026 Algorithm Visualization. Built with HTML / CSS / JavaScript'
        : '© 2026 算法可视化. 使用 HTML / CSS / JavaScript 构建';
    
    const contribute = isEnglish
        ? 'This is an open-source learning project. Contributions and feedback are welcome!'
        : '本项目为开源学习项目，欢迎贡献代码和反馈建议';
    
    const navLabel = isEnglish ? 'Footer Navigation' : '页脚导航';
    
    // 根据当前页面路径确定链接前缀
    const basePath = getBasePath();
    const homeLink = isEnglish ? '/en/' : '/';
    
    return `
    <footer class="site-footer">
        <div class="footer-content">
            <nav class="footer-nav" aria-label="${navLabel}">
                <a href="${homeLink}#sorting-title">${links.sorting}</a>
                <a href="${homeLink}#sequence-title">${links.sequence}</a>
                <a href="${homeLink}#graph-title">${links.graph}</a>
                <a href="${homeLink}#search-title">${links.search}</a>
                <a href="${homeLink}#geometry-title">${links.geometry}</a>
            </nav>
            <p class="footer-copyright">${copyright}</p>
            <p class="footer-contribute">${contribute}</p>
        </div>
    </footer>`;
}

// 获取当前页面相对于根目录的路径前缀
function getBasePath() {
    const path = window.location.pathname;
    
    // 首页
    if (path === '/' || path === '/index.html' || path === '/en/' || path === '/en/index.html') {
        return '';
    }
    
    // 算法子页面
    return '../../';
}

// 初始化页脚
export function initFooter() {
    const lang = getCurrentLang();
    
    // 检查是否已存在页脚
    if (document.querySelector('.site-footer')) {
        return;
    }
    
    // 插入页脚
    document.body.insertAdjacentHTML('beforeend', getFooterHTML(lang));
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
} else {
    initFooter();
}
