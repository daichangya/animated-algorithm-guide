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