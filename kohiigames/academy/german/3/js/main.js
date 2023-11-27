const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');

var instrucions = document.getElementById("game-instructions");


// delta time
var last = 0;
var delta = 0;

// game start
var startGame = false; // orientation prep
var gameStart = true; // start game
var gameover = false;

// mouse 
var mDown = false;
var rDown = false;
var lDown = false;

// timer
var timer = null;

// scale
var scaleX = 1;
var scaleY = 1;

var cards = [];

const cardInfo = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    rotationSpeed: 200,
    lineWidth: 40
}

colors = ['#FEE1D4', '#D0E8F2', '#DAEEC9', '#FFF7D3', '#FFE9E7', 
    '#fbf3d0', '#f4e477', '#bc9640', '#fed4d7', '#fe9ba3', '#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94'];

var cardCount = 10;
var startIdx = 0;
var currCard = cardCount - 1;

var zIndexList = [];

var G = 9.81 * 100;
var score = 0;
var multiplier = 1;
var negativeMultiplier = 1;

var points = [];
var jump = 0;
var jumpHeight = 50;
var jumpSpeed = 25;

var jumpPoint = {
    x: 0,
    y: 0
}

var scoreTxt = null;
var finalScoreTxt = null;

var progress = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
}

var answers = [];

var gameoverImageInfo = {};
var gameDuration = 180;
var timerTick = 0;
var progressLength = 0;
var progressTotalLength = 0;
var progressLimit = {};

var birdInfo = {
    w: 713 * 0.45,
    h: 541 * 0.45,
    bounceF: -800,
    speed: 100,
    moveXSpeed: 1300
}

var cloudInfo = {
    w: 500,
    h: 100,
    cw: 390,
    ch: 190,
    drop: 100,
    speed: 100
}

var bird = null;
var clouds = [];
var dropCloudsT = 0;
var dropSpeed = 0;

var currColor = 0;
var bgColor = ['#9feafe', '#f8d780', '#f99e81', '#71c2f8', '#6886e8', '#a25de0', '#8b3a88', '#190d28'];
var bgTransition = {
    prev: null,
    next: null,
    curr: '#9feafe',
    t: 1,
    ptr: 0
}

var totalHeightReached = 0;
var levelThreshold = 3000;
var level = 0;

var coins = [];
var coinInfo = {
    w: 39 * 4,
    h: 41 * 4
}
const totalCoins = 3;

var currBirdKey = 'bird_fly';

// #9feafe
// #f8d780
// #f99e81
// #71c2f8
// #6886e8
// #a25de0
// #8b3a88
// #190d28

// 1792 922

// #fb2121 - red
// #C7FC12 - lime
/*
 * GAME INITIATLIZATIONS AND CONTROLS
 */
function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    canvas.style.display = 'block';
    instrucions.style.display = 'none';

    scaleX = w / 1792;
    scaleY = h / 922;

    birdInfo.w *= scaleX;
    birdInfo.h *= scaleX;
    birdInfo.moveXSpeed *= scaleX;

    cloudInfo.w *= scaleX;
    cloudInfo.h *= scaleX;
    cloudInfo.speed *= scaleX;
    coinInfo.w *= scaleX;
    coinInfo.h *= scaleX;

    // console.log( cloudInfo.speed)

    G *= scaleY;
    birdInfo.bounceF = -h / 2;
    console.log(birdInfo.bounceF)

    progressTotalLength = w * 2 + h * 2;

    progressLimit.top = w;
    progressLimit.right = progressLimit.top + h;
    progressLimit.bottom = progressLimit.right + w;
    progressLimit.left = progressLimit.bottom + h;

    progress.top = 0;
    progress.right = 0;
    progress.bottom = 0;
    progress.left = 0;

    bird = new Sprite(w / 2 - birdInfo.w / 2, h - birdInfo.h * 10, birdInfo.w, birdInfo.h, AM.images.bird_fly_1.cw, AM.images.bird_fly_1.ch);
    // bird.initialVel = 0;

    initGameoverImageInfo(5, 5);
    init();

    cloudInfo.drop = Math.sqrt(2 * (h / 2) * G) * 5.5;

    controls();
    
    gameCycle();
}

