const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');

var instrucions = document.getElementById("game-instructions");
// var btnStart = document.getElementById("btnStart");

var last = 0;
var delta = 0;
var timer = null;
var gameDuration = 60;
var startGame = false;
var gameStart = false;
var gameover = false;
var canReset = false;

var HUD = null;

var portal = {
    x: 0,
    y: 0,
    // img: null,
    w: 401,
    h: 401,
    t: 0,
    et: 1.5,
    duration: 10,
    bonus: 5,
    isAnimating: true,
    isRefreshing: false,
    shapesOpacity: 0,
    gridDim: 75,
    gridDimX: 65,
    gridDimY: 65,
    sx: 0,
    sy: 0,
    warningT: 0,
    rng: [...Array(9).keys()],
    init: () => {
        portal.w *= scaleX;
        portal.h *= scaleX;
        portal.gridDimX = portal.gridDim * scaleX;
        portal.gridDimY = portal.gridDim * scaleX;
        
        shuffleArr(portal.rng);
        portal.sx = (portal.w) / 2 - (portal.gridDimX * 3) / 2;
        portal.sy = (portal.h) / 2 - (portal.gridDimY * 3) / 2;
    },
    getPos: (i) => {
        return {
            x: (portal.rng[i] % 3) * portal.gridDimX + portal.sx,
            y: (Math.floor(portal.rng[i] / 3)) * portal.gridDimY + portal.sy
        }
    },
    move: (w, h) => {
        w -= portal.w;
        h -= portal.h;
        
        let rangeY = containerGridAdjY + totalContainerGridRows * containerShapeH;
        // console.log(canvas.height, h)
        
        // let flag = Math.floor(Math.random() * 2);
        // if (flag) {
        //     portal.x = Math.floor(Math.random() * w);
        //     portal.y = rangeY;
        // } else {
        //     portal.x = 0;
            
        //     portal.y = Math.floor(Math.random() * (h - rangeY)) + rangeY;
        // }

        portal.x = Math.floor(Math.random() * w);
        // portal.x = 0;
        portal.y = Math.floor(Math.random() * (h - rangeY)) + rangeY;
        // portal.y = 0;

        shuffleArr(portal.rng);

        shapes.forEach((shape, i) => {
            let pos = portal.getPos(i);
            shape.setPos(pos.x, pos.y);

            shape.x = shape.ox + portal.x;
            shape.y = shape.oy + portal.y;
        });
    },
    animate: () => {
        if (portal.isAnimating) {
            if (portal.shapesOpacity > 0) {
                portal.shapesOpacity -= 5 * delta;
                if (portal.shapesOpacity <= 0) {
                    portal.shapesOpacity = 0;
                    portal.isRefreshing = false;
                }
            } else if (portal.t < portal.et) {
                portal.t += 5 * delta;
                if (portal.t >= portal.et) {
                    portal.t = portal.et;
                    portal.isAnimating = false;

                    if (portal.et == 1.5)
                        portal.shapesOpacity = 1;
                    else 
                        portal.move(canvas.width, canvas.height);
                }
            }
        }

        if (portal.bonus < 0) {
            portal.bonus = 0;
        } else if (portal.bonus > 0) {
            portal.bonus -= 1 * delta;
        }
        
    },
    toggle: () => {
        if (!portal.isAnimating) {
            if (portal.et == 1.5) {
                portal.et = 3.14;
                portal.t = 1.5;
                
            } else {
                portal.et = 1.5;
                portal.t = 0;
            }
            portal.isAnimating = true;
        }
    },
    trigger: () => {
        if (!portal.isAnimating) {
            portal.duration -= 2 * delta;
            if (portal.duration < 2 && portal.et == 1.5) {
                let a = Math.sin(portal.warningT) * 20;

                ctx.strokeStyle = '#FF0000';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(portal.x + portal.w / 2, portal.y + portal.h / 2, portal.w / 2 + a, 0, 2 * Math.PI);
                ctx.stroke();

                portal.warningT += 10 * delta;
            }

            if (portal.duration <= 0) {
                portal.toggle();
                
                portal.duration = portal.et == 1.5 ? Math.max((Math.floor(Math.random() * 10) + 1), 5) : 1;
                portal.warningT = 0;
            }
        }
    }
};

var shapes = []; 
var shapeImages = []; 
var shapesContainer = [];
var shapesContainerPos = [];
var shapesContainerKeys = [];
var shapeDim = 75;
var shapeDimX = shapeDim;
var shapeDimY = shapeDim;

