const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');

var instrucions = document.getElementById("game-instructions");
var btnStart = document.getElementById("btnStart");

var last = 0;
var delta = 0;
var startGame = false; // orientation prep
var gameStart = false; // start game
var gameover = false; // end game
var canReset = false;
var mDown = false;

var timer = null;

var timerRadius = 120;
var timerY = 200;
var timerFontSize = 70;
var timerAdjX = [30, 40];

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
        // obj.audio.src = 'http://192.168.1.2:5501/assets/' + fn + '.' + ext;
        obj.audio.src = 'assets/' + fn + '.' + ext;
        obj.audio.preload = 'auto';
        obj.audio.autoplay = (/iPad|iPhone|iPod/).test(navigator.userAgent);

        if (fn == 'bg' || fn == 'bg3') {
            obj.audio.volume = 0.1;
        } else {
            obj.audio.volume = 0.5;
        }

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
    bg: {
        src: 'bg',
        obj: {},
    },
    bg3: {
        src: 'bg3',
        obj: {},
    },
    bgUnder: {
        src: 'bg_under',
        obj: {},
    },
    bgFold: {
        src: 'bg_fold',
        obj: {},
    },
    fold: {
        src: 'fold',
        obj: {},
    },
    fold2: {
        src: 'fold2',
        obj: {},
    },
    intro: {
        src: 'intro',
        obj: {},
    },
    life: {
        src: 'life',
        obj: {},
    },
    gameover: {
        src: 'gameover',
        obj: {},
    },
    spider: {
        src: 'spider/1',
        obj: {},
    },
    moving: {
        src: 'bumps/moving',
        obj: {},
    },
    hiding: {
        src: 'bumps/hiding',
        obj: {},
    },
    angry: {
        src: 'bumps/angry',
        obj: {},
    },
    squash_1: {
        src: 'bumps/squash_1',
        obj: {},
    },
    squash_2: {
        src: 'bumps/squash_2',
        obj: {},
    },
    t1: {
        src: 'texts/Bazinga!',
        obj: {},
    },
    t2: {
        src: 'texts/Better luck next time',
        obj: {},
    },
    t3: {
        src: 'texts/booo!',
        obj: {},
    },
    t4: {
        src: 'texts/close but not close enough',
        obj: {},
    },
    t5: {
        src: 'texts/Fascinating!',
        obj: {},
    },
    t6: {
        src: 'texts/gotcha',
        obj: {},
    },
    t7: {
        src: 'texts/he! he! he!',
        obj: {},
    },
    t8: {
        src: 'texts/Hello Neighbor!',
        obj: {},
    },
    t9: {
        src: 'texts/I got long legs',
        obj: {},
    },
    t10: {
        src: 'texts/I see you!',
        obj: {},
    },
    t11: {
        src: 'texts/Magic!',
        obj: {},
    },
    t12: {
        src: 'texts/right here!',
        obj: {},
    },
    t13: {
        src: 'texts/Not-so-surelock',
        obj: {},
    },
    t14: {
        src: 'texts/Peek-a-boo!',
        obj: {},
    },
    t15: {
        src: 'texts/Phew!',
        obj: {},
    },
    t16: {
        src: 'texts/So close!',
        obj: {},
    },
    t17: {
        src: 'texts/That was close!',
        obj: {},
    },
    volume: {
        src: 'volume',
        obj: {},
    },
    mute: {
        src: 'mute',
        obj: {},
    },
};

var music = {
    bg: {
        src: 'sounds/bg4',
        obj: {},
        ext: 'mp3',
    }, 
    crawl: {
        src: 'sounds/crawl',
        obj: {},
        ext: 'wav',
    }, 
    squish: {
        src: 'sounds/squish2',
        obj: {},
        ext: 'mp3',
    }, 
    hidelaugh: {
        src: 'sounds/laugh2',
        obj: {},
        ext: 'wav',
    }, 
    laugh: {
        src: 'sounds/evil_laugh',
        obj: {},
        ext: 'wav',
    }, 
    // shuffle: {
    //     src: 'sounds/shuffle',
    //     obj: {},
    //     ext: 'wav',
    // }, 

}

var volumeInfo = {
    x: 55,
    y: 45,
    w: 25,
    h: 25,
    cw: 50,
    ch: 50,
}

var volumeOn = true;

