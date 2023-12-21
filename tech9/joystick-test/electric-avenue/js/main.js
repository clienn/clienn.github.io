const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');

var instrucions = document.getElementById("game-instructions");


// delta time
var last = 0;
var delta = 0;

// game start
var startGame = false; // orientation prep
var gameStart = false; // start game
var gameover = false;

// mouse 
var mDown = false;
var rDown = false;
var lDown = false;
var uDown = false;
var dDown = false;
var keyDown = false;

// timer
var timer = null;

// scale
var scaleX = 1;
var scaleY = 1;


// 1792 922

// sprite info
var gopherHideInfo = {
    w: 106,
    h: 54,
    // w: 53,
    // h: 27,
}


// srpite containers
var fishes = [];


// limits
var health = 100;
var fishMaxSpeed = 300;
var fishMinSpeed = 50;
var garbageDropSpeed = 500;

// physics
var forceD = 0;
var friction = 0.98;
var F = 600;
var T = 0;
var G = 9.8;
var kaboomT = 0;


// HUD
var HUD = null;
var volumeOn = true;
var bg = null;
var bg_rect = null;


// TXT
var TXT = null;
var jumpSpeed = 20;
var jumpHeight = 100;
var jump = 0;
var score = 0;


var gameDuration = 25;

var startScreenTimerAnimT = 0;
var startScreenHandAnimT = 0;

var startPage = {
    title: {
        x: 0,
        y: 10,
        w: 467 * 2,
        h: 160 * 2,
    },
    sub_title: {
        x: 0,
        y: 25,
        w: 366 * 2,
        h: 19 * 2,
    },
    text1: {
        x: 400,
        y: 0,
        w: 94 * 2,
        h: 34 * 2,
    },
    text2: {
        x: 780,
        y: 0,
        w: 124 * 2,
        h: 34 * 2,
    },
    text3: {
        x: 1200,
        y: 0,
        w: 154 * 2,
        h: 37 * 2,
    },
}

var fishInfo = {};
var schoolFishInfo = {};
var garbageInfo = {};

var eelInfo = {
    head: {
        x: 0,
        y: 0,
        // w: 124,
        // h: 185,
        w: 505 * 1,
        h: 454 * 1,
    },
    neck: {
        x: 0,
        y: 0,
        w: 64,
        // h: 227 * 1.25,
        w: 505 * 1,
        h: 454 * 1,
    }
}

var FACE = {
    LEFT: -1,
    RIGHT: 1,
}

let divingFish = 0;

var school = [];

var schools = [];
var smartSwimmers = [];

var garbage = [];

var eelHead = null;
var eelNeck = null;
var eelNeck2 = null;

var eelLookAt = [0, 0];
var originCoordRotation = [];


var eelDirectionSpeed = 160 * 0.75;
var eelDirection = eelDirectionSpeed;
var returnSpeed = -240 * 0.75;
var isHunting = false;
var isNeutral = true;

var neckAdjY = 90;
// 183.92px height eel head
// #C7FC12

var eel_hitbox = {
    x: 0,
    y: 0,
    w: 124,
    h: 185
};

var eelStatusEnum = {
    NORMAL: 0,
    EAT: 1,
    DIZZY: 2,
    CHARGED: 3,
};

var eelExpressionKeys = [
    'eel_head_normal', 'eel_head_eat', 'eel_head_dizzy', 'eel_head_charged', 
];

var eelStatus = eelStatusEnum.NORMAL;
var eelExpressionT = 0;
var expressionDuration = 3;

var mouseMoveOrigin = {
    x: 0,
    y: 0
};

var eelLowestPosY = 0;
var eelMoveUpSpeed = 10;

var joystick = null;
var onMobile = isMobile();

const startingBatteryLife = 20;
/*
 * GAME INITIATLIZATIONS AND CONTROLS
 */
