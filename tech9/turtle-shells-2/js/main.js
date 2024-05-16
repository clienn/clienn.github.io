const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');

var instrucions = document.getElementById("game-instructions");
var btnStart = document.getElementById("btnStart");

var last = 0;
var delta = 0;
var startGame = false; // orientation prep
var gameStart = false; // start game
var totalTimeSpent = 0;
const gameDuration = 60;
var G = 9.8;

var scaleX = 1;
var scaleY = 1;

var mDown = false;

// 1792 922
var assets = {
    count: 0,
    loaded: 0,
    load: (obj, fn) => {
        obj.img = new Image();
        obj.img.src = '/assets/' + fn + '.png';
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
        obj.audio.src = '/assets/' + fn + '.' + ext;
        obj.audio.preload = 'auto';
        obj.audio.autoplay = (/iPad|iPhone|iPod/).test(navigator.userAgent);

        if (fn == 'bg') {
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
    splash: {
        src: 'splash',
        obj: {},
    }, 
    bg: {
        src: 'bg',
        obj: {},
    },
    startbg: {
        src: 'startbg',
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
    beginbutton: {
        src: 'beginbutton',
        obj: {},
    },
    turtle: {
        src: 'turtle',
        obj: {},
    },
    shell: {
        src: 'shell',
        obj: {},
    },
    turtlehide: {
        src: 'turtlehide',
        obj: {},
    },
    turtlehappy: {
        src: 'turtlehappy',
        obj: {},
    },
    seagull: {
        src: 'seagull',
        obj: {},
    },
    turtleshine: {
        src: 'turtleshine',
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
    palm: {
        src: 'palm',
        obj: {},
    },
    palmshadow: {
        src: 'palmshadow',
        obj: {},
    },
    umbrella: {
        src: 'umbrella',
        obj: {},
    },
    kayak: {
        src: 'kayak',
        obj: {},
    },
    sky: {
        src: 'sky',
        obj: {},
    },
    sand: {
        src: 'sand',
        obj: {},
    },
    sand2: {
        src: 'sand2',
        obj: {},
    },
    cloudleft: {
        src: 'cloudleft',
        obj: {},
    },
    cloudright: {
        src: 'cloudright',
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
    shine: {
        src: 'shine',
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
        src: 'sounds/bg-beach',
        obj: {},
        ext: 'wav',
    }, 
    correct: {
        src: 'sounds/correct',
        obj: {},
        ext: 'wav',
    }, 
    wrong: {
        src: 'sounds/wrong',
        obj: {},
        ext: 'wav',
    },
    wrong2: {
        src: 'sounds/wrong2',
        obj: {},
        ext: 'wav',
    },
    // shuffle: {
    //     src: 'sounds/shuffle',
    //     obj: {},
    //     ext: 'wav',
    // }, 

}

var bgInfo = {
    water: {
        x: 0,
        y: 160,
        w: 0,
        h: 50,
        cw: 0,
        ch: 0
    },
    sand: {
        x: 0,
        y: 0,
        w: 0,
        h: 376,
        cw: 926,
        ch: 176
    },
    sand2: {
        x: 0,
        y: 0,
        w: 0,
        h: 174,
        cw: 926,
        ch: 176
    },
    umbrella: {
        x: 0,
        y: 0,
        w: 384,
        h: 538,
        cw: 192,
        ch: 269
    },
    palm: {
        x: 0,
        y: 0,
        w: 207,
        h: 137,
        cw: 207,
        ch: 137
    },
    palmshadow: {
        x: 0,
        y: 0,
        w: 142,
        h: 85,
        cw: 142,
        ch: 85
    },
    kayak: {
        x: 0,
        y: 0,
        w: 142,
        h: 320,
        cw: 71,
        ch: 160
    },
    cloudleft: {
        x: 0,
        y: 250,
        w: 438,
        h: 227,
        cw: 438,
        ch: 227
    },
    cloudright: {
        x: 0,
        y: 400,
        w: 380,
        h: 234,
        cw: 380,
        ch: 234
    },
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

var btnBegin = {
    x: 0,
    y: 0,
    w: 400,
    h: 100
};

var turtleInfo = {
    w: 104,
    h: 119,
    cw: 104,
    ch: 119,
    bucketSize: 0
}

var shellInfo = {
    w: 105,
    h: 116,
    cw: 105,
    ch: 116,
    bucketSize: 0
}

var turtlehideInfo = {
    w: 120,
    h: 121,
    cw: 120,
    ch: 121,
    bucketSize: 0
}

var turtlehappyInfo = {
    w: 120,
    h: 121,
    cw: 120,
    ch: 121,
    bucketSize: 0
}

var seagullInfo = {
    w: 144,
    h: 77,
    cw: 576,
    ch: 288,
    bucketSize: 0
}

var shineInfo = {
    x: 0,
    y: 200,
    w: 352,
    h: 290,
    cw: 352,
    ch: 290,
}
// 35 * scaleX, volumeInfo.y + 50 * scaleY, volumeInfo.w * 2, volumeInfo.h * 2
var volumeInfo = {
    x: 7,
    y: 25,
    w: 55 * 1.5,
    h: 55 * 1.5,
    cw: 46,
    ch: 46,
}

const topHUD = {
    timer: {
        fontS: 20,
        fontW: 20,
        fontH: 20,
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
        fontS: 20,
        fontW: 20,
        fontH: 20,
        turtleshine: {
            w: 45 * 1.5,
            h: 45 * 1.5,
            cw: 42,
            ch: 43,
        }
    },
}

var sorts = {
    bubble: () => {
        let hasSwap = false;
        let arr = generateSwaps();

        // for (let i = 0; i < arr.length; ++i) {
        //     if (arr[i] == target) {
        //         let tmp = arr[i];
        //         arr[i] = arr[arr.length - 1];
        //         arr[arr.length - 1] = tmp;
        //         break;
        //     }
        // }
        
        while (!hasSwap) {
            swaps.length = 0;

            for (let i = 0; i < arr.length; ++i) {
                for (let j = i + 1; j < arr.length; ++j) {
                    if (arr[i] > arr[j]) {
                        let tmp = arr[i];
                        arr[i] = arr[j];
                        arr[j] = tmp;

                        swaps.unshift([i, j]);
                        hasSwap = true;
                    }
                }
            }

            shuffleArr(arr);
            // arr.length = 0;
        }
        



        // console.log(swaps);
        // swaps.push([0, 9]);
        // swaps.push([1, 3]);
        // swaps.push([0, 2]);
    }
}

var turtles = [];

var target = 1;

var swaps = [];
var turtlePos = [];

var timer = null;

var timerRadius = 70;
var timerY = 200;
var timerFontSize = 50;
var timerAdjX = [30, 40];

var startTimer = false;
var showTarget = true;

var msg = '';

var textPos = {
    x: 0,
    y: 0,
    fontsize: 80
}

var score = 0;
var rounds = 0;
var totalRounds = 12;
var gameover = false;
var speed = 3;

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
        w: 50 * 1.5,
        h: 50 * 1.5,
        lives: 3,
        totalW: 0,
        sx: 0,
        pad: 0
    }
}

var showTurtleDuration = 4;
var lives = topHUDInfo.life.lives;

var resetMsgY = 100;
var canReset = false;

const cloudMovements = [-100, 100, 100];

const colors = ['#10aad7', '#b3d23b', '#10aad7', '#f9a139'];

var fade = false;

var pulseT = 0;

// var TM = null;
// var tmpText = null;

// var TM = new TextManager(ctx);
// var tmpText = TM.generateTextObj('Hello World!', 'Montserrat', 'normal', 30, 0, 0, 500, 100);

var TXT = null;

const TEXT_ID = {
    'CORRECT': 1,
    'WRONG': 2,
    'TOOSLOW': 3,
    'COMPLETE': 4,
    'SCORELABEL': 5,
    'FINALSCORE': 6,
    'RESETMSG': 7,
    'TOPTIMER': 8,
    'SCOREX': 9,
    'SCORE': 10,
    'YOU_GOT_IT': 11,
    'YAY_YOU_FOUND_HIM': 12,
    'NICE_WORK': 13,
    'GOOD_JOB': 14,
    'MASTERFUL': 15,
    'YOUR_MOTHER_SHOULD_BE_PROUD': 16,
    'SHOWING_PROMISE': 17,
    'WRONG_TURTLE': 18,
    'NOPE_NOT_THAT_ONE': 19,
    'THEY_DO_LOOK_ALIKE': 20,
    'UMMM_NOPE': 21,
    'YOU_CAN_DO_BETTER': 22,
    'NO_THATS_NOT_IT': 23,
    'TRY_AGAIN': 24,
}


var answerIdx = -1;
var showAnswerT = 0;
var jumpHeight = 8;

var volumeOn = true;

var seagulls = [];
var seagullDirections = [];

var startPageInfo = {
    title: {
        x: 0,
        y: 110,
        w: 492 * 2,
        h: 40 * 2,
        cw: 492,
        ch: 40,
    },
    hand: {
        // x: 817,
        x: 837,
        y: 270,
        // x: 475,
        // y: 280,
        w: 64 * 2,
        h: 65 * 2,
        cw: 56,
        ch: 57,
    },
    turtle: {
        x: 425,
        // y: 280,
        y: 261,
        w: 128 * 1,
        h: 128 * 1,
        // x: 817,
        // y: 270,
        // x: 475,
        // x: 425,
        // // y: 280,
        // y: 261,
        // w: 120 * 1.2,
        // h: 121 * 1.2,
        // cw: 120,
        // ch: 121,
    },
    shell: {
        x: 1233,
        y: 251,
        w: 128 * 1,
        h: 128 * 1,
        // x: 1183,
        // x: 1233,
        // y: 251,
        // w: 105 * 1.2,
        // h: 116 * 1.2,
        // cw: 105,
        // ch: 116,
    },
    text1: {
        // x: 385,
        // x: 395,
        x: 345,
        y: 435,
        w: 156 * 2,
        h: 25 * 2,
        cw: 156,
        ch: 25,
    },
    text2: {
        x: 740,
        y: 435,
        w: 145 * 2,
        h: 28 * 2,
        cw: 145,
        ch: 28,
    },
    text3: {
        // x: 1110,
        // x: 1100,
        x: 1170,
        y: 435,
        w: 142 * 2,
        h: 25 * 2,
        cw: 142,
        ch: 25,
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
var startTurtleBlinkT = 0;

var timeProgressBar = null;
var scoreProgressBar = null;

var gameT = gameDuration;
var turtleSpeechKey = '';
var turtleSpeechInfo = {
    key: '',
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    isCorrect: false,
    failedKeys: [1, 2, 3, 4, 5, 6, 7],
    successKeys: [1, 2, 3, 4, 5, 6, 6],
    failedIdx: 0,
    successIdx: 0,
}

var selectedTurtlePos = -1;
var showUnhappyT = 0;

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

const showAnswerDuration = 2.5;

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    canvas.style.display = 'block';
    instrucions.style.display = 'none';

    scaleX = w / 1792;
    scaleY = h / 922;

    G *= scaleX;
    jumpHeight *= scaleX;
    // jumpHeight *= scaleY;

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

    // jumpHeight *= splashInfo.sy;

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

    // jumpHeight *= splashInfo.sy;

    let isMobile = detectMob();
    
    // if (isMobile) {
    //     startPageInfo.text1.y -= 20;
    //     startPageInfo.text2.y -= 20;
    //     startPageInfo.text3.y -= 20;
    // }

    initStartPage();

    // TXT = new Text(ctx, w, h);
    // TXT.setScale(scaleX, scaleY);

    timerY = h / 2;
    textPos.x = w / 2;
    textPos.y = timerY / 2;

    let scoreAdjY = 13;

    if (isMobile) {
        timerRadius = 70;
        
        timerFontSize = 40;
        timerAdjX = [8, 22];
        textPos.fontsize = 40;
        resetMsgY = 170;
        textPos.y -= 25;

        bgInfo.water.y = 350;

        scoreAdjY = 20;

        // volumeInfo.x = 45;
        // volumeInfo.y = 85;
        // volumeInfo.w = 35;
        // volumeInfo.h = 35;

        topHUD.timer.fontS = 30;
        topHUD.timer.fontW = 30;
        topHUD.timer.fontH = 30;

        topHUD.score.fontS = 30;
        topHUD.score.fontW = 30;
        topHUD.score.fontH = 35;
    }

    resetMsgY *= scaleY;
    

    timer = new Timer(w / 2, timerY, timerRadius, '#fb2121');
    timer.fontSize = timerFontSize;
    timer.adjX = timerAdjX;

    btnBegin.w *= scaleX;
    btnBegin.h *= scaleY;

    btnBegin.x = w / 2 - btnBegin.w / 2;
    btnBegin.y = h - 235 * scaleY;
    
    rescaleSize(turtleInfo, scaleX, scaleX);
    rescaleSize(shellInfo, scaleX, scaleX);

    rescalePos(turtlehideInfo, scaleX, scaleY);
    rescaleSize(turtlehideInfo, scaleX, scaleX);

    rescalePos(turtlehappyInfo, scaleX, scaleY);
    rescaleSize(turtlehappyInfo, scaleX, scaleX);

    rescalePos(seagullInfo, scaleX, scaleY);
    rescaleSize(seagullInfo, scaleX, scaleX);

    rescalePos(volumeInfo, scaleX, scaleY);
    rescaleSize(volumeInfo, scaleX, scaleX);

    initTopHUD();

    rescalePos(bgInfo.water, scaleX, scaleX);
    rescaleSize(bgInfo.water, scaleX, scaleX);

    rescalePos(bgInfo.sand, scaleX, scaleY);
    rescaleSize(bgInfo.sand, scaleX, scaleX);

    rescalePos(bgInfo.sand2, scaleX, scaleY);
    rescaleSize(bgInfo.sand2, scaleX, scaleX);

    rescalePos(bgInfo.umbrella, scaleX, scaleY);
    rescaleSize(bgInfo.umbrella, scaleX, scaleX);

    rescalePos(bgInfo.palm, scaleX, scaleY);
    rescaleSize(bgInfo.palm, scaleX, scaleX);

    rescalePos(bgInfo.palmshadow, scaleX, scaleY);
    rescaleSize(bgInfo.palmshadow, scaleX, scaleX);

    rescalePos(bgInfo.kayak, scaleX, scaleY);
    rescaleSize(bgInfo.kayak, scaleX, scaleX);

    rescalePos(bgInfo.cloudleft, scaleX, scaleY);
    rescaleSize(bgInfo.cloudleft, scaleX, scaleX);

    rescalePos(bgInfo.cloudright, scaleX, scaleY);
    rescaleSize(bgInfo.cloudright, scaleX, scaleX);

    rescalePos(bgInfo.cloud1, scaleX, scaleY);
    rescaleSize(bgInfo.cloud1, scaleX, scaleX);

    rescalePos(bgInfo.cloud2, scaleX, scaleY);
    rescaleSize(bgInfo.cloud2, scaleX, scaleX);

    rescalePos(bgInfo.cloud3, scaleX, scaleY);
    rescaleSize(bgInfo.cloud3, scaleX, scaleX);

    rescalePos(shineInfo, scaleX, scaleY);
    rescaleSize(shineInfo, scaleX, scaleX);

    HUD = new Template_1(ctx, w, h, scaleX, scaleY, splashInfo);

    shineInfo.w *= 1.5;
    shineInfo.h *= 1.5;
    shineInfo.x = w / 2 - shineInfo.w / 2;

    bgInfo.umbrella.y = h - (bgInfo.umbrella.h + 150 * scaleY);
    bgInfo.palm.x = w - bgInfo.palm.w;
    bgInfo.palmshadow.x = w - bgInfo.palmshadow.w;
    bgInfo.palmshadow.y = h - (bgInfo.palmshadow.h);
    bgInfo.kayak.x = w - (bgInfo.kayak.w + 100 * scaleX);
    bgInfo.kayak.y = h - (bgInfo.kayak.h + 300 * scaleX);
    bgInfo.cloudright.x = w - bgInfo.cloudright.w;

    bgInfo.cloud1.x = w - bgInfo.cloud1.w;
    bgInfo.cloud1.y = 200 * scaleY;
    bgInfo.cloud2.x = bgInfo.cloud2.w / 2;
    bgInfo.cloud2.y = 100 * scaleY;
    bgInfo.cloud3.x = w / 2 - bgInfo.cloud3.w / 2;
    bgInfo.cloud3.y = h / 2 - (150 * scaleY);

    
    bgInfo.sand.y = h - 376 * scaleX;
    bgInfo.sand2.y = h - 336 * scaleX;
    bgInfo.water.y = bgInfo.sand2.y + 25 * splashInfo.sx;
    // bgInfo.water.y = h / 2 + bgInfo.water.y * scaleY;
    

    let pbW = 150 * scaleX;
    let pbH = 45 * scaleY;

    timeProgressBar = new ProgressBar(topHUDInfo.timer.progress.x, 30 * scaleY, pbW, pbH);
    timeProgressBar.progress = 100;
    timeProgressBar.y = topHUDInfo.timer.progress.y;
    
    pbW = 200 * scaleX;
    pbH = 75 * scaleY;

    scoreProgressBar = new ProgressBar(w / 2 - pbW / 2, 30 * scaleY, pbW, pbH, '#569E1A');
    scoreProgressBar.progress = 100;

    // loadAssets();

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
                // canReset = false;
                if (isBtnClicked(mx, my, HUD.endscreenButtons)) {
                    submitScore();
                }
            } else if (gameStart) {
                // turtles[2].move(-1);
                // turtles[0].move(1);
                // turtles[2].goto(-2);
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
                } else if (startTimer && swaps.length == 0 && showAnswerT == 0) {
                    let p = clickBucket(mx, my);
                    if (p > -1 && p < turtles.length) {
                        for (let i = 0; i < turtles.length; ++i) {
                            if (p == turtles[i].pos) {
                                selectedTurtlePos = i;
                                break;
                            }
                        }
    
                        // console.log(clickBucket(turtles[target].x, turtles[target].y));
                        
                        if (p == turtles[target].pos) {
                            // alert('you win');
                            // msg = 'Correct!';
                            // msg = 'correct';
    
                            // let msgs = [1, 11, 12, 13, 14, 15, 16, 17];
                            let rng = Math.floor(Math.random() * 8) + 1;
                            if (rng > 1) rng += 9;
                            else rng = 11;
    
                            // msg = TEXT_ID.CORRECT;
                            msg = rng;
                            score++;
                            // if (!AM.audio.correct.img.paused) {
                            //     AM.audio.correct.img.currentTime = 0;
                            //     AM.audio.correct.img.play();
                            // }
                            
                            if (volumeOn) {
                                setTimeout(() => {
                                    AM.audio.correct.img.currentTime = 0;
                                    AM.audio.correct.img.volume = 0.5;
                                    AM.audio.correct.img.play();
                                }, 0)
                            }
    
                            turtles[target].jump = jumpHeight;
                            turtles[target].activateSpriteAnimation = true;
                            turtles[target].clipX = 0;
                            turtles[target].clipAnimT = 0;
    
                            turtleSpeechKey = getSpeech(1, p);
                            // console.log(turtleSpeechKey);
    
                            HUD.updateScoreSprite(zeroPad(score, 2));
                        } else {
                            // alert('you lose');
                            // msg = 'wrong';
                            let rng = Math.floor(Math.random() * 8) + 1;
                            if (rng > 1) rng += 16;
                            else rng = 18;
    
                            msg = rng;
                            // msg = TEXT_ID.WRONG;
                            // msg = 'Wrong!';
                            reduceHP();
    
                            if (volumeOn) {
                                setTimeout(() => {
                                    AM.audio.wrong.img.currentTime = 0;
                                    AM.audio.wrong.img.volume = 0.5;
                                    AM.audio.wrong.img.play();
                                }, 0)
                            }
    
                            
                            turtleSpeechKey = getSpeech(0, clickBucket(turtles[target].x, turtles[target].y));
                            console.log(turtleSpeechKey);
                        }
    
                        // showAnswer = true;
                        showAnswerT = showAnswerDuration;
                        showUnhappyT = 0;
                        answerIdx = target;
                        startTimer = false;
                        
    
                        // if (rounds < totalRounds) {
                        //     nextRound();
                        // } else {
                        //     // alert('You scored: ' + score + ' out of ' + rounds + '.');
                        //     gameover = true;
                        // }
                    }
                    
                }
            } else {
                // if (isBtnClicked(mx, my, btnBegin)) {
                if (isBtnClicked(mx, my, startButtonInfo)) {
                    initAllAudio();
                    
                    gameStart = true;
                    AM.audio.bg.img.volume = 0.08;
                    // AM.audio.bg.img.volume = 1;
                    AM.audio.bg.img.loop = true;
                    AM.audio.bg.img.play();

                    // playAllAudio();
                }
            }

            mDown = true;
        }
    });

    document.addEventListener('keyup', e => {
        if (e.key == 'ArrowRight') {

        } else if (e.key == 'ArrowLeft') {

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
                    // init();
                    // location.href = '';
                } else {
                    canReset = true;
                }
                
            }
            
        }
    });

    setCloudSpeed(30);
    setBucketSizes();

    addSeagull();
    addSeagull();
    addSeagull();
    addSeagull();
    addSeagull();
    addSeagull();
    addSeagull();

    init();

    shuffleArr(turtleSpeechInfo.failedKeys);
    shuffleArr(turtleSpeechInfo.successKeys);

    gameCycle();
}