var containerShapeW = 125;
var containerShapeH = 125;

var sizes = [
    [34, 34],
    [36, 32],
    [40, 39],
    [47, 47],
    [34, 31]
];

var isLoaded = 0;

var cx = 0;
var cy = 0;
var cc_x = 0; // center container x 
var cc_y = 0; // center container y
var containerRectDim = 75;
var containerRectDimX = 75;
var containerRectDimY = 75;
var nContainers = 8;

var isDraggable = false;

var dragID = -1;
var hoveredContainerID = -1;

var correctAnswers = new Array(nContainers).fill(-1);
var score = 0;

var scaleX = 1;
var scaleY = 1;
var textPos = {
    x: 0,
    y: 0,
    fontSize: 40,
    score: 0
}

// 1792 922
// #00ABC8- score
// #06C3F6 - blue
// #F78A3B - orange

var totalContainerGridCols = 0;
var totalContainerGridRows = 3;
var containerGridAdjX = 0;
var containerGridAdjY = 200;

var jump = 0;
var jumpPos = 0;
var jumpHeight = 20;
var jumpSpeed = 5;
var TXT = null;

var G = 9.8;

var mDown = false;
var mouseX = 0;
var mouseY = 0;

var startPageInfo = {
    title: {
        x: 0,
        y: 105,
        w: 0,
        h: 0
    },
    start: {
        x: 0,
        y: 705,
        w: 0,
        h: 0
    },
    img1: {
        x: 450,
        y: 310,
        w: 0,
        h: 0
    },
    img2: {
        x: 835,
        y: 310,
        w: 0,
        h: 0,
        tw: 50,
        th: 50,
    },
    img3: {
        x: 1200,
        y: 310,
        w: 0,
        h: 0
    },

    text1: {
        x: 363,
        y: 460,
        w: 0,
        h: 0
    },
    text2: {
        x: 750,
        y: 460,
        w: 0,
        h: 0
    },
    text3: {
        x: 1150,
        y: 460,
        w: 0,
        h: 0
    },
    
}

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

    initStartPage(2);

    TXT = new Text(ctx, w, h); 
    TXT.setScale(scaleX, scaleY);
    
    TXT.addText('points', '+1', 'bold', 20, 'Montserrat', 0, 0, 40, 30, '#10aad7', true); 
    jumpHeight *= scaleY;

    // let x = startPageInfo.x + (startPage.startcoin.w / 2 - 230 / 2 * scaleX);
    let x = startPageInfo.img1.x + (startPageInfo.img1.w / 2 - 250 / 2 * scaleX);
    let y = startPageInfo.img1.y + startPageInfo.img1.h + 30 * scaleY;
    let center = (250 / 2 - 150 / 2) * scaleX;
    TXT.addText('text1_1', 'Drag a shape into a hole of', 'bold', 20, 'Montserrat', x, y, 250, 30, '#fff', false); 
    TXT.addText('text1_2', 'the same shape.', 'bold', 20, 'Montserrat', x + center, y + 30 * scaleY, 150, 30, '#fff', false); 

    x = startPageInfo.img2.x + (startPageInfo.img2.w / 2 - 160 / 2 * scaleX);
    center = (160 / 2 - 150 / 2) * scaleX;
    TXT.addText('text2_1', 'Be quick before', 'bold', 20, 'Montserrat', x, y, 160, 30, '#fff', false); 
    TXT.addText('text2_2', 'the portal closes.', 'bold', 20, 'Montserrat', x + center, y + 30 * scaleY, 150, 30, '#fff', false); 

    x = startPageInfo.img3.x + (startPageInfo.img3.w / 2 - 220 / 2 * scaleX);
    center = (220 / 2 - 70 / 2) * scaleX;
    TXT.addText('text3_1', 'Watch out for shifting', 'bold', 20, 'Montserrat', x, y, 220, 30, '#fff', false); 
    TXT.addText('text3_2', 'shapes!', 'bold', 20, 'Montserrat', x + center, y + 30 * scaleY, 70, 30, '#fff', false); 

    HUD = new Template_1(ctx, w, h, scaleX, scaleY, splashInfo);

    timer = new Timer(0, 0, 0, '#fff');
    timer.setTimer(gameDuration);

    textPos.x = w - 100;
    textPos.y = 50;

    containerRectDimX *= scaleX;
    containerRectDimY *= scaleX;
    
    containerShapeW *= scaleX;
    containerShapeH *= scaleX;

    

    cx = w / 2;
    cy = h / 2;
    cc_x = cx - containerRectDimX * nContainers / 2;
    cc_y = cy - containerRectDimY / 2;

    // bg = new Image();
    // bg.src = 'assets/bg.png';
    // bg.onload = function() {
    //     isLoaded++;
    // }

    // portal.img = new Image();
    // portal.img.src = 'assets/rings.png';
    // portal.img.onload = function() {
    //     isLoaded++;
    // }

    portal.init();
    

    totalContainerGridCols = Math.floor(w / containerShapeW);

    containerGridAdjX = (w - totalContainerGridCols * containerShapeW) / 2;
    containerGridAdjY *= scaleY;

    shapesContainerPos = [...Array(totalContainerGridCols * totalContainerGridRows).keys()];
    shuffleArr(shapesContainerPos);

    
    // for (let i = 0; i < 5; ++i) {
    //     shapeImages[i] = new Image();
    //     shapeImages[i].src = 'assets/shape' + (i + 1) + '.png';
    //     shapeImages[i].onload = function() {
    //         isLoaded++;
    //     }

    //     let pos = portal.getPos(i);
    //     shapes.push(new Shape(i, sizes[i][0], sizes[i][1], pos.x * scaleX, pos.y * scaleY));
    //     // shapes.push(new Shape(i + 5, sizes[i][0], sizes[i][1], pos.x * scaleX, pos.y * scaleY));
    // }

    // for (let i = 5; i < 9; ++i) {
    //     let rng = Math.floor(Math.random() * 5);
    //     let pos = portal.getPos(rng);
    //     shapes.push(new Shape(rng, sizes[rng][0], sizes[rng][1], pos.x * scaleX, pos.y * scaleY));
    // }

    // console.log(shapes[0].x, shapes[0].y)

    shapeDimX *= scaleX;
    shapeDimY *= scaleX;

    // for (let i = 0; i < 8; ++i) {
    //     // let rng = Math.floor(Math.random() * 5);
    //     let pos = portal.getPos(i);
    //     let id = 'shape_' + (i + 1);
    //     let shape = new Sprite(pos.x, pos.y, shapeDimX, shapeDimY, AM.images[id].cw, AM.images[id].ch);
    //     shape.id = id;
    //     shapes.push(shape);
    // }

    for (let i = 0; i < 8; ++i) {
        // let rng = Math.floor(Math.random() * 5);
        let pos = portal.getPos(i);
        let id = 'shapes';
        let shape = new Sprite(pos.x, pos.y, AM.images[id].cw * scaleX, AM.images[id].ch * scaleX, AM.images[id].cw, AM.images[id].ch);
        shape.id = id;
        shape.key = i;
        shapes.push(shape);
    }

    portal.move(w, h);

    if (isMobile() || isTablet()) {
        canvas.addEventListener('touchstart', e => {
            console.log('test')
            if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
                var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
                var touch = evt.touches[0] || evt.changedTouches[0];
                let x = touch.pageX;
                let y = touch.pageY;
                mousedownE(x, y);
                
            }
        });
    
        canvas.addEventListener('touchmove', e => {
            mousemoveE(e.touches[0].clientX, e.touches[0].clientY);
        });
    
        canvas.addEventListener('touchend', e => {
            mouseupE();
        });
    } else {
        canvas.addEventListener('mousedown', e => {
            mousedownE(e.offsetX, e.offsetY);
        });
    
        canvas.addEventListener('mousemove', e => {
            mousemoveE(e.offsetX, e.offsetY);
        });
        
        canvas.addEventListener('mouseup', e => {
            mouseupE();
        });
    }
    
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
    
    initShapesContainer();
    gameCycle();
}