function main(w, h) {
    //
    canvas.width = w;
    canvas.height = h;

    canvas.style.display = 'block';
    instrucions.style.display = 'none';

    scaleX = w / 1792;
    scaleY = h / 922;

    eelMoveUpSpeed *= scaleY;

    G *= scaleY;
    F *= scaleX;
    fishMaxSpeed *= scaleX;
    fishMinSpeed *= scaleX;
    garbageDropSpeed *= scaleY;

    if (isMobile()) {
        eelDirectionSpeed = 100 * 0.75;
        returnSpeed = -140 * 0.75;
    }

    neckAdjY *= scaleY;

    TXT = new Text(ctx, w, h); 
    // TXT.setScale(scaleX, scaleY); 
    // TXT.addText('angle', '000.000000', 'normal', 20, 'Montserrat', w / 2, 0, 300, 100, '#fff', true);

    TXT.addText('points', '+1.00', 'bold', 20, 'Montserrat', 0, 0, 80, 30, '#C7FC12', true); 
    jumpHeight *= scaleY;
    // console.log(TXT.texts);
    
    
    setFishInfo(scaleX, scaleX, 2.5);
    setSchoolFishInfo(scaleX, scaleX, 0.5);
    setGarbageInfo(scaleX, scaleX, 0.5);
    rescaleSize(eelInfo.head, scaleX, scaleX);
    rescaleSize(eelInfo.neck, scaleX, scaleX);
    rescaleSize(eel_hitbox, scaleX, scaleX);

    // eelInfo.neck.h = w;

    eelLookAt[0] = w / 2;
    originCoordRotation[0] = w / 2;
    originCoordRotation[1] = h;

    eelInfo.head.x = w / 2 - eelInfo.head.w / 2;
    // eelInfo.head.y = h - eelInfo.head.h * 1.5;
    // eelInfo.head.y = h - eelInfo.head.h ;
    eelInfo.head.y = h - eelInfo.neck.h;

    // eelHead = new Sprite(eelInfo.head.x, eelInfo.head.y, eelInfo.head.w, eelInfo.head.h, AM.images['eel_head2'].cw, AM.images['eel_head2'].ch); 
    eelHead = new Sprite(eelInfo.head.x, eelInfo.head.y + 100 * scaleY, eelInfo.head.w, eelInfo.head.h, AM.images['eel_head_charged'].cw, AM.images['eel_head_charged'].ch); 
    // eelNeck = new Sprite(w / 2 - eelInfo.neck.w / 2, eelInfo.head.y + neckAdjY, eelInfo.neck.w, eelInfo.neck.h, AM.images['eel_neck2'].cw, AM.images['eel_neck2'].ch); 
    eelNeck = new Sprite(w / 2 - eelInfo.neck.w / 2, eelInfo.head.y + neckAdjY, eelInfo.neck.w, eelInfo.neck.h, AM.images.eel_neck.cw, AM.images.eel_neck.ch); 
    eel_hitbox.y = eelHead.y + 50 * scaleY;
    updateHitBox();
    initStartPage();

    let fishWidth = 102.9 * 1.5 * scaleX;
    startPage.text2.x += 100 * scaleX;
    let totalInstructionW = (startPage.text1.x - fishWidth) + startPage.text2.x + startPage.text2.w;
    let adjX = w / 2 - totalInstructionW / 2;
    startPage.text1.x += adjX;
    startPage.text2.x += adjX;

    TXT.addText('instruction1', 'Gobble up the fish.', 'normal', 20, 'Montserrat', startPage.text1.x, startPage.text1.y, 270 * scaleX, 30 * scaleX, '#fff', false);
    TXT.addText('instruction1_2', '+3', 'bold', 20, 'Montserrat', startPage.text1.x, startPage.text1.y + 40 * scaleY, 30 * scaleX, 30 * scaleX, '#C7FC12', false);
    TXT.addText('instruction2', 'Avoid the trash.', 'normal', 20, 'Montserrat', startPage.text2.x, startPage.text1.y, 230 * scaleX, 30 * scaleX, '#fff', false);
    TXT.addText('instruction2_2', '-20', 'bold', 20, 'Montserrat', startPage.text2.x, startPage.text1.y + 40 * scaleY, 50 * scaleX, 30 * scaleX, '#FF4C4C', false);

    eelLowestPosY = eelHead.y;

    // TXT = new Text(ctx, w, h); 
    // TXT.setScale(scaleX, scaleY);
    
    // TXT.addText('points', '+1.00', 'bold', 20, 'Montserrat', 0, 0, 80, 30, '#10aad7', true); 
    jumpHeight *= scaleY;

    timer = new Timer(0, 0, 0, '#fff');
    timer.setTimer(gameDuration);



    // HUD = new Sprite(0, 0, 45, 45, AM.images.timecircle.cw, AM.images.timecircle.ch);
    HUD = new Template_1(ctx, w, h, scaleX, scaleY);
    
    controls();

    // AM.audio.bg.img.volume = 0.2;
    // AM.audio.bg.img.loop = true;
    // AM.audio.bg.img.play();

    addFish();
    addFish();
    addFish();
    // addFish();
    // addFish();

    let rng = Math.floor(Math.random() * 8);
    let key = 'fish_' + rng;
    // let rngY = Math.floor(Math.random() * (canvas.height - fishInfo[4].h));
    // divingFish = new Sprite(0, h / 2 - fishInfo[4].h / 2, fishInfo[4].w / 2, fishInfo[4].h / 2, AM.images[key].cw, AM.images[key].ch);
    // divingFish.setDirection(FACE.RIGHT);

    // divingFish.vx = 180;

    let fishW = schoolFishInfo[rng].w * 0.25;
    let fishH = schoolFishInfo[rng].h * 0.25;

    schools[0] = [];
    schools[1] = [];
    
    let px = (20) * fishW;
    for (let i = 0; i < 10; ++i) {
        let f = new Sprite(i * (fishW) - px, h / 2 - fishH / 2, fishW, fishH, AM.images[key].cw, AM.images[key].ch);
        f.setDirection(FACE.RIGHT);
        f.vx = 100 * scaleX;
        f.flippingSpeed = 25;
        f.id = rng;
        schools[0].push(f);
    }

    px = (10) * fishW;
    for (let i = 0; i < 5; ++i) {
        let f = new Sprite(w + i * (fishW), h / 3 - fishH / 2, fishW, fishH, AM.images[key].cw, AM.images[key].ch);
        f.setDirection(FACE.LEFT);
        f.vx = -100 * scaleX;
        f.flippingSpeed = 25;
        f.id = rng;
        // f.yRotate = 45;
        schools[1].push(f);
    }

    addSmartFish();
    addSmartFish();
    // addSmartFish();
    // addSmartFish();
    // addSmartFish();

    addGarbage();
    addGarbage();
    addGarbage();
    addGarbage();
    addGarbage();
    addGarbage();
    addGarbage();

    let joystickX = w * 0.15;
    let joystickY = h * 0.75;
    
    joystick = new Joystick(joystickX, joystickY, 150 * 0.90 * scaleX);
    var url_string = location.href; 
    var url = new URL(url_string);
    var isOn = url.searchParams.get("on");
    if (isOn == null) isOn = 1;
    joystick.on = parseInt(isOn);
    
    gameCycle();
}

function moveUp(d) {
    let val = eelHead.y - d;

    if (val > canvas.height * 0.25 && val < eelLowestPosY) {
        eelHead.y = val;
        eelNeck.y -= d * 2;
        eel_hitbox.y -= d;
        eelNeck.h += d * 2;
    }
}

function updateHitBox() {
    eel_hitbox.x = eelHead.x + eelHead.w / 2 - eel_hitbox.w / 2;
    
    // ctx.beginPath();
    // ctx.rect(eel_hitbox.x, eel_hitbox.y, eel_hitbox.w, eel_hitbox.h);
    // ctx.stroke();
}

function drawEel() {
    
    // eelNeck.drawWithRotation(ctx, AM.images.eel_neck2.img, eelNeck.w / 2, eelHead.h - neckAdjY);
    let key = eelExpressionKeys[eelStatus];
    eelNeck.drawWithRotation(ctx, AM.images.eel_neck.img, eelNeck.w / 2, eelHead.h - neckAdjY);
    eelHead.drawWithRotation(ctx, AM.images[key].img, eelHead.w / 2, eelHead.h);
    
    // eelNeck.drawWithRotation(ctx, AM.images.eel_neck2.img, eelNeck.w / 2, eelNeck.h / 2);

    // if (eelHead.vx || eelHead.vy) {
        // let max = Math.max(Math.abs(eelHead.vx), Math.abs(eelHead.vy));
        // eelNeck.h += 10 * 30 * delta;
    // }

    // eelHead.updatePos(delta, eelDirection);
    // eelNeck.updatePos(delta, eelDirection);
    
    // if (!mDown || (joystick.active && joystick.prevMx == joystick.mx)) {
    if (!mDown) {
        eelHead.moveEel(canvas.width, delta, eel_hitbox, updateHitBox);
        eelNeck.x = eelHead.x + eelHead.w / 2 - eelNeck.w / 2;
    }
    
    updateHitBox();
    // if (!isNeutral) {
    //     if (isHunting) {
    //         let dx = eelHead.x + eelHead.w / 2 - eelLookAt[0];
    //         let dy = eelHead.y - eelLookAt[1];
    
    //         let dist = Math.sqrt(dx * dx + dy * dy);

    //         // TXT.texts['angle'].str = dist.toFixed(2) + ", " + (eelHead.h / 2).toFixed(2);
    //         if (eelHead.x + eelHead.w / 2 >= canvas.width || eelHead.x <= 0 || eelHead.y <= 0) {
    //             eelDirection = returnSpeed;
    //             isHunting = false;
    //         }
    //         // if (eel_hitbox.x + eel_hitbox.w / 2 >= canvas.width || eel_hitbox.x <= 0 || eel_hitbox.y <= 0) {
    //         //     eelDirection = returnSpeed;
    //         //     isHunting = false;
    //         // }
    //     } else {
    //         if (eel_hitbox.y + eel_hitbox.h > canvas.height) {
    //             eelHead.reset();
    //             eelNeck.reset();
    //             isNeutral = true;
    //         }
    //     }
    // }
    
    
   
    // eelHead.t += 0.5 * delta;
}

