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
var btnBegin = {
    x: 0,
    y: 0,
    w: 400,
    h: 100
};

// sprite info
var pigInfo = {
    w: 100,
    h: 70,
}

var moneyInfo = {
    w: 75,
    h: 50,
}

var coinInfo = {
    w: 45,
    h: 45,
}

var glueInfo = {
    w: 75,
    h: 75,
}

var hammerInfo = {
    w: 175,
    h: 350,
}

var ballInfo = {
    w: 30,
    h: 30,
}

var kaboomInfo = {
    w: 70,
    h: 30,
}

// srpite containers
var pig = null;
var balls = [];
const moneyList = [];
const coins = [];
const glues = [];
const hammers = [];
var kaboom = null;
var kaboomstar = null;

// limits
var ballsLimit = 15;
var moneyLimit = 0;
var coinLimit = 0;
var glueLimit = 2;
var hammerLimit = 5;
var dropPadding = 0;
var health = 100;

// physics
var forceD = 0;
var friction = 0.98;
var F = 50;
var T = 0;
const G = 9.8;
var kaboomT = 0;


// HUD
var HUD = null;
var volumeOn = true;

// TXT
var TXT = null;
var jumpSpeed = 20;
var jumpHeight = 100;
var jump = 0;
var score = 0;


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

    TXT = new Text(ctx, w, h); 
    TXT.setScale(scaleX, scaleY);
    
    TXT.addText('points', '+1.00', 'bold', 20, 'Montserrat', 0, 0, 80, 30, '#10aad7', true); 
    jumpHeight *= scaleY;

    timer = new Timer(0, 0, 0, '#fff');
    timer.setTimer(90);
    
    
    rescaleSize(pigInfo, scaleX, scaleY);
    rescaleSize(moneyInfo, scaleX, scaleY);
    rescaleSize(ballInfo, scaleX, scaleY);
    rescaleSize(coinInfo, scaleX, scaleY);
    rescaleSize(hammerInfo, scaleX, scaleY);
    rescaleSize(glueInfo, scaleX, scaleY);
    rescaleSize(kaboomInfo, scaleX, scaleY);

    pig = new Sprite(w / 2 - pigInfo.w / 2, h - pigInfo.h - 10, pigInfo.w, pigInfo.h, AM.images.piggybank.cw, AM.images.piggybank.ch);
    kaboom = new StaticSprite(0, 0, kaboomInfo.w, kaboomInfo.h, 0, 0, AM.images.kaboom.cw, AM.images.kaboom.ch, 'kaboom');
    kaboomstar = new StaticSprite(0, 0, kaboomInfo.w * 2, kaboomInfo.h * 2, 0, 0, AM.images.kaboomstar.cw, AM.images.kaboomstar.ch, 'kaboomstar');

    moneyLimit = Math.floor(w / moneyInfo.w);
    coinLimit = Math.floor(w / moneyInfo.w);
    dropPadding = (w - moneyLimit * moneyInfo.w) / 2;

    // HUD = new Sprite(0, 0, 45, 45, AM.images.timecircle.cw, AM.images.timecircle.ch);
    HUD = new Template_1(ctx, w, h, scaleX, scaleY);

    controls();

    addMoney();
    addMoney();
    addMoney();

    addCoins();
    addCoins();
    addCoins();
    addCoins();

    gameCycle();
}

