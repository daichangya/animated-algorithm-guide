---
title: Bubble Sort Algorithm | Principles and Animation Demo
description: Detailed explanation of the bubble sort algorithm's principles, implementation and optimization, including interactive animation demo and Python, Java code implementations, with complexity analysis
keywords: bubble sort, sorting algorithm, algorithm visualization, interactive animation, algorithm tutorial, time complexity, space complexity
---

# **Bubble Sort Algorithm**

## Algorithm Introduction

Bubble sort is a simple sorting algorithm that repeatedly steps through the list to be sorted, compares adjacent elements and swaps them if they are in the wrong order, until the list is sorted.

## Algorithm Steps

1. Start from the first element of the list, compare adjacent elements
2. If the previous element is greater than the next element, swap their positions
3. Repeat the above steps for each pair of adjacent elements in the list
4. Repeat the process until the list is fully sorted

## Code Implementation

=== "Python"
    ```python
    def bubble_sort(arr):
        n = len(arr)
        for i in range(n):
            # Flag to check if any swapping happened
            swapped = False
            for j in range(0, n-i-1):
                # If current element is greater than next element, swap
                if arr[j] > arr[j+1]:
                    arr[j], arr[j+1] = arr[j+1], arr[j]
                    swapped = True
            # If no swapping happened, array is already sorted
            if not swapped:
                break
        return arr
    
    # Test
    arr = [5, 3, 8, 4, 2]
    sorted_arr = bubble_sort(arr)
    print("Sorted array:", sorted_arr)
    ```

=== "Java"
    ```java
    public class BubbleSort {
        public static void main(String[] args) {
            int[] arr = {5, 3, 8, 4, 2};
            bubbleSort(arr);
            System.out.println("Sorted array:");
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
                        // Swap elements
                        int temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                        swapped = true;
                    }
                }
                // If no swapping happened, array is already sorted
                if (!swapped) break;
            }
        }
    }
    ```

## Complexity Analysis

- Time Complexity:
  - Worst case: O(n²)
  - Average case: O(n²)
  - Best case: O(n) (when the list is already sorted)
- Space Complexity: O(1) (in-place sorting)

## Sorting Example

Let's understand how bubble sort works with a concrete example. Suppose we have an array: `[5, 3, 8, 4, 2]`

### First Pass

1. Compare 5 and 3: 5 > 3, swap → `[3, 5, 8, 4, 2]`
2. Compare 5 and 8: 5 < 8, no swap → `[3, 5, 8, 4, 2]`
3. Compare 8 and 4: 8 > 4, swap → `[3, 5, 4, 8, 2]`
4. Compare 8 and 2: 8 > 2, swap → `[3, 5, 4, 2, 8]`

After first pass, the largest element 8 has "bubbled up" to the end of the array.

### Second Pass

1. Compare 3 and 5: 3 < 5, no swap → `[3, 5, 4, 2, 8]`
2. Compare 5 and 4: 5 > 4, swap → `[3, 4, 5, 2, 8]`
3. Compare 5 and 2: 5 > 2, swap → `[3, 4, 2, 5, 8]`

After second pass, the second largest element 5 has "bubbled up" to its correct position.

### Third Pass

1. Compare 3 and 4: 3 < 4, no swap → `[3, 4, 2, 5, 8]`
2. Compare 4 and 2: 4 > 2, swap → `[3, 2, 4, 5, 8]`

### Fourth Pass

1. Compare 3 and 2: 3 > 2, swap → `[2, 3, 4, 5, 8]`

Sorting complete! The final sorted array is: `[2, 3, 4, 5, 8]`

This example demonstrates the core characteristic of bubble sort: after each pass, the largest unsorted element "bubbles up" to its correct position at the end of the unsorted portion.

## Animation Demo

<div style="width:100%; height:100%; margin:20px 0; position:relative;" class="algorithm-container">
    <iframe id="bubble-sort-iframe" src="../bubble_sort.html" style="width:100%; height:100%; border:none;"></iframe>
    <button onclick="toggleFullScreen('bubble-sort-iframe')" class="fullscreen-btn" style="position:absolute; top:10px; right:10px; background-color:rgba(0,0,0,0.5); color:white; border:none; border-radius:4px; padding:5px 10px; cursor:pointer; z-index:100;">
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

1. Implement an optimized version of bubble sort that terminates early if no swaps occur in a pass
2. Analyze bubble sort's performance on nearly sorted lists
3. Compare the advantages and disadvantages of bubble sort with other simple sorting algorithms