var foldInfo = {
    x: 0,
    y: 0,
    w: 232,
    h: 215,
    cw: 232,
    ch: 215,
}

var foldInfo2 = {
    x: 0,
    y: 0,
    w: 292,
    h: 275,
    cw: 292,
    ch: 275,
}


var spiderInfo = {
    w: 100,
    h: 100,
    cw: 633,
    ch: 633,
}

var gameoverInfo = {
    x: 0,
    y: 0,
    w: 221,
    h: 45,
    cw: 221,
    ch: 45,
}

var bounds =  {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    padx: 10,
    pady: 10
}

var btnBegin = {
    x: 0,
    y: 0,
    w: 400,
    h: 100
};

var spiders = [];
const sheetPadding = {
    left: 15,
    right: 28,
    top: 13,
    bottom: 26
}

var crawlT = 0;
var isCrawl = false;
var phrases = [];
var phrasesWidth = [211, 549, 130, 679, 308, 193, 232, 389, 356, 215, 216, 136, 411, 274, 342, 215, 388];
var phrasesClipWidth = [211, 549, 130, 679, 308, 193, 232, 389, 356, 215, 216, 136, 411, 274, 342, 215, 388];
var phraseInfo = {
    w: 500,
    h: 31,
    cw: 500,
    ch: 31,
}

var showPhrases = [];
var squash = [];

var crawlXPos = [0];
var levelSpeed = 5;
var shuffleDuration = 0.1;
var isTalking = false;
var talkTime = 0;
var isClickable = false;
var nextRoundTime = 6;

var score = 0;
var mistakes = 0;
var round = 0;

var TM = new TextManager(ctx);
var textList = {
    gameover: {
        obj: null,
        desc: TM.addTextObj('Game Over!', 'Montserrat', 'bold', 50, 0, 0, 100, 70, '#fb2121'),
    },
    scoreN: {
        obj: null,
        desc: TM.addTextObj('Score: 00', 'Montserrat', 'bold', 25, 0, 0, 55, 25, '#fff'),
    },
    scoreLabel: {
        obj: null,
        desc: TM.addTextObj('You Scored:', 'Montserrat', 'normal', 50, 0, 0, 70, 55, '#fff'),
    },
    finalScore: {
        obj: null,
        desc: TM.addTextObj('00', 'Montserrat', 'bold', 65, 0, 0, 30, 70, '#f9a139'),
    },
    resetMsg: {
        obj: null,
        desc: TM.addTextObj('Tap to play again.', 'Montserrat', 'bold', 20, 0, 0, 250, 50, '#fff'),
    }
};

const topHUDInfo = {
    w: 250,
    h: 100,
    score: {
        x: 0,
        y: 50,
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
        y: 45,
        w: 45,
        h: 45,
        cw: 45,
        ch: 45,
        lives: 0,
        totalW: 0,
        sx: 0,
        pad: 0
    }
}

