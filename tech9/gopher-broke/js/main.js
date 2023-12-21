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
var btnBegin = {
    x: 0,
    y: 0,
    w: 400,
    h: 100
};

// sprite info
var gopherHideInfo = {
    w: 106,
    h: 54,
    // w: 53,
    // h: 27,
}


// srpite containers
var pig = null;
var balls = [];
const moneyList = [];
const coins = [];
const glues = [];
const hammers = [];
var kaboom = null;
var kaboomstar = null;

// limits
var ballsLimit = 15;
var moneyLimit = 0;
var coinLimit = 0;
var glueLimit = 2;
var hammerLimit = 5;
var dropPadding = 0;
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
var soil = null;

// TXT
var TXT = null;
var jumpSpeed = 20;
var jumpHeight = 100;
var jump = 0;
var score = 30;

var carrots = [];

var carrotInfo = {
    w: 65,
    h: 115,
}

var gopherInfo = {
    // w: 125,
    // h: 85,
    w: 64 * 2,
    h: 65 * 2,
}

var gopherStunInfo = {
    w: 110 * 1.25,
    h: 112 * 1.25,
}

var gopher = null;
var gopher_hide = null;

var destPadX = 35;
var destPadY = 125;

var shuffleDuration = 1;
var HP = null;
var totalHP = 100;
var hpT = 0;

var chats = [];
var chatID = 0;
var nextRoundT = 0;

var gameDuration = 30;
var startT = 3;

var startScreenTimerAnimT = 0;
var startScreenHandAnimT = 0;
var startScreenHandAnimT2 = 0;

var startPage = {
    coverAll: {
        x: 400,
        y: 280,
        w: 1050,
        h: 230,
    },
    hand: {
        x: 865 - 20,
        y: 280,
        // x: 475,
        // y: 280,
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
        x: 475 - 40,
        y: 280,
        // x: 815,
        // y: 265,
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
        x: 500 - 40,
        // x: 840,
        y: 280,
        ox: 500 - 40,
        // ox: 840,
        oy: 280,
        w: 110,
        h: 40,
    },
    star: {
        x: 500 - 40,
        // x: 840,
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
    },
    carrot: {
        x: 1253 - 20,
        y: 300,
        w: 65,
        h: 115,
    }
}

const randomSpeeches = {
    miss: [
        "Missed me!",
        "I'm over here!",
        "A swing and a miss!", 
        "Outsmarted by a gopher!", 
        "Lost your mojo?", 
        "Close!", 
        "Nope!"
    ],

    caught: [
        "Aaaah!!!", 
        "Ouch! That hurt.", 
        "You got me!", 
        "Hey, you hit me on the head!", 
        "Take it easy!", 
        "Easy there, friend!", 
        "That'll leave a mark!", 
        "Don't like gophers, I see!", 
        "C'mon now!"
    ],
    missPos: 0,
    caughtPos: 0
}

