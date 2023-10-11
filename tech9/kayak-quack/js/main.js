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


// srpite containers

// limits
var health = 100;
var fishMaxSpeed = 300;
var fishMinSpeed = 50;
var garbageDropSpeed = 500;

// physics
var forceD = 0;
var friction = 0.98;
var F = 750;
var T = 0;
var G = 9.8;
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


var startPage = {
    title: {
        x: 0,
        y: 10,
        w: 467 * 2,
        h: 160 * 2,
    },
    sub_title: {
        x: 0,
        y: 25,
        w: 366 * 2,
        h: 19 * 2,
    },
    duck: {
        x: 440,
        y: 320,
        w: 76 * 2,
        h: 65 * 2,
        t: 0,
        dist: 50,
    },
    hourglass: {
        x: 820,
        y: 320,
        w: 65 * 2,
        h: 65 * 2,
    },
    rock: {
        x: 1210,
        y: 320,
        w: 65 * 2,
        h: 65 * 2,
    },
    text1: {
        x: 360,
        y: 470,
        w: 157 * 2,
        h: 27 * 2,
    },
    text2: {
        x: 740,
        y: 470,
        w: 159 * 2,
        h: 25 * 2,
    },
    text3: {
        x: 1130,
        y: 470,
        w: 153 * 2,
        h: 27 * 2,
    },
}

var fishInfo = {};


var FACE = {
    LEFT: -1,
    RIGHT: 1,
}

var parallaxInfo = {
    water: {
        x: 0,
        y: 0,
        w: 1108, // 606
        h: 0,
        edgeX: 0
    },
    borders: {
        1: {
            x: 0,
            y: 0,
            w: 11,
            h: 0,
            gap: 0
        },
        2: {
            x: 0,
            y: 0,
            w: 22,
            h: 0,
            gap: 0
        },
        
    },
    tile: {
        x: 0,
        y: 0,
        w: 85.5, // 160
        h: 85.5,
        startY: 0,
        tileGap: 0,
        rows: 14,
        cols: 4,
        moveY: 0,
        moveSpeed: 100,
        yPos: [],
    },

}

var kayak = null;
var kayakInfo = {
    x: 0,
    y: 0,
    w: 129.125 * 2,
    h: 187 * 2
}

const terrain = [];
const terrainInfo = {
    0: null,
    1: { id: 'tree1' },
    2: { id: 'tree2' },
    3: { id: 'stone1' },
    4: { id: 'stone2' }
};
var terrainCount = Object.keys(terrainInfo).length;
var terrainChancePercentage = 20;
var terrainSprite = null;
var waterObjectSprite = null;

const plankInfo = {
    1: { id: 'plank1' },
    2: { id: 'plank2' },
}

const duckInfo = {
    1: { id: 'duck' },
}

const lilyInfo = {
    w: 100,
    h: 100
}

const wstoneInfo = {
    w: 160,
    h: 140
}

const logInfo = {
    w: 234 * 0.5,
    h: 125 * 0.5
}

var waterObjects = [];
var waterObjectRows = [new Array(parallaxInfo.tile.rows).fill(-1)];

var totalWaterObjects = 5;
var kayakBounds = {
    left: 0,
    right: 0,
}

var bunnies = [];
var bunnyInfo = {
    w: 40.125 * 1.5,
    h: 46.71 * 1.5,
    clipX: [18.55, 53.55, 87.55, 127.55, 172.55, 205.55, 237.55, 271.55]
}

var currentTop = 0;

var mouseMoveOrigin = {
    x: 0,
    y: 0
};

var kayakHitBox = {
    x: 0,
    y: 0,
    w: 80,
    h: 187 * 1.35
}

var testRect = {
    x: 0,
    y: 0,
    w: 0,
    h: 0
}

var testRect2 = [
    { x: 0, y: 0},
    { x: 0, y: 0},
    { x: 0, y: 0},
    { x: 0, y: 0}
];

var testT = 0;
var doSpeedInc = false;

// pool - 606px
// rect - 12px, 6px
// total width - 926px
// 40 x 128 calculated width for tiled land


