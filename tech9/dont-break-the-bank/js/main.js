const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');

var instrucions = document.getElementById("game-instructions");


// delta time
var last = 0;
var delta = 0;

const gameDuration = 90;

// game start
var startGame = false; // orientation prep
var gameStart = false; // start game
var gameover = false;
var gameoverT = 0;

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
var pigInfo = {
    // w: 100 * 2,
    // h: 70 * 2,
    w: 384 * 0.60,
    h: 289 * 0.60,
}

var moneyInfo = {
    w: 128 * 1,
    h: 129 * 1,
}

var coinInfo = {
    w: 80 * 1.35,
    h: 80 * 1.35,
}

var glueInfo = {
    w: 75 * 1.5,
    h: 75 * 1.5,
}

var hammerInfo = {
    w: 100,
    h: 200,
}

var ballInfo = {
    w: 81.25 * 1.15,
    h: 91 * 1.15,
}

var kaboomInfo = {
    w: 70 * 1.5,
    h: 30 * 1.5,
}

// srpite containers
var pig = null;
var smoke = null;
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
var glueLimit = 1;
var hammerLimit = 5;
var dropPadding = 0;
var health = 100;

// physics
var forceD = 0;
var friction = 0.98;
var F = 600;
var T = 0;
const G = 9.8;
var kaboomT = 0;


// HUD
var HUD = null;
var volumeOn = true;

// TXT
var TXT = null;
var jumpSpeed = 20;
var jumpHeight = 100;
var jump = 0;
var score = 0;

// startpage
var startScreenTimerAnimT = 0;
var startScreenHandAnimT = 0;

var currPigKey = 'pig_0';

var startPage = {
    title: {
        x: 0,
        y: 75,
        w: 255 * 2,
        h: 89 * 2,
    },
    text1: {
        x: 402,
        y: 483,
        w: 108 * 2,
        h: 29 * 2,
    },
    text2: {
        x: 680,
        y: 483,
        w: 124 * 2,
        h: 25 * 2,
    },
    text3: {
        x: 980,
        y: 483,
        w: 121 * 2,
        h: 27 * 2,
    },
    text4: {
        x: 1280,
        y: 483,
        w: 127 * 2,
        h: 40 * 2,
    },
    hand: {
        x: 430,
        y: 335,
        w: 128,
        h: 130,
    },
    handcover: {
        x: 400,
        y: 280,
        w: 280,
        h: 150,
    },
    startcoin: {
        x: 460,
        y: 345,
        w: 57 * 2,
        h: 57 * 2,
    },
    startball: {
        // x: 1072,
        x: 880,
        // x: 920,
        y: 350,
        w: 90,
        h: 90,
    },
    starthammer: {
        // x: 1022,
        x: 880,
        y: 330,
        ox: 1022,
        oy: 330,
        w: 80 * 2,
        h: 80 * 2,
    },
    startpig: {
        x: 1345,
        y: 351,
        w: 67 * 2,
        h: 57 * 2,
    },
    beginbutton: {
        x: 0,
        y: 700,
        w: 213 * 2,
        h: 49 * 2,
    }
}

var pigbreakFlag = true;
var mouseMoveOrigin = {
    x: 0,
    y: 0
};

var joystick = null;
const onMobile = isMobile();

const splashInfo = {
    x: 0,
    y: 0,
    w: 1864,
    h: 861,
    sx: 1,
    sy: 1,
};

var startButtonInfo = {
    x: 0,
    y: 0,
    w: 192 * 2,
    h: 60 * 2,
}

const onTablet = isTablet();

var tracks = {};

