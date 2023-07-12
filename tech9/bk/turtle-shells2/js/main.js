const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');

var instrucions = document.getElementById("game-instructions");
var btnStart = document.getElementById("btnStart");

var last = 0;
var delta = 0;
var startGame = false; // orientation prep
var gameStart = false; // start game

var scaleX = 1;
var scaleY = 1;

var mDown = false;

// 1792 922
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
    splash: {
        src: 'splash',
        obj: {},
    }, 
    bg: {
        src: 'bg',
        obj: {},
    },
    turtle: {
        src: 'turtle',
        obj: {},
    },
    shell: {
        src: 'shell',
        obj: {},
    },
};

var btnBegin = {
    x: 0,
    y: 0,
    w: 400,
    h: 100
};

var turtleInfo = {
    w: 104,
    h: 119,
    cw: 104,
    ch: 119,
    bucketSize: 0
}

var shellInfo = {
    w: 105,
    h: 116,
    cw: 105,
    ch: 116,
    bucketSize: 0
}

var sorts = {
    bubble: () => {
        let arr = generateSwaps();

        for (let i = 0; i < arr.length; ++i) {
            for (let j = i + 1; j < arr.length; ++j) {
                if (arr[i] > arr[j]) {
                    let tmp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = tmp;

                    swaps.unshift([i, j]);
                }
            }
        }

        // console.log(swaps);
        // swaps.push([0, 9]);
        // swaps.push([1, 3]);
        // swaps.push([0, 2]);
    }
}

var turtles = [];

var target = 1;

var swaps = [];
var turtlePos = [];

var timer = null;

var timerRadius = 120;
var timerY = 200;
var timerFontSize = 70;
var timerAdjX = [30, 40];

var startTimer = false;
var showTarget = true;

var msg = '';
var textPos = {
    x: 0,
    y: 0
}

var score = 0;
var rounds = 0;
var totalRounds = 12;
var gameover = false;
var speed = 3;


function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    canvas.style.display = 'block';
    instrucions.style.display = 'none';

    scaleX = w / 1792;
    scaleY = h / 922;

    

    let isMobile = detectMob();

    if (isMobile) {
        timerRadius = 70;
        timerY = 120;
        timerFontSize = 40;
        timerAdjX = [8, 22];
    }

    textPos.x = w / 2;
    textPos.y = timerY * 2;

    timer = new Timer(w / 2, timerY, timerRadius, '#fb2121');
    timer.fontSize = timerFontSize;
    timer.adjX = timerAdjX;

    btnBegin.w *= scaleX;
    btnBegin.h *= scaleY;

    btnBegin.x = w / 2 - btnBegin.w / 2;
    btnBegin.y = h - 235 * scaleY;
    
    rescaleSize(turtleInfo);
    rescaleSize(shellInfo);

    turtleInfo.bucketSize = turtleInfo.w > turtleInfo.h ? turtleInfo.w : turtleInfo.h;
    shellInfo.bucketSize = shellInfo.w > shellInfo.h ? shellInfo.w : shellInfo.h;

    loadAssets();

    canvas.addEventListener('touchstart', e => {
        // mousedownE(e.touches[0].clientX, e.touches[0].clientY);
    });

    canvas.addEventListener('touchmove', e => {
        // mousemoveE(e.touches[0].clientX, e.touches[0].clientY);
    });

    canvas.addEventListener('touchend', e => {
        // mouseupE();
    });

    canvas.addEventListener('mousedown', e => {
        // mousedownE(e.offsetX, e.offsetY);
        if (!mDown) {
            let mx = e.offsetX;
            let my = e.offsetY;

            if (gameStart) {
                // turtles[2].move(-1);
                // turtles[0].move(1);
                // turtles[2].goto(-2);
                if (startTimer && swaps.length == 0) {
                    let p = clickBucket(mx, my);
                    if (p == turtles[target].pos) {
                        // alert('you win');
                        msg = 'Correct!';
                        score++;
                    } else {
                        // alert('you lose');
                        msg = 'Wrong!';
                    }

                    if (rounds < totalRounds) {
                        nextRound();
                    } else {
                        alert('You scored: ' + score + ' out of ' + rounds + '.');
                        gameover = true;
                    }
                    
                }
            } else {
                if (isBtnClicked(mx, my, btnBegin)) {
                    gameStart = true;
                }
            }

            mDown = true;
        }
    });

    document.addEventListener('keyup', e => {
        if (e.key == 'ArrowRight') {
            // turtles[2].move(1);
            // turtles[0].move(-1);
            // shellSwap(0, 2);
            // alert(turtles[target].pos)
            
        } else if (e.key == 'ArrowLeft') {
            // turtles[2].move(-1);
            // turtles[0].move(1);
        }
    });

    canvas.addEventListener('mousemove', e => {
        // mousemoveE(e.offsetX, e.offsetY);
    });
    
    canvas.addEventListener('mouseup', e => {
        // mouseupE();
        if (mDown) {
            mDown = false;
        }
    });

    addTurtle();
    addTurtle();
    addTurtle();
    // addTurtle();
    // addTurtle();
    // addTurtle();
    // addTurtle();
    // addTurtle();
    // addTurtle();
    // addTurtle();
    // addTurtle();

    updateTurtleInitialPos();
    
    // if (swaps.length == 0) {
    //     sorts.bubble();
    //     startTimer = true;
    // }

    timer.setTimer(6);

    gameCycle();
}

