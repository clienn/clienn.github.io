const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');

var instrucions = document.getElementById("game-instructions");
var btnStart = document.getElementById("btnStart");

var last = 0;
var delta = 0;
var startGame = false; // orientation prep
var gameStart = true; // start game
var gameover = false;
var timer = null;

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
        src: 'bg2',
        obj: {},
    },
    pig: {
        src: 'piggybank',
        obj: {}
    },
    money: {
        src: 'money',
        obj: {}
    },
    ball_1: {
        src: 'balls/1',
        obj: {}
    },
    ball_2: {
        src: 'balls/2',
        obj: {}
    },
    ball_3: {
        src: 'balls/3',
        obj: {}
    },
    ball_4: {
        src: 'balls/4',
        obj: {}
    },
    ball_5: {
        src: 'balls/5',
        obj: {}
    },
};

var btnBegin = {
    x: 0,
    y: 0,
    w: 400,
    h: 100
};

var timer = null;

var timerRadius = 120;
var timerY = 200;
var timerFontSize = 70;
var timerAdjX = [30, 40];

var startTimer = false;

var pig = null;

var pigInfo = {
    x: 0,
    y: 0,
    w: 100,
    h: 70,
    // cw: 104,
    // ch: 119,
    cw: 513,
    ch: 362,
}

var moneyInfo = {
    w: 75,
    h: 50,
    // cw: 105,
    // ch: 116,
    cw: 113,
    ch: 113,
}

var ballInfo = {
    w: 30,
    h: 30,
    // cw: 105,
    // ch: 116,
    cw: 293,
    ch: 293,
}

var balls = [];
var ballsLimit = 10;

const moneyList = [];
const G = 9.8;

var moneyLimit = 0;
var dropPadding = 0;
var t = 0;

var rDown = false;
var lDown = false;
var forceD = 0;
var friction = 0.98;

