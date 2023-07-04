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

var sounds = {
    count: 0,
    loaded: 0,
    load: (obj, fn, ext) => {
        obj.audio = new Audio();
        obj.audio.src = 'http://192.168.1.2:5501/assets/' + fn + '.' + ext;
        obj.audio.preload = 'auto';
        obj.audio.autoplay = (/iPad|iPhone|iPod/).test(navigator.userAgent);
        // obj.audio.canplaythrough = function() {
        //     ++sounds.loaded;
        // }
        // obj.audio.addEventListener("loadeddata", () => {
        //     //audio is ready to play all the way through
        //     ++sounds.loaded;
        // });

        obj.audio.addEventListener("loadedmetadata", () => {
            //audio is ready to play all the way through
            ++sounds.loaded;
        });

        // obj.audio.addEventListener("canplaythrough", () => {
        //     //audio is ready to play all the way through
        //     ++sounds.loaded;
        // });

        sounds.count++;
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
    turtleshine: {
        src: 'turtleshine',
        obj: {},
    },
    timecircle: {
        src: 'tophud/timecircle',
        obj: {},
    },
    stopwatch: {
        src: 'tophud/stopwatch',
        obj: {},
    },
    palm: {
        src: 'palm',
        obj: {},
    },
    palmshadow: {
        src: 'palmshadow',
        obj: {},
    },
    umbrella: {
        src: 'umbrella',
        obj: {},
    },
    kayak: {
        src: 'kayak',
        obj: {},
    },
    sky: {
        src: 'sky',
        obj: {},
    },
    sand: {
        src: 'sand',
        obj: {},
    },
    sand2: {
        src: 'sand2',
        obj: {},
    },
    cloudleft: {
        src: 'cloudleft',
        obj: {},
    },
    cloudright: {
        src: 'cloudright',
        obj: {},
    },
    cloud1: {
        src: 'cloud1',
        obj: {},
    },
    cloud2: {
        src: 'cloud2',
        obj: {},
    },
    cloud3: {
        src: 'cloud3',
        obj: {},
    },
    shine: {
        src: 'shine',
        obj: {},
    },
};

var music = {
    bg: {
        src: 'sounds/bg-beach',
        obj: {},
        ext: 'wav',
    }, 
    correct: {
        src: 'sounds/correct',
        obj: {},
        ext: 'wav',
    }, 
    wrong: {
        src: 'sounds/wrong',
        obj: {},
        ext: 'wav',
    },
    wrong2: {
        src: 'sounds/wrong2',
        obj: {},
        ext: 'wav',
    },
    // shuffle: {
    //     src: 'sounds/shuffle',
    //     obj: {},
    //     ext: 'wav',
    // }, 

}

var bgInfo = {
    water: {
        x: 0,
        y: 160,
        w: 0,
        h: 50,
        cw: 0,
        ch: 0
    },
    sand: {
        x: 0,
        y: 0,
        w: 0,
        h: 376,
        cw: 926,
        ch: 176
    },
    sand2: {
        x: 0,
        y: 0,
        w: 0,
        h: 174,
        cw: 926,
        ch: 176
    },
    umbrella: {
        x: 0,
        y: 0,
        w: 384,
        h: 538,
        cw: 192,
        ch: 269
    },
    palm: {
        x: 0,
        y: 0,
        w: 207,
        h: 137,
        cw: 207,
        ch: 137
    },
    palmshadow: {
        x: 0,
        y: 0,
        w: 142,
        h: 85,
        cw: 142,
        ch: 85
    },
    kayak: {
        x: 0,
        y: 0,
        w: 142,
        h: 320,
        cw: 71,
        ch: 160
    },
    cloudleft: {
        x: 0,
        y: 250,
        w: 438,
        h: 227,
        cw: 438,
        ch: 227
    },
    cloudright: {
        x: 0,
        y: 400,
        w: 380,
        h: 234,
        cw: 380,
        ch: 234
    },
    cloud1: {
        x: 0,
        y: 0,
        w: 286,
        h: 67,
        cw: 286,
        ch: 67
    },
    cloud2: {
        x: 0,
        y: 0,
        w: 371,
        h: 99,
        cw: 371,
        ch: 99
    },
    cloud3: {
        x: 0,
        y: 0,
        w: 188,
        h: 42,
        cw: 188,
        ch: 42
    }
}

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

var shineInfo = {
    x: 0,
    y: 0,
    w: 352,
    h: 290,
    cw: 352,
    ch: 290,
}

const topHUD = {
    timer: {
        timecircle: {
            w: 45,
            h: 45,
            cw: 45,
            ch: 45,
        },
        stopwatch: {
            w: 45,
            h: 45,
            cw: 43,
            ch: 45,
        },
    },
    score: {
        turtleshine: {
            w: 45,
            h: 45,
            cw: 42,
            ch: 43,
        }
    },
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

var timerRadius = 70;
var timerY = 200;
var timerFontSize = 50;
var timerAdjX = [30, 40];

var startTimer = false;
var showTarget = true;

var msg = '';

var textPos = {
    x: 0,
    y: 0,
    fontsize: 80
}

var score = 0;
var rounds = 0;
var totalRounds = 12;
var gameover = false;
var speed = 3;

const topHUDInfo = {
    w: 250,
    h: 100,
    timer: {
        x: 0,
        y: 0,
        w: 0,
        h: 20,
        progress: {
            x: 0,
            y: 0,
            w: 0,
            h: 20,
            max: 142,
        },
        text: {
            x: 0,
            y: 1,
            w: 0,
            h: 0,
            rectSize: 20,
            fontsize: 19,
        }
    },
    score: {
        x: 0,
        y: 0,
        w: 100,
        h: 50,
        pw: 150,
        fontsize: 20,
        fontsize2: 25,
        fontX: 0,
        fontY: 0,
        fontXadj: 37
    },
    life: {
        x: 0,
        y: 0,
        w: 50,
        h: 50,
        lives: 3,
        totalW: 0,
        sx: 0,
        pad: 0
    }
}

var showTurtleDuration = 4;
var lives = topHUDInfo.life.lives;

var resetMsgY = 100;
var canReset = false;

const cloudMovements = [-100, 100, 100];

const colors = ['#10aad7', '#b3d23b', '#10aad7', '#f9a139'];

var fade = false;

var pulseT = 0;

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    canvas.style.display = 'block';
    instrucions.style.display = 'none';

    scaleX = w / 1792;
    scaleY = h / 922;

    let isMobile = detectMob();
    timerY = h / 2;
    textPos.x = w / 2;
    textPos.y = timerY / 2;

    if (isMobile) {
        timerRadius = 70;
        
        timerFontSize = 40;
        timerAdjX = [8, 22];
        textPos.fontsize = 40;
        resetMsgY = 170;
        textPos.y -= 25;

        bgInfo.water.y = 350;
    }

    resetMsgY *= scaleY;
    

    timer = new Timer(w / 2, timerY, timerRadius, '#fb2121');
    timer.fontSize = timerFontSize;
    timer.adjX = timerAdjX;

    btnBegin.w *= scaleX;
    btnBegin.h *= scaleY;

    btnBegin.x = w / 2 - btnBegin.w / 2;
    btnBegin.y = h - 235 * scaleY;
    
    rescaleSize(turtleInfo);
    rescaleSize(shellInfo);
    // rescaleSize(topHUD.timer.timecircle);
    // rescaleSize(topHUD.timer.stopwatch);
    // rescaleSize(topHUD.score.turtleshine);
    // rescaleSize(topHUDInfo);

    // turtleInfo.bucketSize = turtleInfo.w * 3;
    // shellInfo.bucketSize = shellInfo.w * 3;

    // turtleInfo.bucketSize = turtleInfo.w > turtleInfo.h ? turtleInfo.w : turtleInfo.h;
    // shellInfo.bucketSize = shellInfo.w > shellInfo.h ? shellInfo.w : shellInfo.h;

    // turtleInfo.bucketSize *= 2;
    // shellInfo.bucketSize *= 2;

    initTopHUD();

    rescaleAll(bgInfo.water);
    rescaleAll(bgInfo.sand);
    rescaleAll(bgInfo.sand2);

    rescaleAll(bgInfo.umbrella);
    rescaleAll(bgInfo.palm);
    rescaleAll(bgInfo.palmshadow);
    rescaleAll(bgInfo.kayak);
    rescaleAll(bgInfo.cloudleft);
    rescaleAll(bgInfo.cloudright);
    rescaleAll(bgInfo.cloud1);
    rescaleAll(bgInfo.cloud2);
    rescaleAll(bgInfo.cloud3);
    rescaleAll(shineInfo);

    shineInfo.w *= 1.5;
    shineInfo.h *= 1.5;
    shineInfo.x = w / 2 - shineInfo.w / 2;
    // shineInfo.y = h / 2 - shineInfo.h / 3;
    // shineInfo.y = h / 2 - shineInfo.h / 3;

    bgInfo.umbrella.y = h - (bgInfo.umbrella.h + 150 * scaleY);
    bgInfo.palm.x = w - bgInfo.palm.w;
    bgInfo.palmshadow.x = w - bgInfo.palmshadow.w;
    bgInfo.palmshadow.y = h - (bgInfo.palmshadow.h);
    bgInfo.kayak.x = w - (bgInfo.kayak.w + 100 * scaleX);
    bgInfo.kayak.y = h - (bgInfo.kayak.h + 300 * scaleY);
    bgInfo.cloudright.x = w - bgInfo.cloudright.w;

    bgInfo.cloud1.x = w - bgInfo.cloud1.w;
    bgInfo.cloud1.y = 200 * scaleY;
    bgInfo.cloud2.x = bgInfo.cloud2.w / 2;
    bgInfo.cloud2.y = 100 * scaleY;
    bgInfo.cloud3.x = w / 2 - bgInfo.cloud3.w / 2;
    bgInfo.cloud3.y = h / 2 - (150 * scaleY);

    
    bgInfo.water.y = h / 2 + bgInfo.water.y * scaleY;
    bgInfo.sand.y = h - 376 * scaleY;
    bgInfo.sand2.y = h - 336 * scaleY;

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

            if (gameover) {
                // canReset = false;
            } else if (gameStart) {
                // turtles[2].move(-1);
                // turtles[0].move(1);
                // turtles[2].goto(-2);
                if (startTimer && swaps.length == 0) {
                    let p = clickBucket(mx, my);
                    if (p == turtles[target].pos) {
                        // alert('you win');
                        msg = 'Correct!';
                        score++;
                        // if (!music.correct.obj.audio.paused) {
                        //     music.correct.obj.audio.currentTime = 0;
                        //     music.correct.obj.audio.play();
                        // }
                        
                        music.correct.obj.audio.play();
                        
                    } else {
                        // alert('you lose');
                        msg = 'Wrong!';
                        reduceHP();
                        music.wrong.obj.audio.play();
                    }

                    if (rounds < totalRounds) {
                        nextRound();
                    } else {
                        // alert('You scored: ' + score + ' out of ' + rounds + '.');
                        gameover = true;
                    }
                }
            } else {
                if (isBtnClicked(mx, my, btnBegin)) {
                    gameStart = true;
                    music.bg.obj.audio.volume = 0.2;
                    music.bg.obj.audio.loop = true;
                    music.bg.obj.audio.play();
                }
            }

            mDown = true;
        }
    });

    document.addEventListener('keyup', e => {
        if (e.key == 'ArrowRight') {

        } else if (e.key == 'ArrowLeft') {

        }
    });

    canvas.addEventListener('mousemove', e => {
        // mousemoveE(e.offsetX, e.offsetY);
    });
    
    canvas.addEventListener('mouseup', e => {
        // mouseupE();
        if (mDown) {
            mDown = false;

            if (gameover) {
                if (canReset) {
                    init();
                } else {
                    canReset = true;
                }
                
            }
            
        }
    });

    // addTurtle();
    // addTurtle();
    // addTurtle();
    // // addTurtle();
    // // addTurtle();
    // // addTurtle();
    // // addTurtle();
    // // addTurtle();
    // // addTurtle();
    // // addTurtle();
    // // addTurtle();

    // updateTurtleInitialPos();
    
    // // if (swaps.length == 0) {
    // //     sorts.bubble();
    // //     startTimer = true;
    // // }

    // timer.setTimer(showTurtleDuration);
    setCloudSpeed(30);
    setBucketSizes();
    init();

    gameCycle();
}

