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
    boom: {
        src: 'sounds/ouch',
        obj: {},
        ext: 'wav',
    },
    ouch: {
        src: 'sounds/spike',
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
        src: 'kaboom_sprite',
        obj: {}
    },
    ouch: {
        src: 'ouch_sprite',
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
    x: 7,
    y: 5,
    w: 55 * 1.5,
    h: 55 * 1.5,
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
    w: 192.167 * 1.5,
    h: 145 * 1.5,
    // w: 48.125 * 3,
    // h: 49 * 3,
    cw: 192.167,
    ch: 145,
   
    // cw: 48.125,
    // ch: 49,
    // cw: 70,
    // ch: 28,
}

var objectBoomInfo = {
    x: 0,
    y: 0,
    // w: 192.167 * 1.5,
    // h: 145 * 1.5,
    w: 68 * 3,
    h: 64 * 3,
    // w: 48.125 * 3,
    // h: 49 * 3,
    // cw: 192.167,
    // ch: 145,
    cw: 68,
    ch: 64,
    // cw: 48.125,
    // ch: 49,
    // cw: 70,
    // ch: 28,
}

var volumeOn = true;

var canons = {
    black: {
        left: {
            upper: new Spirte(0, 310 - 50, 280, 235, 192.11, 145),
            lower: new Spirte(0, 540 - 50, 280, 235, 192.11, 145),
            // upper: new Spirte(0, 310, 285, 225, 636, 504),
            // lower: new Spirte(0, 540, 285, 225, 636, 504),
        },
        right: {
            upper: new Spirte(0, 320 - 50, 280, 235, 192.11, 145),
            lower: new Spirte(0, 540 - 50, 280, 235, 192.11, 145),
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

        canons.black.left.upper.draw(ctx, AM.images.blackcannon.img);
        canons.black.left.lower.draw(ctx, AM.images.blackcannon.img);
        canons.black.right.upper.drawRotate(ctx, AM.images.blackcannon.img);
        canons.black.right.lower.drawRotate(ctx, AM.images.blackcannon.img);

        // canons.black.right.lower.draw(ctx, AM.images.blackCanonRight.img);
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

var radius = 28;
var dradius = radius * 2;
        
const cannonCollisionBubble = [];

var score = 0;
const SPLAT_POINTS = 1;
const OUCH_MINUS = -1;
const PROJECTILE_COLLISION_MINUS = -1;
const CANON_COLLISION_MINUS = -1;
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
        // x: 1113,
        x: 913,
        y: 345,
        ox: 913,
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

var ouchSpriteKey = 'objectboom';

var TXT = null;

var maxDifficultyRange = 50;

var projectileRanges = {
    // x: [200, 300],
    // y: [350, 400]
    x: [340, 350],
    y: [430, 450]
}

var soundGroup = {
    score: [],
    scoreClones: 10,
    scoreCounter: 0
}

const scoreTextInfo = {
    w: 88 * 2.5,
    h: 88 * 2.5,
    cw: 88,
    ch: 88,
}

var scoreTextFrame = 0;
var isObjectCollided = false;

var ouchAnimations = [];
var currOuchIdx = 0;


var HUD = null;

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
const onMobile = isMobile();

var tracks = {};
var trackCounter = 0;

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

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

    if (onMobile && !onTablet) {
        splashInfo.y = 0;
    }

    rescaleSize(startButtonInfo, scaleX, scaleX);
    startButtonInfo.x = w / 2 - startButtonInfo.w / 2;
    if (onTablet) {
        startButtonInfo.y = splashInfo.y + splashInfo.h - 730 * splashInfo.sx;

    } else {
        startButtonInfo.y = splashInfo.y + splashInfo.h - 230 * splashInfo.sx;
    }


    maxDifficultyRange *= scaleX;

    let cols = [0, 1, 2, 3];
    shuffleArr(cols);
    difficulty[cols[0]] = Math.floor(Math.random() * maxDifficultyRange) / 100 + 1.2 * scaleX;
    difficulty[cols[1]] = Math.floor(Math.random() * maxDifficultyRange) / 100 + 1.2 * scaleX;
    difficulty[cols[2]] = Math.floor(Math.random() * maxDifficultyRange) / 100 + 1.2 * scaleX;
    difficulty[cols[3]] = Math.floor(Math.random() * maxDifficultyRange) / 100 + 1.2 * scaleX;
    // 980 452
    // console.log(difficulty)
    
    projDimX *= scaleX;
    projDimY *= scaleX;

    g *= scaleX;

    // alert(scaleX + ', ' + scaleY)

    // if (scaleX > 0.6 && scaleX < 1) {
    //     projectileRanges = {
    //         x: [50, 350],
    //         y: [50, 1000]
    //     }
    // }

    // if (detectMob()) {
    //     projectileRanges = {
    //         x: [50, 300],
    //         y: [50, 700]
    //     }
    // }

    for (let i = 0; i < 5; ++i) {
        ouchAnimations[i] = {
            ouchT: 0,
            ouchT2: 0,
            x: 0,
            y: 0,
            ouchSpriteKey: 'boom'
        }
    }
    

    initStartPage();

    let adjX = (w / 2 - 468 * scaleX / 2) - startPageInfo.hand.x;
    startPageInfo.hand.x += adjX;
    startPageInfo.startmine.x += adjX;
    startPageInfo.startmine.ox = startPageInfo.startmine.x;

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
        // volumeInfo.w = 35;
        // volumeInfo.h = 35;

        // textList.topTimer.desc.weight = 'normal';
        // textList.scoreN.desc.weight = 'normal';

        scoreNAdjY = 2;

        projectileRanges = {
            // x: [300, 500],
            // y: [400, 500]
            x: [350, 400],
            y: [350, 400]
        }
    }

    timer = new Timer(w / 2, 0, 50, '#fb2121');
    timer.setTimer(maxTimer);
    
    projectileRanges.x[0] *= scaleX;
    projectileRanges.x[1] *= scaleX;
    projectileRanges.y[0] *= scaleX;
    projectileRanges.y[1] *= scaleX;

    canvas.style.display = 'block';
    instrucions.style.display = 'none';

    // for (let k in images) {
    //     assets.load(images[k].obj, images[k].src);
    // }

    // for (let k in music) {
    //     sounds.load(music[k].obj, music[k].src, music[k].ext);
    // }

    init();

    

    rescaleSize(compassInfo, scaleX, scaleX);
    rescaleSize(shineInfo, scaleX, scaleX);
    rescaleSize(completeInfo, scaleX, scaleX);
    rescaleSize(scoreTextInfo, scaleX, scaleX);
    rescaleAll(trophyInfo, scaleX, scaleY);
    rescaleAll(waterInfo, scaleX, scaleY);
    rescaleAll(kaboomInfo, scaleX, scaleY);
    rescaleAll(explosionStarInfo, scaleX, scaleY);
    rescaleAll(ouchInfo, scaleX, scaleY);
    rescaleAll(objectBoomInfo, scaleX, scaleY);

    rescaleAll(volumeInfo, scaleX, scaleY);


    initTopHUD();

    waterInfo.y = h - waterInfo.h;

    shineInfo.w *= 2;
    shineInfo.h *= 2;
    shineInfo.x = w / 2 - shineInfo.w / 2;
    shineInfo.y = 200 * scaleY;

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

    // timeProgressBar = new ProgressBar(topHUDInfo.timer.progress.x * scaleX, 30 * scaleY, pbW, pbH);
    timeProgressBar = new ProgressBar(topHUDInfo.timer.x + topHUDInfo.timer.w / 3, volumeInfo.y + volumeInfo.h / 2 - 2 * scaleY, pbW, pbH);
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
    textList.topTimer.obj.tx = topHUDInfo.timer.x + topHUDInfo.timer.w / 2 - 37 * scaleX;
    // textList.topTimer.obj.tx = 45 * scaleX + volumeInfo.x + volumeInfo.w;
    textList.topTimer.obj.ty = volumeInfo.y + volumeInfo.h / 2;
    // textList.topTimer.obj.ty = topHUDInfo.timer.y + topHUD.timer.timecircle.h / 2 - textList.topTimer.desc.h / 2 * scaleY;

    textList.scoreLabel.obj.tx = w / 2 - textList.scoreLabel.desc.w * scaleX / 2 - 13 * scaleX;
    textList.scoreLabel.obj.ty = 450 * scaleY;
    textList.finalScore.obj.tx = w / 2 - textList.finalScore.desc.w * scaleX / 2 - 8 * scaleX;
    textList.finalScore.obj.ty = 490 * scaleY;
    textList.resetMsg.obj.tx = w / 2 - textList.resetMsg.desc.w / 2 * scaleX - 20 * scaleX;
    textList.resetMsg.obj.ty = h / 2 - textList.resetMsg.desc.h / 2 * scaleY + 20 * scaleX;

    rescaleSize(bgInfo.cloud1, scaleX, scaleX);
    rescalePos(bgInfo.cloud1, scaleX, scaleY);

    rescaleSize(bgInfo.cloud2, scaleX, scaleX);
    rescalePos(bgInfo.cloud2, scaleX, scaleY);

    rescaleSize(bgInfo.cloud3, scaleX, scaleX);
    rescalePos(bgInfo.cloud3, scaleX, scaleY);

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
    projectiles[0].init(projectileRanges, scaleX);

    c = Math.floor(Math.random() * clips.length);
    projectiles[1] = new Spirte(canons.black.left.upper.w - 100 * scaleX, canons.black.left.lower.y, clips[c].w, clips[c].h, clips[c].clipW, clips[c].clipH, c);
    // projectiles[1].clipX = clips[c].clipX;
    // projectiles[1].clipY = clips[c].clipY;
    projectiles[1].init(projectileRanges, scaleX);

    c = Math.floor(Math.random() * clips.length);
    projectiles[2] = new Spirte(canons.black.right.upper.x, canons.black.left.upper.y, clips[c].w, clips[c].h, clips[c].clipW, clips[c].clipH, c);
    // projectiles[2].clipX = clips[c].clipX;
    // projectiles[2].clipY = clips[c].clipY;
    projectiles[2].direction = -1;
    projectiles[2].init(projectileRanges, scaleX);

    c = Math.floor(Math.random() * clips.length);
    projectiles[3] = new Spirte(canons.black.right.upper.x, canons.black.left.lower.y, clips[c].w, clips[c].h, clips[c].clipW, clips[c].clipH, c);
    // projectiles[3].clipX = clips[c].clipX;
    // projectiles[3].clipY = clips[c].clipY;
    projectiles[3].direction = -1;
    projectiles[3].init(projectileRanges, scaleX);

    projectiles[0].zRotate = 0;
    projectiles[1].zRotate = 0;
    projectiles[2].zRotate = 180;
    projectiles[3].zRotate = 180;

    updateSprite(0);
    updateSprite(1);
    updateSprite(2);
    updateSprite(3);

    HUD = new Template_1(ctx, w, h, scaleX, scaleY, splashInfo);
    

    // generateFloaters();

    controls();

    setCloudSpeed(30);

    TXT = new Text(ctx, w, h); 
    TXT.setScale(scaleX, scaleY);
    let leftAdj = startPageInfo.hand.w / 2 - 280 * scaleX / 2;
    TXT.addText('instruction1', 'Tap the squishy objects', 'normal', 20, 'Montserrat', startPageInfo.hand.x + leftAdj, startPageInfo.hand.y + 140 * scaleY, 280, 30, '#0a1010', false); 
    let centerX = 280 / 2 - 170 / 2;
    TXT.addText('instruction1_2', 'to splat them.', 'normal', 20, 'Montserrat', startPageInfo.hand.x + centerX * scaleX + leftAdj, startPageInfo.hand.y + 175 * scaleY, 170, 30, '#0a1010', false); 
    
    leftAdj = startPageInfo.startmine.w / 2 - 170 * scaleX / 2;
    TXT.addText('instruction2', "Don't poke the", 'normal', 20, 'Montserrat', startPageInfo.startmine.x + leftAdj, startPageInfo.hand.y + 140 * scaleY, 170, 30, '#0a1010', false); 
    centerX = 170 / 2 - 170 / 2;
    TXT.addText('instruction2_2', 'pokey objects!', 'normal', 20, 'Montserrat', startPageInfo.startmine.x + centerX * scaleX + leftAdj, startPageInfo.hand.y + 175 * scaleY, 170, 30, '#0a1010', false); 
    

    for (let i = 0; i < soundGroup.scoreClones; ++i) {
        soundGroup.score.push(AM.audio.score.img.cloneNode());
    }
    for (let i = 0; i < soundGroup.scoreClones; ++i) {
        tracks[trackCounter] = audioContext.createMediaElementSource(soundGroup.score[i]);
        tracks[trackCounter].connect(audioContext.destination);
        trackCounter++;
    }
    
    
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
        floaters[i].draw(ctx, AM.images[floaters[i].id].img);
        floaters[i].floatAnim(delta);

        if (floaters[i].x < 0 || floaters[i].x > canvas.width) floaters[i].vx *= -1;

        if (floaters[i].y < floaters[i].density) {
            floaters[i].vy = 0;
        }
    }
}