function getSpeech(status, pos) {
    let rng = 0;
    let key = 'speech_'

    if (status) { // success
        // rng = Math.floor(Math.random() * 6) + 1;
        rng = turtleSpeechInfo.successKeys[turtleSpeechInfo.successIdx];
        turtleSpeechInfo.successIdx = (turtleSpeechInfo.successIdx + 1) % 7;
        key += 'success_' + rng;
        turtleSpeechInfo.isCorrect = true;
    } else {
        // rng = Math.floor(Math.random() * 7) + 1;
        rng = turtleSpeechInfo.failedKeys[turtleSpeechInfo.failedIdx];
        turtleSpeechInfo.failedIdx = (turtleSpeechInfo.failedIdx + 1) % 7;
        key += 'failed_' + rng;
        turtleSpeechInfo.isCorrect = false;
    }

    let alignment = 2;
    if (turtles.length > 6) {
        if (pos == 0) {
            alignment = 1;
        } else if (pos > 5) {
            alignment = 3;
        }
    }
    // alignment = 3;
    key += '_' + alignment;

    turtleSpeechInfo.key = key;
    turtleSpeechInfo.w = AM.images[key].cw * 1.10 * scaleX;
    turtleSpeechInfo.h = AM.images[key].ch * 1.10 * scaleX;
    

    if (alignment == 1) {
        turtleSpeechInfo.x = turtles[target].x + turtles[target].w / 2 - 35 * scaleX;
    } else if (alignment == 2) {
        turtleSpeechInfo.x = turtles[target].x + turtles[target].w / 2 - turtleSpeechInfo.w / 2 + 7 * scaleX;
    } else if (alignment == 3) {
        turtleSpeechInfo.x = turtles[target].x + turtles[target].w / 2 - turtleSpeechInfo.w + 50 * scaleX;
    }

    turtleSpeechInfo.y = turtles[target].y - turtleSpeechInfo.h;
    
    return key;
}