function setBucketSizes() {
    turtleInfo.bucketSize = turtleInfo.w > turtleInfo.h ? turtleInfo.w : turtleInfo.h;
    shellInfo.bucketSize = shellInfo.w > shellInfo.h ? shellInfo.w : shellInfo.h;

    if (turtles.length < 8) {
        turtleInfo.bucketSize *= 2;
        shellInfo.bucketSize *= 2;
    } else if (turtles < 10) {
        turtleInfo.bucketSize *= 1.75;
        shellInfo.bucketSize *= 1.75;
        updateTurtleInitialPos();
    } else {
        turtleInfo.bucketSize *= 1.5;
        shellInfo.bucketSize *= 1.5;
        updateTurtleInitialPos();
    }
}

function drawBGs() {
    ctx.drawImage(images.sky.obj.img, 0, 0, 926, 429, 0, 0, canvas.width, canvas.height);
                
    ctx.beginPath();
    ctx.fillStyle = '#70D2ED';
    ctx.rect(0, bgInfo.water.y, canvas.width, bgInfo.water.h);
    ctx.fill();

    drawClouds();

    ctx.drawImage(images.sand2.obj.img, 0, 0, bgInfo.sand2.cw, bgInfo.sand2.ch, 0, bgInfo.sand2.y, canvas.width, bgInfo.sand2.h);
    ctx.drawImage(images.sand.obj.img, 0, 0, bgInfo.sand.cw, bgInfo.sand.ch, 0, bgInfo.sand.y, canvas.width, bgInfo.sand.h);

    ctx.drawImage(images.umbrella.obj.img, 0, 0, bgInfo.umbrella.cw, bgInfo.umbrella.ch, 
        bgInfo.umbrella.x, bgInfo.umbrella.y, bgInfo.umbrella.w, bgInfo.umbrella.h);

    ctx.drawImage(images.palm.obj.img, 0, 0, bgInfo.palm.cw, bgInfo.palm.ch, 
        bgInfo.palm.x, bgInfo.palm.y, bgInfo.palm.w, bgInfo.palm.h);

    ctx.drawImage(images.palmshadow.obj.img, 0, 0, bgInfo.palmshadow.cw, bgInfo.palmshadow.ch, 
        bgInfo.palmshadow.x, bgInfo.palmshadow.y, bgInfo.palmshadow.w, bgInfo.palmshadow.h);

    ctx.drawImage(images.kayak.obj.img, 0, 0, bgInfo.kayak.cw, bgInfo.kayak.ch, 
        bgInfo.kayak.x, bgInfo.kayak.y, bgInfo.kayak.w, bgInfo.kayak.h);
}

