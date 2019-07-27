class BinaryHeap {
    constructor() {
        this.heap = [];
        this.heap.push({});
    }

    size = () => {
        return this.heap.length - 1;
    };

    swim = (index) => {
        let parentIndex = this.getParent(index);
        while (index > 1 && this.less(index, parentIndex)) {
            this.exchange(index, parentIndex);
            index = parentIndex;
            parentIndex = this.getParent(index);
        }
    };

    sink = (index) => {

    };

    insert = (item) => {
        this.heap.push(item);
        this.swim(this.size());
    };

    exchange = (i, j) => {
        let temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    };

    less = (i, j) => {
        return this.heap[j].key > this.heap[i].key;
    };

    getParent = (index) => {
        return Math.floor(index/2);
    };
}