function generateSwaps() {
    let n = [...new Array(turtles.length).keys()];
    shuffleArr(n);
    return n;
}

function addTurtle() {
    let turtle = new Spirte(0, 0, turtleInfo.w, turtleInfo.h, turtleInfo.cw, turtleInfo.ch);
    turtle.setBucketSize(turtleInfo.bucketSize);
    turtle.pos = turtles.length;
    turtlePos.push(turtles.length);
    turtles.push(turtle);
}

function drawTurtle() {
    for (let i = 0; i < turtles.length; ++i) {
        if (showTarget && i == target) {
            turtles[i].draw(ctx, images.turtle.obj.img);
        } else {
            turtles[i].draw(ctx, images.shell.obj.img);
        }
    }
}

function shellSwap(i, j) {
    let p1 = turtles[i].pos;
    let p2 = turtles[j].pos;

    turtles[i].goto(p2, 0);
    turtles[j].goto(p1, turtleInfo.bucketSize / 2);
}

function updateTurtleInitialPos() {
    let dim = turtleInfo.bucketSize;
    let y = canvas.height - dim * 2;
    let x = canvas.width / 2 - dim * turtles.length / 2;

    for (let i = 0; i < turtles.length; ++i) {
        turtles[i].x = turtles[i].pos * dim + x;
        turtles[i].ox = turtles[i].pos * dim + x;
        turtles[i].y = y;
        turtles[i].oy = y;
    }
}

function updateTurtlePos(i) {
    let dim = turtleInfo.bucketSize;
    let y = canvas.height - dim * 2;
    let x = canvas.width / 2 - dim * turtles.length / 2;

    turtles[i].x = turtles[i].pos * dim + x;
    turtles[i].ox = turtles[i].pos * dim + x;
    turtles[i].y = y;
    turtles[i].oy = y;
}

function loadAssets() {
    for (let k in images) {
        assets.load(images[k].obj, images[k].src);
    }
}

function rescaleSize(obj) {
    obj.w *= scaleX;
    obj.h *= scaleY;
}

function rescaleAll(obj) {
    obj.x *= scaleX;
    obj.y *= scaleY;
    obj.w *= scaleX;
    obj.h *= scaleY;
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

function isPortrait() {
    return window.innerHeight > window.innerWidth;
}

function isBtnClicked(mx, my, btn) {
    return (mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h);
}

function clickBucket(mx, my) {
    let dim = turtleInfo.bucketSize;
    let y = canvas.height - dim * 2;
    let x = canvas.width / 2 - dim * turtles.length / 2;
    let w = dim * turtles.length;

    if (mx >= x && mx <= x + w && my >= y && my <= y + dim) {
        let p = Math.floor((mx - x) / dim);
        return p;
    }
    
    return -1;
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

function checkSwaps() {
    for (let i = swaps.length - 1; i >= 0; --i) {
        let a = swaps[i][0];
        let b = swaps[i][1];

        if (!turtles[a].isAnimating && !turtles[b].isAnimating) {
            swaps.splice(i, 1);
            shellSwap(a, b);
        }
    }
}

function update() {
    checkSwaps();

    for (let i = 0; i < turtles.length; ++i) {
        let r = turtles[i].update(speed, delta);
        if (r) {
            updateTurtlePos(i);
        }
    }

    if (startTimer && swaps.length == 0) {
        timer.draw(ctx);
        timer.tick(delta);

        if (timer.timer <= 0) {
            nextRound();
            
        }
    } else if (showTarget) {
        timer.draw(ctx);
        timer.tick(delta);

        if (msg)
            drawMessage(msg);

        if (timer.timer <= 0) {
            timer.setTimer(17);
            showTarget = false;
            startTimer = true;
            msg = '';
            sorts.bubble();
        }
    }
}

function nextRound() {
    timer.setTimer(6);
    showTarget = true;
    startTimer = false;
    target = Math.floor(Math.random() * turtles.length);

    if (turtles.length < 11) {
        addTurtle();
        updateTurtleInitialPos();
    } else {
        speed += 0.5;
    }

    rounds++;
}

function drawMessage(str) {
    if (str == 'Wrong!')
        ctx.fillStyle = '#fb2121';
    else 
        ctx.fillStyle = '#b1dd47';

    let adjX = str.length * 30 * scaleX;

    ctx.fillText(str, textPos.x - adjX / 2, textPos.y);
}

function drawBuckets(n) {
    let dim = turtleInfo.bucketSize;
    let y = canvas.height - dim * 2;
    let x = canvas.width / 2 - dim * n / 2;
    for (let i = 0; i < n; ++i) {
        ctx.beginPath();
        ctx.rect(i * dim + x, y, dim, dim);
        ctx.stroke();
    }
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    if (assets.loaded == assets.count) {
        if (!gameover) {
            if (gameStart) {
                // bg
                ctx.drawImage(images.bg.obj.img, 0, 0, 927, 429, 0, 0, canvas.width, canvas.height);
                
                drawTurtle();

                // drawBuckets(turtles.length);
                // drawBuckets(turtles.length);
                update();

                
            } else {
            
                ctx.drawImage(images.splash.obj.img, 0, 0, 927, 429, 0, 0, canvas.width, canvas.height);

                // ctx.beginPath();
                // ctx.rect(btnBegin.x, btnBegin.y, btnBegin.w, btnBegin.h);
                // ctx.stroke();

            }
        }
    }

    requestAnimationFrame(gameCycle);
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);