function drawClouds() {
    ctx.drawImage(images.cloudleft.obj.img, 0, 0, bgInfo.cloudleft.cw, bgInfo.cloudleft.ch, 
        bgInfo.cloudleft.x, bgInfo.cloudleft.y, bgInfo.cloudleft.w, bgInfo.cloudleft.h);

    ctx.drawImage(images.cloudright.obj.img, 0, 0, bgInfo.cloudright.cw, bgInfo.cloudright.ch, 
        bgInfo.cloudright.x, bgInfo.cloudright.y, bgInfo.cloudright.w, bgInfo.cloudright.h);
    
    for (let i = 1; i < 4; ++i) {
        let key = 'cloud' + i;
        ctx.drawImage(images[key].obj.img, 0, 0, bgInfo[key].cw, bgInfo[key].ch, 
            bgInfo[key].x, bgInfo[key].y, bgInfo[key].w, bgInfo[key].h);
    }
}

function init() {
    turtles = [];
    lives = topHUDInfo.life.lives;
    // lives = 0;
    score = 0;
    rounds = 0;

    for (let i = 0; i < 3; ++i) {
        addTurtle();
    }

    updateTurtleInitialPos();
    timer.setTimer(showTurtleDuration);

    showTarget = true;

    gameover = false;
    canReset = false;
    msg = '';
    fade = false;
    pulseT = 0;
}

