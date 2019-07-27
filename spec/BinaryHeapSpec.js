const BinaryHeap = require('../BinaryHeap');

describe("Binary Heap Tests", function() {
    it("Adds and removes items and stays in order", function() {
        let binaryHeap = new BinaryHeap();
        let items = [
            {key: 3}, 
            {key: 1}, 
            {key: 10}, 
            {key: 2}, 
            {key: 15}, 
            {key: 5},
            {key: 4},
            {key: 0}
        ];
        
        for (let i = 0; i < items.length; i++) {
            binaryHeap.insert(items[i]);
        }
        
        items.sort((a, b) => {
            return a.key - b.key;
        });
        
        for (let i = 0; i < items.length; i++) {
            let item = binaryHeap.remove();
            expect(item.key).toBe(items[i].key);
        }
    });
});