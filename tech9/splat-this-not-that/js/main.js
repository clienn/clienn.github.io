const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');

var instrucions = document.getElementById("game-instructions");
var btnStart = document.getElementById("btnStart");

var last = 0;
var delta = 0;
var startGame = false;
var gameover = false;
var timer = null;

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

var music = {
    bg: {
        src: 'sounds/bg',
        obj: {},
        ext: 'mp3',
    }, 
    explosion: {
        src: 'sounds/explosion',
        obj: {},
        ext: 'wav',
    },
    // shuffle: {
    //     src: 'sounds/shuffle',
    //     obj: {},
    //     ext: 'wav',
    // }, 

}

var images = {
    // bg: {
    //     src: 'bg',
    //     obj: {},
    // },
    sky: {
        src: 'sky',
        obj: {},
    },
    splash: {
        src: 'splash-screen',
        obj: {},
    },
    landLeft: {
        src: 'land',
        obj: {},
        x: 0,
        y: 0,
        w: 314,
        h: 412
    },
    landRight: {
        src: 'land2',
        obj: {},
        x: 0,
        y: 0,
        w: 314,
        h: 412
    },
    blackCanonLeft: {
        src: 'black-canon',
        obj: {}
    },
    blackCanonRight: {
        src: 'black-canon-2',
        obj: {}
    },
    mine: {
        src: 'mine',
        obj: {},
    },
    projectile: {
        src: 'projectiles-sprite',
        obj: {},
    },
    compass: {
        src: 'tophud/compass',
        obj: {},
    },
    life: {
        src: 'tophud/life',
        obj: {},
    },
    timecircle: {
        src: 'tophud/timecircle',
        obj: {},
    },
    stopwatch: {
        src: 'tophud/stopwatch',
        obj: {},
    },
    complete: {
        src: 'completed/complete',
        obj: {},
    },
    trophy: {
        src: 'completed/trophy',
        obj: {},
    },
    shine: {
        src: 'completed/shine',
        obj: {},
    },
    cloud1: {
        src: 'cloud1',
        obj: {},
    },
    cloud2: {
        src: 'cloud2',
        obj: {},
    },
    cloud3: {
        src: 'cloud3',
        obj: {},
    },
}

var canons = {
    black: {
        left: {
            upper: new Spirte(0, 310, 285, 225, 636, 504),
            lower: new Spirte(0, 540, 285, 225, 636, 504),
        },
        right: {
            upper: new Spirte(0, 320, 285, 225, 570, 451),
            lower: new Spirte(0, 540, 285, 225, 570, 451),
        },
    },
    init: () => {
        canons.black.right.upper.x = canvas.width - canons.black.right.upper.w;
        canons.black.right.lower.x = canvas.width - canons.black.right.lower.w;
    },
    draw: () => {
        canons.black.left.upper.draw(ctx, images.blackCanonLeft.obj.img);
        canons.black.left.lower.draw(ctx, images.blackCanonLeft.obj.img);
        canons.black.right.upper.draw(ctx, images.blackCanonRight.obj.img);
        canons.black.right.lower.draw(ctx, images.blackCanonRight.obj.img);
    }
}

var landPosX = 0;
var landPosY = 0;
var scaleX = 1;
var scaleY = 1;

const g = 9.81;
const friction = 2.14;

var projectiles = [];

// 539 × 227
const clips = [
    {
        w: 64,
        h: 96,
        clipW: 80,
        clipH: 113,
        clipX: 0,
        clipY: 0,
    },
    {
        w: 64,
        h: 96,
        clipW: 80,
        clipH: 113,
        clipX: 80,
        clipY: 0,
    },
    {
        w: 80,
        h: 80,
        clipW: 90,
        clipH: 90,
        clipX: 160,
        clipY: 0,
    },
    {
        w: 64,
        h: 96,
        clipW: 80,
        clipH: 113,
        clipX: 260,
        clipY: 0,
    },
    {
        w: 96,
        h: 96,
        clipW: 100,
        clipH: 90,
        clipX: 340,
        clipY: 0,
    },
    {
        w: 80,
        h: 80,
        clipW: 90,
        clipH: 90,
        clipX: 460,
        clipY: 0,
    },
    {
        w: 80,
        h: 80,
        clipW: 80,
        clipH: 100,
        clipX: 0,
        clipY: 120,
    },
    {
        w: 100,
        h: 100,
        clipW: 120,
        clipH: 100,
        clipX: 80,
        clipY: 120,
    },
    {
        w: 96,
        h: 96,
        clipW: 96,
        clipH: 96,
        clipX: 200,
        clipY: 120,
    },
    {
        w: 96,
        h: 96,
        clipW: 96,
        clipH: 96,
        clipX: 320,
        clipY: 120,
    },

    {
        w: 96,
        h: 96,
        clipW: 96,
        clipH: 96,
        clipX: 400,
        clipY: 120,
    },
    
];

