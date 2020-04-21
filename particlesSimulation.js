var priorityQueue = new BinaryHeap();
var time = 0;
const TIME_LIMIT = 5000;
const UPDATE_RATE = 4;
const NUM_OF_PARTICLES = 10;
const PARTICLE_RADIUS = 10;
var particles = [];
var canvas;

async function setupSimulation(mycanvas) {
    new p5();
    
    for (let i = 0; i < NUM_OF_PARTICLES; i++) {
        let position, velocity;
        position = createVector(random(0, mycanvas.width), random(0, mycanvas.height)),
        velocity = createVector(random(0, 8), random(0, 8));
        particles.push(new Particle(position, velocity, PARTICLE_RADIUS));
    }
    
    for (let i = 0; i < particles.length; i++) {
        predict(particles[i], mycanvas.width, mycanvas.height);
    }
    
    priorityQueue.insert(new CollisionEvent(0, null, null));   
    
    while (!priorityQueue.isEmpty()) {
        let event = priorityQueue.remove();
        
        if (!event.isValid()) continue;
        //console.log(particles[0].position);
        let a = event.a;
        let b = event.b;

        // physical collision, so update positions, and then simulation clock
        for (let i = 0; i < particles.length; i++) {
            particles[i].update(event.key - time);
        }
        
        time = event.key;

        // process event
        if (a != null && b != null) { 
            // particle-particle collision
            a.hitParticle(b); 
        } else if (a != null && b == null) {
            // particle-wall collision
            a.hitVWall();   
        } else if (a == null && b != null) {
            // particle-wall collision
            b.hitHWall(); 
        } else if (a == null && b == null) {
            // redraw event
            doDraw(mycanvas); 
        }

        // update the priority queue with new collisions involving a or b
        predict(a, mycanvas.width, mycanvas.height);
        predict(b, mycanvas.width, mycanvas.height);
        
        await sleep(20);
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function doDraw(canvas) {
    requestAnimationFrame(function() {
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
            var posX = particles[i].position.x;
            var posY = particles[i].position.y;
            ctx.beginPath();
            ctx.arc(posX, posY, PARTICLE_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = "#000000";
            ctx.fill();
            ctx.closePath();
        }
    });
    
    if (time < TIME_LIMIT)
        priorityQueue.insert(new CollisionEvent(time + 1.0 / UPDATE_RATE, null, null));
}

function predict(a, width, height) {
    if (a == null) return;

    // particle-particle collisions
    for (let i = 0; i < particles.length; i++) {
        let dt = a.timeToParticle(particles[i]);
        if ((time + dt) <= TIME_LIMIT)
            priorityQueue.insert(new CollisionEvent(time + dt, a, particles[i]));
    }

    // particle-wall collisions
    let dtX = a.timeToVWall(width);
    let dtY = a.timeToHWall(height);
    if ((time + dtX) <= TIME_LIMIT) 
        priorityQueue.insert(new CollisionEvent(time + dtX, a, null));
    if ((time + dtY) <= TIME_LIMIT)
        priorityQueue.insert(new CollisionEvent(time + dtY, null, a));
        
    //console.log(priorityQueue.toString());
}