function drawReadySpeech(key) {
    let pos = clickBucket(turtles[target].x, turtles[target].y);
    
    let alignment = 2;
    if (turtles.length > 6) {
        if (pos == 0) {
            alignment = 1;
        } else if (pos > 5) {
            alignment = 3;
        }
    }
    
    let w = AM.images[key + '1'].cw * 1.10 * scaleX;
    let h = AM.images[key + '1'].ch * 1.10 * scaleX;

    // let x = turtles[target].x + turtles[target].w - w / 2;
    let x = 0;
    let y = turtles[target].y - h * 1.5;

    if (alignment == 1) {
        x = turtles[target].x + turtles[target].w / 2 - 35 * scaleX;
    } else if (alignment == 2) {
        x = turtles[target].x + turtles[target].w / 2 - w / 2 + 7 * scaleX;
    } else if (alignment == 3) {
        x = turtles[target].x + turtles[target].w / 2 - w + 50 * scaleX;
    }

    key += alignment;

    ctx.drawImage(AM.images[key].img, x, y, w, h);
}

function drawSpeech() {
    if (turtleSpeechInfo.isCorrect) {
        turtleSpeechInfo.y = turtles[target].oy - turtleSpeechInfo.h * 2;
    }

    const { x, y, w, h, key } = turtleSpeechInfo;
    
    ctx.drawImage(AM.images[key].img, x, y, w, h);
}

function muteAllAudio(flag) {
    // for (let k in music) {
    //     music[k].obj.audio.muted = flag;
    // }  
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
            console.log(k)
            AM.audio[k].img.volume = 0;
            AM.audio[k].img.currentTime = 0;
            AM.audio[k].img.play();
            AM.audio[k].img.pause();
            
        }
    }
    
}


function initStartPage() {
    for (let k in startPageInfo) {
        startPageInfo[k].x *= scaleX;
        startPageInfo[k].y *= scaleY;
        startPageInfo[k].w *= scaleX;
        startPageInfo[k].h *= scaleX;
    }

    startPageInfo.text1.y = startPageInfo.turtle.y + startPageInfo.turtle.h + 30 * scaleY;
    startPageInfo.text2.y = startPageInfo.turtle.y + startPageInfo.turtle.h + 30 * scaleY;
    startPageInfo.text3.y = startPageInfo.turtle.y + startPageInfo.turtle.h + 30 * scaleY;

    startPageInfo.title.x = canvas.width / 2 - startPageInfo.title.w / 2;
    startPageInfo.beginbutton.x = canvas.width / 2 - startPageInfo.beginbutton.w / 2;
}

function drawTextInBox(txt, font, x, y, w, h, angle) {
    angle = angle || 0;
    var fontHeight = 20;
    var hMargin = 4;
    ctx.font = fontHeight + 'px ' + font;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    var txtWidth = ctx.measureText(txt).width + 2 * hMargin;
    ctx.save();
    ctx.translate(x+w/2, y);
    ctx.rotate(angle);
    ctx.strokeRect(-w/2, 0, w, h);
    ctx.scale(w / txtWidth, h / fontHeight);
    ctx.translate(hMargin, 0)
    ctx.fillText(txt, -txtWidth/2, 0);
    ctx.restore();
}

