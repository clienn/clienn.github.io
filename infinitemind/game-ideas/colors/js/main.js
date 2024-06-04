const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');

const colorDisplay = document.getElementById('color-display');
const noAnswer = document.getElementById('no-answer');
const yesAnswer = document.getElementById('yes-answer');
const scoreContainer = document.getElementById('score');
const cssGame = document.getElementById('css-game');

var last = 0;
var delta = 0;
var startGame = false; // orientation prep
var gameStart = false; // start game
var gameover = false;

var scaleX = 1;
var scaleY = 1;

var mDown = false;

const colors = {
    texts: ['WHITE', 'BLACK', 'RED', 'GREEN', 'BLUE', 'YELLOW'],
    colors: [0, 1, 2, 3, 4, 5]
    // colors: ['#fff', '#000', '#f00', '#0f0', '#00f', '#ff0']
}

var round = null;
var score = 0;

var chainBonus = 0;
var maxChainBonus = 3;
var timeBonus = 3;

// 1792 922

function main(w, h) {
    gameStart = true;

    canvas.width = w;
    canvas.height = h;

    canvas.style.display = 'block';
    cssGame.style.display = 'flex';

    scaleX = w / 1792;
    scaleY = h / 922;

    controls();

    nextRound();

    gameCycle();
}

function nextRound() {
    if (round) {
        colorDisplay.classList.remove('color-' + round.colorRNG);
        colorDisplay.classList.remove('text-color-' + round.textColorRNG);
    }
    timeBonus = 3;
    round = generateRound();
    applyRound();
}

function generateRound() {
    let textRNG = Math.floor(Math.random() * colors.texts.length);
    let arr = [...colors.colors];
    
    // let textColorRNG = arr[Math.floor(Math.random() * arr.length)];
    // arr.splice(textColorRNG, 1);

    let chance = Math.floor(Math.random() * 2); // 50% chance correct
    let colorRNG = chance ? textRNG : arr[Math.floor(Math.random() * arr.length)];

    arr.splice(colorRNG, 1);
    let textColorRNG = arr[Math.floor(Math.random() * arr.length)];
    
    // console.log(textColorRNG, colorRNG)

    return {
        textRNG: textRNG,
        textColorRNG: textColorRNG,
        colorRNG: colorRNG,
        answer: textRNG == colorRNG
    }
}

function applyRound() {
    colorDisplay.innerHTML = colors.texts[round.textRNG];
    // scoreContainer.innerHTML = 'SCORE:' + score.toFixed(2);
    updateScore();
    // colorDisplay.classList.remove(true);
    colorDisplay.classList.add('color-' + round.colorRNG);
    colorDisplay.classList.add('text-color-' + round.textColorRNG);
}

function updateScore() {
    scoreContainer.innerHTML = 'SCORE: ' + score.toFixed(2);
}

function noAnswerUpdate() {
    if (!round.answer) {
        score = score + 1 + chainBonus + timeBonus;
        chainBonus = Math.min(maxChainBonus, chainBonus + 1);
        console.log(chainBonus)
    } else {
        score--;
        chainBonus = 0;
    }

    updateScore();
    nextRound();
}

function yesAnswerUpdate() {
    if (round.answer) {
        score = score + 1 + chainBonus + timeBonus;
        chainBonus = Math.min(maxChainBonus, chainBonus + 1);
        console.log(chainBonus)
    } else {
        score--;
        chainBonus = 0;
    }

    updateScore();

    nextRound();
}

function controls() {

    noAnswer.addEventListener('touchstart', (e) => {
        e.preventDefault();

        if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
            var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
            var touch = evt.touches[0] || evt.changedTouches[0];
            prevPos = touch.pageX;
            prevPosY = touch.pageY;

            if (!mDown) {
                noAnswerUpdate();
                mDown = true;
            }
        }
    });

    noAnswer.addEventListener('touchend', (e) => {
        e.preventDefault();
        
        if (mDown) {
            mDown = false;
        }
    });

    yesAnswer.addEventListener('touchend', (e) => {
        e.preventDefault();
        
        if (mDown) {
            mDown = false;
        }
    });

    yesAnswer.addEventListener('touchstart', (e) => {
        e.preventDefault();

        if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
            var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
            var touch = evt.touches[0] || evt.changedTouches[0];
            prevPos = touch.pageX;
            prevPosY = touch.pageY;

            if (!mDown) {
                yesAnswerUpdate();
                mDown = true;
            }
        }
    });

    noAnswer.addEventListener('mousedown', (e) => {
        if (!mDown) {
            noAnswerUpdate();
            mDown = true;
        }
    });

    noAnswer.addEventListener('mouseup', (e) => {
        if (mDown) {
            
            mDown = false;
        }
    });

    yesAnswer.addEventListener('mousedown', (e) => {
        if (!mDown) {
            yesAnswerUpdate();
            mDown = true;
        }
    });

    yesAnswer.addEventListener('mouseup', (e) => {
        if (mDown) {
            
            mDown = false;
        }
    });
}

function isPortrait() {
    return window.innerHeight > window.innerWidth;
}


function update() {
    timeBonus -= delta;
    if (timeBonus < 0) {
        timeBonus = 0;
    }
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    if (!gameover) {
        if (gameStart) {
            // bg
            // ctx.drawImage(images.bg.obj.img, 0, 0, 927, 429, 0, 0, canvas.width, canvas.height);

            update();

            
        } else {
        
            // ctx.drawImage(images.splash.obj.img, 0, 0, 927, 429, 0, 0, canvas.width, canvas.height);

            // ctx.beginPath();
            // ctx.rect(btnBegin.x, btnBegin.y, btnBegin.w, btnBegin.h);
            // ctx.stroke();

        }
        requestAnimationFrame(gameCycle);
    }

    
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);