// #C7FC12
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

    // console.log(12 / scaleX)

    G *= scaleY;
    F *= scaleX;
    
    // console.log(TXT.texts);
    parallaxInfo.water.w *= scaleX;
    parallaxInfo.water.x = w / 2 - parallaxInfo.water.w / 2;
    parallaxInfo.water.h = h;
    parallaxInfo.water.edgeX = parallaxInfo.water.x + parallaxInfo.water.w;

    parallaxInfo.borders[1].x = parallaxInfo.water.x;
    parallaxInfo.borders[1].h = parallaxInfo.water.h;
    parallaxInfo.borders[1].w *= scaleX;
    parallaxInfo.borders[1].gap = parallaxInfo.water.w - parallaxInfo.borders[1].w;

    parallaxInfo.borders[2].x = parallaxInfo.water.x + parallaxInfo.borders[1].w;
    parallaxInfo.borders[2].h = parallaxInfo.water.h;
    parallaxInfo.borders[2].w *= scaleX;
    parallaxInfo.borders[2].gap = parallaxInfo.borders[1].gap - parallaxInfo.borders[2].w - parallaxInfo.borders[1].w;

    parallaxInfo.tile.w *= scaleX;
    parallaxInfo.tile.h *= scaleY;
    parallaxInfo.tile.startY = h - parallaxInfo.tile.rows * parallaxInfo.tile.h;
    parallaxInfo.tile.tileGap = parallaxInfo.water.x + parallaxInfo.water.w;
    parallaxInfo.tile.moveSpeed *= scaleY;

    for (let i = 0; i < parallaxInfo.tile.rows; ++i) {
        parallaxInfo.tile.yPos[i] = parallaxInfo.tile.startY + i * parallaxInfo.tile.h;
    }

    rescaleSize(bunnyInfo, scaleX, scaleY);
    rescaleSize(kayakInfo, scaleX, scaleY);
    rescaleSize(lilyInfo, scaleX, scaleY);
    rescaleSize(wstoneInfo, scaleX, scaleY);
    rescaleSize(logInfo, scaleX, scaleY);
    rescaleSize(kayakHitBox, scaleX, scaleY);
    
    // kayak = new Sprite(w / 2 - kayakInfo.w / 2, h - kayakInfo.h * 1, kayakInfo.w, kayakInfo.h, 129.125, AM.images.kayak.ch);
    console.log(AM.images.kayak.cw)
    kayak = new Sprite(w / 2 - kayakInfo.w / 2, h - kayakInfo.h * 0.85, kayakInfo.w, kayakInfo.h, AM.images.kayak.cw, AM.images.kayak.ch);
    kayak.screenW = w;
    kayakHitBox.y = kayak.y;
    updateHitBox();

    testRect.x = canvas.width / 2 - kayakHitBox.w / 2;
    // testRect.y = canvas.height / 2 - kayakHitBox.h / 2;
    testRect.y = kayakHitBox.y;
    testRect.w = kayakHitBox.w;
    testRect.h = kayakHitBox.h;

    testRect2[0].x = testRect.x;
    testRect2[0].y = testRect.y;

    testRect2[1].x = testRect.x + testRect.w;
    testRect2[1].y = testRect.y;

    testRect2[2].x = testRect.x + testRect.w;
    testRect2[2].y = testRect.y + testRect.h;

    testRect2[3].x = testRect.x;
    testRect2[3].y = testRect.y + testRect.h;

    // setFishInfo(scaleX, scaleY, 2.5);
    initStartPage();

    // rescaleSize(eelInfo.head, scaleX, scaleY);

    initTerrain(1.5, 1.5);
    initWaterObjects(1, 1);
    initDuck(1.5, 1.5);

    terrainSprite = new StaticSprite(0, 0, 0, 0, 0, 0, 0, 0, ''); // blank sprite
    waterObjectSprite = new StaticSprite(0, 0, 0, 0, 0, 0, 0, 0, ''); // blank sprite

    // duck 

    kayakBounds.left = parallaxInfo.water.x;
    kayakBounds.right = parallaxInfo.water.x + parallaxInfo.water.w;


    TXT = new Text(ctx, w, h); 
    TXT.setScale(scaleX, scaleY);
    
    TXT.addText('points', '+1.00', 'bold', 20, 'Montserrat', 0, 0, 80, 30, '#10aad7', true); 
    jumpHeight *= scaleY;

    timer = new Timer(0, 0, 0, '#fff');
    timer.setTimer(gameDuration);

    HUD = new Template_1(ctx, w, h, scaleX, scaleY);
    
    controls();

    // AM.audio.bg.img.volume = 0.2;
    // AM.audio.bg.img.loop = true;
    // AM.audio.bg.img.play();
    addDuck();
    addDuck();
    addDuck();
    // addDuck();
    // addDuck();

    addLily(1);
    addLily(2);
    addLily(3);

    addWaterStone(1);
    addWaterStone(2);
    addWaterStone(3);

    addLog(1);
    addLog(2);

    addPlank(1, 0, 0);
    addPlank(1, 1, 1);
    addPlank(2, 0, 2);
    
    addBunny(1, 0);
    addBunny(1, 0);
    addBunny(5, 0);

    addBunny(6, 1);
    addBunny(7, 1);


    gameCycle();
}

function addLog(rng) {
    let rngX = Math.floor(Math.random() * (parallaxInfo.water.w - logInfo.w));
    let rngY = parallaxInfo.tile.rows - waterObjects.length - 1; //Math.floor(Math.random() * parallaxInfo.tile.rows);
    // let direction = Math.floor(Math.random() * 2) ? 1 : -1;

    // let rng = Math.floor(Math.random() * 3) + 1;

    let key = 'log' + rng;
    let log = new Sprite(parallaxInfo.water.x + rngX, parallaxInfo.tile.yPos[rngY], logInfo.w, logInfo.h, AM.images[key].cw, AM.images[key].ch);
    log.id = rngY;
    log.key = key;
    // duck.vy = parallaxInfo.tile.moveSpeed;

    // duck.setDirection(direction);
    // duck.setRandomSpeed(100, 50);

    waterObjects.push(log);
    // waterObjectRows[rngY] = waterObjects.length - 1;
}

function addWaterStone(rng) {
    let rngX = Math.floor(Math.random() * (parallaxInfo.water.w - wstoneInfo.w));
    let rngY = parallaxInfo.tile.rows - waterObjects.length - 1; //Math.floor(Math.random() * parallaxInfo.tile.rows);
    // let direction = Math.floor(Math.random() * 2) ? 1 : -1;

    // let rng = Math.floor(Math.random() * 3) + 1;

    let key = 'wstone' + rng;
    let wstone = new Sprite(parallaxInfo.water.x + rngX, parallaxInfo.tile.yPos[rngY], wstoneInfo.w, wstoneInfo.h, AM.images[key].cw, AM.images[key].ch);
    wstone.id = rngY;
    wstone.key = key;
    // duck.vy = parallaxInfo.tile.moveSpeed;

    // duck.setDirection(direction);
    // duck.setRandomSpeed(100, 50);

    waterObjects.push(wstone);
    // waterObjectRows[rngY] = waterObjects.length - 1;
}

function addLily(rng) {
    let rngX = Math.floor(Math.random() * (parallaxInfo.water.w - lilyInfo.w));
    let rngY = parallaxInfo.tile.rows - waterObjects.length - 1; //Math.floor(Math.random() * parallaxInfo.tile.rows);
    let direction = Math.floor(Math.random() * 2) ? 1 : -1;

    // let rng = Math.floor(Math.random() * 3) + 1;

    let key = 'lily' + rng;
    let lily = new Sprite(parallaxInfo.water.x + rngX, parallaxInfo.tile.yPos[rngY], lilyInfo.w, lilyInfo.h, AM.images[key].cw, AM.images[key].ch);
    lily.id = rngY;
    lily.key = key;
    // duck.vy = parallaxInfo.tile.moveSpeed;

    // duck.setDirection(direction);
    // duck.setRandomSpeed(100, 50);

    waterObjects.push(lily);
    // waterObjectRows[rngY] = waterObjects.length - 1;
}

