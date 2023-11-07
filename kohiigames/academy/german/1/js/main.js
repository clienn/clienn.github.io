const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');

var instrucions = document.getElementById("game-instructions");


// delta time
var last = 0;
var delta = 0;

// game start
var startGame = false; // orientation prep
var gameStart = true; // start game
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

var cards = [];

const cardInfo = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    rotationSpeed: 200,
    lineWidth: 40
}

colors = ['#FEE1D4', '#D0E8F2', '#DAEEC9', '#FFF7D3', '#FFE9E7', 
    '#fbf3d0', '#f4e477', '#bc9640', '#fed4d7', 'fe9ba3', '#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94'];

var cardCount = 10;
var startIdx = 0;
var currCard = cardCount - 1;

var zIndexList = [];
var textLists = [
    'Der Schwiegervater',
    'Das Fotoapparat',
    'Das Wasser',
    'Das Haus'
];

var G = 9.8;
var score = 0;
var multiplier = 1;
var negativeMultiplier = 1;

var points = [];
var jump = 0;
var jumpHeight = 50;
var jumpSpeed = 25;

var jumpPoint = {
    x: 0,
    y: 0
}

var scoreTxt = null;
var finalScoreTxt = null;

var progress = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
}

var answers = [];

var gameoverImageInfo = {};

// 1792 922

// #fb2121 - red
// #C7FC12 - lime
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

    jumpPoint.x = w / 2;
    jumpPoint.y = h / 3;

    G *= scaleY;

    progress.top = 0;
    progress.right = 0;
    progress.bottom = 0;
    progress.left = 0;

    cardInfo.w = w * 0.85;
    cardInfo.h = h * 0.85;

    cardInfo.x = w / 2 - cardInfo.w / 2;
    cardInfo.y = h / 2 - cardInfo.h / 2;

    cardInfo.lineWidth *= scaleX;
    initGameoverImageInfo(5, 5);
    init();

    addPoint();

    controls();
    
    gameCycle();
}

function init() {
    for (let i = 0; i < cardCount; ++i) {
        addCard();
        
        zIndexList[i] = i;
    }

    scoreTxt = new Text(ctx, canvas.width, canvas.height);
    scoreTxt.setScale(scaleX, scaleY);

    scoreTxt.addText('total', score, 'bold', 30, 'Montserrat', 0, 0, 100, 40, '#fff', true);

    finalScoreTxt = new Text(ctx, canvas.width, canvas.height);
    finalScoreTxt.setScale(scaleX, scaleY);

    score = 0;
    
    setFinalScoreText();

    finalScoreTxt.addText('finalscoreLabel', 'YOU SCORED', 'bold', 30, 'Montserrat', 0, 0, 800, 45, '#fff', true);
    finalScoreTxt.follow('finalscoreLabel', canvas.width / 2 - finalScoreTxt.texts['finalscoreLabel'].w / 2, canvas.height / 2 - finalScoreTxt.texts['finalscoreLabel'].h * 1.3, 0, 0);
}

function setFinalScoreText() {
    let l = score.toString().length;
    let mult = score < 0 ? 180 : 200;
    let w = mult * l;
    let h = 70;
    finalScoreTxt.addText('finalscore', score, 'bold', 30, 'Montserrat', 0, 0, w, h, '#fff', true);

    if (score < 0) {
        finalScoreTxt.texts['finalscore'].color = '#fb2121';
    } else if (score == 0) {
        finalScoreTxt.texts['finalscore'].color = '#fff';
    } else {
        finalScoreTxt.texts['finalscore'].color = '#C7FC12';
        // 10aad7
    }

    finalScoreTxt.follow('finalscore', canvas.width / 2 - finalScoreTxt.texts['finalscore'].w / 2, canvas.height / 2, 0, 0);
}