function init() {
    score = 0;

    scoreTxt = new Text(ctx, canvas.width, canvas.height);
    scoreTxt.setScale(scaleX, scaleY);
    
    finalScoreTxt = new Text(ctx, canvas.width, canvas.height);
    finalScoreTxt.setScale(scaleX, scaleY);
    
    setFinalScoreText();

    finalScoreTxt.addText('finalscoreLabel', 'YOU SCORED', 'bold', 30, 'Montserrat', 0, 0, 800, 45, '#fff', true);
    finalScoreTxt.follow('finalscoreLabel', canvas.width / 2 - finalScoreTxt.texts['finalscoreLabel'].w / 2, canvas.height / 2 - finalScoreTxt.texts['finalscoreLabel'].h * 1.3, 0, 0);

    generateClounds();
    generateCoins();
}

function updateScore() {
    scoreTxt.addText('score', zeroPad(score, 2), 'bold', 30, 'Montserrat', 0, 0, 200, 45, '#fff', true);
    scoreTxt.follow('score', canvas.width / 2 - scoreTxt.texts['score'].w / 2, scoreTxt.texts['score'].h / 1.8, 0, 0);
}

function displayScore() {
    updateScore();
    scoreTxt.draw('score');
}

function addCoin() {
    let rngY = Math.floor(Math.random() * canvas.height);
    let coin = new Sprite(getRandomCoinX(), rngY, coinInfo.w, coinInfo.h, AM.images.coin.cw, AM.images.coin.ch);
    coins.push(coin);
}

function reinitCoin(coin) {
    let nextY = -Math.floor(Math.random() * canvas.height) - coinInfo.h * 2;
    coin.x = getRandomCoinX();
    coin.y = nextY;
}

function drawCoins() {
    for (let i = 0; i < coins.length; ++i) {
        coins[i].drawTwist(ctx, AM.images.coin.img);
        coins[i].twist(delta, 20, () => {
            reinitCoin(coins[i]);
        });

        if (coins[i].twistT == 0 && checkCoinCollision(coins[i])) {
            // console.log('collide')
            coins[i].twistT = 3;
            coins[i].twistT2 = 0;
            coins[i].twistJump = -10;
        }
    }
}

function checkCoinCollision(coin) {
    const { x, y, w, h } = coin;
    return bird.x + bird.w >= x && bird.x <= x + w && bird.y + bird.h >= y && bird.y <= y + h;
}

function generateCoins() {
    for (let i = 0; i < totalCoins; ++i) {
        addCoin();
    }
}

function initColorInterpolation() {
    let p1 = bgTransition.ptr;

    if (p1 < bgColor.length - 1) {
        let c1 = bgColor[p1];
        let c2 = bgColor[p1 + 1];
        bgTransition.prev = hexToRgb(c1);
        bgTransition.next = hexToRgb(c2);
        bgTransition.t = 0;
        bgTransition.ptr++;
    }
    
}

function interpolateColors() {
    if (bgTransition.t < 1) {
        let r = lerp(bgTransition.prev.r, bgTransition.next.r, bgTransition.t);
        let g = lerp(bgTransition.prev.g, bgTransition.next.g, bgTransition.t);
        let b = lerp(bgTransition.prev.b, bgTransition.next.b, bgTransition.t);

        bgTransition.curr = rgbToHex(r, g, b);

        bgTransition.t += 0.1 * delta;
        if (bgTransition.t >= 1) {
            bgTransition.t = 1;
        }
    }
}

function getRandomCoinX() {
    let maxX = canvas.width - cloudInfo.w;
    let rng = Math.floor(Math.random() * maxX);
    return rng;
}

function getRandomCloudX() {
    let maxX = canvas.width - cloudInfo.w;
    let rng = Math.floor(Math.random() * maxX);
    return rng;
}

function moveCloud(i) {
    if (delta < 1) {
        clouds[i].x += clouds[i].direction * delta * clouds[i].speed;
        
        if (clouds[i].x + clouds[i].w > canvas.width) {
            clouds[i].x = canvas.width - clouds[i].w;
            clouds[i].direction *= -1;
        } else if (clouds[i].x < 0) {
            clouds[i].x = 0;
            clouds[i].direction *= -1;
        }
    }
}

