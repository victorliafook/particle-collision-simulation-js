
var priorityQueue = new BinaryHeap();
var time;
var limit = 5000;
var particles = [];
var rate = 0.5;

function setup() {
    createCanvas(800, 600);

    let position, velocity;
    
    time = 0.0;
    for (let i = 0; i <= 5; i++) {
        position = createVector(random(0, width), random(0, height)),
        velocity = createVector(random(0, 8), random(0, 8));
        particles.push(new Particle(position, velocity, 5));
    }
    noLoop();
    
}

function draw() {
    for (let i = 0; i < particles.length; i++) {
        predict(particles[i]);
    }
    priorityQueue.insert({key: 0, a: null, b: null});   
    
    while (!priorityQueue.isEmpty()) {
        let event = priorityQueue.remove();
        console.log(event);
        if (!isValid(event)) continue;
        let a = event.a;
        let b = event.b;

        // physical collision, so update positions, and then simulation clock
        for (let i = 0; i < particles.length; i++)
            particles[i].update(event.time - time);
        time = event.key;

        // process event
        if      (a != null && b != null) a.hitParticle(b);              // particle-particle collision
        else if (a != null && b == null) a.hitVWall();   // particle-wall collision
        else if (a == null && b != null) b.hitHWall(); // particle-wall collision
        else if (a == null && b == null) doReDraw();               // redraw event

        // update the priority queue with new collisions involving a or b
        predict(a);
        predict(b);
    }
}

function doReDraw() {
    
    //background(51);
    background(0);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].display();
    }
    console.log('time', time);
    priorityQueue.insert({key: time + 1.0 / rate, a: null, b: null });
}

function predict(a) {
    if (a == null) return;

    // particle-particle collisions
    for (let i = 0; i < particles.length; i++) {
        let dt = a.timeToParticle(particles[i]);
        if (abs(time + dt) <= limit)
            priorityQueue.insert({key: time + dt, a: a, b: particles[i], countA: a.collisions, countB: particles[i].collisions});
    }

    // particle-wall collisions
    let dtX = a.timeToVWall();
    let dtY = a.timeToHWall();
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