function submitScore() {
    let timeSpent = gameDuration - Math.floor(timer.timer / 24);
    // alert(HUD.health.toFixed(2) + ' ' + timeSpent);
    let result = {'game_score': score.toFixed(2), 'activity_id': serverData.id, 'time_spent': timeSpent};
    Vue.prototype.$postData(result, true);
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

function muteAllAudio(flag) {
    for (let k in AM.audio) {
        AM.audio[k].img.muted = flag;
    }
    
}

function initStartPage(scale) {
    for (let k in startPageInfo) {
        startPageInfo[k].x *= scaleX;
        startPageInfo[k].y *= scaleY
        startPageInfo[k].w = AM.images[k].cw * scale * scaleX;
        startPageInfo[k].h = AM.images[k].ch * scale * scaleX;
    }

    startPageInfo.title.x = canvas.width / 2 - startPageInfo.title.w / 2;
    startPageInfo.start.x = canvas.width / 2 - startPageInfo.start.w / 2;
    startPageInfo.t = 0;
    startPageInfo.t2 = 0;

    startPageInfo.img2.tx = 900 * scaleX;
    startPageInfo.img2.ty = 380 * scaleY;
    startPageInfo.img2.tw = AM.images.img2.cw * 0.60 * scaleX;
    startPageInfo.img2.th = AM.images.img2.ch * 0.60 * scaleX;
}

function initShapesContainer() {
    shapesContainer = [...Array(nContainers).keys()];
    rngShapes();

    for (let i = 0; i < shapesContainer.length; ++i) {
        // shapesContainer[i] = ;
        // shapesContainerKeys[i] = parseInt(shapes[shapesContainer[i]].id.replace(/shape_/, ''));
        shapesContainerKeys[i] = shapes[shapesContainer[i]].key;
    }

    shuffleArr(shapesContainer);
    shuffleArr(shapesContainerPos);

    correctAnswers.fill(-1, 0, correctAnswers.length);
}

function drawGrid(x, y, dim) {
    ctx.strokeStyle = '#f9a139';

    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            ctx.strokeRect(
                x + j * portal.gridDimX + portal.sx + portal.x, 
                y + i * portal.gridDimY + portal.sx + portal.y, 
                portal.gridDimX, 
                portal.gridDimY
            ); 
        }
    }
}