function setCloudMove(c) {
    let cloudMoveRng = Math.floor(Math.random() * 100) + 1;
    if (cloudMoveRng > 70) {
        c.direction = Math.floor(Math.random() * 3) - 1;
    } else {
        c.direction = 0;
    }
}

function getPhrase() {
    let chance = Math.floor(Math.random() * 100);
    let n = Object.keys(PHRASES).length;
    let rng = Math.floor(Math.random() * n);

    if (chance > 30) {
        rng = 1;
    }

    let list = Object.values(PHRASES)[rng];

    let nPhrases = Object.keys(list).length;
    let rng2 = Math.floor(Math.random() * nPhrases);

    // let rng3 = Math.floor(Math.random() * n);
    let phrase = '';
    // let flag = true;

    if (raffleChance(50)) {
        let tmp = (Object.values(list)[rng2]).split(" ");
        // let gender = Object.keys(PHRASES)[Math.floor(Math.random() * n)];

        // if (gender != tmp[0]) {
        //     flag = false;
        // }
        
        // phrase = gender + ' ' + tmp[1];
        phrase = tmp[1];
    } else {
        // phrase = Object.keys(PHRASES)[rng3] + ' ' + Object.keys(list)[rng2];
        phrase = Object.keys(list)[rng2];
    }
    

    return {
        phrase: phrase,
        result: rng == 1
    }
}

function addCloud(y) {
    let cloud = new Sprite(getRandomCloudX(), y, cloudInfo.w, cloudInfo.h, cloudInfo.cw, cloudInfo.ch);
    cloud.clipX = 310;
    setCloudMove(cloud);
    
    
    cloud.speed = Math.floor(Math.random() * cloudInfo.speed) + cloudInfo.speed;

    cloud.initText(ctx, canvas.width, canvas.height, scaleX, scaleY);
    // let phrase = getPhrase();
    // cloud.setText(phrase.phrase, 30, 'bold', 50, 20, '#594D5B');
    // cloud.showText = true;
    // cloud.direction = 1;
    clouds.unshift(cloud);
}

function setCloudText(cloud) {
    let rng = Math.floor(Math.random() * 100) + 1;

    if (rng > 80) {
        let phrase = getPhrase();
        cloud.setText(phrase.phrase, 30, 'normal', 50, 20, '#E3242B');
        cloud.showText = true;
        cloud.isTextCorrect = phrase.result;
    } else {
        cloud.showText = false;
    }
}