function drawExplosionStar(x, y) {
    // ctx.drawImage(AM.images.explosion_star.img, 0, 0, explosionStarInfo.cw, explosionStarInfo.ch, x, y, explosionStarInfo.w, explosionStarInfo.h);
    // ctx.drawImage(AM.images.boom.img, 0, 0, explosionStarInfo.cw, explosionStarInfo.ch, x, y, explosionStarInfo.w, explosionStarInfo.h);
    ouchT = 1;
    ouchT2 = 0;
    ouchInfo.x = x;
    ouchInfo.y = y;

    ouchAnimations[currOuchIdx] = {
        ouchT: 1,
        ouchT2: 0,
        x: x,
        y: y,
        ouchSpriteKey: 'objectboom'
    };

    currOuchIdx = (currOuchIdx + 1) % ouchAnimations.length;
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
    let progressX = 10;
    if (isMobile) {
        progressX = 30;
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

    rescaleSize(topHUD.timer.timecircle, scaleX, scaleY);
    rescaleSize(topHUD.timer.stopwatch, scaleX, scaleY);
    // rescaleSize(topHUD.score.turtleshine);
    rescaleAll(topHUD.score.turtleshine, scaleX, scaleY);
    rescaleSize(topHUDInfo, scaleX, scaleY);

    let volumeAdjX = volumeInfo.x + volumeInfo.w + 10 * scaleX;

    topHUDInfo.timer.w = topHUD.timer.timecircle.w / 2 + 100 * scaleX;
    topHUDInfo.timer.progress.h *= scaleX;
    
    topHUDInfo.timer.progress.x = topHUDInfo.w / 2 - topHUDInfo.timer.w / 2 + volumeAdjX + progressX * scaleX;

    // topHUDInfo.timer.x = topHUDInfo.timer.progress.x - topHUD.timer.timecircle.w / 2;
    topHUDInfo.timer.x = volumeAdjX;
    // topHUDInfo.timer.x = 30;
    topHUDInfo.timer.y = volumeInfo.y + 15 * scaleY;
    // topHUDInfo.timer.y = topHUDInfo.h / 2 - topHUD.timer.timecircle.h / 2;

    // topHUDInfo.timer.progress.y = (topHUDInfo.h / 2 - topHUDInfo.timer.progress.h / 2);
    topHUDInfo.timer.progress.y = topHUDInfo.timer.y + (topHUDInfo.timer.h / 2 - topHUDInfo.timer.progress.h / 2);
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
    topHUDInfo.life.h *= scaleX;
    topHUDInfo.life.pad = 20 * scaleX;
    let lifeW = topHUDInfo.life.pad * 2 + topHUDInfo.life.w * topHUDInfo.life.lives;
    sx = (canvas.width - topHUDInfo.w);
    // topHUDInfo.life.x = sx + (topHUDInfo.w - lifeW) / 2;
    topHUDInfo.life.x = canvas.width - lifeW * 1.15;
    topHUDInfo.life.y += topHUDInfo.timer.y;
}

function drawTopHUD() {
    const { x, y, w, h } = topHUDInfo.timer;
    
    ctx.drawImage(AM.images.timecircle.img, 0, 0, topHUD.timer.timecircle.cw, 
        topHUD.timer.timecircle.ch, x, y, topHUD.timer.timecircle.w, topHUD.timer.timecircle.h);

    ctx.drawImage(AM.images.stopwatch.img, 0, 0, topHUD.timer.stopwatch.cw, 
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

    ctx.drawImage(AM.images.compass.img, 0, 0, compassInfo.cw, 
        compassInfo.ch, scoreProgressBar.x + 10 * scaleX, 25 * scaleY, compassInfo.w * 1.25, compassInfo.h * 1.25);

    
    TM.draw(textList.scoreX.obj);
    score = Math.max(0, score);
    textList.scoreN.obj.str = zeroPad(score, 2);
    TM.draw(textList.scoreN.obj);

    
}

function drawLives() {
    const { x, y, cw, ch, w, h, pad } = topHUDInfo.life;
    
    for (let i = 0; i < lives; ++i) {
        ctx.drawImage(AM.images.life.img, 0, 0, cw, ch, x + i * w + i * pad, y, w, h);
    }
    
}

function drawClouds() {
    for (let i = 1; i < 4; ++i) {
        let key = 'cloud' + i;
        ctx.drawImage(AM.images[key].img, 0, 0, bgInfo[key].cw, bgInfo[key].ch, 
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
                // console.log('test', )
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

// function zeroPad(num, places) {
//     return String(num).padStart(places, '0');
// }


// function rescaleSize(obj) {
//     obj.w *= scaleX;
//     obj.h *= scaleY;
// }

// function rescaleAll(obj) {
//     obj.x *= scaleX;
//     obj.y *= scaleY;
//     obj.w *= scaleX;
//     obj.h *= scaleY;
// }

function muteAllAudio(flag) {
    for (let k in music) {
        AM.audio[k].img.muted = flag;
    }
    
}

function playAllAudio() {
    for (let k in AM.audio) {
        tracks[trackCounter] = audioContext.createMediaElementSource(AM.audio[k].img);
        tracks[trackCounter].connect(audioContext.destination);
        trackCounter++;

        // if (k != 'bg' && k != 'explosion') {
        //     AM.audio[k].img.volume = 0;
        //     AM.audio[k].img.currentTime = 0;
        //     AM.audio[k].img.play();
        //     // AM.audio[k].img.pause();
            
        // }
    }
    
}

function submitScore() {
    let timeSpent = maxTimer - Math.floor(timer.timer / 24);
    let result = {'game_score': score.toFixed(2), 'activity_id': serverData.id, 'time_spent': timeSpent};
    Vue.prototype.$postData(result, true);
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
        if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
            var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
            var touch = evt.touches[0] || evt.changedTouches[0];
            let mx = touch.pageX;
            let my = touch.pageY;
            if (!mDown) {
                mDown = true;

                // if (gameStart) {
                //     splat(mx, my);
                //     updateLevel();
                // } else {
                //     if (isBtnClicked(mx, my, btnBegin)) {
                //         gameStart = true;
                //     }
                // }

                // mDown = true;
                if (gameover) {
                    if (isBtnClicked(mx, my, HUD.endscreenButtons)) {
                        submitScore();
                    }
                } else if (gameStart) {
                    
                    if (isBtnClicked(mx, my, HUD.volume)) {
                        HUD.volumeOn = !HUD.volumeOn;  
                        if (HUD.volumeOn) {
                            AM.audio.bg.img.currentTime = 0;
                            AM.audio.bg.img.play();

                            AM.audio.explosion.img.currentTime = 0;
                            AM.audio.explosion.img.play();
                        } else {
                            AM.audio.bg.img.pause();
                            AM.audio.explosion.img.pause();
                        }

                        
                    } else {
                        splat(mx, my);
                        updateLevel();
                    }
                    
                } else {
                    // if (isBtnClicked(mx, my, btnBegin)) {
                    if (isBtnClicked(mx, my, startButtonInfo)) {
                        playAllAudio();
                        // if (audioContext.state === "suspended") {
                        //     audioContext.resume();
                        // }

                        gameStart = true;

                        AM.audio.bg.img.volume = 0.5;
                        AM.audio.bg.img.loop = true;
                        // AM.audio.bg.img.play();

                        AM.audio.explosion.img.volume = 0.8;
                        AM.audio.explosion.img.loop = true;
                        // AM.audio.explosion.img.play();

                        // playAllAudio();

                        if (HUD.volumeOn) {
                            AM.audio.bg.img.play();
                            AM.audio.explosion.img.play();
                        }
                    }
                }

                
            }
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
            mDown = true;

            if (gameover) {
                if (isBtnClicked(mx, my, HUD.endscreenButtons)) {
                    submitScore();
                }
            } else if (gameStart) {
                if (isBtnClicked(mx, my, HUD.volume)) {
                    HUD.volumeOn = !HUD.volumeOn; 
                    if (HUD.volumeOn) {
                        AM.audio.bg.img.currentTime = 0;
                        AM.audio.bg.img.play();

                        AM.audio.explosion.img.currentTime = 0;
                        AM.audio.explosion.img.play();
                    } else {
                        AM.audio.bg.img.pause();
                        

                        AM.audio.explosion.img.pause();
                        // music.explosion.obj.volume = 0;

                        // music.correct.obj.volume = 0;
                    }
                } else {
                    // updateDifficulty();
                    splat(mx, my);
                    updateLevel();
                }
            } else {
                // if (isBtnClicked(mx, my, btnBegin)) {
                if (isBtnClicked(mx, my, startButtonInfo)) {
                    if (audioContext.state === "suspended") {
                        audioContext.resume();
                    }

                    gameStart = true;

                    AM.audio.bg.img.volume = 0.5;
                    AM.audio.bg.img.loop = true;
                    // AM.audio.bg.img.play();

                    AM.audio.explosion.img.volume = 0.8;
                    AM.audio.explosion.img.loop = true;
                    // AM.audio.explosion.img.play();

                    if (HUD.volumeOn) {
                        AM.audio.bg.img.play();
                        AM.audio.explosion.img.play();
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

    let adjY = onTablet ? 340 : 240;
    let adjY2 = onTablet ? 325 : 230;

    canons.black.left.upper.y = images.landLeft.y - canons.black.left.upper.h * 0.85;
    canons.black.left.lower.y = canons.black.left.upper.y + adjY * splashInfo.sx;

    canons.black.left.upper.oy = canons.black.left.upper.y
    canons.black.left.lower.oy = canons.black.left.lower.y

    canons.black.right.upper.y = images.landRight.y - canons.black.right.upper.h * 0.85;
    canons.black.right.lower.y = canons.black.right.upper.y + adjY2 * splashInfo.sx;

    canons.black.right.upper.oy = canons.black.right.upper.y;
    canons.black.right.lower.oy = canons.black.right.lower.y;

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
        // updateDifficulty();
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
        difficulty[rng] += 1.2 * scaleX;
        difficultyAdj[rng] += 1.2 * scaleX;
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
                    // ouchSpriteKey = 'objectboom';

                    if (volumeOn) {
                        // AM.audio.boom.img.pause();
                        // AM.audio.boom.img.currentTime = 0;
                        // AM.audio.boom.img.play();

                        setTimeout(() => {
                            AM.audio.boom.img.currentTime = 0;
                            AM.audio.boom.img.volume = 0.5;
                            AM.audio.boom.img.play();
                        }, 20)
                    }

                    resetProjectile([i, j]);
                    initAnimateCanon(i);
                    initAnimateCanon(j);
                    
                    score += PROJECTILE_COLLISION_MINUS;
                    score = Math.max(score, 0);
                    HUD.updateScoreSprite(zeroPad(score, 2));
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

    score = Math.max(score, 0);
    HUD.updateScoreSprite(zeroPad(score, 2));
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
        projectiles[idx].init(projectileRanges, scaleX);
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
        score = Math.max(score, 0);
        HUD.updateGameoverScore(splashInfo, zeroPad(score, 2));
    }
}

function splat(mx, my) {
    let idx = -1;
    let minDist = Infinity;
    for (let i = 0; i < projectiles.length; ++i) {
        if (isSplatted(projectiles[i], { x: mx, y: my })) {
            let dx = projectiles[i].x - mx;
            let dy = projectiles[i].y - my;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (minDist > dist) {
                idx = i;
                minDist = dist;
            }
            
            // if (projectiles[i].clipY > 0) {
            // if (projectiles[i].id == 'bombs') {
            
        }
    }

    if (idx > -1) {
        let i = idx;

        if (projectiles[i].currFrame > 30) {
            // console.log('ouch!');
            score += OUCH_MINUS;
            reduceHP();

            if (projectiles[i].currFrame > 40) {
                ouchSpriteKey = 'ouch';
            } else {
                ouchSpriteKey = 'boom';
            }

            if (volumeOn) {
                // AM.audio[ouchSpriteKey].img.pause();
                // AM.audio[ouchSpriteKey].img.currentTime = 0;
                setTimeout(() => {
                    // AM.audio[ouchSpriteKey].img.pause();
                    AM.audio[ouchSpriteKey].img.currentTime = 0;
                    AM.audio[ouchSpriteKey].img.volume = 0.5;
                    AM.audio[ouchSpriteKey].img.play();
                }, 20)
                // AM.audio[ouchSpriteKey].img.play();
            }
            
            ouchT = 1;
            ouchT2 = 0;

            ouchAnimations[currOuchIdx] = {
                ouchT: 1,
                ouchT2: 0,
                x: projectiles[i].x,
                y: projectiles[i].y,
                ouchSpriteKey: ouchSpriteKey
            }

            currOuchIdx = (currOuchIdx + 1) % ouchAnimations.length;

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

            scoreTextFrame = Math.floor(Math.random() * 10);
            if (volumeOn) {
                // playScore();
                // AM.audio.score.img.pause();
                // AM.audio.score.img.currentTime = 0;
                setTimeout(() => {
                    // AM.audio.score.img.pause();
                    // AM.audio.score.img.currentTime = 0; 
                    // AM.audio.score.img.volume = 0.5; 
                    // AM.audio.score.img.play();
                    let c = soundGroup.scoreCounter;

                    soundGroup.score[c].currentTime = 0; 
                    soundGroup.score[c].volume = 0.5; 
                    soundGroup.score[c].play();

                    soundGroup.scoreCounter = (soundGroup.scoreCounter + 1) % soundGroup.scoreClones;
                }, 0);
                // AM.audio.score.img.play();
            }
        }
        resetProjectile([i]);
        initAnimateCanon(i);

        score = Math.max(score, 0);
        HUD.updateScoreSprite(zeroPad(score, 2));
        // break;
    }
    
}

// makes playing audio return a promise
// function playAudio(audio){
//     return new Promise(res=>{
//       audio.currentTime = 0; 
//       audio.volume = 0.5; 
//       audio.play();
//       audio.onended = res;
//     });
//   }
  
//   // how to call
//   async function playScore() {
//     let c = soundGroup.scoreCounter;

//     // soundGroup.score[c].currentTime = 0; 
//     // soundGroup.score[c].volume = 0.5; 
//     // soundGroup.score[c].play();

//     soundGroup.scoreCounter = (soundGroup.scoreCounter + 1) % soundGroup.scoreClones;
//     await playAudio(soundGroup.score[c]);
//     // code that will run after audio finishes...
//   }

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
    // console.log(obj.x, obj.y, obj.w, obj.h);
    obj.x *= scaleX;
    obj.y *= scaleY;
    obj.w *= scaleX;
    obj.h *= scaleX;

    obj.ox = obj.x;
    obj.oy = obj.y;
    obj.ow = obj.w;
    obj.oh = obj.h;

    // console.log(obj.x, obj.y, obj.w, obj.h);
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
    // let percent = timer.timer / (maxTimer * 24) * 100;
    // timeProgressBar.update(delta, percent);

    HUD.updateTimerSprite(zeroPad(Math.floor(timer.timer / 24), 2), maxTimer);

    if (timer.timer <= 0) {
        canReset = true;
        gameover = true;
        score = Math.max(score, 0);
        HUD.updateGameoverScore(splashInfo, zeroPad(score, 2));
    }

    moveClouds();

    if (kaboomT > 0) {
        kaboomT -= 1 * delta;
        if (kaboomT <= 0) kaboomT = 0;
    }

    for(let i = 0; i < ouchAnimations.length; ++i) {
        if (ouchAnimations[i].ouchT > 0) {
            ouchAnimations[i].ouchT -= 1 * delta;
            if (ouchAnimations[i].ouchT <= 0) ouchAnimations[i].ouchT = 0;
        }
    }

    // if (ouchT > 0) {
    //     ouchT -= 1 * delta;
    //     if (ouchT <= 0) ouchT = 0;
    // }
}

function drawStartPage() {
    ctx.drawImage(AM.images.intro.img, 0, 0, AM.images.intro.cw, AM.images.intro.ch, splashInfo.x, splashInfo.y, splashInfo.w, splashInfo.h);

    let mid = canvas.width / 2;
    // let x = mid - 265 * scaleX;
    let x = mid + 170 * scaleX;
    let hy = onTablet ? 840 : 310;
    let y = splashInfo.y + hy * splashInfo.sx;
    
    let frame = Math.floor(startScreenHandAnimT * 3) % 12;
    let w = AM.images.sharp.cw * scaleX;
    let h = AM.images.sharp.ch * scaleX;

    ctx.drawImage(AM.images.sharp.img, frame * AM.images.sharp.cw, 0, AM.images.sharp.cw, AM.images.sharp.ch, 
        x, y, w, h);

    frame = Math.floor(startScreenHandAnimT) % 8;
                
    // ctx.drawImage(AM.images.hand.img, frame * startPageInfo.hand.cw, 0, startPageInfo.hand.cw, startPageInfo.hand.ch, mid, y, startPageInfo.hand.w, startPageInfo.hand.h);

    
    // x = mid + 170 * scaleX;
    x = mid - 265 * scaleX;
    frame = Math.floor(startScreenHandAnimT * 1) % 8;

    ctx.drawImage(AM.images.soft.img, frame * AM.images.soft.cw, 0, AM.images.soft.cw, AM.images.soft.ch, 
        x, y, w, h);

    if (delta < 1) {
        // startTurtleBlinkT += 2 * delta;
        startScreenHandAnimT += 5 * delta;
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
                // ctx.drawImage(AM.images.bg.img, 0, 0, 927, 429, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(AM.images.sky.img, 0, 0, 926, 429, 0, 0, canvas.width, canvas.height);

                drawFloaters();

                ctx.beginPath();
                ctx.fillStyle = '#70D2ED';
                ctx.rect(0, waterInfo.y, canvas.width, waterInfo.h);
                ctx.fill();

                drawClouds();
                // drawProgress();
                // timeProgressBar.draw(ctx);
                // drawTopHUD();
                HUD.draw(ctx);
                // drawScoreHUD();
                drawLives();

                // let volumeKey = 'mute';
                // if (volumeOn) {
                //     volumeKey = 'volume';
                // }

                // ctx.drawImage(AM.images[volumeKey].img, 0, 0, volumeInfo.cw, 
                //     volumeInfo.ch, volumeInfo.x, volumeInfo.y + topHUDInfo.timer.y, volumeInfo.w, volumeInfo.h);


                

                // lands
                ctx.drawImage(AM.images.landLeft.img, 0, 0, 157, 206, images.landLeft.x, images.landLeft.y, images.landLeft.w, images.landLeft.h);
                ctx.drawImage(AM.images.landRight.img, 0, 0, 157, 206, images.landRight.x, images.landRight.y, images.landRight.w, images.landRight.h);

                

                for (let i = 0; i < projectiles.length; ++i) {
                    if (difficulty[i] > 0) {
                        // projectiles[i].draw(ctx, AM.images.projectile.img);
                        projectiles[i].dive(ctx, AM.images[projectiles[i].id].img);
                        // let r = projectiles[i].update(delta * difficulty[i], g, projectileRanges, canvas.height);
                        let r = projectiles[i].update(delta, g, projectileRanges, canvas.height);
                        
                        if (r) {
                            // difficulty[i] = Math.floor(Math.random() * 100) / 100 + 0.2 + difficultyAdj[i];
                            difficulty[i] = Math.floor(Math.random() * maxDifficultyRange) / 100 + 1.2 * scaleX;
                            // console.log(difficulty[i]);
                            // difficulty[i] += 0.2;
                            updateSprite(i);
                            initAnimateCanon(i);

                            projectiles[i].vy = -Math.floor(Math.random() * 300 + 300) * scaleX;

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
                    // ctx.drawImage(AM.images.scoreboom.img, 0, 0, kaboomInfo.cw, kaboomInfo.ch, kaboomInfo.x - adjx2, kaboomInfo.y - adjx2, kaboomInfo.w + adjx, kaboomInfo.h + adjx);
                    ctx.drawImage(AM.images.scoreboom.img, frame * kaboomInfo.cw, 0, kaboomInfo.cw, kaboomInfo.ch, kaboomInfo.x, kaboomInfo.y, kaboomInfo.w, kaboomInfo.h);
                    ctx.drawImage(AM.images.scoretext.img, scoreTextFrame * scoreTextInfo.cw, 0, scoreTextInfo.cw, scoreTextInfo.ch, kaboomInfo.x + (kaboomInfo.w / 2 - scoreTextInfo.w / 2), kaboomInfo.y, scoreTextInfo.w, scoreTextInfo.h);
                }

                // if (ouchT) {
                //     ouchT2 += 10 * delta;
                    
                    
                //     // ctx.drawImage(AM.images.ouch.img, 0, 0, ouchInfo.cw, ouchInfo.ch, ouchInfo.x, ouchInfo.y, ouchInfo.w, ouchInfo.h);
                //     if (ouchSpriteKey != 'objectboom') {
                //         let frame = Math.floor(ouchT2) % 6;
                //         ctx.drawImage(AM.images[ouchSpriteKey].img, frame * ouchInfo.cw, 0, ouchInfo.cw, ouchInfo.ch, ouchInfo.x, ouchInfo.y, ouchInfo.w, ouchInfo.h);
                //     } else {
                //         let frame = Math.floor(ouchT2) % 7;
                //         ctx.drawImage(AM.images[ouchSpriteKey].img, frame * objectBoomInfo.cw, 0, objectBoomInfo.cw, objectBoomInfo.ch, ouchInfo.x, ouchInfo.y, objectBoomInfo.w, objectBoomInfo.h);
                //         if (frame == 6) ouchT = 0;
                //     }
                    
                // }

                for (let i = 0; i < ouchAnimations.length; ++i) {
                    if (ouchAnimations[i].ouchT) {
                        ouchAnimations[i].ouchT2 += 10 * delta;
                        
                        
                        // ctx.drawImage(AM.images.ouch.img, 0, 0, ouchInfo.cw, ouchInfo.ch, ouchInfo.x, ouchInfo.y, ouchInfo.w, ouchInfo.h);
                        if (ouchAnimations[i].ouchSpriteKey != 'objectboom') {
                            let frame = Math.floor(ouchAnimations[i].ouchT2) % 6;
                            ctx.drawImage(AM.images[ouchAnimations[i].ouchSpriteKey].img, frame * ouchInfo.cw, 0, ouchInfo.cw, ouchInfo.ch, ouchAnimations[i].x, ouchAnimations[i].y, ouchInfo.w, ouchInfo.h);
                        } else {
                            let frame = Math.floor(ouchAnimations[i].ouchT2) % 7;
                            ctx.drawImage(AM.images[ouchAnimations[i].ouchSpriteKey].img, frame * objectBoomInfo.cw, 0, objectBoomInfo.cw, objectBoomInfo.ch, ouchAnimations[i].x, ouchAnimations[i].y, objectBoomInfo.w, objectBoomInfo.h);
                            if (frame == 6) ouchAnimations[i].ouchT = 0;
                        }
                        
                    }
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
                

                // canons.black.left.lower.draw(ctx, AM.images.blackCanonLeft.img);
                // canons.black.right.upper.draw(ctx, AM.images.blackCanonRight.img);
                // canons.black.right.lower.draw(ctx, AM.images.blackCanonRight.img);

                // drawExplosionStar(canvas.width / 2, canvas.height / 2);
                // drawExplosionStar(0, 0);

                checkProjectileCollisions();
                checkCanonCollisions();
                // displayScore();
                update();
            } else {
                drawStartPage();
                // let handx = Math.sin(startScreenHandAnimT) * 20;
                // let handy = Math.cos(startScreenHandAnimT) * 20;
                // // let handTapX = Math.cos(startScreenHandAnimT) * 2;
                // // let handTapY = Math.sin(startScreenHandAnimT) * 2;
                // // ctx.drawImage(AM.images.splash.img, 0, 0, 927, 429, 0, 0, canvas.width, canvas.height);
                // ctx.drawImage(AM.images.sky.img, 0, 0, 926, 429, 0, 0, canvas.width, canvas.height);
                // ctx.beginPath();
                // ctx.fillStyle = '#70D2ED';
                // ctx.rect(0, waterInfo.y, canvas.width, waterInfo.h);
                // ctx.fill();
                // drawClouds();

                // // lands
                // ctx.drawImage(AM.images.landLeft.img, 0, 0, 157, 206, images.landLeft.x, images.landLeft.y, images.landLeft.w, images.landLeft.h);
                // ctx.drawImage(AM.images.landRight.img, 0, 0, 157, 206, images.landRight.x, images.landRight.y, images.landRight.w, images.landRight.h);

                // // canons
                // canons.draw();

                // let frame = Math.floor(startScreenHandAnimT) % 8;
                
                // ctx.drawImage(AM.images.title.img, 0, 0, startPageInfo.title.cw, startPageInfo.title.ch, startPageInfo.title.x, startPageInfo.title.y, startPageInfo.title.w, startPageInfo.title.h);
                // ctx.drawImage(AM.images.hand.img, frame * startPageInfo.hand.cw, 0, startPageInfo.hand.cw, startPageInfo.hand.ch, startPageInfo.hand.x, startPageInfo.hand.y, startPageInfo.hand.w, startPageInfo.hand.h);
                // // tap
                // // ctx.save();
                // // // Untransformed draw position
                // // const position = {x: startPageInfo.hand.x, y: startPageInfo.hand.y};
                // // // In degrees
                // // const rotation = { x: 0, y: Math.sin(startScreenHandAnimT) * 35, z: 0};
                // // // Rotation relative to here (this is the center of the image)
                // // const rotPt = { x: startPageInfo.hand.w / 2, y: startPageInfo.hand.h / 2 };

                // // ctx.setTransform(new DOMMatrix()
                // //     .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
                // //     .rotateSelf(rotation.x, rotation.y, rotation.z)
                // // );
                
                // // ctx.drawImage(AM.images.hand.img, 0, 0, startPageInfo.hand.cw, startPageInfo.hand.ch, -rotPt.x, -rotPt.y, startPageInfo.hand.w, startPageInfo.hand.h);
                // // ctx.restore();
                // //
                
                // // ctx.drawImage(AM.images.startballoon.img, 0, 0, startPageInfo.startballoon.cw, startPageInfo.startballoon.ch, startPageInfo.startballoon.x + handx, startPageInfo.startballoon.y + handy, startPageInfo.startballoon.w, startPageInfo.startballoon.h);
                // //
                //     ctx.save();

                //     // move to the center of the canvas
                //     ctx.translate(startPageInfo.startmine.ox + startPageInfo.startmine.w / 2, startPageInfo.startmine.oy + startPageInfo.startmine.h / 2);
                    
                //     let degrees = Math.sin(startPulseT * 10) * 15;
                //     // rotate the canvas to the specified degrees
                //     ctx.rotate(degrees * Math.PI/180);

                //     // draw the image
                //     startPageInfo.startmine.x = -0.5 * startPageInfo.startmine.w;
                //     startPageInfo.startmine.y = -0.5 * startPageInfo.startmine.h;

                //     ctx.drawImage(AM.images.startmine.img, 0, 0, startPageInfo.startmine.cw, startPageInfo.startmine.ch, startPageInfo.startmine.x, startPageInfo.startmine.y, startPageInfo.startmine.w, startPageInfo.startmine.h);
                //     // we’re done with the rotating so restore the unrotated context
                //     ctx.restore();
                // //

                

                // // for (let i = 1; i < 4; ++i) {
                // //     let key = 'text' + i;
                // //     ctx.drawImage(AM.images[key].img, 0, 0, startPageInfo[key].cw, startPageInfo[key].ch, startPageInfo[key].x, startPageInfo[key].y, startPageInfo[key].w, startPageInfo[key].h);
                // // }

                // TXT.draw('instruction1');
                // TXT.draw('instruction1_2');

                // TXT.draw('instruction2');
                // TXT.draw('instruction2_2');

                // ctx.drawImage(AM.images.beginbutton.img, 0, 0, startPageInfo.beginbutton.cw, startPageInfo.beginbutton.ch, startPageInfo.beginbutton.x, startPageInfo.beginbutton.y, startPageInfo.beginbutton.w, startPageInfo.beginbutton.h);
                

                // // ctx.beginPath();
                // // ctx.rect(btnBegin.x, btnBegin.y, btnBegin.w, btnBegin.h);
                // // ctx.stroke();

                // if (delta < 1) {
                //     startPulseT += 2 * delta;
                //     startScreenHandAnimT += 5 * delta;
                // }
            }
        } else {
            HUD.gameover(ctx, splashInfo, delta);
            // if (!fade) {
            //     // bg
            //     // ctx.drawImage(AM.images.bg.img, 0, 0, 927, 429, 0, 0, canvas.width, canvas.height);
            //     ctx.drawImage(AM.images.sky.img, 0, 0, 926, 429, 0, 0, canvas.width, canvas.height);
            //     ctx.beginPath();
            //     ctx.fillStyle = '#70D2ED';
            //     ctx.rect(0, waterInfo.y, canvas.width, waterInfo.h);
            //     ctx.fill();
            //     drawClouds();
            //     // drawProgress();
            //     timeProgressBar.draw(ctx);
            //     drawTopHUD();
            //     drawScoreHUD();
            //     drawLives();

            //     // lands
            //     ctx.drawImage(AM.images.landLeft.img, 0, 0, 157, 206, images.landLeft.x, images.landLeft.y, images.landLeft.w, images.landLeft.h);
            //     ctx.drawImage(AM.images.landRight.img, 0, 0, 157, 206, images.landRight.x, images.landRight.y, images.landRight.w, images.landRight.h);

            //     // canons
            //     canons.draw();

            //     // game
            //     // drawTurtle();
            //     // update();

            //     ctx.globalAlpha = 0.85;
            //     ctx.fillStyle = '#000';
            //     ctx.fillRect(0, 0, canvas.width, canvas.height);
            //     ctx.globalAlpha = 1.0;

            //     pulseT += 2 * delta;
            //     let w = Math.sin(pulseT) * (shineInfo.w + 10);
            //     let h = Math.sin(pulseT) * (shineInfo.h + 10);

            //     if (w >= shineInfo.w) {
            //         w = shineInfo.w;
            //     }

            //     if (h >= shineInfo.h) {
            //         h = shineInfo.h;
            //     }

            //     if (w == shineInfo.w && h == shineInfo.h) {
            //         fade = true;
            //     }

            //     let x = shineInfo.x + (shineInfo.w / 2 - w / 2);
            //     let y = shineInfo.y + (shineInfo.h / 2 - h / 2) - 50 * scaleY;
            //     ctx.drawImage(AM.images.shine.img, 0, 0, shineInfo.cw, 
            //         shineInfo.ch, x, y, w, h);

            //     ctx.drawImage(AM.images.complete.img, 0, 0, completeInfo.cw, 
            //         completeInfo.ch, completeInfo.x, shineInfo.y, completeInfo.w, completeInfo.h);
                
            //     ctx.drawImage(AM.images.trophy.img, 0, 0, trophyInfo.cw, 
            //         trophyInfo.ch, trophyInfo.x, (shineInfo.y + shineInfo.h / 2) - trophyInfo.h, trophyInfo.w, trophyInfo.h);
            //     // ctx.drawImage(AM.images.shine.img, 0, 0, shineInfo.cw, 
            //     //     shineInfo.ch, shineInfo.x, shineInfo.y, shineInfo.w, shineInfo.h);
                
            //     // x = shineInfo.x + (shineInfo.w / 2 - turtleInfo.w / 2);
            //     // y = shineInfo.y + (shineInfo.h / 2 - turtleInfo.h / 2 - 10 * scaleY);
            //     // ctx.drawImage(AM.images.turtle.img, 0, 0, turtleInfo.cw, 
            //     //     turtleInfo.ch, x, y, turtleInfo.w, turtleInfo.h);
                

            //     // TM.draw(textList.complete.obj);
                

            //     // score = 11;
            //     let adjX = 12;
            //     let a = Math.floor(score / 10);
            //     let b = score % 10;
            //     let countOnes = (a == 1) + (b == 1);

            //     // if (score > 9) adjX = 2;
            //     if (countOnes == 1) adjX = 0;
            //     else if (countOnes == 2) adjX = -4;
            //     else if (score > 19 && score < 100) adjX = 5.5;
                
            //     textList.finalScore.obj.tx = canvas.width / 2 - textList.finalScore.desc.w * scaleX / 2 - adjX * scaleX;
            //     textList.finalScore.obj.ty = shineInfo.y + shineInfo.h / 2 + 60 * scaleY;
            //     // textList.scoreLabel.obj.tx = shineInfo.y + shineInfo.h / 2 + 20 * scaleY;
            //     textList.scoreLabel.obj.ty = shineInfo.y + shineInfo.h / 2 + 20 * scaleY;
                
            //     textList.finalScore.obj.str = zeroPad(score, 2);

            //     TM.draw(textList.scoreLabel.obj);
            //     TM.draw(textList.finalScore.obj);
            //     // TM.draw(textList.resetMsg.obj);
            // }
        }
    }

    requestAnimationFrame(gameCycle);
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);