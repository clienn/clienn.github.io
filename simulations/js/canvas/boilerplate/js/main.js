const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');

var last = 0;
var delta = 0;

var G = 1;

var scaleX = 1;
var scaleY = 1;

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    canvas.style.display = 'block';

    scaleX = w / 1792;
    scaleY = h / 922;

    G *= scaleX;

    init();
    
    gameCycle();
}

function init() {
    
}

function update() {
    
}


function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    update();

    requestAnimationFrame(gameCycle);
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);
