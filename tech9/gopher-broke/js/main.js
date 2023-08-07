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
var score = 0;

var carrots = [];

var carrotInfo = {
    w: 65,
    h: 115,
}

var gopherInfo = {
    w: 125,
    h: 85,
}

var gopherStunInfo = {
    w: 110,
    h: 112,
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

var gameDuration = 99;
var startT = 2;

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

    TXT = new Text(ctx, w, h); 
    TXT.setScale(scaleX, scaleY);
    
    TXT.addText('points', '+1.00', 'bold', 20, 'Montserrat', 0, 0, 80, 30, '#10aad7', true); 
    jumpHeight *= scaleY;

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
    soil = new StaticSprite(w / 2 - 366 / 2 * scaleX, bg.x + bg.h + 50 * scaleY, 366 * scaleX, 56 * scaleX, 0, 0, AM.images.soil.cw, AM.images.soil.ch, 'soil');

    

    let padLeft = 55 * scaleX;
    let padDist = 90 * scaleX;
    addCarrot(soil.x + padLeft, soil.y - carrotInfo.h / 2);
    addCarrot(soil.x + padLeft + padDist, soil.y - carrotInfo.h / 2);
    addCarrot(soil.x + padLeft + padDist * 2, soil.y - carrotInfo.h / 2);

    gopher = new Sprite(w / 2 - gopherInfo.w / 2, h / 2 - 100 * scaleY, gopherInfo.w, gopherInfo.h, AM.images.gopher_show.cw, AM.images.gopher_show.ch);
    gopher_hide = new Sprite(w / 2 - gopherHideInfo.w / 2, h / 2 - 100 * scaleY, gopherHideInfo.w, gopherHideInfo.h, AM.images.gopher_hide.cw, AM.images.gopher_hide.ch);
    moveGopher();

    controls();
    gameCycle();
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
                        if (isBtnClicked(mx, my, {
                            x: gopher_hide.x,
                            y: gopher_hide.y,
                            w: gopher_hide.w,
                            h: gopher_hide.h
                        })) {
                            
                            console.log('collision!');
                            chatID = 0;
                            damageGopher(50);
                            playKaboom();
                        } else {
                            let dx = mx - gopher_hide.x;
                            let dy = my - gopher_hide.y;
                            let dist = Math.sqrt(dx * dx + dy * dy);
                            
                            if (dist < 100) {
                                damageGopher(25);
                                chatID = 1;

                                playScore();
                            } else {
                                chatID = 2;
                                playLaugh();
                                if (HUD.carrotIDX < HUD.remainingCarrots.length) {
                                    HUD.remainingCarrots[HUD.carrotIDX] = 0;
                                    HUD.carrotIDX++;
                                }
                                // carrots.shift();
                            }
                        }
    
                        chats[chatID].x = gopher_hide.x + gopher_hide.w / 3;
                        chats[chatID].y = gopher_hide.y - chats[chatID].h - 10;
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
            AM.audio.bg.img.volume = 0.2;
            AM.audio.bg.img.loop = true;
            AM.audio.bg.img.play();

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
        gopher.draw(ctx, AM.images.gopher_show.img);
    } else if (gopher_hide.goto != null || gopher_hide.moveDestinations.length > 0) {
        gopher_hide.draw(ctx, AM.images.gopher_hide.img);
    } else if (gopher_hide.t2 > shuffleDuration) {
        if (chatID > -1) {
            let key = 'gopher_show';
            if (chatID == 0) {
                key = 'gopher_stun';
                gopher_hide.dynamicdraw(ctx, AM.images[key].img, gopher_hide.ox, gopher_hide.oy, gopherStunInfo.w, gopherStunInfo.h, AM.images[key].cw, AM.images[key].ch);
                HP.y = gopher_hide.y + gopherStunInfo.h + 5;
            } else if (chatID == 2) {
                key = 'gopher_steal';
                gopher_hide.dynamicdraw(ctx, AM.images[key].img, gopher_hide.ox, gopher_hide.oy, gopherStunInfo.w, gopherStunInfo.h, AM.images[key].cw, AM.images[key].ch);
                HP.y = gopher_hide.y + gopherStunInfo.h + 5;
            } else {
                gopher_hide.dynamicdraw(ctx, AM.images[key].img, gopher_hide.ox, gopher_hide.oy, gopherInfo.w, gopherInfo.h, AM.images[key].cw, AM.images[key].ch);
                HP.y = gopher_hide.y + gopherInfo.h + 5;
            }
            
            HP.x = gopher_hide.x - HP.w / 2 + gopher_hide.w / 2;
            
            HP.draw(ctx);
            drawChat();
            updateGopherHP();
            
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
            } else if (HUD.gopherIDX == 3) {
                gameover = true;
                HUD.isWin = true;
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

    let rows = Math.floor(h / gopherHideInfo.h);
    let cols = Math.floor(w / gopherHideInfo.w);

    let rowRem = (h - rows * gopherHideInfo.h) / rows;
    let colRem = (w - cols * gopherHideInfo.w) / cols;

    let destinations = [];
    let rng = Math.floor(Math.random() * 7) + 3;
    for (let i = 0, c = 0; i < rng; ++i) {
        let r = Math.floor(Math.random() * rows);
        destinations.push([r * gopherHideInfo.h + r * rowRem + padY, c * gopherHideInfo.w + c * colRem + padX]); // r, c
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
        destinations.push([r * gopherHideInfo.h + r * rowRem + padY, c * gopherHideInfo.w + c * colRem + padX]); // r, c
    }

    // let r = Math.floor(Math.random() * (rows - 4)) + 4;
    // let c = Math.floor(Math.random() * (cols - 8)) + 4;
    let c = Math.floor(Math.random() * cols);
    

    destinations.push([carrots[0].y - gopher_hide.h * 2, c * gopherHideInfo.w + c * colRem + padX]); // r, c

    // console.log(destinations[destinations.length - 1]);

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
        AM.audio.kaboom.img.pause();
        AM.audio.kaboom.img.currentTime = 0;
        AM.audio.kaboom.img.play();
    }
}

function playLaugh() {
    if (HUD.volumeOn) {
        AM.audio.laugh.img.pause();
        AM.audio.laugh.img.currentTime = 0;
        AM.audio.laugh.img.play();
    } 
}

function playScore() {
    if (HUD.volumeOn) {
        AM.audio.score.img.pause();
        AM.audio.score.img.currentTime = 0;
        AM.audio.score.img.play();
    }
}

// *********************************** SOUNDS END ******************************************************** //


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

    startT = 2;

    timer.setTimer(gameDuration);

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
    if (startT == 0) {
        gopher_hide.update(1, delta);

        HUD.txt.texts['time'].str = zeroPad(Math.floor(timer.timer / 24), 2);

        HUD.timeProgressBar.update(delta, Math.floor(timer.timer / 24) / gameDuration * 100);
        timer.tick(delta);

        if (timer.timer <= 0) {
            gameover = true;
            HUD.isWin = false;
        }
    } else {
        startT -= 1 * delta;
        if (startT <= 0) startT = 0;
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
            ctx.clearRect(0, 0, canvas.width, canvas.height);

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

            // ctx.beginPath();
            // ctx.rect(btnBegin.x, btnBegin.y, btnBegin.w, btnBegin.h);
            // ctx.stroke();
        }

        
    } else {
        // drawBG(ctx, 'bg');
        // HUD.draw(ctx);
        
        HUD.gameover(ctx);
    }

    requestAnimationFrame(gameCycle);
}
// *********************************** GAME UPDATES AND CYCLES END ******************************************************** //