const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');

var instrucions = document.getElementById("game-instructions");
var btnStart = document.getElementById("btnStart");

var last = 0;
var delta = 0;
var startGame = false;

var bg = null;

var portal = {
    x: 0,
    y: 0,
    img: null,
    w: 401,
    h: 401,
    t: 0,
    et: 1.5,
    duration: 5,
    bonus: 100,
    isAnimating: true,
    isRefreshing: false,
    shapesOpacity: 0,
    gridDim: 75,
    sx: 0,
    rng: [...Array(9).keys()],
    init: () => {
        shuffleArr(portal.rng);
        portal.sx = (portal.w) / 2 - (portal.gridDim * 3) / 2;
    },
    getPos: (i) => {
        return {
            x: (portal.rng[i] % 3) * portal.gridDim + portal.sx,
            y: (Math.floor(portal.rng[i] / 3)) * portal.gridDim + portal.sx
        }
    },
    move: (w, h) => {
        w -= portal.w * scaleX / 2;
        h -= portal.h * scaleY / 2;

        let flag = Math.floor(Math.random() * 2);
        if (flag) {
            portal.x = Math.floor(Math.random() * w);
            portal.y = 0;
        } else {
            portal.x = 0;
            portal.y = Math.floor(Math.random() * h);
        }

        shuffleArr(portal.rng);

        shapes.forEach((shape, i) => {
            let pos = portal.getPos(i);
            shape.shuffle(pos.x * scaleX, pos.y * scaleY);

            shape.x = shape.ox + portal.x * scaleX;
            shape.y = shape.oy + portal.y * scaleY;
        });
    },
    animate: () => {
        if (portal.isAnimating) {
            if (portal.shapesOpacity > 0) {
                portal.shapesOpacity -= 1 * delta;
                if (portal.shapesOpacity <= 0) {
                    portal.shapesOpacity = 0;
                    portal.isRefreshing = false;
                }
            } else if (portal.t < portal.et) {
                portal.t += 1 * delta;
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
            portal.duration -= 1 * delta;
            if (portal.duration <= 0) {
                portal.toggle();
                
                portal.duration = portal.et == 1.5 ? (Math.floor(Math.random() * 3) + 1) : 1;
            }
        }
    }
};

var shapes = []; 
var shapeImages = []; 
var shapeDim = 75;

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
var nContainers = 5;

var isDraggable = false;

var dragID = -1;
var hoveredContainerID = -1;
var shapesContainer = [];
var correctAnswers = new Array(5).fill(-1);
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

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    canvas.style.display = 'block';
    instrucions.style.display = 'none';

    scaleX = w / 1792;
    scaleY = h / 922;
    textPos.x = w - 100;
    textPos.y = 50;

    containerRectDimX *= scaleX;
    containerRectDimY *= scaleY;

    cx = w / 2;
    cy = h / 2;
    cc_x = cx - containerRectDimX * nContainers / 2;
    cc_y = cy - containerRectDimY / 2;

    bg = new Image();
    bg.src = 'assets/bg.png';
    bg.onload = function() {
        isLoaded++;
    }

    portal.img = new Image();
    portal.img.src = 'assets/rings.png';
    portal.img.onload = function() {
        isLoaded++;
    }

    portal.init();

    for (let i = 0; i < 5; ++i) {
        shapeImages[i] = new Image();
        shapeImages[i].src = 'assets/shape' + (i + 1) + '.png';
        shapeImages[i].onload = function() {
            isLoaded++;
        }

        let pos = portal.getPos(i);
        shapes.push(new Shape(i, sizes[i][0], sizes[i][1], pos.x * scaleX, pos.y * scaleY));
        // shapes.push(new Shape(i + 5, sizes[i][0], sizes[i][1], pos.x * scaleX, pos.y * scaleY));
    }

    for (let i = 5; i < 9; ++i) {
        let rng = Math.floor(Math.random() * 5);
        let pos = portal.getPos(rng);
        shapes.push(new Shape(rng, sizes[rng][0], sizes[rng][1], pos.x * scaleX, pos.y * scaleY));
    }

    // console.log(shapes[0].x, shapes[0].y)

    canvas.addEventListener('touchstart', e => {
        mousedownE(e.touches[0].clientX, e.touches[0].clientY);
    });

    canvas.addEventListener('touchmove', e => {
        mousemoveE(e.touches[0].clientX, e.touches[0].clientY);
    });

    canvas.addEventListener('touchend', e => {
        mouseupE();
    });

    canvas.addEventListener('mousedown', e => {
        mousedownE(e.offsetX, e.offsetY);
    });

    canvas.addEventListener('mousemove', e => {
        mousemoveE(e.offsetX, e.offsetY);
    });
    
    canvas.addEventListener('mouseup', e => {
        mouseupE();
    });
    
    initShapesContainer();
    gameCycle();
}

function isPortrait() {
    return window.innerHeight > window.innerWidth;
}

function initShapesContainer() {
    shapesContainer = [...Array(nContainers).keys()];
    shuffleArr(shapesContainer);
}

function shuffleArr (array){
    for (var i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]]
    }
}

