/**
 * 中英文翻译对照字典 - 主入口
 * 用于自动翻译DOM中的中文文本
 * @author changyadai
 */

import { common } from './translations/common.js';
import { homepage } from './translations/homepage.js';
import { sorting } from './translations/sorting.js';
import { sequence } from './translations/sequence.js';
import { graph } from './translations/graph.js';
import { search } from './translations/search.js';
import { geometry } from './translations/geometry.js';
import { seo } from './translations/seo.js';
import { dynamic } from './translations/dynamic.js';

// 合并所有翻译模块
export const translations = {
    ...common,
    ...homepage,
    ...sorting,
    ...sequence,
    ...graph,
    ...search,
    ...geometry,
    ...seo,
    ...dynamic
};

// 导出翻译函数
export function t(text) {
    return translations[text] || text;
}