var stunT = 0
var digT = 0
var stunAnimStars = [];

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

    // startPage.gopher.x += 100;
    // startPage.star.x += 100;
    // startPage.halo.x += 100;

    initStartPage();

    // let adjX = (w / 2 - 605 * scaleX / 2) - startPage.hand.x;
    // startPage.hand.x += adjX; 
    // startPage.gopher.x += adjX; 
    // startPage.star.x += adjX;
    // startPage.halo.x += adjX;
    // startPage.halo.ox = startPage.halo.x;

    TXT = new Text(ctx, w, h); 
    TXT.setScale(scaleX, scaleY);
    
    TXT.addText('points', '+1.00', 'bold', 20, 'Montserrat', 0, 0, 80, 30, '#10aad7', true); 
    jumpHeight *= scaleY;
    let y = startPage.hand.y + startPage.hand.h + 30 * scaleY;
    TXT.addText('instruction1', 'Tap where the gopher', 'normal', 20, 'Montserrat', startPage.hand.x - 90 * scaleX, y, 330, 30, '#003057', false);
    TXT.addText('instruction1_2', 'disappears.', 'normal', 20, 'Montserrat', startPage.hand.x, y + 30 * scaleY, 170, 30, '#003057', false);

    TXT.addText('instruction2', 'Watch the gopher as he', 'normal', 20, 'Montserrat', startPage.gopher.x - 70 * scaleX, y, 330, 30, '#003057', false);
    TXT.addText('instruction2_2', 'moves around.', 'normal', 20, 'Montserrat', startPage.gopher.x, y + 30 * scaleY, 200, 30, '#003057', false);

    TXT.addText('instruction3', 'Save the carrots!', 'normal', 20, 'Montserrat', startPage.carrot.x - 90 * scaleX, y, 240, 30, '#003057', false);

    timer = new Timer(0, 0, 0, '#fff');
    timer.setTimer(gameDuration);

    HP =  new ProgressBar(0, 0, 100, 10 * scaleY);
    HP.progress = 100;

    chats.push(new StaticSprite(0, 0, AM.images.chat_1.cw, AM.images.chat_1.ch, 0, 0, AM.images.chat_1.cw, AM.images.chat_1.ch, 'chat_1'));
    chats.push(new StaticSprite(0, 0, AM.images.chat_2.cw, AM.images.chat_2.ch, 0, 0, AM.images.chat_2.cw, AM.images.chat_2.ch, 'chat_2'));
    chats.push(new StaticSprite(0, 0, AM.images.chat_3.cw, AM.images.chat_3.ch, 0, 0, AM.images.chat_3.cw, AM.images.chat_3.ch, 'chat_3'));
    
    rescaleSize(carrotInfo, scaleX, scaleY);
    rescaleSize(gopherInfo, scaleX, scaleY);
    rescaleSize(gopherHideInfo, scaleX, scaleY);
    rescaleSize(gopherStunInfo, scaleX, scaleY);

    // HUD = new Sprite(0, 0, 45, 45, AM.images.timecircle.cw, AM.images.timecircle.ch);
    HUD = new Template_1(ctx, w, h, scaleX, scaleY);
    destPadX = 35 * scaleX;
    destPadY = 125 * scaleY;

    let px = 35 * scaleX;
    let py = 125 * scaleY;
    
    bg_rect = new StaticSprite(px, py, w - px * 2, h - py * 1.35, 0, 0, AM.images.bg_rect.cw, AM.images.bg_rect.ch, 'bg_rect');

    px = 60 * scaleX;
    py = 150 * scaleY;
    bg = new StaticSprite(px, py, w - px * 2, h - py * 1.50, 0, 0, AM.images.bg.cw, AM.images.bg.ch, 'bg');
    soil = new StaticSprite(w / 2 - 366 / 2 * scaleX, bg.y + bg.h - 28 * scaleY, 366 * scaleX, 56 * scaleY, 0, 0, AM.images.soil.cw, AM.images.soil.ch, 'soil');

    

    let padLeft = 55 * scaleX;
    let padDist = 90 * scaleX;
    addCarrot(soil.x + padLeft, soil.y - carrotInfo.h / 2);
    addCarrot(soil.x + padLeft + padDist, soil.y - carrotInfo.h / 2);
    addCarrot(soil.x + padLeft + padDist * 2, soil.y - carrotInfo.h / 2);

    gopher = new Sprite(w / 2 - gopherInfo.w / 2, h / 2 - 100 * scaleY, gopherInfo.w, gopherInfo.h, AM.images.gopher.cw, AM.images.gopher.ch);
    // gopher = new Sprite(w / 2 - gopherInfo.w / 2, h / 2 - 100 * scaleY, gopherInfo.w, gopherInfo.h, AM.images.gopher_show.cw, AM.images.gopher_show.ch);
    gopher_hide = new Sprite(w / 2 - gopherInfo.w / 2, h / 2 - 100 * scaleY, gopherInfo.w, gopherInfo.h, AM.images.gopher.cw, AM.images.gopher.ch);
    // gopher_hide.clipX = AM.images.gopher.cw * 2;
    // gopher_hide = new Sprite(w / 2 - gopherHideInfo.w / 2, h / 2 - 100 * scaleY, gopherHideInfo.w, gopherHideInfo.h, AM.images.gopher_hide.cw, AM.images.gopher_hide.ch);
    moveGopher();

    controls();

    // AM.audio.bg.img.volume = 0.2;
    // AM.audio.bg.img.loop = true;
    // AM.audio.bg.img.play();

    shuffleArr(randomSpeeches.miss);
    shuffleArr(randomSpeeches.caught);

    gameCycle();
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
            // AM.audio[k].img.pause();
        }
    }
    
}