function drawContainerGrid() {
    ctx.strokeStyle = '#f9a139';
    for (let i = 0; i < totalContainerGridRows; ++i) {
        for (let j = 0; j < totalContainerGridCols; ++j) {
            ctx.strokeRect(
                containerGridAdjX + j * containerShapeW, 
                containerGridAdjY + i * containerShapeH, 
                containerShapeW, 
                containerShapeH
            ); 
            
        }

        // if (i == 2) console.log(containerGridAdjY + i * containerShapeH);
    }
}

function displayScore() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    let s = parseInt(textPos.score).toString().padStart(5, '0');
    ctx.fillText(s, textPos.x, textPos.y);
    

    if (Math.floor(textPos.score < score)) {
        textPos.score += 50 * delta;
    } else {
        textPos.score = score;
    }
}

function mousedownE(mx, my) {    
    
    if (!mDown) {
        mouseX = mx;
        mouseY = my;
        mDown = true;
        if (gameover) {
            // canReset = true;
            if (isBtnClicked(mx, my, HUD.endscreenButtons)) {
                submitScore();
            }
        } else if (!portal.isAnimating)  {
            for (let i = 0; i < nContainers; ++i) {
                if (!correctAnswers.includes(i)) {
                    let r = collission(mx, my, shapes[i].x, shapes[i].y, portal.gridDimX, portal.gridDimY);
                    
                    if (r) {
                        // center to mouse
                        let adj = portal.gridDim / 2;
                        shapes[i].x = mx - adj;
                        shapes[i].y = my - adj - shapes[i].h / 2;
    
                        dragID = i;
                        isDraggable = true;
                        
                    }
                }
            }
        }
    }
}

function mousemoveE(mx, my) {
    if (isDraggable) {
        
        let adj = portal.gridDim / 2;
        shapes[dragID].x = mx - adj;
        shapes[dragID].y = my - adj - shapes[dragID].h / 2;

        if (checkContainerCollision()) {
            // console.log('test', hoveredContainerID)
            
        } else {
            hoveredContainerID = -1;
        }
    }
}

