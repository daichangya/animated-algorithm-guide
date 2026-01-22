/**
 * 中英文翻译对照字典 - 主入口
 * 用于自动翻译DOM中的中文文本
 * @author changyadai
 */

import { common } from './translations/common.js';
import { seo } from './translations/seo.js';
import { dynamic } from './translations/dynamic.js';
import { dataStructure } from './translations/data-structure.js';

// 注：以下模块已清空，保留文件以备将来使用，不再导入
// - homepage.js
// - sorting.js
// - sequence.js
// - graph.js
// - search.js
// - geometry.js

// 合并所有翻译模块
export const translations = {
    ...common,
    ...seo,
    ...dynamic,
    ...dataStructure
};

// 导出翻译函数
export function t(text) {
    return translations[text] || text;
}