const projectileRanges = {
    x: [200, 500],
    y: [220, 300]
}

var radius = 28;
var dradius = radius * 2;
        
const cannonCollisionBubble = [];

var score = 0;
const SPLAT_POINTS = 1;
const OUCH_MINUS = -1;
const PROJECTILE_COLLISION_MINUS = -20;
const CANON_COLLISION_MINUS = -30;
const LEVEL_UP_THRESHOLD = 200;

var textPos = {
    x: 0,
    y: 0,
    fontSize: 40,
    score: 0
}

var btnBegin = {
    x: 0,
    y: 0,
    w: 400,
    h: 100
}

const topHUD = {
    timer: {
        timecircle: {
            w: 45,
            h: 45,
            cw: 45,
            ch: 45,
        },
        stopwatch: {
            w: 45,
            h: 45,
            cw: 43,
            ch: 45,
        },
    },
    score: {
        turtleshine: {
            w: 45,
            h: 45,
            cw: 42,
            ch: 43,
        }
    },
}

const topHUDInfo = {
    w: 250,
    h: 100,
    timer: {
        x: 0,
        y: 0,
        w: 0,
        h: 20,
        progress: {
            x: 0,
            y: 0,
            w: 0,
            h: 20,
            max: 142,
        },
        text: {
            x: 0,
            y: 1,
            w: 0,
            h: 0,
            rectSize: 20,
            fontsize: 19,
        }
    },
    score: {
        x: 0,
        y: 0,
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
        y: 0,
        w: 45,
        h: 45,
        cw: 45,
        ch: 45,
        lives: 3,
        totalW: 0,
        sx: 0,
        pad: 0
    }
}

var bgInfo = {
    cloud1: {
        x: 0,
        y: 0,
        w: 286,
        h: 67,
        cw: 286,
        ch: 67
    },
    cloud2: {
        x: 0,
        y: 0,
        w: 371,
        h: 99,
        cw: 371,
        ch: 99
    },
    cloud3: {
        x: 0,
        y: 0,
        w: 188,
        h: 42,
        cw: 188,
        ch: 42
    }
}

var TM = new TextManager(ctx);
var textList = {
    topTimer: {
        obj: null,
        desc: TM.addTextObj('09', 'Montserrat', 'bold', 20, 0, 0, 20, 20, '#000'),
    },
    scoreX: {
        obj: null,
        desc: TM.addTextObj('x', 'Montserrat', 'normal', 25, 0, 0, 10, 20, '#fff'),
    },
    scoreN: {
        obj: null,
        desc: TM.addTextObj('00', 'Montserrat', 'bold', 25, 0, 0, 20, 27, '#fff'),
    },
    scoreLabel: {
        obj: null,
        desc: TM.addTextObj('Score', 'Montserrat', 'normal', 30, 0, 0, 40, 30, '#fff'),
    },
    finalScore: {
        obj: null,
        desc: TM.addTextObj('00', 'Montserrat', 'bold', 35, 0, 0, 30, 40, '#fff'),
    },
    resetMsg: {
        obj: null,
        desc: TM.addTextObj('Tap to play again.', 'Montserrat', 'bold', 20, 0, 0, 250, 50, '#fff'),
    }
};

const compassInfo = {
    x: 0,
    y: 0,
    w: 35,
    h: 37,
    cw: 35,
    ch: 37
}

const completeInfo = {
    x: 0,
    y: 30,
    w: 370,
    h: 50,
    cw: 185,
    ch: 25
}

const trophyInfo = {
    x: 0,
    y: 120,
    w: 122,
    h: 162,
    cw: 61,
    ch: 81
}

const shineInfo = {
    x: 0,
    y: 0,
    w: 289,
    h: 274,
    cw: 289,
    ch: 274
}

const waterInfo = {
    x: 0,
    y: 160,
    w: 0,
    h: 50,
    cw: 0,
    ch: 0
}

var gameStart = false;
var level = 1;
var levelScore = LEVEL_UP_THRESHOLD;
var difficulty = [0, 0, 0, 0];
var mDown = false;