function mouseupE() {
    if (mDown) {
        if (isBtnClicked(mouseX, mouseY, {
            x: HUD.volume.x,
            y: HUD.volume.y,
            w: HUD.volume.w,
            h: HUD.volume.h
        })) {
            HUD.volumeOn = !HUD.volumeOn; 
            if (HUD.volumeOn) {
                AM.audio.bg.img.volume = 0.05;
                AM.audio.bg.img.currentTime = 0;
                AM.audio.bg.img.play();
            } else {
                AM.audio.bg.img.pause();
                // music.correct.obj.volume = 0;
            }
            // console.log('test')

            // playAllAudio();
        }
        mDown = false;
    }

    if (gameover) {
        if (canReset) {
            gameover = false;
            canReset = false;

            // restart();
        }
    } else {

        if (!gameStart) {
            // AM.audio.bg.img.volume = 0.2;
            // AM.audio.bg.img.loop = true;
            // AM.audio.bg.img.play();
            if (isBtnClicked(mouseX, mouseY, startButtonInfo)) {
                initAllAudio();

                gameStart = true;

                AM.audio.bg.img.volume = 0.05;
                AM.audio.bg.img.loop = true;
                AM.audio.bg.img.play();
            }
        } else if (isDraggable) {
            
            let id = shapesContainer[hoveredContainerID];
            // console.log(hoveredContainerID, dragID, shapes[id].id, shapes[dragID].id)
            // if (correctAnswers[hoveredContainerID] < 0 && shapes[id].id == shapes[dragID].id) {
            if (correctAnswers[hoveredContainerID] < 0 && shapes[id].key == shapes[dragID].key) {
                // correctAnswers[hoveredContainerID] = dragID;
                correctAnswers[hoveredContainerID] = dragID;
                // score += 10 * portal.duration + portal.bonus;
                score += Math.max(1, 1 + portal.bonus);
                let scoreFormat = zeroPad(Math.floor(score), 2);
                // HUD.txt.texts['score'].str = scoreFormat;
                HUD.updateScoreSprite(scoreFormat);
                // HUD.txt.texts['total'].str = scoreFormat;

                TXT.texts['points'].color = '#4ED20E';
                TXT.texts['points'].str = '+' + Math.floor(1 + portal.bonus);

                jump = jumpHeight;
                jumpPos = shapesContainerPos[hoveredContainerID];
                checkAnswers();

                if (HUD.volumeOn) {
                    // AM.audio.score.img.pause();
                    setTimeout(() => {
                        AM.audio.score.img.currentTime = 0;
                        AM.audio.score.img.volume = 1;
                        AM.audio.score.img.play();
                    }, 0)
                    
                }
            } else {
                if (hoveredContainerID > -1) {
                    score -= 1;
                    score = score < 0 ? 0 : score;

                    let scoreFormat = zeroPad(Math.floor(score), 2);
                    // HUD.txt.texts['score'].str = scoreFormat;
                    HUD.updateScoreSprite(scoreFormat);
                    // HUD.txt.texts['total'].str = scoreFormat;

                    TXT.texts['points'].color = '#fb2121';
                    TXT.texts['points'].str = '-1';

                    jump = jumpHeight;
                    jumpPos = shapesContainerPos[hoveredContainerID];

                    if (HUD.volumeOn) {
                        setTimeout(() => {
                            AM.audio.kaboom.img.currentTime = 0;
                            AM.audio.kaboom.img.volume = 0.05;
                            AM.audio.kaboom.img.play();
                        }, 0)
                        
                    }
                }
            }
    
            shapes[dragID].x = shapes[dragID].ox + portal.x;
            shapes[dragID].y = shapes[dragID].oy + portal.y;
            dragID = -1;
            isDraggable = false;
            hoveredContainerID = -1;
        }
    }
    
}

function restart() {
    initShapesContainer();
    portal.move(canvas.width, canvas.height);
    timer.setTimer(gameDuration);

    score = 0;

    let scoreFormat = zeroPad(Math.floor(score), 2);
    HUD.txt.texts['score'].str = scoreFormat;
    // HUD.txt.texts['total'].str = scoreFormat;
}

