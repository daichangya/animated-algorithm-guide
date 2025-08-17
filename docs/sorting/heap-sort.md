---
title: Heap Sort Algorithm | Principles and Animation Demo
description: Detailed explanation of the heap sort algorithm's principles, binary heap construction process and implementation methods, including interactive animation demo and Python, Java code implementations, with complexity analysis
keywords: heap sort, binary heap, sorting algorithm, algorithm visualization, interactive animation, algorithm tutorial, time complexity, space complexity
---

# **Heap Sort Algorithm**

## Algorithm Introduction

Heap sort is a comparison-based sorting algorithm based on the binary heap data structure. It sorts by building a max heap (where parent nodes are greater than child nodes) and utilizing heap properties to obtain a sorted sequence. The main advantage of heap sort is that it sorts in-place, requiring no additional storage space.

## Algorithm Steps

1. Build a max heap: Rearrange the array into a max heap (starting from the last non-leaf node, perform sift-down operations sequentially)
2. Swap the heap's root element (maximum value) with the last element of the heap
3. Reduce the heap size by 1 and perform sift-down on the new root to maintain max heap properties
4. Repeat steps 2 and 3 until the heap size becomes 1

## Code Implementation

=== "Python"
    ```python
    def heapify(arr, n, i):
        largest = i  # Initialize largest as root
        left = 2 * i + 1  # Left child
        right = 2 * i + 2  # Right child
    
        # If left child is larger than root
        if left < n and arr[left] > arr[largest]:
            largest = left
    
        # If right child is larger than current largest
        if right < n and arr[right] > arr[largest]:
            largest = right
    
        # If largest is not root
        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]  # Swap
            # Recursively heapify the affected subtree
            heapify(arr, n, largest)
    
    def heap_sort(arr):
        n = len(arr)
    
        # Build a max heap
        for i in range(n // 2 - 1, -1, -1):
            heapify(arr, n, i)
    
        # Extract elements one by one
        for i in range(n - 1, 0, -1):
            arr[0], arr[i] = arr[i], arr[0]  # Swap
            heapify(arr, i, 0)
        
        return arr
    
    # Test
    arr = [5, 3, 8, 4, 2]
    sorted_arr = heap_sort(arr)
    print("Sorted array:", sorted_arr)
    ```

=== "Java"
    ```java
    public class HeapSort {
        public static void main(String[] args) {
            int[] arr = {5, 3, 8, 4, 2};
            heapSort(arr);
            System.out.println("Sorted array:");
            for (int num : arr) {
                System.out.print(num + " ");
            }
        }
        
        public static void heapSort(int[] arr) {
            int n = arr.length;
    
            // Build max heap
            for (int i = n / 2 - 1; i >= 0; i--)
                heapify(arr, n, i);
    
            // Extract elements one by one
            for (int i = n - 1; i > 0; i--) {
                // Move current root to end
                int temp = arr[0];
                arr[0] = arr[i];
                arr[i] = temp;
    
                // Heapify the reduced heap
                heapify(arr, i, 0);
            }
        }
    
        private static void heapify(int[] arr, int n, int i) {
            int largest = i;  // Initialize largest as root
            int left = 2 * i + 1;  // Left child
            int right = 2 * i + 2;  // Right child
    
            // If left child is larger than root
            if (left < n && arr[left] > arr[largest])
                largest = left;
    
            // If right child is larger than current largest
            if (right < n && arr[right] > arr[largest])
                largest = right;
    
            // If largest is not root
            if (largest != i) {
                int swap = arr[i];
                arr[i] = arr[largest];
                arr[largest] = swap;
    
                // Recursively heapify the affected subtree
                heapify(arr, n, largest);
            }
        }
    }
    ```

## Complexity Analysis

- Time complexity:
  - Worst case: O(n log n)
  - Average case: O(n log n)
  - Best case: O(n log n)
- Space complexity: O(1) (in-place sorting)

## Sorting Example

Let's understand heap sort with a concrete example. Suppose we have an array: `[5, 3, 8, 4, 2]`

### Building Max Heap

First, we need to rearrange the array into a max heap. Visualizing the array as a complete binary tree:
```
     5
   /   \
  3     8
 / \
4   2
```

1. Start heapifying from the last non-leaf node (index 1, value 3):
   ```
   Compare 3 with its children 4 and 2
   3 is less than 4, so swap them
        5
      /   \
     4     8
    / \
   3   2
   ```

2. Process the root node (index 0, value 5):
   ```
   Compare 5 with its children 4 and 8
   5 is less than 8, so swap them
        8
      /   \
     4     5
    / \
   3   2
   ```

Now we have a valid max heap.

### Sorting Process

1. First step:
   - Swap root (8) with last element (2)
   - Remove 8 from heap and heapify remaining elements
   ```
   After swap: [2, 4, 5, 3, 8]
   After heapify: [5, 4, 2, 3, 8]
   ```

2. Second step:
   - Swap root (5) with last element (3)
   - Remove 5 from heap and heapify remaining elements
   ```
   After swap: [3, 4, 2, 5, 8]
   After heapify: [4, 3, 2, 5, 8]
   ```

3. Third step:
   - Swap root (4) with last element (2)
   - Remove 4 from heap and heapify remaining elements
   ```
   After swap: [2, 3, 4, 5, 8]
   After heapify: [3, 2, 4, 5, 8]
   ```

4. Final step:
   - Swap root (3) with last element (2)
   ```
   Final result: [2, 3, 4, 5, 8]
   ```

Sorting complete! The final sorted array is: `[2, 3, 4, 5, 8]`

This example demonstrates the two main phases of heap sort:
1. Building the max heap
2. Extracting elements from the heap while maintaining heap properties

## Animation Demo

<div style="width:100%; height:100%; margin:20px 0;">
    <iframe src="../heap_sort.html" style="width:100%; height:100%; border:none;"></iframe>
</div>

## Exercises

1. Implement a heap sort that uses a min heap instead of a max heap
2. Analyze heap sort performance on partially sorted arrays
3. Compare performance differences between heap sort and quick sort on different datasets
4. Implement a heap sort that can support both ascending and descending order