function initGameoverImageInfo(sx, sy) {
    let k = 'happy1';
    gameoverImageInfo[k] = {
        w: AM.images[k].cw * 2.5 * scaleX,
        h: AM.images[k].ch * 2.5 * scaleX,
    }

    gameoverImageInfo[k].x = canvas.width / 2 - gameoverImageInfo[k].w / 2;
    gameoverImageInfo[k].y = canvas.height / 2.5 - gameoverImageInfo[k].h;

    k = 'happy2';
    gameoverImageInfo[k] = {
        w: AM.images[k].cw * 2.5 * scaleX,
        h: AM.images[k].ch * 2.5 * scaleX,
    }

    gameoverImageInfo[k].x = canvas.width / 2 - gameoverImageInfo[k].w / 2;
    gameoverImageInfo[k].y = canvas.height / 2.5 - gameoverImageInfo[k].h;

    k = 'happy3';
    gameoverImageInfo[k] = {
        w: AM.images[k].cw * 2 * scaleX,
        h: AM.images[k].ch * 2 * scaleX,
    }

    gameoverImageInfo[k].x = canvas.width / 2 - gameoverImageInfo[k].w / 2;
    gameoverImageInfo[k].y = canvas.height / 2.5 - gameoverImageInfo[k].h;

    k = 'sad1';
    gameoverImageInfo[k] = {
        w: AM.images[k].cw * 5 * scaleX,
        h: AM.images[k].ch * 5 * scaleX,
    }

    gameoverImageInfo[k].x = canvas.width / 2 - gameoverImageInfo[k].w / 2;
    gameoverImageInfo[k].y = canvas.height / 2.5 - gameoverImageInfo[k].h;
}

function displayGameover() {
    let k = '';

    if (score > 100000) {
        k = 'happy3';
    } else if (score > 25000) {
        k = 'happy2';
    }  else if (score > 0) {
        k = 'happy1';
    } else {
        k = 'sad1'
    }
    // console.log(gameoverImageInfo[k].w, gameoverImageInfo[k].h)
    ctx.drawImage(AM.images[k].img, 0, 0, AM.images[k].cw, AM.images[k].ch, gameoverImageInfo[k].x, gameoverImageInfo[k].y, gameoverImageInfo[k].w, gameoverImageInfo[k].h);
}

function getPhrase() {
    let n = Object.keys(PHRASES).length;
    let rng = Math.floor(Math.random() * n);
    let list = Object.values(PHRASES)[rng];

    let nPhrases = Object.keys(list).length;
    let rng2 = Math.floor(Math.random() * nPhrases);
    let phrase = Object.keys(list)[rng2];

    // console.log(n, nPhrases, phrase);

    let rng3 = Math.floor(Math.random() * n);

    return {
        phrase: Object.keys(PHRASES)[rng3] + ' ' + phrase,
        result: rng == rng3
    }
}

function addPoint() {
    let pt = new Text(ctx, canvas.width, canvas.height);
    pt.setScale(scaleX, scaleY);

    points.push(pt);
}

function setPoint(pts, color) {
    for (let i = 0; i < points.length; ++i) {
        let w = 0;
        if (multiplier < 16) {
            w = 250
        } else if (multiplier < 128) {
            w = 350
        } else if (multiplier < 1024) {
            w = 450
        } else {
            w = 500;
        }
        points[i].addText('score', pts, 'bold', 30, 'Montserrat', 0, 0, w, 50, '#000', true);
        points[i].texts['score'].color = color;
    }
}

function progressUpdate(k, limit) {
    if (progress[k] < limit) {
        progress[k] += 24 * delta;
        
        if (progress[k] >= limit) {
            progress[k] = limit;
        }

        return true;
    }

    return false;
}

