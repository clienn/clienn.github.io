const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');

var instrucions = document.getElementById("game-instructions");
var btnStart = document.getElementById("btnStart");

var last = 0;
var delta = 0;
var startGame = false;

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
}

var scaleX = 1, scaleY = 1;

const colors = ['#10aad7', '#10aad7', '#f9a139'];
// const colors = ['#10aad7', '#b3d23b', '#10aad7', '#f9a139']; '#b3d23b',

var score = 0;
var mistakes = 0;

var isMobile = false;
var timer = null;

var fontsize = 60;
var timerRadius = 120;
var timerY = 200;
var timerFontSize = 70;
var timerAdjX = [30, 40];

var wordStyle = {
    x: 0,
    y: 0,
    w: 0,
    h: 70,
    calcX: 0,
    calcY: 0,
    adjX: 18
}

var wordContainerH = 0;
var wordContainerTop = 0;

var words = [];
var selectionOrder = 0;
var difficulty = 3;
var score = 0;
var wins = 0;
var mistakes = 0;

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    canvas.style.display = 'block';
    instrucions.style.display = 'none';

    if (!isPortrait()) {
        scaleX = w / 1792;
        scaleY = h / 922;
    } else {
        scaleX = w / 390;
        scaleY = h / 844;
        // fontsize = 30;
        
    }

    isMobile = detectMob();

    wordStyle.w = w - 20;
    wordStyle.h *= scaleY;
    wordStyle.x = w / 2 - wordStyle.w / 2;
    wordStyle.y = h / 2 - wordStyle.h / 2;
    wordStyle.calcX = wordStyle.x + 10;
    wordStyle.calcY = wordStyle.y + wordStyle.h / 2;

    if (!isMobile) {
        fontsize = 30;
        letterAdjX = 10;
        letterAdjY= 7.5;
        timerRadius = 70;
        timerY = 120;
        timerFontSize = 40;
        timerAdjX = [8, 22];
        wordStyle.adjX = 10;
    }

    wordContainerH = wordStyle.h * 5;
    wordContainerTop = h / 2 - wordContainerH / 2;

    // load assets into useable images
    // loadAssets() 
    timer = new Timer(w / 2, timerY, timerRadius, '#fb2121');
    timer.fontSize = timerFontSize;
    timer.adjX = timerAdjX;

    let isTouched = false;

    canvas.addEventListener('touchstart', e => {
        // mousedownE(e.touches[0].clientX, e.touches[0].clientY);
        // if (!isTouched) {
        //     let mx = e.touches[0].clientX;
        //     let my = e.touches[0].clientY;
        //     collision(mx, my);
        //     isTouched = true;
        // }
    });

    canvas.addEventListener('touchmove', e => {
        // mousemoveE(e.touches[0].clientX, e.touches[0].clientY);
    });

    canvas.addEventListener('touchend', e => {
        // mouseupE();
        // if (isTouched) {
        //     isTouched = false;
        // }
    });

    canvas.addEventListener('mousedown', e => {
        // mousedownE(e.offsetX, e.offsetY);
        let mx = e.offsetX;
        let my = e.offsetY;
        // console.log(wordContainerTop, my)
        let r = Math.floor((my - wordContainerTop) / wordStyle.h);
        
        if (r >= 0 && r < words.length) {
            // placeholder
            if (words[r].selected) {
                words[r].color = words[r].ocolor;
                words[r].selected = false;
                
                for (let i = 0; i < words.length; ++i) {
                    if (words[i].order > words[r].order) {
                        words[i].order--;
                    }
                }
                words[r].order = 0;
                --selectionOrder;
            } else {
                words[r].color = '#b3d23b';
                words[r].selected = true;
                words[r].order = ++selectionOrder;
            }

            if (selectionOrder == words.length) {
                let count = 0;

                for (let i = 0; i < words.length; ++i) {
                    if ((words[i].order - 1) == words[i].sorteorder) {
                        count++;
                    } else {
                        words[i].color = '#e92f48';
                        mistakes++;
                    }

                    words[i].order = 0;
                    words[i].selected = false;
                }

                if (count == words.length) {
                    score += count;
                    if (++wins == 3) {
                        if (difficulty < 5) difficulty++;
                        wins = 0;
                    }
                    console.log('win', score);

                    populateWords();
                } else {
                    score -= words.length - count;
                    console.log('lose');
                }

                selectionOrder = 0;
            }
        }
    });

    canvas.addEventListener('mousemove', e => {
        // mousemoveE(e.offsetX, e.offsetY);
    });
    
    canvas.addEventListener('mouseup', e => {
        // mouseupE();
        if (isTouched) {
            isTouched = false;
        }
    });

    populateWords();
    gameCycle();
}