function setBucketSizes() {
    turtleInfo.bucketSize = turtleInfo.w > turtleInfo.h ? turtleInfo.w : turtleInfo.h;
    shellInfo.bucketSize = shellInfo.w > shellInfo.h ? shellInfo.w : shellInfo.h;

    if (turtles.length < 8) {
        turtleInfo.bucketSize *= 2;
        shellInfo.bucketSize *= 2;
    } else if (turtles < 10) {
        turtleInfo.bucketSize *= 1.75;
        shellInfo.bucketSize *= 1.75;
        updateTurtleInitialPos();
    } else {
        turtleInfo.bucketSize *= 1.5;
        shellInfo.bucketSize *= 1.5;
        updateTurtleInitialPos();
    }
}

function addSeagull() {
    let x = Math.floor(Math.random() * canvas.width);
    let y = Math.floor(Math.random() * 300 * scaleY);
    
    let rng = (Math.floor(Math.random() * 81) + 20) / 100;
    let w = seagullInfo.w * rng;
    let h = seagullInfo.h * rng;

    let seagull = new Spirte(x, y, w, h, seagullInfo.cw, seagullInfo.ch);
    // let seagull = new Spirte(x, y, seagullInfo.w, seagullInfo.h, seagullInfo.cw, seagullInfo.ch);
    seagull.activateSpriteAnimation = true;

    seagulls.push(seagull);
    seagullDirections.push(setSeagullDirection(70, true));
}

function setSeagullDirection(speedLimit, randomD) {
    let d = Math.floor(Math.random() * 2);
    if (randomD) {
        return (Math.floor(Math.random() * speedLimit) + 10) * (d ? 1 : -1);
    }

    return Math.floor(Math.random() * speedLimit) + 10;
}

function drawSeagulls() {
    for (let i = 0; i < seagulls.length; ++i) {
        seagulls[i].animateSprite(delta, seagullInfo, 15, 17, true);
        // seagulls[i].draw(ctx, AM.images.seagull.img, 1, seagullInfo);
        seagulls[i].dynamicDraw(ctx, AM.images.seagull.img);
    }
}

function updateSeagulls() {
    for (let i = 0; i < seagulls.length; ++i) {
        seagulls[i].x += seagullDirections[i] * delta;

        if (seagullDirections[i] > 0 && seagulls[i].x > canvas.width + 10) {
            seagullDirections[i] = setSeagullDirection(30, false) * -1;
            resetSeagullSize(seagullDirections[i]);
        } else if (seagullDirections[i] < 0 && (seagulls[i].x + seagulls[i].w) < 0) {
            seagullDirections[i] = setSeagullDirection(30, false);
            resetSeagullSize(seagullDirections[i]);
        }
    }
}

function resetSeagullSize(seagull) {
    let rng = (Math.floor(Math.random() * 81) + 20) / 100;
    let w = seagullInfo.w * rng;
    let h = seagullInfo.h * rng;

    seagull.w = w;
    seagull.h = h;
}

function drawBGs() {
    ctx.drawImage(AM.images.startbg.img, 0, 0, AM.images.startbg.cw, AM.images.startbg.ch, 0, 0, canvas.width, canvas.height);
    // ctx.drawImage(AM.images.sky.img, 0, 0, 926, 429, 0, 0, canvas.width, canvas.height);
                
    // ctx.beginPath();
    // ctx.fillStyle = '#70D2ED';
    // ctx.rect(0, bgInfo.water.y, canvas.width, bgInfo.water.h);
    // ctx.fill();

    drawClouds();

    // ctx.drawImage(AM.images.sand2.img, 0, 0, bgInfo.sand2.cw, bgInfo.sand2.ch, 0, bgInfo.sand2.y, canvas.width, bgInfo.sand2.h);
    // ctx.drawImage(AM.images.sand.img, 0, 0, bgInfo.sand.cw, bgInfo.sand.ch, 0, bgInfo.sand.y, canvas.width, bgInfo.sand.h);

    // ctx.drawImage(AM.images.umbrella.img, 0, 0, bgInfo.umbrella.cw, bgInfo.umbrella.ch, 
    //     bgInfo.umbrella.x, bgInfo.umbrella.y, bgInfo.umbrella.w, bgInfo.umbrella.h);

    // ctx.drawImage(AM.images.palm.img, 0, 0, bgInfo.palm.cw, bgInfo.palm.ch, 
    //     bgInfo.palm.x, bgInfo.palm.y, bgInfo.palm.w, bgInfo.palm.h);

    // ctx.drawImage(AM.images.palmshadow.img, 0, 0, bgInfo.palmshadow.cw, bgInfo.palmshadow.ch, 
    //     bgInfo.palmshadow.x, bgInfo.palmshadow.y, bgInfo.palmshadow.w, bgInfo.palmshadow.h);

    // ctx.drawImage(AM.images.kayak.img, 0, 0, bgInfo.kayak.cw, bgInfo.kayak.ch, 
    //     bgInfo.kayak.x, bgInfo.kayak.y, bgInfo.kayak.w, bgInfo.kayak.h);
}

function drawClouds() {
    ctx.drawImage(AM.images.cloudleft.img, 0, 0, bgInfo.cloudleft.cw, bgInfo.cloudleft.ch, 
        bgInfo.cloudleft.x, bgInfo.cloudleft.y, bgInfo.cloudleft.w, bgInfo.cloudleft.h);

    ctx.drawImage(AM.images.cloudright.img, 0, 0, bgInfo.cloudright.cw, bgInfo.cloudright.ch, 
        bgInfo.cloudright.x, bgInfo.cloudright.y, bgInfo.cloudright.w, bgInfo.cloudright.h);
    
    for (let i = 1; i < 4; ++i) {
        let key = 'cloud' + i;
        ctx.drawImage(AM.images[key].img, 0, 0, bgInfo[key].cw, bgInfo[key].ch, 
            bgInfo[key].x, bgInfo[key].y, bgInfo[key].w, bgInfo[key].h);
    }
}

function init() {
    while (turtles.length > 0) {
        turtles.pop();
    }

    turtles.length = 0;
    turtles = null;
    turtles = [];

    swaps.length = 0;
    swaps = null;
    swaps = [];

    turtlePos.length = 0;
    turtlePos = null;
    turtlePos = [];

    lives = topHUDInfo.life.lives;
    // lives = 0;
    score = 0;
    rounds = 0;

    for (let i = 0; i < 3; ++i) {
        addTurtle();
    }

    // console.log(turtles.length, swaps.length, turtlePos.length);

    updateTurtleInitialPos();
    timer.setTimer(showTurtleDuration);
    timeProgressBar.update(delta, 100);

    showTarget = true;

    gameover = false;
    // TXT.addText(TEXT_ID.FINALSCORE, zeroPad(25, 2), 'bold', 20, 'Montserrat', canvas.width / 2, shineInfo.y + shineInfo.h * 0.8, 65, 60, '#fff', true);
    canReset = false;
    msg = '';
    fade = false;
    pulseT = 0;

    showAnswerT = 0;
    showUnhappyT = 0;
    selectedTurtlePos = -1;
    answerIdx = -1;

    target = Math.floor(Math.random() * turtles.length);
    turtles[target].activateSpriteAnimation = true;
    turtles[target].clipX = 0;
    turtles[target].clipAnimT = 0;
    speed = 3;
}