function drawShapesContainer() {
    // const colors = ['#10aad7', '#b3d23b', '#10aad7', '#f9a139'];

    for (let i = 0; i < nContainers; ++i) {
        ctx.globalAlpha = 0.5;

        let id = shapesContainer[i];
        // let key = 'container_' + (id + 1);
        // let key = 'container_' + (shapesContainerKeys[id]);
        let key = 'shapes';
        let clipX = shapesContainerKeys[id] * AM.images[key].cw;
        let clipY = AM.images[key].ch;
        
        if (correctAnswers[i] > -1) {
            // let idx = correctAnswers[i];
            ctx.strokeStyle = '#b3d23b';
            ctx.globalAlpha = 1;
            // key = 'shape_' + (id + 1);
            // key = 'shape_' + (shapesContainerKeys[id]);
            key = 'shapes';
            clipY = 0;
        } else if (i == hoveredContainerID) {
            ctx.strokeStyle = '#10aad7';
            ctx.globalAlpha = 1;
        } else {
            ctx.strokeStyle = '#f9a139';
        }

        let x = shapesContainerPos[i] % totalContainerGridCols;
        let y = Math.floor(shapesContainerPos[i] / totalContainerGridCols);
        
        // ctx.drawImage(shapeImages[key], 0, 0, shapes[id].w, shapes[id].h, i * containerRectDimX + cc_x, cc_y, containerRectDimX, containerRectDimY);
        // ctx.drawImage(AM.images[key].img, 0, 0, AM.images[key].cw, AM.images[key].ch, 
        //     x * portal.gridDimX + containerGridAdjX, y * portal.gridDimY + containerGridAdjY, portal.gridDimX, portal.gridDimY);
        // console.log(key)
        ctx.drawImage(AM.images[key].img, clipX, clipY, AM.images[key].cw, AM.images[key].ch, 
            x * containerShapeW + containerGridAdjX, y * containerShapeH + containerGridAdjY, containerShapeW, containerShapeH);
        ctx.globalAlpha = 1;

        // ctx.strokeRect(
        //     i * containerRectDimX + cc_x, 
        //     cc_y, 
        //     containerRectDimX, 
        //     containerRectDimY
        // ); 
    }
}

function checkCollision(r1, r2) {
    return r1.x + r1.w >= r2.x && r1.x <= r2.x + r2.w && r1.y + r1.h >= r2.y && r1.y <= r2.y + r2.h;
 }

function checkContainerCollision() {
    let x = shapes[dragID].x;
    let y = shapes[dragID].y;

    hoveredContainerID = -1;

    for (let i = 0; i < nContainers; ++i) {
        let row = Math.floor(shapesContainerPos[i] / totalContainerGridCols);
        let col = shapesContainerPos[i] % totalContainerGridCols;

        if (checkCollision(shapes[dragID], {
            x: col * containerShapeW + containerGridAdjX,
            y: row * containerShapeH + containerGridAdjY,
            w: containerShapeW,
            h: containerShapeH,
        })) {
            hoveredContainerID = i;
            break;

        }
        // if (isBtnClicked(x, y, {
        //     x: col * containerShapeW + containerGridAdjX,
        //     y: row * containerShapeH + containerGridAdjY,
        //     w: containerShapeW,
        //     h: containerShapeH,
        // })) {
        //     hoveredContainerID = i;
        //     break;

        // }
    }

    return hoveredContainerID > -1;
}

function checkAnswers() {
    let total = 0;
    for (let i = 0; i < correctAnswers.length; ++i) {
        if (correctAnswers[i] > -1) {
            total++;
        }
    }

    if (total == correctAnswers.length) {
        // nContainers = (nContainers + 1) % 9;
        // cc_x = cx - containerRectDimX * nContainers / 2;
        // cc_y = cy - containerRectDimY / 2;
        // correctAnswers = new Array(nContainers).fill(-1);   
        portal.duration = 0;
        // portal.isRefreshing = true;
        portal.shapesOpacity = 0;

        // updateShapes();
        initShapesContainer();
        portal.move(canvas.width, canvas.height);
    }
}

function rngShapes() {
    for (let i = 0; i < nContainers; ++i) {
        let rng = Math.floor(Math.random() * 11);
        
        // let pos = portal.getPos(rng);
        // let id = 'shape_' + (rng + 1);
        // shapes[i].id = id;
        
        // shapes[i].clipW = AM.images[id].cw;
        // shapes[i].clipH = AM.images[id].ch;

        shapes[i].clipX = rng * AM.images.shapes.cw;
        shapes[i].key = rng;
        // shapes[i].clipH = AM.images[id].ch;

        // let shape = new Sprite(pos.x, pos.y, shapeDimX, shapeDimY, AM.images[id].cw, AM.images[id].ch);
        // shapes[i].w = sizes[rng][0];
        // shapes[i].h = sizes[rng][1];
        // shapes[i].x = pos.x * scaleX;
        // shapes[i].y = pos.y * scaleY;
    }
}

function collission(mx, my, x, y, w, h) {
    return mx >= x && mx <= x + w && my >= y && my <= y + h;
}

function showPoints() {
    if (jump > 0) {
        let px = (jumpPos % totalContainerGridCols) * containerShapeW + containerGridAdjX;
        let py = Math.floor(jumpPos / totalContainerGridCols) * containerShapeH + containerGridAdjY;

        let y = py + jump - containerShapeH;
        TXT.follow('points', px, y, containerShapeW, containerShapeH);
        TXT.draw('points');
        jump -= G * jumpSpeed * delta;
    }
}