function addGarbage() {
    let rng = Math.floor(Math.random() * 9) + 1;
    let key = 'garbage_' + rng;

    let w = garbageInfo[rng].w * ((Math.floor(Math.random() * 50) + 50) / 100);
    let h = garbageInfo[rng].h * ((Math.floor(Math.random() * 50) + 50) / 100);

    let rngX = Math.floor(Math.random() * canvas.width);
    let rngY = Math.floor(Math.random() * garbageInfo[rng].h * 5) + garbageInfo[rng].h;

    let trash = new Sprite(rngX, -rngY, w, h, AM.images[key].cw, AM.images[key].ch);
    trash.id = rng;
    trash.vy = Math.floor(Math.random() * garbageDropSpeed) + 20;
    trash.maxDegree = Math.floor(Math.random() * 540) + 180;
    trash.hasBounce = Math.floor(Math.random() * 2);
    if (trash.hasBounce) {
        let mid = Math.floor(canvas.height / 2);
        trash.bounceLo = Math.floor(Math.random() * mid) + mid;
        trash.bounceHi = Math.floor(Math.random() * mid) + 1;
    }
    garbage.push(trash);
}

function drawGarbage() {
    for (let i = 0; i < garbage.length; ++i) {
        let key = 'garbage_' + garbage[i].id;
        // garbage[i].draw(ctx, AM.images[key].img);

        let rotPercentage = garbage[i].y / canvas.height;
        garbage[i].degrees = rotPercentage * garbage[i].maxDegree;
        garbage[i].drawWithRotation(ctx, AM.images[key].img, garbage[i].w / 2, garbage[i].h / 2);
        garbage[i].update(delta, 1);

        if (garbage[i].hasBounce) {
            if (garbage[i].bounceLo && garbage[i].y >= garbage[i].bounceLo) {
                garbage[i].vy *= -1;
                garbage[i].bounceLo = 0
            } else if (!garbage[i].bounceLo && garbage[i].bounceHi && garbage[i].y <= garbage[i].bounceHi) {
                garbage[i].vy *= -1;
                garbage[i].bounceHi = 0;
            } else if (!garbage[i].bounceLo && !garbage[i].bounceHi) {
                garbage[i].hasBounce = false;
            }
        }

        if (garbage[i].y > canvas.height) {
            // mutateGarbage(garbage[i]);
            // let rngY = Math.floor(Math.random() * garbage[i].h * 5) + garbage[i].h;
            // garbage[i].y = -rngY;
            // garbage[i].oy = garbage[i].y;
            resetGarbage(garbage[i]);
        } 
        
        // if (checkAngledCollisions(garbage[i], eelHead)) {
        if (checkAngledCollisions(garbage[i], eel_hitbox)) {
            // jump = jumpHeight;
            // TXT.texts['points'].str = '-1.00';
            // setPoints('-20.00','#fb2121');
            setPoints('-20.00','#FF4C4C');
            HUD.updateBattery(-5);
            playCry();

            updateEelStatus(eelStatusEnum.DIZZY, expressionDuration);
            resetGarbage(garbage[i]);
        }

        // else if (isHunting) {
        //     if (checkAngledCollisions(garbage[i], eelHead)) {
        //         resetGarbage(garbage[i]);
                
        //         // jump = jumpHeight;
        //         // TXT.texts['points'].str = '-1.00';
        //         setPoints('-5.00','#fb2121');
                
        //     }
        // }


    }
}

function resetGarbage(trash) {
    mutateGarbage(trash);
    let rngY = Math.floor(Math.random() * trash.h * 5) + trash.h;
    trash.y = -rngY;
    trash.oy = trash.y;
    let rngX = Math.floor(Math.random() * canvas.width);
    trash.x = rngX;
    trash.ox = rngX;
    trash.maxDegree = Math.floor(Math.random() * 540) + 180;
    trash.hasBounce = Math.floor(Math.random() * 2);
    if (trash.hasBounce) {
        let mid = Math.floor(canvas.height / 2);
        trash.bounceLo = Math.floor(Math.random() * mid) + mid;
        trash.bounceHi = Math.floor(Math.random() * mid) + 1;
    }
}

function addSmartFish() {
    let rng = Math.floor(Math.random() * 7);
    let key = 'sfish_' + rng;
    let rngY = Math.floor(Math.random() * (canvas.height - fishInfo[rng].h));
    let rngX = 0;

    let direction = Math.floor(Math.random() * 2) ? FACE.RIGHT : FACE.LEFT;


    let fishScale = (Math.floor(Math.random() * 50) + 50) / 100;
    let fishW = fishInfo[rng].w * fishScale;
    let fishH = fishInfo[rng].h * fishScale;

    if (direction > 0) {
        rngX = -fishInfo[rng].w;
    } else {
        rngX = canvas.width;
    }

    let fish = new Sprite(rngX, rngY, fishW, fishH, AM.images[key].cw, AM.images[key].ch);
    fish.setDirection(direction);
    fish.vx = (Math.floor(Math.random() * 20) + 10) / 100;
    fish.id = rng;
    fish.flippingSpeed = 15;
    fish.dest = [canvas.width / 2, canvas.height / 2];
    // fish.setFrames(fishInfo[rng].frames);
    fish.frames = fishInfo[rng].frames;
    smartSwimmers.push(fish);
}

function drawSmartFishes() {
    for (let i = 0; i < smartSwimmers.length; ++i) {
        let key = 'sfish_' + smartSwimmers[i].id;
        // smartSwimmers[i].dive(ctx, AM.images[key].img);
        // smartSwimmers[i].swim(ctx, AM.images[key].img);
        // smartSwimmers[i].update(delta, 3);
        smartSwimmers[i].smartSwim(ctx, AM.images[key].img);
        smartSwimmers[i].t += smartSwimmers[i].vx * delta;
        // smartSwimmers[i].t2 += 10 * delta;
        smartSwimmers[i].t3 += 10 * delta;

        if (smartSwimmers[i].x > canvas.width || smartSwimmers[i].y > canvas.height) {
            // smartSwimmers[i].mutateFish()
            mutateFish(smartSwimmers[i]);
            
        }
    }
}

