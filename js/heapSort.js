function heapSort(arr) {
    function maxHeapify(arr, index, heapSize) {
        let iMax
        let iLeft;
        let iRight;
        while(true) {
            iMax = index;
            iLeft = 2 * index + 1; // 下标
            iRight = 2 * (index + 1); // 下标
            if(iLeft < heapSize && arr[iLeft] > arr[index]) { // 对比的是值
                iMax = iLeft;
            }
            if(iRight < heapSize && arr[iRight] > arr[iMax]) {
                iMax = iRight;
            }
            if(iMax != index) {
                swap(arr, iMax, index);
                index = iMax;
            } else {
                break;
            }
        }
    }
    function swap(arr, i, j) {
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    function buildMaxHeap(arr) {
        let iParent = Math.floor((arr.length - 1) / 2); // 从最后一个非叶子结点开始自下而上 自左往右遍历
        for(let i = iParent; i >= 0; i--) {
            maxHeapify(arr, i, arr.length);
        }
    }
    function sort(arr) {
        buildMaxHeap(arr);
        let len = arr.length;
        for(let i = len -1; i > 0; i--) {
            swap(arr, 0, i);
            maxHeapify(arr, 0, i);
        }
        return arr;
    }
    return sort(arr); // return sort(arr);
}