function initTopHUD() {
    let isMobile = detectMob();
    let progressAdjX = 0;
    let progressAdjW = 100;
    let scoreAdjW = 0;
    let scoreAdjX = 0;

    if (isMobile) {
        // topHUD.timer.timecircle.w = 75;
        // topHUD.timer.timecircle.h = 75;
        // topHUD.timer.stopwatch.w = 75;
        // topHUD.timer.stopwatch.h = 75;
        // topHUDInfo.timer.progress.h = 35;
        // // topHUDInfo.timer.progress.x = 30;
        // topHUDInfo.timer.progress.max = 167;
        // topHUDInfo.timer.text.fontsize = 18;
        // topHUDInfo.timer.text.rectSize = 35;
        // topHUDInfo.timer.text.y = 1;

        progressAdjX = 50 * scaleX;
        progressAdjW = 200;
        scoreAdjW = 30 * scaleX;
        

        // topHUDInfo.timer.w = 300;
        // topHUDInfo.timer.progress.h = 35;

        // (/iPad|iPhone|iPod/).test(navigator.userAgent);
        let sx = 844 / canvas.width;
        // let sy = 390 / canvas.height;

        // topHUDInfo.score.w = 130 + scoreAdjW;
        // topHUDInfo.score.h = 70;
        // topHUDInfo.score.pw = 195;
        // topHUDInfo.score.y = 3;

        scoreAdjX = 12;

        // topHUD.score.turtleshine.w = 65;
        // topHUD.score.turtleshine.h = 65;

        // topHUDInfo.score.fontX = 15;
        // topHUDInfo.score.fontsize = 20;
        // topHUDInfo.score.fontsize2 = 20;
        topHUDInfo.life.y = 5;
    } else {
        // topHUDInfo.timer.w = topHUD.timer.timecircle.w / 2 + 100 * scaleX;
    }

    rescaleSize(topHUD.timer.timecircle, scaleX, scaleX);
    rescaleSize(topHUD.timer.stopwatch, scaleX, scaleX);
    rescaleSize(topHUD.score.turtleshine, scaleX, scaleX);
    // rescaleAll(topHUD.score.turtleshine);
    
    rescaleSize(topHUDInfo, scaleX, scaleX);
    let volumeAdjX = volumeInfo.x + volumeInfo.w;

    console.log(volumeAdjX);

    topHUDInfo.timer.w = topHUD.timer.timecircle.w / 2 + progressAdjW * scaleX;
    topHUDInfo.timer.progress.h *= scaleX;
    
    // topHUDInfo.timer.progress.x = topHUDInfo.w / 2 - topHUDInfo.timer.w / 2 + volumeAdjX * 2;
    // topHUDInfo.timer.progress.x = volumeAdjX * 1.75;

    topHUDInfo.timer.x = volumeInfo.x + volumeInfo.w + 10 * scaleX;
    topHUDInfo.timer.progress.x = topHUDInfo.timer.x + topHUD.timer.timecircle.w / 2;
    // topHUDInfo.timer.x = topHUDInfo.timer.progress.x - topHUD.timer.timecircle.w / 2;
    // topHUDInfo.timer.y = topHUDInfo.h / 2 - topHUD.timer.timecircle.h / 2;
    topHUDInfo.timer.y = volumeInfo.y + volumeInfo.h / 2 - topHUD.timer.timecircle.h / 2 - 3 * scaleY;

    topHUDInfo.timer.progress.y = topHUDInfo.timer.y + (topHUD.timer.timecircle.h / 2 - topHUDInfo.timer.progress.h);
    // topHUDInfo.timer.progress.y = (topHUDInfo.h / 2 - topHUDInfo.timer.progress.h / 2);
    topHUDInfo.timer.text.x = topHUDInfo.timer.x + topHUDInfo.timer.text.rectSize * scaleX / 2;
    // topHUDInfo.timer.text.y += topHUDInfo.timer.y + topHUD.timer.timecircle.h / 2;
    topHUDInfo.timer.text.y += topHUDInfo.timer.progress.y;
    
    topHUDInfo.score.w *= scaleX;
    topHUDInfo.score.h *= scaleY;
    topHUDInfo.score.pw *= scaleX;
    

    let sx = canvas.width / 2 - topHUDInfo.w / 2;
    // topHUDInfo.score.x = sx + (topHUDInfo.w  - topHUDInfo.score.w) / 2;
    topHUDInfo.score.x = sx + (topHUDInfo.w - topHUDInfo.score.pw) / 2 - scoreAdjX;
    topHUDInfo.score.y += topHUDInfo.timer.y;

    topHUDInfo.score.fontX += topHUDInfo.score.x + (topHUDInfo.w - topHUDInfo.score.pw) / 2 + 10 * scaleX;
    topHUDInfo.score.fontY += topHUDInfo.score.y + topHUDInfo.score.h / 2;
    // topHUDInfo.score.fontY += topHUDInfo.timer.y;
    topHUDInfo.score.fontXadj *= scaleX;

    topHUDInfo.life.w *= scaleX;
    topHUDInfo.life.h *= scaleX;
    topHUDInfo.life.pad = 20 * scaleX;
    let lifeW = topHUDInfo.life.pad * 2 + topHUDInfo.life.w * topHUDInfo.life.lives;
    sx = (canvas.width - topHUDInfo.w);
    // topHUDInfo.life.x = sx + (topHUDInfo.w - lifeW) / 2;
    topHUDInfo.life.x = canvas.width - topHUDInfo.life.w * 3 - topHUDInfo.life.pad * 3;
    topHUDInfo.life.y += topHUDInfo.timer.y;
}

function generateSwaps() {
    let n = [...new Array(turtles.length).keys()];
    shuffleArr(n);
    return n;
}

function addTurtle() {
    // const tmp = [0, 5, 9];
    let turtle = new Spirte(0, 0, turtleInfo.w, turtleInfo.h, turtleInfo.cw, turtleInfo.ch);
    turtle.setBucketSize(turtleInfo.bucketSize);
    turtle.pos = turtles.length;
    turtlePos.push(turtles.length);
    turtles.push(turtle);
}

function drawTurtle() {
    for (let i = 0; i < turtles.length; ++i) {
        // turtles[i].draw(ctx, AM.images.shell.img);
        // if ((showTarget && i == target && showAnswerT == 0) || answerIdx == i) {
        if (showAnswerT > 0 && answerIdx == i) {
            if (answerIdx > -1) {
                // if (msg == TEXT_ID.WRONG || msg == TEXT_ID.TOOSLOW || msg > 17) {
                if (!turtleSpeechInfo.isCorrect) {
                    if (msg != TEXT_ID.TOOSLOW) {
                        let j = selectedTurtlePos;
                        // ctx.save();

                        // // move to the center of the canvas
                        // ctx.translate(turtles[j].ox + turtles[j].w / 2, turtles[j].oy + turtles[j].h / 2);
                        
                        // turtles[j].degrees = Math.sin(showAnswerT * 20) * 15;
                        // // rotate the canvas to the specified degrees
                        // ctx.rotate(turtles[j].degrees * Math.PI/180);

                        // // draw the image
                        // turtles[j].x = -0.5 * turtles[j].w;
                        // turtles[j].y = -0.5 * turtles[j].h;
                        // turtles[j].draw(ctx, AM.images.shell.img);

                        // // we’re done with the rotating so restore the unrotated context
                        // // turtles[j].x = turtles[j].ox;
                        // // turtles[j].y = turtles[j].oy;
                        // ctx.restore();

                        ctx.save();
                        // Untransformed draw position
                        const position = {x: turtles[j].x, y: turtles[j].y};
                        // In degrees
                        const rotation = { x: 0, y: 0, z: Math.sin(showAnswerT * 20) * 15 };
                        // Rotation relative to here (this is the center of the image)
                        const rotPt = { x: turtles[j].w / 2, y: turtles[j].h / 2 };
                        // const rotPt = { x: rx, y: ry };

                        ctx.setTransform(new DOMMatrix()
                            .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
                            .rotateSelf(rotation.x, rotation.y, rotation.z)
                        );
                        
                        ctx.drawImage(AM.images.shell.img, 0, 0, AM.images.shell.cw, AM.images.shell.ch, -rotPt.x, -rotPt.y, turtles[j].w, turtles[j].h);
                        ctx.restore();
                    }

                    let frame = Math.floor(showUnhappyT * 5);
                    if (frame > 6) frame = 6;

                    turtles[i].dynamicDraw2(ctx, AM.images.turtleunhappy.img, AM.images.turtleunhappy.cw * frame, 0, 
                        AM.images.turtleunhappy.cw, AM.images.turtleunhappy.ch);
                } else {
                    turtles[i].y -= turtles[i].jump;
                    turtles[i].jump -= G * delta * 5;
                    // turtles[i].jump -= 9.8 * delta * 5;
                    if (turtles[i].y > turtles[i].oy) {
                        turtles[i].y = turtles[i].oy;
                        turtles[i].jump = jumpHeight;
                    }

                    turtles[i].animateSprite(delta, turtlehappyInfo, 8, 8, true);
                    turtles[i].draw(ctx, AM.images.turtlehappy.img, 1, turtlehappyInfo);
                    // if (turtles[i].activateSpriteAnimation) {
                    // } else {
                    //     turtles[i].draw(ctx, AM.images.turtle.img);
                    // }
                }
                
            } else {
                // turtles[i].animateSprite(delta, turtlehideInfo, 5, 7);
                // if (turtles[i].activateSpriteAnimation) {
                //     turtles[i].draw(ctx, AM.images.turtlehide.img, 1, turtlehideInfo);
                // } else {
                //     turtles[i].draw(ctx, AM.images.shell.img, 1, turtlehideInfo);
                // }
                // turtles[i].draw(ctx, AM.images.shell.img);
            }
        } else {
            // if (i != selectedTurtlePos) {
            //     turtles[i].draw(ctx, AM.images.shell.img);
            // }
            
            // for (let j = 0; j < turtles.length; ++j) {

            //     if (turtles[j].y != turtles[i].y) {
            //         console.log('test');
            //     }
            // }

            if (showTarget && i == target) {
                if (timer.timer < 30) {
                    turtles[i].animateSprite(delta, turtlehideInfo, 5, 7);
                    if (turtles[i].activateSpriteAnimation) {
                        

                        turtles[i].draw(ctx, AM.images.turtlehide.img, 1, turtlehideInfo);
                    } else {
                        turtles[i].draw(ctx, AM.images.shell.img, 1, turtlehideInfo);
                    }
                } else {
                    turtles[i].clipX = 0;
                    turtles[i].draw(ctx, AM.images.turtlehide.img, 1, turtlehideInfo);
                }
                
            } else {
                if (i != selectedTurtlePos) {
                    turtles[i].clipX = 0;
                    turtles[i].draw(ctx, AM.images.shell.img);
                }
            }

            
        }
    }
}