function drawClouds() {
    for (let i = 0; i < clouds.length; ++i) {
        clouds[i].draw(ctx, AM.images.cloud.img);
        clouds[i].displayText();

        if (clouds[i].checkTextCollision(bird)) {
            // console.log('collision');
            if (clouds[i].isTextCorrect) {
                currBirdKey = 'bird_fly';
                bird.stunT = 0;
                score++;
            } else {
                currBirdKey = 'bird_hit';
                bird.stunT = 5;
                score--;
            }

            // console.log(score);
        }

        clouds[i].displayHit(delta, 0.5, G);

        const { x, y, w, h, direction } = clouds[i];

        if (direction) {
            moveCloud(i);
        }

        if (bird.vy > 0) {
            if (bird.x > x && bird.x < x + w && bird.y + bird.h > y && bird.y + bird.h < y + h) {
                
                // bird.vy = birdInfo.bounceF;
                let bounceF = bird.y + bird.h - canvas.height / 2;
                if (bounceF < 0) bounceF = 1;
                bird.vy = -Math.sqrt(2 * bounceF * G);
                bird.y = y - bird.h;
                // console.log(bounceF, bird.vy);
                dropSpeed = cloudInfo.drop;
                // cloudInfo.drop = -bird.vy / 2;
                // clouds[i].vy = cloudInfo.drop;
                dropCloudsT = 0.5;
                // console.log(totalHeightReached);
                if (level < Math.floor(totalHeightReached / levelThreshold)) {
                    initColorInterpolation();
                    level++;
                }
            }
        }

    }
    if (dropCloudsT > 0) {
        for (let i = 0; i < clouds.length; ++i) { 
            clouds[i].y += dropSpeed * delta * 0.05;
            
            if (clouds[i].y > canvas.height) {
                let nextY = clouds[(i + 1) % clouds.length].y;
                // console.log((i + 1) % clouds.length, nextY);
                if (nextY > 0) {
                    nextY = -cloudInfo.h * 2;
                } 
    
                let rng = Math.floor(Math.random() * 10) + 2;
                clouds[i].x = getRandomCloudX();
                clouds[i].y = nextY - (cloudInfo.h * rng);
                // clouds[i].direction = Math.floor(Math.random() * 3) - 1;
                setCloudMove(clouds[i]);
                clouds[i].speed = Math.floor(Math.random() * cloudInfo.speed) + cloudInfo.speed;
                setCloudText(clouds[i]);
            }

            
        }

        for (let i = 0; i < coins.length; ++i) { 
            coins[i].y += dropSpeed * delta * 0.05;
            
            if (coins[i].y > canvas.height) {
                // let nextY = -Math.floor(Math.random() * canvas.height) - coinInfo.h * 2;
                // coins[i].x = getRandomCoinX();
                // coins[i].y = nextY;
                reinitCoin(coins[i]);
            }
        }

        totalHeightReached += dropSpeed * delta * 0.05;

        dropCloudsT -= 1 * delta;
        if (dropCloudsT <= 0) {
            dropCloudsT = 0;
            dropSpeed = 0;
        }
    }
}

function generateClounds() {
    let baseY = canvas.height - cloudInfo.h * 3;
    
    for (let i = 0; i < 15; ++i) {
        let rng = Math.floor(Math.random() * 5) + 2.5;
        baseY -= cloudInfo.h * rng;
        addCloud(baseY);
    }
}

function setFinalScoreText() {
    let l = score.toString().length;
    let mult = score < 0 ? 180 : 200;
    let w = mult * l;
    let h = 70;
    finalScoreTxt.addText('finalscore', score, 'bold', 30, 'Montserrat', 0, 0, w, h, '#fff', true);

    if (score < 0) {
        finalScoreTxt.texts['finalscore'].color = '#fb2121';
    } else if (score == 0) {
        finalScoreTxt.texts['finalscore'].color = '#fff';
    } else {
        finalScoreTxt.texts['finalscore'].color = '#C7FC12';
        // 10aad7
    }

    finalScoreTxt.follow('finalscore', canvas.width / 2 - finalScoreTxt.texts['finalscore'].w / 2, canvas.height / 2, 0, 0);
}

function initGameoverImageInfo(sx, sy) {
    let k = 'happy1';
    gameoverImageInfo[k] = {
        w: AM.images[k].cw * 2.5 * scaleX,
        h: AM.images[k].ch * 2.5 * scaleX,
    }

    gameoverImageInfo[k].x = canvas.width / 2 - gameoverImageInfo[k].w / 2;
    gameoverImageInfo[k].y = canvas.height / 2.5 - gameoverImageInfo[k].h;

    k = 'happy2';
    gameoverImageInfo[k] = {
        w: AM.images[k].cw * 2.5 * scaleX,
        h: AM.images[k].ch * 2.5 * scaleX,
    }

    gameoverImageInfo[k].x = canvas.width / 2 - gameoverImageInfo[k].w / 2;
    gameoverImageInfo[k].y = canvas.height / 2.5 - gameoverImageInfo[k].h;

    k = 'happy3';
    gameoverImageInfo[k] = {
        w: AM.images[k].cw * 2 * scaleX,
        h: AM.images[k].ch * 2 * scaleX,
    }

    gameoverImageInfo[k].x = canvas.width / 2 - gameoverImageInfo[k].w / 2;
    gameoverImageInfo[k].y = canvas.height / 2.5 - gameoverImageInfo[k].h;

    k = 'sad1';
    gameoverImageInfo[k] = {
        w: AM.images[k].cw * 5 * scaleX,
        h: AM.images[k].ch * 5 * scaleX,
    }

    gameoverImageInfo[k].x = canvas.width / 2 - gameoverImageInfo[k].w / 2;
    gameoverImageInfo[k].y = canvas.height / 2.5 - gameoverImageInfo[k].h;
}