const maxTimer = 60;
var lives = topHUDInfo.life.lives;
var fade = false;
var pulseT = 0;
var canReset = false;
// canvas.width / 2 - 200, canvas.height - 225, 400, 100
const cloudMovements = [-100, 100, 100];

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    let cols = [0, 1, 2, 3];
    shuffleArr(cols);
    difficulty[cols[0]] = 0.2;
    difficulty[cols[1]] = 0.2;
    // 980 452

    scaleX = w / 1792;
    scaleY = h / 922;

    radius *= scaleX;
    dradius *= scaleX;

    textPos.x = w / 2 - 100 * scaleX;
    textPos.y = 70 * scaleY;

    btnBegin.w *= scaleX;
    btnBegin.h *= scaleY;

    btnBegin.x = w / 2 - btnBegin.w / 2;
    btnBegin.y = h - 225 * scaleY;

    let isMobile = detectMob();
    let compassAdjX = 10;
    let compassAdjY = 5;

    if (isMobile) {
        compassAdjX = 17;
        compassAdjY = 13;
        trophyInfo.y = 70;
    }

    timer = new Timer(w / 2, 0, 50, '#fb2121');
    timer.setTimer(maxTimer);
    
    projectileRanges.x[0] *= scaleX;
    // projectileRanges.x[1] *= scaleX;
    projectileRanges.y[0] *= scaleY;
    // projectileRanges.y[1] *= scaleY;

    canvas.style.display = 'block';
    instrucions.style.display = 'none';

    for (let k in images) {
        assets.load(images[k].obj, images[k].src);
    }

    for (let k in music) {
        sounds.load(music[k].obj, music[k].src, music[k].ext);
    }

    init();

    initTopHUD();

    rescaleSize(compassInfo);
    rescaleSize(shineInfo);
    rescaleSize(completeInfo);
    rescaleSize(trophyInfo);
    rescaleAll(waterInfo);

    waterInfo.y = h - waterInfo.h;

    shineInfo.w *= 2;
    shineInfo.h *= 2;
    shineInfo.x = w / 2 - shineInfo.w / 2;
    shineInfo.y = 0;

    compassInfo.x = topHUDInfo.score.x + compassAdjX * scaleX;
    compassInfo.y = topHUDInfo.score.y + compassAdjY * scaleY;

    completeInfo.x = w / 2 - completeInfo.w / 2;
    trophyInfo.x = w / 2 - trophyInfo.w / 2;
    // completeInfo.y = 15 * scaleY;

    for (let k in textList) {
        if (textList[k].desc != null) {
            textList[k].obj = TM.generateTextObj(textList[k].desc, scaleX, scaleY);
        }
    }

    textList.scoreX.obj.tx = topHUDInfo.score.x + topHUDInfo.score.pw / 2 - 5 * scaleX;
    textList.scoreN.obj.tx = topHUDInfo.score.x + topHUDInfo.score.pw - (textList.scoreN.desc.w + 70) / 2 * scaleX;
    textList.scoreX.obj.ty = topHUDInfo.score.y + (topHUDInfo.score.h / 2 - textList.scoreX.desc.h * scaleY / 2);
    textList.scoreN.obj.ty = topHUDInfo.score.y + (topHUDInfo.score.h / 2 - textList.scoreN.desc.h * scaleY / 2);

    textList.topTimer.obj.tx = topHUDInfo.timer.x + topHUD.timer.timecircle.w / 2 - (textList.topTimer.desc.w - 5) / 2 * scaleX;
    textList.topTimer.obj.ty = topHUDInfo.timer.y + topHUD.timer.timecircle.h / 2 - textList.topTimer.desc.h / 2 * scaleY;

    textList.scoreLabel.obj.tx = w / 2 - textList.scoreLabel.desc.w * scaleX / 2 - 10 * scaleX;
    textList.scoreLabel.obj.ty = 320 * scaleY;
    textList.finalScore.obj.tx = w / 2 - textList.finalScore.desc.w * scaleX / 2 - 8 * scaleX;
    textList.finalScore.obj.ty = 360 * scaleY;
    textList.resetMsg.obj.tx = w / 2 - textList.resetMsg.desc.w / 2 * scaleX - 20 * scaleX;
    textList.resetMsg.obj.ty = h / 2 - textList.resetMsg.desc.h / 2 * scaleY + 20 * scaleX;

    rescaleAll(bgInfo.cloud1);
    rescaleAll(bgInfo.cloud2);
    rescaleAll(bgInfo.cloud3);
    bgInfo.cloud1.x = w - bgInfo.cloud1.w;
    bgInfo.cloud1.y = 200 * scaleY;
    bgInfo.cloud2.x = bgInfo.cloud2.w / 2;
    bgInfo.cloud2.y = 100 * scaleY;
    bgInfo.cloud3.x = w / 2 - bgInfo.cloud3.w / 2;
    bgInfo.cloud3.y = h / 2 - (150 * scaleY);
    
    let c = Math.floor(Math.random() * clips.length);
    projectiles[0] = new Spirte(canons.black.left.upper.w - 50, canons.black.left.upper.y, clips[c].w, clips[c].h, clips[c].clipW, clips[c].clipH, c);
    projectiles[0].clipX = clips[c].clipX;
    projectiles[0].clipY = clips[c].clipY;
    projectiles[0].init(projectileRanges);

    c = Math.floor(Math.random() * clips.length);
    projectiles[1] = new Spirte(canons.black.left.upper.w - 50, canons.black.left.lower.y, clips[c].w, clips[c].h, clips[c].clipW, clips[c].clipH, c);
    projectiles[1].clipX = clips[c].clipX;
    projectiles[1].clipY = clips[c].clipY;
    projectiles[1].init(projectileRanges);

    c = Math.floor(Math.random() * clips.length);
    projectiles[2] = new Spirte(canons.black.right.upper.x, canons.black.left.upper.y, clips[c].w, clips[c].h, clips[c].clipW, clips[c].clipH, c);
    projectiles[2].clipX = clips[c].clipX;
    projectiles[2].clipY = clips[c].clipY;
    projectiles[2].direction = -1;
    projectiles[2].init(projectileRanges);

    c = Math.floor(Math.random() * clips.length);
    projectiles[3] = new Spirte(canons.black.right.upper.x, canons.black.left.lower.y, clips[c].w, clips[c].h, clips[c].clipW, clips[c].clipH, c);
    projectiles[3].clipX = clips[c].clipX;
    projectiles[3].clipY = clips[c].clipY;
    projectiles[3].direction = -1;
    projectiles[3].init(projectileRanges);

    controls();

    setCloudSpeed(30);
    
    gameCycle();
}

