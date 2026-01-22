/**
 * 公共页头组件
 * @author daichangya
 */

// 分类名称映射
const CATEGORY_NAMES = {
    'sorting': { zh: '排序算法', en: 'Sorting' },
    'sequence': { zh: '字符串算法', en: 'String' },
    'graph': { zh: '图算法', en: 'Graph' },
    'search': { zh: '搜索优化', en: 'Search' },
    'geometry': { zh: '计算几何', en: 'Geometry' },
    'data-structure': { zh: '数据结构', en: 'Data Structures' }
};

// 算法名称映射
const ALGORITHM_NAMES = {
    // 排序算法
    'bubble-sort': { zh: '冒泡排序', en: 'Bubble Sort' },
    'heap-sort': { zh: '堆排序', en: 'Heap Sort' },
    'quick-sort': { zh: '快速排序', en: 'Quick Sort' },
    'merge-sort': { zh: '归并排序', en: 'Merge Sort' },
    // 字符串算法
    'kmp': { zh: 'KMP算法', en: 'KMP Algorithm' },
    'lcs': { zh: '最长公共子序列', en: 'LCS' },
    'myers-diff': { zh: 'Myers Diff', en: 'Myers Diff' },
    // 图算法
    'dijkstra': { zh: 'Dijkstra', en: 'Dijkstra' },
    'bfs-dfs': { zh: 'BFS/DFS', en: 'BFS/DFS' },
    'astar': { zh: 'A*寻路', en: 'A* Pathfinding' },
    // 搜索优化
    'binary-search': { zh: '二分查找', en: 'Binary Search' },
    'knapsack': { zh: '背包问题', en: 'Knapsack' },
    // 计算几何
    'convex-hull': { zh: '凸包算法', en: 'Convex Hull' },
    // 数据结构
    'b-tree': { zh: 'B树', en: 'B-Tree' },
    'b-plus-tree': { zh: 'B+树', en: 'B+ Tree' },
    'skip-list': { zh: '跳跃表', en: 'Skip List' }
};

// 获取当前页面相对于根目录的路径前缀
function getBasePath() {
    const path = window.location.pathname;
    
    // 首页
    if (path === '/' || path.endsWith('/index.html') && path.split('/').length <= 3) {
        return '';
    }
    
    // 英文版首页
    if (path === '/en/' || path === '/en/index.html') {
        return '';
    }
    
    // 算法子页面 (如 /sorting/bubble-sort/)
    // 英文版算法子页面 (如 /en/sorting/bubble-sort/)
    return path.includes('/en/') ? '' : '../../';
}

// 检测当前语言
function getCurrentLang() {
    return window.location.pathname.includes('/en/') ? 'en' : 'zh';
}

// 页头 HTML 模板
function getHeaderHTML(basePath, lang) {
    const isEnglish = lang === 'en';
    const homeLink = isEnglish ? '/en/' : '/';
    const logoText = isEnglish ? 'Algorithm Visualizer' : '算法可视化';
    
    return `
    <header class="site-header">
        <a href="${homeLink}" class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 100 100" fill="currentColor">
                <rect x="20" y="55" width="12" height="30" rx="2"/>
                <rect x="36" y="40" width="12" height="45" rx="2"/>
                <rect x="52" y="25" width="12" height="60" rx="2"/>
                <rect x="68" y="35" width="12" height="50" rx="2"/>
            </svg>
            ${logoText}
        </a>
        <nav class="header-nav">
            <a href="https://github.com/daichangya/animated-algorithm-guide" target="_blank" rel="noopener noreferrer" class="github-nav-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span class="github-text">GitHub</span>
            </a>
            <div class="lang-switcher" style="position: static;">
                <button class="lang-btn ${lang === 'zh' ? 'active' : ''}" data-lang="zh">中文</button>
                <button class="lang-btn ${lang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
            </div>
        </nav>
    </header>`;
}

// 生成面包屑导航
function generateBreadcrumb(lang) {
    const path = window.location.pathname;
    const isEnglish = lang === 'en';
    
    // 解析路径: /[en/]<category>/<algorithm>/
    const parts = path.split('/').filter(p => p && p !== 'en' && p !== 'index.html');
    
    // 首页或路径不足两级不显示面包屑
    if (parts.length < 2) return '';
    
    const [category, algorithm] = parts;
    const homeLink = isEnglish ? '/en/' : '/';
    const categoryLink = `${homeLink}#${category}-title`;
    
    const homeName = isEnglish ? 'Home' : '首页';
    const categoryName = CATEGORY_NAMES[category]?.[lang] || category;
    const algorithmName = ALGORITHM_NAMES[algorithm]?.[lang] || algorithm;
    
    return `
    <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="${homeLink}">${homeName}</a>
        <span class="separator">›</span>
        <a href="${categoryLink}">${categoryName}</a>
        <span class="separator">›</span>
        <span class="current">${algorithmName}</span>
    </nav>`;
}

// 初始化页头
export function initHeader() {
    const basePath = getBasePath();
    const lang = getCurrentLang();
    
    // 检查是否已存在页头，避免重复创建
    if (!document.querySelector('.site-header')) {
        // 插入页头
        document.body.insertAdjacentHTML('afterbegin', getHeaderHTML(basePath, lang));
        
        // 确保 body 有正确的类
        document.body.classList.add('has-site-header');
        
        // 初始化语言切换器事件
        initLangSwitcher();
    }
    
    // 插入面包屑（非首页时）- 始终检查
    if (!document.querySelector('.breadcrumb')) {
        const breadcrumb = generateBreadcrumb(lang);
        if (breadcrumb) {
            const container = document.querySelector('.container');
            if (container) {
                container.insertAdjacentHTML('afterbegin', breadcrumb);
            }
        }
    }
}

// 初始化语言切换器
function initLangSwitcher() {
    const langBtns = document.querySelectorAll('.site-header .lang-btn');
    
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetLang = btn.dataset.lang;
            const currentPath = window.location.pathname;
            
            if (targetLang === 'en') {
                // 切换到英文
                if (!currentPath.includes('/en/')) {
                    const newPath = '/en' + (currentPath === '/' ? '/' : currentPath);
                    window.location.href = newPath;
                }
            } else {
                // 切换到中文
                if (currentPath.includes('/en/')) {
                    const newPath = currentPath.replace('/en/', '/').replace('/en', '/');
                    window.location.href = newPath;
                }
            }
        });
    });
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
} else {
    initHeader();
}
