const canvas = document.getElementById('game-surface');
const sketchpad = document.getElementById('sketch-pad');
const ctx = canvas.getContext('2d');
const sketchpadCtx = sketchpad.getContext('2d');

var last = 0;
var delta = 0;

var G = 1;

var scaleX = 1;
var scaleY = 1;

var bodies = [];
var minDist = Infinity;

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    sketchpad.width = w;
    sketchpad.height = h;

    canvas.style.display = 'block';

    scaleX = w / 1792;
    scaleY = h / 922;

    G *= scaleX;

    init();
    
    gameCycle();
}

function init() {
    // addBody(canvas.width / 2, canvas.height / 2, 0, 0, 25, '#f00');
    // addBody(100, 100, 0.3, 0.65, 10, '#0f0');
    // addBody(500, 20, 0, 0, 15, '#00f');

    
    // addBody(100, 100, 0.3, 0.65, 10, '#0f0');
    // addBody(canvas.width / 2, canvas.height - 100, 0, 0, 25, '#f00');
    // addBody(canvas.width - 100, 100, 0, 0, 15, '#00f');


    addBody(200, 200, 0, 0, 10, '#0f0');
    addBody(canvas.width / 2, canvas.height / 2, 0, 0, 35, '#f00');
    addBody(canvas.width - 100, 100, 0, 0, 15, '#00f');
    addBody(canvas.width / 2, canvas.height - 100, 0, 0, 5, '#ff0');
    
    // let force = sub(bodies[0], bodies[1]);
    
}

function addBody(x, y, vx, vy, mass, color) {
    let body = new Body(x, y, vx, vy, mass, color);
    bodies.push(body);
}

function drawBodies() {
    for (let i = 0; i < bodies.length; ++i) {
        bodies[i].draw(ctx);
    }
}

function sub(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    }
}

function magnitude(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

function magnitudeSq(v) {
    return v.x * v.x + v.y * v.y;
}

function setMagnitude(v, mag) {
    let dist = magnitude(v);
    v.x = v.x * mag / dist;
    v.y = v.y * mag / dist;
}

function constrain(val, min, max) {
    if (val < min) val = min;
    else if (val > max) val = max;
    return val;
}

function update() {
    for (let i = 0; i < bodies.length; ++i) {
        for (let j = 0; j < bodies.length; ++j) {
            if (i != j) {
                let force = sub(bodies[i], bodies[j]);

                let dist = constrain(magnitudeSq(force), 50, 2500);
                
                let strength = bodies[i].mass * bodies[j].mass / dist * G;

                setMagnitude(force, strength);

                bodies[j].applyForce(force, delta);

                sketchpadCtx.save();
                sketchpadCtx.strokeStyle = bodies[j].color;
                sketchpadCtx.beginPath();
                sketchpadCtx.moveTo(bodies[j].x, bodies[j].y);
                bodies[j].update(5);
                sketchpadCtx.lineTo(bodies[j].x, bodies[j].y);
                sketchpadCtx.stroke();
                sketchpadCtx.restore();
            }
        }
    }

    if (bodies[1].y > canvas.height + bodies[1].r * 2) {
        bodies[1].vy -= 0.01;
    } else if (bodies[1].y < -bodies[1].r * 2) {
        bodies[1].vy += 0.01;
    }

    if (bodies[1].x < -bodies[1].r * 2) {
        bodies[1].vx += 0.01;
    } else if (bodies[1].x > canvas.width + bodies[1].r * 2) {
        bodies[1].vx -= 0.01;
    }
    
}


function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBodies();

    update();

    requestAnimationFrame(gameCycle);
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);
