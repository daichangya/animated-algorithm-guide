# **归并排序算法**

## 算法简介

归并排序是一种高效的、基于分治法的排序算法。它将数组分成两半，分别对它们进行排序，然后将结果合并起来。归并排序是稳定的排序算法，适用于大型数据集。

## 算法步骤

1. 将待排序数组分成两个大小相等的子数组
2. 递归地对两个子数组进行排序
3. 将两个已排序的子数组合并成一个有序数组

## 代码实现

=== "Python"
    ```python
    def merge_sort(arr):
        if len(arr) <= 1:
            return arr
            
        # 分割数组
        mid = len(arr) // 2
        left_half = arr[:mid]
        right_half = arr[mid:]
        
        # 递归排序两半
        left_half = merge_sort(left_half)
        right_half = merge_sort(right_half)
        
        # 合并两个已排序的半数组
        return merge(left_half, right_half)
    
    def merge(left, right):
        result = []
        i = j = 0
        
        # 比较两个数组的元素并合并
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
        
        # 添加剩余元素
        result.extend(left[i:])
        result.extend(right[j:])
        return result
    
    # 测试
    arr = [5, 3, 8, 4, 2]
    sorted_arr = merge_sort(arr)
    print("排序后的数组:", sorted_arr)
    ```

=== "Java"
    ```java
    import java.util.Arrays;
    
    public class MergeSort {
        public static void main(String[] args) {
            int[] arr = {5, 3, 8, 4, 2};
            int[] sorted = mergeSort(arr);
            System.out.println("排序后的数组:");
            for (int num : sorted) {
                System.out.print(num + " ");
            }
        }
        
        public static int[] mergeSort(int[] arr) {
            if (arr.length <= 1) {
                return arr;
            }
            
            // 分割数组
            int mid = arr.length / 2;
            int[] left = Arrays.copyOfRange(arr, 0, mid);
            int[] right = Arrays.copyOfRange(arr, mid, arr.length);
            
            // 递归排序两半
            left = mergeSort(left);
            right = mergeSort(right);
            
            // 合并两个已排序的半数组
            return merge(left, right);
        }
        
        private static int[] merge(int[] left, int[] right) {
            int[] result = new int[left.length + right.length];
            int i = 0, j = 0, k = 0;
            
            // 比较两个数组的元素并合并
            while (i < left.length && j < right.length) {
                if (left[i] <= right[j]) {
                    result[k++] = left[i++];
                } else {
                    result[k++] = right[j++];
                }
            }
            
            // 添加剩余元素
            while (i < left.length) {
                result[k++] = left[i++];
            }
            
            while (j < right.length) {
                result[k++] = right[j++];
            }
            
            return result;
        }
    }
    ```

## 复杂度分析

- 时间复杂度：
  - 最坏情况：O(n log n)
  - 平均情况：O(n log n)
  - 最好情况：O(n log n)
- 空间复杂度：O(n)（需要额外的空间来存储合并结果）

## 排序示例

让我们通过一个具体的例子来理解归并排序的工作原理。假设我们有一个数组：`[5, 3, 8, 4, 2]`

### 分解阶段

首先，我们递归地将数组分解为更小的子数组：

**第一层分解**：
```
[5, 3, 8, 4, 2] → [5, 3] 和 [8, 4, 2]
```

**第二层分解**：
```
[5, 3] → [5] 和 [3]
[8, 4, 2] → [8] 和 [4, 2]
```

**第三层分解**：
```
[4, 2] → [4] 和 [2]
```

现在我们有了单个元素的子数组：`[5]`, `[3]`, `[8]`, `[4]`, `[2]`，这些都是已排序的（单个元素总是有序的）。

### 合并阶段

接下来，我们开始自底向上地合并这些子数组：

**第一次合并**：
```
[5] 和 [3] → [3, 5]
[8] 和 [4, 2] → [4, 2, 8]（需要先合并[4]和[2]）
```

合并 `[4]` 和 `[2]`：
```
比较 4 和 2：2 < 4，取 2
结果：[2]
剩余：[4]
最终结果：[2, 4]
```

然后合并 `[8]` 和 `[2, 4]`：
```
比较 8 和 2：2 < 8，取 2
结果：[2]
比较 8 和 4：4 < 8，取 4
结果：[2, 4]
剩余：[8]
最终结果：[2, 4, 8]
```

**第二次合并**：
```
[3, 5] 和 [2, 4, 8] → [2, 3, 4, 5, 8]
```

合并过程详解：
```
比较 3 和 2：2 < 3，取 2
结果：[2]
比较 3 和 4：3 < 4，取 3
结果：[2, 3]
比较 5 和 4：4 < 5，取 4
结果：[2, 3, 4]
比较 5 和 8：5 < 8，取 5
结果：[2, 3, 4, 5]
剩余：[8]
最终结果：[2, 3, 4, 5, 8]
```

### 最终结果

排序完成后，我们得到有序数组：`[2, 3, 4, 5, 8]`

这个例子展示了归并排序的关键特点：
- 分治法：将问题分解为更小的子问题
- 递归：对子问题应用相同的排序算法
- 合并：将已排序的子数组合并成一个更大的有序数组
- 稳定性：相等元素的相对顺序在排序后保持不变

## 动画演示

<div style="width:100%; height:100%; margin:20px 0;">
    <iframe src="../../../sorting/merge_sort_tree_compact.html" style="width:100%; height:100%; border:none;"></iframe>
</div>

## 练习题

1. 实现归并排序的原地（in-place）版本，减少空间复杂度
2. 分析归并排序在链表上的实现与数组实现的区别
3. 比较归并排序和快速排序的性能差异
4. 实现自底向上的非递归归并排序