function addBunny(posY, id) {
    let cw = 37;
    let ch = 41;
    // let id = Math.floor(Math.random() * 2);

    let x = 0;
    if (id) {
        x = canvas.width + bunnyInfo.w;
    }

    let bunny = new Sprite(x, posY * parallaxInfo.tile.h, bunnyInfo.w, bunnyInfo.h, cw, ch);
    bunny.clipX = bunnyInfo.clipX[0];
    bunny.clipY = (5 * ch) + 5;
    let direction = Math.floor(Math.random() * 2) ? 1 : -1;
    bunny.vy = parallaxInfo.tile.moveSpeed;
    bunny.setDirection(direction);
    bunny.setRandomSpeed(100, 50);

    bunny.id = id;

    bunnies.push(bunny);
}

function drawBunnies() {
    for (let i = 0; i < bunnies.length; ++i) {
        bunnies[i].swim(ctx, AM.images.bunny.img);
        bunnies[i].updatePos(delta, 1);

        bunnies[i].t += 10 * delta;
        let frame = Math.floor(bunnies[i].t) % 8;
        bunnies[i].clipX = bunnyInfo.clipX[frame];

        if (bunnies[i].id == 0) {
            if (
                (bunnies[i].facing == 1 && bunnies[i].x >= parallaxInfo.water.x - bunnies[i].w) || 
                (bunnies[i].facing == -1 && bunnies[i].x <= -bunnies[i].w * 2)
            ) {
                bunnies[i].setDirection(bunnies[i].facing * -1);
                bunnies[i].setRandomSpeed(100, 50);
    
                if (bunnies[i].x < 0) {
                    let rngY = Math.floor(Math.random() * parallaxInfo.tile.rows);
                    bunnies[i].y = rngY * parallaxInfo.tile.h;
                }
            }
        } else {
            if (
                (bunnies[i].facing == 1 && bunnies[i].x >= canvas.width + bunnies[i].w * 2) || 
                (bunnies[i].facing == -1 && bunnies[i].x <= parallaxInfo.water.x + parallaxInfo.water.w)
            ) {
                bunnies[i].setDirection(bunnies[i].facing * -1);
                bunnies[i].setRandomSpeed(100, 50);
    
                if (bunnies[i].x > canvas.width) {
                    let rngY = Math.floor(Math.random() * parallaxInfo.tile.rows);
                    bunnies[i].y = rngY * parallaxInfo.tile.h;
                }
            }
        }
        
    }
}

function addPlank(id, direction, rngY) {
    // let id = Math.floor(Math.random() * 2) + 1;
    // let rngY = id; //Math.floor(Math.random() * parallaxInfo.tile.rows);
    // let direction = Math.floor(Math.random() * 2);

    let x = parallaxInfo.water.x;

    if (id == 1) {
        if (direction) {
            x += parallaxInfo.water.w - plankInfo[id].w;
        }
    } else {
        let rngX = Math.floor(Math.random() * (parallaxInfo.water.w - plankInfo[id].w));
        x += rngX;
    }

    let key = 'plank' + id;
    let plank = new Sprite(x, parallaxInfo.tile.yPos[rngY], plankInfo[id].w, plankInfo[id].h, AM.images[key].cw, AM.images[key].ch);
    plank.id = rngY;
    plank.key = key;

    plank.vy = parallaxInfo.tile.moveSpeed;

    waterObjects.push(plank);
    // waterObjectRows[rngY] = waterObjects.length - 1;
}

function addDuck() {
    let rngX = Math.floor(Math.random() * parallaxInfo.water.w);
    let rngY = parallaxInfo.tile.rows - waterObjects.length - 1; //Math.floor(Math.random() * parallaxInfo.tile.rows);
    let direction = Math.floor(Math.random() * 2) ? 1 : -1;

    let key = 'duck';
    // let duck = new Sprite(parallaxInfo.water.x + rngX, parallaxInfo.tile.yPos[rngY], duckInfo[1].w, duckInfo[1].h, 46.83, AM.images[key].ch);
    let duck = new Sprite(parallaxInfo.water.x + rngX, parallaxInfo.tile.yPos[rngY], duckInfo[1].w, duckInfo[1].h, AM.images[key].cw, AM.images[key].ch);
    duck.id = rngY;
    duck.key = key;
    // duck.vy = parallaxInfo.tile.moveSpeed;

    duck.setDirection(direction);
    duck.setRandomSpeed(100, 50);

    waterObjects.push(duck);
    // waterObjectRows[rngY] = waterObjects.length - 1;
}

function drawWaterObjects() {
    for (let i = 0; i < waterObjectRows.length; ++i) {
        let idx = waterObjectRows[i];

        if (idx > -1) {
            waterObjects[idx].swim(ctx, AM.images[waterObjects[idx].key].img);

            if (checkAngledCollisions(kayakHitBox, waterObjects[idx])) {
                if (!waterObjects[idx].key.match(/lily\d/g)) {
                    waterObjects[idx].y = parallaxInfo.tile.yPos[currentTop];
                    waterObjectRows[i] = -1;

                    if (waterObjects[idx].key == 'duck') {
                        score++;
                        if (score > 99) score = 99;
                        setPoints('+1', '#C7FC12');
                        playScore();
                    } else {
                        score--;
                        if (score < 0) score = 0;
                        setPoints('-1', '#fb2121'); // red
                        // playCry();
                    }

                    updateScore();
                }
            }
            
        }
        
    }


    for (let i = 0; i < waterObjects.length; ++i) {
        waterObjects[i].updatePos(delta, 1);
        waterObjects[i].y = parallaxInfo.tile.yPos[waterObjects[i].id];

        if (waterObjects[i].key == 'duck') {
            waterObjects[i].updateFrameAnimation(6, 15, delta); // frames, speed, delta
            if (
                (waterObjects[i].facing == 1 && waterObjects[i].x >= parallaxInfo.water.edgeX - waterObjects[i].w) || 
                (waterObjects[i].facing == -1 && waterObjects[i].x <= parallaxInfo.water.x)
            ) {
                waterObjects[i].setDirection(waterObjects[i].facing * -1);
                waterObjects[i].setRandomSpeed(100, 50);
            }
        }

        
    }
}