function displaySchool() {
    ctx.save();
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < schools.length; ++i) {
        let flag = true;
        let flag2 = true;
        for (let j = 0; j < schools[i].length; ++j) {
            if (schools[i][j].show) {
                let key = 'fish_' + schools[i][j].id;
                schools[i][j].dive(ctx, AM.images[key].img);
                schools[i][j].update(delta, 3);
                schools[i][j].t += 10 * delta;

                if (schools[i][j].facing == FACE.RIGHT) {
                    if (schools[i][j].x > -schools[i][j].w) {
                        schools[i][j].sineMovement(delta);
                        
                        
                    } 
                    flag2 = false;
                    if (schools[i][j].x < canvas.width) {
                        flag = false;
                        // schools[i][j].x = school.length * -20;
                        // mutate(schools[i][j], FACE.RIGHT,  -school.length * 20);
                    } 
                } else if (schools[i][j].facing == FACE.LEFT) {
                    if (schools[i][j].x < canvas.width) {
                        schools[i][j].sineMovement(delta);

                        
                    }
                    
                    flag = false;

                    if (schools[i][j].x > -schools[i][j].w) {
                        flag2 = false;
                        // schools[i][j].x = canvas.width;
                        // mutate(schools[i][j], FACE.LEFT, canvas.width);
                    }
                }

                // if (isHunting) {
                //     if (checkAngledCollisions(schools[i][j], eelHead)) {
                //         // resetFish(i);
                //         schools[i][j].show = false;
                //         // jump = jumpHeight;
                //         // TXT.texts['points'].str = '+1.00';
                //         setPoints('+1.00','#C7FC12');
                //     }
                // }
            }
        }
        
        if (flag) {
            mutateSchool(i);
        }

        if (flag2) {
            mutateSchool(i);
        }
        
    }
    ctx.restore();
}

function mutateSchool(idx) {
    let rng = Math.floor(Math.random() * 8);
    let key = 'fish_' + rng;
    let rngY = Math.floor(Math.random() * (canvas.height - schoolFishInfo[rng].h));

    let direction = Math.floor(Math.random() * 2) ? FACE.RIGHT : FACE.LEFT;

    let px = 0;

    let padding = Math.floor(Math.random() * (canvas.width)) + 100;

    let fishScale = (Math.floor(Math.random() * 10) + 15) / 100;
    let fishW = schoolFishInfo[rng].w * fishScale;
    let fishH = schoolFishInfo[rng].h * fishScale;

    if (direction > 0) {
        px = schools[idx].length * (fishW) + padding;
    } else {
        px = canvas.width + padding;
    }

    let speed = (Math.floor(Math.random() * 100) + 50);
    
    
    let waveHeight = Math.floor(Math.random() * (300)) + 50;
    for (let i = 0; i < schools[idx].length; ++i) {
        schools[idx][i].mutateFish(rng, fishW, fishH, AM.images[key].cw, AM.images[key].ch, direction);
        if (direction > 0) {
            schools[idx][i].x = i * (fishW) - px;
            schools[idx][i].vx = speed;
        } else {
            schools[idx][i].x = px + i * (fishW);
            schools[idx][i].vx = -speed;
        }
        
        schools[idx][i].y = rngY;

        schools[idx][i].t = 0;
        schools[idx][i].t2 = 0;
        schools[idx][i].waveHeight = waveHeight;
        schools[idx][i].show = true;
    }
}

function muteAllAudio(flag) {
    for (let k in AM.audio) {
        AM.audio[k].img.muted = flag;
    }
    
}

function playAllAudio() {
    for (let k in AM.audio) {
        if (k != 'bg') {
            AM.audio[k].img.volume = 0;
            AM.audio[k].img.currentTime = 0;
            AM.audio[k].img.play();
            AM.audio[k].img.pause();
        }
    }
    
}

function mouseMove(x, y, prevX, prevY) {
    if (joystick.active) {
        let dist = x - mouseMoveOrigin.x;
        eelHead.x = eelHead.ox + dist;
        eelHead.updateBounds(canvas.width, eel_hitbox);

        eelNeck.x = eelHead.x + eelHead.w / 2 - eelNeck.w / 2;

        let distX = x - prevX;
        let distY = prevY - y;

        // joystick.totalDistX = eelHead.x - eelHead.ox;

        // joystick.vx = distX;

        joystick.update(distX * 0.5, distY);

        // console.log(joystick.percentageX);

        // joystick.moveByPercentX = canvas.width * joystick.percentageX;

        // eelHead.x = eelHead.ox + joystick.moveByPercentX;
        // eelHead.updateBounds(canvas.width, eel_hitbox);

        // eelNeck.x = eelHead.x + eelHead.w / 2 - eelNeck.w / 2;

        moveUp(distY);
    }
}

function mouseUp() {
    eelHead.updateOriginalPos();
    joystick.touchUp();
}

