/**
 * 中文语言包
 * @author changyadai
 */

export default {
    // 通用文本
    common: {
        backHome: "← 返回首页",
        startSort: "开始排序",
        start: "开始",
        reset: "重置",
        clickToStart: "点击\"开始排序\"查看动画",
        clickStartToView: "点击\"开始\"查看动画",
        running: "运行中...",
        completed: "完成！",
        
        // Tab标签
        tabPrinciple: "📖 工作原理",
        tabComplexity: "⏱️ 复杂度分析",
        tabUsage: "💡 应用场景",
        tabCode: "📝 代码实现",
        
        // 代码语言
        python: "Python",
        java: "Java",
        
        // 复杂度表格
        situation: "情况",
        complexity: "复杂度",
        description: "说明",
        bestCase: "最好情况",
        averageCase: "平均情况",
        worstCase: "最坏情况",
        spaceComplexity: "空间复杂度",
        timeComplexity: "时间复杂度"
    },
    
    // 首页
    home: {
        title: "算法可视化",
        subtitle: "通过交互式动画深入理解经典算法的工作原理",
        algorithmCount: "算法总数",
        categoryCount: "算法分类",
        
        // 简介
        introTitle: "什么是算法可视化？",
        introText: "算法可视化是一种将抽象的算法逻辑转化为直观动画的学习方式。通过观察元素的移动、比较和变换过程，你可以更深入地理解算法的核心思想，而不仅仅是记忆代码。每种算法都有其独特的\"个性\"——冒泡排序的气泡上浮、快速排序的分区划分、Dijkstra的波纹扩散...让学习算法变得生动有趣。",
        
        // 快速开始
        quickStartTitle: "快速开始",
        step1: "选择感兴趣的算法类别",
        step2: "点击卡片进入算法页面",
        step3: "点击\"开始\"观看动画演示",
        step4: "阅读说明理解算法原理",
        
        // 分类标题
        sortingCategory: "排序算法",
        sortingDesc: "数组元素排列与重组",
        sequenceCategory: "字符串算法",
        sequenceDesc: "序列匹配与比较",
        graphCategory: "图算法",
        graphDesc: "图结构遍历与路径搜索",
        searchCategory: "搜索与优化",
        searchDesc: "高效查找与决策优化",
        geometryCategory: "计算几何",
        geometryDesc: "几何图形与空间计算",
        
        // 平台特性
        featuresTitle: "平台特性",
        feature1Title: "流畅动画",
        feature1Desc: "精心设计的CSS动画效果，让每一步操作都清晰可见，帮助你理解算法的执行过程。",
        feature2Title: "交互控制",
        feature2Desc: "可随时暂停、重置，部分算法支持自定义输入数据，让学习更加灵活自主。",
        feature3Title: "详细说明",
        feature3Desc: "每个算法页面都配有原理介绍、复杂度分析和应用场景，理论与实践相结合。",
        feature4Title: "响应式设计",
        feature4Desc: "完美适配桌面和移动设备，随时随地都能学习算法知识。",
        feature5Title: "零依赖",
        feature5Desc: "纯原生HTML/CSS/JavaScript实现，无需任何框架，代码简洁易懂，可作为学习参考。",
        feature6Title: "护眼暗色",
        feature6Desc: "采用舒适的深色主题设计，长时间学习也不易疲劳，保护你的眼睛。",
        
        // 页脚
        footerCopyright: "© 2026 算法可视化. 使用 HTML / CSS / JavaScript 构建",
        footerNote: "本项目为开源学习项目，欢迎贡献代码和反馈建议"
    },
    
    // 冒泡排序
    bubbleSort: {
        title: "冒泡排序可视化",
        subtitle: "观察元素如何像气泡一样上浮到正确位置",
        intro: "冒泡排序（Bubble Sort）是一种简单直观的排序算法。它重复地遍历待排序的数列，一次比较两个相邻元素，如果顺序错误就把它们交换过来。每一轮遍历后，最大的元素会\"浮\"到数组末尾，就像水中的气泡上浮一样。",
        
        principleTitle: "算法步骤",
        principleSteps: [
            "从数组的第一个元素开始，比较相邻的两个元素",
            "如果前一个元素比后一个元素大，则交换它们的位置",
            "对每一对相邻元素做同样的工作，从开始第一对到结尾的最后一对",
            "完成一轮后，最大的元素会排到最后",
            "重复以上步骤，每次比较范围减少一个（已排好的元素不再参与）",
            "当没有任何交换发生时，排序完成"
        ],
        
        complexityBest: "数组已经有序，只需一次遍历",
        complexityAvg: "需要多次遍历和交换",
        complexityWorst: "数组完全逆序",
        complexitySpace: "只需常数级额外空间（原地排序）",
        stabilityNote: "冒泡排序是<strong>稳定排序</strong>，相等元素的相对顺序不会改变。",
        
        usageTitle: "适用场景",
        usageList: [
            "教学演示：作为最简单的排序算法之一，非常适合算法入门学习",
            "小规模数据：当数据量很小时（n < 50），简单实现的优势明显",
            "几乎有序的数组：如果数组大部分已经有序，冒泡排序效率较高",
            "需要稳定性：当需要保持相等元素的原始顺序时"
        ],
        usageTags: ["算法教学", "小数据集", "稳定排序需求"]
    },
    
    // 堆排序
    heapSort: {
        title: "堆排序可视化",
        subtitle: "观察二叉堆的构建与调整过程",
        intro: "堆排序（Heap Sort）利用二叉堆这种数据结构来实现排序。它首先将数组构建成一个最大堆，然后不断取出堆顶元素（最大值）放到数组末尾，同时调整剩余元素保持堆的性质。",
        
        principleTitle: "算法步骤",
        principleSteps: [
            "将待排序数组构建成一个最大堆（Build Max-Heap）",
            "此时堆顶元素（arr[0]）为最大值",
            "将堆顶元素与最后一个元素交换",
            "堆大小减1，对新的堆顶执行下沉操作（Heapify）",
            "重复步骤3-4，直到堆大小为1"
        ],
        
        buildHeap: "建堆",
        buildHeapDesc: "自底向上建堆的时间复杂度",
        sortAll: "排序（所有情况）",
        sortAllDesc: "每次取出堆顶需要O(log n)调整",
        complexitySpace: "原地排序，只需常数额外空间",
        stabilityNote: "堆排序是<strong>不稳定排序</strong>，相等元素的相对顺序可能改变。",
        
        usageTitle: "适用场景",
        usageList: [
            "需要原地排序且保证O(n log n)最坏情况性能",
            "实现优先队列数据结构",
            "找出数组中前K大/小的元素",
            "系统调度、任务优先级管理"
        ],
        usageTags: ["优先队列", "Top-K问题", "任务调度", "内存受限场景"]
    },
    
    // 快速排序
    quickSort: {
        title: "快速排序可视化",
        subtitle: "观察分治策略与基准元素的分区过程",
        intro: "快速排序（Quick Sort）是一种高效的分治排序算法。它选择一个\"基准\"元素，将数组分成两部分：小于基准的在左边，大于基准的在右边，然后递归地对两部分进行排序。",
        
        principleTitle: "算法步骤",
        principleSteps: [
            "选择一个元素作为\"基准\"（pivot），通常选择最后一个元素",
            "设置两个指针：i（小于基准区域的边界）和j（扫描指针）",
            "j从左向右扫描，遇到小于基准的元素就与i+1位置交换，i右移",
            "扫描完成后，将基准与i+1位置交换，此时基准就位",
            "递归地对基准左右两部分执行相同操作"
        ],
        
        complexityBest: "每次分区都能平均分割数组",
        complexityAvg: "随机输入的期望性能",
        complexityWorst: "每次选到最大或最小元素作为基准",
        complexitySpace: "递归调用栈的深度",
        stabilityNote: "快速排序是<strong>不稳定排序</strong>，但可以通过三路划分等变体来优化。",
        
        usageTitle: "适用场景",
        usageList: [
            "通用排序：大多数编程语言标准库的排序函数都基于快速排序",
            "大规模数据排序：平均性能优秀，缓存命中率高",
            "不需要稳定性的场景：如数值排序",
            "可以结合其他算法：小数组使用插入排序优化"
        ],
        usageTags: ["通用排序", "大数据集", "系统库实现", "竞赛算法"]
    },
    
    // 归并排序
    mergeSort: {
        title: "归并排序可视化",
        subtitle: "观察分解与合并的递归过程",
        intro: "归并排序（Merge Sort）是一种稳定的分治排序算法。它将数组递归地分成两半，分别排序后再合并。核心思想是：将两个有序数组合并成一个有序数组是高效的。",
        
        principleTitle: "算法步骤",
        principleSteps: [
            "将数组从中间分成两个子数组",
            "对左右两个子数组分别进行归并排序",
            "将两个有序的子数组合并成一个有序数组"
        ],
        mergeNote: "合并操作是关键：使用两个指针分别指向左右子数组的起始位置，每次比较后将较小的元素放入结果数组，直到所有元素都被处理完毕。",
        
        complexityAll: "所有情况",
        complexityAllDesc: "无论输入如何，时间复杂度都相同",
        complexitySpace: "需要额外数组存储合并结果",
        stabilityNote: "归并排序是<strong>稳定排序</strong>，相等元素的相对顺序保持不变。这是其相比快速排序的重要优势。",
        
        usageTitle: "适用场景",
        usageList: [
            "需要稳定排序：如按多个字段排序时保持次要字段顺序",
            "链表排序：归并排序对链表特别高效，不需要额外空间",
            "外部排序：处理无法一次载入内存的大数据",
            "需要保证最坏情况性能：时间复杂度恒为O(n log n)"
        ],
        usageTags: ["稳定排序", "链表排序", "外部排序", "大数据处理"]
    },
    
    // Myers差异算法
    myersDiff: {
        title: "Myers差异算法可视化",
        subtitle: "Git Diff 的核心算法 - 最小编辑距离",
        intro: "Myers差异算法是Git等版本控制系统的核心。它能找出两个序列之间的最小编辑操作（插入和删除），通过在编辑图上寻找最短路径来实现。",
        
        sourceLabel: "源序列",
        targetLabel: "目标序列",
        sourcePlaceholder: "输入源序列",
        targetPlaceholder: "输入目标序列",
        editGraph: "编辑图",
        diffResult: "差异结果",
        
        principleTitle: "算法原理",
        principleSteps: [
            "构建编辑图：X轴代表源序列，Y轴代表目标序列",
            "水平移动 = 删除源序列字符，垂直移动 = 插入目标序列字符",
            "对角线移动 = 字符匹配（免费）",
            "目标：找到从(0,0)到(N,M)的最短路径",
            "使用D值（编辑距离）逐层搜索，找到最小D的路径"
        ],
        searchNote: "算法从D=0开始，逐步增加D值，直到找到一条从(0,0)到(N,M)的路径。这保证了找到的是最短编辑路径。",
        
        complexityTime: "D是编辑距离，最坏情况D=N+M",
        complexityWorst: "两个完全不同的序列",
        complexitySpace: "只需存储当前和前一行的状态",
        performanceNote: "在实际应用中，大多数差异较小，因此平均性能非常好。",
        
        usageTitle: "应用场景",
        usageList: [
            "Git版本控制系统的diff功能",
            "GNU diff工具",
            "代码审查工具的变更对比",
            "文档比较和合并工具",
            "DNA序列比对（生物信息学）"
        ],
        usageTags: ["Git Diff", "版本控制", "代码审查", "文档对比"]
    },
    
    // LCS最长公共子序列
    lcs: {
        title: "最长公共子序列可视化",
        subtitle: "动态规划经典问题 - LCS",
        intro: "最长公共子序列（LCS）问题是寻找两个序列共有的最长子序列。子序列不要求连续，但必须保持相对顺序。LCS是许多文本比较和生物信息学应用的基础。",
        
        seqALabel: "序列A",
        seqBLabel: "序列B",
        seqAPlaceholder: "输入序列A",
        seqBPlaceholder: "输入序列B",
        dpMatrix: "DP矩阵",
        lcsResult: "LCS结果",
        
        principleTitle: "动态规划思路",
        principleDesc: "设 dp[i][j] 表示序列A的前i个字符与序列B的前j个字符的LCS长度。",
        principleRules: [
            "如果 A[i-1] == B[j-1]：dp[i][j] = dp[i-1][j-1] + 1（当前字符匹配，LCS长度+1）",
            "如果 A[i-1] != B[j-1]：dp[i][j] = max(dp[i-1][j], dp[i][j-1])（取左边或上边的较大值）"
        ],
        backtrackNote: "最终 dp[m][n] 就是LCS的长度。通过回溯DP表可以还原出具体的LCS序列。",
        
        complexityTime: "需要填充整个DP表",
        complexitySpace: "需要存储DP表",
        complexityOptimized: "只存储两行即可（如果只需长度）",
        
        usageTitle: "应用场景",
        usageList: [
            "文本比较：diff工具比较文件差异",
            "生物信息学：DNA/蛋白质序列比对",
            "版本控制：检测代码变更",
            "拼写检查：计算编辑距离的基础",
            "数据去重：识别相似内容"
        ],
        usageTags: ["文本比较", "DNA比对", "版本控制", "相似度计算"]
    },
    
    // KMP字符串匹配
    kmp: {
        title: "KMP字符串匹配可视化",
        subtitle: "利用前缀表跳过无效比较",
        intro: "KMP（Knuth-Morris-Pratt）算法是一种高效的字符串匹配算法。它利用已匹配部分的信息，避免从头开始重新匹配，通过\"前缀表\"（也叫next数组）实现O(n+m)的时间复杂度。",
        
        textLabel: "文本串",
        patternLabel: "模式串",
        textPlaceholder: "输入文本串",
        patternPlaceholder: "输入模式串",
        prefixTable: "前缀表 (Next数组)",
        matchProcess: "匹配过程",
        matchResult: "匹配结果",
        
        principleTitle: "核心概念",
        principleSteps: [
            "前缀表记录模式串每个位置的\"最长相等前后缀\"长度",
            "当匹配失败时，利用前缀表跳过已知不可能匹配的位置",
            "模式串不需要回退到起点，而是跳到前缀表指示的位置"
        ],
        prefixExample: "例如 \"ABAB\" 的最长相等前后缀是 \"AB\"，长度为2。",
        
        buildPrefix: "构建前缀表",
        buildPrefixDesc: "M是模式串长度",
        matchPhase: "匹配过程",
        matchPhaseDesc: "N是文本串长度",
        totalTime: "总时间",
        totalTimeDesc: "远优于朴素算法的O(N×M)",
        complexitySpace: "存储前缀表",
        
        usageTitle: "应用场景",
        usageList: [
            "文本编辑器的查找功能",
            "搜索引擎的关键词匹配",
            "DNA序列模式搜索",
            "网络入侵检测（特征码匹配）",
            "数据压缩算法"
        ],
        usageTags: ["文本搜索", "模式匹配", "生物信息学", "网络安全"]
    },
    
    // Dijkstra最短路径
    dijkstra: {
        title: "Dijkstra最短路径可视化",
        subtitle: "单源最短路径的经典算法",
        intro: "Dijkstra算法用于在带权图中找到从源点到所有其他顶点的最短路径。它采用贪心策略，每次选择当前距离最小的未访问顶点进行扩展。",
        
        addNode: "添加节点",
        addEdge: "添加边",
        setStart: "设置起点",
        distanceTable: "距离表",
        
        principleTitle: "算法步骤",
        step1: "初始化：源点距离设为0，其他所有节点距离设为无穷大",
        step2: "将源点加入优先队列（最小堆）",
        step3: "取出队列中距离最小的节点u",
        step4: "对于u的每个邻居v，如果通过u到达v的距离更短，则更新v的距离",
        step5: "将更新后的邻居加入优先队列",
        step6: "重复步骤3-5直到队列为空",
        keyInsight: "关键洞察：已确定最短距离的节点不会再被更新，因为所有边权重非负。",
        
        complexityTitle: "时间与空间复杂度",
        implMethod: "实现方式",
        simpleArray: "数组实现",
        simpleArrayDesc: "每次线性查找最小值",
        binaryHeap: "二叉堆",
        binaryHeapDesc: "常用实现方式",
        fibonacciHeap: "斐波那契堆",
        fibonacciHeapDesc: "理论最优但实现复杂",
        complexitySpace: "存储距离和优先队列",
        limitationNote: "注意：Dijkstra不能处理负权边。对于负权图，应使用Bellman-Ford算法。",
        
        usageTitle: "应用场景",
        usage1: "GPS导航系统的最短路线规划",
        usage2: "网络路由协议（OSPF、IS-IS）",
        usage3: "社交网络中的最短关系链",
        usage4: "游戏中的NPC寻路",
        usage5: "航班/铁路最优路线查询",
        tag1: "导航系统",
        tag2: "网络路由",
        tag3: "游戏开发",
        tag4: "路径规划"
    },
    
    // BFS/DFS图遍历
    bfsDfs: {
        title: "BFS与DFS图遍历可视化",
        subtitle: "广度优先 vs 深度优先搜索",
        intro: "BFS（广度优先搜索）和DFS（深度优先搜索）是两种基本的图遍历算法。BFS使用队列，逐层扩展；DFS使用栈（或递归），尽可能深入探索。",
        
        bfsTitle: "BFS 广度优先",
        dfsTitle: "DFS 深度优先",
        queue: "队列",
        stack: "栈",
        visitOrder: "访问顺序",
        
        principleTitle: "算法对比",
        dataStructure: "数据结构",
        bfsStructure: "队列 (FIFO)",
        dfsStructure: "栈 (LIFO) / 递归",
        explorationOrder: "探索顺序",
        bfsOrder: "逐层扩展（由近及远）",
        dfsOrder: "尽可能深入，再回溯",
        shortestPath: "最短路径",
        bfsPath: "保证找到（无权图）",
        dfsPath: "不保证",
        spaceUsage: "空间消耗",
        bfsSpace: "可能较大（存储整层）",
        dfsSpace: "通常较小",
        
        complexityNote: "V是顶点数，E是边数。两种算法时间复杂度相同，但实际空间使用取决于图的结构。",
        
        usageTitle: "应用场景",
        bfsUsage: "BFS适用于：",
        bfsUsageList: [
            "无权图的最短路径",
            "社交网络中的\"六度分隔\"",
            "迷宫的最短路径",
            "网页爬虫"
        ],
        dfsUsage: "DFS适用于：",
        dfsUsageList: [
            "拓扑排序",
            "检测图中的环",
            "寻找连通分量",
            "解决迷宫问题（所有路径）",
            "回溯算法"
        ],
        usageTags: ["最短路径", "拓扑排序", "连通性检测", "迷宫求解"]
    },
    
    // A*寻路算法
    astar: {
        title: "A*寻路算法可视化",
        subtitle: "启发式最短路径搜索",
        intro: "A*算法是一种启发式搜索算法，结合了Dijkstra的最短路径保证和贪心搜索的效率。它使用估价函数 f(n) = g(n) + h(n) 来指导搜索方向。",
        
        setStart: "设置起点",
        setEnd: "设置终点",
        addObstacle: "添加障碍",
        clearGrid: "清空网格",
        openList: "Open列表",
        closedList: "Closed列表",
        
        principleTitle: "核心概念",
        principleSteps: [
            "g(n)：从起点到节点n的实际代价",
            "h(n)：从节点n到终点的启发式估计（如曼哈顿距离）",
            "f(n) = g(n) + h(n)：节点n的总估价",
            "每次从Open列表中选择f值最小的节点扩展",
            "当选中的节点是终点时，搜索结束"
        ],
        heuristicNote: "启发函数h(n)必须是\"可采纳的\"（不高估实际代价），才能保证找到最短路径。",
        
        complexityTime: "最坏情况，取决于启发函数质量",
        actualPerformance: "实际性能",
        actualPerformanceDesc: "启发式引导减少探索节点",
        complexitySpace: "存储Open和Closed列表",
        comparisonNote: "A* vs Dijkstra：Dijkstra向所有方向均匀扩展，而A*优先向目标方向探索。",
        
        usageTitle: "应用场景",
        usageList: [
            "游戏中的NPC寻路和单位移动",
            "机器人路径规划",
            "GPS导航系统",
            "自动驾驶路径决策",
            "物流配送路线优化"
        ],
        usageTags: ["游戏开发", "机器人导航", "自动驾驶", "物流优化"]
    },
    
    // 二分查找
    binarySearch: {
        title: "二分查找可视化",
        subtitle: "有序数组中的高效查找",
        intro: "二分查找（Binary Search）是一种在有序数组中查找特定元素的算法。每次比较都能将搜索范围缩小一半，因此效率极高，时间复杂度为O(log n)。",
        
        targetLabel: "查找目标",
        targetPlaceholder: "输入要查找的数字",
        low: "低",
        mid: "中",
        high: "高",
        found: "找到！",
        notFound: "未找到",
        
        principleTitle: "算法步骤",
        principleSteps: [
            "初始化左指针left=0，右指针right=n-1",
            "计算中间位置 mid = (left + right) / 2",
            "比较 arr[mid] 与目标值：",
            "相等：找到目标，返回mid",
            "arr[mid] > target：目标在左半部分，right = mid - 1",
            "arr[mid] < target：目标在右半部分，left = mid + 1",
            "重复步骤2-3，直到 left > right（未找到）"
        ],
        
        complexityBest: "目标恰好在中间",
        complexityAvgWorst: "每次搜索范围减半",
        complexitySpace: "只需常数额外空间",
        logNote: "为什么是O(log n)？因为每次比较后范围减半，最多需要 log₂(n) 次比较。对于100万个元素，最多只需约20次比较！",
        
        usageTitle: "应用场景",
        usageList: [
            "在有序数组/列表中查找元素",
            "数据库索引查询（B树、B+树）",
            "查找插入位置（如bisect模块）",
            "求解单调函数的零点",
            "算法竞赛中的\"二分答案\"技巧"
        ],
        usageTags: ["有序查找", "数据库索引", "二分答案", "数值计算"]
    },
    
    // 0/1背包问题
    knapsack: {
        title: "0/1背包问题可视化",
        subtitle: "动态规划经典优化问题",
        intro: "0/1背包问题是一个经典的组合优化问题：给定n个物品（每个有重量和价值）和一个容量为W的背包，如何选择物品使得总价值最大，同时不超过背包容量？",
        
        capacity: "背包容量",
        items: "物品列表",
        weight: "重量",
        value: "价值",
        dpTable: "DP表格",
        maxValue: "最大价值",
        selectedItems: "选中物品",
        
        principleTitle: "动态规划思路",
        principleDesc: "设 dp[i][w] 表示考虑前i个物品、容量为w时的最大价值。",
        principleRules: [
            "不选第i个物品：dp[i][w] = dp[i-1][w]",
            "选第i个物品（需要能装下）：dp[i][w] = dp[i-1][w-wi] + vi",
            "取两者最大值"
        ],
        
        complexityTime: "N是物品数，W是容量",
        complexitySpace: "存储DP表格",
        complexityOptimized: "使用一维数组，逆序遍历",
        pseudoPolynomialNote: "注意：这是伪多项式时间，因为W可能很大。当W以二进制表示时，算法是指数级的。",
        
        usageTitle: "应用场景",
        usageList: [
            "资源分配问题（预算分配）",
            "货物装载优化",
            "投资组合选择",
            "文件选择备份（磁盘空间限制）",
            "密码学中的子集和问题"
        ],
        usageTags: ["资源分配", "货运优化", "投资决策", "组合优化"]
    },
    
    // 凸包算法
    convexHull: {
        title: "凸包算法可视化",
        subtitle: "Graham Scan - 计算点集的凸包",
        intro: "凸包（Convex Hull）是包含所有给定点的最小凸多边形。Graham Scan算法通过极角排序和栈操作，以O(n log n)的时间复杂度高效计算凸包。",
        
        addPoint: "添加点",
        generateRandom: "随机生成",
        clear: "清空",
        hullStack: "凸包栈",
        
        principleTitle: "算法步骤",
        principleSteps: [
            "找到y坐标最小的点作为基点P0（若相同取x最小）",
            "将其他所有点按照相对于P0的极角排序",
            "初始化栈，压入P0和排序后的第一个点",
            "依次处理剩余的点：",
            "如果新点使得栈顶两点形成\"右转\"，则弹出栈顶",
            "重复上一步直到形成\"左转\"，然后将新点压入栈",
            "栈中的点即为凸包顶点"
        ],
        crossProductNote: "叉积判断转向：(A-O)×(B-O) > 0 表示左转，< 0 表示右转，= 0 表示共线。",
        
        findBase: "找基点",
        findBaseDesc: "遍历所有点",
        polarSort: "极角排序",
        polarSortDesc: "决定整体复杂度",
        stackProcess: "栈处理",
        stackProcessDesc: "每个点最多入栈出栈各一次",
        totalTime: "总时间",
        totalTimeDesc: "排序主导",
        complexitySpace: "存储栈",
        
        usageTitle: "应用场景",
        usageList: [
            "图形学中的碰撞检测",
            "地理信息系统（GIS）边界计算",
            "机器人运动规划",
            "图像处理中的物体轮廓",
            "最小包围盒计算",
            "统计学中的离群点检测"
        ],
        usageTags: ["碰撞检测", "GIS", "机器人", "图像处理"]
    },
    
    // 算法卡片简介（首页使用）
    cards: {
        bubbleSort: {
            name: "冒泡排序",
            complexity: "O(n²) | O(1)",
            desc: "相邻元素两两比较，较大元素上浮"
        },
        heapSort: {
            name: "堆排序",
            complexity: "O(n log n) | O(1)",
            desc: "利用二叉堆特性完成排序"
        },
        quickSort: {
            name: "快速排序",
            complexity: "O(n log n) | O(log n)",
            desc: "分治策略，基准元素分区"
        },
        mergeSort: {
            name: "归并排序",
            complexity: "O(n log n) | O(n)",
            desc: "分解子数组后合并"
        },
        myersDiff: {
            name: "Myers差异",
            complexity: "O((N+M)D) | O(N+M)",
            desc: "最小编辑距离，Git diff核心"
        },
        lcs: {
            name: "LCS公共子序列",
            complexity: "O(MN) | O(MN)",
            desc: "动态规划找最长公共子序列"
        },
        kmp: {
            name: "KMP匹配",
            complexity: "O(N+M) | O(M)",
            desc: "前缀表加速字符串匹配"
        },
        dijkstra: {
            name: "Dijkstra",
            complexity: "O((V+E)logV) | O(V)",
            desc: "单源最短路径算法"
        },
        bfsDfs: {
            name: "BFS/DFS",
            complexity: "O(V+E) | O(V)",
            desc: "广度/深度优先遍历对比"
        },
        astar: {
            name: "A*寻路",
            complexity: "O(E) | O(V)",
            desc: "启发式最短路径搜索"
        },
        binarySearch: {
            name: "二分查找",
            complexity: "O(log n) | O(1)",
            desc: "有序数组中的高效查找"
        },
        knapsack: {
            name: "0/1背包",
            complexity: "O(NW) | O(NW)",
            desc: "动态规划经典优化问题"
        },
        convexHull: {
            name: "凸包算法",
            complexity: "O(n log n) | O(n)",
            desc: "Graham Scan计算点集凸包"
        }
    }
};
