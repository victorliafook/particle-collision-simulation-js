const INFINITY = Number.MAX_SAFE_INTEGER;

class CollisionEvent {

    constructor(time, a, b) {
        this.key = time;
        this.a = a;
        this.b = b;
        if (a != null) {
            this.countA = a.collisions;
        } else {
            this.countA = -1;
        }
        
        if (b != null) {
            this.countB = b.collisions;
        } else {           
            this.countB = -1;
        }
    }
    
    isValid = () => {
        if (this.a != null && this.a.collisions != this.countA) return false;
        if (this.b != null && this.b.collisions != this.countB) return false;
        
        return true;
    }

}

module.exports = CollisionEvent;