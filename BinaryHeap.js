class BinaryHeap {
    constructor() {
        this.heap = [];
        this.heap.push({});
    }

    size = () => {
        return this.heap.length - 1;
    };
    
    isEmpty = () => {
        return this.size() === 0;
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
        let bestChild = this.getBestChild(index);
        
        while (bestChild <= this.size() && this.less(bestChild, index)) {
            this.exchange(index, bestChild);
            index = bestChild;
            bestChild = this.getBestChild(index);
        }
    };

    insert = (item) => {
        this.heap.push(item);
        this.swim(this.size());
    };

    remove = () => {
        if (this.isEmpty())
            throw new Error();
        this.exchange(1, this.size());
        let returnVal = this.heap.pop();
        this.sink(1);
        return returnVal;
    };

    exchange = (i, j) => {
        let temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    };

    less = (i, j) => {
        return this.heap[i].key < this.heap[j].key;
    };

    getParent = (index) => {
        return Math.floor(index/2);
    };

    getLeftChild = (index) => {
        return 2 * index;
    }

    getBestChild = (index) => {
        let leftChild = this.getLeftChild(index);
        if (leftChild + 1 > this.size() || this.less(leftChild, leftChild + 1)) {
            return leftChild;
        }
        return leftChild + 1;
    }

    toString = () => {
        let keys = [];
        for (let i = 1; i <= this.size(); i++) {
            keys.push(this.heap[i].key);
        }
        return keys.join(',');
    }
}

module.exports = BinaryHeap;