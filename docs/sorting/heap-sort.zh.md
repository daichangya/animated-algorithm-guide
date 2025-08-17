---
title: 堆排序算法 | 原理与动画演示
description: 详细讲解堆排序算法的原理、二叉堆构建过程和实现方法，包含交互式动画演示和Python、Java代码实现，以及复杂度分析
keywords: 堆排序, 二叉堆, 排序算法, 算法可视化, 交互式动画, 算法教程, 时间复杂度, 空间复杂度
---

# **堆排序算法**

## 算法简介

堆排序是一种基于二叉堆数据结构的比较排序算法。它通过构建最大堆（父节点大于子节点）来进行排序，利用堆的特性来获得有序序列。堆排序的主要优点是能够就地排序，不需要额外的存储空间。

## 算法步骤

1. 构建最大堆：将数组重新排列成最大堆（从最后一个非叶子节点开始，依次进行下沉操作）
2. 交换堆顶元素（最大值）和堆的最后一个元素
3. 将堆的大小减1，并对新的堆顶元素进行下沉操作，以维护最大堆性质
4. 重复步骤2和3，直到堆的大小为1

## 代码实现

=== "Python"
    ```python
    def heapify(arr, n, i):
        largest = i  # 初始化最大值为根节点
        left = 2 * i + 1  # 左子节点
        right = 2 * i + 2  # 右子节点
    
        # 如果左子节点大于根节点
        if left < n and arr[left] > arr[largest]:
            largest = left
    
        # 如果右子节点大于目前的最大值
        if right < n and arr[right] > arr[largest]:
            largest = right
    
        # 如果最大值不是根节点
        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]  # 交换
            # 递归地对受影响的子树进行堆化
            heapify(arr, n, largest)
    
    def heap_sort(arr):
        n = len(arr)
    
        # 构建最大堆
        for i in range(n // 2 - 1, -1, -1):
            heapify(arr, n, i)
    
        # 一个个从堆中取出元素
        for i in range(n - 1, 0, -1):
            arr[0], arr[i] = arr[i], arr[0]  # 交换
            heapify(arr, i, 0)
        
        return arr
    
    # 测试
    arr = [5, 3, 8, 4, 2]
    sorted_arr = heap_sort(arr)
    print("排序后的数组:", sorted_arr)
    ```

=== "Java"
    ```java
    public class HeapSort {
        public static void main(String[] args) {
            int[] arr = {5, 3, 8, 4, 2};
            heapSort(arr);
            System.out.println("排序后的数组:");
            for (int num : arr) {
                System.out.print(num + " ");
            }
        }
        
        public static void heapSort(int[] arr) {
            int n = arr.length;
    
            // 构建最大堆
            for (int i = n / 2 - 1; i >= 0; i--)
                heapify(arr, n, i);
    
            // 一个个从堆中取出元素
            for (int i = n - 1; i > 0; i--) {
                // 将当前根节点移到末尾
                int temp = arr[0];
                arr[0] = arr[i];
                arr[i] = temp;
    
                // 对剩余的堆进行堆化
                heapify(arr, i, 0);
            }
        }
    
        private static void heapify(int[] arr, int n, int i) {
            int largest = i;  // 初始化最大值为根节点
            int left = 2 * i + 1;  // 左子节点
            int right = 2 * i + 2;  // 右子节点
    
            // 如果左子节点大于根节点
            if (left < n && arr[left] > arr[largest])
                largest = left;
    
            // 如果右子节点大于目前的最大值
            if (right < n && arr[right] > arr[largest])
                largest = right;
    
            // 如果最大值不是根节点
            if (largest != i) {
                int swap = arr[i];
                arr[i] = arr[largest];
                arr[largest] = swap;
    
                // 递归地对受影响的子树进行堆化
                heapify(arr, n, largest);
            }
        }
    }
    ```

## 复杂度分析

- 时间复杂度：
  - 最坏情况：O(n log n)
  - 平均情况：O(n log n)
  - 最好情况：O(n log n)
- 空间复杂度：O(1)（原地排序）

## 排序示例

让我们通过一个具体的例子来理解堆排序的工作原理。假设我们有一个数组：`[5, 3, 8, 4, 2]`

### 构建最大堆

首先，我们需要将数组重新排列成最大堆。将数组视为完全二叉树：
```
     5
   /   \
  3     8
 / \
4   2
```

1. 从最后一个非叶子节点开始堆化（索引1，值为3）：
   ```
   比较3和其子节点4、2
   3小于4，交换位置
        5
      /   \
     4     8
    / \
   3   2
   ```

2. 处理根节点（索引0，值为5）：
   ```
   比较5和其子节点4、8
   5小于8，交换位置
        8
      /   \
     4     5
    / \
   3   2
   ```

现在我们得到了一个最大堆。

### 排序过程

1. 第一步：
   - 交换堆顶8和最后一个元素2
   - 将8从堆中移除，对剩余元素进行堆化
   ```
   交换后：[2, 4, 5, 3, 8]
   堆化后：[5, 4, 2, 3, 8]
   ```

2. 第二步：
   - 交换堆顶5和最后一个元素3
   - 将5从堆中移除，对剩余元素进行堆化
   ```
   交换后：[3, 4, 2, 5, 8]
   堆化后：[4, 3, 2, 5, 8]
   ```

3. 第三步：
   - 交换堆顶4和最后一个元素2
   - 将4从堆中移除，对剩余元素进行堆化
   ```
   交换后：[2, 3, 4, 5, 8]
   堆化后：[3, 2, 4, 5, 8]
   ```

4. 最后一步：
   - 交换堆顶3和最后一个元素2
   ```
   最终结果：[2, 3, 4, 5, 8]
   ```

排序完成！最终得到有序数组：`[2, 3, 4, 5, 8]`

这个例子展示了堆排序的两个主要阶段：
1. 构建最大堆
2. 依次取出堆顶元素并维护堆的性质

## 动画演示

<div style="width:100%; height:100%; margin:20px 0;">
    <iframe src="../../../sorting/heap_sort.html" style="width:100%; height:100%; border:none;"></iframe>
</div>

## 练习题

1. 实现一个使用最小堆而不是最大堆的堆排序
2. 分析在已经部分排序的数组上使用堆排序的性能
3. 比较堆排序和快速排序在不同数据集上的性能差异
4. 实现一个可以同时支持升序和降序排序的堆排序算法
