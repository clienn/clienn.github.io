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

// physics
var forceD = 0;
var friction = 0.98;
var F = 50;
var T = 0;
const G = 9.8;
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


var gameDuration = 90;

var startScreenTimerAnimT = 0;
var startScreenHandAnimT = 0;

var startPage = {
    hand: {
        x: 475,
        y: 280,
        w: 128,
        h: 130,
    },
    handcover: {
        x: 400,
        y: 280,
        w: 280,
        h: 150,
    },
    gopher: {
        x: 815,
        y: 265,
        w: 165,
        h: 165,
    },
    gophercover: {
        x: 740,
        y: 280,
        w: 310,
        h: 150,
    },
    halo: {
        x: 840,
        y: 280,
        ox: 840,
        oy: 280,
        w: 110,
        h: 40,
    },
    star: {
        x: 840,
        y: 280,
        ox: 840,
        oy: 280,
        w: 16,
        h: 14,
    },
    timer: {
        x: 1253,
        y: 351,
        w: 34,
        h: 39,
    }
}

var fishInfo = {};
var garbageInfo = {};

var eelInfo = {
    head: {
        x: 0,
        y: 0,
        w: 124,
        h: 185,
        // w: 505 * 0.75,
        // h: 454 * 0.75,
    },
    neck: {
        x: 0,
        y: 0,
        w: 64,
        h: 227,
        // w: 505 * 0.75,
        // h: 454 * 4.75,
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

// #C7FC12
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
    
    
    setFishInfo(scaleX, scaleY, 0.5);
    setGarbageInfo(scaleX, scaleY, 0.5);
    rescaleSize(eelInfo.head, scaleX, scaleY);
    rescaleSize(eelInfo.neck, scaleX, scaleY);

    eelInfo.neck.h = w;

    eelLookAt[0] = w / 2;
    originCoordRotation[0] = w / 2;
    originCoordRotation[1] = h;

    eelInfo.head.x = w / 2 - eelInfo.head.w / 2;
    // eelInfo.head.y = h - eelInfo.head.h * 1.5;
    eelInfo.head.y = h - eelInfo.head.h;

    eelHead = new Sprite(eelInfo.head.x, eelInfo.head.y, eelInfo.head.w, eelInfo.head.h, AM.images['eel_head2'].cw, AM.images['eel_head2'].ch); 
    eelNeck = new Sprite(w / 2 - eelInfo.neck.w / 2, eelInfo.head.y + neckAdjY, eelInfo.neck.w, eelInfo.neck.h, AM.images['eel_neck2'].cw, AM.images['eel_neck2'].ch); 

    initStartPage();

    // TXT = new Text(ctx, w, h); 
    // TXT.setScale(scaleX, scaleY);
    
    // TXT.addText('points', '+1.00', 'bold', 20, 'Montserrat', 0, 0, 80, 30, '#10aad7', true); 
    jumpHeight *= scaleY;

    timer = new Timer(0, 0, 0, '#fff');
    timer.setTimer(gameDuration);



    // HUD = new Sprite(0, 0, 45, 45, AM.images.timecircle.cw, AM.images.timecircle.ch);
    // HUD = new Template_1(ctx, w, h, scaleX, scaleY);
    
    controls();

    // AM.audio.bg.img.volume = 0.2;
    // AM.audio.bg.img.loop = true;
    // AM.audio.bg.img.play();

    addFish();
    addFish();
    addFish();
    addFish();
    addFish();

    let key = 'fish_4';
    let rngY = Math.floor(Math.random() * (canvas.height - fishInfo[4].h));
    divingFish = new Sprite(0, h / 2 - fishInfo[4].h / 2, fishInfo[4].w / 2, fishInfo[4].h / 2, AM.images[key].cw, AM.images[key].ch);
    divingFish.setDirection(FACE.RIGHT);

    divingFish.vx = 180;

    let fishW = fishInfo[4].w / 2;
    let fishH = fishInfo[4].h / 2;

    schools[0] = [];
    schools[1] = [];
    
    let px = (20) * fishW;
    for (let i = 0; i < 20; ++i) {
        let f = new Sprite(i * (fishW) - px, h / 2 - fishH / 2, fishW, fishH, AM.images[key].cw, AM.images[key].ch);
        f.setDirection(FACE.RIGHT);
        f.vx = 100;
        f.flippingSpeed = 25;
        f.id = 4;
        schools[0].push(f);
    }

    px = (10) * fishW;
    for (let i = 0; i < 10; ++i) {
        let f = new Sprite(w + i * (fishW), h / 3 - fishH / 2, fishW, fishH, AM.images[key].cw, AM.images[key].ch);
        f.setDirection(FACE.LEFT);
        f.vx = -100;
        f.flippingSpeed = 25;
        f.id = 4;
        // f.yRotate = 45;
        schools[1].push(f);
    }

    addSmartFish();
    addSmartFish();
    addSmartFish();
    addSmartFish();
    addSmartFish();

    addGarbage();
    addGarbage();
    addGarbage();
    addGarbage();
    addGarbage();
    addGarbage();
    addGarbage();
    

    gameCycle();
}

function drawEel() {
    eelHead.drawWithRotation(ctx, AM.images.eel_head2.img, eelHead.w / 2, eelHead.h);
    eelNeck.drawWithRotation(ctx, AM.images.eel_neck2.img, eelNeck.w / 2, eelHead.h - neckAdjY);
    // eelNeck.drawWithRotation(ctx, AM.images.eel_neck2.img, eelNeck.w / 2, eelNeck.h / 2);

    // if (eelHead.vx || eelHead.vy) {
        // let max = Math.max(Math.abs(eelHead.vx), Math.abs(eelHead.vy));
        // eelNeck.h += 10 * 30 * delta;
    // }

    eelHead.updatePos(delta, eelDirection);
    eelNeck.updatePos(delta, eelDirection);
    
    if (!isNeutral) {
        if (isHunting) {
            let dx = eelHead.x + eelHead.w / 2 - eelLookAt[0];
            let dy = eelHead.y - eelLookAt[1];
    
            let dist = Math.sqrt(dx * dx + dy * dy);

            // TXT.texts['angle'].str = dist.toFixed(2) + ", " + (eelHead.h / 2).toFixed(2);
            if (eelHead.x + eelHead.w / 2 >= canvas.width || eelHead.x <= 0 || eelHead.y <= 0) {
                eelDirection = returnSpeed;
                isHunting = false;
            }
        } else {
            if (eelHead.y + eelHead.h > canvas.height) {
                eelHead.reset();
                eelNeck.reset();
                isNeutral = true;
            }
        }
    }
    
    
   
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
    trash.vy = Math.floor(Math.random() * 100) + 20;
    garbage.push(trash);
}

function drawGarbage() {
    for (let i = 0; i < garbage.length; ++i) {
        let key = 'garbage_' + garbage[i].id;
        garbage[i].draw(ctx, AM.images[key].img);
        garbage[i].update(delta, 1);

        if (garbage[i].y > canvas.height) {
            // mutateGarbage(garbage[i]);
            // let rngY = Math.floor(Math.random() * garbage[i].h * 5) + garbage[i].h;
            // garbage[i].y = -rngY;
            // garbage[i].oy = garbage[i].y;
            resetGarbage(garbage[i]);
        } else if (isHunting) {
            if (checkAngledCollisions(garbage[i], eelHead)) {
                resetGarbage(garbage[i]);
                
                // jump = jumpHeight;
                // TXT.texts['points'].str = '-1.00';
                setPoints('-5.00','#fb2121');
                
            }
        }


    }
}

function resetGarbage(trash) {
    mutateGarbage(trash);
    let rngY = Math.floor(Math.random() * trash.h * 5) + trash.h;
    trash.y = -rngY;
    trash.oy = trash.y;
}

function addSmartFish() {
    let rng = Math.floor(Math.random() * 8);
    let key = 'fish_' + rng;
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
    fish.flippingSpeed = 25;
    fish.dest = [canvas.width / 2, canvas.height / 2];
    smartSwimmers.push(fish);
}

function drawSmartFishes() {
    for (let i = 0; i < smartSwimmers.length; ++i) {
        let key = 'fish_' + smartSwimmers[i].id;
        // smartSwimmers[i].dive(ctx, AM.images[key].img);
        // smartSwimmers[i].swim(ctx, AM.images[key].img);
        // smartSwimmers[i].update(delta, 3);
        smartSwimmers[i].smartSwim(ctx, AM.images[key].img);
        smartSwimmers[i].t += smartSwimmers[i].vx * delta;
        smartSwimmers[i].t2 += 10 * delta;

        if (smartSwimmers[i].x > canvas.width || smartSwimmers[i].y > canvas.height) {
            // smartSwimmers[i].mutateFish()
            mutateFish(smartSwimmers[i]);
            
        }
    }
}

function displaySchool() {
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

                if (isHunting) {
                    if (checkAngledCollisions(schools[i][j], eelHead)) {
                        // resetFish(i);
                        schools[i][j].show = false;
                        // jump = jumpHeight;
                        // TXT.texts['points'].str = '+1.00';
                        setPoints('+1.00','#C7FC12');
                    }
                }
            }
        }
        
        if (flag) {
            mutateSchool(i);
        }

        if (flag2) {
            mutateSchool(i);
        }
        
    }
}