function drawProgress() {
    ctx.save();
    ctx.strokeStyle = '#C7FC12';
    ctx.lineWidth = '15';
    
    if (delta < 1) {
        if (progressUpdate('top', canvas.width)) {
            ctx.strokeStyle = '#C7FC12';
        } else if (progressUpdate('right', canvas.height)) {
            ctx.strokeStyle = '#FFE095';
        } else if (progressUpdate('bottom', canvas.width)) {
            ctx.strokeStyle = '#f9a139';
        } else if (progressUpdate('left', canvas.height)) {
            ctx.strokeStyle = '#fb2121';
        } else {
            setFinalScoreText();
            gameover = true;
        }
    }
    
    ctx.beginPath();
    // top
    ctx.moveTo(progress.top, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.stroke();

    // right
    ctx.moveTo(canvas.width, progress.right);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();

    // bottom
    ctx.moveTo(canvas.width - progress.bottom, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();

    // left
    ctx.moveTo(0, canvas.height - progress.left);
    ctx.lineTo(0, 0);
    ctx.stroke();

    ctx.restore();
}

function addScore(flag) {
    if (flag) {
        score += multiplier;
    } else {
        score -= negativeMultiplier;
    }
    
    let l = score.toString().length;
    scoreTxt.addText('total', score, 'bold', 30, 'Montserrat', 0, 0, 100 * l, 30, '#fff', true);
}

function displayPoints() {
    // points[0].draw('score');
    // points[0].follow('score', jumpPoint.x - points[0].texts['score'].w / 2, jumpPoint.y, 0, 0);
    if (jump > 0) {
        let y = jumpPoint.y + jump;
        for (let i = 0; i < points.length; ++i) {
            points[i].follow('score', jumpPoint.x - points[0].texts['score'].w / 2, y, 0, 0);
            points[i].draw('score');
            jump -= G * jumpSpeed * delta;
        }
    }

    scoreTxt.follow('total', jumpPoint.x - scoreTxt.texts['total'].w / 2, 27, 0, 0);
    scoreTxt.draw('total');
}

function nextCard() {
    currCard = (currCard - 1);
    if (currCard < 0) currCard = cardCount - 1;

    let phraseInfo = getPhrase();
    cards[currCard].setText(phraseInfo.phrase);
    answers[currCard] = phraseInfo.result;
}

function moveZindex() {
    let n = zIndexList.pop();
    let rng = Math.floor(Math.random() * textLists.length);
    cards[n].setText(textLists[rng]);
    zIndexList.unshift(n);
}

function addCard() {
    // let card = new Card(cardInfo.x, cardInfo.y, cardInfo.w, cardInfo.h, '#FFE095');
    let rng = Math.floor(Math.random() * colors.length);
    let card = new Card(cardInfo.x, cardInfo.y, cardInfo.w, cardInfo.h, colors[rng]);
    card.lineWidth = cardInfo.lineWidth;

    card.txt = new Text(ctx, canvas.width, canvas.height);

    // rng = Math.floor(Math.random() * textLists.length);
    // card.txt.addText('text', textLists[rng], 'bold', 25, 'Montserrat', 0, 0, cardInfo.w * 0.50, 45, '#000', true);
    let phraseInfo = getPhrase();
    card.setText(phraseInfo.phrase);
    answers.push(phraseInfo.result);
    cards.push(card);
}

function drawCards() {
    let flag = false;

    for (let i = 0; i < zIndexList.length; ++i) {
        let idx = zIndexList[i];
        cards[idx].draw(ctx);
        cards[idx].update(delta);
        
        if (cards[idx].rotationStatus == 2) {
            moveZindex();
            cards[idx].rotationStatus = 0;
        }
    }
}

function validateAnswer(flag) {
    if (answers[currCard] == flag) {
        addScore(true); 
        setPoint('+' + multiplier, '#10aad7');
        negativeMultiplier = 1;
        if (multiplier < 1024) {
            multiplier *= 2;
        }

        playScore();
    } else {
        addScore(false); 
        setPoint('-' + negativeMultiplier, '#fb2121');
        multiplier = 1;
        if (negativeMultiplier < 1024) {
            negativeMultiplier *= 2;
        }

        playCry();
    }

    jump = jumpHeight;
}

function controls() {
    let mid = canvas.width / 2;
    let prevPos = 0;
    let prevPosY = 0;

    window.addEventListener('blur', () => {
        // muteAllAudio(true);
    });

    window.addEventListener('focus', () => {
        // muteAllAudio(false);
    });

    document.addEventListener('blur', () => {
        // muteAllAudio(true);
    });

    document.addEventListener('focus', () => {
        // muteAllAudio(false);
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
                prevPosY = touch.pageY;
                
                if (!mDown) {
                    mDown = true;
                }
            }
        }
    });

    document.addEventListener('touchend', (e) => {
        e.preventDefault();
        
        if (!gameover) {
            var touch = e.touches[0] || e.changedTouches[0];
            var x = touch.pageX;
            
            // var y = e.changedTouches[event.changedTouches.length-1].pageY;

            if (mDown) {
                mDown = false;
                let d = prevPos < x ? 1 : -1;
                let dist = Math.abs(prevPos - x);
                // console.log(prevPos, x)
                
                if (dist > 1) {
                    cards[currCard].initRotation(d * cardInfo.rotationSpeed);
                    validateAnswer(d > 0 ? true : false);
                    nextCard();

                }
                
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
                let y = touch.pageY;

                if (gameover) mDown = false;

                if (mDown) {
                    
                }

                // prevPos = x;
                prevPosY = y;
            }
        }
    });

    canvas.addEventListener('touchend', e => {
        var touch = e.touches[0] || e.changedTouches[0];
        let x = touch.pageX;
        let y = touch.pageY;

        if (!gameStart) {
            
            gameStart = true;
        } 

        if (mDown) {
            // console.log(prevPos, x)
        }

        if (gameover) {
            // reset();
        }
        
    });

    canvas.addEventListener('mousedown', e => {
        let mx = e.offsetX;
        let my = e.offsetY;

        if (!mDown) {
            if (gameStart) {
                mDown = true;
            }
        }

        
    });


    canvas.addEventListener('mousemove', e => {
        let mx = e.offsetX;
        let my = e.offsetY;

        if (gameover) mDown = false;

        if (mDown) {
            prevPos = mx;
            prevPosY = my;
        }
    });
    
    canvas.addEventListener('mouseup', e => {
        if (mDown) {
            if (!gameStart) {
                gameStart = true;
            }

            mDown = false;

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
                    // cards[1].startRotation = true;
                    // cards[1].rotationVel = cardInfo.rotationSpeed;
                }
            } else if (e.key == 'ArrowLeft') {
                if (!lDown) {
                    lDown = true;
                    // cards[1].startRotation = true;
                    // cards[1].rotationVel = -cardInfo.rotationSpeed;
                }
            }
        }
        
    });

    document.addEventListener('keyup', e => {
        if (!gameover) {
            if (e.key == 'ArrowRight') {
                rDown = false;
                cards[currCard].initRotation(cardInfo.rotationSpeed);
                // cards[currCard].rotationVel = cardInfo.rotationSpeed;
                validateAnswer(true);
                nextCard();
                // addScore(); 
                // setPoint('+' + multiplier, '#10aad7');
                // jump = jumpHeight;
            } else if (e.key == 'ArrowLeft') {
                lDown = false;
                cards[currCard].initRotation(-cardInfo.rotationSpeed);
                // cards[currCard].rotationVel = -cardInfo.rotationSpeed;
                // addScore(); 
                // setPoint('+' + multiplier, '#10aad7');
                // jump = jumpHeight;
                validateAnswer(false);
                nextCard();
            }
        }
    });
}