function updateWaterObject(rngY) {
    let rng = Math.floor(Math.random() * 2);

    // if (waterObjectRows[rngY] > -1) {
    //     waterObjectRows[rngY].y = parallaxInfo.tile.yPos[rngY];
    // }

    let idx = -1;
    for (let i = 0; i < waterObjects.length; ++i) {
       if (waterObjects[i].id == rngY) {
            idx = i;
            if (rng) {
                let count = 0;
                for (let j = 0; j < waterObjectRows.length; ++j) {
                    if (waterObjectRows[j] > -1) {
                        ++count;
                    }
                }
        
                if (count < waterObjects.length) {
                    // if (waterObjects[count].key == 'duck') {
                    //     let rngX = Math.floor(Math.random() * parallaxInfo.water.w);
                    //     waterObjects[count].x = parallaxInfo.water.x + rngX;
                    // }
                    // if (idx < 0) idx = 0;
        
                    waterObjects[idx].y = parallaxInfo.tile.yPos[rngY];
                    
                    // waterObjects[idx].id = rngY;
                    waterObjectRows[rngY] = idx;
                    
                }
            } else {
                waterObjectRows[rngY] = -1;
        
                // if (idx > -1) {
                //     waterObjects[idx].id = Math.floor(Math.random() * parallaxInfo.tile.rows);
                // }
            }
            // break;
        }
    }

    
    
}

function initDuck(widthPercent, heightPercent) {
    let i = 1;
    let id = duckInfo[i].id;
    duckInfo[i].w = AM.images[id].cw * widthPercent * scaleX;
    // duckInfo[i].w = 46.83 * widthPercent * scaleX;
    duckInfo[i].h = AM.images[id].ch * heightPercent * scaleY;
}

function initWaterObjects(widthPercent, heightPercent) {
    let id = plankInfo[1].id;
    plankInfo[1].w = AM.images[id].cw * widthPercent * scaleX;
    plankInfo[1].h = AM.images[id].ch * heightPercent * scaleY;

    id = plankInfo[2].id;
    plankInfo[2].w = AM.images[id].cw * 0.35 * widthPercent * scaleX;
    plankInfo[2].h = AM.images[id].ch * 0.35 * heightPercent * scaleY;
    // for (let i = 1; i <= 2; ++i) {
    //     let id = plankInfo[i].id;
    //     plankInfo[i].w = AM.images[id].cw * widthPercent * scaleX;
    //     plankInfo[i].h = AM.images[id].ch * heightPercent * scaleY;
    //     // plankInfo[i].adjX = parallaxInfo.tile.w / 2 - plankInfo[i].w / 2;
    //     // plankInfo[i].adjY = parallaxInfo.tile.h / 2 - plankInfo[i].h / 2;
    // }
}

// function drawWaterObject() {
//     let idx = 1;
//     let id = plankInfo[idx].id;
//     waterObjectSprite.dynamicDraw(ctx, parallaxInfo.water.x, parallaxInfo.tile.yPos[0], plankInfo[idx].w, plankInfo[idx].h, AM.images[id].cw, AM.images[id].ch, id);
// }

function initTerrain(widthPercent, heightPercent) {
    for (let i = 1; i < terrainCount; ++i) {
        let id = terrainInfo[i].id;
        terrainInfo[i].w = AM.images[id].cw * widthPercent * scaleX;
        terrainInfo[i].h = AM.images[id].ch * heightPercent * scaleY;
        terrainInfo[i].adjX = parallaxInfo.tile.w / 2 - terrainInfo[i].w / 2;
        terrainInfo[i].adjY = parallaxInfo.tile.h / 2 - terrainInfo[i].h / 2;
    }

    let rows = parallaxInfo.tile.rows;
    let cols = parallaxInfo.tile.cols * 2;

    for (let i = 0; i < rows; ++i) {
        terrain[i] = [];
        for (let j = 0; j < cols; ++j) {
            terrain[i][j] = terrainInfo[0];
        }
        generateTerrain(i);
    }
}

function generateTerrain(i) {
    for (let j = 0; j < terrain[i].length; ++j) {
        let hasTerrain = Math.floor(Math.random() * 100);
        terrain[i][j] = 0;
        if (hasTerrain < terrainChancePercentage) { // initial chance
            let rng = Math.floor(Math.random() * terrainCount);
            terrain[i][j] = rng;
        }
    }
}

function drawTerrain(r, c) {
    for (let i = 0; i < 2; ++i) {
        c += i * parallaxInfo.tile.cols;
        let idx = terrain[r][c];
    
        if (idx) {
            let id = terrainInfo[idx].id;
            let adjX = terrainInfo[idx].adjX;
            let adjY = terrainInfo[idx].adjY;
            terrainSprite.dynamicDraw(ctx, c * parallaxInfo.tile.w + adjX + (parallaxInfo.water.w) * i, parallaxInfo.tile.yPos[r] + adjY, terrainInfo[idx].w, terrainInfo[idx].h, AM.images[id].cw, AM.images[id].ch, id);
        }
    }
    
    
}

