# **快速排序算法**

## 算法简介

快速排序是一种高效的排序算法，采用分治法策略。它通过选择一个"基准"元素，将数组分为两个子数组：小于基准的元素和大于基准的元素，然后递归地对子数组进行排序。


## 算法步骤

1. 从数列中挑出一个元素，称为"基准"(pivot)
2. 重新排序数列，所有比基准值小的元素放在基准前面，所有比基准值大的元素放在基准后面
3. 递归地对小于基准值的子数列和大于基准值的子数列进行排序

## 代码实现

=== "Python"
    ```python
    def quick_sort_inplace(arr, low, high):
        if low < high:
            # 分区操作，返回基准值的最终位置
            pivot_pos = partition(arr, low, high)
            
            # 递归排序左右子数组
            quick_sort_inplace(arr, low, pivot_pos - 1)
            quick_sort_inplace(arr, pivot_pos + 1, high)
    
    def partition(arr, low, high):
        # 选择最后一个元素作为基准值
        pivot = arr[high]
        i = low - 1  # 小于基准值的元素边界
        
        for j in range(low, high):
            if arr[j] <= pivot:
                i += 1
                # 交换arr[i]和arr[j]
                arr[i], arr[j] = arr[j], arr[i]
        
        # 将基准值放到正确的位置
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        return i + 1
    
    # 测试
    arr = [5, 3, 8, 4, 2]
    quick_sort_inplace(arr, 0, len(arr) - 1)
    print("排序后的数组:", arr)
    ```

=== "Java"
    ```java
    public class QuickSort {
        public static void main(String[] args) {
            int[] arr = {5, 3, 8, 4, 2};
            quickSort(arr, 0, arr.length - 1);
            System.out.println("排序后的数组:");
            for (int num : arr) {
                System.out.print(num + " ");
            }
        }
        
        public static void quickSort(int[] arr, int low, int high) {
            if (low < high) {
                int pivot = partition(arr, low, high);
                quickSort(arr, low, pivot - 1);
                quickSort(arr, pivot + 1, high);
            }
        }
        
        public static int partition(int[] arr, int low, int high) {
            int pivot = arr[high];
            int i = low - 1;
            for (int j = low; j < high; j++) {
                if (arr[j] <= pivot) {
                    i++;
                    // 交换元素
                    int temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
            // 将基准值放到正确位置
            int temp = arr[i + 1];
            arr[i + 1] = arr[high];
            arr[high] = temp;
            return i + 1;
        }
    }
    ```

## 复杂度分析

- 时间复杂度：
  - 最优情况：O(n log n)
  - 平均情况：O(n log n)
  - 最坏情况：O(n²)（当数组已经排序或所有元素相等时）
- 空间复杂度：O(log n)（递归调用栈）

## 排序示例

让我们通过一个具体的例子来理解快速排序的工作原理。假设我们有一个数组：`[5, 3, 8, 4, 2]`

### 第一次分区（根节点）

1. 选择最后一个元素 2 作为基准值（pivot）
2. 初始化指针 i = -1
3. 遍历数组，将小于等于基准值的元素移到左边：
   ```
   初始：[5, 3, 8, 4, 2]  (pivot = 2)
   ```
   - 比较 5 与 2：5 > 2，不交换
   - 比较 3 与 2：3 > 2，不交换
   - 比较 8 与 2：8 > 2，不交换
   - 比较 4 与 2：4 > 2，不交换
   
4. 最后将基准值放到正确位置：
   ```
   结果：[2, 5, 3, 8, 4]
   ```

现在基准值 2 在正确的位置（索引0），左边没有元素，右边都是大于 2 的元素。

### 右子数组的分区

对右子数组 `[5, 3, 8, 4]` 进行分区：

1. 选择 4 作为基准值
2. 分区过程：
   ```
   初始：[5, 3, 8, 4]  (pivot = 4)
   比较 5 与 4：5 > 4，不交换
   比较 3 与 4：3 < 4，交换 → [3, 5, 8, 4]
   比较 8 与 4：8 > 4，不交换
   ```
3. 将基准值放到正确位置：
   ```
   结果：[3, 4, 5, 8]
   ```

现在基准值 4 在正确的位置（索引1），左边是小于 4 的元素，右边是大于 4 的元素。

### 进一步递归分区

1. 对 `[3]` 进行分区：只有一个元素，已经排序
2. 对 `[5, 8]` 进行分区：
   ```
   初始：[5, 8]  (pivot = 8)
   比较 5 与 8：5 < 8，交换 → [5, 8]
   ```
   结果：`[5, 8]` （已排序）

### 最终结果

所有分区完成后，数组变为有序：`[2, 3, 4, 5, 8]`

这个例子展示了快速排序的关键特点：
- 通过选择基准值将数组分成两部分
- 递归地对子数组进行排序
- 每次分区操作都会将基准值放到其最终位置
- 与冒泡排序相比，快速排序通过分治法减少了比较次数

## 动画演示（树形）

<div style="width:100%; height:100%; margin:20px 0;">
    <iframe src="../quick_sort_tree_compact.html" style="width:100%; height:100%; border:none;"></iframe>
</div>


## 动画演示

<div style="width:100%; height:100%; margin:20px 0;">
    <iframe src="../quick_sort.html" style="width:100%; height:100%; border:none;"></iframe>
</div>