function displayGameover() {
    let k = '';

    if (score > 100000) {
        k = 'happy3';
    } else if (score > 25000) {
        k = 'happy2';
    }  else if (score > 0) {
        k = 'happy1';
    } else {
        k = 'sad1'
    }
    // console.log(gameoverImageInfo[k].w, gameoverImageInfo[k].h)
    ctx.drawImage(AM.images[k].img, 0, 0, AM.images[k].cw, AM.images[k].ch, gameoverImageInfo[k].x, gameoverImageInfo[k].y, gameoverImageInfo[k].w, gameoverImageInfo[k].h);
}

function raffleChance(percentage) {
    let arr = [];

    for (let i = 0; i < 100; ++i) {
        arr[i] = i + 1;
    }

    shuffleArr(arr);
    let rng = Math.floor(Math.random() * 100);

    return arr[rng] <= percentage;
}

function progressUpdate(k, limit, prevL) {
    if (progressLength < progressLimit[k]) {
        progress[k] = progressLength - prevL;
        return true;
    } else {
        progress[k] = limit;
    }

    return false;
}

function drawProgress() {
    ctx.save();
    ctx.strokeStyle = '#C7FC12';
    ctx.lineWidth = '5';
    
    if (delta < 1) {
        if (progressUpdate('top', canvas.width, 0)) {
            // ctx.strokeStyle = '#C7FC12';
        } else if (progressUpdate('right', canvas.height, progressLimit.top)) {
            // ctx.strokeStyle = '#FFE095';
        } else if (progressUpdate('bottom', canvas.width, progressLimit.right)) {
            // ctx.strokeStyle = '#f9a139';
        } else if (progressUpdate('left', canvas.height, progressLimit.bottom)) {
            // ctx.strokeStyle = '#fb2121';
        } else {
            setFinalScoreText();
            gameover = true;
        }

        let p = timerTick / gameDuration * 100;
        if (p < 25) {
            ctx.strokeStyle = '#C7FC12';
        } else if (p < 50) {
            ctx.strokeStyle = '#FFE095';
        } else if (p < 75) {
            ctx.strokeStyle = '#f9a139';
        } else {
            ctx.strokeStyle = '#fb2121';
        } 
    }
    
    ctx.beginPath();
    // top
    ctx.moveTo(progress.top, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.stroke();

    // right
    ctx.moveTo(canvas.width, progress.right);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();

    // bottom
    ctx.moveTo(canvas.width - progress.bottom, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();

    // left
    ctx.moveTo(0, canvas.height - progress.left);
    ctx.lineTo(0, 0);
    ctx.stroke();

    ctx.restore();
}

function controls() {
    let mid = canvas.width / 2;
    let prevPos = 0;
    let prevPosY = 0;

    window.addEventListener('blur', () => {
        // muteAllAudio(true);
    });

    window.addEventListener('focus', () => {
        // muteAllAudio(false);
    });

    document.addEventListener('blur', () => {
        // muteAllAudio(true);
    });

    document.addEventListener('focus', () => {
        // muteAllAudio(false);
    });

    document.addEventListener('touchstart', (e) => {
        e.preventDefault();

        if (gameover) {
            // reset();
        } else {
            if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
                var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
                var touch = evt.touches[0] || evt.changedTouches[0];
                prevPos = touch.pageX;
                prevPosY = touch.pageY;
                
                if (!mDown) {
                    mDown = true;
                }
            }
        }
    });

    document.addEventListener('touchend', (e) => {
        e.preventDefault();
        
        if (!gameover) {
            var touch = e.touches[0] || e.changedTouches[0];
            var x = touch.pageX;
            
            // var y = e.changedTouches[event.changedTouches.length-1].pageY;

            if (mDown) {
                mDown = false;
                
            }
        }
    });

    canvas.addEventListener('touchmove', e => {
        // mousemoveE(e.touches[0].clientX, e.touches[0].clientY);
        if (!gameover) {
            if (e.type == 'touchmove') {
                var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
                var touch = evt.touches[0] || evt.changedTouches[0];
                let x = touch.pageX;
                let y = touch.pageY;

                if (gameover) mDown = false;

                if (mDown) {
                    if (x > prevPos) {
                        bird.vx = birdInfo.moveXSpeed;
                        bird.yRotate = 0
                    } else if (x < prevPos) {
                        bird.vx = -birdInfo.moveXSpeed;
                        bird.yRotate = 180
                    }
                }

                prevPos = x;
                prevPosY = y;
            }
        }
    });

    canvas.addEventListener('touchend', e => {
        var touch = e.touches[0] || e.changedTouches[0];
        let x = touch.pageX;
        let y = touch.pageY;

        if (!gameStart) {
            
            gameStart = true;
        } 

        if (mDown) {
            // console.log(prevPos, x)
            bird.vx = 0;
        }

        if (gameover) {
            // reset();
        }
        
    });

    canvas.addEventListener('mousedown', e => {
        let mx = e.offsetX;
        let my = e.offsetY;

        if (!mDown) {
            if (gameStart) {
                mDown = true;
            }
        }

        
    });


    canvas.addEventListener('mousemove', e => {
        let mx = e.offsetX;
        let my = e.offsetY;

        if (gameover) mDown = false;

        if (mDown) {
            prevPos = mx;
            prevPosY = my;
        }
    });
    
    canvas.addEventListener('mouseup', e => {
        if (mDown) {
            if (!gameStart) {
                gameStart = true;
            }

            mDown = false;

            if (gameover) {
                // reset();
            }
        }
    });

    document.addEventListener('keydown', e => {
        if (!gameover) {

            if (e.key == 'ArrowRight') {
                if (!rDown) {
                    rDown = true;
                    bird.vx = birdInfo.moveXSpeed;
                    bird.yRotate = 0;
                    // cards[1].startRotation = true;
                    // cards[1].rotationVel = cardInfo.rotationSpeed;
                }
            } else if (e.key == 'ArrowLeft') {
                if (!lDown) {
                    lDown = true;
                    bird.vx = -birdInfo.moveXSpeed;
                    bird.yRotate = 180;
                    // cards[1].startRotation = true;
                    // cards[1].rotationVel = -cardInfo.rotationSpeed;
                }
            }
        }
        
    });

    document.addEventListener('keyup', e => {
        if (!gameover) {
            if (e.key == 'ArrowRight') {
                rDown = false;
                bird.vx = 0;
                
            } else if (e.key == 'ArrowLeft') {
                lDown = false;
                bird.vx = 0;
            }
        }
    });
}

// *********************************** GAME INITIATLIZATIONS AND CONTROLS END ******************************************************** //


/*
 * PHYSICS
 */

function checkAngledCollisions(obj1, obj2) {
    return doPolygonsIntersect(
        [{ x: obj1.x, y: obj1.y }, { x: obj1.x + obj1.w, y: obj1.y }, { x: obj1.x + obj1.w, y: obj1.y + obj1.h }, { x: obj1.x, y: obj1.y + obj1.h }],
        [{ x: obj2.x, y: obj2.y }, { x: obj2.x + obj2.w, y: obj2.y }, { x: obj2.x + obj2.w, y: obj2.y + obj2.h }, { x: obj2.x, y: obj2.y + obj2.h }]
    );
}

// *********************************** PHYSICS END ******************************************************** //
function doPolygonsIntersect (a, b) {
    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {

        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {

            // grab 2 vertices to create an edge
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];

            // find the line perpendicular to this edge
            var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

            minA = maxA = null;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (minA == null || projected < minA) {
                    minA = projected;
                }
                if (maxA == null || projected > maxA) {
                    maxA = projected;
                }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = null;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (minB == null || projected < minB) {
                    minB = projected;
                }
                if (maxB == null || projected > maxB) {
                    maxB = projected;
                }
            }

            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            if (maxA < minB || maxB < minA) {
                // CONSOLE("polygons don't intersect!");
                return false;
            }
        }
    }
    return true;
}
/*
 * TEXT DISPLAYS
 */