function shellSwap(i, j) {
    let p1 = turtles[i].pos;
    let p2 = turtles[j].pos;

    turtles[i].goto(p2, 0);
    turtles[j].goto(p1, turtleInfo.bucketSize / 2);
}

function updateTurtleInitialPos() {
    let dim = turtleInfo.bucketSize;
    let y = canvas.height - dim / 2 * 2;
    let x = canvas.width / 2 - dim * turtles.length / 2 + (dim / 2 - turtleInfo.w / 2);
    
    for (let i = 0; i < turtles.length; ++i) {
        turtles[i].x = turtles[i].pos * dim + x;
        turtles[i].ox = turtles[i].pos * dim + x;
        turtles[i].y = y;
        turtles[i].oy = y;
        turtles[i].setBucketSize(turtleInfo.bucketSize);
    }
}

function updateTurtlePos(i) {
    let dim = turtleInfo.bucketSize;
    let y = canvas.height - dim / 2 * 2;
    let x = canvas.width / 2 - dim * turtles.length / 2 + (dim / 2 - turtleInfo.w / 2);

    turtles[i].x = turtles[i].pos * dim + x;
    turtles[i].ox = turtles[i].pos * dim + x;
    turtles[i].y = y;
    turtles[i].oy = y;
    turtles[i].setBucketSize(turtleInfo.bucketSize);
}

function loadAssets() {
    for (let k in images) {
        assets.load(images[k].obj, images[k].src);
    }

    for (let k in music) {
        sounds.load(music[k].obj, music[k].src, music[k].ext);
    }
}

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

function isPortrait() {
    return window.innerHeight > window.innerWidth;
}

function isBtnClicked(mx, my, btn) {
    return (mx >= btn.x && mx <= btn.x + btn.w && my >= btn.y && my <= btn.y + btn.h);
}

