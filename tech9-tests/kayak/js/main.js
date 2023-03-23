var canvas = document.getElementById('game-surface');
var ctx = canvas.getContext('2d');

var last = 0;
var delta = 0;

var parallax = {
    lake: null
}

var loaded = 0;

const speed = 30;
var nw = 1080;
var cx = 0;

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    if (h > w) {
        nw = w;
    }

    cx = w / 2 - nw / 2;

    parallax.lake = new Image();
    parallax.lake.src = './assets/' + 'lake' + '.png';
    parallax.lake.onload = function() {
        ++loaded;
    }

    parallax.lake.pos = [];

    let adj = 2500 - h;

    for (let i = 0; i < 5; ++i) {
        parallax.lake.pos[i] = {
            x: 0,
            y: i * 500 - adj
        }
    }

    gameCycle();
}

function update() {
    // placeholder
    
    for (let i = 0; i < 5; ++i) {
        parallax.lake.pos[i].y += 0.25 * delta * 20 * speed;
    }

    for (let i = 0; i < 5; ++i) {
        if (parallax.lake.pos[i].y >= canvas.height) {
            let idx = (i + 1) % 5;
            parallax.lake.pos[i].y = parallax.lake.pos[idx].y - 500;
        }
    }
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    

    if (loaded == 1) {
        for (let i = 0; i < 5; ++i) {
            ctx.drawImage(parallax.lake, 0, i * 500, 1080, 500, cx, parallax.lake.pos[i].y, nw, 500);
        }

        update();

        // console.log(parallax.mountains.pos.x)
    }
    
    

    requestAnimationFrame(gameCycle);
}

main(document.documentElement.clientWidth, document.documentElement.clientHeight);