// function showPoints(pointType) {
//     // HUD.draw(ctx, AM.images.timecircle.img);
//     // jumpPointsT += 1 * delta;
//     if (jump > 0) {
//         let y = eelHead.y + jump - eelHead.h;
//         TXT.follow('points', eelHead.x, y, eelHead.w, eelHead.h);
//         TXT.draw('points');
//         jump -= G * jumpSpeed * delta;
//     }
// }

// function setPoints(points, color) {
//     jump = jumpHeight;
//     TXT.texts['points'].color = color;
//     TXT.texts['points'].str = points;
// }

// *********************************** TEXT DISPLAYS END ******************************************************** //


/*
 * SOUNDS
 */
function playCry() {
    // if (HUD.volumeOn) {
        // AM.audio.cry.img.pause();
        // AM.audio.cry.img.currentTime = 0;
        
        setTimeout(() => {
            AM.audio.cry.img.currentTime = 0;
            AM.audio.cry.img.play();
        }, 0);
    // }
}

// function playEat() {
//     if (HUD.volumeOn) {
//         AM.audio.eat.img.pause();
//         AM.audio.eat.img.currentTime = 0;
//         AM.audio.eat.img.play();
//     } 
// }

function playScore() {
    // if (HUD.volumeOn) {
        // AM.audio.score.img.pause();
        // AM.audio.score.img.currentTime = 0;
        setTimeout(() => {
            // AM.audio.score.img.pause();
            AM.audio.score.img.currentTime = 0;
            AM.audio.score.img.play();
        }, 0);
        
    // }
}

