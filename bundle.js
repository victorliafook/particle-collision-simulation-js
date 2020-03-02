(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
window.Particle = require('./particles');
window.BinaryHeap = require('./BinaryHeap');
},{"./BinaryHeap":1,"./particles":3}],3:[function(require,module,exports){
const INFINITY = Number.MAX_SAFE_INTEGER;

class Particle {

    constructor(position, velocity, radius) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;  

        this.mass = 1;
        this.collisions = 0;
    }

    update = (dt) => {
        this.position.add(p5.Vector.mult(this.velocity, dt));    
    };

    timeToParticle = (that) => {
        if (this == that) return INFINITY;
        var dp = p5.Vector.sub(that.position, this.position);
        var dv = p5.Vector.sub(that.velocity, this.velocity);
        var dvdr = dp.x * dv.x + dp.y * dv.y;

        if (dvdr > 0) return INFINITY;
        var dvdv = dv.x * dv.x + dv.y * dv.y;
        var drdr = dp.x * dp.x + dp.y * dp.y;
        var sigma = this.radius + that.radius;
        
        var dist = dvdr * dvdr - dvdv * (drdr - sigma * sigma);
        if (dist < 0) return INFINITY;
        return -(dvdr + Math.sqrt(dist)) / dvdv;
    }

    timeToVWall = (width) => {
        if (this.velocity.x > 0) {
            return (width - this.position.x - this.radius) / this.velocity.x;
        } else if(this.velocity.x < 0) {
            return (this.radius - this.position.x)  / this.velocity.x;
        } else {
            return INFINITY
        }
    }

    timeToHWall = (height) => {
        if (this.velocity.y > 0) {
            return (height - this.position.y - this.radius) / this.velocity.y;
        } else if(this.velocity.y < 0) {
             return (this.radius - this.position.y)  / this.velocity.y;
        } else {
            return INFINITY
        }
    }

    hitParticle = (that) => {
        var dp = p5.Vector.sub(that.position, this.position);
        var dv = p5.Vector.sub(that.velocity, this.velocity);
        var dvdr = dp.x * dv.x + dp.y * dv.y;
        var sigma = this.radius + that.radius;

        var imp = 2 * this.mass * that.mass * dvdr / ((this.mass + that.mass) * sigma);
        var imp_vector = imp/sigma * dp;

        this.velocity.add(imp_vector / this.mass);
        that.velocity.add(imp_vector / that.mass);

        this.collisions++;
        that.collisions++;
    }

    hitVWall = () => {
        this.velocity.x *= -1;
        this.collisions++;
    }

    hitHWall = () => {
        this.velocity.y *= -1;
        this.collisions++;
    }
}

module.exports = Particle;
},{}]},{},[2]);