function controls() {
    let mid = canvas.width / 2;

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

    canvas.addEventListener('mousedown', e => {
        // mousedownE(e.offsetX, e.offsetY);
        let mx = e.offsetX;
        let my = e.offsetY;
        if (!mDown) {
            mDown = true;
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

                if (chatID < 0 && gopher_hide.t2 > shuffleDuration) {
                    if (gopher_hide.goto == null || gopher_hide.moveDestinations.length == 0) {
                        let speechID = 'miss';

                        if (isBtnClicked(mx, my, {
                            x: gopher_hide.x,
                            y: gopher_hide.y,
                            w: gopher_hide.w,
                            h: gopher_hide.h
                        })) {
                            
                            // console.log('collision!');
                            chatID = 0;
                            damageGopher(100);
                            playKaboom();
                            stunT = 0;
                            setAnimStars(7);
                            gopher_hide.t = 0;
                            speechID = 'caught';
                            score += 10;
                        } else {
                            chatID = 2;
                            playLaugh();
                            if (HUD.carrotIDX < HUD.remainingCarrots.length) {
                                HUD.remainingCarrots[HUD.carrotIDX] = 0;
                                HUD.carrotIDX++;
                            }

                            score -= 15;
                            if (score < 0) score = 0;

                            // let dx = mx - (gopher_hide.x + gopher_hide.w / 2);
                            // let dy = my - (gopher_hide.y + gopher_hide.h / 2);
                            // let dist = Math.sqrt(dx * dx + dy * dy);

                            // if (dist < 50) {
                            //     chatID = 0;
                            //     damageGopher(50);
                            //     playKaboom();
                            //     stunT = 0;
                            //     setAnimStars(7);
                            // } else if (dist < 120) {
                            //     damageGopher(25);
                            //     chatID = 1;

                            //     playScore();
                            // } else {
                            //     chatID = 2;
                            //     playLaugh();
                            //     if (HUD.carrotIDX < HUD.remainingCarrots.length) {
                            //         HUD.remainingCarrots[HUD.carrotIDX] = 0;
                            //         HUD.carrotIDX++;
                            //     }
                            //     // carrots.shift();
                            // }

                            

                            gopher_hide.t = 0;
                        }
    
                        chats[chatID].x = gopher_hide.x + gopher_hide.w / 3;
                        chats[chatID].y = gopher_hide.y - chats[chatID].h - 10;

                        let rng = 0;

                        if (speechID == 'miss') {
                            randomSpeeches.missPos = (randomSpeeches.missPos + 1) % randomSpeeches[speechID].length;
                            rng = randomSpeeches.missPos;

                            // if (rng == randomSpeeches[speechID].length - 1) {
                            //     shuffleArr(randomSpeeches[speechID]);
                            //     randomSpeeches.missPos = -1;
                            // }
                        } else {
                            randomSpeeches.caughtPos = (randomSpeeches.caughtPos + 1) % randomSpeeches[speechID].length;
                            rng = randomSpeeches.caughtPos;

                            // if (rng == randomSpeeches[speechID].length - 1) {
                            //     shuffleArr(randomSpeeches[speechID]);
                            //     randomSpeeches.caughtPos = -1;
                            // }
                        }
                        console.log(randomSpeeches[speechID][rng]);
                    }
                }
                
            }
        }

        
    });


    canvas.addEventListener('mousemove', e => {
        // mousemoveE(e.offsetX, e.offsetY);
    });
    
    canvas.addEventListener('mouseup', e => {
        // mouseupE();
        if (!gameStart) {
            if (AM.audio.bg.img.paused) {
                AM.audio.bg.img.volume = 0.2;
                AM.audio.bg.img.loop = true;
                AM.audio.bg.img.play();
                console.log('test')
            }
            

            gameStart = true;
            playAllAudio();
            
        }

        if (mDown) {
            mDown = false;
            if (gameover) {
                // reset();
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
// *********************************** GAME INITIATLIZATIONS AND CONTROLS END ******************************************************** //


/*
 * SPRITE MANAGEMENT (SETTING, ADDING, AND DRAWING)
 */

function addCarrot(x, y) {
    let carrot = new Sprite(x, y, carrotInfo.w, carrotInfo.h, AM.images.carrot.cw, AM.images.carrot.ch);
    carrots.push(carrot);
}

function drawCarrots() {
    for (let i = 0; i < carrots.length; ++i) {
        if (i >= HUD.carrotIDX) {
            carrots[i].draw(ctx, AM.images.carrot.img);
        }
    }
}

function drawGopher() {
    if (startT > 0) {
        // 
        if (startT < 2) {
            digT += 10 * delta;
            let frame = Math.floor(digT) % 6;
            gopher.clipX = frame * AM.images.gopher.cw;
            gopher.drawTo(ctx, AM.images.gopher_dig.img, gopher_hide.x, gopher_hide.y);
        } else {
            gopher.clipX = 0;
            // gopher.draw(ctx, AM.images.gopher.img);
            gopher.drawScale(ctx, AM.images.gopher.img, 1.25, gopher_hide.x, gopher_hide.y);
        }
        
    } else if (gopher_hide.goto != null || gopher_hide.moveDestinations.length > 0) {
        // gopher.clipX = AM.images.gopher.cw;
        gopher_hide.clipX = AM.images.gopher.cw;
        gopher_hide.draw(ctx, AM.images.gopher.img);
        // console.log(gopher_hide.clipX)
    } else if (gopher_hide.t2 > shuffleDuration) {
        if (chatID > -1) {
            let key = 'gopher_show';
            if (chatID == 0) {
                // key = 'gopher_stun';
                key = 'gopher_caught';
                // gopher_hide.dynamicdraw(ctx, AM.images[key].img, gopher_hide.ox, gopher_hide.oy, gopherStunInfo.w, gopherStunInfo.h, AM.images[key].cw, AM.images[key].ch);
                
                stunT += 20 * delta;
                let frame = Math.floor(stunT) % 9;
                gopher_hide.clipX = frame * AM.images.gopher.cw;
                gopher_hide.dynamicdraw(ctx, AM.images.gopher_caught.img, gopher_hide.ox, gopher_hide.oy, gopherInfo.w, gopherInfo.h, AM.images.gopher.cw, AM.images.gopher.ch);
                HP.y = gopher_hide.y + gopherInfo.h + 5;
                // animateStars(gopher_hide.x + gopher_hide.w / 2, gopher_hide.y);
                // stunT += 1 * delta;
                // console.log(frame);
            } else if (chatID == 2) {
                // key = 'gopher_steal';
                key = 'gopher_carrot';
                
                gopher_hide.clipX = 0;
                gopher_hide.dynamicdraw(ctx, AM.images[key].img, gopher_hide.ox, gopher_hide.oy, gopherInfo.w, gopherInfo.h, AM.images[key].cw, AM.images[key].ch);
                HP.y = gopher_hide.y + gopherInfo.h + 5;
            } else {
                gopher_hide.clipX = 0;
                gopher_hide.draw(ctx, AM.images.gopher.img);
                // gopher_hide.dynamicdraw(ctx, AM.images[key].img, gopher_hide.ox, gopher_hide.oy, gopherInfo.w, gopherInfo.h, AM.images[key].cw, AM.images[key].ch);
                HP.y = gopher_hide.y + gopherInfo.h + 5;
            }
            
            HP.x = gopher_hide.x - HP.w / 2 + gopher_hide.w / 2;
            
            HP.draw(ctx);
            drawChat();
            

            updateGopherHP();

            if (gopher_hide.t2 < 0.5) {
                startT = 3;
            }
            
        }
    }
}

function moveGopher() {
    gopher_hide.t2 = 0;
    gopher_hide.moveDestinations = calcDestinations();
    chatID = -1;
    nextRoundT = 2;

    if (HP.progress == 0) {
        HP.progress = 100;
        totalHP = 100;
    }
}

function damageGopher(dmg) {
    totalHP -= dmg;
    hpT = 0;
}

function drawChat() {
    chats[chatID].draw(ctx);
}

function updateGopherHP() {
    if (HP.progress > totalHP && HP.progress > 0) {
        hpT += 2 * delta;
        HP.progress = lerp(HP.progress, totalHP, hpT);
        if (HP.progress < 0) {
            HP.progress = 0;

            if (HUD.gopherIDX < HUD.remainingGophers.length) {
                HUD.remainingGophers[HUD.gopherIDX] = 0;
                HUD.gopherIDX++;
            }
        }
    } else if (nextRoundT > 0) {
        nextRoundT -= 1 * delta;
        if (nextRoundT <= 0) {
            nextRoundT = 0;
            if (HUD.carrotIDX == 3) {
                gameover = true;
                HUD.isWin = false;
                HUD.updateFinalScore(score);
            } else if (HUD.gopherIDX == 3) {
                gameover = true;
                HUD.isWin = true;
                HUD.updateFinalScore(score);
            } else {
                moveGopher();
            }
        }
    }
    
}

function calcDestinations() {
    let w = bg_rect.w - destPadX * 2;
    let h = bg_rect.h - destPadX * 2;

    let padX = bg_rect.x + destPadX;
    let padY = bg_rect.y + destPadX;;

    let rows = Math.floor(h / gopher.h);
    let cols = Math.floor(w / gopher.w);

    let rowRem = (h - rows * gopher.h) / rows;
    let colRem = (w - cols * gopher.w) / cols;

    let destinations = [];
    let rng = Math.floor(Math.random() * 7) + 3;
    for (let i = 0, c = 0; i < rng; ++i) {
        let r = Math.floor(Math.random() * rows);

        let currX = c * gopher.w + c * colRem + padX;
        let currY = r * gopher.h + r * rowRem + padY;

        if (currX > canvas.width || currX < 0) currX = canvas.width / 2; 
        if (currY > canvas.height || currY < 0) currY = canvas.height / 2; 

        destinations.push([currY, currX]); // r, c
        if (c == 0) {
            c = cols - 1;
        } else {
            c = 0;
        }
    }

    rng = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < rng; ++i) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);

        let currX = c * gopher.w + c * colRem + padX;
        let currY = r * gopher.h + r * rowRem + padY;

        if (currX > canvas.width || currX < 0) currX = canvas.width / 2; 
        if (currY > canvas.height || currY < 0) currY = canvas.height / 2; 
        destinations.push([currY, currX]);
        // destinations.push([r * gopherHideInfo.h + r * rowRem + padY, c * gopherHideInfo.w + c * colRem + padX]); // r, c
    }

    // let r = Math.floor(Math.random() * (rows - 4)) + 4;
    // let c = Math.floor(Math.random() * (cols - 8)) + 4;
    let c = Math.floor(Math.random() * cols);
    let currX = c * gopher.w + c * colRem + padX;
    if (currX > canvas.width || currX < 0) currX = canvas.width / 2; 

    // destinations.push([carrots[0].y - gopher_hide.h * 2, c * gopherHideInfo.w + c * colRem + padX]); // r, c
    destinations.push([canvas.height - gopher_hide.h * 4, currX]); // r, c

    // console.log(destinations);

    return destinations;
}
// *********************************** SPRITE MANAGEMENT END ******************************************************** //


/*
 * PHYSICS
 */
function checkCollision(r1, r2) {
   return r1.x + r1.w >= r2.x && r1.x <= r2.x + r2.w && r1.y + r1.h >= r2.y && r1.y <= r2.y + r2.h;
}
// *********************************** PHYSICS END ******************************************************** //

/*
 * TEXT DISPLAYS
 */
function showPoints(pointType) {
    // HUD.draw(ctx, AM.images.timecircle.img);
    // jumpPointsT += 1 * delta;
    if (jump > 0) {
        let y = pig.y + jump - pig.h;
        TXT.follow('points', pig.x, y, pig.w, pig.h);
        TXT.draw('points');
        jump -= G * jumpSpeed * delta;
    }
}

// *********************************** TEXT DISPLAYS END ******************************************************** //


/*
 * SOUNDS
 */
function playKaboom() {
    if (HUD.volumeOn) {
        setTimeout(() => {
            AM.audio.kaboom.img.currentTime = 0;
            AM.audio.kaboom.img.volume = 0.5;
            AM.audio.kaboom.img.play();
        }, 0);
        
    }
}

function playLaugh() {
    if (HUD.volumeOn) {
        setTimeout(() => {
            AM.audio.laugh.img.currentTime = 0;
            AM.audio.laugh.img.volume = 0.5;
            AM.audio.laugh.img.play();
        }, 0);
        
    } 
}

function playScore() {
    if (HUD.volumeOn) {
        setTimeout(() => {
            AM.audio.score.img.currentTime = 0;
            AM.audio.score.img.volume = 0.5;
            AM.audio.score.img.play();
        }, 0);
    }
}

// *********************************** SOUNDS END ******************************************************** //

// #11A5CC
// #F8E7CD
/*
 * GAME UPDATES AND CYCLES
 */
function reset() {
    gameover = false;
   
    totalHP = 100;

    HUD.remainingGophers = [1, 1, 1];
    HUD.remainingCarrots = [1, 1, 1];

    HUD.carrotIDX = 0;
    HUD.gopherIDX = 0;

    startT = 3;

    timer.setTimer(gameDuration);

    gopher_hide.x = canvas.width / 2;
    gopher_hide.ox = canvas.width / 2;
    gopher_hide.y = canvas.height / 2;
    gopher_hide.oy = canvas.height / 2;

    moveGopher();

    // HUD.txt.texts['time'].str = zeroPad(Math.floor(timer.timer / 24), 2);

    // if (health < 0) {
    //     health = 0;
    //     gameover = true;
    // }

    // if (delta < 1) {
    //     HUD.timeProgressBar.update(delta, Math.floor(timer.timer / 24));
        
    //     timer.tick(delta);

    //     if (timer.timer <= 0) {
    //         gameover = true;
    //     }
    // }

    
}

function update() {
    if (delta < 1) {
        if (startT == 0) {
            gopher_hide.update(1, delta);
    
            HUD.txt.texts['time'].str = zeroPad(Math.floor(timer.timer / 24), 2);
    
            HUD.timeProgressBar.update(delta, Math.floor(timer.timer / 24) / gameDuration * 100);
    
            if (gopher_hide.goto == null && gopher_hide.moveDestinations.length == 0) {
                timer.tick(delta);
            }
    
            if (timer.timer <= 0) {
                gameover = true;
                HUD.isWin = false;
                HUD.updateFinalScore(score);
            }
        } else {
            startT -= 1 * delta;
            if (startT <= 0) startT = 0;
        }
    }
    
}

function drawStunHalo(d) {
    ctx.save();

    // move to the center of the canvas
    ctx.translate(startPage.halo.ox + startPage.halo.w / 2, startPage.halo.oy + startPage.halo.h / 2);
    
    let stunDegrees = Math.sin(startScreenHandAnimT * 20) * 20 * d;
    // rotate the canvas to the specified degrees
    ctx.rotate(stunDegrees * Math.PI/180);

    // draw the image
    startPage.halo.x = -0.5 * startPage.halo.w;
    startPage.halo.y = -0.5 * startPage.halo.h;

    ctx.drawImage(AM.images.halo.img, 0, 0, AM.images.halo.cw, AM.images.halo.ch, startPage.halo.x, startPage.halo.y, startPage.halo.w, startPage.halo.h);
    

    // we’re done with the rotating so restore the unrotated context
    ctx.restore();
}

function startPageAnimations() {
    ctx.beginPath();
    ctx.fillStyle = '#F8E7CD';
    // ctx.fillStyle = '#f00';
    ctx.rect(startPage.coverAll.x, startPage.coverAll.y, startPage.coverAll.w, startPage.coverAll.h);
    // ctx.rect(startPage.handcover.x, startPage.handcover.y, startPage.handcover.w, startPage.handcover.h);
    // ctx.rect(startPage.gophercover.x, startPage.gophercover.y, startPage.gophercover.w, startPage.gophercover.h);

    

    // ctx.rect(740, 280, 310, 150);
    // ctx.rect(1100, 280, 310, 150);
    ctx.fill();

    let handx = Math.sin(startScreenHandAnimT) * 20;
    let frame = Math.floor(startScreenHandAnimT) % 8;
                
    // ctx.drawImage(images.hand.obj.img, frame * startPageInfo.hand.cw, 0, startPageInfo.hand.cw, startPageInfo.hand.ch, startPageInfo.hand.x, startPageInfo.hand.y, startPageInfo.hand.w, startPageInfo.hand.h);
    ctx.drawImage(AM.images.hand.img, frame * AM.images.hand.cw, 0, AM.images.hand.cw, AM.images.hand.ch, startPage.hand.x, startPage.hand.y, startPage.hand.w, startPage.hand.h);
    TXT.draw('instruction1');
    TXT.draw('instruction1_2');

    ctx.drawImage(AM.images.gopher.img, 0, 0, AM.images.gopher.cw, AM.images.gopher.ch, startPage.gopher.x, startPage.gopher.y, startPage.gopher.w, startPage.gopher.h);
    TXT.draw('instruction2');
    TXT.draw('instruction2_2');

    let carrotRotation = Math.sin(startScreenHandAnimT) * 15;
    ctx.save();
    // Untransformed draw position
    const position = {x: startPage.carrot.x, y: startPage.carrot.y};
    // In degrees
    const rotation = { x: 0, y: 0, z: carrotRotation };
    // Rotation relative to here (this is the center of the image)
    // const rotPt = { x: this.w / 2, y: this.h / 2 };
    const rotPt = { x: startPage.carrot.w / 2, y: startPage.carrot.h / 2 };

    ctx.setTransform(new DOMMatrix()
        .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
        .rotateSelf(rotation.x, rotation.y, rotation.z)
    );
    
    ctx.drawImage(AM.images.carrot.img, 0, 0, AM.images.carrot.cw, AM.images.carrot.ch, -rotPt.x, -rotPt.y, startPage.carrot.w, startPage.carrot.h);
    ctx.restore();
    // ctx.drawImage(AM.images.carrot.img, 0, 0, AM.images.carrot.cw, AM.images.carrot.ch, startPage.carrot.x, startPage.carrot.y, startPage.carrot.w, startPage.carrot.h);
    TXT.draw('instruction3');
    //
    drawStunHalo(1);
    drawStunHalo(-1);
    //

    let starx1 = Math.sin(startScreenHandAnimT) * 20 * scaleY;
    let starx2 = Math.sin(startScreenHandAnimT * 1.5) * 10 * scaleY;
    let starx3 = Math.sin(startScreenHandAnimT * 2) * 20 * scaleY;
    ctx.drawImage(AM.images.star.img, 0, 0, AM.images.star.cw, AM.images.star.ch, startPage.star.x + startPage.halo.w / 3.5, startPage.star.y + starx1, startPage.star.w, startPage.star.h);
    ctx.drawImage(AM.images.star.img, 0, 0, AM.images.star.cw, AM.images.star.ch, startPage.star.x + startPage.halo.w / 2, startPage.star.y + starx3, startPage.star.w, startPage.star.h);
    ctx.drawImage(AM.images.star.img, 0, 0, AM.images.star.cw, AM.images.star.ch, startPage.star.x + startPage.halo.w / 2.5, startPage.star.y + starx2, startPage.star.w, startPage.star.h);
    ctx.drawImage(AM.images.star.img, 0, 0, AM.images.star.cw, AM.images.star.ch, startPage.star.x + startPage.halo.w / 1.5, startPage.star.y + starx1, startPage.star.w, startPage.star.h);


    
    // ctx.beginPath();
    // ctx.arc(1250, 350, 30, 0, 2 * Math.PI);
    // ctx.stroke();

    // ctx.beginPath();
    // ctx.fillStyle = '#11A5CC';
    // ctx.ellipse(startPage.timer.x, startPage.timer.y, startPage.timer.w, startPage.timer.h, 0, 0, 2 * Math.PI);
    
    // ctx.fill();
    if (delta < 1) {
        startScreenTimerAnimT += 15 * delta;
        // var radians = Math.PI / 180 * startScreenTimerAnimT;

        // ctx.save();
        // ctx.globalAlpha = 0.95;
        // ctx.beginPath();
        // ctx.moveTo(startPage.timer.x, startPage.timer.y);
        // ctx.fillStyle = '#fff';
        // ctx.ellipse(startPage.timer.x, startPage.timer.y, startPage.timer.w, startPage.timer.h, 0, radians, Math.PI + Math.PI / 2);
        // ctx.closePath();
        
        // ctx.fill();
        // ctx.restore();

        startScreenHandAnimT += 10 * delta;
        startScreenHandAnimT2 += 5 * delta;
    }
}

function setAnimStars(nStars) {
    stunAnimStars = [];
    for (let i = 0; i < nStars; ++i) {
        let distx = Math.floor(Math.random() * 30) + 10;
        let disty = Math.floor(Math.random() * 30) + 10;
        let speed = Math.floor(Math.random() * 30) + 10;
        stunAnimStars.push([distx, disty, speed]);
    }
}

function animateStars(x, y) {
    for (let i = 0; i < stunAnimStars.length; ++i) {
        let space = 10;
        let sinX = Math.sin(stunT * stunAnimStars[i][2]) * stunAnimStars[i][0];
        let sinY = Math.cos(stunT * stunAnimStars[i][2]) * stunAnimStars[i][1];
        ctx.drawImage(AM.images.star.img, 0, 0, AM.images.star.cw, AM.images.star.ch, x + sinX + i * space, y + sinY, startPage.star.w, startPage.star.h);
    }
    
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    if (!gameover) {
        if (gameStart) {
            // bg
            // drawBG(ctx, 'bg');
            ctx.save();
            ctx.fillStyle = '#97DE54';
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.fill();
            ctx.restore();

            bg_rect.draw(ctx);
            bg.draw(ctx);

            // gopher_hide.draw(ctx, AM.images.gopher_hide.img);
            drawGopher();

            drawCarrots();
            soil.draw(ctx);
            
            HUD.draw(ctx);

            // gopher.draw(ctx, AM.images.gopher_show.img);
            

            
            update();
        } else {
        
            ctx.drawImage(AM.images.intro.img, 0, 0, AM.images.intro.cw, AM.images.intro.ch, 0, 0, canvas.width, canvas.height);
            

            
            startPageAnimations();
        }

        
    } else {
        // drawBG(ctx, 'bg');
        // HUD.draw(ctx);
        
        HUD.gameover(ctx);
    }

    requestAnimationFrame(gameCycle);
}
// *********************************** GAME UPDATES AND CYCLES END ******************************************************** //

// previous start page 3 instructions
// function startPageAnimations() {
//     ctx.beginPath();
//     ctx.fillStyle = '#F8E7CD';
//     ctx.rect(startPage.handcover.x, startPage.handcover.y, startPage.handcover.w, startPage.handcover.h);
//     ctx.rect(startPage.gophercover.x, startPage.gophercover.y, startPage.gophercover.w, startPage.gophercover.h);

//     // ctx.rect(740, 280, 310, 150);
//     // ctx.rect(1100, 280, 310, 150);
//     ctx.fill();

//     let handx = Math.sin(startScreenHandAnimT) * 20;
//     let frame = Math.floor(startScreenHandAnimT) % 8;
                
//     // ctx.drawImage(images.hand.obj.img, frame * startPageInfo.hand.cw, 0, startPageInfo.hand.cw, startPageInfo.hand.ch, startPageInfo.hand.x, startPageInfo.hand.y, startPageInfo.hand.w, startPageInfo.hand.h);
//     ctx.drawImage(AM.images.hand.img, frame * AM.images.hand.cw, 0, AM.images.hand.cw, AM.images.hand.ch, startPage.hand.x, startPage.hand.y, startPage.hand.w, startPage.hand.h);
//     // ctx.drawImage(AM.images.hand.img, 0, 0, AM.images.hand.cw, AM.images.hand.ch, startPage.hand.x + handx, startPage.hand.y, startPage.hand.w, startPage.hand.h);
//     // tap
//     // ctx.save();
//     // // Untransformed draw position
//     // var position = {x: startPage.hand.x, y: startPage.hand.y};
//     // // In degrees
//     // var rotation = { x: 0, y: Math.sin(startScreenHandAnimT2) * 35, z: 0};
//     // // Rotation relative to here (this is the center of the image)
//     // var rotPt = { x: startPage.hand.w / 2, y: startPage.hand.h / 2 };

//     // ctx.setTransform(new DOMMatrix()
//     //     .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
//     //     .rotateSelf(rotation.x, rotation.y, rotation.z)
//     // );
    
//     // ctx.drawImage(AM.images.hand.img, 0, 0, AM.images.hand.cw, AM.images.hand.ch, -rotPt.x, -rotPt.y, startPage.hand.w, startPage.hand.h);
//     // ctx.restore();
    
//     ctx.drawImage(AM.images.gopher.img, 0, 0, AM.images.gopher.cw, AM.images.gopher.ch, startPage.gopher.x, startPage.gopher.y, startPage.gopher.w, startPage.gopher.h);
    
//     //
//     drawStunHalo(1);
//     drawStunHalo(-1);
//     //

//     let starx1 = Math.sin(startScreenHandAnimT) * 20 * scaleY;
//     let starx2 = Math.sin(startScreenHandAnimT * 1.5) * 10 * scaleY;
//     let starx3 = Math.sin(startScreenHandAnimT * 2) * 20 * scaleY;
//     ctx.drawImage(AM.images.star.img, 0, 0, AM.images.star.cw, AM.images.star.ch, startPage.star.x + startPage.halo.w / 3.5, startPage.star.y + starx1, startPage.star.w, startPage.star.h);
//     ctx.drawImage(AM.images.star.img, 0, 0, AM.images.star.cw, AM.images.star.ch, startPage.star.x + startPage.halo.w / 2, startPage.star.y + starx3, startPage.star.w, startPage.star.h);
//     ctx.drawImage(AM.images.star.img, 0, 0, AM.images.star.cw, AM.images.star.ch, startPage.star.x + startPage.halo.w / 2.5, startPage.star.y + starx2, startPage.star.w, startPage.star.h);
//     ctx.drawImage(AM.images.star.img, 0, 0, AM.images.star.cw, AM.images.star.ch, startPage.star.x + startPage.halo.w / 1.5, startPage.star.y + starx1, startPage.star.w, startPage.star.h);

//     // ctx.beginPath();
//     // ctx.arc(1250, 350, 30, 0, 2 * Math.PI);
//     // ctx.stroke();

//     ctx.beginPath();
//     ctx.fillStyle = '#11A5CC';
//     ctx.ellipse(startPage.timer.x, startPage.timer.y, startPage.timer.w, startPage.timer.h, 0, 0, 2 * Math.PI);
    
//     ctx.fill();
//     if (delta < 1) {
//         startScreenTimerAnimT += 15 * delta;
//         var radians = Math.PI / 180 * startScreenTimerAnimT;

//         ctx.save();
//         ctx.globalAlpha = 0.95;
//         ctx.beginPath();
//         ctx.moveTo(startPage.timer.x, startPage.timer.y);
//         ctx.fillStyle = '#fff';
//         ctx.ellipse(startPage.timer.x, startPage.timer.y, startPage.timer.w, startPage.timer.h, 0, radians, Math.PI + Math.PI / 2);
//         ctx.closePath();
        
//         ctx.fill();
//         ctx.restore();

//         startScreenHandAnimT += 10 * delta;
//         startScreenHandAnimT2 += 5 * delta;
//     }
// }