var lives = topHUDInfo.life.lives;
var moveDestinations = [];
var minDist = 0;

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    canvas.style.display = 'block';
    instrucions.style.display = 'none';

    scaleX = w / 1792;
    scaleY = h / 922;

    btnBegin.w *= scaleX;
    btnBegin.h *= scaleY;

    btnBegin.x = w / 2 - btnBegin.w / 2;
    btnBegin.y = h - 235 * scaleY;

    sheetPadding.left *= scaleX;
    sheetPadding.right *= scaleX;
    sheetPadding.top *= scaleY;
    sheetPadding.bottom *= scaleY;

    var percentage = 0.6;
    for(let i = 0; i < phrasesWidth.length; ++i) {
        phrasesWidth[i] *= scaleX;
        phrasesWidth[i] *= 0.7;
    }

    rescaleSize(spiderInfo);
    rescaleSize(phraseInfo);
    rescaleSize(gameoverInfo);

    phraseInfo.h *= percentage;

    bounds.padx = spiderInfo.w;
    bounds.pady = spiderInfo.h;
    bounds.left = sheetPadding.left + spiderInfo.w / 2 + bounds.padx;
    bounds.top = sheetPadding.top + spiderInfo.h / 2 + bounds.pady;
    bounds.right = canvas.width - sheetPadding.right - spiderInfo.w - bounds.padx;
    bounds.bottom = canvas.height - sheetPadding.bottom - spiderInfo.h - bounds.pady;

    crawlXPos.push(-spiderInfo.w);
    crawlXPos.push(spiderInfo.w);

    let isMobile = detectMob();

    let scoreAdjY = 0;

    if (isMobile) {
        timerRadius = 70;
        timerY = 120;
        timerFontSize = 40;
        timerAdjX = [8, 22];

        volumeInfo.x = 45;
        volumeInfo.y = 45;
        volumeInfo.w = 35;
        volumeInfo.h = 35;

        textList.scoreLabel.desc.weight = 'normal';
        textList.scoreN.desc.weight = 'normal';
        scoreAdjY = 2;
    }

    timer = new Timer(w / 2, h / 2, timerRadius, '#fb2121');
    timer.fontSize = timerFontSize;
    timer.adjX = timerAdjX;

    setPhrases();
    loadAssets();

    initTopHUD();

    rescaleAll(volumeInfo);

    foldInfo.w = 450;
    foldInfo.h = 450;

    rescaleAll(foldInfo);


    foldInfo2.w = 600;
    foldInfo2.h = 600;

    rescaleAll(foldInfo2);

    foldInfo.x = w - foldInfo.w;
    foldInfo.y = h - foldInfo.h;

    

    foldInfo2.x = w - foldInfo2.w;
    foldInfo2.y = h - foldInfo2.h;

    for (let k in textList) {
        if (textList[k].desc != null) {
            textList[k].obj = TM.generateTextObj(textList[k].desc, scaleX, scaleY);
        }
    }

    textList.scoreN.obj.tx = w / 2 - (textList.scoreN.desc.w + 30) / 2 * scaleX;
    textList.scoreN.obj.ty = topHUDInfo.score.y + (topHUDInfo.score.h / 2 - textList.scoreN.desc.h * scaleY / 2) - scoreAdjY;

    // textList.complete.obj.tx = w / 2 - textList.complete.desc.w / 2 * scaleX - 10 * scaleX;
    // textList.complete.obj.ty = 75 * scaleY;
    textList.scoreLabel.obj.tx = w / 2 - textList.scoreLabel.desc.w / 2 * scaleX - 100 * scaleX;
    textList.scoreLabel.obj.ty = (240 - scoreAdjY) * scaleY;
    textList.finalScore.obj.tx = w / 2 - textList.finalScore.desc.w / 2 * scaleX - 50 * scaleX;
    textList.finalScore.obj.ty = 300 * scaleY;
    textList.resetMsg.obj.tx = w / 2 - textList.resetMsg.desc.w / 2 * scaleX - 20 * scaleX;
    textList.resetMsg.obj.ty = h / 2 - textList.resetMsg.desc.h / 2 * scaleY;

    // gameoverInfo.x = w / 2 - gameoverInfo.w / 2;
    textList.gameover.obj.tx = w / 2 - (textList.gameover.desc.w + 100) * scaleX;
    textList.gameover.obj.ty = 120 * scaleY;
    
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
                // resetGame();
                
            } else if (gameStart) {
                // spiders[0].move(1, 1, 1);
                isClickable = true;
                for (let i = 0; i < spiders.length; ++i) {
                    if (spiders[i].t2 < shuffleDuration) {
                        // spiders[i].draw(ctx, images.hiding.obj.img, 3);
                        isClickable = false;
                    }
                    
                }
                if (isBtnClicked(mx, my, {
                    x: volumeInfo.x,
                    y: volumeInfo.y,
                    w: volumeInfo.w,
                    h: volumeInfo.h
                })) {
                    volumeOn = !volumeOn; 
                    if (volumeOn) {
                        music.bg.obj.audio.currentTime = 0;
                        music.bg.obj.audio.play();

                        music.crawl.obj.audio.currentTime = 0;
                        music.crawl.obj.volume = 1;
                    } else {
                        music.bg.obj.audio.pause();
                        music.bg.obj.volume = 0;

                        music.crawl.obj.audio.pause();
                        music.crawl.obj.volume = 0;
                    }
                } else if (isClickable && nextRoundTime == 0 && !isCrawl && !isTalking) {
                    isClickable = false;
                    
                    if (checkCollission(mx, my) || minDist < 50) {
                        ++score;
                        music.squish.obj.audio.play();
                        // music.squish.obj.audio.play();

                        if (nextRound()) {
                            nextRoundTime = 5;
                            timer.setTimer(5);
                            if (++round == 7) {
                                gameover = true;
                            }
                        } else {
                            moveSpiders();
                        }
                    } else {
                        // console.log(minDist);
                        if (minDist > 250) {
                            reduceHP();
                        } else {
                            score--;
                            if (score < 0) score = 0;
                        }

                        music.laugh.obj.audio.play();

                        if (!gameover) {
                            randomizePhrases();
                            console.log(showPhrases.length);
                            isTalking = true;
                            talkTime = 3;
                            mistakes++;
                        }
                        
                    }
                    
                    // accuracy.push(checkAccuracy(mx, my));
                    // console.log(accuracy);
                }
            } else {
                if (isBtnClicked(mx, my, btnBegin)) {
                    gameStart = true;
                    music.bg.obj.audio.volume = 0.1;
                    music.bg.obj.audio.loop = true;
                    music.bg.obj.audio.play();
                }
                // gameStart = true;
                // isCrawl = true;
                // ctx.beginPath();
                // ctx.fillStyle = "#3c6c8e";
                // ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            mDown = true;
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
                    resetGame();
                } else {
                    canReset = true;
                }
                
            }
        }
    });

    // addSpider();
    // addSpider();
    // addSpider();

    // console.log(images['t17']);
    timer.setTimer(5);

    // moveDestinations = calcDestinations();
    
    gameCycle();
}