function controls() {
    let mid = canvas.width / 2;

    document.addEventListener('touchstart', (e) => {
        e.preventDefault();

        var x = 0, x1 = 0;
        
        if (gameover) {
            reset();
        } else {
            if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
                var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
                var touch = evt.touches[0] || evt.changedTouches[0];
                x = touch.pageX;
    
                if (evt.touches.length > 1) {
                    var touch2 = evt.touches[1] || evt.changedTouches[1];
                    x1 = touch2.pageX;
    
                    if (x >= mid) {
                        if (!rDown) {
                            rDown = true;
                            forceD = F;
                        }
                    } else  {
                        if (!lDown) {
                            lDown = true;
                            forceD = -F;
                        }
                    }
    
                    if (x1 >= mid) {
                        if (!rDown) {
                            rDown = true;
                            forceD = F;
                        }
                    } else {
                        if (!lDown) {
                            lDown = true;
                            forceD = -F;
                        }
                    }
                } else {
                    if (x >= mid) {
                        if (!rDown) {
                            rDown = true;
                            forceD = F;
                        }
                    } else  {
                        if (!lDown) {
                            lDown = true;
                            forceD = -F;
                        }
                    }
                }
            }
        }

        
        
    });

    document.addEventListener('touchend', (e) => {
        e.preventDefault();
 
        var x = e.changedTouches[event.changedTouches.length-1].pageX;

        if (x >= mid) {
            rDown = false;
        } else {
            lDown = false;
        }

        if (!rDown && !lDown) {
            forceD = 0;
        }
    });

    // canvas.addEventListener('touchstart', e => {
    //     // mousedownE(e.touches[0].clientX, e.touches[0].clientY);
    //     // e.preventDefault();
    //     var touch = evt.touches[0] || evt.changedTouches[0];
    //     let x = touch.pageX;

    //     let mid = canvas.width / 2;
    //     if (x >= mid) {
    //         if (!rDown) {
    //             rDown = true;
    //             forceD = F;
    //         }
    //     } else if (x < mid) {
    //         if (!lDown) {
    //             lDown = true;
    //             forceD = -F;
    //         }
    //     }
    // });

    canvas.addEventListener('touchmove', e => {
        // mousemoveE(e.touches[0].clientX, e.touches[0].clientY);
        
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

            playScore();
            playKaboom();
            playGlue();

            gameStart = true;
        } 
        
    });

    canvas.addEventListener('mousedown', e => {
        // mousedownE(e.offsetX, e.offsetY);
        let mx = e.offsetX;
        let my = e.offsetY;
        if (!mDown) {
            

            mDown = true;
        }

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
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key == 'ArrowRight') {
            if (!rDown) {
                rDown = true;
                forceD = F;
            }
        } else if (e.key == 'ArrowLeft') {
            if (!lDown) {
                lDown = true;
                forceD = -F;
            }
        }
    });

    document.addEventListener('keyup', e => {
        if (e.key == 'ArrowRight') {
            rDown = false;
        } else if (e.key == 'ArrowLeft') {
            lDown = false;
        }

        if (!rDown && !lDown) {
            forceD = 0;
        }
    });

    canvas.addEventListener('mousemove', e => {
        // mousemoveE(e.offsetX, e.offsetY);
    });
    
    canvas.addEventListener('mouseup', e => {
        // mouseupE();
        if (!gameStart) {
            AM.audio.bg.img.volume = 0.2;
            AM.audio.bg.img.loop = true;
            AM.audio.bg.img.play();

            gameStart = true;
        }

        if (mDown) {
            mDown = false;
            
            if (gameover) {
                reset();
            }
        }
    });
}
// *********************************** GAME INITIATLIZATIONS AND CONTROLS END ******************************************************** //


/*
 * SPRITE MANAGEMENT (SETTING, ADDING, AND DRAWING)
 */
function drawPig() {
    pig.draw(ctx, AM.images.piggybank.img);
}

function addBall() {
    if (balls.length < ballsLimit) {
        let ball = new Sprite(Math.floor(Math.random() * canvas.width), -ballInfo.h * 3, ballInfo.w, ballInfo.h, AM.images.ball_1.cw, AM.images.ball_1.ch);
        ball.dropSpeed = 20;

        let rng = Math.floor(Math.random() * 3) + 1;
        ball.w *= rng; 
        ball.h *= rng; 

        let d = Math.floor(Math.random() * 2);
        let xSpeed = Math.floor(Math.random() * 200 + 50);
        if (d) {
            ball.vx = xSpeed;
        } else {
            ball.vx = -xSpeed;
        }

        ball.id = Math.floor(Math.random() * 5) + 1;
        ball.restitution = Math.floor(Math.random() * 100) + 300;

        balls.push(ball);
    }
}

function drawBall() {
    for (let i = 0; i < balls.length; ++i) {
        balls[i].draw(ctx, AM.images['ball_' + balls[i].id].img);
    }
}

function resetBall(i) {
    balls[i].y = -200;
}

function addMoney() {
    if (moneyList.length < moneyLimit) {
        let money = new Sprite(moneyList.length * moneyInfo.w + dropPadding, 0, moneyInfo.w, moneyInfo.w, AM.images.money.cw, AM.images.money.ch);

        // if (moneyList.length == 10) money.dropSine = 1;
        
        moneyList.push(money);
        resetMoney(moneyList.length - 1);
    }
}

function drawMoney() {
    for (let i = 0; i < moneyList.length; ++i) {
        moneyList[i].draw(ctx, AM.images.money.img);
    }
}