function update() {
    // placeholder
    // HUD.txt.texts['time'].str = zeroPad(Math.floor(timer.timer / 24), 2);

    if (delta < 1) {
        
        // console.log( Math.floor(timer.timer / 24) / gameDuration * 100)
        
        if (timer.timer <= 0) {
            if (dragID == -1) {
                gameover = true;
                // HUD.updateFinalScore(score);
                HUD.updateGameoverScore(splashInfo, zeroPad(Math.floor(score), 2));
            }
        } else {
            // HUD.timeProgressBar.update(delta, Math.floor(timer.timer / 24) / gameDuration * 100);
            HUD.updateTimerSprite(zeroPad(Math.floor(timer.timer / 24), 2), gameDuration);
            timer.tick(delta);
        }
    }
}

function animateFrame(t, frames) {
    let frame = Math.floor(t) % frames;
    return frame;
}

function drawStartPage() {
    // ctx.drawImage(AM.images.bg.img, 0, 0, AM.images.bg.cw, AM.images.bg.ch, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(AM.images.intro.img, 0, 0, AM.images.intro.cw, AM.images.intro.ch, splashInfo.x, splashInfo.y, splashInfo.w, splashInfo.h);
    // ctx.drawImage(AM.images.title.img, 0, 0, AM.images.title.cw, AM.images.title.ch, 
    //     startPageInfo.title.x, startPageInfo.title.y, startPageInfo.title.w, startPageInfo.title.h);
    
    let frame = animateFrame(startPageInfo.t * 0.5, 15);
    let x = 392 * scaleX;
    let hy = onTablet ? 840 : 300;
    let y = splashInfo.y + hy * splashInfo.sx;
    // let y = splashInfo.y + 300 * splashInfo.sx;
    let w = AM.images.score_anim.cw * 2 * scaleX;
    let h = AM.images.score_anim.ch * 2 * scaleX;
    ctx.drawImage(AM.images.score_anim.img, frame * AM.images.score_anim.cw, 0, AM.images.score_anim.cw, AM.images.score_anim.ch, x, y, w, h);

    frame = animateFrame(startPageInfo.t * 0.5, 13);
    x = 850 * scaleX;
    w = AM.images.portal_anim.cw * 2 * scaleX;
    h = AM.images.portal_anim.ch * 2 * scaleX;
    ctx.drawImage(AM.images.portal_anim.img, frame * AM.images.portal_anim.cw, 0, AM.images.portal_anim.cw, AM.images.portal_anim.ch, x, y, w, h);

    frame = animateFrame(startPageInfo.t * 0.15, 12);
    x = 1298 * scaleX;
    w = AM.images.shape_anim.cw * 2 * scaleX;
    h = AM.images.shape_anim.ch * 2 * scaleX;
    ctx.drawImage(AM.images.shape_anim.img, frame * AM.images.shape_anim.cw, 0, AM.images.shape_anim.cw, AM.images.shape_anim.ch, x, y, w, h);
    
    // let a = Math.sin(startPageInfo.t2) * 20 * scaleX;
    // let b = a / 2;

    // ctx.drawImage(AM.images.img1.img, 0, 0, AM.images.img1.cw, AM.images.img1.ch, 
    //     startPageInfo.img1.x - b, startPageInfo.img1.y - b, startPageInfo.img1.w + a, startPageInfo.img1.h + a);

    // ctx.drawImage(AM.images.img2.img, 0, 0, AM.images.img2.cw, AM.images.img2.ch, 
    //     startPageInfo.img2.x, startPageInfo.img2.y, startPageInfo.img2.w, startPageInfo.img2.h);

    // ctx.save();
    // // Untransformed draw position
    // const position = {x: startPageInfo.img3.x, y: startPageInfo.img3.y};
    // // In degrees
    // const rotation = { x: 0, y: 0, z: Math.sin(startPageInfo.t2) * 180};
    // // Rotation relative to here (this is the center of the image)
    // const rotPt = { x: startPageInfo.img3.w / 2, y: startPageInfo.img3.h / 2 };

    // ctx.setTransform(new DOMMatrix()
    //     .translateSelf(position.x + rotPt.x, position.y + rotPt.y)
    //     .rotateSelf(rotation.x, rotation.y, rotation.z)
    // );
    
    // ctx.drawImage(img, this.clipX, this.clipY, this.clipW, this.clipH, -rotPt.x, -rotPt.y, this.w, this.h);
    // ctx.drawImage(AM.images[key].img, 0, 0, AM.images[key].cw, AM.images[key].ch, -rotPt.x, -rotPt.y, garbageInfo[id].w, garbageInfo[id].h);
    // ctx.drawImage(AM.images.img3.img, 0, 0, AM.images.img3.cw, AM.images.img3.ch, 
    //     -rotPt.x, -rotPt.y, startPageInfo.img3.w, startPageInfo.img3.h);
    // ctx.restore();

    // for (let i = 1; i < 4; ++i) {
    //     let key = 'text' + i;
    //     ctx.drawImage(AM.images[key].img, 0, 0, AM.images[key].cw, AM.images[key].ch, 
    //         startPageInfo[key].x, startPageInfo[key].y, startPageInfo[key].w, startPageInfo[key].h);
    // }

    // TXT.draw('text1_1');
    // TXT.draw('text1_2');

    // TXT.draw('text2_1');
    // TXT.draw('text2_2');

    // TXT.draw('text3_1');
    // TXT.draw('text3_2');

    // ctx.beginPath();
    // ctx.fillStyle = '#11A5CC';
    // ctx.ellipse(startPageInfo.img2.tx, startPageInfo.img2.ty, startPageInfo.img2.tw, startPageInfo.img2.th, 0, 0, 2 * Math.PI);
    

    ctx.fill();
    if (delta < 1) {
        startPageInfo.t += 10 * delta;
        // var radians = Math.PI / 180 * startPageInfo.t;

        // ctx.save();
        // ctx.globalAlpha = 0.95;
        // ctx.beginPath();
        // ctx.moveTo(startPageInfo.img2.tx, startPageInfo.img2.ty);
        // ctx.fillStyle = '#fff';
        // ctx.ellipse(startPageInfo.img2.tx, startPageInfo.img2.ty, startPageInfo.img2.tw, startPageInfo.img2.th, 0, radians, Math.PI + Math.PI / 2);
        // ctx.closePath();
        
        // ctx.fill();
        // ctx.restore();

        startPageInfo.t += 10 * delta;
        // startPageInfo.t2 += 1 * delta;
    }

    // ctx.beginPath();
    // ctx.rect(startButtonInfo.x, startButtonInfo.y, startButtonInfo.w, startButtonInfo.h);
    // ctx.stroke();

    // ctx.drawImage(AM.images.start.img, 0, 0, AM.images.start.cw, AM.images.start.ch, 
    //     startPageInfo.start.x, startPageInfo.start.y, startPageInfo.start.w, startPageInfo.start.h);
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    if (!gameover) {
        if (gameStart) {
            ctx.drawImage(AM.images.bg.img, 0, 0, AM.images.bg.cw, AM.images.bg.ch, 0, 0, canvas.width, canvas.height);
            HUD.draw(ctx);
            // displayScore();
            let a = Math.sin(portal.t);
            let pw = a * portal.w;
            let ph = a * portal.h;
            let tmp = (portal.w - pw) / 2;
            let tmpH = (portal.h - ph) / 2;

            ctx.drawImage(AM.images.portal.img, 0, 0, AM.images.portal.cw, AM.images.portal.ch, (portal.x + tmp), (portal.y + tmpH), pw, ph);
            // console.log(portal.shapesOpacity)
            drawShapesContainer();

            if (!portal.isRefreshing) {
                for (let i = 0; i < nContainers; ++i) {
                    if (dragID == i) {
                        ctx.globalAlpha = 1;
                    } else {
                        ctx.globalAlpha = portal.shapesOpacity;
                    }

                    if (!correctAnswers.includes(i)) {
                        // shapes[i].draw(ctx, shapeImages[shapes[i].id], shapeDim * scaleX, shapeDim * scaleY);
                        shapes[i].draw(ctx, AM.images[shapes[i].id].img);
                    }
                }
                ctx.globalAlpha = 1;
                // drawGrid(portal.x, portal.y, portal.gridDim)
            }


            if (timer.timer > 0) {
                

                
                // drawGrid(portal.x, portal.y, portal.gridDim)

                
                // drawContainerGrid();

                portal.animate();

                portal.trigger();

                
            } 
            
            showPoints();
            update();
        } else {
            drawStartPage();
        }
    } else {
        // HUD.draw(ctx);
        
        HUD.gameover(ctx, splashInfo, delta);
    }

    requestAnimationFrame(gameCycle);
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);