// #313350

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

    if (onTablet) {
        splashInfo.w = AM.images.intro.cw;
        splashInfo.h = AM.images.intro.ch;
    }

    splashInfo.sx = w / splashInfo.w;
    splashInfo.sy = h / splashInfo.h;
    splashInfo.w *= splashInfo.sx;
    splashInfo.h *= splashInfo.sx;

    splashInfo.x = w / 2 - splashInfo.w / 2;
    splashInfo.y = Math.abs(h / 2 - splashInfo.h / 2);

    // if (onMobile && !onTablet) {
    //     splashInfo.y = 0;
    // }

    splashInfo.y = 0;

    rescaleSize(startButtonInfo, scaleX, scaleX);
    startButtonInfo.x = w / 2 - startButtonInfo.w / 2;
    if (onTablet) {
        startButtonInfo.y = splashInfo.y + splashInfo.h - 730 * splashInfo.sx;

    } else {
        startButtonInfo.y = splashInfo.y + splashInfo.h - 230 * splashInfo.sx;
    }

    // if (isMobile()) {
    //     F = 15;
    // }
    F *= scaleX;

    initStartPage();

    let center = w / 2 - (739 / 2) * scaleX;
    adjX = -Math.abs(center - startPage.startcoin.x);
    // alert(center)
    // startPage.startcoin.x = center;
    startPage.startcoin.x += adjX;
    startPage.startball.x += adjX;
    startPage.starthammer.x += adjX + 20 * scaleX;
    startPage.starthammer.y -= 15 * scaleX;
    startPage.starthammer.oy = startPage.starthammer.y;
    startPage.starthammer.ox = startPage.starthammer.x;
    startPage.startpig.x += adjX;

    TXT = new Text(ctx, w, h); 
    TXT.setScale(scaleX, scaleY);
    
    TXT.addText('points', '+1.00', 'bold', 20, 'Montserrat', 0, 0, 80, 30, '#10aad7', true); 
    jumpHeight *= scaleY;

    let x = startPage.startcoin.x + (startPage.startcoin.w / 2 - 230 / 2 * scaleX);
    let y = startPage.startcoin.y + startPage.startcoin.h + 20 * scaleY;
    center = (230 / 2 - 120 / 2) * scaleX;

    TXT.addText('text1_1', 'Save as much money', 'normal', 20, 'Montserrat', x, y, 230, 35, '#fff', false); 
    TXT.addText('text1_2', 'as you can.', 'normal', 20, 'Montserrat', x + center, y + 50 * scaleY, 120, 35, '#fff', false); 

    x = startPage.startball.x + (startPage.startball.w / 2 - 230 / 2 * scaleX);
    center = (230 / 2 - 210 / 2) * scaleX;
    TXT.addText('text2_1', 'Avoid getting hit by', 'normal', 20, 'Montserrat', x, y, 230, 35, '#fff', false); 
    TXT.addText('text2_2', 'marbles/hammers.', 'normal', 20, 'Montserrat', x + center, y + 50 * scaleY, 210, 35, '#fff', false); 

    x = startPage.startpig.x + (startPage.startpig.w / 2 - 280 / 2 * scaleX);
    center = (280 / 2 - 225 / 2) * scaleX;
    TXT.addText('text3_1', '4 cracks to break the bank', 'normal', 20, 'Montserrat', x, y, 280, 35, '#fff', false); 
    TXT.addText('text3_2', 'and one hammer hit.', 'normal', 20, 'Montserrat', x + center, y + 50 * scaleY, 225, 35, '#fff', false); 

    timer = new Timer(0, 0, 0, '#fff');
    timer.setTimer(gameDuration);
    
    
    rescaleSize(pigInfo, scaleX, scaleX);
    rescaleSize(moneyInfo, scaleX, scaleX);
    rescaleSize(ballInfo, scaleX, scaleX);
    rescaleSize(coinInfo, scaleX, scaleX);
    rescaleSize(hammerInfo, scaleX, scaleX);
    rescaleSize(glueInfo, scaleX, scaleX);
    rescaleSize(kaboomInfo, scaleX, scaleX);

    pig = new Sprite(w / 2 - pigInfo.w / 2, h - pigInfo.h - 10, pigInfo.w, pigInfo.h, AM.images.pig_1.cw, AM.images.pig_1.ch);
    smoke = new Sprite(w / 2 - pigInfo.w / 2, h - pigInfo.h - 10, 192 * scaleX, 192 * scaleX, 192, 192);
    pigbreak = new Sprite(w / 2 - pigInfo.w / 2, h - pigInfo.h - 10, pigInfo.w, pigInfo.h, 192, 145);
    // pigbreak = new Sprite(w / 2 - pigInfo.w / 2, h - pigInfo.h - 10, pigInfo.w, pigInfo.h, 192, 145);
    
    gluebonus = new Sprite(0, pig.y - glueInfo.h, glueInfo.w, glueInfo.h, AM.images.glue_0.cw, AM.images.glue_0.ch);
    gluebonus.t = 5;

    kaboom = new StaticSprite(0, 0, kaboomInfo.w, kaboomInfo.h, 0, 0, AM.images.kaboom.cw, AM.images.kaboom.ch, 'kaboom');
    kaboomstar = new StaticSprite(0, 0, kaboomInfo.w * 2, kaboomInfo.h * 2, 0, 0, AM.images.kaboomstar.cw, AM.images.kaboomstar.ch, 'kaboomstar');

    moneyLimit = Math.floor(w / moneyInfo.w);
    coinLimit = Math.floor(w / moneyInfo.w);
    dropPadding = (w - moneyLimit * moneyInfo.w) / 2;

    // HUD = new Sprite(0, 0, 45, 45, AM.images.timecircle.cw, AM.images.timecircle.ch);
    HUD = new Template_1(ctx, w, h, scaleX, scaleY, splashInfo);

    controls();

    addMoney();
    addMoney();
    addMoney();

    addCoins();
    addCoins();
    addCoins();
    addCoins();

    let joystickX = w * 0.15;
    let joystickY = h * 0.75;
    
    joystick = new Joystick(joystickX, joystickY, 150 * 0.90 * scaleX);

    joystick.area.w = AM.images.area.cw * scaleX * 1;
    joystick.area.h = AM.images.area.ch * scaleX * 1;

    joystick.knob.x = joystick.area.x + joystick.area.w / 2 - joystick.knob.w / 2;
    joystick.knob.y = joystick.area.y + joystick.area.h / 2 - joystick.knob.h / 2;
    // var url_string = location.href; 
    // var url = new URL(url_string);
    // var isOn = url.searchParams.get("on");
    // if (isOn == null) isOn = 1;
    // joystick.on = parseInt(isOn);
    joystick.on = true;

    gameCycle();
}

function muteAllAudio(flag) {
    for (let k in AM.audio) {
        AM.audio[k].img.muted = flag;
    }
    
}

function initAllAudio() {
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    for (let k in AM.audio) {
        tracks[k] = audioContext.createMediaElementSource(AM.audio[k].img);
        tracks[k].connect(audioContext.destination);
    }

    // playAllAudio();
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
        pig.x = pig.ox + dist;
        pig.updateBounds(canvas.width);

        if (x >= prevX) {
            // forceD = F;
            pig.yRotate = 180;
        } else  {
            // forceD = -F;
            pig.yRotate = 0;
        }

        let distX = x - prevX;
        let distY = prevY - y;

        joystick.update(distX * 0.5, 0);
        // joystick.update(distX * 0.5, distY);
    }
}

function mouseUp() {
    pig.updateOriginalPos();
    joystick.touchUp();
}

function submitScore() {
    let timeSpent = gameDuration - Math.floor(timer.timer / 24);
    let result = {'game_score': score.toFixed(2), 'activity_id': serverData.id, 'time_spent': timeSpent};
    Vue.prototype.$postData(result, true);
}