function clickBucket(mx, my) {
    let dim = turtleInfo.bucketSize;
    let y = canvas.height - dim * 2 + dim / 2;
    let x = canvas.width / 2 - dim * turtles.length / 2;
    let w = dim * turtles.length;

    if (mx >= x && mx <= x + w && my >= y && my <= y + dim) {
        let p = Math.floor((mx - x) / dim);
        return p;
    }
    
    return -1;
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

function checkSwaps() {
    for (let i = swaps.length - 1; i >= 0; --i) {
        let a = swaps[i][0];
        let b = swaps[i][1];

        if (!turtles[a].isAnimating && !turtles[b].isAnimating) {
            swaps.splice(i, 1);
            shellSwap(a, b);
        }
    }
}

function reduceHP() {
    if (--lives < 1) {
        gameover = true;
        // TXT.addText(TEXT_ID.FINALSCORE, zeroPad(score, 2), 'bold', 20, 'Montserrat', canvas.width / 2, shineInfo.y + shineInfo.h * 0.8, 65, 60, '#fff', true); 
        msg = 'Complete!';
        // submitScore();
        HUD.updateGameoverScore(splashInfo, zeroPad(score, 2));
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

function moveClouds() {
    let maxY = canvas.height * 0.3;

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

            // bgInfo[key].y = Math.floor(Math.random() * 200 + 200);
            bgInfo[key].y = Math.floor(Math.random() * maxY);
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

            // bgInfo[key].y = Math.floor(Math.random() * 200 + 200);
            bgInfo[key].y = Math.floor(Math.random() * maxY);
        }
    }
}

function submitScore() {
    // let timeSpent = gameDuration - Math.floor(timer.timer / 24);
    let result = {'game_score': score.toFixed(2), 'activity_id': serverData.id, 'time_spent': Math.floor(totalTimeSpent / 24)};
    Vue.prototype.$postData(result, true);
}

function update() {
    HUD.updateTimerSprite(zeroPad(Math.floor(gameT), 2), gameDuration);

    checkSwaps();

    for (let i = 0; i < turtles.length; ++i) {
        let r = turtles[i].update(speed, delta);
        if (r) {
            updateTurtlePos(i);
        }
    }

    if (startTimer && swaps.length == 0) {
        timer.tick(delta);
        totalTimeSpent += 24 * delta;

        if (timer.timer <= 0) {
            if (msg == '') {
                // msg = 'Too slow!';
                // msg = 'tooslow';
                msg = TEXT_ID.TOOSLOW;
                getSpeech(0, clickBucket(turtles[target].x, turtles[target].y));
                reduceHP();

                if (volumeOn) {
                    setTimeout(() => { 
                        AM.audio.wrong2.img.currentTime = 0;
                        AM.audio.wrong2.img.volume = 0.5;
                        AM.audio.wrong2.img.play();
                    }, 0)
                    
                }
            }
                

            // nextRound();
            showAnswerT = showAnswerDuration;
            answerIdx = target;
            startTimer = false;
            showUnhappyT = 0;
            // turtles[answerIdx].jump = jumpHeight;
        }

        // let percent = timer.timer / (9.0 * 24) * 100;
        // timeProgressBar.update(delta, percent);

        if (delta < 1) {
            gameT -= 1 * delta;
            let percent = gameT / gameDuration * 100;
            timeProgressBar.update(delta, percent);
        }

    } else if (showAnswerT > 0) {
        if (msg) {
            // TM.draw(textList[msg].obj);
            // TXT.draw(msg);
            drawSpeech();
        }

        
        
        showAnswerT -= 1 * delta;
        showUnhappyT += 1 * delta;
        if (showAnswerT <= 0) {
            showAnswerT = 0;
            showUnhappyT = 0;
            selectedTurtlePos = -1;
            turtles[answerIdx].jump = 0;
            turtles[answerIdx].y = turtles[answerIdx].oy;

            if (rounds < totalRounds) {
                nextRound();
            } else {
                // alert('You scored: ' + score + ' out of ' + rounds + '.');
                gameover = true;
                // TXT.addText(TEXT_ID.FINALSCORE, zeroPad(score, 2), 'bold', 20, 'Montserrat', canvas.width / 2, shineInfo.y + shineInfo.h * 0.8, 65, 60, '#fff', true);
                // submitScore();
                HUD.updateGameoverScore(splashInfo, zeroPad(score, 2));
            }
        }
    } else if (showTarget) {
        // timer.draw(ctx);
        timer.tick(delta);
        let key = 'speech_ready_1_';

        if (timer.timer < 25) {
            key = 'speech_ready_2_';
        }

        drawReadySpeech(key);
        
            // drawMessage(msg);

        if (timer.timer <= 0) {
            timer.setTimer(9);
            showTarget = false;
            selectedTurtlePos = -1;
            startTimer = true;
            msg = '';
            sorts.bubble();

            
        }
    }

    moveClouds();
    updateSeagulls();
}

function nextRound() {
    timer.setTimer(showTurtleDuration);
    showTarget = true;
    startTimer = false;
    answerIdx = -1;
    showAnswerT = 0;
    showUnhappyT = 0;
    selectedTurtlePos = -1;
    target = Math.floor(Math.random() * turtles.length);
    // target = turtles.length - 1;
    // timeProgressBar.update(delta, 100);
    
    if (turtles.length < 8) {
        addTurtle();
        
        // turtles[target].activateSpriteAnimation = true;
        // if (turtles.length > 7) {
        //     setBucketSizes();
        // }
        updateTurtleInitialPos();
    } else {
        
        speed += 0.5;
        updateTurtleInitialPos();
    }

    turtles[target].activateSpriteAnimation = true;
    turtles[target].clipX = 0;
    turtles[target].clipAnimT = 0;

    rounds++;
}

function drawMessage(str) {
    if (str != 'Correct!')
        ctx.fillStyle = '#fb2121';
    else 
        ctx.fillStyle = '#fff';
        // ctx.fillStyle = '#b1dd47';

    let adjX = str.length * (str != 'Correct!' ? 47 : 40) * scaleX;

    ctx.font = 'bold ' + textPos.fontsize + 'px Montserrat';
    ctx.fillText(str, textPos.x - adjX / 2, textPos.y);
}

function displayMsg(str, fontsize, color, x, y) {
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.font = 'bold ' + fontsize + 'px Montserrat';
    ctx.fillText(str, x, y);
}

function drawResetMessage() {
    let adjX = 700 * scaleX;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold ' + textPos.fontsize + 'px Montserrat';
    // ctx.fillText('Tap to play again.', textPos.x - adjX / 2, textPos.y + resetMsgY * scaleY);
    ctx.fillText('Tap to play again.', textPos.x - adjX / 2, canvas.height / 2);
}

function drawBuckets(n) {
    let dim = turtleInfo.bucketSize;
    let y = canvas.height - dim * 2;
    let x = canvas.width / 2 - dim * n / 2;
    for (let i = 0; i < n; ++i) {
        ctx.beginPath();
        ctx.rect(i * dim + x, y, dim, dim);
        ctx.stroke();
    }
}

function zeroPad(num, places) {
    return String(num).padStart(places, '0');
}

function drawTopHUD() {
    const { x, y, w, h } = topHUDInfo.timer;
    
    ctx.drawImage(AM.images.timecircle.img, 0, 0, topHUD.timer.timecircle.cw, 
        topHUD.timer.timecircle.ch, x, y, topHUD.timer.timecircle.w, topHUD.timer.timecircle.h);

    ctx.drawImage(AM.images.stopwatch.img, 0, 0, topHUD.timer.stopwatch.cw, 
        topHUD.timer.stopwatch.ch, x, y, topHUD.timer.stopwatch.w, topHUD.timer.stopwatch.h);
    
    let volumeKey = 'mute';
    if (volumeOn) {
        volumeKey = 'volume';
    }

    ctx.drawImage(AM.images[volumeKey].img, 0, 0, volumeInfo.cw, 
        volumeInfo.ch, volumeInfo.x, volumeInfo.y, volumeInfo.w, volumeInfo.h);
    
    // ctx.font = 'bold ' + topHUDInfo.timer.text.fontsize + 'px Montserrat';
    // ctx.fillStyle = 'black';
    // ctx.textBaseline = 'middle';

    
    // let timeText = showTarget ? '09' : zeroPad(Math.floor(timer.timer / 24), 2);
    // textList.topTimer.obj.str = timeText;
    // TM.draw(textList.topTimer.obj);
    // TXT.texts[TEXT_ID.TOPTIMER].str = timeText;
    // TXT.texts[TEXT_ID.TOPTIMER].str = Math.floor(gameT);
    // TXT.draw(TEXT_ID.TOPTIMER);

    

    // ctx.fillText(timeText, topHUDInfo.timer.text.x, topHUDInfo.timer.text.y);
    // ctx.fillText('25', topHUD.timer.timecircle.w / 2 - 23 / 2, topHUD.timer.timecircle.h / 2 + 3);
}

function drawLives() {
    const { x, y, w, h, pad } = topHUDInfo.life;
    
    for (let i = 0; i < lives; ++i) {
        ctx.drawImage(AM.images.turtle.img, 0, 0, turtleInfo.cw, turtleInfo.ch, x + i * w + i * pad, HUD.score_rect.y, w, h);
    }
    
}

function drawRects() {
    const { w, h } = topHUDInfo;

    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(canvas.width / 2 - w / 2, 0, w, h);
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(canvas.width - w, 0, w, h);
    ctx.stroke();
}

function drawScoreHUD() {
    // const h = 50;
    
    // const progW = 100;
    // let x = canvas.width / 2;
    // let y = topHUD.timer.timecircle.h / 2 - h / 2 + 30;

    // const { x, y, w, h, pw } = topHUDInfo.score;
    const { x, y } = topHUDInfo.score;
    // let w = 180 * scaleX;
    // let h = 75 * scaleY;
    // let x = canvas.width / 2 - ((h / 2) + w) / 2;
    // let y = 20 * scaleY;
    
    // // const p = pw;
    // let p = w;
    
    // /* To visalize ------------------------------------------------------*/
    // ctx.beginPath();
    // ctx.arc(h / 2 + x, h / 2 + y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
    // ctx.lineTo(w + x, 0 + y);
    // ctx.arc((h / 2) + w + x, h / 2 + y, h / 2, 3 / 2 *Math.PI,Math.PI / 2);
    // ctx.lineTo(h / 2 + x, h + y);
    // ctx.strokeStyle = '#fff';
    // ctx.lineWidth = 5;
    // ctx.stroke();
    // ctx.closePath();

    // ctx.beginPath();
    // ctx.arc(h / 2 + x, h / 2 + y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
    // ctx.lineTo(w + x, 0 + y);
    // ctx.arc((h / 2) + p + x, h / 2 + y, h / 2, 3 / 2 *Math.PI,Math.PI / 2);
    // ctx.lineTo(h / 2 + x, h + y);
    // ctx.fillStyle = '#569E1A';
    // // ctx.lineWidth = 5;
    // ctx.fill();
    // ctx.closePath();
    /* ------------------------------------------------------------------*/


    // ctx.beginPath();
    // ctx.arc(h / 2 + x, h / 2+ y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
    // ctx.lineTo(p - 2 * h + x, 0 + y);
    // ctx.arc(p - (h / 2) + x, h / 2 + y, h / 2, 3 / 2 * Math.PI,Math.PI / 2);
    // ctx.lineTo(h / 2 + x, h + y);
    // ctx.fillStyle = "#569E1A";
    // ctx.fill();
    // ctx.strokeStyle = '#fff';
    // ctx.stroke();

    ctx.drawImage(AM.images.turtleshine.img, 0, 0, topHUD.score.turtleshine.cw, 
        topHUD.score.turtleshine.ch, scoreProgressBar.x + 10 * scaleX, 30 * scaleY, topHUD.score.turtleshine.w, topHUD.score.turtleshine.h);

    // TM.draw(textList.scoreX.obj);
    // TXT.draw(TEXT_ID.SCOREX);
    // textList.scoreN.obj.str = zeroPad(score, 2);
    // TM.draw(textList.scoreN.obj);
    // TXT.texts[TEXT_ID.SCORE].str = zeroPad(score, 2);
    // TXT.draw(TEXT_ID.SCORE);
}

function drawProgress() {
    // const { w } = topHUDInfo.timer;
    let w = 200 * scaleX;
    // let w =
    // const { x, y, h, max } = topHUDInfo.timer.progress;
    const { x, max } = topHUDInfo.timer.progress;
    let y = topHUDInfo.timer.progress.y;
    // let y = 35 * scaleY;
    let h = 35 * scaleY;
    // let p = showTarget ? max * scaleX : (max * scaleX * (timer.timer / (9.0 * 24)));
    let p = showTarget ? w : (w * (timer.timer / (9.0 * 24)));

    // if ((h / 2) - p > 0) {
    //     p = 0;
    // }

    // const grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
    const grd = ctx.createLinearGradient(0, 0, 0, p);
    // grd.addColorStop(0, "#F8E7CD");
    // grd.addColorStop(1, "#FEB466"); 

    let percent = p / (max * scaleX);

    // let pColor = '';

    // if (percent > 0.7) {
    //     pColor = '#4ED20E';
    // } else if (percent > 0.20) {
    //     pColor = '#83DF56';
    // } else {
    //     pColor = '#fb2121';
    // }
    
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

    ctx.beginPath();
    ctx.arc(h / 2 + x, h / 2 + y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
    ctx.lineTo(w + x, 0 + y);
    ctx.arc((h / 2) + p + x, h / 2 + y, h / 2, 3 / 2 *Math.PI,Math.PI / 2);
    ctx.lineTo(h / 2 + x, h + y);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.closePath();

    // if(p <= h){
    //     // ctx.beginPath();
    //     // ctx.arc(h / 2 + x, h / 2 + y, h / 2, Math.PI - Math.acos((h - p) / h), Math.PI + Math.acos((h - p) / h));
    //     // ctx.save();
    //     // ctx.scale(-1, 1);
    //     // ctx.arc((h / 2) - p + x, h / 2 + y, h / 2, Math.PI - Math.acos((h - p) / h), Math.PI + Math.acos((h - p) / h));
    //     // ctx.restore();
    //     // ctx.fillStyle = grd;
    //     // ctx.fill();
    // } else {
    //     ctx.beginPath();
    //     ctx.arc(h / 2 + x, h / 2+ y, h / 2, Math.PI / 2, 3 / 2 *Math.PI);
    //     ctx.lineTo(p - 2 * h + x, 0 + y);
    //     ctx.arc(p - (h / 2) + x, h / 2 + y, h / 2, 3 / 2 *Math.PI,Math.PI / 2);
    //     ctx.lineTo(h / 2 + x, h + y);
    //     // ctx.fillStyle = grd;
    //     ctx.fillStyle = pColor;
    //     ctx.fill();
    // }
}

function drawStartPage() {
    ctx.drawImage(AM.images.intro.img, 0, 0, AM.images.intro.cw, AM.images.intro.ch, splashInfo.x, splashInfo.y, splashInfo.w, splashInfo.h);

    let mid = canvas.width / 2 - startPageInfo.hand.w / 2;
    let x = startPageInfo.hand.x - 455 * scaleX;
    let hy = onTablet ? 820 : 280;
    let y = splashInfo.y + hy * splashInfo.sx;
    
    let n = Math.floor(startScreenHandAnimT * 0.75);
    let frame = n % 12;

    if (Math.floor(n / 12) & 1) {
        frame = 11 - frame;
    }

    ctx.drawImage(AM.images.show_turtle.img, frame * AM.images.show_turtle.cw, 0, AM.images.show_turtle.cw, AM.images.show_turtle.ch, 
        x, y, startPageInfo.turtle.w, startPageInfo.turtle.h);

    frame = Math.floor(startScreenHandAnimT) % 8;
                
    ctx.drawImage(AM.images.hand.img, frame * startPageInfo.hand.cw, 0, startPageInfo.hand.cw, startPageInfo.hand.ch, mid, y, startPageInfo.hand.w, startPageInfo.hand.h);

    x = startPageInfo.hand.x + 440 * scaleX;
    frame = Math.floor(startScreenHandAnimT * 5) % 10;

    ctx.drawImage(AM.images.shake_turtle.img, frame * AM.images.shake_turtle.cw, 0, AM.images.shake_turtle.cw, AM.images.shake_turtle.ch, 
        x, y, startPageInfo.shell.w, startPageInfo.shell.h);

    if (delta < 1) {
        // startTurtleBlinkT += 2 * delta;
        startScreenHandAnimT += 5 * delta;
    }
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    // if (assets.loaded == assets.count && sounds.loaded == sounds.count) {
    // if (assets.loaded == assets.count) {
        if (!gameover) {
            if (gameStart) {
                
                // bg
                drawBGs();
                drawSeagulls();
                // hud
                // drawProgress();

                // timeProgressBar.draw(ctx);
                // drawTopHUD();

                // scoreProgressBar.draw(ctx);
                // drawScoreHUD();
                drawLives();

                HUD.draw(ctx);

                // game
                drawTurtle();
                update();

                
            } else {
                drawStartPage();
                // let handx = Math.sin(startScreenHandAnimT) * 20;

                // // ctx.drawImage(AM.images.splash.img, 0, 0, 927, 429, 0, 0, canvas.width, canvas.height);
                // ctx.drawImage(AM.images.startbg.img, 0, 0, 927, 429, 0, 0, canvas.width, canvas.height);
                // ctx.drawImage(AM.images.title.img, 0, 0, startPageInfo.title.cw, startPageInfo.title.ch, startPageInfo.title.x, startPageInfo.title.y, startPageInfo.title.w, startPageInfo.title.h);
                
                // let frame = Math.floor(startScreenHandAnimT) % 8;
                
                // ctx.drawImage(AM.images.hand.img, frame * startPageInfo.hand.cw, 0, startPageInfo.hand.cw, startPageInfo.hand.ch, startPageInfo.hand.x, startPageInfo.hand.y, startPageInfo.hand.w, startPageInfo.hand.h);
                // // tap
                // // ctx.save();
                // // // Untransformed draw position
                // // var position = {x: startPageInfo.hand.x, y: startPageInfo.hand.y};
                // // // In degrees
                // // var rotation = { x: 0, y: Math.sin(startScreenHandAnimT) * 35, z: 0};
                // // // Rotation relative to here (this is the center of the image)
                // // var rotPt = { x: startPageInfo.hand.w / 2, y: startPageInfo.hand.h / 2 };

                // // ctx.setTransform(new DOMMatrix()
                // //     .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
                // //     .rotateSelf(rotation.x, rotation.y, rotation.z)
                // // );
                
                // // ctx.drawImage(AM.images.hand.img, 0, 0, startPageInfo.hand.cw, startPageInfo.hand.ch, -rotPt.x, -rotPt.y, startPageInfo.hand.w, startPageInfo.hand.h);
                // // ctx.restore();
                // //
                // // ctx.drawImage(AM.images.hand.img, 0, 0, startPageInfo.hand.cw, startPageInfo.hand.ch, startPageInfo.hand.x + handx, startPageInfo.hand.y, startPageInfo.hand.w, startPageInfo.hand.h);
                
                // let t = Math.floor(startTurtleBlinkT);
                // t = t % 8;
                // let clipX = t * startPageInfo.turtle.cw;
                

                // ctx.drawImage(AM.images.turtlehappy.img, clipX, 0, startPageInfo.turtle.cw, startPageInfo.turtle.ch, startPageInfo.turtle.x, startPageInfo.turtle.y, startPageInfo.turtle.w, startPageInfo.turtle.h);
                

                // // Untransformed draw position
                // position = {x: startPageInfo.shell.x, y: startPageInfo.shell.y};
                // // In degrees
                // rotation = { x: 0, y: startScreenHandAnimT * 10, z: 0};
                // // Rotation relative to here (this is the center of the image)
                // rotPt = { x: startPageInfo.shell.w / 2, y: startPageInfo.shell.h / 2 };

                // ctx.save();
                // ctx.setTransform(new DOMMatrix()
                //     .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
                //     .rotateSelf(rotation.x, rotation.y, rotation.z)
                // );
                // // ctx.drawImage(AM.images.startcoin.img, 0, 0, AM.images.startcoin.cw, AM.images.startcoin.ch, -rotPt.x, -rotPt.y, startPage.startcoin.w, startPage.startcoin.h);
                // ctx.drawImage(AM.images.shell.img, 0, 0, startPageInfo.shell.cw, startPageInfo.shell.ch, -rotPt.x, -rotPt.y, startPageInfo.shell.w, startPageInfo.shell.h);
                // ctx.restore();

                // // for (let i = 1; i < 4; ++i) {
                // //     let key = 'text' + i;
                // //     ctx.drawImage(AM.images[key].img, 0, 0, startPageInfo[key].cw, startPageInfo[key].ch, startPageInfo[key].x, startPageInfo[key].y, startPageInfo[key].w, startPageInfo[key].h);
                // // }

                // TXT.draw('text1_1');
                // TXT.draw('text1_2');

                // TXT.draw('text2_1');
                // TXT.draw('text2_2');

                // TXT.draw('text3_1');
                // TXT.draw('text3_2');

                // ctx.drawImage(AM.images.beginbutton.img, 0, 0, startPageInfo.beginbutton.cw, startPageInfo.beginbutton.ch, startPageInfo.beginbutton.x, startPageInfo.beginbutton.y, startPageInfo.beginbutton.w, startPageInfo.beginbutton.h);
                // // TXT.draw(0);
                // // ctx.drawImage(AM.images.turtleshine.img, 0, 0, topHUD.score.turtleshine.cw, 
                // //     topHUD.score.turtleshine.ch, 0, 0, topHUD.score.turtleshine.w, topHUD.score.turtleshine.h);
                // // ctx.beginPath();
                // // ctx.rect(btnBegin.x, btnBegin.y, btnBegin.w, btnBegin.h);
                // // ctx.stroke();

                // // drawTextInBox('Testing', 'Montserrat', 0, 0, 500, 100);
                // // TM.draw(tmpText);

                // if (delta < 1) {
                //     startTurtleBlinkT += 2 * delta;
                //     startScreenHandAnimT += 5 * delta;
                // }
            }
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            HUD.gameover(ctx, splashInfo, delta);
            // if (!fade) {
            //     // bg
            //     drawBGs();
            //     drawSeagulls();
            //     // hud
            //     // drawProgress();
            //     timeProgressBar.draw(ctx);

            //     drawTopHUD();
            //     scoreProgressBar.draw(ctx);
                
            //     drawScoreHUD();
            //     drawLives();

            //     // game
            //     drawTurtle();
            //     // update();

            //     ctx.save();
            //     ctx.globalAlpha = 0.85;
            //     ctx.fillStyle = '#000';
            //     ctx.fillRect(0, 0, canvas.width, canvas.height);
            //     ctx.restore();
            //     // ctx.globalAlpha = 1.0;

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
            //     let y = shineInfo.y + (shineInfo.h / 2 - h / 2);
            //     ctx.drawImage(AM.images.shine.img, 0, 0, shineInfo.cw, 
            //         shineInfo.ch, x, y, w, h);
                

            //     // ctx.drawImage(AM.images.shine.img, 0, 0, shineInfo.cw, 
            //     //     shineInfo.ch, shineInfo.x, shineInfo.y, shineInfo.w, shineInfo.h);
                
            //     x = shineInfo.x + (shineInfo.w / 2 - turtleInfo.w / 2);
            //     y = shineInfo.y + (shineInfo.h / 2 - turtleInfo.h / 2 - 10 * scaleY);
            //     ctx.drawImage(AM.images.turtle.img, 0, 0, turtleInfo.cw, 
            //         turtleInfo.ch, x, y, turtleInfo.w, turtleInfo.h);
                
            

            //     // TM.draw(textList.complete.obj);
            //     // TM.draw(textList.scoreLabel.obj);
            //     // textList.finalScore.obj.str = zeroPad(score, 2);
            //     // TM.draw(textList.finalScore.obj);
            //     // TM.draw(textList.resetMsg.obj);
            //     // score = 11;
            //     TXT.draw(TEXT_ID.COMPLETE);
            //     TXT.draw(TEXT_ID.SCORELABEL);

            //     // TXT.texts[TEXT_ID.FINALSCORE].str = zeroPad(score, 2);
            //     // TXT.addText(TEXT_ID.FINALSCORE, '00', 'bold', 20, 'Montserrat', w / 2, (320 + 145) * scaleY, 65, 60, '#fff', true); 

            //     TXT.draw(TEXT_ID.FINALSCORE);
            //     // TXT.draw(TEXT_ID.RESETMSG);
            // }
            
        }
    // } else {

    // }

    requestAnimationFrame(gameCycle);
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);