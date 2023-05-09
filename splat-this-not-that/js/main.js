const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');

var instrucions = document.getElementById("game-instructions");
var btnStart = document.getElementById("btnStart");

var last = 0;
var delta = 0;
var startGame = false;

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
    }
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
const SPLAT_POINTS = 100;
const OUCH_MINUS = -50;
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

var gameStart = false;
var level = 1;
var levelScore = LEVEL_UP_THRESHOLD;
var difficulty = [0, 0, 0, 0];
var mDown = false;

// canvas.width / 2 - 200, canvas.height - 225, 400, 100

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
    
    projectileRanges.x[0] *= scaleX;
    // projectileRanges.x[1] *= scaleX;
    projectileRanges.y[0] *= scaleY;
    // projectileRanges.y[1] *= scaleY;

    canvas.style.display = 'block';
    instrucions.style.display = 'none';

    for (let k in images) {
        assets.load(images[k].obj, images[k].src);
    }

    init();
    
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
    
    gameCycle();
}

function controls() {
    canvas.addEventListener('touchstart', e => {
        // mousedownE(e.touches[0].clientX, e.touches[0].clientY);
        if (!mDown) {
            let mx = e.touches[0].clientX;
            let my = e.touches[0].clientY;

            if (gameStart) {
                splat(mx, my);
                updateLevel();
            } else {
                if (isBtnClicked(mx, my, btnBegin)) {
                    gameStart = true;
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
        if (mDown) {
            mDown = false;
        }
        
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
        }
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

function splat(mx, my) {
    for (let i = 0; i < projectiles.length; ++i) {
        if (isSplatted(projectiles[i], { x: mx, y: my })) {
            if (projectiles[i].clipY > 0) {
                console.log('ouch!');
                score += OUCH_MINUS;
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
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    if (assets.loaded == assets.count) {
        if (gameStart) {
            // bg
            ctx.drawImage(images.bg.obj.img, 0, 0, 927, 429, 0, 0, canvas.width, canvas.height);
            

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
            displayScore();
            // update();
        } else {
           
            ctx.drawImage(images.splash.obj.img, 0, 0, 927, 429, 0, 0, canvas.width, canvas.height);

            // ctx.beginPath();
            // ctx.rect(btnBegin.x, btnBegin.y, btnBegin.w, btnBegin.h);
            // ctx.stroke();
        }
    }

    requestAnimationFrame(gameCycle);
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);