function controls() {
    let mid = canvas.width / 2;
    let prevPos = 0;
    let prevPosY = 0;

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

        var x = 0, x1 = 0;
        
        if (gameover) {
            // reset();
            
            if (!mDown) {
                mDown = true;
                var x = e.changedTouches[event.changedTouches.length-1].pageX;
                var y = e.changedTouches[event.changedTouches.length-1].pageY;
                
                if (isBtnClicked(x, y, HUD.endscreenButtons)) {
                    submitScore();
                }
            }
        } else {
            if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
                var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
                var touch = evt.touches[0] || evt.changedTouches[0];
                prevPos = touch.pageX;
                prevPosY = touch.pageY;
                
                if (!gameStart) {
                    if (!mDown) {
                        mDown = true;
                        console.log(gameStart, mDown)
                        if (isBtnClicked(touch.pageX, touch.pageY, startButtonInfo)) {
                            
            
                            // playScore();
                            // playKaboom();
                            // playGlue();
            
                            gameStart = true;
                            initAllAudio();
                            // playAllAudio();

                            AM.audio.bg.img.volume = 0.4;
                            AM.audio.bg.img.loop = true;
                            AM.audio.bg.img.play();
                            
                        }
                    }
                } else {
                    if (isBtnClicked(touch.pageX, touch.pageY, {
                        x: HUD.volume.x,
                        y: HUD.volume.y,
                        w: HUD.volume.w,
                        h: HUD.volume.h
                    })) {
                        HUD.volumeOn = !HUD.volumeOn; 
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
    
                        if (isBtnClicked(touch.pageX, touch.pageY, joystick.hitbox) || !joystick.on) {
                            joystick.active = true;
                        }
                        // console.log(prevPos)
                    }
                }

                
                
            }

            // if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
            //     var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
            //     var touch = evt.touches[0] || evt.changedTouches[0];
            //     x = touch.pageX;
    
            //     if (evt.touches.length > 1) {
            //         var touch2 = evt.touches[1] || evt.changedTouches[1];
            //         x1 = touch2.pageX;
    
            //         if (x >= mid) {
            //             if (!rDown) {
            //                 rDown = true;
            //                 forceD = F;
            //             }
            //         } else  {
            //             if (!lDown) {
            //                 lDown = true;
            //                 forceD = -F;
            //             }
            //         }
    
            //         if (x1 >= mid) {
            //             if (!rDown) {
            //                 rDown = true;
            //                 forceD = F;
            //             }
            //         } else {
            //             if (!lDown) {
            //                 lDown = true;
            //                 forceD = -F;
            //             }
            //         }
            //     } else {
            //         if (x >= mid) {
            //             if (!rDown) {
            //                 rDown = true;
            //                 forceD = F;
            //             }
            //         } else  {
            //             if (!lDown) {
            //                 lDown = true;
            //                 forceD = -F;
            //             }
            //         }
            //     }
            // }
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
            //     forceD = 0;
            // }

            
        }

        if (mDown) {
            mDown = false;
            // pig.updateOriginalPos();
            mouseUp();
            // mouseMoveOrigin.x = pig.x;
            // console.log(x)
        }
    });

    // canvas.addEventListener('touchstart', e => {
    //     // mousedownE(e.touches[0].clientX, e.touches[0].clientY);
    //     // e.preventDefault();
    //     var touch = evt.touches[0] || evt.changedTouches[0];
    //     let x = touch.pageX;

    //     let mid = canvas.width / 2;
    //     if (x >= mid) {
    //         if (!rDown) {
    //             rDown = true;
    //             forceD = F;
    //         }
    //     } else if (x < mid) {
    //         if (!lDown) {
    //             lDown = true;
    //             forceD = -F;
    //         }
    //     }
    // });
    
    canvas.addEventListener('touchmove', e => {
        // mousemoveE(e.touches[0].clientX, e.touches[0].clientY);
        if (!gameover) {
            if (e.type == 'touchmove') {
                var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
                var touch = evt.touches[0] || evt.changedTouches[0];
                let x = touch.pageX;
                let y = touch.pageY;

                if (mDown) {
                    // let dist = x - mouseMoveOrigin.x;
                    // pig.x = pig.ox + dist;
                    // pig.updateBounds(canvas.width);

                    // if (x >= prevPos) {
                    //     // forceD = F;
                    //     pig.yRotate = 180;
                    // } else  {
                    //     // forceD = -F;
                    //     pig.yRotate = 0;
                    // }
                    mouseMove(x, y, prevPos, prevPosY);

                    prevPos = x;
                    prevPosY = y;
                    // if (evt.touches.length > 0) {
                    //     if (x > pig.x) {
                    //         if (!rDown) {
                    //             rDown = true;
                    //             forceD = F;
                    //         }
                    //     } else  {
                    //         if (!lDown) {
                    //             lDown = true;
                    //             forceD = -F;
                    //         }
                    //     }

                    //     prevPos = x;
                    // }

                
                    
                }
                
            }
        }
    });

    canvas.addEventListener('touchend', e => {
        // mouseupE();
        // e.preventDefault();
        // var touch = evt.touches[0] || evt.changedTouches[0];
        // let x = touch.pageX;
        var x = e.changedTouches[event.changedTouches.length-1].pageX;
        var y = e.changedTouches[event.changedTouches.length-1].pageY;

        // if (!gameStart) {
        //     if (isBtnClicked(x, y, startButtonInfo)) {
        //         AM.audio.bg.img.volume = 0.4;
        //         AM.audio.bg.img.loop = true;
        //         AM.audio.bg.img.play();

        //         // playScore();
        //         // playKaboom();
        //         // playGlue();

        //         gameStart = true;
        //         // initAllAudio();
        //         // playAllAudio();
                
        //     }
        // } 
        
    });

    canvas.addEventListener('mousedown', e => {
        // mousedownE(e.offsetX, e.offsetY);
        let mx = e.offsetX;
        let my = e.offsetY;

        if (!mDown) {
            mDown = true;

            if (!gameStart) {

                if (isBtnClicked(mx, my, startButtonInfo)) {
                    
    
                    // playScore();
                    // playKaboom();
                    // playGlue();
    
                    gameStart = true;
                    initAllAudio();
                    // playAllAudio();

                    AM.audio.bg.img.volume = 0.4;
                    AM.audio.bg.img.loop = true;
                    AM.audio.bg.img.play();
                    
                }
            } else if (gameover) {
                if (isBtnClicked(mx, my, HUD.endscreenButtons)) {
                    submitScore();
                }
            } else {
                mouseMoveOrigin.x = mx;
                if (isBtnClicked(mx, my, joystick.hitbox) || !joystick.on) {
                    joystick.active = true;
                }
            }
            
        }

        if (isBtnClicked(mx, my, {
            x: HUD.volume.x,
            y: HUD.volume.y,
            w: HUD.volume.w,
            h: HUD.volume.h
        })) {
            HUD.volumeOn = !HUD.volumeOn; 
            if (HUD.volumeOn) {
                AM.audio.bg.img.currentTime = 0;
                AM.audio.bg.img.play();
            } else {
                AM.audio.bg.img.pause();
                // music.correct.obj.volume = 0;
            }
        }

        // if (mx > canvas.width / 2) {
        //     if (!rDown) {
        //         rDown = true;
        //         forceD = F;
        //     }
        // } else {
        //     if (!lDown) {
        //         lDown = true;
        //         forceD = -F;
        //     }
        // }
    });

    document.addEventListener('keydown', e => {
        if (!gameover) {
            if (e.key == 'ArrowRight') {
                if (!rDown) {
                    rDown = true;
                    forceD = F;
                    pig.yRotate = 180;
                }
            } else if (e.key == 'ArrowLeft') {
                if (!lDown) {
                    lDown = true;
                    forceD = -F;
                    pig.yRotate = 0;
                }
            }
        }
        
    });

    document.addEventListener('keyup', e => {
        if (!gameover) {
            if (e.key == 'ArrowRight') {
                rDown = false;
            } else if (e.key == 'ArrowLeft') {
                lDown = false;
            }

            if (!rDown && !lDown) {
                forceD = 0;
            }
        }
    });

    canvas.addEventListener('mousemove', e => {
        // mousemoveE(e.offsetX, e.offsetY);
        let mx = e.offsetX;
        let my = e.offsetY;
        // console.log(mx, my);
        if (gameover) mDown = false;

        if (mDown) {
            // let dist = mx - mouseMoveOrigin.x;
            // pig.x = pig.ox + dist;
            // pig.updateBounds(canvas.width);


            // if (mx >= prevPos) {
            //     // forceD = F;
            //     pig.yRotate = 180;
            // } else {
            //     // forceD = -F;
            //     pig.yRotate = 0;
            // }

            mouseMove(mx, my, prevPos, prevPosY);

            prevPos = mx;
            prevPosY = my;
        }
    });
    
    canvas.addEventListener('mouseup', e => {
        let mx = e.offsetX;
        let my = e.offsetY;
        // mouseupE();
        // if (!gameStart) {
        //     if (isBtnClicked(mx, my, startButtonInfo)) {
        //         AM.audio.bg.img.volume = 0.4;
        //         AM.audio.bg.img.loop = true;
        //         AM.audio.bg.img.play();

        //         gameStart = true;
        //     }
        // }

        if (mDown) {
            mDown = false;
            // pig.updateOriginalPos();

            mouseUp();
            
            // prevPos = 0;
            // if (rDown) 

            // if (mx >= mid) {
            //     rDown = false;
            // } else {
            //     lDown = false;
            // }
            
            if (gameover && gameoverT <= 0) {
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
        startPage[k].h *= scaleX;
    }

    startPage.title.x = canvas.width / 2 - startPage.title.w / 2;
    startPage.beginbutton.x = canvas.width / 2 - startPage.beginbutton.w / 2;

    startPage.starthammer.ox *= scaleX;
    startPage.starthammer.oy *= scaleY;
}
// *********************************** GAME INITIATLIZATIONS AND CONTROLS END ******************************************************** //


/*
 * SPRITE MANAGEMENT (SETTING, ADDING, AND DRAWING)
 */

function drawGlueBonus() {
    if (gluebonus.t < 5) {
        gluebonus.t += 10 * delta;
        let a = Math.sin(gluebonus.t) * 15 * scaleX;
        let frame = Math.floor(gluebonus.t) % 4;
        let clipX = frame * 80.25;
        gluebonus.clipX = clipX;

        gluebonus.w += a;
        gluebonus.h += a;

        gluebonus.x = pig.x + pig.w / 2 - gluebonus.w / 2;
        gluebonus.y = gluebonus.oy - a;
        // let alpha = a;
        // ctx.save();
        // ctx.globalAlpha = Math.max(0, alpha - 1);
        gluebonus.draw(ctx, AM.images.glue_0.img)
        // ctx.restore();
        if (gluebonus.t >= 5) {
            gluebonus.t = 5;
            gluebonus.w = gluebonus.ow;
            gluebonus.h = gluebonus.oh;
        }
    }
    
}

function drawPig() {
    let frame = 0;

    if (forceD != 0 || mDown) {
        pig.t += 15 * delta;
        frame = Math.floor(pig.t) % 4;
        // frame = Math.floor(pig.t) % 5 + 1;
    }

    // pig.t += 10 * delta;
    // let frame = Math.floor(pig.t) % 5 + 1;
    
    // pig.draw(ctx, AM.images['pig_' + frame].img);
    pig.clipX = AM.images[currPigKey].cw * frame;
    pig.drawRotate(ctx, AM.images[currPigKey].img);
    drawGlueBonus();
}

function drawPigBreak() {
    pig.t += 5 * delta;
    let frame = Math.floor(pig.t);

    if (pigbreakFlag) {
        pigbreak.x = pig.x;
        pigbreak.y = pig.y;

        pigbreak.clipX = frame * 192;
        pigbreak.draw(ctx, AM.images.break.img);
        if (frame == 4) {
            pigbreakFlag = false;
            pig.t = 0;
        }
    } else {
        pigbreak.draw(ctx, AM.images.break.img);

        if (frame < 9) {
            smoke.x = pig.x;
            smoke.y = pig.y;
    
            let clipX = frame % 3;
            let clipY = Math.floor(frame / 3);
    
            smoke.clipX = clipX * 192;
            smoke.clipY = clipY * 192;
            
            smoke.draw(ctx, AM.images.smoke.img);
        }
    }

    
    // if (frame > 4) frame = 4;
    


    // pig.t += 10 * delta;
    // let frame = Math.floor(pig.t) % 5 + 1;
    
    // pig.draw(ctx, AM.images['pig_' + frame].img);
    // let id = 'pigbreak_' + frame;
    // pig.dynamicDrawRotate(ctx, AM.images[id].img, AM.images[id].cw, AM.images[id].ch);
    
    
}

function addBall() {
    if (balls.length < ballsLimit) {
        let ball = new Sprite(Math.floor(Math.random() * canvas.width), -ballInfo.h * 3, ballInfo.w, ballInfo.h, AM.images.marbles.cw, AM.images.marbles.ch);
        ball.dropSpeed = 20;

        let frame = Math.floor(Math.random() * 8);
        ball.clipX = AM.images.marbles.cw * frame;
        // let rng = Math.floor(Math.random() * 3) + 1;
        // ball.w *= rng; 
        // ball.h *= rng; 

        let d = Math.floor(Math.random() * 2);
        let xSpeed = Math.floor(Math.random() * 200 + 50);
        if (d) {
            ball.vx = xSpeed;
        } else {
            ball.vx = -xSpeed;
        }

        ball.id = Math.floor(Math.random() * 5) + 1;
        ball.restitution = Math.floor(Math.random() * 100) + 300;

        balls.push(ball);
    }
}

function drawBall() {
    for (let i = 0; i < balls.length; ++i) {
        balls[i].draw(ctx, AM.images.marbles.img);
    }
}

function resetBall(i) {
    balls[i].y = -200;
}

function addMoney() {
    if (moneyList.length < moneyLimit) {
        let money = new Sprite(moneyList.length * moneyInfo.w + dropPadding, 0, moneyInfo.w, moneyInfo.w, AM.images.money.cw, AM.images.money.ch);

        // if (moneyList.length == 10) money.dropSine = 1;
        
        moneyList.push(money);
        resetMoney(moneyList.length - 1);
    }
}

function drawMoney() {
    for (let i = 0; i < moneyList.length; ++i) {
        moneyList[i].draw(ctx, AM.images.money.img);
        moneyList[i].t += 2 * delta;
        let frame = Math.floor(moneyList[i].t) % 8;
        moneyList[i].clipX = frame * AM.images.money.cw;
    }
}

function resetMoney(i) {
    moneyList[i].dropSpeed = Math.floor(Math.random() * 10) + 1;
    moneyList[i].dropSine = Math.floor(Math.random() * 2);
    moneyList[i].x = Math.floor(Math.random() * (canvas.width - moneyList[i].w - 10));
    moneyList[i].y = -moneyList[i].h * moneyList[i].dropSpeed;
    moneyList[i].vy = 0;
}

function addCoins() {
    if (coins.length < coinLimit) {
        let id = 'coin_' + (Math.floor(Math.random() * 3) + 1);
        let coin = new Sprite(coins.length * coinInfo.w, 0, coinInfo.w, coinInfo.w, AM.images[id].cw, AM.images[id].ch);
        coin.id = id;
        
        coins.push(coin);
        resetCoin(coins.length - 1);
        
    }
}

function drawCoins() {
    for (let i = 0; i < coins.length; ++i) {
        coins[i].draw(ctx, AM.images[coins[i].id].img);
    }
}

function resetCoin(i) {
    coins[i].dropSpeed = Math.floor(Math.random() * 10) + 1;
    coins[i].dropSine = Math.floor(Math.random() * 2);
    coins[i].x = Math.floor(Math.random() * (canvas.width - coins[i].w));
    coins[i].y = -coins[i].h * coins[i].dropSpeed;
    coins[i].vy = 0;
    coins[i].id = 'coin_' + (Math.floor(Math.random() * 6) + 1);
    coins[i].clipW = AM.images[coins[i].id].cw;
    coins[i].clipH = AM.images[coins[i].id].ch;
}

function addHammer() {
    if (hammers.length < hammerLimit) {
        // let id = 'hammer_' + (Math.floor(Math.random() * 3) + 1);

        let hammer = new Sprite(hammers.length * hammerInfo.w, 0, hammerInfo.w, hammerInfo.h, AM.images.hammer.cw, AM.images.hammer.ch);
        // hammer.id = id;
        hammer.x = Math.floor(Math.random() * (canvas.width - hammer.w / 2));
        hammer.dropSpeed = Math.floor(Math.random() * 15) + 1;
        
        hammers.push(hammer);
        resetHammer(hammers.length - 1);
        
    }
}

function drawHammers() {
    for (let i = 0; i < hammers.length; ++i) {
        hammers[i].rotationT -= 100 * delta;
        ctx.save();
        // Untransformed draw position
        const position = {x: hammers[i].x, y: hammers[i].y};
        // In degrees
        const rotation = { x: 0, y: 0, z: hammers[i].rotationT};
        // Rotation relative to here (this is the center of the image)
        // const rotPt = { x: this.w / 2, y: this.h / 2 };
        const rotPt = { x: hammers[i].w / 2, y: hammers[i].h / 2 };

        ctx.setTransform(new DOMMatrix()
            .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
            .rotateSelf(rotation.x, rotation.y, rotation.z)
        );
        
        ctx.drawImage(AM.images.hammer.img, hammers[i].clipX, hammers[i].clipY, hammers[i].clipW, hammers[i].clipH, -rotPt.x, -rotPt.y, hammers[i].w, hammers[i].h);
        ctx.restore();
        
        // ctx.save();

        // // move to the center of the canvas
        // ctx.translate(hammers[i].ox + hammers[i].w / 2, (hammers[i].y + hammers[i].dropDist) + hammers[i].h / 2);
        
        // hammers[i].rotationT += 0.05 * delta;
        // hammers[i].degrees = Math.cos(hammers[i].rotationT) * 7200;
        // // rotate the canvas to the specified degrees
        // ctx.rotate(hammers[i].degrees * Math.PI/180);

        // // draw the image
        // hammers[i].x = -0.5 * hammers[i].w;
        // hammers[i].y = -0.5 * (hammers[i].h);

        // hammers[i].draw(ctx, AM.images.hammer.img);
        // // we’re done with the rotating so restore the unrotated context
        // ctx.restore();
        
    }
}

function resetHammer(i) {
    hammers[i].dropSpeed = Math.floor(Math.random() * 15) + 1;
    hammers[i].x = Math.floor(Math.random() * (canvas.width - hammers[i].w / 2));
    hammers[i].ox = hammers[i].x;
    hammers[i].y = -hammers[i].h * hammers[i].dropSpeed;
    // hammers[i].oy = hammers[i].y;
    hammers[i].vy = 0;
    hammers[i].degrees = 0;
    hammers[i].rotationT = 0;
    hammers[i].dropDist = -200;
}

function addGlue() {
    if (glues.length < glueLimit) {
        // let id = 'hammer_' + (Math.floor(Math.random() * 3) + 1);
        // let id = 'glue_' + (Math.floor(Math.random() * 2) + 1);
        let id = 'glue_0';

        // let glue = new Sprite(glues.length * glueInfo.w, 0, glueInfo.w, glueInfo.w, AM.images[id].cw, AM.images[id].ch);
        let glue = new Sprite(glues.length * glueInfo.w, 0, glueInfo.w, glueInfo.w, 80.25, 83);
        glue.id = id;
        glue.x = Math.floor(Math.random() * (canvas.width - glue.w));
        glue.dropSpeed = Math.floor(Math.random() * 15) + 1;
        
        glues.push(glue);
        resetGlue(glues.length - 1);
        
    }
}

function drawGlues() {
    for (let i = 0; i < glues.length; ++i) {
        glues[i].t += 10 * delta;
        let frame = Math.floor(glues[i].t) % 4;
        let clipX = frame * 80.25;
        glues[i].clipX = clipX;
        glues[i].draw(ctx, AM.images[glues[i].id].img);
    }
}

function resetGlue(i) {
    glues[i].dropSpeed = Math.floor(Math.random() * 15) + 1;
    // glues[i].dropSpeed = 0.5;
    glues[i].x = Math.floor(Math.random() * (canvas.width - glues[i].w));
    glues[i].y = -glues[i].h * 30;
    // glues[i].y = -glues[i].h * glues[i].dropSpeed;
    glues[i].vy = 0;
    // glues[i].id = 'glue_' + (Math.floor(Math.random() * 2) + 1);
    // glues[i].id = 'glue_0';
}

function drawKaboom() {
    if (kaboomT > 0) {
        kaboom.x = pig.x + pig.w / 2 - kaboom.w / 2;
        kaboom.y = pig.y;

        kaboomstar.x = pig.x + pig.w / 2 - kaboomstar.w / 2;
        kaboomstar.y = kaboom.y - kaboomstar.h / 2 + kaboom.h / 2;

        
        kaboomstar.draw(ctx);
        kaboom.draw(ctx);

        kaboomT -= 5 * delta;
    }
}
// *********************************** SPRITE MANAGEMENT END ******************************************************** //


/*
 * PHYSICS
 */
function checkCollision(r1, r2) {
   return r1.x + r1.w >= r2.x && r1.x <= r2.x + r2.w && r1.y + r1.h >= r2.y && r1.y <= r2.y + r2.h;
}

function checkCollision2(r1, r2) {
    return r1.x + r1.w >= r2.x && r1.x <= r2.x + r2.w && r1.y + r1.h >= r2.oy + r2.dropDist && r1.y <= r2.oy + r2.dropDist + r2.h;
}

function checkAngledCollisions(obj1, obj2) {
    return doPolygonsIntersect(
        [{ x: obj1.x, y: obj1.y }, { x: obj1.x + obj1.w, y: obj1.y }, { x: obj1.x + obj1.w, y: obj1.y + obj1.h }, { x: obj1.x, y: obj1.y + obj1.h }],
        [{ x: obj2.x, y: obj2.y }, { x: obj2.x + obj2.w, y: obj2.y }, { x: obj2.x + obj2.w, y: obj2.y + obj2.h }, { x: obj2.x, y: obj2.y + obj2.h }]
    );
}

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
};

function collisionUpdate() {
    for (let i = 0; i < moneyList.length; ++i) {
        if (checkCollision(pig, moneyList[i])) {
            jump = jumpHeight;
            TXT.texts['points'].str = '+1.00';
            health = Math.min(100, health + 1);
            score += 1;
            resetMoney(i);
            if (HUD.volumeOn)
                playScore();
            break;
        }
    }

    for (let i = 0; i < coins.length; ++i) {
        if (checkCollision(pig, coins[i])) {
            jump = jumpHeight;

            let val = 0.25;

            if (coins[i].id == 'coin_1') {
                val = 0.05;
            } else if (coins[i].id == 'coin_2') {
                val = 0.10;
            }

            health = Math.min(100, health + val);
            score += val;

            TXT.texts['points'].str = '+' + val.toFixed(2);
            
            resetCoin(i);

            if (HUD.volumeOn)
                playScore();
            break;
        }
    }

    // HUD.txt.texts['score'].str = (score < 10 ? '0' : '') + score.toFixed(2);
    HUD.updateScoreSprite((score < 10 ? '0' : '') + score.toFixed(2));

    for (let i = 0; i < balls.length; ++i) {
        if (checkCollision(pig, balls[i])) {
            kaboomT = 2;
            // health -= 10;
            health -= 20;
            resetBall(i);

            if (HUD.volumeOn)
                playKaboom();
            break;
        }
    }

    for (let i = 0; i < glues.length; ++i) {
        if (checkCollision(pig, glues[i])) {
            // health += 10;
            health = Math.min(100, health + 10);
            resetGlue(i);
            gluebonus.t = 0;
            if (HUD.volumeOn)
                playGlue();
            break;
        }
    }

    for (let i = 0; i < hammers.length; ++i) {
        // let y = hammers[i].oy + hammers[i].dropDist;
        // if (doPolygonsIntersect(
        //     [{ x: pig.x, y: pig.y }, { x: pig.x + pig.w, y: pig.y }, { x: pig.x + pig.w, y: pig.y + pig.h }, { x: pig.x, y: pig.y + pig.h }],
        //     [{ x: hammers[i].ox, y: y }, { x: hammers[i].ox + hammers[i].w, y: y }, { x: hammers[i].ox + hammers[i].w, y: y + hammers[i].h }, { x: hammers[i].ox, y: y + hammers[i].h }]
        // )) {
        //     kaboomT = 2;
        //     // health -= 10;
        //     health = 0;
        //     resetHammer(i);

        //     if (HUD.volumeOn)
        //         playKaboom();
        //     break;
        // }
        if (checkAngledCollisions(pig, hammers[i])) {
            kaboomT = 2;
            // health -= 10;
            health = 0;
            resetHammer(i);

            if (HUD.volumeOn)
                playKaboom();
            break;
        }

        
        // if (checkCollision2(pig, hammers[i])) {
        //     // jump = jumpHeight;
        //     // TXT.texts['points'].str = '+1.00';
        //     resetHammer(i);
        // }
    }
}

function bounceBalls() {
    for (let i = 0; i < balls.length; ++i) {
        balls[i].x += balls[i].vx * delta;
        balls[i].y += balls[i].vy * delta;
        balls[i].vy += G * delta * balls[i].dropSpeed;

        if (balls[i].y + balls[i].h >= canvas.height) {
            balls[i].vy = -Math.floor(Math.random() * 250 + balls[i].restitution);
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

function dropCoins() {
    for (let i = 0; i < coins.length; ++i) {
        coins[i].y += coins[i].vy * delta;
        coins[i].vy += G * delta * coins[i].dropSpeed;

        if (coins[i].y > canvas.height) {
            resetCoin(i);
        }
    }    
}

function dropHammers() {
    for (let i = 0; i < hammers.length; ++i) {
        // hammers[i].y += hammers[i].vy * delta;
        // hammers[i].dropDist += hammers[i].vy * delta;
        // hammers[i].vy += G * delta * hammers[i].dropSpeed;
        hammers[i].vy += G * delta * hammers[i].dropSpeed;
        hammers[i].y += hammers[i].vy * delta;
        // console.log('test', hammers[i].y + hammers[i].dropDist, canvas.height);

        if (hammers[i].y > canvas.height) {
            resetHammer(i);
        }
    }    
}

function dropGlues() {
    for (let i = 0; i < glues.length; ++i) {
        glues[i].y += glues[i].vy * delta;
        glues[i].vy += G * delta * glues[i].dropSpeed;

        if (glues[i].y > canvas.height) {
            resetGlue(i);
        }
    }    
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
function playScore() {
    setTimeout(() => {
        AM.audio.score.img.volume = 0.3;
        AM.audio.score.img.currentTime = 0;
        AM.audio.score.img.play();
    }, 0);
    
}

function playGlue() {
    setTimeout(() => {
        AM.audio.glue.img.volume = 0.3;
        AM.audio.glue.img.currentTime = 0;
        AM.audio.glue.img.play();
    }, 0);
    
}

function playKaboom() {
    setTimeout(() => {
        AM.audio.kaboom.img.volume = 0.3;
        AM.audio.kaboom.img.currentTime = 0;
        AM.audio.kaboom.img.play();
    }, 0);
    
}

// *********************************** SOUNDS END ******************************************************** //


/*
 * GAME UPDATES AND CYCLES
 */
function reset() {
    gameover = false;
    health = 100;

    pig.x = canvas.width / 2;
    score = 0;

    for (let i = 0; i < moneyList.length; ++i) {
        resetMoney(i);
    }

    for (let i = 0; i < coins.length; ++i) {
        resetCoin(i);
    }

    balls.length = 0;
    glues.length = 0;
    hammers.length = 0;

    timer.setTimer(gameDuration);
}

function gamoverUpdate() {
    dropMoney();
    dropCoins();
    dropGlues();
    dropHammers();
    bounceBalls();

    gameoverT -= 2 * delta;
}

function update() {
    if (!mDown) {
        pig.update(canvas.width, delta, friction);
    }
    // pig.update(canvas.width, delta, friction);
    dropMoney();
    dropCoins();
    dropGlues();
    dropHammers();
    bounceBalls();
    pig.addForce(forceD, delta, 10);
    collisionUpdate();

    if (balls.length < 8) {
        T += 1 * delta;
        if (Math.floor(T) % 10 == 0) {
            T++;
            addBall();
            
            if (balls.length % 3) {
                addHammer();
            }
            
            if (balls.length % 5) {
                addGlue();
                
            }
        }
    }

    // HUD.txt.texts['time'].str = zeroPad(Math.floor(timer.timer / 24), 2);

    HUD.updateTimerSprite(zeroPad(Math.floor(timer.timer / 24), 2), gameDuration);

    if (health < 0) {
        health = 0;
        gameover = true;
        gameoverT = 10;
        pig.t = 0;
    }

    if (delta < 1) {
        // HUD.timeProgressBar.update(delta, Math.floor(timer.timer / 24));
        HUD.lifebar.update(delta, health);
        // HUD.timeProgressBar.progress = Math.floor(timer.timer / 24) / 90 * 100;
        // console.log(HUD.timeProgressBar.progress, timer.timer, delta);
        health -= 2 * delta;
        timer.tick(delta);

        let n = 3 - Math.floor(Math.max(0, health) / 25);
        currPigKey = 'pig_' + n;

        if (timer.timer <= 0) {
            gameover = true;
            gameoverT = 10;
            pig.t = 0;
        }
    }

    if (gameover) {
        // HUD.txt.texts['total'].str = '$' + (score < 10 ? '0' : '') + score.toFixed(2);
        HUD.updateGameoverScore(splashInfo, (score < 10 ? '0' : '') + score.toFixed(2));
    }
}

function startPageAnimations() {

    ctx.drawImage(AM.images.intro.img, 0, 0, AM.images.intro.cw, AM.images.intro.ch, splashInfo.x, splashInfo.y, splashInfo.w, splashInfo.h);
    // ctx.drawImage(AM.images.title.img, 0, 0, AM.images.title.cw, AM.images.title.ch, startPage.title.x, startPage.title.y, startPage.title.w, startPage.title.h);
    
    // // for (let i = 1; i < 5; ++i) {
    // //     let key = 'text' + i;
    // //     ctx.drawImage(AM.images[key].img, 0, 0, AM.images[key].cw, AM.images[key].ch, startPage[key].x, startPage[key].y, startPage[key].w, startPage[key].h);
    // // }
   
    // TXT.draw('text1_1');
    // TXT.draw('text1_2');

    // TXT.draw('text2_1');
    // TXT.draw('text2_2');

    // TXT.draw('text3_1');
    // TXT.draw('text3_2');
    let hy = onTablet ? 860 : 330;
    let y = splashInfo.y + hy * splashInfo.sx;

    let frame = Math.floor(startScreenHandAnimT) % 9;
    let w = AM.images.splash_hammer_marble.cw * 2.5 * scaleX;
    let midX = canvas.width / 2 - w / 2

    w = AM.images.splash_coin.cw * 1.5 * scaleX;
    let h = AM.images.splash_coin.ch * 1.5 * scaleX;
    let x = midX - 420 * scaleX;
    ctx.drawImage(AM.images.splash_coin.img, frame * AM.images.splash_coin.cw, 0, AM.images.splash_coin.cw, AM.images.splash_coin.ch, x, y, w, h);

    frame = Math.floor(startScreenHandAnimT) % 13;
    w = AM.images.splash_hammer_marble.cw * 2.5 * scaleX;
    h = AM.images.splash_hammer_marble.ch * 2.5 * scaleX;
    ctx.drawImage(AM.images.splash_hammer_marble.img, frame * AM.images.splash_hammer_marble.cw, 0, AM.images.splash_hammer_marble.cw, AM.images.splash_hammer_marble.ch, midX, y - 40 * splashInfo.sx, w, h);

    frame = Math.floor(startScreenHandAnimT) % 10;
    w = AM.images.splash_pig.cw * 1.5 * scaleX;
    h = AM.images.splash_pig.ch * 1.5 * scaleX;
    x = midX + 460 * scaleX;
    ctx.drawImage(AM.images.splash_pig.img, frame * AM.images.splash_pig.cw, 0, AM.images.splash_pig.cw, AM.images.splash_pig.ch, x, y, w, h);
    // ctx.drawImage(AM.images.hand.img, 0, 0, AM.images.hand.cw, AM.images.hand.ch, startPage.hand.x + handx, startPage.hand.y, startPage.hand.w, startPage.hand.h);

    // Untransformed draw position
    // const position = {x: startPage.startcoin.x, y: y};
    // // In degrees
    // const rotation = { x: 0, y: startScreenHandAnimT * 10, z: 0};
    // // Rotation relative to here (this is the center of the image)
    // const rotPt = { x: startPage.startcoin.w / 2, y: startPage.startcoin.h / 2 };

    // ctx.save();
    // ctx.setTransform(new DOMMatrix()
    //     .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
    //     .rotateSelf(rotation.x, rotation.y, rotation.z)
    // );
    // ctx.drawImage(AM.images.startcoin.img, 0, 0, AM.images.startcoin.cw, AM.images.startcoin.ch, -rotPt.x, -rotPt.y, startPage.startcoin.w, startPage.startcoin.h);
    // ctx.restore();

    
    
    
    // ctx.drawImage(AM.images.startball.img, 0, 0, AM.images.startball.cw, AM.images.startball.ch, startPage.startball.x, y, startPage.startball.w, startPage.startball.h);
    
    // //
    // ctx.save();

    // // move to the center of the canvas
    // ctx.translate(startPage.starthammer.ox + startPage.starthammer.w / 2, y - 35 * scaleX + startPage.starthammer.h / 2);
    
    // let hammerDegrees = Math.sin(startScreenHandAnimT * 0.20) * 45;
    // // rotate the canvas to the specified degrees
    // ctx.rotate(hammerDegrees * Math.PI/180);

    // // draw the image
    // startPage.starthammer.x = -0.5 * startPage.starthammer.w;
    // startPage.starthammer.y = -0.5 * startPage.starthammer.h;

    // ctx.drawImage(AM.images.starthammer.img, 0, 0, AM.images.starthammer.cw, AM.images.starthammer.ch, startPage.starthammer.x, startPage.starthammer.y, startPage.starthammer.w, startPage.starthammer.h);
    // // we’re done with the rotating so restore the unrotated context
    // ctx.restore();
    
    // //

    // let pigpulse = Math.sin(startScreenHandAnimT) * 5;
    // let pigw = startPage.startpig.w + pigpulse;
    // let pigh = startPage.startpig.h + pigpulse;
    // let pigx = startPage.startpig.x - pigpulse / 2;
    // let pigy = startPage.startpig.y - pigpulse / 2;

    // ctx.drawImage(AM.images.startpig.img, 0, 0, AM.images.startpig.cw, AM.images.startpig.ch, pigx, y, pigw, pigh);
    // ctx.drawImage(AM.images.beginbutton.img, 0, 0, AM.images.beginbutton.cw, AM.images.beginbutton.ch, startPage.beginbutton.x, startPage.beginbutton.y, startPage.beginbutton.w, startPage.beginbutton.h);

    if (delta < 1) {
        // startScreenTimerAnimT += 15 * delta;
        startScreenHandAnimT += 7 * delta;
    }
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    if (!gameover) {
        if (gameStart) {
            // bg
            drawBG(ctx, 'bg');
            HUD.draw(ctx);

            drawCoins();
            drawGlues();
            drawHammers();
            
            drawPig();
            drawKaboom();

            showPoints();
            
            drawMoney();
            drawBall();

            // if (onMobile)
            joystick.draw(ctx);

            update();
        } else {
            // ctx.drawImage(AM.images.intro.img, 0, 0, AM.images.intro.cw, AM.images.intro.ch, 0, 0, canvas.width, canvas.height);
            
            // ctx.beginPath();
            // ctx.rect(btnBegin.x, btnBegin.y, btnBegin.w, btnBegin.h);
            // ctx.stroke();
            // ctx.drawImage(AM.images.startrect.img, 0, 0, AM.images.startrect.cw, AM.images.startrect.ch, 0, 0, canvas.width, canvas.height);

            startPageAnimations();
        }

        
    } else {
        drawBG(ctx, 'bg');
        if (gameoverT > 0) {
            HUD.draw(ctx);

            drawCoins();
            drawGlues();
            drawHammers();
            
            drawPigBreak();
            drawKaboom();

            showPoints();
            
            drawMoney();
            drawBall();
            gamoverUpdate();
            
            
        } else {
            
            // HUD.draw(ctx);
            
            HUD.gameover(ctx, splashInfo, delta);
        }
        
    }

    requestAnimationFrame(gameCycle);
}
// *********************************** GAME UPDATES AND CYCLES END ******************************************************** //