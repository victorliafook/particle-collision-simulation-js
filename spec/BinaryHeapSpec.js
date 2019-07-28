const BinaryHeap = require('../BinaryHeap');

describe("Binary Heap Tests", function() {
    it("Adds and removes items and doesnt violate heap order", function() {
        let binaryHeap = new BinaryHeap();
        let items = [
            {key: 3}, 
            {key: 1}, 
            {key: 10}, 
            {key: 2}, 
            {key: 15}, 
            {key: 5},
            {key: 4},
            {key: 0},
            {key: 7}, 
            {key: 16}, 
            {key: 17},
            {key: 18},
            {key: 8}
        ];
        
        for (let i = 0; i < items.length; i++) {
            binaryHeap.insert(items[i]);
        }
        
        //console.log(binaryHeap.toString());
        
        items.sort((a, b) => {
            return a.key - b.key;
        });
        
        for (let i = 0; i < items.length; i++) {
            let item = binaryHeap.remove();
            //console.log('now:', item);
            expect(item.key).toBe(items[i].key);
        }
        
        expect(binaryHeap.remove).toThrow();
    });
});