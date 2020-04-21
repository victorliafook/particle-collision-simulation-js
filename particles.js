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
        if (dvdv == 0) return INFINITY;
        
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
        var imp_vector = p5.Vector.mult(dp, imp / sigma);

        this.velocity.add(p5.Vector.div(imp_vector, this.mass));
        that.velocity.sub(p5.Vector.div(imp_vector, that.mass));

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