function initTopHUD() {
    let isMobile = detectMob();

    if (isMobile) {
        topHUDInfo.score.w = 130;
        topHUDInfo.score.h = 65;
        topHUDInfo.score.pw = 195;
        // topHUDInfo.score.y = 3;

        topHUDInfo.score.fontX = 15;
        topHUDInfo.score.fontsize = 20;
        topHUDInfo.score.fontsize2 = 20;
        topHUDInfo.life.y += 5;
    }

    rescaleSize(topHUDInfo);

    
    topHUDInfo.score.w *= scaleX;
    topHUDInfo.score.h *= scaleY;
    topHUDInfo.score.pw *= scaleX;
    

    let sx = canvas.width / 2 - topHUDInfo.w / 2;
    // topHUDInfo.score.x = sx + (topHUDInfo.w  - topHUDInfo.score.w) / 2;
    topHUDInfo.score.x = sx + (topHUDInfo.w - topHUDInfo.score.pw) / 2;
    topHUDInfo.score.y *= scaleY;

    topHUDInfo.score.fontX += topHUDInfo.score.x + (topHUDInfo.w - topHUDInfo.score.pw) / 2 + 10 * scaleX;
    topHUDInfo.score.fontY += topHUDInfo.score.y + topHUDInfo.score.h / 2;
    topHUDInfo.score.fontXadj *= scaleX;

    topHUDInfo.life.w *= scaleX;
    topHUDInfo.life.h *= scaleY;
    topHUDInfo.life.pad = 20 * scaleX;
    let lifeW = topHUDInfo.life.pad * 2 + topHUDInfo.life.w * topHUDInfo.life.lives;
    sx = (canvas.width - topHUDInfo.w);
    topHUDInfo.life.x = sx + (topHUDInfo.w - lifeW) / 2;
    topHUDInfo.life.y *= scaleY;
}