function controls() {
    let mid = canvas.width / 2;
    let prevPos = 0;
    let prevPosY = 0;
    let isMoving = false;

    window.addEventListener('blur', () => {
        muteAllAudio(true);
    });

    window.addEventListener('focus', () => {
        muteAllAudio(false);
    });

    document.addEventListener('blur', () => {
        muteAllAudio(true);
    });

    document.addEventListener('focus', () => {
        muteAllAudio(false);
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

                if (isBtnClicked(touch.pageX, touch.pageY, {
                    x: HUD.volume.x,
                    y: HUD.volume.y,
                    w: HUD.volume.w,
                    h: HUD.volume.h
                })) {
                    
                    HUD.volumeOn = !HUD.volumeOn; 
                    // console.log('test', HUD.volumeOn)
                    if (HUD.volumeOn) {
                        AM.audio.bg.img.currentTime = 0;
                        AM.audio.bg.img.play();
                    } else {
                        AM.audio.bg.img.pause();
                        // music.correct.obj.volume = 0;
                    }
                }
                
                if (!mDown) {
                    mDown = true;
                    mouseMoveOrigin.x = prevPos;
                    mouseMoveOrigin.y = prevPosY;

                    if (isBtnClicked(touch.pageX, touch.pageY, joystick.hitbox) || !joystick.on) {
                        joystick.active = true;
                    }
                }
            }
        }
    });

    document.addEventListener('touchend', (e) => {
        e.preventDefault();
        
        if (!gameover) {
            var x = e.changedTouches[event.changedTouches.length-1].pageX;

            // if (x >= mid) {
            //     rDown = false;
            // } else {
            //     lDown = false;
            // }

            // if (!rDown && !lDown) {
            //     // forceD = 0;
            //     eelHead.vx = 0;
            // }

            if (mDown) {
                mDown = false;
                // eelHead.updateOriginalPos();
                mouseUp();
                eelHead.vx = 0;
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

                // if (x > prevPos) {
                //     // forceD = F;
                //     eelHead.vx = F;
                // } else  {
                //     // forceD = -F;
                //     eelHead.vx = -F;
                // }
                if (gameover) mDown = false;

                if (mDown) {
                    // let dist = x - mouseMoveOrigin.x;
                    // eelHead.x = eelHead.ox + dist;
                    // eelHead.updateBounds(canvas.width, eel_hitbox);

                    // eelNeck.x = eelHead.x + eelHead.w / 2 - eelNeck.w / 2;

                    // let distY = prevPosY - y;
                    // moveUp(distY);
                    // prevPos = mx;

                    mouseMove(x, y, prevPos, prevPosY);

                    prevPos = x;
                    prevPosY = y;
                }

                
            }
        }
    });

    canvas.addEventListener('touchend', e => {
        // mouseupE();
        // e.preventDefault();
        // var touch = evt.touches[0] || evt.changedTouches[0];
        // let x = touch.pageX;

        if (!gameStart) {
            AM.audio.bg.img.volume = 0.5;
            AM.audio.bg.img.loop = true;
            AM.audio.bg.img.play();

            playAllAudio();

            // playScore();
            // playKaboom();
            // playGlue();

            gameStart = true;
            HUD.health = startingBatteryLife;
        } 

        if (gameover) {
            // reset();
        }
        
    });

    canvas.addEventListener('mousedown', e => {
        // mousedownE(e.offsetX, e.offsetY);
        let mx = e.offsetX;
        let my = e.offsetY;
        if (!mDown) {
            if (gameStart) {
                if (isBtnClicked(mx, my, {
                    x: HUD.volume.x,
                    y: HUD.volume.y,
                    w: HUD.volume.w,
                    h: HUD.volume.h
                })) {
                    
                    HUD.volumeOn = !HUD.volumeOn; 
                    // console.log('test', HUD.volumeOn)
                    if (HUD.volumeOn) {
                        AM.audio.bg.img.currentTime = 0;
                        AM.audio.bg.img.play();
                    } else {
                        AM.audio.bg.img.pause();
                        // music.correct.obj.volume = 0;
                    }
                } 

                if (isNeutral) {
                    // eelLookAt[0] = mx;
                    // eelLookAt[1] = my;

                    // eelHead.extend(eelHead.x + eelHead.w / 2, eelHead.y + eelHead.h, mx, my);
                    
                    // eelNeck.extend(eelHead.x + eelHead.w / 2, eelHead.y + eelHead.h, mx, my);

                    // isNeutral = false;
                    // isHunting = true;
                    // eelDirection = eelDirectionSpeed;

                    
                }

                mDown = true;
                mouseMoveOrigin.x = mx;
                prevPosY = mouseMoveOrigin.y = my;
                joystick.active = true;
                // if (isBtnClicked(mx, my, joystick.hitbox)) {
                    
                // }
            }
        }

        
    });


    canvas.addEventListener('mousemove', e => {
        // mousemoveE(e.offsetX, e.offsetY);
        let mx = e.offsetX;
        let my = e.offsetY;

        // eelLookAt[0] = mx;
        // eelLookAt[1] = my;

        // eelHead.extend(originCoordRotation[0], originCoordRotation[1], mx, my);
        // eelNeck.extend(originCoordRotation[0], originCoordRotation[1], mx, my);
        // eelNeck.extend(originCoordRotation[0], originCoordRotation[1], mx, my);
        if (gameover) mDown = false;

        if (mDown) {
            // let dist = mx - mouseMoveOrigin.x;
            // let distY = prevPosY - my;
            // // let distY = mouseMoveOrigin.y - my;

            // eelHead.x = eelHead.ox + dist;
            // eelHead.updateBounds(canvas.width, eel_hitbox);

            // eelNeck.x = eelHead.x + eelHead.w / 2 - eelNeck.w / 2;

            // moveUp(distY);

            mouseMove(mx, my, prevPos, prevPosY);

            prevPos = mx;
            prevPosY = my;
        }
    });
    
    canvas.addEventListener('mouseup', e => {
        // mouseupE();
        
        if (!gameStart) {
            // if (AM.audio.bg.img.paused) {
                AM.audio.bg.img.volume = 0.5;
                AM.audio.bg.img.loop = true;
                AM.audio.bg.img.play();
                // console.log('test')
            // }
            

            gameStart = true;
            HUD.health = startingBatteryLife;
        }

        if (mDown) {
            mDown = false;
            // eelHead.updateOriginalPos();
            mouseUp();
            // eelLookAt[0] = canvas.width / 2;
            // eelLookAt[1] = 0;
            if (gameover) {
                // reset();
            }
        }
    });

    document.addEventListener('keydown', e => {
        if (!gameover) {
            // if (e.key == 'ArrowUp') {
            //     moveUp(eelMoveUpSpeed);
            // } else if (e.key == 'ArrowDown') {
            //     moveUp(-eelMoveUpSpeed);
            // }

            if (e.key == 'ArrowRight') {
                if (!rDown) {
                    rDown = true;
                    // forceD = F;
                    eelHead.vx = F;
                    
                }
                keyDown = true;
            } else if (e.key == 'ArrowLeft') {
                if (!lDown) {
                    lDown = true;
                    // forceD = -F;
                    eelHead.vx = -F;
                }
                keyDown = true;
            } 
            
            // else if (e.key == 'ArrowUp') {
            //     if (!uDown) {
            //         uDown = true;
            //         // forceD = -F;
            //         // eelHead.vx = -F;
            //         moveUp(-distY);
            //     }
            // } else if (e.key == 'ArrowDown') {
            //     if (!dDown) {
            //         dDown = true;
            //         // forceD = -F;
            //         // eelHead.vx = -F;
            //         moveUp(distY);
            //     }
            // }
        }
        
    });

    document.addEventListener('keyup', e => {
        if (!gameover) {
            if (e.key == 'ArrowRight') {
                rDown = false;
                keyDown = false;
            } else if (e.key == 'ArrowLeft') {
                lDown = false;
                keyDown = false;
            } 
            
            // else if (e.key == 'ArrowUp') {
            //     uDown = false;
            // } else if (e.key == 'ArrowDown') {
            //     dDown = false;
            // }

            if (!rDown && !lDown) {
                // forceD = 0;
                eelHead.vx = 0;
            }
        }
    });
}

function initStartPage() {
    for (let k in startPage) {
        startPage[k].x *= scaleX;
        startPage[k].y *= scaleY;
        startPage[k].w *= scaleX;
        startPage[k].h *= scaleY;
    }

    startPage.title.x = canvas.width / 2 - startPage.title.w / 2;
    startPage.sub_title.x = canvas.width / 2 - startPage.sub_title.w / 2;
    // startPage.sub_title.x = 0;
    startPage.sub_title.y += startPage.title.y + startPage.title.h;
    // startPage.sub_title.y = 0;

    for (let i = 1; i < 4; ++i) {
        let key = 'text' + i;
        startPage[key].y = startPage.sub_title.y + 140 * scaleY;
    }

    
}

