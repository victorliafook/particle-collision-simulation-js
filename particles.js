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
        if (this.position.x >= width || this.position.x <= 0) {
            this.hitVWall();
        }

        if (this.position.y >= height || this.position.y <= 0) {
            this.hitHWall();
        }

        this.position.add(this.velocity);    
    };

    display = () => {
        stroke(200);
        strokeWeight(2);
        fill(127);
        ellipse(this.position.x, this.position.y, this.radius, this.radius);
    }

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

    timeToVWall = () => {
        if (this.velocity.x > 0) {
            return (1 - this.position.x - this.radius) / this.velocity.x;
        } else if(this.velocity.x < 0) {
            return (this.radius - this.position.x)  / this.velocity.x;
        } else {
            return INFINITY
        }
    }

    timeToHWall = () => {
        if (this.velocity.y > 0) {
            return (1 - this.position.y - this.radius) / this.velocity.y;
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
    }

    hitHWall = () => {
        this.velocity.y *= -1;
    }
}