// function transformPoint(pointX, pointY, centerX, centerY, rotationDegrees){
//     var radians = rotationDegrees * (Math.PI/180);
//     var cos = Math.cos(radians);
//     var sin = Math.sin(radians);
//     var x = centerX + (pointX * cos) - (pointY * sin);
//     var y = centerY + (pointX * sin) + (pointY * cos);
//     return {x, y};
// }
function transformPoint(rect, cx, cy, rotationDegrees) {
    var radians = rotationDegrees * (Math.PI / 180);
    
    // Translate rotation
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);

    let px = rect.x - cx;
    let py = rect.y - cy;


    var x = (px * cos) - (py * sin);
    var y = (px * sin) + (py * cos);

    x += cx;
    y += cy;

    return { x, y };
}

function getRotatedRect(rect, degrees) {
    // const radiant = degrees * Math.PI / 180;
    // cos = Math.cos(0);
    // sin = Math.sin(0);

    let cx = (rect.x + rect.w / 2); 
    let cy = (rect.y + rect.h / 2); 

    // ctx.beginPath();
    // ctx.rect(cx, cy, 5, 5);
    // ctx.stroke();

    return [
        // {x: rect.x, y: rect.y},
        // transformPoint(testRect2[0], cx, cy, degrees),
        // transformPoint(testRect2[1], cx, cy, degrees),
        // transformPoint(testRect2[2], cx, cy, degrees),
        // transformPoint(testRect2[3], cx, cy, degrees),
        transformPoint({ x: rect.x, y: rect.y }, cx, cy, degrees),
        transformPoint({ x: rect.x + rect.w, y: rect.y }, cx, cy, degrees),
        transformPoint({ x: rect.x + rect.w, y: rect.y + rect.h }, cx, cy, degrees),
        transformPoint({ x: rect.x, y: rect.y + rect.h }, cx, cy, degrees)
    ];

    // return [
    //     { x: rect.x * cos2 - rect.y * sin2, y: rect.x * sin2 + rect.y * cos2 }, 
    //     { x: (rect.x + rect.w) * cos - rect.y * sin, y: (rect.x + rect.w) * sin + rect.y * cos }, 
    //     { x: (rect.x + rect.w) * cos - (rect.y + rect.h) * sin, y: (rect.x + rect.w) * sin + (rect.y + rect.h) * cos }, 
    //     { x: rect.x * cos - (rect.y + rect.h) * sin, y: rect.x * sin + (rect.y + rect.h) * cos }
    // ];

    // return {
    //     x: x * cos - y * sin,
    //     y: x * sin + y * cos,
    // }
}

function drawTestRect() {
    let p = getRotatedRect(kayakHitBox, kayak.degrees);
    let d = 5;
    ctx.beginPath();
    ctx.rect(p[0].x, p[0].y, d, d);
    ctx.rect(p[1].x, p[1].y, d, d);
    ctx.rect(p[2].x, p[2].y, d, d);
    ctx.rect(p[3].x, p[3].y, d, d);
    ctx.stroke();

    // testT += 100 * delta;
}

function drawKayak() {
    // kayak.draw(ctx, AM.images.kayak.img);
    // kayak.t2 += 10 * delta;
    // let frame = Math.floor(kayak.t2) % 8
    // kayak.clipX = frame * 129.125;
    kayak.updateFrameAnimation(8, 10, delta); // frames, speed, delta
    kayak.drawWithRotation(ctx, AM.images.kayak.img, kayakBounds.left, kayakBounds.right);

    // if (kayak.x > kayakBounds.right - kayak.w) kayak.x = kayakBounds.right - kayak.w;
    // if (kayak.x < kayakBounds.left) kayak.x = kayakBounds.left;

    updateHitBox();

    // ctx.beginPath();
    // ctx.rect(kayakHitBox.x, kayakHitBox.y, kayakHitBox.w, kayakHitBox.h);
    // ctx.stroke();
    
    // ctx.beginPath();
    // ctx.rect(canvas.width / 2 - kayakHitBox.w / 2, canvas.height / 2 - kayakHitBox.h / 2, 1, 1);
    // ctx.rect(canvas.width / 2 + kayakHitBox.w / 2, canvas.height / 2 - kayakHitBox.h / 2, 1, 1);
    // ctx.rect(canvas.width / 2 - kayakHitBox.w / 2, canvas.height / 2 + kayakHitBox.h / 2, 1, 1);
    // ctx.rect(canvas.width / 2 + kayakHitBox.w / 2, canvas.height / 2 + kayakHitBox.h / 2, 1, 1);
    // ctx.stroke();
    // drawTestRect();
}

function updateHitBox() {
    kayakHitBox.x = kayak.x + kayak.w / 2 - kayakHitBox.w / 2;
    
    // ctx.beginPath();
    // ctx.rect(eel_hitbox.x, eel_hitbox.y, eel_hitbox.w, eel_hitbox.h);
    // ctx.stroke();
}


function parallaxBG() {
    ctx.save();
    
    ctx.fillStyle = '#65D5FD';
    ctx.fillRect(parallaxInfo.water.x, parallaxInfo.water.y, parallaxInfo.water.w, parallaxInfo.water.h);

    ctx.fillStyle = '#C88043';
    ctx.fillRect(parallaxInfo.borders[1].x, parallaxInfo.borders[1].y, parallaxInfo.borders[1].w, parallaxInfo.borders[1].h);
    ctx.fillRect(parallaxInfo.borders[1].x + parallaxInfo.borders[1].gap, parallaxInfo.borders[1].y, parallaxInfo.borders[1].w, parallaxInfo.borders[1].h);

    ctx.fillStyle = '#F0A86B';
    ctx.fillRect(parallaxInfo.borders[2].x, parallaxInfo.borders[2].y, parallaxInfo.borders[2].w, parallaxInfo.borders[2].h);
    ctx.fillRect(parallaxInfo.borders[2].x + parallaxInfo.borders[2].gap, parallaxInfo.borders[2].y, parallaxInfo.borders[2].w, parallaxInfo.borders[2].h);
   
    
    // land tiles
    for (let i = 0; i < parallaxInfo.tile.rows; ++i) {
        for (let j = 0; j < parallaxInfo.tile.cols; ++j) {
            let n = i ^ (j & 1);
            ctx.fillStyle = (n & 1) ? '#97DE54' : '#8FDA47'; 

            let x = j * parallaxInfo.tile.w;
            let y =  parallaxInfo.tile.yPos[i];
            
            

            ctx.fillRect(x, y, parallaxInfo.tile.w, parallaxInfo.tile.h);

            ctx.fillRect(x + parallaxInfo.tile.tileGap, y, parallaxInfo.tile.w, parallaxInfo.tile.h);

            drawTerrain(i, j);
        }
        
    }
    ctx.restore();
}