function setFishInfo(sx, sy, sizePercentage) {
    for (let i = 1; i < 7; ++i) {
        let key = 'sfish_' + i;

        if (AM.images[key].frames) AM.images[key].cw = AM.images[key].cw / AM.images[key].frames;
        // console.log(AM.images[key].frames, AM.images[key].cw)
        // let cw = (AM.images[key].frames ? (AM.images[key].cw / AM.images[key].frames) : AM.images[key].cw);

        fishInfo[i] = {
            x: 0,
            y: 0,
            w: AM.images[key].cw * sizePercentage * sx,
            h: AM.images[key].ch * sizePercentage * sy,
            frames: AM.images[key].frames
        };
    }

    fishInfo[0] = {
        x: 0,
        y: 0,
        w: AM.images.sfish_0.cw * 0.75 * sx,
        h: AM.images.sfish_0.ch * 0.75 * sy,
        frames: AM.images.sfish_0.frames
    };
}

function setSchoolFishInfo(sx, sy, sizePercentage) {
    for (let i = 0; i < 8; ++i) {
        let key = 'fish_' + i;

        schoolFishInfo[i] = {
            x: 0,
            y: 0,
            w: AM.images[key].cw * sizePercentage * sx,
            h: AM.images[key].ch * sizePercentage * sy,
        };
    }
}

function setGarbageInfo(sx, sy, sizePercentage) {
    for (let i = 1; i < 10; ++i) {
        let key = 'garbage_' + i;

        garbageInfo[i] = {
            x: 0,
            y: 0,
            w: AM.images[key].cw * sizePercentage * sx,
            h: AM.images[key].ch * sizePercentage * sy,
        };
    }
}
// *********************************** GAME INITIATLIZATIONS AND CONTROLS END ******************************************************** //


/*
 * SPRITE MANAGEMENT (SETTING, ADDING, AND DRAWING)
 */
function addFish() {
    // x, y, w, h, clipW, clipH
    let rng = Math.floor(Math.random() * 7);
    // let rng = 0;
    let key = 'sfish_' + rng;
    let rngY = Math.floor(Math.random() * (canvas.height - fishInfo[rng].h));

    let fish = new Sprite(-fishInfo[rng].w, rngY, fishInfo[rng].w, fishInfo[rng].h, AM.images[key].cw, AM.images[key].ch);

    let direction = Math.floor(Math.random() * 2) ? FACE.RIGHT : FACE.LEFT;

    if (direction < 0) {
        fish.x = canvas.width;
    }

    fish.setDirection(direction);
    fish.setRandomSpeed(fishMaxSpeed, fishMinSpeed);
    fish.id = rng;
    // fish.setFrames(fishInfo[rng].frames);
    fish.frames = fishInfo[rng].frames;
    fishes.push(fish);
}

function drawFishes() {
    for (let i = 0; i < fishes.length; ++i) {
        let key = 'sfish_' + fishes[i].id;
        fishes[i].swim(ctx, AM.images[key].img);
        // fishes[i].t += 10 * delta;
    }
}

function resetFish(fish, isEaten) {
    let rng = Math.floor(Math.random() * 7);
    let key = 'sfish_' + rng;
    // let key = 'sfish_';
    let rngY = Math.floor(Math.random() * (canvas.height / 2));
    // let rngY = (Math.floor(Math.random() * 2) + 1) * fish.h;
    
    if (isEaten) {
        // rngY = (Math.floor(Math.random() * 2) + 1) * fish.h;
        fish.y = rngY;
    } else {
        if (fish.y >= eelHead.y) {
            fish.y = rngY;
        }
        fish.y += fish.h;
    }
    

    fish.oy = fish.y;

    let direction = Math.floor(Math.random() * 2) ? FACE.RIGHT : FACE.LEFT;

    if (direction < 0) {
        fish.x = canvas.width;
    } else {
        fish.x = -fish.w;
    }

    
    // fishes[idx].setDirection(direction);
    // fishes[idx].x = 100;

    fish.mutateFish(rng, fishInfo[rng].w, fishInfo[rng].h, AM.images[key].cw, AM.images[key].ch, direction);
    fish.setRandomSpeed(fishMaxSpeed, fishMinSpeed);
    // fish.setFrames(fishInfo[rng].frames);
    fish.frames = fishInfo[rng].frames;
}

function resetSmartFish(fish) {
    let rng = Math.floor(Math.random() * 7);
    let key = 'sfish_' + rng;

    let direction = Math.floor(Math.random() * 2) ? FACE.RIGHT : FACE.LEFT;

    if (direction < 0) {
        fish.x = canvas.width;
    } else {
        fish.x = -fish.w;
    }

    let mulX = Math.floor(Math.random() * 2) ? 1 : -1;
    let mulY = Math.floor(Math.random() * 2) ? 1 : -1;

    let rngX = Math.floor(Math.random() * canvas.width) + canvas.width / 2 * mulX;
    let rngY = Math.floor(Math.random() * canvas.height) + canvas.height / 2 * mulY;

    fish.dest = [rngX, rngY];

    if (fish.x < rngX) {
        fish.setDirection(1);
    } else {
        fish.setDirection(-1);
    }

    fish.t = 0;
    fish.t2 = 0;

    fish.ox = fish.x;

    
    fish.morph(rng, fishInfo[rng].w, fishInfo[rng].h, AM.images[key].cw, AM.images[key].ch);
    // fish.setFrames(fishInfo[rng].frames);
    fish.frames = fishInfo[rng].frames
    // fish.setRandomSpeed(30, 15);
}

function mutateFish(fish) {
    let rng = Math.floor(Math.random() * 7);
    let key = 'sfish_' + rng;
    fish.morph(rng, fishInfo[rng].w, fishInfo[rng].h, AM.images[key].cw, AM.images[key].ch);
}

function mutateGarbage(trash) {
    let rng = Math.floor(Math.random() * 9) + 1;
    let key = 'garbage_' + rng;
    let w = garbageInfo[rng].w * ((Math.floor(Math.random() * 50) + 50) / 100);
    let h = garbageInfo[rng].h * ((Math.floor(Math.random() * 50) + 50) / 100);
    trash.morph(rng, w, h, AM.images[key].cw, AM.images[key].ch);
    trash.vy = Math.floor(Math.random() * garbageDropSpeed) + 20;
}

// *********************************** SPRITE MANAGEMENT END ******************************************************** //


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
function showPoints(pointType) {
    // HUD.draw(ctx, AM.images.timecircle.img);
    // jumpPointsT += 1 * delta;
    if (jump > 0) {
        let y = eelHead.y + jump - eelHead.h;
        TXT.follow('points', eelHead.x, y, eelHead.w, eelHead.h);
        TXT.draw('points');
        jump -= G * jumpSpeed * delta;
    }
}

function setPoints(points, color) {
    jump = jumpHeight;
    TXT.texts['points'].color = color;
    TXT.texts['points'].str = points;
}