function resetMoney(i) {
    moneyList[i].dropSpeed = Math.floor(Math.random() * 10) + 1;
    moneyList[i].dropSine = Math.floor(Math.random() * 2);
    moneyList[i].x = Math.floor(Math.random() * (canvas.width - moneyList[i].w - 10));
    moneyList[i].y = -moneyList[i].h * moneyList[i].dropSpeed;
    moneyList[i].vy = 0;
}

function addCoins() {
    if (coins.length < coinLimit) {
        let id = 'coin_' + (Math.floor(Math.random() * 3) + 1);

        let coin = new Sprite(coins.length * coinInfo.w, 0, coinInfo.w, coinInfo.w, AM.images[id].cw, AM.images[id].ch);
        coin.id = id;
        
        coins.push(coin);
        resetCoin(coins.length - 1);
        
    }
}

function drawCoins() {
    for (let i = 0; i < coins.length; ++i) {
        coins[i].draw(ctx, AM.images[coins[i].id].img);
    }
}

function resetCoin(i) {
    coins[i].dropSpeed = Math.floor(Math.random() * 10) + 1;
    coins[i].dropSine = Math.floor(Math.random() * 2);
    coins[i].x = Math.floor(Math.random() * (canvas.width - coins[i].w));
    coins[i].y = -coins[i].h * coins[i].dropSpeed;
    coins[i].vy = 0;
    coins[i].id = 'coin_' + (Math.floor(Math.random() * 3) + 1);;
}

function addHammer() {
    if (hammers.length < hammerLimit) {
        // let id = 'hammer_' + (Math.floor(Math.random() * 3) + 1);

        let hammer = new Sprite(hammers.length * hammerInfo.w, 0, hammerInfo.w, hammerInfo.w, AM.images.hammer.cw, AM.images.hammer.ch);
        // hammer.id = id;
        hammer.x = Math.floor(Math.random() * (canvas.width - hammer.w));
        hammer.dropSpeed = Math.floor(Math.random() * 15) + 1;
        
        hammers.push(hammer);
        resetHammer(hammers.length - 1);
        
    }
}

function drawHammers() {
    for (let i = 0; i < hammers.length; ++i) {
        ctx.save();

        // move to the center of the canvas
        ctx.translate(hammers[i].ox + hammers[i].w / 2, (hammers[i].y + hammers[i].dropDist) + hammers[i].h / 2);
        
        hammers[i].rotationT += 0.05 * delta;
        hammers[i].degrees = Math.cos(hammers[i].rotationT) * 7200;
        // rotate the canvas to the specified degrees
        ctx.rotate(hammers[i].degrees * Math.PI/180);

        // draw the image
        hammers[i].x = -0.5 * hammers[i].w;
        hammers[i].y = -0.5 * (hammers[i].h);

        hammers[i].draw(ctx, AM.images.hammer.img);
        // we’re done with the rotating so restore the unrotated context
        ctx.restore();
        
    }
}

function resetHammer(i) {
    hammers[i].dropSpeed = Math.floor(Math.random() * 15) + 1;
    hammers[i].x = Math.floor(Math.random() * (canvas.width - hammers[i].w));
    hammers[i].y = -hammers[i].h * hammers[i].dropSpeed;
    hammers[i].vy = 0;
    hammers[i].degrees = 0;
    hammers[i].rotationT = 0;
    hammers[i].dropDist = -200;
}

function addGlue() {
    if (glues.length < glueLimit) {
        // let id = 'hammer_' + (Math.floor(Math.random() * 3) + 1);

        let glue = new Sprite(glues.length * glueInfo.w, 0, glueInfo.w, glueInfo.w, AM.images.glue.cw, AM.images.glue.ch);
        
        glue.x = Math.floor(Math.random() * (canvas.width - glue.w));
        glue.dropSpeed = Math.floor(Math.random() * 15) + 1;
        
        glues.push(glue);
        resetGlue(glues.length - 1);
        
    }
}

function drawGlues() {
    for (let i = 0; i < glues.length; ++i) {
        glues[i].draw(ctx, AM.images.glue.img);
    }
}

function resetGlue(i) {
    glues[i].dropSpeed = Math.floor(Math.random() * 15) + 1;
    glues[i].x = Math.floor(Math.random() * (canvas.width - glues[i].w));
    glues[i].y = -glues[i].h * glues[i].dropSpeed;
    glues[i].vy = 0;
}

