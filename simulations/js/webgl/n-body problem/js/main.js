const canvas = document.getElementById('game-surface');
const gl = canvas.getContext("webgl");

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
    // Only continue if WebGL is available and working
    if (gl === null) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
        );
        return;
    }
}

function update() {
    
}


function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    update();

    requestAnimationFrame(gameCycle);
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);