// *********************************** TEXT DISPLAYS END ******************************************************** //


/*
 * SOUNDS
 */
function playCry() {
    if (HUD.volumeOn) {
        setTimeout(() => {
            AM.audio.cry.img.volume = 0.3;
            AM.audio.cry.img.currentTime = 0;
            AM.audio.cry.img.play();
        }, 0)
        
    }
}

function playEat() {
    if (HUD.volumeOn) {
        setTimeout(() => {
            AM.audio.eat.img.volume = 0.3;
            AM.audio.eat.img.currentTime = 0;
            AM.audio.eat.img.play();
        }, 0);
    } 
}

function playScore() {
    if (HUD.volumeOn) {
        setTimeout(() => {
            AM.audio.score.img.volume = 0.3;
            AM.audio.score.img.currentTime = 0;
            AM.audio.score.img.play();
        }, 0);
    }
}

function playBonus() {
    if (HUD.volumeOn) {
        setTimeout(() => {
            AM.audio.bonus.img.volume = 0.3;
            AM.audio.bonus.img.currentTime = 0;
            AM.audio.bonus.img.play();
        }, 0);
    }
}

// *********************************** SOUNDS END ******************************************************** //

// #11A5CC
// #F8E7CD
/*
 * GAME UPDATES AND CYCLES
 */

function drawRotate(obj, key, ax, ay, yRot, zRot) {
    ctx.save();
    // Untransformed draw position
    const position = {x: obj.x + ax, y: obj.y + ay};
    // In degrees
    const rotation = { x: 0, y: yRot, z: zRot};
    // Rotation relative to here (this is the center of the image)
    const rotPt = { x: obj.w / 2, y: obj.h / 2 };

    ctx.setTransform(new DOMMatrix()
        .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
        .rotateSelf(rotation.x, rotation.y, rotation.z)
    );
    
    // ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, -rotPt.x, -rotPt.y, this.w, this.h);
    // ctx.drawImage(AM.images[key].img, 0, 0, AM.images[key].cw, AM.images[key].ch, -rotPt.x, -rotPt.y, garbageInfo[id].w, garbageInfo[id].h);
    ctx.drawImage(AM.images[key].img, 0, 0, AM.images[key].cw, AM.images[key].ch, -rotPt.x, -rotPt.y, startPage.duck.w, startPage.duck.h);
    ctx.restore();
}

function drawStartPage() {
    // ctx.drawImage(AM.images.intro.img, 0, 0, AM.images.intro.cw, AM.images.intro.ch, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(AM.images.bg.img, 0, 0, AM.images.bg.cw, AM.images.bg.ch, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(AM.images.title.img, 0, 0, AM.images.title.cw, AM.images.title.ch, startPage.title.x, startPage.title.y, startPage.title.w, startPage.title.h);
    ctx.drawImage(AM.images.sub_title.img, 0, 0, AM.images.sub_title.cw, AM.images.sub_title.ch, startPage.sub_title.x, startPage.sub_title.y, startPage.sub_title.w, startPage.sub_title.h);
    
    // for (let i = 1; i < 4; ++i) {
    //     let key = 'text' + i;
    //     ctx.drawImage(AM.images[key].img, 0, 0, AM.images[key].cw, AM.images[key].ch, startPage[key].x, startPage[key].y, startPage[key].w, startPage[key].h);
    // }

    TXT.draw('instruction1');
    TXT.draw('instruction1_2');
    TXT.draw('instruction2');
    TXT.draw('instruction2_2');

    let id = 2;
    let key = 'sfish_' + id;
    let fw = 102.9 * 1.5 * scaleX;
    let fh = 81 * 1.5 * scaleX;
    let frame = Math.floor(T) % 10;

    ctx.save();
    // Untransformed draw position
    const position2 = {x: startPage['text1'].x - fw * 1.1, y: startPage['text1'].y - fh * 0.20};
    // In degrees
    const rotation2= { x: 0, y: Math.sin(T * 1.5) * 15, z: 0};
    // Rotation relative to here (this is the center of the image)
    const rotPt2 = { x: fw / 2, y: fh / 2 };

    ctx.setTransform(new DOMMatrix()
        .translateSelf(position2.x + rotPt2.x, position2.y + rotPt2.y)
        .rotateSelf(rotation2.x, rotation2.y, rotation2.z)
    );
    
    // ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, -rotPt.x, -rotPt.y, this.w, this.h);
    // ctx.drawImage(AM.images[key].img, 0, 0, AM.images[key].cw, AM.images[key].ch, -rotPt.x, -rotPt.y, garbageInfo[id].w, garbageInfo[id].h);
    ctx.drawImage(AM.images[key].img, 102.9 * frame, 0, 102.9, AM.images[key].ch,  -rotPt2.x, -rotPt2.y, fw, fh);
    ctx.restore();
    

    
    
    id = 9;
    key = 'garbage_' + id;
    let x = startPage['text2'].x - garbageInfo[id].w;
    let y = startPage['text1'].y - garbageInfo[id].h * 0.25;
    ctx.save();
    // Untransformed draw position
    const position = {x: x, y: y};
    // In degrees
    const rotation = { x: 0, y: 0, z: Math.sin(T) * 15};
    // Rotation relative to here (this is the center of the image)
    const rotPt = { x: garbageInfo[id].w / 2, y: garbageInfo[id].h / 2 };

    ctx.setTransform(new DOMMatrix()
        .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
        .rotateSelf(rotation.x, rotation.y, rotation.z)
    );
    
    // ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, -rotPt.x, -rotPt.y, this.w, this.h);
    ctx.drawImage(AM.images[key].img, 0, 0, AM.images[key].cw, AM.images[key].ch, -rotPt.x, -rotPt.y, garbageInfo[id].w, garbageInfo[id].h);
    ctx.restore();
    
    
    // HUD.drawMiniBattery(ctx);

    let startBtnW = AM.images.start.cw * 2 * scaleX;
    let startBtnH = AM.images.start.ch * 2 * scaleY;

    ctx.drawImage(AM.images.start.img, 0, 0, AM.images.start.cw, AM.images.start.ch, canvas.width / 2 - startBtnW / 2, canvas.height - startBtnH * 2, startBtnW, startBtnH);

    if (delta < 1) {
        T += 10 * delta;
        HUD.decayMiniBattery(delta);
    }
    
}

function reset() {
    gameover = false;
   
    HUD.health = startingBatteryLife;
    eelStatus = eelStatusEnum.NORMAL;
    
    timer.setTimer(gameDuration);
}

function updateEelStatus(status, duration) {
    eelStatus = status;
    eelExpressionT = duration;
}

