var priorityQueue;
var time = 0;
var TIME_LIMIT = 5000;
var UPDATE_RATE = 4;
var NUM_OF_PARTICLES = 200;
var PARTICLE_RADIUS = 1;
var particles;

async function setupSimulation(mycanvas) {
    time = 0;
    particles = [];
    priorityQueue = new BinaryHeap();
    
    for (let i = 0; i < NUM_OF_PARTICLES; i++) {
        let position, velocity, velocityXSign, velocityYSign;
        position = createVector(random(0, mycanvas.width), random(0, mycanvas.height));
        
        velocityXSign = Math.round(Math.random()) * 2 - 1;
        velocityYSign = Math.round(Math.random()) * 2 - 1;
        velocity = createVector(velocityXSign * random(0, 10), velocityYSign * random(0, 10));
        particles.push(new Particle(position, velocity, PARTICLE_RADIUS));
    }
    
    for (let i = 0; i < particles.length; i++) {
        predict(particles[i], mycanvas.width, mycanvas.height);
    }
    
    priorityQueue.insert(new CollisionEvent(0, null, null));   
    
    while (!priorityQueue.isEmpty()) {
        let event = priorityQueue.remove();
        
        if (!event.isValid()) continue;

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
        
}