function drawGrid(x, y, dim) {
    ctx.strokeStyle = '#f9a139';

    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            ctx.strokeRect(
                x + j * portal.gridDim + portal.sx + portal.x, 
                y + i * portal.gridDim + portal.sx + portal.y, 
                dim, 
                dim
            ); 
        }
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
    if (!portal.isAnimating)  {
        for (let i = 0; i < nContainers; ++i) {
            if (!correctAnswers.includes(i)) {
                let r = collission(mx, my, shapes[i].x, shapes[i].y, portal.gridDim * scaleX, portal.gridDim * scaleY);

                if (r) {
                    // center to mouse
                    let adj = portal.gridDim / 2;
                    shapes[i].x = mx - adj;
                    shapes[i].y = my - adj;

                    dragID = i;
                    isDraggable = true;
                    
                }
            }
        }
    }
}

function mousemoveE(mx, my) {
    if (isDraggable) {
        let adj = portal.gridDim / 2;
        shapes[dragID].x = mx - adj;
        shapes[dragID].y = my - adj;

        if (checkContainerCollision()) {
            // console.log('test', hoveredContainerID)
            
        } else {
            hoveredContainerID = -1;
        }
    }
}

function mouseupE() {
    if (isDraggable) {
        let id = shapesContainer[hoveredContainerID];
        if (correctAnswers[hoveredContainerID] < 0 && shapes[id].id == shapes[dragID].id) {
            // correctAnswers[hoveredContainerID] = dragID;
            correctAnswers[hoveredContainerID] = dragID;
            score += 10 * portal.duration + portal.bonus;
            checkAnswers();
        } else {
            score -= 10;
            score = score < 0 ? 0 : score;
        }

        shapes[dragID].x = shapes[dragID].ox + portal.x * scaleX;
        shapes[dragID].y = shapes[dragID].oy + portal.y * scaleY;
        dragID = -1;
        isDraggable = false;
        hoveredContainerID = -1;
    }
}


function drawShapesContainer() {
    // const colors = ['#10aad7', '#b3d23b', '#10aad7', '#f9a139'];

    for (let i = 0; i < nContainers; ++i) {
        ctx.globalAlpha = 0.5;

        if (correctAnswers[i] > -1) {
            // let idx = correctAnswers[i];
            ctx.strokeStyle = '#b3d23b';
            ctx.globalAlpha = 1;
        } else if (i == hoveredContainerID) {
            ctx.strokeStyle = '#10aad7';
        } else {
            ctx.strokeStyle = '#f9a139';
        }

        let id = shapesContainer[i];
        
        ctx.drawImage(shapeImages[shapes[id].id], 0, 0, shapes[id].w, shapes[id].h, i * containerRectDimX + cc_x, cc_y, containerRectDimX, containerRectDimY);
        ctx.globalAlpha = 1;

        ctx.strokeRect(
            i * containerRectDimX + cc_x, 
            cc_y, 
            containerRectDimX, 
            containerRectDimY
        ); 
    }
}

function checkContainerCollision() {
    let x = shapes[dragID].x;
    let y = shapes[dragID].y;
    let xw = x + containerRectDimX;
    let yh = y + containerRectDimY;

    let ex = cc_x + containerRectDimX * nContainers;
    let ey = cc_y + containerRectDimY;

    if (x >= cc_x && x <= ex && y >= cc_y && y <= ey) {
        hoveredContainerID = Math.floor((x - cc_x) / containerRectDimX);
    } else if (xw >= cc_x && xw <= ex && yh >= cc_y && yh <= ey) {
        hoveredContainerID = Math.floor((xw - cc_x) / containerRectDimX);
    } else {
        hoveredContainerID = -1;
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
        nContainers = (nContainers + 1) % 9;
        cc_x = cx - containerRectDimX * nContainers / 2;
        cc_y = cy - containerRectDimY / 2;
        correctAnswers = new Array(nContainers).fill(-1);   
        portal.duration = 0;
        portal.isRefreshing = true;

        updateShapes();
        initShapesContainer();
        
    }
}

function updateShapes() {
    for (let i = 0; i < nContainers; ++i) {
        let rng = Math.floor(Math.random() * 5);
        
        let pos = portal.getPos(rng);
        shapes[i].id = rng;
        shapes[i].w = sizes[rng][0];
        shapes[i].h = sizes[rng][1];
        shapes[i].x = pos.x * scaleX;
        shapes[i].y = pos.y * scaleY;
    }
}

function collission(mx, my, x, y, w, h) {
    return mx >= x && mx <= x + w && my >= y && my <= y + h;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function update() {
    // placeholder
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;
    
    if (isLoaded == 7) {
        ctx.drawImage(bg, 0, 0, 926, 428, 0, 0, canvas.width, canvas.height);

        displayScore();

        let a = Math.sin(portal.t);
        let pw = a * portal.w;
        let tmp = (portal.w - pw) / 2;

        ctx.drawImage(portal.img, 0, 0, portal.w, portal.h, (portal.x + tmp) * scaleX, (portal.y + tmp) * scaleY, pw * scaleX, pw * scaleY);
        // console.log(portal.shapesOpacity)
        
        if (!portal.isRefreshing) {
            for (let i = 0; i < nContainers; ++i) {
                if (dragID == i) {
                    ctx.globalAlpha = 1;
                } else {
                    ctx.globalAlpha = portal.shapesOpacity;
                }

                if (!correctAnswers.includes(i)) {
                    shapes[i].draw(ctx, shapeImages[shapes[i].id], shapeDim * scaleX, shapeDim * scaleY);
                }
            }
            ctx.globalAlpha = 1;
        }

        drawShapesContainer();

        portal.animate();

        portal.trigger();
        
    }

    requestAnimationFrame(gameCycle);
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);