// *********************************** GAME INITIATLIZATIONS AND CONTROLS END ******************************************************** //


/*
 * PHYSICS
 */

function checkAngledCollisions(obj1, obj2) {
    return doPolygonsIntersect(
        [{ x: obj1.x, y: obj1.y }, { x: obj1.x + obj1.w, y: obj1.y }, { x: obj1.x + obj1.w, y: obj1.y + obj1.h }, { x: obj1.x, y: obj1.y + obj1.h }],
        [{ x: obj2.x, y: obj2.y }, { x: obj2.x + obj2.w, y: obj2.y }, { x: obj2.x + obj2.w, y: obj2.y + obj2.h }, { x: obj2.x, y: obj2.y + obj2.h }]
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
// function showPoints(pointType) {
//     // HUD.draw(ctx, AM.images.timecircle.img);
//     // jumpPointsT += 1 * delta;
//     if (jump > 0) {
//         let y = eelHead.y + jump - eelHead.h;
//         TXT.follow('points', eelHead.x, y, eelHead.w, eelHead.h);
//         TXT.draw('points');
//         jump -= G * jumpSpeed * delta;
//     }
// }

// function setPoints(points, color) {
//     jump = jumpHeight;
//     TXT.texts['points'].color = color;
//     TXT.texts['points'].str = points;
// }

// *********************************** TEXT DISPLAYS END ******************************************************** //


/*
 * SOUNDS
 */
function playCry() {
    // if (HUD.volumeOn) {
        // AM.audio.cry.img.pause();
        // AM.audio.cry.img.currentTime = 0;
        
        setTimeout(() => {
            AM.audio.cry.img.currentTime = 0;
            AM.audio.cry.img.play();
        }, 0);
    // }
}

// function playEat() {
//     if (HUD.volumeOn) {
//         AM.audio.eat.img.pause();
//         AM.audio.eat.img.currentTime = 0;
//         AM.audio.eat.img.play();
//     } 
// }

function playScore() {
    // if (HUD.volumeOn) {
        // AM.audio.score.img.pause();
        // AM.audio.score.img.currentTime = 0;
        setTimeout(() => {
            AM.audio.score.img.currentTime = 0;
            AM.audio.score.img.play();
        }, 0);
        
    // }
}

// function playBonus() {
//     if (HUD.volumeOn) {
//         AM.audio.bonus.img.pause();
//         AM.audio.bonus.img.currentTime = 0;
//         AM.audio.bonus.img.play();
//     }
// }

// *********************************** SOUNDS END ******************************************************** //

// #11A5CC
// #F8E7CD
/*
 * GAME UPDATES AND CYCLES
 */

function update() {
    
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    if (!gameover) {
        if (gameStart) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawCards(ctx);
            displayPoints();
            drawProgress();
            update();
        }
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        displayGameover();

        finalScoreTxt.draw('finalscoreLabel');
        finalScoreTxt.draw('finalscore');
    }

    requestAnimationFrame(gameCycle);
}
// *********************************** GAME UPDATES AND CYCLES END ******************************************************** //