function initTopHUD() {
    let isMobile = detectMob();

    if (isMobile) {
        topHUD.timer.timecircle.w = 75;
        topHUD.timer.timecircle.h = 75;
        topHUD.timer.stopwatch.w = 75;
        topHUD.timer.stopwatch.h = 75;
        topHUDInfo.timer.progress.h = 30;
        topHUDInfo.timer.progress.max = 167;
        topHUDInfo.timer.text.fontsize = 18;
        topHUDInfo.timer.text.rectSize = 35;
        topHUDInfo.timer.text.y = 1;

        topHUDInfo.score.w = 125;
        topHUDInfo.score.h = 65;
        topHUDInfo.score.pw = 182;
        topHUDInfo.score.y = 3;

        topHUD.score.turtleshine.w = 65;
        topHUD.score.turtleshine.h = 65;

        topHUDInfo.score.fontX = 15;
        topHUDInfo.score.fontsize = 20;
        topHUDInfo.score.fontsize2 = 20;
        topHUDInfo.life.y = 5;
    }

    rescaleSize(topHUD.timer.timecircle);
    rescaleSize(topHUD.timer.stopwatch);
    rescaleSize(topHUD.score.turtleshine);
    rescaleSize(topHUDInfo);

    topHUDInfo.timer.w = topHUD.timer.timecircle.w / 2 + 100 * scaleX;
    topHUDInfo.timer.progress.h *= scaleX;
    
    topHUDInfo.timer.progress.x = topHUDInfo.w / 2 - topHUDInfo.timer.w / 2;

    topHUDInfo.timer.x = topHUDInfo.timer.progress.x - topHUD.timer.timecircle.w / 2;
    topHUDInfo.timer.y = topHUDInfo.h / 2 - topHUD.timer.timecircle.h / 2;

    topHUDInfo.timer.progress.y = (topHUDInfo.h / 2 - topHUDInfo.timer.progress.h / 2);
    topHUDInfo.timer.text.x = topHUDInfo.timer.x + topHUDInfo.timer.text.rectSize * scaleX / 2;
    topHUDInfo.timer.text.y += topHUDInfo.timer.y + topHUD.timer.timecircle.h / 2;
    
    topHUDInfo.score.w *= scaleX;
    topHUDInfo.score.h *= scaleY;
    topHUDInfo.score.pw *= scaleX;
    

    let sx = canvas.width / 2 - topHUDInfo.w / 2;
    // topHUDInfo.score.x = sx + (topHUDInfo.w  - topHUDInfo.score.w) / 2;
    topHUDInfo.score.x = sx + (topHUDInfo.w - topHUDInfo.score.pw) / 2;
    topHUDInfo.score.y += topHUDInfo.timer.y;

    topHUDInfo.score.fontX += topHUDInfo.score.x + (topHUDInfo.w - topHUDInfo.score.pw) / 2 + 10 * scaleX;
    topHUDInfo.score.fontY += topHUDInfo.score.y + topHUDInfo.score.h / 2;
    topHUDInfo.score.fontXadj *= scaleX;

    topHUDInfo.life.w *= scaleX;
    topHUDInfo.life.h *= scaleY;
    topHUDInfo.life.pad = 20 * scaleX;
    let lifeW = topHUDInfo.life.pad * 2 + topHUDInfo.life.w * topHUDInfo.life.lives;
    sx = (canvas.width - topHUDInfo.w);
    topHUDInfo.life.x = sx + (topHUDInfo.w - lifeW) / 2;
    topHUDInfo.life.y += topHUDInfo.timer.y;
}

