const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');

var instrucions = document.getElementById("game-instructions");
var btnStart = document.getElementById("btnStart");

var last = 0;
var delta = 0;
var startGame = false; // orientation prep
var gameStart = true; // start game
var gameover = false; // end game
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

var images = {
    bg: {
        src: 'bg',
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
        src: 'texts/Gotcha!',
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
};

var spiderInfo = {
    w: 100,
    h: 100,
    cw: 633,
    ch: 633,
}

var bounds =  {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    padx: 10,
    pady: 10
}

const spiders = [];
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
var shuffleDuration = 30;
var isTalking = false;
var talkTime = 0;
var isClickable = false;
var nextRoundTime = 6;

var score = 0;
var mistakes = 0;
var round = 0;

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    canvas.style.display = 'block';
    instrucions.style.display = 'none';

    scaleX = w / 1792;
    scaleY = h / 922;

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

    if (isMobile) {
        timerRadius = 70;
        timerY = 120;
        timerFontSize = 40;
        timerAdjX = [8, 22];
    }

    timer = new Timer(w / 2, timerY, timerRadius, '#fb2121');
    timer.fontSize = timerFontSize;
    timer.adjX = timerAdjX;

    setPhrases();
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

            if (gameStart) {
                // spiders[0].move(1, 1, 1);
                if (isClickable) {
                    isClickable = false;
                    
                    if (checkCollission(mx, my)) {
                        ++score;
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
                        randomizePhrases();
                        isTalking = true;
                        talkTime = 3;
                        mistakes++;
                    }

                    // accuracy.push(checkAccuracy(mx, my));
                    // console.log(accuracy);
                }
            } else {
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
        }
    });

    // addSpider();
    // addSpider();
    // addSpider();

    // console.log(images['t17']);
    timer.setTimer(5);
    
    gameCycle();
}

// #80b1d3
// #3c6c8e

function drawSpiders() {
    for (let i = 0; i < spiders.length; ++i) {
        // spiders[i].draw(ctx, images.spider.obj.img);
        if (isCrawl) {
            spiders[i].draw(ctx, images.spider.obj.img);
        } else {
            if (spiders[i].t < shuffleDuration) {
                spiders[i].draw(ctx, images.moving.obj.img);
            } else if (spiders[i].t < shuffleDuration + 5) {
                spiders[i].draw(ctx, images.hiding.obj.img);
            } else {
                if (squash[i] == 1) {
                    spiders[i].draw(ctx, images.squash_1.obj.img);
                } else if (isTalking) {
                    spiders[i].draw(ctx, images.angry.obj.img, true);
                } else {
                    isClickable = true;
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
        }
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
        if (spiders.length < 3) {
            addSpider();
            levelSpeed += 2.5;
            shuffleDuration += 10;
        }
    }

    for (let i = 0; i < spiders.length; ++i) {
        spiders[i].x = bounds.left;
        spiders[i].y = bounds.top;
        squash[i] = 0;
    }

    isCrawl = true;
}

function checkCollission(mx, my) {
    for (let i = 0; i < spiders.length; ++i) {
        if (mx >= spiders[i].x && mx <= spiders[i].x + spiders[i].w && my >= spiders[i].y && my <= spiders[i].y + spiders[i].h) {
            squash[i] = 1;
            return true;
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
                spiders[i].update(levelSpeed, shuffleDuration, delta, bounds);
            }
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
                if (isCrawl) {
                    // bg 
                    ctx.drawImage(images.bg.obj.img, 0, 0, 1265, 712, 0, 0, canvas.width, canvas.height);
                } else {

                    ctx.beginPath();
                    ctx.fillStyle = "#3c6c8e";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    ctx.beginPath();
                    ctx.fillStyle = "#80b1d3";
                    ctx.fillRect(15, 13, canvas.width - 28, canvas.height - 26);
                    // ctx.drawImage(images.spider.obj.img, 0, 0, 633, 633, 0, 0, 100, 100);
                }

                drawSpiders();
                talk();
                update();

            } else {
            
                ctx.drawImage(images.bg.obj.img, 0, 0, 1265, 712, 0, 0, canvas.width, canvas.height);
                // ctx.beginPath();
                // ctx.rect(btnBegin.x, btnBegin.y, btnBegin.w, btnBegin.h);
                // ctx.stroke();

            }
            
        }

        requestAnimationFrame(gameCycle);
    } else {
        let p = Math.max(0, ((score - mistakes) / score) * 100);
        alert('You scored: ' + score + ', Accuracy: ' + p.toFixed(2) + '%');
    }
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);