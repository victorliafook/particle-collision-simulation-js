function setup() {
    createCanvas(710, 400);
    let position, velocity;
    particles = [];
    position = createVector(random(0, width), random(0, height)),
    velocity = createVector(random(0, 5), random(0, 5));
    particles.push(new Particle(position, velocity, 5));
    position = createVector(random(0, width), random(0, height)),
    velocity = createVector(random(0, 5), random(0, 5));
    particles.push(new Particle(position, velocity, 5));
    position = createVector(random(0, width), random(0, height)),
    velocity = createVector(random(0, 5), random(0, 5));
    particles.push(new Particle(position, velocity, 5));
    position = createVector(random(0, width), random(0, height)),
    velocity = createVector(random(0, 5), random(0, 5));
    particles.push(new Particle(position, velocity, 5));
}

function draw() {
    background(51);
    background(0);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].display();
    }
}