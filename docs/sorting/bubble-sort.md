# **冒泡排序算法**

## 算法简介

冒泡排序是一种简单的排序算法，它重复地遍历要排序的列表，比较相邻的元素并交换它们的位置，直到列表排序完成。

## 算法步骤

1. 从列表的第一个元素开始，比较相邻的两个元素
2. 如果前一个元素比后一个元素大，则交换它们的位置
3. 对列表中的每一对相邻元素重复上述步骤
4. 重复上述过程，直到列表排序完成

## 代码实现

=== "Python"
    ```python
    def bubble_sort(arr):
        n = len(arr)
        for i in range(n):
            # 标记是否发生交换
            swapped = False
            for j in range(0, n-i-1):
                # 如果当前元素大于下一个元素，则交换
                if arr[j] > arr[j+1]:
                    arr[j], arr[j+1] = arr[j+1], arr[j]
                    swapped = True
            # 如果没有发生交换，说明数组已经有序
            if not swapped:
                break
        return arr
    
    # 测试
    arr = [5, 3, 8, 4, 2]
    sorted_arr = bubble_sort(arr)
    print("排序后的数组:", sorted_arr)
    ```

=== "Java"
    ```java
    public class BubbleSort {
        public static void main(String[] args) {
            int[] arr = {5, 3, 8, 4, 2};
            bubbleSort(arr);
            System.out.println("排序后的数组:");
            for (int num : arr) {
                System.out.print(num + " ");
            }
        }
        
        public static void bubbleSort(int[] arr) {
            int n = arr.length;
            boolean swapped;
            for (int i = 0; i < n - 1; i++) {
                swapped = false;
                for (int j = 0; j < n - i - 1; j++) {
                    if (arr[j] > arr[j + 1]) {
                        // 交换元素
                        int temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                        swapped = true;
                    }
                }
                // 如果没有交换，说明已排序
                if (!swapped) break;
            }
        }
    }
    ```

## 复杂度分析

- 时间复杂度：
  - 最坏情况：O(n²)
  - 平均情况：O(n²)
  - 最好情况：O(n)（当列表已经有序时）
- 空间复杂度：O(1)（原地排序）

## 排序示例

让我们通过一个具体的例子来理解冒泡排序的工作原理。假设我们有一个数组：`[5, 3, 8, 4, 2]`

### 第一轮遍历

1. 比较 5 和 3：5 > 3，交换位置 → `[3, 5, 8, 4, 2]`
2. 比较 5 和 8：5 < 8，不交换 → `[3, 5, 8, 4, 2]`
3. 比较 8 和 4：8 > 4，交换位置 → `[3, 5, 4, 8, 2]`
4. 比较 8 和 2：8 > 2，交换位置 → `[3, 5, 4, 2, 8]`

第一轮结束后，最大的元素 8 已经"冒泡"到了数组的末尾。

### 第二轮遍历

1. 比较 3 和 5：3 < 5，不交换 → `[3, 5, 4, 2, 8]`
2. 比较 5 和 4：5 > 4，交换位置 → `[3, 4, 5, 2, 8]`
3. 比较 5 和 2：5 > 2，交换位置 → `[3, 4, 2, 5, 8]`

第二轮结束后，第二大的元素 5 已经"冒泡"到了倒数第二的位置。

### 第三轮遍历

1. 比较 3 和 4：3 < 4，不交换 → `[3, 4, 2, 5, 8]`
2. 比较 4 和 2：4 > 2，交换位置 → `[3, 2, 4, 5, 8]`

### 第四轮遍历

1. 比较 3 和 2：3 > 2，交换位置 → `[2, 3, 4, 5, 8]`

排序完成！最终得到有序数组：`[2, 3, 4, 5, 8]`

这个例子展示了冒泡排序的核心特点：每一轮遍历后，当前轮次中的最大元素会"冒泡"到子数组的末尾。

## 动画演示

<div style="width:100%; height:100%; margin:20px 0;">
    <iframe src="../bubble_sort.html" style="width:100%; height:100%; border:none;"></iframe>
</div>

## 练习题

1. 实现冒泡排序的优化版本，当某一轮没有发生交换时提前终止排序
2. 分析冒泡排序在几乎有序的列表上的性能
3. 比较冒泡排序和其他简单排序算法的优缺点
