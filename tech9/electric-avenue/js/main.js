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

var FACE = {
    LEFT: -1,
    RIGHT: 1,
}

let divingFish = 0;

var school = [];

var schools = [];
var smartSwimmers = [];

var garbage = [];


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

    setFishInfo(scaleX, scaleY, 0.5);
    setGarbageInfo(scaleX, scaleY, 0.5);

    initStartPage();

    TXT = new Text(ctx, w, h); 
    TXT.setScale(scaleX, scaleY);
    
    TXT.addText('points', '+1.00', 'bold', 20, 'Montserrat', 0, 0, 80, 30, '#10aad7', true); 
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
            mutateGarbage(garbage[i]);
            let rngY = Math.floor(Math.random() * garbage[i].h * 5) + garbage[i].h;
            garbage[i].y = -rngY;
            garbage[i].oy = garbage[i].y;
        }
    }
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
            }
        }

        
    });


    canvas.addEventListener('mousemove', e => {
        // mousemoveE(e.offsetX, e.offsetY);
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

function resetFish(idx) {
    let rng = Math.floor(Math.random() * 8);
    let key = 'fish_' + rng;
    let rngY = Math.floor(Math.random() * (canvas.height - fishInfo[rng].h));

    let direction = Math.floor(Math.random() * 2) ? FACE.RIGHT : FACE.LEFT;

    if (direction < 0) {
        fishes[idx].x = canvas.width;
    } else {
        fishes[idx].x = -fishes[idx].w;
    }

    fishes[idx].y = rngY;
    // fishes[idx].setDirection(direction);
    // fishes[idx].x = 100;
    
    fishes[idx].mutateFish(rng, fishInfo[rng].w, fishInfo[rng].h, AM.images[key].cw, AM.images[key].ch, direction);
    fishes[idx].setRandomSpeed(30, 15);
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

// *********************************** PHYSICS END ******************************************************** //

/*
 * TEXT DISPLAYS
 */


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

        if ((fishes[i].facing == FACE.LEFT && fishes[i].x + fishes[i].w < 0) || (fishes[i].facing == FACE.RIGHT && fishes[i].x > canvas.width)) {
            resetFish(i);
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

            // HUD.draw(ctx);            
            drawFishes();
            displaySchool();
            drawSmartFishes();
            drawGarbage();

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