function drawKaboom() {
    if (kaboomT > 0) {
        kaboom.x = pig.x + pig.w / 2 - kaboom.w / 2;
        kaboom.y = pig.y;

        kaboomstar.x = pig.x + pig.w / 2 - kaboomstar.w / 2;
        kaboomstar.y = kaboom.y - kaboomstar.h / 2 + kaboom.h / 2;

        
        kaboomstar.draw(ctx);
        kaboom.draw(ctx);

        kaboomT -= 5 * delta;
    }
}
// *********************************** SPRITE MANAGEMENT END ******************************************************** //


/*
 * PHYSICS
 */
function checkCollision(r1, r2) {
   return r1.x + r1.w >= r2.x && r1.x <= r2.x + r2.w && r1.y + r1.h >= r2.y && r1.y <= r2.y + r2.h;
}

function checkCollision2(r1, r2) {
    return r1.x + r1.w >= r2.x && r1.x <= r2.x + r2.w && r1.y + r1.h >= r2.oy + r2.dropDist && r1.y <= r2.oy + r2.dropDist + r2.h;
 }

function collisionUpdate() {
    for (let i = 0; i < moneyList.length; ++i) {
        if (checkCollision(pig, moneyList[i])) {
            jump = jumpHeight;
            TXT.texts['points'].str = '+1.00';
            health = Math.min(100, health + 1);
            score += 1;
            resetMoney(i);
            if (HUD.volumeOn)
                playScore();
            break;
        }
    }

    for (let i = 0; i < coins.length; ++i) {
        if (checkCollision(pig, coins[i])) {
            jump = jumpHeight;

            let val = 0.25;

            if (coins[i].id == 'coin_1') {
                val = 0.05;
            } else if (coins[i].id == 'coin_2') {
                val = 0.10;
            }

            health = Math.min(100, health + val);
            score += val;

            TXT.texts['points'].str = '+' + val.toFixed(2);
            
            resetCoin(i);

            if (HUD.volumeOn)
                playScore();
            break;
        }
    }

    HUD.txt.texts['score'].str = (score < 10 ? '0' : '') + score.toFixed(2);

    for (let i = 0; i < balls.length; ++i) {
        if (checkCollision(pig, balls[i])) {
            kaboomT = 2;
            health -= 10;
            resetBall(i);

            if (HUD.volumeOn)
                playKaboom();
            break;
        }
    }

    for (let i = 0; i < glues.length; ++i) {
        if (checkCollision(pig, glues[i])) {
            health += 5;
            resetGlue(i);

            if (HUD.volumeOn)
                playGlue();
            break;
        }
    }

    // for (let i = 0; i < hammers.length; ++i) {
    //     if (checkCollision2(pig, hammers[i])) {
    //         // jump = jumpHeight;
    //         // TXT.texts['points'].str = '+1.00';
    //         resetHammer(i);
    //     }
    // }
}

function bounceBalls() {
    for (let i = 0; i < balls.length; ++i) {
        balls[i].x += balls[i].vx * delta;
        balls[i].y += balls[i].vy * delta;
        balls[i].vy += G * delta * balls[i].dropSpeed;

        if (balls[i].y + balls[i].h >= canvas.height) {
            balls[i].vy = -Math.floor(Math.random() * 250 + balls[i].restitution);
        }
        
        if (balls[i].vx > 0) {
            if (balls[i].x > canvas.width + 10) {
                balls[i].x = -balls[i].w;
                balls[i].vx = Math.floor(Math.random() * 200 + 50);
            }
        } else {
            if (balls[i].x + balls[i].h < -10) {
                balls[i].x = canvas.width + balls[i].w + 10;
                balls[i].vx = -Math.floor(Math.random() * 200 + 50);
            }
        }
        
    }
}

function dropMoney() {
    for (let i = 0; i < moneyList.length; ++i) {
        moneyList[i].y += moneyList[i].vy * delta;
        moneyList[i].vy += G * delta * moneyList[i].dropSpeed;

        if ( moneyList[i].dropSine == 1) {
            moneyList[i].x = moneyList[i].ox + Math.sin(moneyList[i].t) * 100;;
            moneyList[i].t += 1 * delta;
        }

        if (moneyList[i].y > canvas.height) {
            resetMoney(i);
        }
    }    
}

function dropCoins() {
    for (let i = 0; i < coins.length; ++i) {
        coins[i].y += coins[i].vy * delta;
        coins[i].vy += G * delta * coins[i].dropSpeed;

        if (coins[i].y > canvas.height) {
            resetCoin(i);
        }
    }    
}