function initTopHUD() {
    let isMobile = detectMob();

    if (isMobile) {
        topHUD.timer.timecircle.w = 75;
        topHUD.timer.timecircle.h = 75;
        topHUD.timer.stopwatch.w = 75;
        topHUD.timer.stopwatch.h = 75;
        topHUDInfo.timer.progress.h = 30;
        topHUDInfo.timer.progress.max = 167;
        topHUDInfo.timer.text.fontsize = 18;
        topHUDInfo.timer.text.rectSize = 35;
        topHUDInfo.timer.text.y = 1;

        // (/iPad|iPhone|iPod/).test(navigator.userAgent);
        let sx = 844 / canvas.width;
        // let sy = 390 / canvas.height;

        topHUDInfo.score.w = 130;
        topHUDInfo.score.h = 65;
        topHUDInfo.score.pw = 195;
        // topHUDInfo.score.y = 3;

        topHUD.score.turtleshine.w = 65;
        topHUD.score.turtleshine.h = 65;

        topHUDInfo.score.fontX = 15;
        topHUDInfo.score.fontsize = 20;
        topHUDInfo.score.fontsize2 = 20;
        topHUDInfo.life.y = 5;
    }

    rescaleSize(topHUD.timer.timecircle);
    rescaleSize(topHUD.timer.stopwatch);
    // rescaleSize(topHUD.score.turtleshine);
    rescaleAll(topHUD.score.turtleshine);
    rescaleSize(topHUDInfo);

    topHUDInfo.timer.w = topHUD.timer.timecircle.w / 2 + 100 * scaleX;
    topHUDInfo.timer.progress.h *= scaleX;
    
    topHUDInfo.timer.progress.x = topHUDInfo.w / 2 - topHUDInfo.timer.w / 2;

    topHUDInfo.timer.x = topHUDInfo.timer.progress.x - topHUD.timer.timecircle.w / 2;
    topHUDInfo.timer.y = topHUDInfo.h / 2 - topHUD.timer.timecircle.h / 2;

    topHUDInfo.timer.progress.y = (topHUDInfo.h / 2 - topHUDInfo.timer.progress.h / 2);
    topHUDInfo.timer.text.x = topHUDInfo.timer.x + topHUDInfo.timer.text.rectSize * scaleX / 2;
    topHUDInfo.timer.text.y += topHUDInfo.timer.y + topHUD.timer.timecircle.h / 2;
    
    topHUDInfo.score.w *= scaleX;
    topHUDInfo.score.h *= scaleY;
    topHUDInfo.score.pw *= scaleX;
    

    let sx = canvas.width / 2 - topHUDInfo.w / 2;
    // topHUDInfo.score.x = sx + (topHUDInfo.w  - topHUDInfo.score.w) / 2;
    topHUDInfo.score.x = sx + (topHUDInfo.w - topHUDInfo.score.pw) / 2;
    topHUDInfo.score.y += topHUDInfo.timer.y;

    topHUDInfo.score.fontX += topHUDInfo.score.x + (topHUDInfo.w - topHUDInfo.score.pw) / 2 + 10 * scaleX;
    topHUDInfo.score.fontY += topHUDInfo.score.y + topHUDInfo.score.h / 2;
    topHUDInfo.score.fontXadj *= scaleX;

    topHUDInfo.life.w *= scaleX;
    topHUDInfo.life.h *= scaleY;
    topHUDInfo.life.pad = 20 * scaleX;
    let lifeW = topHUDInfo.life.pad * 2 + topHUDInfo.life.w * topHUDInfo.life.lives;
    sx = (canvas.width - topHUDInfo.w);
    topHUDInfo.life.x = sx + (topHUDInfo.w - lifeW) / 2;
    topHUDInfo.life.y += topHUDInfo.timer.y;
}