// function playBonus() {
//     if (HUD.volumeOn) {
//         AM.audio.bonus.img.pause();
//         AM.audio.bonus.img.currentTime = 0;
//         AM.audio.bonus.img.play();
//     }
// }

// *********************************** SOUNDS END ******************************************************** //

// #11A5CC
// #F8E7CD
/*
 * GAME UPDATES AND CYCLES
 */
function drawBird() {
    let key = currBirdKey + '_2';

    if (bird.vy >= 0) {
        key = currBirdKey + '_1';
    }

    if (bird.stunT > 0) {
        bird.stunT -= 2 * delta;
        if (bird.stunT <= 0) {
            bird.stunT = 0;
            currBirdKey = 'bird_fly';
        }
    }

    bird.drawFlipY(ctx, AM.images[key].img);
}

function update() {
    if (delta < 1) {
        // bird.y += bird.vy * birdInfo.speed * delta;
        bird.x += bird.vx * delta;
        bird.y += bird.vy * delta;

        if (bird.x > canvas.width) {
            bird.x = -bird.w;
        } else if (bird.x + bird.w < 0) {
            bird.x = canvas.width;
        }
        
        if (bird.y + bird.h >= canvas.height) {
            gameover = true;
            setFinalScoreText();
            
            bird.y = canvas.height - bird.h - 1;
            bird.vy = -Math.sqrt(2 * -birdInfo.bounceF * G);
            
            // console.log(bird.initialVel)
            // bird.vy = birdInfo.bounceF;
            // bird.vy = birdInfo.bounceF;
        } else {
            // bird.vy += G;
            bird.vy += G * delta;
            
        }

        

        if (timerTick >= gameDuration) {
            gameover = true;
            setFinalScoreText();
        }

        let p = timerTick / gameDuration;

        interpolateColors();

        progressLength = p * progressTotalLength;
        if (progressLength >= progressTotalLength) {
            progressLength = progressTotalLength;
        }

        timerTick += 1 * delta;
    }
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    if (!gameover) {
        if (gameStart) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.fillStyle = bgTransition.curr;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();

            displayScore();

            drawClouds();
            drawCoins();

            drawProgress();

            

            drawBird();
            update();
        }
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        displayGameover();

        finalScoreTxt.draw('finalscoreLabel');
        finalScoreTxt.draw('finalscore');
    }

    requestAnimationFrame(gameCycle);
}
// *********************************** GAME UPDATES AND CYCLES END ******************************************************** //