function populateWords() {
    // let tmp = ['madii', 'affatoir', 'moiradelatorre', 'clienn', 'cugnanggu'];
    let tmp = [];
    let rngDifficulty = difficulty;
    // console.log(dictionary.length)
    for (let i = 0; i < rngDifficulty; ++i) {
        let rng = Math.floor(Math.random() * dictionary.length);
        tmp[i] = dictionary[rng];
    }

    tmp.sort();
    let orders = [...Array(tmp.length).keys()];
    shuffleArr(orders);
    words = [];

    for (let i = 0; i < tmp.length; ++i) {
        let color = colors[Math.floor(Math.random() * colors.length)];
        let word = tmp[orders[i]];
        let padding = 10 * (i + 1);
        let top = wordContainerTop + wordStyle.h * i + padding;
        words[i] = {
            word: word,
            color: color,
            adjX: canvas.width / 2 - word.length * wordStyle.adjX,
            calcY: top + wordStyle.h / 2,
            top: top,
            selected: false,
            ocolor: color,
            order: 0,
            sorteorder: orders[i]
        }
    }
}

function drawWord(word, color, adjX, calcY, top, order) {
    // let adjX = canvas.width / 2 - word.length * wordStyle.adjX;
    // let padding = 10 * (r + 1);
    // wordStyle.calcY = wordContainerTop + wordStyle.h * r + wordStyle.h / 2 + padding;
    
    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.rect(wordStyle.x, top, wordStyle.w, wordStyle.h);
    ctx.fill();
    ctx.stroke();

    ctx.font = "bolder " + fontsize + "px Arial";
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.fillText(word, wordStyle.calcX + adjX, calcY);

    if (order > 0)
        ctx.fillText(order, 30, calcY);
}

function drawWords() {
    for (let i = 0; i < words.length; ++i) {
        drawWord(words[i].word, words[i].color, words[i].adjX, words[i].calcY, words[i].top, words[i].order);
    }
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

function loadAssets() {
    for (let k in images) {
        assets.load(images[k].obj, images[k].src);
    }
}

function update() {
    // placeholder
    timer.draw(ctx);
    timer.tick(delta);
}

function gameCycle() {
    if (timer.timer > 0) {
        let now = Date.now();
        if (last == 0) last = now;
        delta = (now - last) / 1000;
        last = now;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // displayScore();
        // drawWord("madii", colors[0], 0);
        // drawWord("cugnanggu", colors[0], 1);
        // drawWord("cunvassranggu", colors[0], 2);
        // drawWord("clienn", colors[0], 3);
        // drawWord("moira", colors[0], 4);
        drawWords();
        update();


        requestAnimationFrame(gameCycle);
    } else {
        let accuracy = Math.max(0, (score - mistakes)) / score * 100;
        alert('Score: ' + score + ', Mistakes: ' + mistakes + ', Accuracy: ' + accuracy.toFixed(2) + '%');
    }
    
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);

// draw circle
// var c = document.getElementById("myCanvas");
// var ctx = c.getContext("2d");
// ctx.beginPath();
// ctx.arc(100, 75, 50, 0, 2 * Math.PI);
// ctx.fillStyle = 'green';
// ctx.fill();
// ctx.stroke();

// write text
// ctx.font = "30px Arial";
// ctx.fillText("Hello World", 10, 50);

// draw rect
// ctx.beginPath();
// ctx.rect(20, 20, 150, 100);
// ctx.fillStyle = 'green';
// ctx.fill();
// ctx.stroke();

// const colors = ['#10aad7', '#b3d23b', '#10aad7', '#f9a139'];