/**
 * 数据结构翻译
 * 注意：页面内静态文本已通过 data-en 属性处理
 * 此文件仅保留 JavaScript 动态状态消息
 * @author changyadai
 */
export const dataStructure = {
    // ===== 动态状态消息（通过 updateStatus() → I18n.t() 调用）=====
    
    // 操作状态（使用 {0}, {1} 占位符）
    '正在插入: {0}': 'Inserting: {0}',
    '插入完成: {0}': 'Inserted: {0}',
    '插入完成: {0} (层级: {1})': 'Inserted: {0} (level: {1})',
    '{0} 已存在': '{0} already exists',
    '正在查找: {0}': 'Searching: {0}',
    '找到: {0}': 'Found: {0}',
    '未找到: {0}': 'Not found: {0}',
    '正在删除: {0}': 'Deleting: {0}',
    '删除完成: {0}': 'Deleted: {0}',
    '数据结构已初始化': 'Data structure initialized',
    
    // 输入验证
    '请输入有效的数值': 'Please enter a valid number',
    '请输入1-999之间的有效数值': 'Please enter a valid number between 1-999',
    
    // 随机生成
    '已生成 {0} 个随机值': 'Generated {0} random values',
    
    // B+树范围查询
    '请输入范围 (如: 10-50 或 10~50)': 'Enter range (e.g. 10-50 or 10~50)',
    '范围查询: {0} - {1}': 'Range query: {0} - {1}',
    '找到 {0} 个结果: {1}': 'Found {0} results: {1}',
    '范围查询结果: [{0}]': 'Range query result: [{0}]',
    '范围内没有数据': 'No data in range',
    
    // 演示功能
    '▶ 演示': '▶ Demo',
    '⏸ 暂停': '⏸ Pause',
    '▶ 继续': '▶ Resume',
    '演示开始...': 'Demo starting...',
    '演示已暂停': 'Demo paused',
    '演示完成': 'Demo complete'
};