function mutateSchool(idx) {
    let rng = Math.floor(Math.random() * 8);
    let key = 'fish_' + rng;
    let rngY = Math.floor(Math.random() * (canvas.height - fishInfo[rng].h));

    let direction = Math.floor(Math.random() * 2) ? FACE.RIGHT : FACE.LEFT;

    let px = 0;

    let padding = Math.floor(Math.random() * (canvas.width)) + 100;

    let fishScale = (Math.floor(Math.random() * 50) + 30) / 100;
    let fishW = fishInfo[rng].w * fishScale;
    let fishH = fishInfo[rng].h * fishScale;

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

function controls() {
    let mid = canvas.width / 2;

    canvas.addEventListener('mousedown', e => {
        // mousedownE(e.offsetX, e.offsetY);
        let mx = e.offsetX;
        let my = e.offsetY;
        if (!mDown) {
            mDown = true;
            
            if (gameStart) {
                // if (isBtnClicked(mx, my, {
                //     x: HUD.volume.x,
                //     y: HUD.volume.y,
                //     w: HUD.volume.w,
                //     h: HUD.volume.h
                // })) {
                    
                //     HUD.volumeOn = !HUD.volumeOn; 
                //     // console.log('test', HUD.volumeOn)
                //     if (HUD.volumeOn) {
                //         AM.audio.bg.img.currentTime = 0;
                //         AM.audio.bg.img.play();
                //     } else {
                //         AM.audio.bg.img.pause();
                //         // music.correct.obj.volume = 0;
                //     }
                // } 

                if (isNeutral) {
                    eelLookAt[0] = mx;
                    eelLookAt[1] = my;

                    eelHead.extend(eelHead.x + eelHead.w / 2, eelHead.y + eelHead.h, mx, my);
                    
                    eelNeck.extend(eelHead.x + eelHead.w / 2, eelHead.y + eelHead.h, mx, my);

                    isNeutral = false;
                    isHunting = true;
                    eelDirection = eelDirectionSpeed;
                }

            }
        }

        
    });


    canvas.addEventListener('mousemove', e => {
        // mousemoveE(e.offsetX, e.offsetY);
        // let mx = e.offsetX;
        // let my = e.offsetY;

        // eelLookAt[0] = mx;
        // eelLookAt[1] = my;

        // eelHead.extend(originCoordRotation[0], originCoordRotation[1], mx, my);
        // eelNeck.extend(originCoordRotation[0], originCoordRotation[1], mx, my);
        // eelNeck.extend(originCoordRotation[0], originCoordRotation[1], mx, my);
    });
    
    canvas.addEventListener('mouseup', e => {
        // mouseupE();
        
        if (!gameStart) {
            // if (AM.audio.bg.img.paused) {
            //     AM.audio.bg.img.volume = 0.2;
            //     AM.audio.bg.img.loop = true;
            //     AM.audio.bg.img.play();
            //     console.log('test')
            // }
            

            gameStart = true;
            
        }

        if (mDown) {
            mDown = false;
            // eelLookAt[0] = canvas.width / 2;
            // eelLookAt[1] = 0;
            if (gameover) {
                reset();
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

    startPage.halo.ox *= scaleX;
    startPage.halo.oy *= scaleY;
}

function setFishInfo(sx, sy, sizePercentage) {
    for (let i = 0; i < 8; ++i) {
        let key = 'fish_' + i;

        fishInfo[i] = {
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
    let rng = Math.floor(Math.random() * 8);
    let key = 'fish_' + rng;
    let rngY = Math.floor(Math.random() * (canvas.height - fishInfo[rng].h));

    let fish = new Sprite(-fishInfo[rng].w, rngY, fishInfo[rng].w, fishInfo[rng].h, AM.images[key].cw, AM.images[key].ch);

    let direction = Math.floor(Math.random() * 2) ? FACE.RIGHT : FACE.LEFT;

    if (direction < 0) {
        fish.x = canvas.width;
    }

    fish.setDirection(direction);
    fish.setRandomSpeed(100, 15);
    fish.id = rng;

    fishes.push(fish);
}

function drawFishes() {
    for (let i = 0; i < fishes.length; ++i) {
        let key = 'fish_' + fishes[i].id;
        fishes[i].swim(ctx, AM.images[key].img);
        fishes[i].t += 10 * delta;
    }
}

function resetFish(fish) {
    let rng = Math.floor(Math.random() * 8);
    let key = 'fish_' + rng;
    let rngY = Math.floor(Math.random() * (canvas.height - fishInfo[rng].h));

    let direction = Math.floor(Math.random() * 2) ? FACE.RIGHT : FACE.LEFT;

    if (direction < 0) {
        fish.x = canvas.width;
    } else {
        fish.x = -fish.w;
    }

    fish.y = rngY;
    // fishes[idx].setDirection(direction);
    // fishes[idx].x = 100;
    
    fish.mutateFish(rng, fishInfo[rng].w, fishInfo[rng].h, AM.images[key].cw, AM.images[key].ch, direction);
    fish.setRandomSpeed(30, 15);
}

function resetSmartFish(fish) {
    let rng = Math.floor(Math.random() * 8);
    let key = 'fish_' + rng;

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
    // fish.setRandomSpeed(30, 15);
}

function mutateFish(fish) {
    let rng = Math.floor(Math.random() * 8);
    let key = 'fish_' + rng;
    fish.morph(rng, fishInfo[rng].w, fishInfo[rng].h, AM.images[key].cw, AM.images[key].ch);
}

function mutateGarbage(trash) {
    let rng = Math.floor(Math.random() * 9) + 1;
    let key = 'garbage_' + rng;
    let w = garbageInfo[rng].w * ((Math.floor(Math.random() * 50) + 50) / 100);
    let h = garbageInfo[rng].h * ((Math.floor(Math.random() * 50) + 50) / 100);
    trash.morph(rng, w, h, AM.images[key].cw, AM.images[key].ch);
    trash.vy = Math.floor(Math.random() * 100) + 20;
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
// function playKaboom() {
//     if (HUD.volumeOn) {
//         AM.audio.kaboom.img.pause();
//         AM.audio.kaboom.img.currentTime = 0;
//         AM.audio.kaboom.img.play();
//     }
// }

// function playLaugh() {
//     if (HUD.volumeOn) {
//         AM.audio.laugh.img.pause();
//         AM.audio.laugh.img.currentTime = 0;
//         AM.audio.laugh.img.play();
//     } 
// }

// function playScore() {
//     if (HUD.volumeOn) {
//         AM.audio.score.img.pause();
//         AM.audio.score.img.currentTime = 0;
//         AM.audio.score.img.play();
//     }
// }

// *********************************** SOUNDS END ******************************************************** //

// #11A5CC
// #F8E7CD
/*
 * GAME UPDATES AND CYCLES
 */
function reset() {
    gameover = false;
   
    totalHP = 100;

    
    timer.setTimer(gameDuration);
}

function update() {
    for (let i = 0; i < fishes.length; ++i) {
        fishes[i].update(delta, 2);

        if (isHunting) {
            if (checkAngledCollisions(fishes[i], eelHead)) {
                // resetFish(i);
                resetFish(fishes[i]);
                // jump = jumpHeight;
                // TXT.texts['points'].str = '+1.00';
                setPoints('+2.00','#C7FC12');
            }
        }
        

        if ((fishes[i].facing == FACE.LEFT && fishes[i].x + fishes[i].w < 0) || (fishes[i].facing == FACE.RIGHT && fishes[i].x > canvas.width)) {
            // resetFish(i);
            resetFish(fishes[i]);
        }
    }

    for (let i = 0; i < smartSwimmers.length; ++i) {
        // smartSwimmers[i].update(delta, 2);

        if (isHunting) {
            if (checkAngledCollisions(smartSwimmers[i], eelHead)) {
                // resetFish(i);
                resetSmartFish(smartSwimmers[i]);
                // jump = jumpHeight;
                // TXT.texts['points'].str = '+1.00';
                setPoints('+5.00','#C7FC12');
            }
        }
        

        if ((smartSwimmers[i].facing == FACE.LEFT && smartSwimmers[i].x + smartSwimmers[i].w < 0) || (smartSwimmers[i].facing == FACE.RIGHT && smartSwimmers[i].x > canvas.width)) {
            // resetFish(i);
            resetSmartFish(smartSwimmers[i]);
        }
    }

    // divingFish.update(delta);
    // divingFish.sineMovement(delta);

   
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
            // HUD.draw(ctx);            
            drawFishes();
            displaySchool();
            drawSmartFishes();
            drawGarbage();

            drawEel();

            showPoints(1);

            // divingFish.dive(ctx, AM.images['fish_4'].img);
            
            update();
        } else {
            ctx.drawImage(AM.images.intro.img, 0, 0, AM.images.intro.cw, AM.images.intro.ch, 0, 0, canvas.width, canvas.height);
        }

        
    } else {
        // drawBG(ctx, 'bg');
        // HUD.draw(ctx);
        
        HUD.gameover(ctx);
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