function drawScoreHUD() {
    // const h = 50;
    
    // const progW = 100;
    // let x = canvas.width / 2;
    // let y = topHUD.timer.timecircle.h / 2 - h / 2 + 30;

    const { x, y, w, h, pw } = topHUDInfo.score;
    const p = pw;
    
    ctx.beginPath();
    ctx.arc(h / 2 + x, h / 2+ y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
    ctx.lineTo(p - 2 * h + x, 0 + y);
    ctx.arc(p - (h / 2) + x, h / 2 + y, h / 2, 3 / 2 * Math.PI,Math.PI / 2);
    ctx.lineTo(h / 2 + x, h + y);
    ctx.fillStyle = "#9F51FE";
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = '2';
    ctx.stroke();

    textList.scoreN.obj.str = 'Score: ' + zeroPad(score, 2);
    TM.draw(textList.scoreN.obj);
}

function drawLives() {
    const { x, y, cw, ch, w, h, pad } = topHUDInfo.life;
    
    for (let i = 0; i < lives; ++i) {
        ctx.drawImage(images.life.obj.img, 0, 0, cw, ch, x + i * w + i * pad, y, w, h);
    }
}

function reduceHP() {
    if (--lives < 0) {
        gameover = true;
    }
}

function resetGame() {
    score = 0;
    
    gameover = false;
    canReset = false;
    lives = topHUDInfo.life.lives;
    nextRoundTime = 6;
    timer.setTimer(5);

    showPhrases = [];

    spiders = [];
}

function zeroPad(num, places) {
    return String(num).padStart(places, '0');
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

function isBtnClicked(mx, my, btn) {
    return (mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h);
}

// #80b1d3
// #3c6c8e

function drawSpiders() {
    for (let i = 0; i < spiders.length; ++i) {
        // spiders[i].draw(ctx, images.spider.obj.img);
        if (isCrawl) {
            spiders[i].draw(ctx, images.spider.obj.img);
        } else {
            if (spiders[i].moveDestinations.length > 0) {
                spiders[i].draw(ctx, images.moving.obj.img, 3);
            } else if (spiders[i].t2 < shuffleDuration) {
                spiders[i].draw(ctx, images.hiding.obj.img, 3);
                if (!music.crawl.obj.audio.paused) {
                    music.crawl.obj.audio.pause();
                    if (volumeOn) {
                        music.hidelaugh.obj.audio.currentTime = 0;
                        music.hidelaugh.obj.audio.play();
                    }
                }
                    
            } else {
                if (squash[i] == 1) {
                    spiders[i].draw(ctx, images.squash_2.obj.img, 2);
                    let x = spiders[i].x + spiders[i].w / 2;
                    let y = spiders[i].y - phraseInfo.h;
                    let w = phrasesWidth[5];
                    let cw = phrasesClipWidth[5];
                    ctx.drawImage(images['t6'].obj.img, 0, 0, cw, phraseInfo.ch, x - w / 2.5, y, w, phraseInfo.h);
                } else if (isTalking) {
                    spiders[i].draw(ctx, images.angry.obj.img, true);
                } else {
                    // isClickable = true;
                }
                // spiders[i].draw(ctx, images.spider.obj.img);
            }
        }
    }
}

function moveSpiders() {
    for (let i = 0; i < spiders.length; ++i) {
        if (squash[i] != 1) {
            spiders[i].move(1, 1, Math.floor(Math.random() * 2) + 1);
            spiders[i].moveDestinations = calcDestinations();
        }
    }

    if (volumeOn) {
        music.crawl.obj.audio.loop = true;
        music.crawl.obj.audio.currentTime = 0;
        music.crawl.obj.audio.play();
    }
        
}

function checkAccuracy(mx, my) {
    let min = Infinity;
    for (let i = 0; i < spiders.length; ++i) {
        let dx = spiders[i].x - mx;
        let dy = spiders[i].y - my;
        let dist = Math.sqrt(dx * dx + dy * dy);
        min = Math.min(min, dist);
    }
    return min;
}

function nextRound() {
    for (let i = 0; i < spiders.length; ++i) {
        if (squash[i] != 1) {
            return false;
        }
    }

    return true;
}

function reset() {
    if (score % 2 == 0) {
        if (spiders.length < 1) {
            addSpider();
            levelSpeed += 2.5;
            // shuffleDuration += 10;
            // calcDestinations();
        }
    }

    console.log('reset');

    for (let i = 0; i < spiders.length; ++i) {
        spiders[i].x = bounds.left;
        spiders[i].y = bounds.top;
        spiders[i].moveDestinations = calcDestinations();
        squash[i] = 0;
    }

    isCrawl = true;

    if (volumeOn) {
        music.crawl.obj.audio.loop = true;
        music.crawl.obj.audio.currentTime = 0;
        music.crawl.obj.audio.play();
    }
        
}

function checkCollission(mx, my) {
    minDist = Infinity;

    for (let i = 0; i < spiders.length; ++i) {
        if (squash[i] == 0) {
            if (mx >= spiders[i].x && mx <= spiders[i].x + spiders[i].w && my >= spiders[i].y && my <= spiders[i].y + spiders[i].h) {
                squash[i] = 1;
                return true;
            } 
    
            let dx = spiders[i].x - mx;
            let dy = spiders[i].y - my;
            let dist = Math.sqrt(dx * dx + dy * dy);
    
            minDist = Math.min(minDist, dist);
        }
        
    }
    return false;
}

function randomizePhrases() {
    for (let i = 0; i < showPhrases.length; ++i) {
        let rng = Math.floor(Math.random() * 17) + 1;
        showPhrases[i].rng = rng;
    }
}

function talk() {
    if (isTalking) {
        for (let i = 0; i < showPhrases.length; ++i) {
            if (squash[i] != 1) {
                let rng = showPhrases[i].rng - 1;
                let imgID = phrases[rng];
                let idx = showPhrases[i].spiderIdx;
                // let idx = 0;
                let x = spiders[idx].x + spiders[idx].w / 2;
                let y = spiders[idx].y - phraseInfo.h;

                let w = phrasesWidth[rng];
                let cw = phrasesClipWidth[rng];
                // let k = phrases[idx];

                // console.log(x, y);
                // console.log(phrases[showPhrases[i].rng])
                // ctx.drawImage(images[rng].obj.img, 0, 0, phraseInfo.cw, phraseInfo.ch, x, y, phraseInfo.cw, phraseInfo.ch);
                ctx.drawImage(images[imgID].obj.img, 0, 0, cw, phraseInfo.ch, x - w / 2, y, w, phraseInfo.h);
            }
        }
    }
}

function addPhrase(spiderIdx) {
    let rng = Math.floor(Math.random() * 17) + 1;
    // let rng = 3;
    // let spiderIdx = Math.floor(Math.random() * spiders.length) + 1;
    showPhrases.push({
        rng,
        spiderIdx
    });

    // console.log(showPhrases);
}

function setPhrases() {
    for (let i = 1; i <= 17; ++i) {
        phrases.push('t' + i);
    }
}

function addSpider() {
    const { w, h, cw, ch } = spiderInfo;
    let spider = new Sprite(bounds.left, bounds.top, w, h, cw, ch);
    // spider.moveDestinations = calcDestinations();
    spiders.push(spider);
    addPhrase(spiders.length - 1);
}

function isPortrait() {
    return window.innerHeight > window.innerWidth;
}

function shuffleArr (array){
    for (var i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]]
    }
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

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function crawl(x, y) {
    for (let i = 0; i < spiders.length; ++i) {
        spiders[i].x = lerp(spiders[i].x, x + crawlXPos[i], crawlT);
        spiders[i].y = lerp(spiders[i].y, y + (Math.min(i, 1) * spiders[i].h), crawlT);
    }
}

function update() {
    // placeholder
    // timer.draw(ctx);
    // timer.tick(delta);
    // spiders[0].update(10, delta, bounds);
    if (nextRoundTime > 0) {
        nextRoundTime -= 1 * delta;
        timer.draw(ctx);
        timer.tick(delta);
        if (nextRoundTime < 0) {
            nextRoundTime = 0;
            reset();
        }
    } else {
        if (talkTime > 0) {
            talkTime -= 1 * delta;
            if (talkTime < 0) {
                talkTime = 0;
                isTalking = false;
                moveSpiders();
            }
        } 
    
        if (isCrawl) {
            crawl(bounds.right, bounds.bottom, crawlT);
            crawlT += 0.01 * delta;
            
            if (crawlT >= 0.05) {
                isCrawl = false;
                crawlT = 0;
                
                for (let i = 0; i < spiders.length; ++i) {
                    spiders[i].ox = spiders[i].tmpX = spiders[i].x;
                    spiders[i].oy = spiders[i].tmpY = spiders[i].y;
                    spiders[i].move(1, 1, Math.floor(Math.random() * 2) + 1);
                }
                
            }
        } else {
            for (let i = 0; i < spiders.length; ++i) {
                // spiders[i].update(levelSpeed, shuffleDuration, delta, bounds);
                spiders[i].update(1, shuffleDuration, delta);
            }
        }
    }
    
}

function drawGrid() {
    let r = Math.floor(canvas.height / spiderInfo.h);
    let c = Math.floor(canvas.width / spiderInfo.w);

    let rowRem = (canvas.height - r * spiderInfo.h) / r;
    let colRem = (canvas.width - c * spiderInfo.w) / c;

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    for (let i = 0; i < r; ++i) {
        for (let j = 0; j < c; ++j) {
            ctx.beginPath();
            ctx.rect(j * spiderInfo.w + j * colRem, i * spiderInfo.h + i * rowRem, spiderInfo.w, spiderInfo.h);
            ctx.stroke();
        }
    }
    
    ctx.restore();
}

function calcDestinations() {
    let rows = Math.floor(canvas.height / spiderInfo.h);
    let cols = Math.floor(canvas.width / spiderInfo.w);

    let rowRem = (canvas.height - rows * spiderInfo.h) / rows;
    let colRem = (canvas.width - cols * spiderInfo.w) / cols;

    let destinations = [];
    let rng = Math.floor(Math.random() * 7) + 3;
    for (let i = 0, c = 0; i < rng; ++i) {
        let r = Math.floor(Math.random() * rows);
        destinations.push([r * spiderInfo.h + r * rowRem, c * spiderInfo.w + c * colRem]); // r, c
        if (c == 0) {
            c = cols - 1;
        } else {
            c = 0;
        }
    }

    rng = Math.floor(Math.random() * 7) + 3;
    for (let i = 0; i < rng; ++i) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        destinations.push([r * spiderInfo.h + r * rowRem, c * spiderInfo.w + c * colRem]); // r, c
    }

    let r = Math.floor(Math.random() * (rows - 4)) + 4;
    let c = Math.floor(Math.random() * (cols - 8)) + 4;

    destinations.push([r * spiderInfo.h + r * rowRem, c * spiderInfo.w + c * colRem]); // r, c

    console.log(destinations[destinations.length - 1]);

    return destinations;
}
//#9F51FE
function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;
    
    if (!gameover) {
        if (assets.loaded == assets.count && sounds.loaded == sounds.count) {
            
            if (gameStart) {
                

                if (isCrawl || nextRoundTime) {
                    // bg 
                    // ctx.drawImage(images.bg.obj.img, 0, 0, 1265, 712, 0, 0, canvas.width, canvas.height);
                    ctx.drawImage(images.bgUnder.obj.img, 0, 0, 926, 429, 0, 0, canvas.width, canvas.height);
                    ctx.drawImage(images.bgFold.obj.img, 0, 0, 926, 429, 0, 0, canvas.width, canvas.height);
                    
                    ctx.drawImage(images.fold2.obj.img, 0, 0, foldInfo2.cw, foldInfo2.ch, foldInfo2.x, foldInfo2.y, foldInfo2.w, foldInfo2.h);
                    ctx.drawImage(images.fold.obj.img, 0, 0, foldInfo.cw, foldInfo.ch, foldInfo.x, foldInfo.y, foldInfo.w, foldInfo.h);
                } else {
                    ctx.drawImage(images.bg3.obj.img, 0, 0, 926, 428, 0, 0, canvas.width, canvas.height);
                    // ctx.beginPath();
                    // ctx.fillStyle = "#3c6c8e";
                    // ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // ctx.beginPath();
                    // ctx.fillStyle = "#80b1d3";
                    // ctx.fillRect(15, 13, canvas.width - 28, canvas.height - 26);
                    // ctx.drawImage(images.spider.obj.img, 0, 0, 633, 633, 0, 0, 100, 100);
                }

                // drawGrid();

                let volumeKey = 'mute';
                if (volumeOn) {
                    volumeKey = 'volume';
                }

                ctx.drawImage(images[volumeKey].obj.img, 0, 0, volumeInfo.cw, 
                    volumeInfo.ch, volumeInfo.x, volumeInfo.y, volumeInfo.w, volumeInfo.h);

                drawScoreHUD();
                // drawLives();

                drawSpiders();
                talk();
                update();

            } else {
                ctx.drawImage(images.intro.obj.img, 0, 0, 926, 429, 0, 0, canvas.width, canvas.height);
                // ctx.beginPath();
                // ctx.rect(btnBegin.x, btnBegin.y, btnBegin.w, btnBegin.h);
                // ctx.stroke();
                
            }
            
        }
    } else {
        TM.draw(textList.gameover.obj);
        TM.draw(textList.scoreLabel.obj);
        textList.finalScore.obj.str = zeroPad(score, 2);
        TM.draw(textList.finalScore.obj);
        TM.draw(textList.resetMsg.obj);
        // ctx.drawImage(images.gameover.obj.img, 0, 0, gameoverInfo.cw, gameoverInfo.ch, gameoverInfo.x, gameoverInfo.y, gameoverInfo.w, gameoverInfo.h);
    }

    requestAnimationFrame(gameCycle);
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);