function generateSwaps() {
    let n = [...new Array(turtles.length).keys()];
    shuffleArr(n);
    return n;
}

function addTurtle() {
    // const tmp = [0, 5, 9];
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
    let y = canvas.height - dim / 2 * 2;
    let x = canvas.width / 2 - dim * turtles.length / 2 + (dim / 2 - turtleInfo.w / 2);
    
    for (let i = 0; i < turtles.length; ++i) {
        turtles[i].x = turtles[i].pos * dim + x;
        turtles[i].ox = turtles[i].pos * dim + x;
        turtles[i].y = y;
        turtles[i].oy = y;
        turtles[i].setBucketSize(turtleInfo.bucketSize);
    }
}

function updateTurtlePos(i) {
    let dim = turtleInfo.bucketSize;
    let y = canvas.height - dim / 2 * 2;
    let x = canvas.width / 2 - dim * turtles.length / 2 + (dim / 2 - turtleInfo.w / 2);

    turtles[i].x = turtles[i].pos * dim + x;
    turtles[i].ox = turtles[i].pos * dim + x;
    turtles[i].y = y;
    turtles[i].oy = y;
    turtles[i].setBucketSize(turtleInfo.bucketSize);
}

function loadAssets() {
    for (let k in images) {
        assets.load(images[k].obj, images[k].src);
    }

    for (let k in music) {
        sounds.load(music[k].obj, music[k].src, music[k].ext);
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
    let y = canvas.height - dim * 2 + dim / 2;
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

function reduceHP() {
    if (--lives < 0) {
        gameover = true;
        msg = 'Complete!';
    }
}

function setCloudSpeed(max) {
    for (let i = 0; i < 3; ++i) {
        let rngSpeed = Math.floor(Math.random() * max + 1);
        let mul = Math.floor(Math.random() * 2);
        if (mul == 0)
            cloudMovements[i] = rngSpeed;
        else 
            cloudMovements[i] = -rngSpeed;
    }
    
}

function moveClouds() {
    for (let i = 1; i < 4; ++i) {
        let key = 'cloud' + i;
        bgInfo[key].x += cloudMovements[i - 1] * delta;

        if (bgInfo[key].x > canvas.width + bgInfo[key].w) {
            
            let rngSpeed = Math.floor(Math.random() * 100 + 1);
            let mul = Math.floor(Math.random() * 2);

            if (mul == 0) {
                cloudMovements[i - 1] = -rngSpeed;
                bgInfo[key].x = canvas.width;
                console.log('test', )
            } else {
                cloudMovements[i - 1] = rngSpeed;
                bgInfo[key].x = -bgInfo[key].w;
            }

            console.log('test', bgInfo[key].x)

            bgInfo[key].y = Math.floor(Math.random() * 300 + 200);
        } else if (bgInfo[key].x + bgInfo[key].w * 2 < 0) {
            
            let rngSpeed = Math.floor(Math.random() * 100 + 1);
            let mul = Math.floor(Math.random() * 2);

            if (mul == 0) {
                cloudMovements[i - 1] = -rngSpeed;
                bgInfo[key].x = canvas.width;
            } else {
                cloudMovements[i - 1] = rngSpeed;
                bgInfo[key].x = -bgInfo[key].w;
            }

            bgInfo[key].y = Math.floor(Math.random() * 300 + 200);
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
        // timer.draw(ctx);
        // if (!music.shuffle.obj.audio.paused) {
        //     // music.shuffle.obj.audio.pause();
        //     music.shuffle.obj.audio.loop = false;
        // }

        timer.tick(delta);

        if (timer.timer <= 0) {
            if (msg == '') {
                msg = 'Too slow!';
                reduceHP();
                music.wrong2.obj.audio.play();
            }
                

            nextRound();
        }

    } else if (showTarget) {
        timer.draw(ctx);
        timer.tick(delta);

        if (msg)
            drawMessage(msg);

        if (timer.timer <= 0) {
            timer.setTimer(9);
            showTarget = false;
            startTimer = true;
            msg = '';
            sorts.bubble();

            // music.shuffle.obj.audio.volume = 0.3;
            // music.shuffle.obj.audio.play();
        }
    }

    moveClouds();
}

function nextRound() {
    timer.setTimer(showTurtleDuration);
    showTarget = true;
    startTimer = false;
    target = Math.floor(Math.random() * turtles.length);

    if (turtles.length < 10) {
        addTurtle();
        if (turtles.length > 7) {
            setBucketSizes();
        }
        updateTurtleInitialPos();
    } else {
        speed += 0.5;
    }

    rounds++;
}

function drawMessage(str) {
    if (str != 'Correct!')
        ctx.fillStyle = '#fb2121';
    else 
        ctx.fillStyle = '#fff';
        // ctx.fillStyle = '#b1dd47';

    let adjX = str.length * (str != 'Correct!' ? 47 : 40) * scaleX;

    ctx.font = 'bold ' + textPos.fontsize + 'px Montserrat';
    ctx.fillText(str, textPos.x - adjX / 2, textPos.y);
}

function displayMsg(str, fontsize, color, x, y) {
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.font = 'bold ' + fontsize + 'px Montserrat';
    ctx.fillText(str, x, y);
}

function drawResetMessage() {
    let adjX = 700 * scaleX;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold ' + textPos.fontsize + 'px Montserrat';
    // ctx.fillText('Tap to play again.', textPos.x - adjX / 2, textPos.y + resetMsgY * scaleY);
    ctx.fillText('Tap to play again.', textPos.x - adjX / 2, canvas.height / 2);
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

function zeroPad(num, places) {
    return String(num).padStart(places, '0');
}

function drawTopHUD() {
    const { x, y, w, h } = topHUDInfo.timer;
    
    ctx.drawImage(images.timecircle.obj.img, 0, 0, topHUD.timer.timecircle.cw, 
        topHUD.timer.timecircle.ch, x, y, topHUD.timer.timecircle.w, topHUD.timer.timecircle.h);

    ctx.drawImage(images.stopwatch.obj.img, 0, 0, topHUD.timer.stopwatch.cw, 
        topHUD.timer.stopwatch.ch, x, y, topHUD.timer.stopwatch.w, topHUD.timer.stopwatch.h);

    
    ctx.font = 'bold ' + topHUDInfo.timer.text.fontsize + 'px Montserrat';
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'middle';

    
    let timeText = showTarget ? '09' : zeroPad(Math.floor(timer.timer / 24), 2);
    ctx.fillText(timeText, topHUDInfo.timer.text.x, topHUDInfo.timer.text.y);
    // ctx.fillText('25', topHUD.timer.timecircle.w / 2 - 23 / 2, topHUD.timer.timecircle.h / 2 + 3);
}

function drawLives() {
    const { x, y, w, h, pad } = topHUDInfo.life;
    
    for (let i = 0; i < lives; ++i) {
        ctx.drawImage(images.turtle.obj.img, 0, 0, turtleInfo.cw, turtleInfo.ch, x + i * w + i * pad, y, w, h);
    }
    
}

function drawRects() {
    const { w, h } = topHUDInfo;

    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(canvas.width / 2 - w / 2, 0, w, h);
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(canvas.width - w, 0, w, h);
    ctx.stroke();
}

function drawScoreHUD() {
    // const h = 50;
    
    // const progW = 100;
    // let x = canvas.width / 2;
    // let y = topHUD.timer.timecircle.h / 2 - h / 2 + 30;

    const { x, y, w, h, pw } = topHUDInfo.score;
    const p = pw;

    /* To visalize ------------------------------------------------------*/
    ctx.beginPath();
    ctx.arc(h / 2 + x, h / 2 + y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
    ctx.lineTo(w + x, 0 + y);
    ctx.arc((h / 2) + w + x, h / 2 + y, h / 2, 3 / 2 *Math.PI,Math.PI / 2);
    ctx.lineTo(h / 2 + x, h + y);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
    /* ------------------------------------------------------------------*/

    if(p <= h){
        ctx.beginPath();
        ctx.arc(h / 2 + x, h / 2 + y, h / 2, Math.PI - Math.acos((h - p) / h), Math.PI + Math.acos((h - p) / h));
        ctx.save();
        ctx.scale(-1, 1);
        ctx.arc((h / 2) - p + x, h / 2 + y, h / 2, Math.PI - Math.acos((h - p) / h), Math.PI + Math.acos((h - p) / h));
        ctx.restore();
        ctx.fillStyle = "#569E1A";
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.arc(h / 2 + x, h / 2+ y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
        ctx.lineTo(p - 2 * h + x, 0 + y);
        ctx.arc(p - (h / 2) + x, h / 2 + y, h / 2, 3 / 2 * Math.PI,Math.PI / 2);
        ctx.lineTo(h / 2 + x, h + y);
        ctx.fillStyle = "#569E1A";
        ctx.fill();
    }

    ctx.drawImage(images.turtleshine.obj.img, 0, 0, topHUD.score.turtleshine.cw, 
        topHUD.score.turtleshine.ch, x + 3, y, topHUD.score.turtleshine.w, topHUD.score.turtleshine.h);

    ctx.font = topHUDInfo.score.fontsize + 'px Montserrat';
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.fillText('x', topHUDInfo.score.fontX, topHUDInfo.score.fontY);

    ctx.font = 'bold ' + topHUDInfo.score.fontsize2 + 'px Montserrat';
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.fillText(zeroPad(score, 2), topHUDInfo.score.fontX + topHUDInfo.score.fontXadj, topHUDInfo.score.fontY);
}

function drawProgress() {
    const { w } = topHUDInfo.timer;
    const { x, y, h, max } = topHUDInfo.timer.progress;
    let p = showTarget ? max * scaleX : (max * scaleX * (timer.timer / (9.0 * 24)));

    // if ((h / 2) - p > 0) {
    //     p = 0;
    // }

    // const grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
    const grd = ctx.createLinearGradient(0, 0, 0, p);
    // grd.addColorStop(0, "#F8E7CD");
    // grd.addColorStop(1, "#FEB466"); 

    let percent = p / (max * scaleX);
    
    
    if (percent > 0.7) {
        grd.addColorStop(0, "#4ED20E");
        grd.addColorStop(0.5, "#83DF56");
        grd.addColorStop(1, "#59DC19");
    } else {
        grd.addColorStop(0, "#fb2121");
        grd.addColorStop(0.5, "#f9a139");
        grd.addColorStop(1, "#fb2121");
    }

    /* To visalize ------------------------------------------------------*/
    ctx.beginPath();
    ctx.arc(h / 2 + x, h / 2 + y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
    ctx.lineTo(w + x, 0 + y);
    ctx.arc((h / 2) + w + x, h / 2 + y, h / 2, 3 / 2 *Math.PI,Math.PI / 2);
    ctx.lineTo(h / 2 + x, h + y);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
    /* ------------------------------------------------------------------*/

    if(p <= h){
        // ctx.beginPath();
        // ctx.arc(h / 2 + x, h / 2 + y, h / 2, Math.PI - Math.acos((h - p) / h), Math.PI + Math.acos((h - p) / h));
        // ctx.save();
        // ctx.scale(-1, 1);
        // ctx.arc((h / 2) - p + x, h / 2 + y, h / 2, Math.PI - Math.acos((h - p) / h), Math.PI + Math.acos((h - p) / h));
        // ctx.restore();
        // ctx.fillStyle = grd;
        // ctx.fill();
    } else {
        ctx.beginPath();
        ctx.arc(h / 2 + x, h / 2+ y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
        ctx.lineTo(p - 2 * h + x, 0 + y);
        ctx.arc(p - (h / 2) + x, h / 2 + y, h / 2, 3 / 2 *Math.PI,Math.PI / 2);
        ctx.lineTo(h / 2 + x, h + y);
        ctx.fillStyle = grd;
        ctx.fill();
    }
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    if (assets.loaded == assets.count && sounds.loaded == sounds.count) {
    // if (assets.loaded == assets.count) {
        if (!gameover) {
            if (gameStart) {
                
                // bg
                drawBGs();

                // hud
                drawProgress();
                drawTopHUD();
                drawScoreHUD();
                drawLives();

                // game
                drawTurtle();
                update();

                
            } else {
            
                ctx.drawImage(images.splash.obj.img, 0, 0, 927, 429, 0, 0, canvas.width, canvas.height);
                // ctx.drawImage(images.turtleshine.obj.img, 0, 0, topHUD.score.turtleshine.cw, 
                //     topHUD.score.turtleshine.ch, 0, 0, topHUD.score.turtleshine.w, topHUD.score.turtleshine.h);
                // ctx.beginPath();
                // ctx.rect(btnBegin.x, btnBegin.y, btnBegin.w, btnBegin.h);
                // ctx.stroke();

            }
        } else {
            if (!fade) {
                // bg
                drawBGs();

                // hud
                drawProgress();
                drawTopHUD();
                drawScoreHUD();
                drawLives();

                // game
                drawTurtle();
                // update();

                ctx.globalAlpha = 0.85;
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 1.0;

                pulseT += 2 * delta;
                let w = Math.sin(pulseT) * (shineInfo.w + 10);
                let h = Math.sin(pulseT) * (shineInfo.h + 10);

                if (w >= shineInfo.w) {
                    w = shineInfo.w;
                }

                if (h >= shineInfo.h) {
                    h = shineInfo.h;
                }

                if (w == shineInfo.w && h == shineInfo.h) {
                    fade = true;
                }

                let x = shineInfo.x + (shineInfo.w / 2 - w / 2);
                let y = shineInfo.y + (shineInfo.h / 2 - h / 2);
                ctx.drawImage(images.shine.obj.img, 0, 0, shineInfo.cw, 
                    shineInfo.ch, x, y, w, h);
                

                // ctx.drawImage(images.shine.obj.img, 0, 0, shineInfo.cw, 
                //     shineInfo.ch, shineInfo.x, shineInfo.y, shineInfo.w, shineInfo.h);
                
                x = shineInfo.x + (shineInfo.w / 2 - turtleInfo.w / 2);
                y = shineInfo.y + (shineInfo.h / 2 - turtleInfo.h / 2 - 10 * scaleY);
                ctx.drawImage(images.turtle.obj.img, 0, 0, turtleInfo.cw, 
                    turtleInfo.ch, x, y, turtleInfo.w, turtleInfo.h);
                
                
                let fonsizes = [40, 30, 50];
                let isMobile = detectMob();
                if (isMobile) {
                    fonsizes = [20, 15, 25];
                }

                x = shineInfo.x + (shineInfo.w / 2 - (220 * scaleX) / 2);
                // y = 100 * scaleY;
                displayMsg('Complete!', fonsizes[0], '#fff', x, 100 * scaleY);
                x = shineInfo.x + (shineInfo.w / 2 - (85 * scaleX) / 2);
                y += 20 * scaleY;
                displayMsg('Score', fonsizes[1], '#fff', x, y + turtleInfo.h);
                x = shineInfo.x + (shineInfo.w / 2 - (70 * scaleX) / 2);
                y += 40 * scaleY;
                displayMsg(zeroPad(score, 2), fonsizes[2], '#fff', x, y + turtleInfo.h);

                drawResetMessage();
                // fade = 2;
            }
            
        }
    } else {

    }

    requestAnimationFrame(gameCycle);
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);
