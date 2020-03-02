var priorityQueue = new BinaryHeap();
var time = 0;
const limit = 50000;
const rate = 4;
const numOfParticles = 10;
var particles = [];
var canvas;

async function setupSimulation(mycanvas) {
    new p5();
    
    for (let i = 0; i < numOfParticles; i++) {
        let position, velocity;
        position = createVector(random(0, mycanvas.width), random(0, mycanvas.height)),
        velocity = createVector(random(0, 8), random(0, 8));
        particles.push(new Particle(position, velocity, 5));
    }
    
    for (let i = 0; i < particles.length; i++) {
        predict(particles[i], mycanvas.width, mycanvas.height);
    }
    
    priorityQueue.insert({key: 0, a: null, b: null});   
    
    while (!priorityQueue.isEmpty()) {
        let event = priorityQueue.remove();
        
        if (!isValid(event)) continue;
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
            ctx.arc(posX, posY, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#000000";
            ctx.fill();
            ctx.closePath();
        }
    });
    
    if (time < limit)
        priorityQueue.insert({key: time + 1.0 / rate, a: null, b: null });
}

function predict(a, width, height) {
    if (a == null) return;

    // particle-particle collisions
    for (let i = 0; i < particles.length; i++) {
        let dt = a.timeToParticle(particles[i]);
        if (abs(time + dt) <= limit)
            priorityQueue.insert({key: time + dt, a: a, b: particles[i], countA: a.collisions, countB: particles[i].collisions});
    }

    // particle-wall collisions
    let dtX = a.timeToVWall(width);
    let dtY = a.timeToHWall(height);
    if (abs(time + dtX) <= limit) 
        priorityQueue.insert({key: time + dtX, a: a, b: null, countA: a.collisions});
    if (abs(time + dtY) <= limit)
        priorityQueue.insert({key: time + dtY, a: null, b: a, countB: a.collisions});
        
    //console.log(priorityQueue.toString());
}

function isValid(event) {
    if (event.a != null && event.a.collisions != event.countA) return false;
    if (event.b != null && event.b.collisions != event.countB) return false;
    return true;
}