function updateParallax() {
    let v = parallaxInfo.tile.moveSpeed * delta;
    for (let i = 0; i < parallaxInfo.tile.rows; ++i) {
        parallaxInfo.tile.yPos[i] += v;
        if (parallaxInfo.tile.yPos[i] >= canvas.height) {
            parallaxInfo.tile.yPos[i] = (parallaxInfo.tile.yPos[(i + 1) % parallaxInfo.tile.rows] + v) - parallaxInfo.tile.h;
            generateTerrain(i);
            updateWaterObject(i);
            currentTop = i;
        }
    }
}

function muteAllAudio(flag) {
    for (let k in AM.audio) {
        AM.audio[k].img.muted = flag;
    }
}

function controls() {
    let mid = canvas.width / 2;
    let prevPos = 0;

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

        if (gameover) {
            // reset();
        } else {
            if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
                var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
                var touch = evt.touches[0] || evt.changedTouches[0];
                prevPos = touch.pageX;

                if (!mDown) {
                    if (isBtnClicked(touch.pageX, touch.pageY, {
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

                    mDown = true;
                    mouseMoveOrigin.x = prevPos;
                }
            }
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
            //     // forceD = 0;
            //     kayak.vx = 0;
            // }

            if (mDown) {
                mDown = false;
                kayak.updateOriginalPos();
            }
        }
    });

    canvas.addEventListener('touchmove', e => {
        // mousemoveE(e.touches[0].clientX, e.touches[0].clientY);
        if (!gameover) {
            if (e.type == 'touchmove') {
                var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
                var touch = evt.touches[0] || evt.changedTouches[0];
                let x = touch.pageX;

                // if (x > prevPos) {
                //     // forceD = F;
                //     kayak.vx = F;
                // } else  {
                //     // forceD = -F;
                //     kayak.vx = -F;
                // }

                if (gameover) mDown = false;

                if (mDown) {
                    let dist = x - mouseMoveOrigin.x;
                    kayak.x = kayak.ox + dist;
                    kayak.updateBounds(kayakBounds, kayakHitBox);
                }

                prevPos = x;
            }
        }
    });

    canvas.addEventListener('touchend', e => {
        // mouseupE();
        // e.preventDefault();
        // var touch = evt.touches[0] || evt.changedTouches[0];
        // let x = touch.pageX;

        if (!gameStart) {
            AM.audio.bg.img.volume = 0.2;
            AM.audio.bg.img.loop = true;
            AM.audio.bg.img.play();

            gameStart = true;
            // HUD.health = 100;
        } 

        if (gameover) {
            // reset();
        }
        
    });

    canvas.addEventListener('mousedown', e => {
        // mousedownE(e.offsetX, e.offsetY);
        let mx = e.offsetX;
        let my = e.offsetY;
        if (!mDown) {
            
            
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

                // if (!mDown) {
                    mDown = true;
                    mouseMoveOrigin.x = mx;
                // }

            }
        }

        
    });


    canvas.addEventListener('mousemove', e => {
        // mousemoveE(e.offsetX, e.offsetY);
        let mx = e.offsetX;
        // let my = e.offsetY;

        if (gameover) mDown = false;

        if (mDown) {
            let dist = mx - mouseMoveOrigin.x;
            kayak.x = kayak.ox + dist;
            kayak.updateBounds(kayakBounds, kayakHitBox);
            prevPos = mx;
        }

    });
    
    canvas.addEventListener('mouseup', e => {
        // mouseupE();
        
        if (!gameStart) {
            // if (AM.audio.bg.img.paused) {
                AM.audio.bg.img.volume = 0.2;
                AM.audio.bg.img.loop = true;
                AM.audio.bg.img.play();
                // console.log('test')
            // }
            

            gameStart = true;
            HUD.health = 100;
        }

        if (mDown) {
            mDown = false;
            kayak.updateOriginalPos();
            // eelLookAt[0] = canvas.width / 2;
            // eelLookAt[1] = 0;
            if (gameover) {
                // reset();
                
            }
            
        }
    });

    document.addEventListener('keydown', e => {
        if (!gameover) {
            if (e.key == 'ArrowRight') {
                if (!rDown) {
                    rDown = true;
                    // forceD = F;
                    kayak.vx = F;
                    
                }
            } else if (e.key == 'ArrowLeft') {
                if (!lDown) {
                    lDown = true;
                    // forceD = -F;
                    kayak.vx = -F;
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
                // forceD = 0;
                kayak.vx = 0;
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

    startPage.duck.dist *= scaleX;

    // startPage.title.x = canvas.width / 2 - startPage.title.w / 2;
    // startPage.sub_title.x = canvas.width / 2 - startPage.sub_title.w / 2;
    // // startPage.sub_title.x = 0;
    // startPage.sub_title.y += startPage.title.y + startPage.title.h ;
    // startPage.sub_title.y = 0;

    // for (let i = 1; i < 4; ++i) {
    //     let key = 'text' + i;
    //     startPage[key].y = startPage.sub_title.y + 140 * scaleY;
    // }

    
}

function setFishInfo(sx, sy, sizePercentage) {
    // for (let i = 1; i < 7; ++i) {
    //     let key = 'sfish_' + i;

    //     if (AM.images[key].frames) AM.images[key].cw = AM.images[key].cw / AM.images[key].frames;
    //     // console.log(AM.images[key].frames, AM.images[key].cw)
    //     // let cw = (AM.images[key].frames ? (AM.images[key].cw / AM.images[key].frames) : AM.images[key].cw);

    //     fishInfo[i] = {
    //         x: 0,
    //         y: 0,
    //         w: AM.images[key].cw * sizePercentage * sx,
    //         h: AM.images[key].ch * sizePercentage * sy,
    //         frames: AM.images[key].frames
    //     };
    // }
}

// *********************************** GAME INITIATLIZATIONS AND CONTROLS END ******************************************************** //


/*
 * SPRITE MANAGEMENT (SETTING, ADDING, AND DRAWING)
 */


// *********************************** SPRITE MANAGEMENT END ******************************************************** //


/*
 * PHYSICS
 */

// function getRotatedRect(rect, degrees) {
//     const radiant = degrees * Math.PI / 180;
//     cos = Math.cos(radiant);
//     sin = Math.sin(radiant);

//     return [
//         { x: rect.x * cos - rect.y * sin, y: rect.x * sin + rect.y * cos }, 
//         { x: (rect.x + rect.w) * cos - rect.y * sin, y: (rect.x + rect.w) * sin + rect.y * cos }, 
//         { x: (rect.x + rect.w) * cos - (rect.y + rect.h) * sin, y: (rect.x + rect.w) * sin + (rect.y + rect.h) * cos }, 
//         { x: rect.x * cos - (rect.y + rect.h) * sin, y: rect.x * sin + (rect.y + rect.h) * cos }
//     ];

//     // return {
//     //     x: x * cos - y * sin,
//     //     y: x * sin + y * cos,
//     // }
// }

function checkAngledCollisions(obj1, obj2) {
    // return doPolygonsIntersect(
    //     [{ x: obj1.x, y: obj1.y }, { x: obj1.x + obj1.w, y: obj1.y }, { x: obj1.x + obj1.w, y: obj1.y + obj1.h }, { x: obj1.x, y: obj1.y + obj1.h }],
    //     [{ x: obj2.x, y: obj2.y }, { x: obj2.x + obj2.w, y: obj2.y }, { x: obj2.x + obj2.w, y: obj2.y + obj2.h }, { x: obj2.x, y: obj2.y + obj2.h }]
    // );
    
    return doPolygonsIntersect(
        getRotatedRect(obj1, kayak.degrees),
        getRotatedRect(obj2, obj2.degrees)
    );
}

// *********************************** PHYSICS END ******************************************************** //
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
}
/*
 * TEXT DISPLAYS
 */
function showPoints() {
    // HUD.draw(ctx, AM.images.timecircle.img);
    // jumpPointsT += 1 * delta;
    if (jump > 0) {
        let y = kayak.y + jump - kayak.h;
        TXT.follow('points', kayak.x, y, kayak.w, kayak.h);
        TXT.draw('points');
        jump -= G * jumpSpeed * delta;
    }
}

function setPoints(points, color) {
    jump = jumpHeight;
    TXT.texts['points'].color = color;
    TXT.texts['points'].str = points;
}

function updateScore() {
    HUD.txt.texts['score'].str = 'x ' + zeroPad(score, 2);
}

function updateFinalScore() {
    HUD.txt.texts['score2'].str = zeroPad(score, 2);
}

// *********************************** TEXT DISPLAYS END ******************************************************** //


/*
 * SOUNDS
 */
function playCry() {
    if (HUD.volumeOn) {
        AM.audio.cry.img.pause();
        AM.audio.cry.img.currentTime = 0;
        AM.audio.cry.img.play();
    }
}

// function playEat() {
//     if (HUD.volumeOn) {
//         AM.audio.eat.img.pause();
//         AM.audio.eat.img.currentTime = 0;
//         AM.audio.eat.img.play();
//     } 
// }

function playScore() {
    if (HUD.volumeOn) {
        AM.audio.score.img.pause();
        AM.audio.score.img.currentTime = 0;
        AM.audio.score.img.play();
    }
}

// *********************************** SOUNDS END ******************************************************** //

// #11A5CC
// #F8E7CD
/*
 * GAME UPDATES AND CYCLES
 */
// function drawStartPage() {
//     // ctx.drawImage(AM.images.intro.img, 0, 0, AM.images.intro.cw, AM.images.intro.ch, 0, 0, canvas.width, canvas.height);
//     ctx.drawImage(AM.images.bg.img, 0, 0, AM.images.bg.cw, AM.images.bg.ch, 0, 0, canvas.width, canvas.height);
//     ctx.drawImage(AM.images.title.img, 0, 0, AM.images.title.cw, AM.images.title.ch, startPage.title.x, startPage.title.y, startPage.title.w, startPage.title.h);
//     ctx.drawImage(AM.images.sub_title.img, 0, 0, AM.images.sub_title.cw, AM.images.sub_title.ch, startPage.sub_title.x, startPage.sub_title.y, startPage.sub_title.w, startPage.sub_title.h);
    
//     for (let i = 1; i < 4; ++i) {
//         let key = 'text' + i;
//         ctx.drawImage(AM.images[key].img, 0, 0, AM.images[key].cw, AM.images[key].ch, startPage[key].x, startPage[key].y, startPage[key].w, startPage[key].h);
//     }

//     let id = 2;
//     let key = 'sfish_' + id;
//     let fw = 102.9 * scaleX;
//     let fh = 81 * scaleY;
//     let frame = Math.floor(T) % 10;
//     ctx.drawImage(AM.images[key].img, 102.9 * frame, 0, 102.9, AM.images[key].ch, startPage['text1'].x - fw * 1.1, startPage['text1'].y - fh * 0.15, fw, fh);
    
//     id = 9;
//     key = 'garbage_' + id;
//     let x = startPage['text2'].x - garbageInfo[id].w;
//     let y = startPage['text1'].y - garbageInfo[id].h * 0.25;
//     ctx.save();
//     // Untransformed draw position
//     const position = {x: x, y: y};
//     // In degrees
//     const rotation = { x: 0, y: 0, z: Math.sin(T) * 15};
//     // Rotation relative to here (this is the center of the image)
//     const rotPt = { x: garbageInfo[id].w / 2, y: garbageInfo[id].h / 2 };

//     ctx.setTransform(new DOMMatrix()
//         .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
//         .rotateSelf(rotation.x, rotation.y, rotation.z)
//     );
    
//     // ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, -rotPt.x, -rotPt.y, this.w, this.h);
//     ctx.drawImage(AM.images[key].img, 0, 0, AM.images[key].cw, AM.images[key].ch, -rotPt.x, -rotPt.y, garbageInfo[id].w, garbageInfo[id].h);
//     ctx.restore();
    
    
//     HUD.drawMiniBattery(ctx);

//     let startBtnW = AM.images.start.cw * 2 * scaleX;
//     let startBtnH = AM.images.start.ch * 2 * scaleY;

//     ctx.drawImage(AM.images.start.img, 0, 0, AM.images.start.cw, AM.images.start.ch, canvas.width / 2 - startBtnW / 2, canvas.height - startBtnH * 2, startBtnW, startBtnH);

//     if (delta < 1) {
//         T += 10 * delta;
//         HUD.decayMiniBattery(delta);
//     }
    
// }

function drawRotate(obj, key, ax, ay, yRot, zRot) {
    ctx.save();
    // Untransformed draw position
    const position = {x: obj.x + ax, y: obj.y + ay};
    // In degrees
    const rotation = { x: 0, y: yRot, z: zRot};
    // Rotation relative to here (this is the center of the image)
    const rotPt = { x: obj.w / 2, y: obj.h / 2 };

    ctx.setTransform(new DOMMatrix()
        .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
        .rotateSelf(rotation.x, rotation.y, rotation.z)
    );
    
    // ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, -rotPt.x, -rotPt.y, this.w, this.h);
    // ctx.drawImage(AM.images[key].img, 0, 0, AM.images[key].cw, AM.images[key].ch, -rotPt.x, -rotPt.y, garbageInfo[id].w, garbageInfo[id].h);
    ctx.drawImage(AM.images[key].img, 0, 0, AM.images[key].cw, AM.images[key].ch, -rotPt.x, -rotPt.y, startPage.duck.w, startPage.duck.h);
    ctx.restore();
}

function drawStartPage() {
    startPage.duck.t += 3 * delta;
    let sine = Math.sin(startPage.duck.t);
    let a = sine * startPage.duck.dist;
    let duckRot = 0;
    if (a < 0) duckRot = 180;

    ctx.drawImage(AM.images.intro.img, 0, 0, AM.images.intro.cw, AM.images.intro.ch, 0, 0, canvas.width, canvas.height);

    for (let i = 1; i < 4; ++i) {
        let key = 'text' + i;
        ctx.drawImage(AM.images[key].img, 0, 0, AM.images[key].cw, AM.images[key].ch, startPage[key].x, startPage[key].y, startPage[key].w, startPage[key].h);
    }

    drawRotate(startPage.duck, 'splash_duck', a, 0, 0, 0);
    drawRotate(startPage.hourglass, 'splash_hourglass', 0, 0, 0, sine * 180);
    drawRotate(startPage.rock, 'splash_rock', 0, a, 0, 0);
    
    
    // ctx.drawImage(AM.images.splash_hourglass.img, 0, 0, AM.images.splash_hourglass.cw, AM.images.splash_hourglass.ch, startPage.hourglass.x, startPage.hourglass.y, startPage.hourglass.w, startPage.hourglass.h);
    // ctx.drawImage(AM.images.splash_rock.img, 0, 0, AM.images.splash_rock.cw, AM.images.splash_rock.ch, startPage.rock.x, startPage.rock.y, startPage.rock.w, startPage.rock.h);

    
}

function reset() {
    gameover = false;
    score = 0;

    updateScore();
    updateFinalScore();

    timer.setTimer(gameDuration);
}

function update() {
    

    // divingFish.update(delta);
    // divingFish.sineMovement(delta);
    HUD.txt.texts['time'].str = 'TIME: ' + zeroPad(Math.floor(timer.timer / 24), 2);

    if (delta < 1) {
        timer.tick(delta);

        // let tmpT = Math.floor(timer.timer / 24 / 10);
        // parallaxInfo.tile.moveSpeed = 100 * scaleY + (tmpT * 20 * scaleY);

        if (timer.timer <= 0) {
            gameover = true;
            updateFinalScore();
        }
    }
    updateParallax();

    if (!mDown) {
        kayak.update(delta, 1);
        kayak.updateBounds(kayakBounds, kayakHitBox);
    }
    
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    if (!gameover) {
        if (gameStart) {
            // bg
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            // ctx.drawImage(AM.images.bg.img, 0, 0, AM.images.bg.cw, AM.images.bg.ch, 0, 0, canvas.width, canvas.height);
            
              
            parallaxBG();
            drawBunnies();
            // drawTerrain();
            // drawWaterObject(plankInfo, 1, 0);
            drawWaterObjects();
            // drawWaterObject(duckInfo, 1, 3);

            drawKayak();

            showPoints();
            
            HUD.draw(ctx);
            update();

            
        } else {
            // ctx.drawImage(AM.images.intro.img, 0, 0, AM.images.intro.cw, AM.images.intro.ch, 0, 0, canvas.width, canvas.height);
            drawStartPage();
        }

        
    } else {

        HUD.gameover(ctx);
        // HUD.updateGameoverBattery(-0.01 * delta);
    }

    requestAnimationFrame(gameCycle);
}
// *********************************** GAME UPDATES AND CYCLES END ******************************************************** //
