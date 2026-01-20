/**
 * English Language Pack
 * @author changyadai
 */

export default {
    // Common text
    common: {
        backHome: "← Back to Home",
        startSort: "Start Sorting",
        start: "Start",
        reset: "Reset",
        clickToStart: "Click \"Start Sorting\" to view animation",
        clickStartToView: "Click \"Start\" to view animation",
        running: "Running...",
        completed: "Completed!",
        
        // Tab labels
        tabPrinciple: "📖 How It Works",
        tabComplexity: "⏱️ Complexity",
        tabUsage: "💡 Applications",
        tabCode: "📝 Implementation",
        
        // Code languages
        python: "Python",
        java: "Java",
        
        // Complexity table
        situation: "Case",
        complexity: "Complexity",
        description: "Description",
        bestCase: "Best Case",
        averageCase: "Average Case",
        worstCase: "Worst Case",
        spaceComplexity: "Space Complexity",
        timeComplexity: "Time Complexity"
    },
    
    // Home page
    home: {
        title: "Algorithm Visualization",
        subtitle: "Understand classic algorithms through interactive animations",
        algorithmCount: "Total Algorithms",
        categoryCount: "Categories",
        
        // Introduction
        introTitle: "What is Algorithm Visualization?",
        introText: "Algorithm visualization transforms abstract algorithmic logic into intuitive animations. By observing how elements move, compare, and transform, you can deeply understand the core ideas behind algorithms, not just memorize code. Each algorithm has its unique \"personality\" - Bubble Sort's floating bubbles, Quick Sort's partitioning, Dijkstra's ripple expansion... making learning algorithms fun and engaging.",
        
        // Quick Start
        quickStartTitle: "Quick Start",
        step1: "Choose an algorithm category",
        step2: "Click a card to enter the page",
        step3: "Click \"Start\" to watch the animation",
        step4: "Read explanations to understand",
        
        // Category titles
        sortingCategory: "Sorting Algorithms",
        sortingDesc: "Array element arrangement",
        sequenceCategory: "String Algorithms",
        sequenceDesc: "Sequence matching and comparison",
        graphCategory: "Graph Algorithms",
        graphDesc: "Graph traversal and pathfinding",
        searchCategory: "Search & Optimization",
        searchDesc: "Efficient search and decision optimization",
        geometryCategory: "Computational Geometry",
        geometryDesc: "Geometric shapes and spatial computation",
        
        // Platform features
        featuresTitle: "Platform Features",
        feature1Title: "Smooth Animations",
        feature1Desc: "Carefully designed CSS animations make every step visible, helping you understand the execution process.",
        feature2Title: "Interactive Controls",
        feature2Desc: "Pause and reset anytime. Some algorithms support custom input data for flexible learning.",
        feature3Title: "Detailed Explanations",
        feature3Desc: "Each algorithm page includes principles, complexity analysis, and real-world applications.",
        feature4Title: "Responsive Design",
        feature4Desc: "Works perfectly on desktop and mobile devices. Learn algorithms anywhere, anytime.",
        feature5Title: "Zero Dependencies",
        feature5Desc: "Pure HTML/CSS/JavaScript implementation. No frameworks needed. Clean code for learning.",
        feature6Title: "Eye-Friendly Dark Mode",
        feature6Desc: "Comfortable dark theme design for long study sessions without eye strain.",
        
        // Footer
        footerCopyright: "© 2026 Algorithm Visualization. Built with HTML / CSS / JavaScript",
        footerNote: "This is an open-source learning project. Contributions and feedback are welcome!"
    },
    
    // Bubble Sort
    bubbleSort: {
        title: "Bubble Sort Visualization",
        subtitle: "Watch elements float up like bubbles to their correct positions",
        intro: "Bubble Sort is a simple and intuitive sorting algorithm. It repeatedly traverses the list, compares adjacent elements, and swaps them if they're in the wrong order. After each pass, the largest element \"bubbles up\" to the end, like bubbles rising in water.",
        
        principleTitle: "Algorithm Steps",
        principleSteps: [
            "Start from the first element, compare adjacent pairs",
            "If the left element is larger, swap their positions",
            "Do the same for every adjacent pair from start to end",
            "After one pass, the largest element is at the end",
            "Repeat, reducing the comparison range each time",
            "Stop when no swaps occur in a pass"
        ],
        
        complexityBest: "Array is already sorted, only one pass needed",
        complexityAvg: "Multiple passes and swaps required",
        complexityWorst: "Array is in reverse order",
        complexitySpace: "Only constant extra space needed (in-place)",
        stabilityNote: "Bubble Sort is a <strong>stable sort</strong>, preserving the relative order of equal elements.",
        
        usageTitle: "Use Cases",
        usageList: [
            "Teaching: As one of the simplest algorithms, great for beginners",
            "Small datasets: When n < 50, simple implementation wins",
            "Nearly sorted arrays: Efficient when data is almost sorted",
            "Stability required: When preserving original order matters"
        ],
        usageTags: ["Education", "Small Data", "Stable Sorting"]
    },
    
    // Heap Sort
    heapSort: {
        title: "Heap Sort Visualization",
        subtitle: "Watch the binary heap construction and adjustment process",
        intro: "Heap Sort uses the binary heap data structure for sorting. It first builds a max-heap from the array, then repeatedly extracts the maximum element (root) to the end while maintaining the heap property.",
        
        principleTitle: "Algorithm Steps",
        principleSteps: [
            "Build a max-heap from the array (Build Max-Heap)",
            "The root element (arr[0]) is now the maximum",
            "Swap root with the last element",
            "Reduce heap size by 1, heapify the new root",
            "Repeat steps 3-4 until heap size is 1"
        ],
        
        buildHeap: "Build Heap",
        buildHeapDesc: "Bottom-up heap construction complexity",
        sortAll: "Sort (All Cases)",
        sortAllDesc: "O(log n) adjustment per extraction",
        complexitySpace: "In-place sorting, only constant extra space",
        stabilityNote: "Heap Sort is an <strong>unstable sort</strong>, relative order of equal elements may change.",
        
        usageTitle: "Use Cases",
        usageList: [
            "Need in-place sorting with guaranteed O(n log n) worst case",
            "Implementing priority queue data structures",
            "Finding top K largest/smallest elements",
            "System scheduling and task priority management"
        ],
        usageTags: ["Priority Queue", "Top-K Problem", "Task Scheduling", "Memory-Constrained"]
    },
    
    // Quick Sort
    quickSort: {
        title: "Quick Sort Visualization",
        subtitle: "Watch the divide-and-conquer partitioning process",
        intro: "Quick Sort is an efficient divide-and-conquer algorithm. It selects a \"pivot\" element and partitions the array: elements smaller than pivot go left, larger go right. Then recursively sort both parts.",
        
        principleTitle: "Algorithm Steps",
        principleSteps: [
            "Choose a pivot element (usually the last element)",
            "Set two pointers: i (boundary of smaller section) and j (scanner)",
            "j scans left to right; swap elements smaller than pivot with i+1, increment i",
            "After scanning, swap pivot with position i+1; pivot is now in place",
            "Recursively apply to left and right partitions"
        ],
        
        complexityBest: "Each partition splits array evenly",
        complexityAvg: "Expected performance on random input",
        complexityWorst: "Always picking smallest or largest as pivot",
        complexitySpace: "Recursive call stack depth",
        stabilityNote: "Quick Sort is <strong>unstable</strong>, but can be optimized with three-way partitioning.",
        
        usageTitle: "Use Cases",
        usageList: [
            "General sorting: Most language standard libraries use Quick Sort",
            "Large-scale data: Excellent average performance, good cache locality",
            "When stability not required: e.g., numerical sorting",
            "Hybrid approaches: Use insertion sort for small arrays"
        ],
        usageTags: ["General Sorting", "Large Data", "Standard Library", "Competitive Programming"]
    },
    
    // Merge Sort
    mergeSort: {
        title: "Merge Sort Visualization",
        subtitle: "Watch the recursive divide and merge process",
        intro: "Merge Sort is a stable divide-and-conquer algorithm. It recursively splits the array in half, sorts each half, then merges them. The key insight: merging two sorted arrays into one is efficient.",
        
        principleTitle: "Algorithm Steps",
        principleSteps: [
            "Split the array into two halves at the middle",
            "Recursively merge sort both halves",
            "Merge the two sorted halves into one sorted array"
        ],
        mergeNote: "The merge operation is key: use two pointers at the start of each subarray, compare and add the smaller element to the result, until all elements are processed.",
        
        complexityAll: "All Cases",
        complexityAllDesc: "Time complexity is the same regardless of input",
        complexitySpace: "Extra array needed for merging",
        stabilityNote: "Merge Sort is a <strong>stable sort</strong>, preserving relative order of equal elements. This is a major advantage over Quick Sort.",
        
        usageTitle: "Use Cases",
        usageList: [
            "Stable sorting: When secondary key order must be preserved",
            "Linked list sorting: Very efficient, no extra space needed",
            "External sorting: Processing data too large for memory",
            "Guaranteed worst-case performance: Always O(n log n)"
        ],
        usageTags: ["Stable Sort", "Linked Lists", "External Sort", "Big Data"]
    },
    
    // Myers Diff
    myersDiff: {
        title: "Myers Diff Algorithm Visualization",
        subtitle: "The core algorithm behind Git Diff - Minimum Edit Distance",
        intro: "Myers diff algorithm is the core of Git and other version control systems. It finds the minimum edit operations (insertions and deletions) between two sequences by finding the shortest path on an edit graph.",
        
        sourceLabel: "Source Sequence",
        targetLabel: "Target Sequence",
        sourcePlaceholder: "Enter source sequence",
        targetPlaceholder: "Enter target sequence",
        editGraph: "Edit Graph",
        diffResult: "Diff Result",
        
        principleTitle: "Algorithm Principle",
        principleSteps: [
            "Build edit graph: X-axis represents source, Y-axis represents target",
            "Horizontal move = delete from source, Vertical move = insert from target",
            "Diagonal move = character match (free)",
            "Goal: Find shortest path from (0,0) to (N,M)",
            "Search layer by layer with increasing D (edit distance)"
        ],
        searchNote: "Algorithm starts with D=0, incrementally increasing D until finding a path from (0,0) to (N,M). This guarantees finding the shortest edit path.",
        
        complexityTime: "D is edit distance, worst case D=N+M",
        complexityWorst: "Two completely different sequences",
        complexitySpace: "Only need current and previous row states",
        performanceNote: "In practice, most differences are small, so average performance is excellent.",
        
        usageTitle: "Applications",
        usageList: [
            "Git version control diff functionality",
            "GNU diff tool",
            "Code review change comparison",
            "Document comparison and merge tools",
            "DNA sequence alignment (bioinformatics)"
        ],
        usageTags: ["Git Diff", "Version Control", "Code Review", "Document Comparison"]
    },
    
    // LCS
    lcs: {
        title: "Longest Common Subsequence Visualization",
        subtitle: "Classic Dynamic Programming Problem - LCS",
        intro: "The Longest Common Subsequence (LCS) problem finds the longest subsequence common to two sequences. Subsequences don't need to be contiguous but must maintain relative order. LCS is fundamental to text comparison and bioinformatics.",
        
        seqALabel: "Sequence A",
        seqBLabel: "Sequence B",
        seqAPlaceholder: "Enter sequence A",
        seqBPlaceholder: "Enter sequence B",
        dpMatrix: "DP Matrix",
        lcsResult: "LCS Result",
        
        principleTitle: "Dynamic Programming Approach",
        principleDesc: "Let dp[i][j] represent the LCS length of first i chars of A and first j chars of B.",
        principleRules: [
            "If A[i-1] == B[j-1]: dp[i][j] = dp[i-1][j-1] + 1 (match, LCS length +1)",
            "If A[i-1] != B[j-1]: dp[i][j] = max(dp[i-1][j], dp[i][j-1]) (take max of left/top)"
        ],
        backtrackNote: "dp[m][n] is the LCS length. Backtrack through the DP table to reconstruct the actual LCS.",
        
        complexityTime: "Need to fill entire DP table",
        complexitySpace: "Need to store DP table",
        complexityOptimized: "Store only two rows (if only length needed)",
        
        usageTitle: "Applications",
        usageList: [
            "Text comparison: diff tools for file comparison",
            "Bioinformatics: DNA/protein sequence alignment",
            "Version control: Detecting code changes",
            "Spell checking: Basis for edit distance",
            "Data deduplication: Identifying similar content"
        ],
        usageTags: ["Text Comparison", "DNA Alignment", "Version Control", "Similarity"]
    },
    
    // KMP
    kmp: {
        title: "KMP String Matching Visualization",
        subtitle: "Skip unnecessary comparisons using the prefix table",
        intro: "KMP (Knuth-Morris-Pratt) is an efficient string matching algorithm. It uses information from previous matches to avoid restarting from scratch, achieving O(n+m) time complexity through the \"prefix table\" (or next array).",
        
        textLabel: "Text String",
        patternLabel: "Pattern String",
        textPlaceholder: "Enter text string",
        patternPlaceholder: "Enter pattern string",
        prefixTable: "Prefix Table (Next Array)",
        matchProcess: "Matching Process",
        matchResult: "Match Result",
        
        principleTitle: "Core Concepts",
        principleSteps: [
            "Prefix table records \"longest proper prefix which is also suffix\" for each position",
            "On mismatch, use prefix table to skip positions that can't possibly match",
            "Pattern doesn't restart from beginning, jumps to position indicated by prefix table"
        ],
        prefixExample: "Example: \"ABAB\" has longest proper prefix-suffix \"AB\", length 2.",
        
        buildPrefix: "Build Prefix Table",
        buildPrefixDesc: "M is pattern length",
        matchPhase: "Matching Phase",
        matchPhaseDesc: "N is text length",
        totalTime: "Total Time",
        totalTimeDesc: "Much better than naive O(N×M)",
        complexitySpace: "Store prefix table",
        
        usageTitle: "Applications",
        usageList: [
            "Text editor find functionality",
            "Search engine keyword matching",
            "DNA sequence pattern search",
            "Network intrusion detection (signature matching)",
            "Data compression algorithms"
        ],
        usageTags: ["Text Search", "Pattern Matching", "Bioinformatics", "Network Security"]
    },
    
    // Dijkstra
    dijkstra: {
        title: "Dijkstra's Shortest Path Visualization",
        subtitle: "Classic single-source shortest path algorithm",
        intro: "Dijkstra's algorithm finds shortest paths from a source vertex to all other vertices in a weighted graph. It uses a greedy strategy, always expanding the unvisited vertex with minimum current distance.",
        
        addNode: "Add Node",
        addEdge: "Add Edge",
        setStart: "Set Start",
        distanceTable: "Distance Table",
        
        principleTitle: "Algorithm Steps",
        step1: "Initialize: source distance = 0, all other nodes = infinity",
        step2: "Add the source to a priority queue (min-heap)",
        step3: "Extract the node u with the smallest distance from the queue",
        step4: "For each neighbor v of u, if the path through u is shorter, update v's distance",
        step5: "Add the updated neighbor to the priority queue",
        step6: "Repeat steps 3-5 until the queue is empty",
        keyInsight: "Key insight: Once a node's shortest distance is finalized, it won't be updated again because all edge weights are non-negative.",
        
        complexityTitle: "Time & Space Complexity",
        implMethod: "Implementation",
        simpleArray: "Array Implementation",
        simpleArrayDesc: "Linear search for minimum each time",
        binaryHeap: "Binary Heap",
        binaryHeapDesc: "Common implementation",
        fibonacciHeap: "Fibonacci Heap",
        fibonacciHeapDesc: "Theoretical best, complex implementation",
        complexitySpace: "Store distances and priority queue",
        limitationNote: "Note: Dijkstra cannot handle negative edge weights. Use Bellman-Ford for graphs with negative edges.",
        
        usageTitle: "Applications",
        usage1: "GPS navigation shortest route planning",
        usage2: "Network routing protocols (OSPF, IS-IS)",
        usage3: "Shortest relationship chain in social networks",
        usage4: "NPC pathfinding in games",
        usage5: "Flight/railway optimal route queries",
        tag1: "Navigation",
        tag2: "Network Routing",
        tag3: "Game Dev",
        tag4: "Path Planning"
    },
    
    // BFS/DFS
    bfsDfs: {
        title: "BFS & DFS Graph Traversal Visualization",
        subtitle: "Breadth-First vs Depth-First Search",
        intro: "BFS (Breadth-First Search) and DFS (Depth-First Search) are two fundamental graph traversal algorithms. BFS uses a queue, expanding layer by layer; DFS uses a stack (or recursion), exploring as deep as possible.",
        
        bfsTitle: "BFS Breadth-First",
        dfsTitle: "DFS Depth-First",
        queue: "Queue",
        stack: "Stack",
        visitOrder: "Visit Order",
        
        principleTitle: "Algorithm Comparison",
        dataStructure: "Data Structure",
        bfsStructure: "Queue (FIFO)",
        dfsStructure: "Stack (LIFO) / Recursion",
        explorationOrder: "Exploration Order",
        bfsOrder: "Layer by layer (near to far)",
        dfsOrder: "Go deep, then backtrack",
        shortestPath: "Shortest Path",
        bfsPath: "Guaranteed (unweighted)",
        dfsPath: "Not guaranteed",
        spaceUsage: "Space Usage",
        bfsSpace: "Can be large (stores entire layer)",
        dfsSpace: "Usually smaller",
        
        complexityNote: "V is vertices, E is edges. Both have same time complexity, but actual space depends on graph structure.",
        
        usageTitle: "Applications",
        bfsUsage: "BFS is good for:",
        bfsUsageList: [
            "Shortest path in unweighted graphs",
            "\"Six degrees of separation\" in social networks",
            "Shortest path in mazes",
            "Web crawlers"
        ],
        dfsUsage: "DFS is good for:",
        dfsUsageList: [
            "Topological sorting",
            "Cycle detection",
            "Finding connected components",
            "Maze solving (all paths)",
            "Backtracking algorithms"
        ],
        usageTags: ["Shortest Path", "Topological Sort", "Connectivity", "Maze Solving"]
    },
    
    // A*
    astar: {
        title: "A* Pathfinding Visualization",
        subtitle: "Heuristic shortest path search",
        intro: "A* is a heuristic search algorithm combining Dijkstra's shortest path guarantee with greedy search efficiency. It uses evaluation function f(n) = g(n) + h(n) to guide the search direction.",
        
        setStart: "Set Start",
        setEnd: "Set End",
        addObstacle: "Add Obstacle",
        clearGrid: "Clear Grid",
        openList: "Open List",
        closedList: "Closed List",
        
        principleTitle: "Core Concepts",
        principleSteps: [
            "g(n): Actual cost from start to node n",
            "h(n): Heuristic estimate from n to goal (e.g., Manhattan distance)",
            "f(n) = g(n) + h(n): Total evaluation of node n",
            "Always expand node with smallest f value from Open list",
            "Search ends when selected node is the goal"
        ],
        heuristicNote: "Heuristic h(n) must be \"admissible\" (never overestimate) to guarantee shortest path.",
        
        complexityTime: "Worst case, depends on heuristic quality",
        actualPerformance: "Actual Performance",
        actualPerformanceDesc: "Heuristic guidance reduces nodes explored",
        complexitySpace: "Store Open and Closed lists",
        comparisonNote: "A* vs Dijkstra: Dijkstra expands uniformly in all directions, A* prioritizes toward the goal.",
        
        usageTitle: "Applications",
        usageList: [
            "NPC pathfinding and unit movement in games",
            "Robot path planning",
            "GPS navigation systems",
            "Autonomous driving path decisions",
            "Logistics delivery route optimization"
        ],
        usageTags: ["Game Dev", "Robot Navigation", "Autonomous Driving", "Logistics"]
    },
    
    // Binary Search
    binarySearch: {
        title: "Binary Search Visualization",
        subtitle: "Efficient search in sorted arrays",
        intro: "Binary Search finds a specific element in a sorted array. Each comparison halves the search range, achieving O(log n) time complexity.",
        
        targetLabel: "Search Target",
        targetPlaceholder: "Enter number to find",
        low: "Low",
        mid: "Mid",
        high: "High",
        found: "Found!",
        notFound: "Not Found",
        
        principleTitle: "Algorithm Steps",
        principleSteps: [
            "Initialize left pointer = 0, right pointer = n-1",
            "Calculate middle position mid = (left + right) / 2",
            "Compare arr[mid] with target:",
            "Equal: Found target, return mid",
            "arr[mid] > target: Target in left half, right = mid - 1",
            "arr[mid] < target: Target in right half, left = mid + 1",
            "Repeat 2-3 until left > right (not found)"
        ],
        
        complexityBest: "Target is exactly in the middle",
        complexityAvgWorst: "Search range halves each time",
        complexitySpace: "Only constant extra space",
        logNote: "Why O(log n)? Range halves after each comparison, at most log₂(n) comparisons needed. For 1 million elements, only ~20 comparisons!",
        
        usageTitle: "Applications",
        usageList: [
            "Finding elements in sorted arrays/lists",
            "Database index queries (B-tree, B+tree)",
            "Finding insertion positions (like bisect)",
            "Finding roots of monotonic functions",
            "\"Binary search the answer\" in competitive programming"
        ],
        usageTags: ["Sorted Search", "Database Index", "Binary Answer", "Numerical Methods"]
    },
    
    // Knapsack
    knapsack: {
        title: "0/1 Knapsack Problem Visualization",
        subtitle: "Classic dynamic programming optimization problem",
        intro: "The 0/1 Knapsack is a classic combinatorial optimization problem: given n items (each with weight and value) and a knapsack of capacity W, how to select items to maximize total value without exceeding capacity?",
        
        capacity: "Knapsack Capacity",
        items: "Item List",
        weight: "Weight",
        value: "Value",
        dpTable: "DP Table",
        maxValue: "Maximum Value",
        selectedItems: "Selected Items",
        
        principleTitle: "Dynamic Programming Approach",
        principleDesc: "Let dp[i][w] represent max value considering first i items with capacity w.",
        principleRules: [
            "Don't take item i: dp[i][w] = dp[i-1][w]",
            "Take item i (if it fits): dp[i][w] = dp[i-1][w-wi] + vi",
            "Take the maximum of both"
        ],
        
        complexityTime: "N is items, W is capacity",
        complexitySpace: "Store DP table",
        complexityOptimized: "1D array with reverse iteration",
        pseudoPolynomialNote: "Note: This is pseudo-polynomial time because W can be large. When W is represented in binary, algorithm is exponential.",
        
        usageTitle: "Applications",
        usageList: [
            "Resource allocation (budget allocation)",
            "Cargo loading optimization",
            "Investment portfolio selection",
            "File backup selection (disk space limit)",
            "Subset sum problem in cryptography"
        ],
        usageTags: ["Resource Allocation", "Cargo Optimization", "Investment", "Combinatorial Optimization"]
    },
    
    // Convex Hull
    convexHull: {
        title: "Convex Hull Visualization",
        subtitle: "Graham Scan - Computing point set convex hull",
        intro: "Convex Hull is the smallest convex polygon containing all given points. Graham Scan uses polar angle sorting and stack operations to efficiently compute the convex hull in O(n log n) time.",
        
        addPoint: "Add Point",
        generateRandom: "Random Generate",
        clear: "Clear",
        hullStack: "Hull Stack",
        
        principleTitle: "Algorithm Steps",
        principleSteps: [
            "Find point P0 with minimum y-coordinate (then minimum x if tie)",
            "Sort all other points by polar angle relative to P0",
            "Initialize stack with P0 and first sorted point",
            "Process remaining points:",
            "If new point causes \"right turn\" with top two stack elements, pop top",
            "Repeat until \"left turn\", then push new point",
            "Stack contains convex hull vertices"
        ],
        crossProductNote: "Cross product determines turn: (A-O)×(B-O) > 0 means left turn, < 0 means right turn, = 0 means collinear.",
        
        findBase: "Find Base Point",
        findBaseDesc: "Traverse all points",
        polarSort: "Polar Angle Sort",
        polarSortDesc: "Dominates overall complexity",
        stackProcess: "Stack Processing",
        stackProcessDesc: "Each point pushed/popped at most once",
        totalTime: "Total Time",
        totalTimeDesc: "Dominated by sorting",
        complexitySpace: "Store stack",
        
        usageTitle: "Applications",
        usageList: [
            "Collision detection in graphics",
            "Boundary computation in GIS",
            "Robot motion planning",
            "Object contours in image processing",
            "Minimum bounding box computation",
            "Outlier detection in statistics"
        ],
        usageTags: ["Collision Detection", "GIS", "Robotics", "Image Processing"]
    },
    
    // Algorithm cards (for home page)
    cards: {
        bubbleSort: {
            name: "Bubble Sort",
            complexity: "O(n²) | O(1)",
            desc: "Compare adjacent elements, larger floats up"
        },
        heapSort: {
            name: "Heap Sort",
            complexity: "O(n log n) | O(1)",
            desc: "Uses binary heap properties for sorting"
        },
        quickSort: {
            name: "Quick Sort",
            complexity: "O(n log n) | O(log n)",
            desc: "Divide and conquer with pivot partitioning"
        },
        mergeSort: {
            name: "Merge Sort",
            complexity: "O(n log n) | O(n)",
            desc: "Divide into subarrays then merge"
        },
        myersDiff: {
            name: "Myers Diff",
            complexity: "O((N+M)D) | O(N+M)",
            desc: "Minimum edit distance, Git diff core"
        },
        lcs: {
            name: "LCS Subsequence",
            complexity: "O(MN) | O(MN)",
            desc: "DP for longest common subsequence"
        },
        kmp: {
            name: "KMP Matching",
            complexity: "O(N+M) | O(M)",
            desc: "Prefix table accelerates string matching"
        },
        dijkstra: {
            name: "Dijkstra",
            complexity: "O((V+E)logV) | O(V)",
            desc: "Single-source shortest path algorithm"
        },
        bfsDfs: {
            name: "BFS/DFS",
            complexity: "O(V+E) | O(V)",
            desc: "Breadth/depth first traversal comparison"
        },
        astar: {
            name: "A* Pathfinding",
            complexity: "O(E) | O(V)",
            desc: "Heuristic shortest path search"
        },
        binarySearch: {
            name: "Binary Search",
            complexity: "O(log n) | O(1)",
            desc: "Efficient search in sorted arrays"
        },
        knapsack: {
            name: "0/1 Knapsack",
            complexity: "O(NW) | O(NW)",
            desc: "Classic DP optimization problem"
        },
        convexHull: {
            name: "Convex Hull",
            complexity: "O(n log n) | O(n)",
            desc: "Graham Scan for point set hull"
        }
    }
};
