/**
 * 几何算法翻译
 * @author changyadai
 */

export const geometry = {
    // ===== 凸包算法 =====
    '凸包算法可视化': 'Convex Hull Visualization',
    'Graham Scan - 计算点集的凸包': 'Graham Scan - Computing point set convex hull',
    '凸包（Convex Hull）是包含所有给定点的最小凸多边形。Graham Scan算法通过极角排序和栈操作，以O(n log n)的时间复杂度高效计算凸包。': 'Convex Hull is the smallest convex polygon containing all given points. Graham Scan uses polar angle sorting and stack operations to efficiently compute the convex hull in O(n log n) time.',
    '添加点': 'Add Point',
    '随机生成': 'Random Generate',
    '清空': 'Clear',
    '凸包栈': 'Hull Stack',
    '找到y坐标最小的点作为基点P0（若相同取x最小）': 'Find point P0 with minimum y-coordinate (then minimum x if tie)',
    '将其他所有点按照相对于P0的极角排序': 'Sort all other points by polar angle relative to P0',
    '初始化栈，压入P0和排序后的第一个点': 'Initialize stack with P0 and first sorted point',
    '依次处理剩余的点：': 'Process remaining points:',
    '如果新点使得栈顶两点形成"右转"，则弹出栈顶': 'If new point causes "right turn" with top two stack elements, pop top',
    '重复上一步直到形成"左转"，然后将新点压入栈': 'Repeat until "left turn", then push new point',
    '栈中的点即为凸包顶点': 'Stack contains convex hull vertices',
    '叉积判断转向：(A-O)×(B-O) > 0 表示左转，< 0 表示右转，= 0 表示共线。': 'Cross product determines turn: (A-O)×(B-O) > 0 means left turn, < 0 means right turn, = 0 means collinear.',
    '找基点': 'Find Base Point',
    '遍历所有点': 'Traverse all points',
    '极角排序': 'Polar Angle Sort',
    '决定整体复杂度': 'Dominates overall complexity',
    '栈处理': 'Stack Processing',
    '每个点最多入栈出栈各一次': 'Each point pushed/popped at most once',
    '排序主导': 'Dominated by sorting',
    '存储栈': 'Store stack',
    '图形学中的碰撞检测': 'Collision detection in graphics',
    '地理信息系统（GIS）边界计算': 'Boundary computation in GIS',
    '图像处理中的物体轮廓': 'Object contours in image processing',
    '最小包围盒计算': 'Minimum bounding box computation',
    '统计学中的离群点检测': 'Outlier detection in statistics',
    '碰撞检测': 'Collision Detection',
    'GIS': 'GIS',
    '机器人': 'Robotics',
    '图像处理': 'Image Processing',
    '点击画布添加点，或自动生成': 'Click canvas to add points, or generate automatically',
    '凸包算法': 'Convex Hull',
    'Graham Scan计算点集凸包': 'Graham Scan for point set hull'
};
