var canvas = document.getElementById('game-surface');
var ctx = canvas.getContext('2d');

var last = 0;
var delta = 0;

var parallax = {
    sky: null,
    mountains: null,
    plateau: null,
    ground: null,
    plant: null
}



var loaded = 0;

const speed = 5;

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    for (let k in parallax) {
        parallax[k] = new Image();
        parallax[k].src = './assets/' + k + '.png';
        parallax[k].onload = function() {
            ++loaded;
        }

        parallax[k].pos = {
            x: 0,
            y: 0,
        }
    }

    gameCycle();
}

function update() {
    // placeholder
    parallax.mountains.pos.x -= 0.25 * delta * 20 * speed;
    parallax.plateau.pos.x -= 0.5 * delta * 25 * speed;
    parallax.ground.pos.x -= 1 * delta * 35 * speed;
    parallax.plant.pos.x -= 1.25 * delta * 40 * speed;

    for (let k in parallax) {
        if (parallax[k].pos.x <= -canvas.width) {
            parallax[k].pos.x = 0;
        }
    }
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    

    if (loaded == 5) {
        ctx.drawImage(parallax.sky, 0, 0, 1920, 1080, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(parallax.mountains, 0, 0, 1920, 751, parallax.mountains.pos.x, canvas.height - 751, canvas.width, 751);
        ctx.drawImage(parallax.mountains, 0, 0, 1920, 751, parallax.mountains.pos.x + canvas.width - 1, canvas.height - 751, canvas.width, 751);
        
        ctx.drawImage(parallax.plateau, 0, 0, 1920, 751, parallax.plateau.pos.x, canvas.height - 751, canvas.width, 751);
        ctx.drawImage(parallax.plateau, 0, 0, 1920, 751, parallax.plateau.pos.x + canvas.width, canvas.height - 751, canvas.width, 751);

        ctx.drawImage(parallax.ground, 0, 0, 1920, 198, parallax.ground.pos.x, canvas.height - 198, canvas.width, 198);
        ctx.drawImage(parallax.ground, 0, 0, 1920, 198, parallax.ground.pos.x + canvas.width, canvas.height - 198, canvas.width, 198);

        ctx.drawImage(parallax.plant, 0, 0, 1689, 198, parallax.plant.pos.x, canvas.height - 216, canvas.width, 216); // 1689, 216
        ctx.drawImage(parallax.plant, 0, 0, 1689, 198, parallax.plant.pos.x + canvas.width, canvas.height - 216, canvas.width, 216); // 1689, 216

        update();

        // console.log(parallax.mountains.pos.x)
    }
    
    

    requestAnimationFrame(gameCycle);
}

main(document.documentElement.clientWidth, document.documentElement.clientHeight);