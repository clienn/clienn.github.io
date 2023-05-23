const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');

var instrucions = document.getElementById("game-instructions");
var btnStart = document.getElementById("btnStart");

var last = 0;
var delta = 0;
var startGame = false;

var assets = {
    count: 0,
    loaded: 0,
    load: (obj, fn) => {
        obj.img = new Image();
        obj.img.src = 'assets/' + fn + '.png';
        obj.img.onload = function() {
            ++assets.loaded;
        }

        assets.count++;
    }
};

var images = {
    bg: {
        src: 'bg',
        obj: {},
    },
}

var scaleX = 1, scaleY = 1;
var radius = 25;
var gridW = 90;
var gridH = 90;
var gridDim = 4;

let totalW = 0;
let totalH = 0;
let pl = 0;
let pt = 0;

const colors = ['#10aad7', '#b3d23b', '#10aad7', '#f9a139'];

const letters = [];
var alphabets = [];
var gridpos = [];
var grid = [];
var currentLetter = 0;
var fontsize = 60;
var letterAdjX = 20;
var letterAdjY = 15;

var score = 0;
var mistakes = 0;

var isMobile = false;
var timer = null;

var timerRadius = 120;
var timerY = 200;
var timerFontSize = 70;
var timerAdjX = [30, 40];

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    canvas.style.display = 'block';
    instrucions.style.display = 'none';

    if (!isPortrait()) {
        scaleX = w / 1792;
        scaleY = h / 922;
    } else {
        scaleX = w / 390;
        scaleY = h / 844;
        // fontsize = 30;
        
    }

    gridW *= scaleY;
    gridH *= scaleY;
    radius *= scaleY;
    isMobile = detectMob();

    if (!isMobile) {
        fontsize = 30;
        letterAdjX = 10;
        letterAdjY= 7.5;
        timerRadius = 70;
        timerY = 120;
        timerFontSize = 40;
        timerAdjX = [8, 22];
    }


    totalW = gridDim * gridW;
    totalH = gridDim * gridH;

    pl = w / 2 - totalW / 2;
    pt = h / 2 - totalH / 2;

    // load assets into useable images
    // loadAssets() 
    timer = new Timer(w / 2, timerY, timerRadius, '#fb2121');
    timer.fontSize = timerFontSize;
    timer.adjX = timerAdjX;

    
    let isTouched = false;

    canvas.addEventListener('touchstart', e => {
        // mousedownE(e.touches[0].clientX, e.touches[0].clientY);
        // if (!isTouched) {
        //     let mx = e.touches[0].clientX;
        //     let my = e.touches[0].clientY;
        //     collision(mx, my);
        //     isTouched = true;
        // }
    });

    canvas.addEventListener('touchmove', e => {
        // mousemoveE(e.touches[0].clientX, e.touches[0].clientY);
    });

    canvas.addEventListener('touchend', e => {
        // mouseupE();
        // if (isTouched) {
        //     isTouched = false;
        // }
    });

    canvas.addEventListener('mousedown', e => {
        // mousedownE(e.offsetX, e.offsetY);
        if (!isTouched) {
            let mx = e.clientX;
            let my = e.clientY;
            collision(mx, my);
            isTouched = true;
        }
    });

    canvas.addEventListener('mousemove', e => {
        // mousemoveE(e.offsetX, e.offsetY);
    });
    
    canvas.addEventListener('mouseup', e => {
        // mouseupE();
        if (isTouched) {
            isTouched = false;
        }
    });

    initGrid();
    
    initLetters();
    initGridPos();

    spawnLetters();

    gameCycle();
}

function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

function repopulate() {
    if (gridpos.length == 0) {
        initGridPos();
    }

    if (alphabets.length == 0) {
        initLetters();
    }
}

function initLetters() {
    alphabets = [...Array(26).keys()];
}

function initGrid() {
    for (let i = 0; i < gridDim; ++i) {
        grid[i] = [];
        for (let j = 0; j < gridDim; ++j) {
            grid[i][j] = {
                letter: '',
                color: ''
            };
        }
    }
}

function popLetter(x, y, a) {
    if (grid[y][x].letter == a) {
        grid[y][x].letter = '';
    
        currentLetter = (currentLetter + 1) % 26;

        if (isGridCleared()) {
            repopulate();
        }

        score++;
        
        spawnLetters();
    } else {
        score = Math.max(score - 1, 0);
        mistakes++;
    }
}

function initGridPos() {
    gridpos = [...Array(gridDim * gridDim).keys()];
    shuffleArr(gridpos);
}