function drawTopHUD() {
    const { x, y, w, h } = topHUDInfo.timer;
    
    ctx.drawImage(images.timecircle.obj.img, 0, 0, topHUD.timer.timecircle.cw, 
        topHUD.timer.timecircle.ch, x, y, topHUD.timer.timecircle.w, topHUD.timer.timecircle.h);

    ctx.drawImage(images.stopwatch.obj.img, 0, 0, topHUD.timer.stopwatch.cw, 
        topHUD.timer.stopwatch.ch, x, y, topHUD.timer.stopwatch.w, topHUD.timer.stopwatch.h);

    // let timeText = showTarget ? '09' : zeroPad(Math.floor(timer.timer / 24), 2);
    let timeText = zeroPad(Math.floor(timer.timer / 24), 2);
    textList.topTimer.obj.str = timeText;
    TM.draw(textList.topTimer.obj);
}

function drawProgress() {
    const { w } = topHUDInfo.timer;
    const { x, y, h, max } = topHUDInfo.timer.progress;
    let p = (max * scaleX * (timer.timer / (maxTimer * 24)));

    const grd = ctx.createLinearGradient(0, 0, 0, p);

    let percent = p / (max * scaleX);
    
    if (percent > 0.7) {
        grd.addColorStop(0, "#4ED20E");
        grd.addColorStop(0.5, "#83DF56");
        grd.addColorStop(1, "#59DC19");
    } else {
        grd.addColorStop(0, "#fb2121");
        grd.addColorStop(0.5, "#f9a139");
        grd.addColorStop(1, "#fb2121");
    }

    /* To visalize ------------------------------------------------------*/
    ctx.beginPath();
    ctx.arc(h / 2 + x, h / 2 + y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
    ctx.lineTo(w + x, 0 + y);
    ctx.arc((h / 2) + w + x, h / 2 + y, h / 2, 3 / 2 *Math.PI,Math.PI / 2);
    ctx.lineTo(h / 2 + x, h + y);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
    /* ------------------------------------------------------------------*/

    if(p <= h){
        // ctx.beginPath();
        // ctx.arc(h / 2 + x, h / 2 + y, h / 2, Math.PI - Math.acos((h - p) / h), Math.PI + Math.acos((h - p) / h));
        // ctx.save();
        // ctx.scale(-1, 1);
        // ctx.arc((h / 2) - p + x, h / 2 + y, h / 2, Math.PI - Math.acos((h - p) / h), Math.PI + Math.acos((h - p) / h));
        // ctx.restore();
        // ctx.fillStyle = grd;
        // ctx.fill();
    } else {
        ctx.beginPath();
        ctx.arc(h / 2 + x, h / 2+ y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
        ctx.lineTo(p - 2 * h + x, 0 + y);
        ctx.arc(p - (h / 2) + x, h / 2 + y, h / 2, 3 / 2 *Math.PI,Math.PI / 2);
        ctx.lineTo(h / 2 + x, h + y);
        ctx.fillStyle = grd;
        ctx.fill();
    }
}

function drawScoreHUD() {
    const { x, y, w, h, pw } = topHUDInfo.score;
    const p = pw;

    ctx.beginPath();
    ctx.arc(h / 2 + x, h / 2+ y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
    ctx.lineTo(p - 2 * h + x, 0 + y);
    ctx.arc(p - (h / 2) + x, h / 2 + y, h / 2, 3 / 2 * Math.PI,Math.PI / 2);
    ctx.lineTo(h / 2 + x, h + y);
    ctx.fillStyle = "#2D3E58";
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    ctx.drawImage(images.compass.obj.img, 0, 0, compassInfo.cw, 
        compassInfo.ch, compassInfo.x, compassInfo.y, compassInfo.w, compassInfo.h);

    TM.draw(textList.scoreX.obj);
    score = Math.max(0, score);
    textList.scoreN.obj.str = zeroPad(score, 2);
    TM.draw(textList.scoreN.obj);
}

function drawLives() {
    const { x, y, cw, ch, w, h, pad } = topHUDInfo.life;
    
    for (let i = 0; i < lives; ++i) {
        ctx.drawImage(images.life.obj.img, 0, 0, cw, ch, x + i * w + i * pad, y, w, h);
    }
    
}

function drawClouds() {
    for (let i = 1; i < 4; ++i) {
        let key = 'cloud' + i;
        ctx.drawImage(images[key].obj.img, 0, 0, bgInfo[key].cw, bgInfo[key].ch, 
            bgInfo[key].x, bgInfo[key].y, bgInfo[key].w, bgInfo[key].h);
    }
}

function moveClouds() {
    for (let i = 1; i < 4; ++i) {
        let key = 'cloud' + i;
        bgInfo[key].x += cloudMovements[i - 1] * delta;

        if (bgInfo[key].x > canvas.width + bgInfo[key].w) {
            
            let rngSpeed = Math.floor(Math.random() * 100 + 1);
            let mul = Math.floor(Math.random() * 2);

            if (mul == 0) {
                cloudMovements[i - 1] = -rngSpeed;
                bgInfo[key].x = canvas.width;
                console.log('test', )
            } else {
                cloudMovements[i - 1] = rngSpeed;
                bgInfo[key].x = -bgInfo[key].w;
            }

            bgInfo[key].y = Math.floor(Math.random() * 200 + 200);
        } else if (bgInfo[key].x + bgInfo[key].w * 2 < 0) {
            
            let rngSpeed = Math.floor(Math.random() * 100 + 1);
            let mul = Math.floor(Math.random() * 2);

            if (mul == 0) {
                cloudMovements[i - 1] = -rngSpeed;
                bgInfo[key].x = canvas.width;
            } else {
                cloudMovements[i - 1] = rngSpeed;
                bgInfo[key].x = -bgInfo[key].w;
            }

            bgInfo[key].y = Math.floor(Math.random() * 200 + 200);
        }
    }
}

function setCloudSpeed(max) {
    for (let i = 0; i < 3; ++i) {
        let rngSpeed = Math.floor(Math.random() * max + 1);
        let mul = Math.floor(Math.random() * 2);
        if (mul == 0)
            cloudMovements[i] = rngSpeed;
        else 
            cloudMovements[i] = -rngSpeed;
    }
    
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

function controls() {
    canvas.addEventListener('touchstart', e => {
        // mousedownE(e.touches[0].clientX, e.touches[0].clientY);
        if (!mDown) {
            let mx = e.touches[0].clientX;
            let my = e.touches[0].clientY;

            // if (gameStart) {
            //     splat(mx, my);
            //     updateLevel();
            // } else {
            //     if (isBtnClicked(mx, my, btnBegin)) {
            //         gameStart = true;
            //     }
            // }

            // mDown = true;
            if (gameStart) {
                splat(mx, my);
                updateLevel();
            } else {
                if (isBtnClicked(mx, my, btnBegin)) {
                    gameStart = true;

                    music.bg.obj.audio.volume = 0.5;
                    music.bg.obj.audio.loop = true;
                    music.bg.obj.audio.play();

                    music.explosion.obj.audio.volume = 0.8;
                    music.explosion.obj.audio.loop = true;
                    music.explosion.obj.audio.play();
                }
            }

            mDown = true;
        }
    });

    canvas.addEventListener('touchmove', e => {
        // mousemoveE(e.touches[0].clientX, e.touches[0].clientY);
    });

    canvas.addEventListener('touchend', e => {
        // mouseupE();
        
        // console.log(mx, my)
        // if (mDown) {
        //     mDown = false;
        // }
        
    });

    canvas.addEventListener('mousedown', e => {
        // mousedownE(e.offsetX, e.offsetY);
        if (!mDown) {
            let mx = e.offsetX;
            let my = e.offsetY;

            if (gameStart) {
                splat(mx, my);
                updateLevel();
            } else {
                if (isBtnClicked(mx, my, btnBegin)) {
                    gameStart = true;

                    music.bg.obj.audio.volume = 0.5;
                    music.bg.obj.audio.loop = true;
                    music.bg.obj.audio.play();

                    music.explosion.obj.audio.volume = 0.8;
                    music.explosion.obj.audio.loop = true;
                    music.explosion.obj.audio.play();
                }
            }

            mDown = true;
        }
    });

    canvas.addEventListener('mousemove', e => {
        // mousemoveE(e.offsetX, e.offsetY);
    });
    
    canvas.addEventListener('mouseup', e => {
        // mouseupE();

        // for (let i = 0; i < 1; ++i) {
        //     if (isSplatted(projectiles[i], { x: mx, y: my })) {
        //         console.log('splatted!');
        //         break;
        //     }
        // }
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

function init() {
    rescale(images.landLeft);
    rescale(images.landRight);
    rescale(canons.black.left.upper);
    rescale(canons.black.left.lower);
    rescale(canons.black.right.upper);
    rescale(canons.black.right.lower);

    for (let i = 0; i < projectiles.length; ++i) {
        rescale(projectiles[i]);
    }

    for (let i = 0; i < clips.length; ++i) {
        clips[i].w *= scaleX;
        clips[i].h *= scaleY;
    }

    canons.init();

    landPosX = canvas.width - images.landLeft.w;
    landPosY = canvas.height - images.landLeft.h;

    images.landLeft.y = landPosY;
    images.landRight.x = landPosX;
    images.landRight.y = landPosY + 10 * scaleX;

    cannonCollisionBubble[0] = {
        x: canons.black.left.upper.x + canons.black.left.upper.w - dradius,
        y: canons.black.left.upper.y + dradius,
    }

    cannonCollisionBubble[1] = {
        x: canons.black.left.lower.x + canons.black.left.lower.w - dradius,
        y: canons.black.left.lower.y + dradius,
    }

    cannonCollisionBubble[2] = {
        x: canons.black.right.upper.x + dradius,
        y: canons.black.right.upper.y + dradius,
    }

    cannonCollisionBubble[3] = {
        x: canons.black.right.lower.x + dradius,
        y: canons.black.right.lower.y + dradius,
    }
}

function resetGame() {
    score = 0;
    levelScore = LEVEL_UP_THRESHOLD;
    gameover = false;
    canReset = false;
    fade = false;
    pulseT = 0;
    lives = topHUDInfo.life.lives;
    timer.setTimer(maxTimer);
}

function isBtnClicked(mx, my, btn) {
    return (mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h);
}

function updateLevel() {
    if (score >= levelScore) {
        levelScore = ++level * LEVEL_UP_THRESHOLD;
        updateDifficulty();
        console.log('level up');
    }
}

function updateDifficulty() {
    let cols = [];
    for (let i = 0; i < difficulty.length; ++i) {
        if (difficulty[i] < 1) {
            cols.push(i);
        }
    }

    if (cols.length > 0) {
        let rng = Math.floor(Math.random() * cols.length);
        difficulty[cols[rng]] += 0.2;
    }
}

function displayScore() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "#FFFFFF";
    let s = parseInt(textPos.score).toString().padStart(5, '0');
    ctx.fillText(s, textPos.x, textPos.y);

    if (score < 0) score = 0;

    if (Math.floor(textPos.score < score)) {
        textPos.score += 50 * delta;
    } else {
        textPos.score = score;
    }
}

function checkProjectileCollisions() {
    for (let i = 0; i < 2; ++i) {
        for (let j = 2; j < 4; ++j) {
            if (isCollided(projectiles[i], projectiles[j])) {
                if (projectiles[i].clipY != projectiles[j].clipY) {
                    console.log('collision detected');
                    resetProjectile([i, j]);
                    score += PROJECTILE_COLLISION_MINUS;
                }
            }
        }
    }
}

function checkCanonCollisions() {

    if (isCollided(projectiles[0], cannonCollisionBubble[2]) || isCollided(projectiles[0], cannonCollisionBubble[3])) {
        resetProjectile([0]);
        score += CANON_COLLISION_MINUS;
    }

    if (isCollided(projectiles[1], cannonCollisionBubble[2]) || isCollided(projectiles[1], cannonCollisionBubble[3])) {
        resetProjectile([1]);
        score += CANON_COLLISION_MINUS;
    }

    if (isCollided(projectiles[2], cannonCollisionBubble[0]) || isCollided(projectiles[2], cannonCollisionBubble[1])) {
        resetProjectile([2]);
        score += CANON_COLLISION_MINUS;
    }

    if (isCollided(projectiles[3], cannonCollisionBubble[0]) || isCollided(projectiles[3], cannonCollisionBubble[1])) {
        resetProjectile([3]);
        score += CANON_COLLISION_MINUS;
    }
}

function updateSprite(idx) {
    let c = Math.floor(Math.random() * clips.length);
    projectiles[idx].updateSprite(clips[c].w, clips[c].h, clips[c].clipW, clips[c].clipH, clips[c].clipX, clips[c].clipY, c);
}

function resetProjectile(range) {
    for (let k in range) {
        let idx = range[k];
        projectiles[idx].init(projectileRanges);
        updateSprite(idx);
    }
}

function isCollided(p1, p2) {
    var x = p1.x - p2.x;
    var y = p1.y - p2.y;

    return (dradius > Math.sqrt((x * x) + (y * y)));
}

function reduceHP() {
    if (--lives < 0) {
        gameover = true;
    }
}

function splat(mx, my) {
    for (let i = 0; i < projectiles.length; ++i) {
        if (isSplatted(projectiles[i], { x: mx, y: my })) {
            if (projectiles[i].clipY > 0) {
                console.log('ouch!');
                score += OUCH_MINUS;
                reduceHP();
            } else {
                console.log('splatted!');
                score += SPLAT_POINTS;
            }
            resetProjectile([i]);
            break;
        }
    }
}

function isSplatted(p1, p2) {
    return (p2.x >= p1.x && p2.x <= p1.x + p1.w && p2.y >= p1.y && p2.y <= p1.y + p1.h);
}

function rescale(obj) {
    console.log(obj.x, obj.y, obj.w, obj.h);
    obj.x *= scaleX;
    obj.y *= scaleY;
    obj.w *= scaleX;
    obj.h *= scaleY;
    console.log(obj.x, obj.y, obj.w, obj.h);
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

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function update() {
    // placeholder
    // projectiles[0].vy += g * 50 * delta;
    timer.tick(delta);

    if (timer.timer <= 0) {
        canReset = true;
        gameover = true;
    }

    moveClouds();
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    if (assets.loaded == assets.count && sounds.loaded == sounds.count) {
        if (!gameover) {
            if (gameStart) {
                // bg
                // ctx.drawImage(images.bg.obj.img, 0, 0, 927, 429, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(images.sky.obj.img, 0, 0, 926, 429, 0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                ctx.fillStyle = '#70D2ED';
                ctx.rect(0, waterInfo.y, canvas.width, waterInfo.h);
                ctx.fill();
                drawClouds();
                drawProgress();
                drawTopHUD();
                drawScoreHUD();
                drawLives();

                // lands
                ctx.drawImage(images.landLeft.obj.img, 0, 0, 157, 206, images.landLeft.x, images.landLeft.y, images.landLeft.w, images.landLeft.h);
                ctx.drawImage(images.landRight.obj.img, 0, 0, 157, 206, images.landRight.x, images.landRight.y, images.landRight.w, images.landRight.h);

                // canons
                canons.draw();

                for (let i = 0; i < projectiles.length; ++i) {
                    if (difficulty[i] > 0) {
                        projectiles[i].draw(ctx, images.projectile.obj.img);
                        let r = projectiles[i].update(delta * difficulty[i], g, projectileRanges);
                        
                        if (r) {
                            updateSprite(i);
                        }
                    }
                }

                checkProjectileCollisions();
                checkCanonCollisions();
                // displayScore();
                update();
            } else {
            
                ctx.drawImage(images.splash.obj.img, 0, 0, 927, 429, 0, 0, canvas.width, canvas.height);

                // ctx.beginPath();
                // ctx.rect(btnBegin.x, btnBegin.y, btnBegin.w, btnBegin.h);
                // ctx.stroke();
            }
        } else {
            if (!fade) {
                // bg
                // ctx.drawImage(images.bg.obj.img, 0, 0, 927, 429, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(images.sky.obj.img, 0, 0, 926, 429, 0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                ctx.fillStyle = '#70D2ED';
                ctx.rect(0, waterInfo.y, canvas.width, waterInfo.h);
                ctx.fill();
                drawClouds();
                drawProgress();
                drawTopHUD();
                drawScoreHUD();
                drawLives();

                // lands
                ctx.drawImage(images.landLeft.obj.img, 0, 0, 157, 206, images.landLeft.x, images.landLeft.y, images.landLeft.w, images.landLeft.h);
                ctx.drawImage(images.landRight.obj.img, 0, 0, 157, 206, images.landRight.x, images.landRight.y, images.landRight.w, images.landRight.h);

                // canons
                canons.draw();

                // game
                // drawTurtle();
                // update();

                ctx.globalAlpha = 0.85;
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 1.0;

                pulseT += 2 * delta;
                let w = Math.sin(pulseT) * (shineInfo.w + 10);
                let h = Math.sin(pulseT) * (shineInfo.h + 10);

                if (w >= shineInfo.w) {
                    w = shineInfo.w;
                }

                if (h >= shineInfo.h) {
                    h = shineInfo.h;
                }

                if (w == shineInfo.w && h == shineInfo.h) {
                    fade = true;
                }

                let x = shineInfo.x + (shineInfo.w / 2 - w / 2);
                let y = shineInfo.y + (shineInfo.h / 2 - h / 2) - 50 * scaleY;
                ctx.drawImage(images.shine.obj.img, 0, 0, shineInfo.cw, 
                    shineInfo.ch, x, y, w, h);

                ctx.drawImage(images.complete.obj.img, 0, 0, completeInfo.cw, 
                    completeInfo.ch, completeInfo.x, completeInfo.y, completeInfo.w, completeInfo.h);
                
                ctx.drawImage(images.trophy.obj.img, 0, 0, trophyInfo.cw, 
                    trophyInfo.ch, trophyInfo.x, trophyInfo.y, trophyInfo.w, trophyInfo.h);
                // ctx.drawImage(images.shine.obj.img, 0, 0, shineInfo.cw, 
                //     shineInfo.ch, shineInfo.x, shineInfo.y, shineInfo.w, shineInfo.h);
                
                // x = shineInfo.x + (shineInfo.w / 2 - turtleInfo.w / 2);
                // y = shineInfo.y + (shineInfo.h / 2 - turtleInfo.h / 2 - 10 * scaleY);
                // ctx.drawImage(images.turtle.obj.img, 0, 0, turtleInfo.cw, 
                //     turtleInfo.ch, x, y, turtleInfo.w, turtleInfo.h);
                

                // TM.draw(textList.complete.obj);
                TM.draw(textList.scoreLabel.obj);
                textList.finalScore.obj.str = zeroPad(score, 2);
                TM.draw(textList.finalScore.obj);
                TM.draw(textList.resetMsg.obj);
            }
        }
    }

    requestAnimationFrame(gameCycle);
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);