---
title: Quick Sort Algorithm | Principles and Animation Demo
description: Detailed explanation of the quick sort algorithm's principles, implementation and optimization, including interactive animation demo and Python, Java code implementations, with complexity analysis
keywords: quick sort, sorting algorithm, algorithm visualization, interactive animation, algorithm tutorial, time complexity, space complexity, divide and conquer
---

# **Quick Sort Algorithm**

## Algorithm Introduction

Quick sort is an efficient sorting algorithm that uses a divide-and-conquer strategy. It selects a "pivot" element and partitions the array into two subarrays: elements less than the pivot and elements greater than the pivot, then recursively sorts the subarrays.

## Algorithm Steps

1. Select an element from the array as the "pivot"
2. Reorder the array so that all elements with values less than the pivot come before it, while all elements with values greater than the pivot come after it
3. Recursively apply the above steps to the subarrays of elements with smaller and larger values

## Code Implementation

=== "Python"
    ```python
    def quick_sort_inplace(arr, low, high):
        if low < high:
            # Partition operation, returns the final position of the pivot
            pivot_pos = partition(arr, low, high)
            
            # Recursively sort left and right subarrays
            quick_sort_inplace(arr, low, pivot_pos - 1)
            quick_sort_inplace(arr, pivot_pos + 1, high)
    
    def partition(arr, low, high):
        # Select last element as pivot
        pivot = arr[high]
        i = low - 1  # Boundary for elements less than pivot
        
        for j in range(low, high):
            if arr[j] <= pivot:
                i += 1
                # Swap arr[i] and arr[j]
                arr[i], arr[j] = arr[j], arr[i]
        
        # Place pivot in correct position
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        return i + 1
    
    # Test
    arr = [5, 3, 8, 4, 2]
    quick_sort_inplace(arr, 0, len(arr) - 1)
    print("Sorted array:", arr)
    ```

=== "Java"
    ```java
    public class QuickSort {
        public static void main(String[] args) {
            int[] arr = {5, 3, 8, 4, 2};
            quickSort(arr, 0, arr.length - 1);
            System.out.println("Sorted array:");
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
                    // Swap elements
                    int temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
            // Place pivot in correct position
            int temp = arr[i + 1];
            arr[i + 1] = arr[high];
            arr[high] = temp;
            return i + 1;
        }
    }
    ```

## Complexity Analysis

- Time Complexity:
  - Best case: O(n log n)
  - Average case: O(n log n)
  - Worst case: O(n²) (when array is already sorted or all elements are equal)
- Space Complexity: O(log n) (recursion call stack)

## Sorting Example

Let's understand how quick sort works with a concrete example. Suppose we have an array: `[5, 3, 8, 4, 2]`

### First Partition (Root Node)

1. Select last element 2 as pivot
2. Initialize pointer i = -1
3. Traverse array, moving elements ≤ pivot to the left:
   ```
   Initial: [5, 3, 8, 4, 2]  (pivot = 2)
   ```
   - Compare 5 with 2: 5 > 2, no swap
   - Compare 3 with 2: 3 > 2, no swap
   - Compare 8 with 2: 8 > 2, no swap
   - Compare 4 with 2: 4 > 2, no swap
   
4. Finally place pivot in correct position:
   ```
   Result: [2, 5, 3, 8, 4]
   ```

Now pivot 2 is in correct position (index 0), left side has no elements, right side has elements > 2.

### Right Subarray Partition

Partition right subarray `[5, 3, 8, 4]`:

1. Select 4 as pivot
2. Partition process:
   ```
   Initial: [5, 3, 8, 4]  (pivot = 4)
   Compare 5 with 4: 5 > 4, no swap
   Compare 3 with 4: 3 < 4, swap → [3, 5, 8, 4]
   Compare 8 with 4: 8 > 4, no swap
   ```
3. Place pivot in correct position:
   ```
   Result: [3, 4, 5, 8]
   ```

Now pivot 4 is in correct position (index 1), left side has elements < 4, right side has elements > 4.

### Further Recursive Partitioning

1. Partition `[3]`: Single element, already sorted
2. Partition `[5, 8]`:
   ```
   Initial: [5, 8]  (pivot = 8)
   Compare 5 with 8: 5 < 8, swap → [5, 8]
   ```
   Result: `[5, 8]` (already sorted)

### Final Result

After all partitions, array becomes sorted: `[2, 3, 4, 5, 8]`

This example demonstrates key characteristics of quick sort:
- Partitioning array into two parts using a pivot
- Recursively sorting subarrays
- Each partition places pivot in its final position
- Compared to bubble sort, quick sort reduces comparisons through divide-and-conquer

## Tree Visualization

<div style="width:100%; height:100%; margin:20px 0;">
    <iframe src="../quick_sort_tree_compact.html" style="width:100%; height:100%; border:none;"></iframe>
</div>

## Animation Demo

<div style="width:100%; height:100%; margin:20px 0; position:relative;" class="algorithm-container">
    <iframe id="quick-sort-iframe" src="../quick_sort.html" style="width:100%; height:100%; border:none;"></iframe>
    <button onclick="toggleFullScreen('quick-sort-iframe')" class="fullscreen-btn" style="position:absolute; top:10px; right:10px; background-color:rgba(0,0,0,0.5); color:white; border:none; border-radius:4px; padding:5px 10px; cursor:pointer; z-index:100;">
        <span>⛶</span> Fullscreen
    </button>
</div>

<script>
// Execute after page load
window.addEventListener('load', function() {
    // Ensure fullscreen functionality is available on all pages
    if (typeof window.toggleFullScreen !== 'function') {
        window.toggleFullScreen = function(iframeId) {
            const iframe = document.getElementById(iframeId);
            
            if (!iframe) {
                console.error('Cannot find iframe element with ID ' + iframeId);
                return;
            }
            
            // Try to open a new window showing the iframe content
            const url = iframe.src;
            const newWindow = window.open(url, '_blank', 'width=800,height=600');
            
            if (!newWindow) {
                alert('Popup was blocked. Please allow popups for this site, or try using browser fullscreen (F11).');
            }
        };
    }
});
</script>

## Exercises

1. Implement quick sort with different pivot selection strategies (first element, middle element, random element)
2. Analyze quick sort's performance on nearly sorted lists
3. Compare quick sort's performance with merge sort and heap sort
4. Implement quick sort with tail recursion optimization
