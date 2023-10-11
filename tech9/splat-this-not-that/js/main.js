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

        if (fn == 'bg') {
            obj.audio.volume = 0.0;
        } else {
            obj.audio.volume = 1;
        }

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
        src: 'sounds/bg-area12',
        obj: {},
        ext: 'mp3',
    }, 
    explosion: {
        src: 'sounds/explosion',
        obj: {},
        ext: 'wav',
    },
    score: {
        src: 'sounds/score',
        obj: {},
        ext: 'wav',
    },
    ouch: {
        src: 'sounds/ouch',
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
    title: {
        src: 'title',
        obj: {},
    },
    hand: {
        src: 'hand',
        obj: {},
    },
    startballoon: {
        src: 'startballoon',
        obj: {},
    },
    startmine: {
        src: 'startmine',
        obj: {},
    },
    text1: {
        src: 'text1',
        obj: {},
    },
    text2: {
        src: 'text2',
        obj: {},
    },
    text3: {
        src: 'text3',
        obj: {},
    },
    ouch: {
        src: 'ouch',
        obj: {},
    },
    explosion_star: {
        src: 'explosion_star',
        obj: {},
    },
    beginbutton: {
        src: 'beginbutton',
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
    blackcannon: {
        src: 'cannon_sprite',
        obj: {}
    },
    blackCanonLeft: {
        src: 'black-canon',
        obj: {}
    },
    kaboom: {
        src: 'kaboom',
        obj: {}
    },
    boom: {
        src: 'boom_sprite',
        obj: {}
    },
    scoreboom: {
        src: 'score_sprite',
        obj: {}
    },
    blackCanonRight: {
        src: 'black-canon-2',
        obj: {}
    },
    projectiles: {
        src: 'shapes/projectiles',
        obj: {}
    },
    // softobjects: {
    //     src: 'shapes/soft',
    //     obj: {}
    // },
    // hardobjects: {
    //     src: 'shapes/hard',
    //     obj: {}
    // },
    // bombs: {
    //     src: 'shapes/bombs',
    //     obj: {}
    // },
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
    volume: {
        src: 'volume',
        obj: {},
    },
    mute: {
        src: 'mute',
        obj: {},
    },
}

var volumeInfo = {
    x: 15,
    y: 20,
    w: 25 * 2,
    h: 25 * 2,
    cw: 46,
    ch: 46,
}

// 481 × 49
var kaboomInfo = {
    x: 0,
    y: 0,
    // w: 108,
    // h: 28,
    w: 48.1 * 3,
    h: 49 * 3,
    cw: 48.1,
    ch: 49,
    // cw: 108,
    // ch: 28,
}

// var explosionStarInfo = {
//     x: 0,
//     y: 0,
//     w: 77 * 3,
//     h: 77 * 3,
//     cw: 77,
//     ch: 77,
// }

var explosionStarInfo = {
    x: 0,
    y: 0,
    w: 48.125 * 3,
    h: 49 * 3,
    cw: 48.125,
    ch: 49,
}

// 385 × 49
var ouchInfo = {
    x: 0,
    y: 0,
    w: 48.125 * 3,
    h: 49 * 3,
    cw: 48.125,
    ch: 49,
    // cw: 70,
    // ch: 28,
}

var volumeOn = true;

var canons = {
    black: {
        left: {
            upper: new Spirte(0, 310, 280, 235, 192.11, 145),
            lower: new Spirte(0, 540, 280, 235, 192.11, 145),
            // upper: new Spirte(0, 310, 285, 225, 636, 504),
            // lower: new Spirte(0, 540, 285, 225, 636, 504),
        },
        right: {
            upper: new Spirte(0, 320, 280, 235, 192.11, 145),
            lower: new Spirte(0, 540, 280, 235, 192.11, 145),
            // upper: new Spirte(0, 320, 285, 225, 570, 451),
            // lower: new Spirte(0, 540, 285, 225, 570, 451),
        },
    },
    index: [],
    init: () => {
        canons.black.right.upper.x = canvas.width - canons.black.right.upper.w;
        canons.black.right.upper.ox = canvas.width - canons.black.right.upper.w;
        canons.black.right.lower.x = canvas.width - canons.black.right.lower.w;
        canons.black.right.lower.ox = canvas.width - canons.black.right.lower.w;

        canons.black.right.upper.yRotate = 180;
        canons.black.right.lower.yRotate = 180;

        canons.black.left.upper.frames = 9;
        canons.black.left.lower.frames = 9;
        canons.black.right.upper.frames = 9;
        canons.black.right.lower.frames = 9;

    },
    draw: () => {
        let expSpeed = 15;
        canons.black.left.upper.animateSprite(expSpeed, delta);
        canons.black.left.lower.animateSprite(expSpeed, delta);
        canons.black.right.upper.animateSprite(expSpeed, delta);
        canons.black.right.lower.animateSprite(expSpeed, delta);

        canons.black.left.upper.draw(ctx, images.blackcannon.obj.img);
        canons.black.left.lower.draw(ctx, images.blackcannon.obj.img);
        canons.black.right.upper.drawRotate(ctx, images.blackcannon.obj.img);
        canons.black.right.lower.drawRotate(ctx, images.blackcannon.obj.img);

        // canons.black.right.lower.draw(ctx, images.blackCanonRight.obj.img);
    }
}

var landPosX = 0;
var landPosY = 0;
var scaleX = 1;
var scaleY = 1;

var g = 9.81;
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

var projectileRanges = {
    x: [50, 250],
    y: [50, 600]
}

var radius = 28;
var dradius = radius * 2;
        
const cannonCollisionBubble = [];

var score = 0;
const SPLAT_POINTS = 1;
const OUCH_MINUS = -1;
const PROJECTILE_COLLISION_MINUS = -20;
const CANON_COLLISION_MINUS = -30;
// const LEVEL_UP_THRESHOLD = 200;
const LEVEL_UP_THRESHOLD = 2;

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
            w: 45 * 2,
            h: 45 * 2,
            cw: 45,
            ch: 45,
        },
        stopwatch: {
            w: 45 * 2,
            h: 45 * 2,
            cw: 43,
            ch: 45,
        },
    },
    score: {
        turtleshine: {
            w: 45 * 2,
            h: 45 * 2,
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
        h: 55,
        pw: 230,
        fontsize: 20,
        fontsize2: 25,
        fontX: 0,
        fontY: 0,
        fontXadj: 37
    },
    life: {
        x: 0,
        y: 0,
        w: 45 * 2,
        h: 45 * 2,
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
        desc: TM.addTextObj('09', 'Montserrat', 'bold', 20, 0, 0, 35, 35, '#000'),
    },
    scoreX: {
        obj: null,
        desc: TM.addTextObj('x', 'Montserrat', 'normal', 25, 0, 0, 20, 40, '#fff'),
    },
    scoreN: {
        obj: null,
        desc: TM.addTextObj('00', 'Montserrat', 'bold', 25, 0, 0, 25, 37, '#fff'),
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
    y: 270,
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
var difficultyAdj = [0, 0, 0, 0];
var mDown = false;

const maxTimer = 60;
var lives = topHUDInfo.life.lives;
var fade = false;
var pulseT = 0;
var canReset = false;
// canvas.width / 2 - 200, canvas.height - 225, 400, 100
const cloudMovements = [-100, 100, 100];

var scaleProj = 1.5;
var kaboomT = 0;
var kaboomT2 = 0;
var ouchT = 0;
var ouchT2 = 0;

// 448 × 57
var startPageInfo = {
    title: {
        x: 0,
        y: 70,
        w: 261 * 2,
        h: 101 * 2,
        cw: 261,
        ch: 101,
    },
    hand: {
        x: 557,
        y: 333,
        w: 64 * 2,
        h: 65 * 2,
        cw: 56,
        ch: 57,
        // cw: 64,
        // ch: 65,
    },
    startballoon: {
        x: 837,
        y: 345,
        w: 56 * 2,
        h: 57 * 2,
        cw: 56,
        ch: 57,
    },
    startmine: {
        x: 1113,
        y: 345,
        ox: 1113,
        oy: 345,
        w: 56 * 2,
        h: 57 * 2,
        cw: 56,
        ch: 57,
    },
    text1: {
        x: 505,
        y: 485,
        w: 119 * 2,
        h: 25 * 2,
        cw: 119,
        ch: 25,
    },
    text2: {
        x: 780,
        y: 485,
        w: 115 * 2,
        h: 27 * 2,
        cw: 115,
        ch: 27,
    },
    text3: {
        x: 1080,
        y: 485,
        w: 89 * 2,
        h: 27 * 2,
        cw: 89,
        ch: 27,
    },
    beginbutton: {
        x: 0,
        y: 690,
        w: 213 * 2,
        h: 49 * 2,
        cw: 213,
        ch: 49,
    },
}

var startScreenTimerAnimT = 0;
var startScreenHandAnimT = 0;
var startPulseT = 0;

var floaters = [];

var timeProgressBar = null;

var projSpriteInfo = {
    0: {
        frames: 18,
        cw: 48.056,
        ch: 48,
        key: "softobjects"
    },
    1: {
        frames: 13,
        cw: 48.077,
        ch: 49,
        key: "hardobjects"
    },
    2: {
        frames: 5,
        cw: 48,
        ch: 48,
        key: "bombs"
    },
    3: {
        frames: 43,
        cw: 48.023,
        ch: 49,
        key: "projectiles"
    },
};
// 2065 × 49, 43, 48.023
var projDimX = 85;
var projDimY = 85;

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    let cols = [0, 1, 2, 3];
    shuffleArr(cols);
    difficulty[cols[0]] = Math.floor(Math.random() * 100) / 100 + 0.2;
    difficulty[cols[1]] = Math.floor(Math.random() * 100) / 100 + 0.2;
    difficulty[cols[2]] = Math.floor(Math.random() * 100) / 100 + 0.2;
    difficulty[cols[3]] = Math.floor(Math.random() * 100) / 100 + 0.2;
    // 980 452

    scaleX = w / 1792;
    scaleY = h / 922;

    projDimX *= scaleX;
    projDimY *= scaleX;

    g *= scaleY;

    // alert(scaleX + ', ' + scaleY)

    if (scaleX > 0.6 && scaleX < 1) {
        projectileRanges = {
            x: [50, 350],
            y: [50, 1000]
        }
    }

    if (detectMob()) {
        projectileRanges = {
            x: [50, 300],
            y: [50, 700]
        }
    }

    initStartPage();

    canons.index = [
        canons.black.left.upper,
        canons.black.left.lower,
        canons.black.right.upper,
        canons.black.right.lower
    ];

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

    let scoreNAdjY = 0;

    if (isMobile) {
        compassAdjX = 17;
        compassAdjY = 13;
        // trophyInfo.y = 70;
        scaleProj = 1.7;

        // volumeInfo.x = 45;
        // volumeInfo.y = 85;
        volumeInfo.w = 35;
        volumeInfo.h = 35;

        // textList.topTimer.desc.weight = 'normal';
        // textList.scoreN.desc.weight = 'normal';

        scoreNAdjY = 2;
        
    }

    timer = new Timer(w / 2, 0, 50, '#fb2121');
    timer.setTimer(maxTimer);
    
    projectileRanges.x[0] *= scaleX;
    projectileRanges.x[1] *= scaleX;
    projectileRanges.y[0] *= scaleY;
    projectileRanges.y[1] *= scaleY;

    canvas.style.display = 'block';
    instrucions.style.display = 'none';

    for (let k in images) {
        assets.load(images[k].obj, images[k].src);
    }

    for (let k in music) {
        sounds.load(music[k].obj, music[k].src, music[k].ext);
    }

    init();

    

    rescaleSize(compassInfo);
    rescaleSize(shineInfo);
    rescaleSize(completeInfo);
    rescaleAll(trophyInfo);
    rescaleAll(waterInfo);
    rescaleAll(kaboomInfo);
    rescaleAll(explosionStarInfo);
    rescaleAll(ouchInfo);

    rescaleAll(volumeInfo);

    initTopHUD();

    waterInfo.y = h - waterInfo.h;

    shineInfo.w *= 2;
    shineInfo.h *= 2;
    shineInfo.x = w / 2 - shineInfo.w / 2;
    shineInfo.y = 150 * scaleY;

    compassInfo.x = topHUDInfo.score.x + compassAdjX * scaleX;
    compassInfo.y = topHUDInfo.score.y + compassAdjY * scaleY;

    completeInfo.x = w / 2 - completeInfo.w / 2;
    trophyInfo.x = w / 2 - trophyInfo.w / 2;
    completeInfo.y = shineInfo.y + 15 * scaleY;

    for (let k in textList) {
        if (textList[k].desc != null) {
            textList[k].obj = TM.generateTextObj(textList[k].desc, scaleX, scaleY);
        }
    }

    let padY = 0;
    let padY2 = 0;

    if (isMobile) {
        padY =  10 * scaleY;
        padY2 = 5 * scaleY;
    }

    let pbW = 150 * scaleX;
    let pbH = 45 * scaleY;

    timeProgressBar = new ProgressBar(topHUDInfo.timer.progress.x * scaleX, 30 * scaleY, pbW, pbH);
    timeProgressBar.progress = 100;

    pbW = 150 * scaleX;
    pbH = 55 * scaleY;

    scoreProgressBar = new ProgressBar(w / 2 - pbW / 2, 20 * scaleY, pbW, pbH, '#2D3E58');
    scoreProgressBar.progress = 100;

    // textList.scoreX.obj.tx = topHUDInfo.score.x + topHUDInfo.score.pw / 2 - 5 * scaleX;
    // textList.scoreN.obj.tx = topHUDInfo.score.x + topHUDInfo.score.pw - (textList.scoreN.desc.w + 230 * scaleX) / 2 * scaleX;
    textList.scoreN.obj.tx = scoreProgressBar.x + scoreProgressBar.w - 5 * scaleX;
    textList.scoreX.obj.tx = scoreProgressBar.x + scoreProgressBar.w / 2 + 15 * scaleX;
    // textList.scoreX.obj.ty = topHUDInfo.score.y + (topHUDInfo.score.h / 2 - textList.scoreX.desc.h * scaleY / 2) - padY;
    // textList.scoreN.obj.ty = topHUDInfo.score.y + (topHUDInfo.score.h / 2 - textList.scoreN.desc.h * scaleY / 2) - scoreNAdjY - padY2;
    
    textList.scoreX.obj.ty = 25 * scaleY;
    textList.scoreN.obj.ty = 28 * scaleY;

    // textList.topTimer.obj.tx = topHUDInfo.timer.x + topHUD.timer.timecircle.w / 2 - (textList.topTimer.desc.w - 5) / 2 * scaleX;
    textList.topTimer.obj.tx = 45 * scaleX + volumeInfo.x + volumeInfo.w;
    textList.topTimer.obj.ty = topHUDInfo.timer.y + topHUD.timer.timecircle.h / 2 - textList.topTimer.desc.h / 2 * scaleY;

    textList.scoreLabel.obj.tx = w / 2 - textList.scoreLabel.desc.w * scaleX / 2 - 10 * scaleX;
    textList.scoreLabel.obj.ty = 450 * scaleY;
    textList.finalScore.obj.tx = w / 2 - textList.finalScore.desc.w * scaleX / 2 - 8 * scaleX;
    textList.finalScore.obj.ty = 490 * scaleY;
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
    projectiles[0] = new Spirte(canons.black.left.upper.w - 100 * scaleX, canons.black.left.upper.y, clips[c].w, clips[c].h, clips[c].clipW, clips[c].clipH, c);
    // projectiles[0].clipX = clips[c].clipX;
    // projectiles[0].clipY = clips[c].clipY;
    projectiles[0].init(projectileRanges);

    c = Math.floor(Math.random() * clips.length);
    projectiles[1] = new Spirte(canons.black.left.upper.w - 100 * scaleX, canons.black.left.lower.y, clips[c].w, clips[c].h, clips[c].clipW, clips[c].clipH, c);
    // projectiles[1].clipX = clips[c].clipX;
    // projectiles[1].clipY = clips[c].clipY;
    projectiles[1].init(projectileRanges);

    c = Math.floor(Math.random() * clips.length);
    projectiles[2] = new Spirte(canons.black.right.upper.x, canons.black.left.upper.y, clips[c].w, clips[c].h, clips[c].clipW, clips[c].clipH, c);
    // projectiles[2].clipX = clips[c].clipX;
    // projectiles[2].clipY = clips[c].clipY;
    projectiles[2].direction = -1;
    projectiles[2].init(projectileRanges);

    c = Math.floor(Math.random() * clips.length);
    projectiles[3] = new Spirte(canons.black.right.upper.x, canons.black.left.lower.y, clips[c].w, clips[c].h, clips[c].clipW, clips[c].clipH, c);
    // projectiles[3].clipX = clips[c].clipX;
    // projectiles[3].clipY = clips[c].clipY;
    projectiles[3].direction = -1;
    projectiles[3].init(projectileRanges);

    projectiles[0].zRotate = 0;
    projectiles[1].zRotate = 0;
    projectiles[2].zRotate = 180;
    projectiles[3].zRotate = 180;

    updateSprite(0);
    updateSprite(1);
    updateSprite(2);
    updateSprite(3);
    

    // generateFloaters();

    controls();

    setCloudSpeed(30);
    
    gameCycle();
}

function setFloater(i) {
    let depth = Math.floor(Math.random() * 15) + 5;
    
    floaters[i].x = canvas.width / 2;
    floaters[i].y = canvas.height + clips[i].h * depth;
    floaters[i].id = i;

    floaters[i].clipW = clips[i].clipW;
    floaters[i].clipH = clips[i].clipH;

    floaters[i].clipX = clips[i].clipX;
    floaters[i].clipY = clips[i].clipY;

    let mul = Math.floor(Math.random() * 2);
    if (mul == 0) mul = -1;
    let moveSpeed = Math.floor(Math.random() * 80) + 20;
    floaters[i].vx = moveSpeed * scaleX * mul;
    floaters[i].vy = -60 * scaleY;
    floaters[i].density = waterInfo.y - floaters[i].density;
}

function generateFloater(i) {
    if (floaters.length < 7) {
        let depth = Math.floor(Math.random() * 15) + 5;

        // let rng = Math.floor(Math.random() * 2);
        let rng = 3;
        // let frames = projSpriteInfo[rng].frames;
        let frames = 31;

        let frame = Math.floor(Math.random() * frames);
        let key = projSpriteInfo[rng].key;

        let proj = new Spirte(canvas.width / 2, canvas.height + projDimY * depth, projDimX, projDimY, projSpriteInfo[rng].cw, projSpriteInfo[rng].ch, key);
        proj.clipX = frame * projSpriteInfo[rng].cw;

        // let proj = new Spirte(canvas.width / 2, canvas.height + clips[i].h * depth, clips[i].w, clips[i].h, clips[i].clipW, clips[i].clipH, i);
        // proj.clipX = clips[i].clipX;
        // proj.clipY = clips[i].clipY;
        let mul = Math.floor(Math.random() * 2);
        if (mul == 0) mul = -1;
        let moveSpeed = Math.floor(Math.random() * 80) + 20;
        proj.vx = moveSpeed * scaleX * mul;
        proj.vy = -60 * scaleY;
        proj.density = waterInfo.y - proj.density;
        floaters.push(proj);
    }
   
}

function generateFloaters() {
    for (let i = 0; i < 6; ++i) {
        let depth = Math.floor(Math.random() * 15) + 5;
        let proj = new Spirte(canvas.width / 2, canvas.height + clips[i].h * depth, clips[i].w, clips[i].h, clips[i].clipW, clips[i].clipH, i);
        proj.clipX = clips[i].clipX;
        proj.clipY = clips[i].clipY;
        let mul = Math.floor(Math.random() * 2);
        if (mul == 0) mul = -1;
        let moveSpeed = Math.floor(Math.random() * 80) + 20;
        proj.vx = moveSpeed * scaleX * mul;
        proj.vy = -60 * scaleY;
        proj.density = waterInfo.y - proj.density;
        floaters.push(proj);
    }
}

function drawFloaters() {
    for (let i = 0; i < floaters.length; ++i) {
        floaters[i].draw(ctx, images[floaters[i].id].obj.img);
        floaters[i].floatAnim(delta);

        if (floaters[i].x < 0 || floaters[i].x > canvas.width) floaters[i].vx *= -1;

        if (floaters[i].y < floaters[i].density) {
            floaters[i].vy = 0;
        }
    }
}

function drawExplosionStar(x, y) {
    // ctx.drawImage(images.explosion_star.obj.img, 0, 0, explosionStarInfo.cw, explosionStarInfo.ch, x, y, explosionStarInfo.w, explosionStarInfo.h);
    // ctx.drawImage(images.boom.obj.img, 0, 0, explosionStarInfo.cw, explosionStarInfo.ch, x, y, explosionStarInfo.w, explosionStarInfo.h);
    ouchT = 1;
    ouchT2 = 0;
    ouchInfo.x = x;
    ouchInfo.y = y;
}

function initAnimateCanon(idx) {
    canons.index[idx].x = canons.index[idx].ox;
    canons.index[idx].y = canons.index[idx].oy;
    canons.index[idx].w = canons.index[idx].ow;
    canons.index[idx].h = canons.index[idx].oh;
    canons.index[idx].t2 = 0;
    canons.index[idx].startAnimation = true;
}

function animateCanons() {
    // if (i == 0) {
    for (let i = 0; i < canons.index.length; ++i) {
        if (canons.index[i].t2 > -5) {
            canons.index[i].t2 -= 20 * delta;
            let spring = Math.sin(canons.index[i].t2) * 5;
            canons.index[i].y += spring;
            canons.index[i].h += -spring;
            canons.index[i].w += spring;
        }
    }
    // }
}

function initStartPage() {
    for (let k in startPageInfo) {
        startPageInfo[k].x *= scaleX;
        startPageInfo[k].y *= scaleY;
        startPageInfo[k].w *= scaleX;
        startPageInfo[k].h *= scaleY;
    }
    startPageInfo.startmine.ox *= scaleX;
    startPageInfo.startmine.oy *= scaleY;

    startPageInfo.title.x = canvas.width / 2 - startPageInfo.title.w / 2;
    startPageInfo.beginbutton.x = canvas.width / 2 - startPageInfo.beginbutton.w / 2;
}

function initTopHUD() {
    let isMobile = detectMob();

    if (isMobile) {
        // topHUD.timer.timecircle.w = 75;
        // topHUD.timer.timecircle.h = 75;
        // topHUD.timer.stopwatch.w = 75;
        // topHUD.timer.stopwatch.h = 75;
        // topHUDInfo.timer.progress.h = 30;
        // topHUDInfo.timer.progress.max = 167;
        // topHUDInfo.timer.text.fontsize = 18;
        // topHUDInfo.timer.text.rectSize = 35;
        // topHUDInfo.timer.text.y = 1;

        // (/iPad|iPhone|iPod/).test(navigator.userAgent);
        let sx = 844 / canvas.width;
        // let sy = 390 / canvas.height;

        // topHUDInfo.score.w = 130;
        topHUDInfo.score.h = 75;
        // topHUDInfo.score.pw = 195;
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

    let volumeAdjX = volumeInfo.x + volumeInfo.w + 10 * scaleX;

    topHUDInfo.timer.w = topHUD.timer.timecircle.w / 2 + 100 * scaleX;
    topHUDInfo.timer.progress.h *= scaleX;
    
    topHUDInfo.timer.progress.x = topHUDInfo.w / 2 - topHUDInfo.timer.w / 2 + volumeAdjX + 10 * scaleX;

    // topHUDInfo.timer.x = topHUDInfo.timer.progress.x - topHUD.timer.timecircle.w / 2;
    topHUDInfo.timer.x = volumeAdjX;
    // topHUDInfo.timer.x = 30;
    topHUDInfo.timer.y = topHUDInfo.h / 2 - topHUD.timer.timecircle.h / 2;

    topHUDInfo.timer.progress.y = (topHUDInfo.h / 2 - topHUDInfo.timer.progress.h / 2);
    // topHUDInfo.timer.text.x = topHUDInfo.timer.x + topHUDInfo.timer.text.rectSize * scaleX / 2;
    topHUDInfo.timer.text.x = topHUDInfo.timer.x + topHUDInfo.timer.text.rectSize * scaleX / 2;
    topHUDInfo.timer.text.y += topHUDInfo.timer.y + topHUD.timer.timecircle.h / 2;
    
    topHUDInfo.score.w *= scaleX;
    topHUDInfo.score.h *= scaleY;
    topHUDInfo.score.pw *= scaleX;
    

    let sx = canvas.width / 2 - topHUDInfo.w / 2;
    // topHUDInfo.score.x = sx + (topHUDInfo.w  - topHUDInfo.score.w) / 2;
    // topHUDInfo.score.x = sx + (topHUDInfo.w - topHUDInfo.score.pw) / 2;
    topHUDInfo.score.x = sx + (topHUDInfo.w - 230 * scaleX) / 2;
    topHUDInfo.score.y += topHUDInfo.timer.y;

    topHUDInfo.score.fontX += topHUDInfo.score.x + (topHUDInfo.w - topHUDInfo.score.pw) / 2 + 10 * scaleX;
    topHUDInfo.score.fontY += topHUDInfo.score.y + topHUDInfo.score.h / 2;
    topHUDInfo.score.fontXadj *= scaleX;

    topHUDInfo.life.w *= scaleX;
    topHUDInfo.life.h *= scaleY;
    topHUDInfo.life.pad = 20 * scaleX;
    let lifeW = topHUDInfo.life.pad * 2 + topHUDInfo.life.w * topHUDInfo.life.lives;
    sx = (canvas.width - topHUDInfo.w);
    // topHUDInfo.life.x = sx + (topHUDInfo.w - lifeW) / 2;
    topHUDInfo.life.x = canvas.width - lifeW * 1.15;
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
    // const { w } = topHUDInfo.timer;
    let w = 200 * scaleX;
    let h = 35 * scaleY;
    // const { x, y, h, max } = topHUDInfo.timer.progress;
    const { x, y, max } = topHUDInfo.timer.progress;
    let p = (w * (timer.timer / (maxTimer * 24)));

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
    // const { x, y, w, h, pw } = topHUDInfo.score;
    // // const { x, y, w, pw } = topHUDInfo.score;
    // // let h = 55 * scaleY;
    // // const p = 230 * scaleX;
    // const p = pw;
    // ctx.beginPath();
    // ctx.arc(h / 2 + x, h / 2+ y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
    // ctx.lineTo(p - 2 * h + x, 0 + y);
    // ctx.arc(p - (h / 2) + x, h / 2 + y, h / 2, 3 / 2 * Math.PI,Math.PI / 2);
    // ctx.lineTo(h / 2 + x, h + y);
    // ctx.fillStyle = "#2D3E58";
    // ctx.fill();
    // ctx.strokeStyle = '#fff';
    // ctx.stroke();

    scoreProgressBar.draw(ctx);

    ctx.drawImage(images.compass.obj.img, 0, 0, compassInfo.cw, 
        compassInfo.ch, scoreProgressBar.x + 10 * scaleX, 25 * scaleY, compassInfo.w * 1.25, compassInfo.h * 1.25);

    
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

function muteAllAudio(flag) {
    for (let k in music) {
        music[k].obj.audio.muted = flag;
    }
    
}

function controls() {
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
                if (isBtnClicked(mx, my, {
                    x: volumeInfo.x,
                    y: volumeInfo.y + topHUDInfo.timer.y,
                    w: volumeInfo.w,
                    h: volumeInfo.h
                })) {
                    volumeOn = !volumeOn; 
                    if (volumeOn) {
                        music.bg.obj.audio.currentTime = 0;
                        music.bg.obj.audio.play();

                        music.explosion.obj.audio.currentTime = 0;
                        music.explosion.obj.audio.play();
                    } else {
                        music.bg.obj.audio.pause();
                        music.explosion.obj.audio.pause();
                    }
                } else {
                    splat(mx, my);
                    updateLevel();
                }
                
            } else {
                if (isBtnClicked(mx, my, btnBegin)) {
                    gameStart = true;

                    
                    music.bg.obj.audio.volume = 0.01;
                    music.bg.obj.audio.loop = true;
                    // music.bg.obj.audio.play();

                    music.explosion.obj.audio.volume = 0.2;
                    music.explosion.obj.audio.loop = true;
                    // music.explosion.obj.audio.play();

                    if (volumeOn) {
                        music.bg.obj.audio.play();
                        music.explosion.obj.audio.play();
                    }
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
                if (isBtnClicked(mx, my, {
                    x: volumeInfo.x,
                    y: volumeInfo.y + topHUDInfo.timer.y,
                    w: volumeInfo.w,
                    h: volumeInfo.h
                })) {
                    volumeOn = !volumeOn; 
                    if (volumeOn) {
                        music.bg.obj.audio.currentTime = 0;
                        music.bg.obj.audio.play();

                        music.explosion.obj.audio.currentTime = 0;
                        music.explosion.obj.audio.play();
                    } else {
                        music.bg.obj.audio.pause();
                        

                        music.explosion.obj.audio.pause();
                        // music.explosion.obj.volume = 0;

                        // music.correct.obj.volume = 0;
                    }
                } else {
                    // updateDifficulty();
                    splat(mx, my);
                    updateLevel();
                }
            } else {
                if (isBtnClicked(mx, my, btnBegin)) {
                    gameStart = true;

                    music.bg.obj.audio.volume = 0.5;
                    music.bg.obj.audio.loop = true;
                    // music.bg.obj.audio.play();

                    music.explosion.obj.audio.volume = 0.8;
                    music.explosion.obj.audio.loop = true;
                    // music.explosion.obj.audio.play();

                    if (volumeOn) {
                        music.bg.obj.audio.play();
                        music.explosion.obj.audio.play();
                    }
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
                    // resetGame();
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
        clips[i].w *= scaleX * scaleProj;
        clips[i].h *= scaleY * scaleProj;
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
        id: 'bombs'
    }

    cannonCollisionBubble[1] = {
        x: canons.black.left.lower.x + canons.black.left.lower.w - dradius,
        y: canons.black.left.lower.y + dradius,
        id: 'bombs'
    }

    cannonCollisionBubble[2] = {
        x: canons.black.right.upper.x + dradius,
        y: canons.black.right.upper.y + dradius,
        id: 'bombs'
    }

    cannonCollisionBubble[3] = {
        x: canons.black.right.lower.x + dradius,
        y: canons.black.right.lower.y + dradius,
        id: 'bombs'
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
        // console.log('level up');
    }
}

function updateDifficulty() {
    let cols = [0, 1, 2, 3];
    // for (let i = 0; i < difficulty.length; ++i) {
    //     if (difficulty[i] < 1) {
    //         cols.push(i);
    //     }
    // }

    if (cols.length > 0) {
        let rng = Math.floor(Math.random() * cols.length);
        difficulty[rng] += 0.2;
        difficultyAdj[rng] += 0.2;
        if (difficultyAdj[rng] > 2) difficultyAdj[rng] = 2;
        // console.log('test', difficulty[rng])
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
                // if (projectiles[i].clipY != projectiles[j].clipY) {
                // if ((projectiles[i].id != 'bombs' && projectiles[j].id == 'bombs') || (projectiles[i].id == 'bombs' && projectiles[j].id != 'bombs')) {
                if ((projectiles[i].currFrame < 31 && projectiles[j].currFrame > 30) || (projectiles[i].currFrame > 30 && projectiles[j].currFrame < 31)) {
                    // console.log('collision detected');
                    drawExplosionStar(projectiles[i].x, projectiles[i].y);
                    if (volumeOn) {
                        music.ouch.obj.audio.pause();
                        music.ouch.obj.audio.currentTime = 0;
                        music.ouch.obj.audio.play();
                    }
                    
                    resetProjectile([i, j]);
                    initAnimateCanon(i);
                    initAnimateCanon(j);
                    
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
        initAnimateCanon(0);
    }

    if (isCollided(projectiles[1], cannonCollisionBubble[2]) || isCollided(projectiles[1], cannonCollisionBubble[3])) {
        resetProjectile([1]);
        score += CANON_COLLISION_MINUS;
        initAnimateCanon(1);
    }

    if (isCollided(projectiles[2], cannonCollisionBubble[0]) || isCollided(projectiles[2], cannonCollisionBubble[1])) {
        resetProjectile([2]);
        score += CANON_COLLISION_MINUS;
        initAnimateCanon(2);
    }

    if (isCollided(projectiles[3], cannonCollisionBubble[0]) || isCollided(projectiles[3], cannonCollisionBubble[1])) {
        resetProjectile([3]);
        score += CANON_COLLISION_MINUS;
        initAnimateCanon(3);
    }
}

function updateSprite(idx) {
//     let c = Math.floor(Math.random() * clips.length);
//     projectiles[idx].updateSprite(clips[c].w, clips[c].h, clips[c].clipW, clips[c].clipH, clips[c].clipX, clips[c].clipY, c);
    // let rng = Math.floor(Math.random() * 3);
    let rng = 3;
    let frames = projSpriteInfo[rng].frames;

    let frame = Math.floor(Math.random() * frames);
    let key = projSpriteInfo[rng].key;

    projectiles[idx].updateSprite(projDimX, projDimY, 
        projSpriteInfo[rng].cw, projSpriteInfo[rng].ch, frame * projSpriteInfo[rng].cw, 0, key);

    projectiles[idx].currFrame = frame;
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
            // if (projectiles[i].clipY > 0) {
            // if (projectiles[i].id == 'bombs') {
            if (projectiles[i].currFrame > 30) {
                // console.log('ouch!');
                score += OUCH_MINUS;
                reduceHP();
                if (volumeOn) {
                    music.ouch.obj.audio.pause();
                    music.ouch.obj.audio.currentTime = 0;
                    music.ouch.obj.audio.play();
                }
                
                ouchT = 1;
                ouchT2 = 0;
                ouchInfo.x = projectiles[i].x;
                ouchInfo.y = projectiles[i].y;
            } else {
                // console.log('splatted!');
                // kaboomT = 0.15;
                kaboomT = 1;
                kaboomT2 = 0;
                kaboomInfo.x = projectiles[i].x;
                kaboomInfo.y = projectiles[i].y;
                score += SPLAT_POINTS;
                if (volumeOn) {
                    music.score.obj.audio.pause();
                    music.score.obj.audio.currentTime = 0;
                    music.score.obj.audio.play();
                }
            }
            resetProjectile([i]);
            initAnimateCanon(i);
            break;
        }
    }
}

function isSplatted(p1, p2) {
    // let dx = (p1.x + p1.w / 2) - p2.x;
    // let dy = (p1.y + p1.h / 2) - p2.y;
    // let dist = Math.sqrt(dx * dx + dy * dy);
    // return dist < 20;

    let w = p1.w * 1.5;
    
    if (p1.currFrame > 30) w = p1.w;

    // return (p2.x >= p1.x - 10 && p2.x <= p1.x + p1.w - 10 && p2.y >= p1.y - 10 && p2.y <= p1.y + p1.h - 10);
    // return (p2.x + w >= p1.x && p2.x <= p1.x + p1.w);
    return circleCollision(p1.x, p1.y, w, p2.x, p2.y, w);

    // circleCollision
}

function circleCollision(p1x, p1y, r1, p2x, p2y, r2) {
    var a = r1 + r2;
    var x = p1x - p2x;
    var y = p1y - p2y;
  
    if (a > Math.sqrt((x * x) + (y * y))) {
      return true;
    } else {
      return false;
    }
  }

function rescale(obj) {
    console.log(obj.x, obj.y, obj.w, obj.h);
    obj.x *= scaleX;
    obj.y *= scaleY;
    obj.w *= scaleX;
    obj.h *= scaleY;

    obj.ox = obj.x;
    obj.oy = obj.y;
    obj.ow = obj.w;
    obj.oh = obj.h;

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
    let percent = timer.timer / (maxTimer * 24) * 100;
    timeProgressBar.update(delta, percent);

    if (timer.timer <= 0) {
        canReset = true;
        gameover = true;
    }

    moveClouds();

    if (kaboomT > 0) {
        kaboomT -= 1 * delta;
        if (kaboomT <= 0) kaboomT = 0;
    }

    if (ouchT > 0) {
        ouchT -= 1 * delta;
        if (ouchT <= 0) ouchT = 0;
    }
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

                drawFloaters();

                ctx.beginPath();
                ctx.fillStyle = '#70D2ED';
                ctx.rect(0, waterInfo.y, canvas.width, waterInfo.h);
                ctx.fill();

                drawClouds();
                // drawProgress();
                timeProgressBar.draw(ctx);
                drawTopHUD();
                
                drawScoreHUD();
                drawLives();

                let volumeKey = 'mute';
                if (volumeOn) {
                    volumeKey = 'volume';
                }

                ctx.drawImage(images[volumeKey].obj.img, 0, 0, volumeInfo.cw, 
                    volumeInfo.ch, volumeInfo.x, volumeInfo.y + topHUDInfo.timer.y, volumeInfo.w, volumeInfo.h);


                

                // lands
                ctx.drawImage(images.landLeft.obj.img, 0, 0, 157, 206, images.landLeft.x, images.landLeft.y, images.landLeft.w, images.landLeft.h);
                ctx.drawImage(images.landRight.obj.img, 0, 0, 157, 206, images.landRight.x, images.landRight.y, images.landRight.w, images.landRight.h);

                

                for (let i = 0; i < projectiles.length; ++i) {
                    if (difficulty[i] > 0) {
                        // projectiles[i].draw(ctx, images.projectile.obj.img);
                        projectiles[i].dive(ctx, images[projectiles[i].id].obj.img);
                        let r = projectiles[i].update(delta * difficulty[i], g, projectileRanges);
                        
                        if (r) {
                            // difficulty[i] = Math.floor(Math.random() * 100) / 100 + 0.2 + difficultyAdj[i];
                            difficulty[i] = Math.floor(Math.random() * 100) / 100 + 0.2;
                            // difficulty[i] += 0.2;
                            updateSprite(i);
                            initAnimateCanon(i);

                            if (i < 6) {
                                generateFloater(i);
                            }
                            
                            // if (i == 0) {
                            //     canons.black.left.upper.x = canons.black.left.upper.ox;
                            //     canons.black.left.upper.y = canons.black.left.upper.oy;
                            //     canons.black.left.upper.w = canons.black.left.upper.ow;
                            //     canons.black.left.upper.h = canons.black.left.upper.oh;
                            //     canons.black.left.upper.t2 = 0;
                            // }
                            
                        }
                    }
                }

                if (kaboomT) {
                    kaboomT2 += 10 * delta;
                    let adjx = Math.sin(kaboomT2) * 50;
                    let adjx2 = adjx / 2;
                    let frame = Math.floor(kaboomT2) % 10;
                    // ctx.drawImage(images.scoreboom.obj.img, 0, 0, kaboomInfo.cw, kaboomInfo.ch, kaboomInfo.x - adjx2, kaboomInfo.y - adjx2, kaboomInfo.w + adjx, kaboomInfo.h + adjx);
                    ctx.drawImage(images.scoreboom.obj.img, frame * kaboomInfo.cw, 0, kaboomInfo.cw, kaboomInfo.ch, kaboomInfo.x, kaboomInfo.y, kaboomInfo.w, kaboomInfo.h);
                    
                }

                if (ouchT) {
                    ouchT2 += 10 * delta;
                    
                    let frame = Math.floor(ouchT2) % 10;
                    // ctx.drawImage(images.ouch.obj.img, 0, 0, ouchInfo.cw, ouchInfo.ch, ouchInfo.x, ouchInfo.y, ouchInfo.w, ouchInfo.h);
                    ctx.drawImage(images.boom.obj.img, frame * ouchInfo.cw, 0, ouchInfo.cw, ouchInfo.ch, ouchInfo.x, ouchInfo.y, ouchInfo.w, ouchInfo.h);
                }

                // canons
                canons.draw();
                // animateCanons();
                // if (canons.black.left.upper.t2 > -5) {
                //     canons.black.left.upper.t2 -= 20 * delta;
                //     let spring = Math.sin(canons.black.left.upper.t2) * 5;
                //     canons.black.left.upper.y += spring;
                //     canons.black.left.upper.h += -spring;
                //     canons.black.left.upper.w += spring;
                // }
                

                // canons.black.left.lower.draw(ctx, images.blackCanonLeft.obj.img);
                // canons.black.right.upper.draw(ctx, images.blackCanonRight.obj.img);
                // canons.black.right.lower.draw(ctx, images.blackCanonRight.obj.img);

                // drawExplosionStar(canvas.width / 2, canvas.height / 2);
                // drawExplosionStar(0, 0);

                checkProjectileCollisions();
                checkCanonCollisions();
                // displayScore();
                update();
            } else {
                let handx = Math.sin(startScreenHandAnimT) * 20;
                let handy = Math.cos(startScreenHandAnimT) * 20;
                // let handTapX = Math.cos(startScreenHandAnimT) * 2;
                // let handTapY = Math.sin(startScreenHandAnimT) * 2;
                // ctx.drawImage(images.splash.obj.img, 0, 0, 927, 429, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(images.sky.obj.img, 0, 0, 926, 429, 0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                ctx.fillStyle = '#70D2ED';
                ctx.rect(0, waterInfo.y, canvas.width, waterInfo.h);
                ctx.fill();
                drawClouds();

                // lands
                ctx.drawImage(images.landLeft.obj.img, 0, 0, 157, 206, images.landLeft.x, images.landLeft.y, images.landLeft.w, images.landLeft.h);
                ctx.drawImage(images.landRight.obj.img, 0, 0, 157, 206, images.landRight.x, images.landRight.y, images.landRight.w, images.landRight.h);

                // canons
                canons.draw();

                let frame = Math.floor(startScreenHandAnimT) % 8;
                
                ctx.drawImage(images.title.obj.img, 0, 0, startPageInfo.title.cw, startPageInfo.title.ch, startPageInfo.title.x, startPageInfo.title.y, startPageInfo.title.w, startPageInfo.title.h);
                ctx.drawImage(images.hand.obj.img, frame * startPageInfo.hand.cw, 0, startPageInfo.hand.cw, startPageInfo.hand.ch, startPageInfo.hand.x, startPageInfo.hand.y, startPageInfo.hand.w, startPageInfo.hand.h);
                // tap
                // ctx.save();
                // // Untransformed draw position
                // const position = {x: startPageInfo.hand.x, y: startPageInfo.hand.y};
                // // In degrees
                // const rotation = { x: 0, y: Math.sin(startScreenHandAnimT) * 35, z: 0};
                // // Rotation relative to here (this is the center of the image)
                // const rotPt = { x: startPageInfo.hand.w / 2, y: startPageInfo.hand.h / 2 };

                // ctx.setTransform(new DOMMatrix()
                //     .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
                //     .rotateSelf(rotation.x, rotation.y, rotation.z)
                // );
                
                // ctx.drawImage(images.hand.obj.img, 0, 0, startPageInfo.hand.cw, startPageInfo.hand.ch, -rotPt.x, -rotPt.y, startPageInfo.hand.w, startPageInfo.hand.h);
                // ctx.restore();
                //
                
                ctx.drawImage(images.startballoon.obj.img, 0, 0, startPageInfo.startballoon.cw, startPageInfo.startballoon.ch, startPageInfo.startballoon.x + handx, startPageInfo.startballoon.y + handy, startPageInfo.startballoon.w, startPageInfo.startballoon.h);
                //
                    ctx.save();

                    // move to the center of the canvas
                    ctx.translate(startPageInfo.startmine.ox + startPageInfo.startmine.w / 2, startPageInfo.startmine.oy + startPageInfo.startmine.h / 2);
                    
                    let degrees = Math.sin(startPulseT * 10) * 15;
                    // rotate the canvas to the specified degrees
                    ctx.rotate(degrees * Math.PI/180);

                    // draw the image
                    startPageInfo.startmine.x = -0.5 * startPageInfo.startmine.w;
                    startPageInfo.startmine.y = -0.5 * startPageInfo.startmine.h;

                    ctx.drawImage(images.startmine.obj.img, 0, 0, startPageInfo.startmine.cw, startPageInfo.startmine.ch, startPageInfo.startmine.x, startPageInfo.startmine.y, startPageInfo.startmine.w, startPageInfo.startmine.h);
                    // we’re done with the rotating so restore the unrotated context
                    ctx.restore();
                //

                

                for (let i = 1; i < 4; ++i) {
                    let key = 'text' + i;
                    ctx.drawImage(images[key].obj.img, 0, 0, startPageInfo[key].cw, startPageInfo[key].ch, startPageInfo[key].x, startPageInfo[key].y, startPageInfo[key].w, startPageInfo[key].h);
                }

                ctx.drawImage(images.beginbutton.obj.img, 0, 0, startPageInfo.beginbutton.cw, startPageInfo.beginbutton.ch, startPageInfo.beginbutton.x, startPageInfo.beginbutton.y, startPageInfo.beginbutton.w, startPageInfo.beginbutton.h);
                

                // ctx.beginPath();
                // ctx.rect(btnBegin.x, btnBegin.y, btnBegin.w, btnBegin.h);
                // ctx.stroke();

                if (delta < 1) {
                    startPulseT += 2 * delta;
                    startScreenHandAnimT += 5 * delta;
                }
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
                // drawProgress();
                timeProgressBar.draw(ctx);
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
                // TM.draw(textList.resetMsg.obj);
            }
        }
    }

    requestAnimationFrame(gameCycle);
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);