function dropHammers() {
    for (let i = 0; i < hammers.length; ++i) {
        // hammers[i].y += hammers[i].vy * delta;
        hammers[i].dropDist += hammers[i].vy * delta;
        hammers[i].vy += G * delta * hammers[i].dropSpeed;
        // console.log('test', hammers[i].y + hammers[i].dropDist, canvas.height);

        if (hammers[i].y + hammers[i].dropDist > canvas.height) {
            resetHammer(i);
        }
    }    
}

function dropGlues() {
    for (let i = 0; i < glues.length; ++i) {
        glues[i].y += glues[i].vy * delta;
        glues[i].vy += G * delta * glues[i].dropSpeed;

        if (glues[i].y > canvas.height) {
            resetGlue(i);
        }
    }    
}
// *********************************** PHYSICS END ******************************************************** //

/*
 * TEXT DISPLAYS
 */
function showPoints(pointType) {
    // HUD.draw(ctx, AM.images.timecircle.img);
    // jumpPointsT += 1 * delta;
    if (jump > 0) {
        let y = pig.y + jump - pig.h;
        TXT.follow('points', pig.x, y, pig.w, pig.h);
        TXT.draw('points');
        jump -= G * jumpSpeed * delta;
    }
}

// *********************************** TEXT DISPLAYS END ******************************************************** //


/*
 * SOUNDS
 */
function playScore() {
    AM.audio.score.img.pause();
    AM.audio.score.img.currentTime = 0;
    AM.audio.score.img.play();
}

function playGlue() {
    AM.audio.glue.img.pause();
    AM.audio.glue.img.currentTime = 0;
    AM.audio.glue.img.play();
}

function playKaboom() {
    AM.audio.kaboom.img.pause();
    AM.audio.kaboom.img.currentTime = 0;
    AM.audio.kaboom.img.play();
}

// *********************************** SOUNDS END ******************************************************** //


/*
 * GAME UPDATES AND CYCLES
 */
function reset() {
    gameover = false;
    health = 100;

    pig.x = canvas.width / 2;
    score = 0;

    for (let i = 0; i < moneyList.length; ++i) {
        resetMoney(i);
    }

    for (let i = 0; i < coins.length; ++i) {
        resetCoin(i);
    }

    balls.length = 0;
    glues.length = 0;
    hammers.length = 0;

    timer.setTimer(90);
}

function update() {
    pig.update(canvas.width, delta, friction);
    dropMoney();
    dropCoins();
    dropGlues();
    dropHammers();
    bounceBalls();
    pig.addForce(forceD, delta, 10);
    collisionUpdate();

    if (balls.length < 8) {
        T += 1 * delta;
        if (Math.floor(T) % 10 == 0) {
            T++;
            addBall();
            
            if (balls.length % 3) {
                addHammer();
            }
            
            if (balls.length % 5) {
                addGlue();
                
            }
        }
    }

    HUD.txt.texts['time'].str = zeroPad(Math.floor(timer.timer / 24), 2);

    if (health < 0) {
        health = 0;
        gameover = true;
    }

    if (delta < 1) {
        HUD.timeProgressBar.update(delta, Math.floor(timer.timer / 24));
        HUD.lifebar.update(delta, health);
        // HUD.timeProgressBar.progress = Math.floor(timer.timer / 24) / 90 * 100;
        // console.log(HUD.timeProgressBar.progress, timer.timer, delta);
        health -= 2 * delta;
        timer.tick(delta);

        if (timer.timer <= 0) {
            gameover = true;
        }
    }

    if (gameover) {
        HUD.txt.texts['total'].str = '$' + (score < 10 ? '0' : '') + score.toFixed(2);
    }
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    if (!gameover) {
        if (gameStart) {
            // bg
            drawBG(ctx, 'bg');
            HUD.draw(ctx);

            drawCoins();
            drawGlues();
            drawHammers();
            
            drawPig();
            drawKaboom();

            showPoints();
            
            drawMoney();
            drawBall();
            update();
        } else {
        
            ctx.drawImage(AM.images.intro.img, 0, 0, AM.images.intro.cw, AM.images.intro.ch, 0, 0, canvas.width, canvas.height);

            // ctx.beginPath();
            // ctx.rect(btnBegin.x, btnBegin.y, btnBegin.w, btnBegin.h);
            // ctx.stroke();
        }

        
    } else {
        drawBG(ctx, 'bg');
        // HUD.draw(ctx);
        
        HUD.gameover(ctx);
    }

    requestAnimationFrame(gameCycle);
}
// *********************************** GAME UPDATES AND CYCLES END ******************************************************** //