function update() {
    for (let i = 0; i < fishes.length; ++i) {
        fishes[i].update(delta, 2);

        // if (isHunting) {
            // if (checkAngledCollisions(fishes[i], eelHead)) {
            if (checkAngledCollisions(fishes[i], eel_hitbox)) {
                // resetFish(i);
                
                // jump = jumpHeight;
                // TXT.texts['points'].str = '+1.00';
                
                // console.log(fishes[i].id);
                if (fishes[i].id == 0 || eelStatus == eelStatusEnum.CHARGED) {
                    updateEelStatus(eelStatusEnum.CHARGED, expressionDuration * 7);
                    playBonus();
                } else {
                    updateEelStatus(eelStatusEnum.EAT, expressionDuration);
                    playScore();
                }

                let points = 3;
                if (eelStatus == eelStatusEnum.CHARGED) {
                    points = 5;
                }

                setPoints('+' + points + '.00','#C7FC12');
                HUD.updateBattery(points);
                

                resetFish(fishes[i], true);
            }
        // }
        

        if ((fishes[i].facing == FACE.LEFT && fishes[i].x + fishes[i].w < 0) || (fishes[i].facing == FACE.RIGHT && fishes[i].x > canvas.width)) {
            // resetFish(i);
            resetFish(fishes[i], false);
        }
    }

    for (let i = 0; i < smartSwimmers.length; ++i) {
        // smartSwimmers[i].update(delta, 2);

        // if (isHunting) {
            // if (checkAngledCollisions(smartSwimmers[i], eelHead)) {
            if (checkAngledCollisions(smartSwimmers[i], eel_hitbox)) {
                // resetFish(i);
                
                // jump = jumpHeight;
                // TXT.texts['points'].str = '+1.00';
                // setPoints('+2.00','#C7FC12');
                // HUD.updateBattery(2);
                // playEat();
                // console.log(fishes[i].id);

                if (smartSwimmers[i].id == 0 || eelStatus == eelStatusEnum.CHARGED) {
                    updateEelStatus(eelStatusEnum.CHARGED, expressionDuration * 7);
                    playBonus();
                } else {
                    updateEelStatus(eelStatusEnum.EAT, expressionDuration);
                    playEat();
                }

                let points = 2;
                if (eelStatus == eelStatusEnum.CHARGED) {
                    points = 4;
                }

                setPoints('+' + points + '.00','#C7FC12');
                HUD.updateBattery(points);
                // playEat();

                resetSmartFish(smartSwimmers[i]);
                // updateEelStatus(eelStatusEnum.EAT, expressionDuration);
            }
        // }
        

        if ((smartSwimmers[i].facing == FACE.LEFT && smartSwimmers[i].x + smartSwimmers[i].w < 0) || (smartSwimmers[i].facing == FACE.RIGHT && smartSwimmers[i].x > canvas.width)) {
            // resetFish(i);
            resetSmartFish(smartSwimmers[i]);
        }
    }

    // divingFish.update(delta);
    // divingFish.sineMovement(delta);
    HUD.txt.texts['time'].str = zeroPad(Math.floor(timer.timer / 24), 2);

    if (delta < 1) {
        HUD.timeProgressBar.update(delta, Math.floor(timer.timer / 24) / gameDuration * 100);
        timer.tick(delta);

        if (timer.timer <= 0) {
            gameover = true;
            HUD.updateGameoverBattery();
        }
    }

    // if (HUD.health <= 0 || HUD.health == 100) {
    if (HUD.health <= 0) {
        gameover = true;
        HUD.updateGameoverBattery();
    }

    if (eelExpressionT > 0) {
        eelExpressionT -= 5 * delta;
        if (eelExpressionT <= 0) {
            eelExpressionT = 0;
            eelStatus = eelStatusEnum.NORMAL;
        }
    }

    HUD.decay(delta);

    // if (joystick.active) {
    //     if (joystick.prevMx == joystick.mx) {
    //         let dist = joystick.vx > 0 ? F : -F;
    //         joystick.totalDistX += dist * delta;
    //         eelHead.x = eelHead.ox + joystick.totalDistX;
    //         eelHead.updateBounds(canvas.width, eel_hitbox);

    //         eelNeck.x = eelHead.x + eelHead.w / 2 - eelNeck.w / 2;
    //     }
    // }
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    if (!gameover) {
        if (gameStart) {
            // bg
            // drawBG(ctx, 'bg');
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(AM.images.bg.img, 0, 0, AM.images.bg.cw, AM.images.bg.ch, 0, 0, canvas.width, canvas.height);
            // TXT.draw('angle');
            // TXT.draw('angle'); 
            HUD.draw(ctx);  
            // displaySchool();          
            drawFishes();
            drawSmartFishes();
            drawGarbage();

            drawEel();

            showPoints(1);

            if (onMobile)
                joystick.draw(ctx);

            // divingFish.dive(ctx, AM.images['fish_4'].img);
            
            update();
        } else {
            // ctx.drawImage(AM.images.intro.img, 0, 0, AM.images.intro.cw, AM.images.intro.ch, 0, 0, canvas.width, canvas.height);
            drawStartPage();
        }

        
    } else {
        // drawBG(ctx, 'bg');
        // HUD.draw(ctx);
        
        HUD.gameover(ctx);
        // HUD.updateGameoverBattery(-0.01 * delta);
    }

    requestAnimationFrame(gameCycle);
}
// *********************************** GAME UPDATES AND CYCLES END ******************************************************** //

// function drawPoints(points, ctx) {
    
//     ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    
//     for (var i = 0, n = points.length, p; i < n; i++) {
//         p = points[i];
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, 3, 0, TWO_PI, false);
//         ctx.closePath();
//         ctx.stroke();
//         ctx.fillText('p' + i, p.x + 6, p.y + 2);
//     }
// }

// function generatePoints(list, count) {
//     for (var i = 0; i < count; i++) {
//         list.push({
//             x: (width * 0.1) + Math.random() * (width * 0.8),
//             y: (height * 0.1) + Math.random() * (height * 0.8)
//         });
//     }
// }

// function curveThroughPoints(points, ctx) {
    
//     ctx.beginPath();
    
//     var p0, p1, p2, p3, i6 = 1 / 6;
    
//     for (var i = 3, n = points.length; i < n; i++) {
        
//         p0 = points[i - 3];
//         p1 = points[i - 2];
//         p2 = points[i - 1];
//         p3 = points[i];
        
//         if (i === 3) {
//             ctx.moveTo(p1.x, p1.y);
//         }
        
//         ctx.bezierCurveTo(
//             p2.x * i6 + p1.x - p0.x * i6,
//             p2.y * i6 + p1.y - p0.y * i6,
//             p3.x * -i6 + p2.x + p1.x * i6,
//             p3.y * -i6 + p2.y + p1.y * i6,
//             p2.x,
//             p2.y
//         );
//     }
    
//     ctx.lineWidth = 1;
//     ctx.strokeStyle = 'rgba(255,0,255,0.8)';
//     ctx.stroke();
// }

// generatePoints(points, 10);
// curveThroughPoints(points, context);
// drawPoints(points, context);