var F = 50;
var T = 0;

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    canvas.style.display = 'block';
    instrucions.style.display = 'none';

    scaleX = w / 1792;
    scaleY = h / 922;

    timer = new Timer(0, 0, 0, '#fb2121');

    let isMobile = detectMob();

    if (isMobile) {
        timerRadius = 70;
        timerY = 120;
        timerFontSize = 40;
        timerAdjX = [8, 22];
    }


    timer = new Timer(w / 2, timerY, timerRadius, '#fb2121');
    timer.fontSize = timerFontSize;
    timer.adjX = timerAdjX;

    btnBegin.w *= scaleX;
    btnBegin.h *= scaleY;

    btnBegin.x = w / 2 - btnBegin.w / 2;
    btnBegin.y = h - 235 * scaleY;

    rescaleSize(pigInfo);
    rescaleSize(moneyInfo);
    rescaleSize(ballInfo);

    pig = new Sprite(w / 2 - pigInfo.w / 2, h - pigInfo.h - 10, pigInfo.w, pigInfo.h, pigInfo.cw, pigInfo.ch);
    moneyLimit = Math.floor(w / moneyInfo.w);
    dropPadding = (w - moneyLimit * moneyInfo.w) / 2;
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

            mDown = true;
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key == 'ArrowRight') {
            // turtles[2].move(1);
            // turtles[0].move(-1);
            // shellSwap(0, 2);
            // alert(turtles[target].pos)
            if (!rDown) {
                rDown = true;
                forceD = F;
                // pig.addForce(50, delta, 10);
            }
            
            
        } else if (e.key == 'ArrowLeft') {
            // turtles[2].move(-1);
            // turtles[0].move(1);
            // pig.addForce(-50, delta, 10);
            if (!lDown) {
                lDown = true;
                forceD = -F;
            }
        }
    });

    document.addEventListener('keyup', e => {
        if (e.key == 'ArrowRight') {
            // turtles[2].move(1);
            // turtles[0].move(-1);
            // shellSwap(0, 2);
            // alert(turtles[target].pos)
            // addMoney();
            rDown = false;
        } else if (e.key == 'ArrowLeft') {
            // turtles[2].move(-1);
            // turtles[0].move(1);
            lDown = false;
        }

        if (!rDown && !lDown) {
            forceD = 0;
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

    addMoney();
    addMoney();
    addMoney();
    // addBall();
    // addBall();
    // addBall();
    // addBall();
    // addBall();

    gameCycle();
}

function addBall() {
    if (balls.length < ballsLimit) {
        let ball = new Sprite(Math.floor(Math.random() * canvas.width), -ballInfo.h * 3, ballInfo.w, ballInfo.h, ballInfo.cw, ballInfo.ch);
        ball.dropSpeed = 20;

        let d = Math.floor(Math.random() * 2);
        let xSpeed = Math.floor(Math.random() * 200 + 50);
        if (d) {
            ball.vx = xSpeed;
        } else {
            ball.vx = -xSpeed;
        }
        
        // ball.vx = Math.min(canvas.width, 1500);
        // ball.vx = 25000;
        balls.push(ball);
    }
}

function bounceBalls() {
    for (let i = 0; i < balls.length; ++i) {
        balls[i].x += balls[i].vx * delta;
        balls[i].y += balls[i].vy * delta;
        balls[i].vy += G * delta * balls[i].dropSpeed;

        if (balls[i].y + balls[i].h >= canvas.height) {
            balls[i].vy = -Math.floor(Math.random() * 250 + 300);
        }
        
        if (balls[i].vx > 0) {
            if (balls[i].x > canvas.width + 10) {
                balls[i].x = -balls[i].w;
                balls[i].vx = Math.floor(Math.random() * 200 + 50);
            }
        } else {
            if (balls[i].x + balls[i].h < -10) {
                balls[i].x = canvas.width + balls[i].w + 10;
                balls[i].vx = -Math.floor(Math.random() * 200 + 50);
            }
        }
        
    }
}

function drawBall() {
    for (let i = 0; i < balls.length; ++i) {
        balls[i].draw(ctx, images['ball_' + balls[i].id].obj.img);
    }
}

function addMoney() {
    if (moneyList.length < moneyLimit) {
        let money = new Sprite(moneyList.length * moneyInfo.w + dropPadding, 0, moneyInfo.w, moneyInfo.w, moneyInfo.cw, moneyInfo.ch);

        // if (moneyList.length == 10) money.dropSine = 1;
        
        moneyList.push(money);
        resetMoney(moneyList.length - 1);
    }
}

function drawMoney() {
    for (let i = 0; i < moneyList.length; ++i) {
        moneyList[i].draw(ctx, images.money.obj.img);
    }
}

function dropMoney() {
    for (let i = 0; i < moneyList.length; ++i) {
        moneyList[i].y += moneyList[i].vy * delta;
        moneyList[i].vy += G * delta * moneyList[i].dropSpeed;

        if ( moneyList[i].dropSine == 1) {
            moneyList[i].x = moneyList[i].ox + Math.sin(moneyList[i].t) * 100;;
            moneyList[i].t += 1 * delta;
        }

        if (moneyList[i].y > canvas.height) {
            resetMoney(i);
        }
    }    
}

function resetMoney(i) {
    moneyList[i].dropSpeed = Math.floor(Math.random() * 10) + 1;
    moneyList[i].dropSine = Math.floor(Math.random() * 2);
    moneyList[i].x = Math.floor(Math.random() * (canvas.width - moneyList[i].w - 10));
    moneyList[i].y = -moneyList[i].h * moneyList[i].dropSpeed;
    moneyList[i].vy = 0;
}

function checkCollision(r1, r2) {
   return r1.x + r1.w >= r2.x && r1.x <= r2.x + r2.w && r1.y + r1.h >= r2.y && r1.y <= r2.y + r2.h;
}

function collisionUpdate() {
    for (let i = 0; i < moneyList.length; ++i) {
        if (checkCollision(pig, moneyList[i])) {
            resetMoney(i);
        }
    }
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

function shuffleArr (array) {
    for (var i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]]
    }
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function drawPig() {
    pig.draw(ctx, images.pig.obj.img);
}

function update() {
    pig.update(canvas.width, delta, friction);
    dropMoney();
    bounceBalls();
    pig.addForce(forceD, delta, 10);
    collisionUpdate();

    if (balls.length < 8) {
        T += 1 * delta;
        if (Math.floor(T) % 10 == 0) {
            T++;
            addBall();
        }
    }
    
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    if (!gameover) {
        if (assets.loaded == assets.count) {
            if (gameStart) {
                // bg
                ctx.drawImage(images.bg.obj.img, 0, 0, 927, 429, 0, 0, canvas.width, canvas.height);
                // ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawPig();
                drawMoney();
                drawBall();
                update();
            } else {
            
                // ctx.drawImage(images.splash.obj.img, 0, 0, 927, 429, 0, 0, canvas.width, canvas.height);

                // ctx.beginPath();
                // ctx.rect(btnBegin.x, btnBegin.y, btnBegin.w, btnBegin.h);
                // ctx.stroke();

            }
        }

        requestAnimationFrame(gameCycle);
    }

    
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);

// background: radial-gradient(230.54% 170.41% at 52.89% 16.21%, #F8E7CD 0%, #FEB466 100%);

// background: radial-gradient(182.95% 83.61% at 50% -16.47%, #4ED20E 0%, #59DC19 65.07%, #48CC08 100%);