function getXY(pos) {
    let y = Math.floor(pos / gridDim);
    let x = pos % gridDim;

    return {
        x: x,
        y: y
    }
}

function spawnLetters() {
    let n = Math.min(Math.floor(Math.random() * gridpos.length + 1), 7);
    let a = Math.min(Math.floor(Math.random() * alphabets.length + 1), n);

    // console.log(n, a)
    for (let i = 0; i < a; ++i) {
        addLetter();
    }
}

function isGridCleared() {
    for (let i = 0; i < gridDim; ++i) {
        for (let j = 0; j < gridDim; ++j) {
            if (grid[i][j].letter != '') return false;
        }
    }

    return true;
}

function addLetter() {
    if (gridpos.length > 0 && alphabets.length > 0) {
        let a = alphabets.shift();
        let pos = getXY(gridpos.pop());



        let alpha = String.fromCharCode(a + 65);

        // letters.push({
        //     letter: alpha,
        //     r: pos.y,
        //     c: pos.x,
        //     color: colors[Math.floor(Math.random() * 4)]
        // });

        grid[pos.y][pos.x] = {
            letter: alpha,
            color: colors[Math.floor(Math.random() * 4)]
        };
    }
}

function collision(mx, my) {
    let x = Math.floor((mx - pl) / gridW);
    let y = Math.floor((my - pt) / gridH);

    if (x >= 0 && x < gridDim && y >= 0 && y < gridDim) {
        popLetter(x, y, String.fromCharCode(currentLetter + 65));
    }
}

function displayScore() {
    ctx.font = "bolder 100px Arial";
    ctx.fillStyle = '#000';
    let s = parseInt(score).toString().padStart(5, '0');
    ctx.fillText(s, canvas.width / 2  -  50 * scaleX, 100 * scaleY);
}

function isPortrait() {
    return window.innerHeight > window.innerWidth;
}

function shuffleArr (array){
    for (var i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]]
    }
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function loadAssets() {
    for (let k in images) {
        assets.load(images[k].obj, images[k].src);
    }
}

function drawLetter(letter, r, c, color) {
    let x = c * gridW + pl + gridW / 2;
    let y = r * gridH + pt + gridH / 2;
    
    ctx.beginPath();
    ctx.lineWidth = '1';
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();

    ctx.font = "bolder " + fontsize + "px Arial";
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, x - letterAdjX, y + letterAdjY);
}

function drawLetters() {
    // letters.forEach(a => {
    //     drawLetter(a.letter, a.r, a.c, a.color);
    // });

    for (let i = 0; i < gridDim; ++i) {
        for (let j = 0; j < gridDim; ++j) {
            if (grid[i][j].letter != '') {
                drawLetter(grid[i][j].letter, i, j, grid[i][j].color);
            }
        }
    }
}

function drawGrid(n, m, w, h) {
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < m; ++j) {
            ctx.beginPath();
            ctx.rect(j * w + pl, i * h + pt, w, h);
            ctx.stroke();
        }
    }
}

function update() {
    // placeholder
    timer.draw(ctx);
    timer.tick(delta);
}

function gameCycle() {
    if (timer.timer > 0) {
        let now = Date.now();
        if (last == 0) last = now;
        delta = (now - last) / 1000;
        last = now;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // displayScore();
        drawLetters();

        drawGrid(4, 4, gridW, gridH);
        update();

        // ctx.font = "30px Arial";
        // ctx.fillText("Hello World", 10, 50);
        requestAnimationFrame(gameCycle);
    } else {
        let accuracy = Math.max(0, (score - mistakes)) / score * 100;
        alert('Total letters tapped: ' + score + ', Mistakes: ' + mistakes + ', Accuracy: ' + accuracy.toFixed(2) + '%');
    }
    
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);

// draw circle
// var c = document.getElementById("myCanvas");
// var ctx = c.getContext("2d");
// ctx.beginPath();
// ctx.arc(100, 75, 50, 0, 2 * Math.PI);
// ctx.fillStyle = 'green';
// ctx.fill();
// ctx.stroke();

// write text
// ctx.font = "30px Arial";
// ctx.fillText("Hello World", 10, 50);

// draw rect
// ctx.beginPath();
// ctx.rect(20, 20, 150, 100);
// ctx.fillStyle = 'green';
// ctx.fill();
// ctx.stroke();

// const colors = ['#10aad7', '#b3d23b', '#10aad7', '#f9a139'];