const canvas = document.getElementById('game-surface');
const ctx = canvas.getContext('2d');

var instrucions = document.getElementById("game-instructions");
var riveTimer = document.getElementById("timer");

// delta time
var last = 0;
var delta = 0;
var gameDuration = 25;
var currT = gameDuration;

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


// 1792 922

// sprite info


// srpite containers

// limits

// physics
var F = 750 * 0.5;
var G = 9.8;


// HUD

var mouseMoveOrigin = {
    x: 0,
    y: 0
};

const ballInfo = {
    x: 0,
    y: 0,
    w: 44 * 2,
    h: 44 * 2,
};

const barrierInfo = {
    x: 0,
    y: 0,
    w: 224 * 1.75,
    h: 48 * 1.75,
    hitbox: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
    }
};

const bgInfo = {
    x: 0,
    y: 0,
    w: 0,
    thickness: 20,
}


var joystick = null;
const onMobile = isMobile();
const onTablet = isTablet();

var ball = null;
var barrier = null;

var tracks = {};
var baseBallSpeed = 3;
var ballSpeed = 2;
var barrierSpeed = 5;
var ballSpeedInc = 0.1;
var isBallCollided = false;

// #C7FC12
/*
 * GAME INITIATLIZATIONS AND CONTROLS
 */
function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    canvas.style.display = 'block';
    instrucions.style.display = 'none';
    riveTimer.style.display = 'block';

    scaleX = w / 1792;
    scaleY = h / 922;

    riveTimer.style.top = 10 * scaleX + 'px';
    riveTimer.style.width = 106 * 2 * scaleX + 'px';
    riveTimer.style.height = 50 * 2 * scaleX + 'px';
    

    G *= scaleY;
    F *= scaleX;

    baseBallSpeed *= scaleX;
    ballSpeed = baseBallSpeed;
    ballSpeedInc *= scaleX;
    barrierSpeed *= scaleX;
    
    rescaleSize(ballInfo, scaleX, scaleX);
    rescaleSize(barrierInfo, scaleX, scaleX);

    bgInfo.w = w * 0.85;
    bgInfo.x = w / 2 - bgInfo.w / 2;
    bgInfo.y = h / 2;
    bgInfo.thickness *= scaleX;

    barrierInfo.x = w / 2 - barrierInfo.w / 2;
    barrierInfo.y = h - barrierInfo.h * 1.25;

    barrierInfo.hitbox.x = barrierInfo.x;
    barrierInfo.hitbox.y = h - barrierInfo.h * 1;
    barrierInfo.hitbox.w = barrierInfo.w - barrierInfo.h * 0.5;
    barrierInfo.hitbox.h = barrierInfo.h;

    ballInfo.x = w / 2 - ballInfo.w / 2;
    ballInfo.y = barrierInfo.hitbox.y - ballInfo.h;
    
    ball = new Sprite(ballInfo.x, ballInfo.y, ballInfo.w, ballInfo.h, AM.images.ball.cw, AM.images.ball.ch);
    barrier = new Sprite(barrierInfo.x, barrierInfo.y, barrierInfo.w, barrierInfo.h, AM.images.barrier.cw, AM.images.barrier.ch);

    // HUD = new Template_1(ctx, w, h, scaleX, scaleY, splashInfo);
    
    controls();


    let joystickX = w * 0.15;
    let joystickY = h * 0.75;
    
    joystick = new Joystick(joystickX, joystickY, 150 * 0.9 * scaleX);
    
    joystick.area.w = AM.images.area.cw * scaleX * 1;
    joystick.area.h = AM.images.area.ch * scaleX * 1;

    joystick.knob.x = joystick.area.x + joystick.area.w / 2 - joystick.knob.w / 2;
    joystick.knob.y = joystick.area.y + joystick.area.h / 2 - joystick.knob.h / 2;

    // var url_string = location.href; 
    // var url = new URL(url_string);
    // var isOn = url.searchParams.get("on");
    // if (isOn == null) isOn = 1;
    // joystick.on = parseInt(isOn);

    joystick.on = true;

    gameCycle();
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

function reset() {
    gameover = false;

    ball.x = ballInfo.x;
    ball.y = ballInfo.y;

    barrier.x = barrierInfo.x;
    barrier.y = barrierInfo.y;

    currT = gameDuration;
    RiveInfo.urgent.value = false;
    ballSpeed = baseBallSpeed;

    updateBarrierHitbox();
}

function drawLines() {
    const { x, y, w, h, thickness } = bgInfo;

    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, w, thickness);
    ctx.fillRect(x, 0, thickness, canvas.height);
    ctx.fillRect(x + w / 2, 0, thickness, canvas.height / 2);
    ctx.fillRect(x + w, 0, thickness, canvas.height);
    ctx.restore();
}


function muteAllAudio(flag) {
    for (let k in AM.audio) {
        AM.audio[k].img.muted = flag;
    }
}

function mouseMove(x, y, prevX, prevY) {
    if (joystick.active) {
        // let dist = x - mouseMoveOrigin.x;
        let dist = x - prevX;

        let distX = x - prevX;

        // joystick.update(distX * 0.5, distY);
        joystick.update(distX * 0.5, 0);
        let percent = joystick.mx / joystick.moveLimit;
        // kayak.zRotate = rotateLimit * percent;

        let p = Math.abs(percent);

        if (joystick.mx < 0) {
            barrier.vx = -F * p;
        } else if (dist > 0) {
            barrier.vx = F * p;
        }
    }
}

function mouseUp() {
    // kayak.updateOriginalPos();
    // // kayak.zRotate = 0;
    joystick.touchUp();
    barrier.vx = 0;
}

function submitScore() {
    let timeSpent = gameDuration - Math.floor(timer.timer / 24);
    // alert(HUD.health.toFixed(2) + ' ' + timeSpent);
    let result = {'game_score': score.toFixed(2), 'activity_id': serverData.id, 'time_spent': timeSpent};
    Vue.prototype.$postData(result, true);
}

function controls() {
    let mid = canvas.width / 2;
    let prevPos = 0;
    let prevPosY = 0;

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

        if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
            var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
            var touch = evt.touches[0] || evt.changedTouches[0];
            prevPos = touch.pageX;
            prevPosY = touch.pageY;

            if (!mDown) {
                mDown = true;

                mouseMoveOrigin.x = prevPos;

                if (isBtnClicked(touch.pageX, touch.pageY, joystick.hitbox) || !joystick.on) {
                    joystick.active = true;
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
                    mouseMove(x, y, prevPos, prevPosY);
                }

                prevPos = x;
                prevPosY = y;
            }
        }
    });

    canvas.addEventListener('touchend', e => {
        var x = e.changedTouches[event.changedTouches.length-1].pageX;
        var y = e.changedTouches[event.changedTouches.length-1].pageY;

        if (mDown) {
            mDown = false;
            mouseUp();
        }

        // if (!gameStart) {
        //     if (isBtnClicked(x, y, startButtonInfo)) {
        //         gameStart = true;
        //     }
            

        // } 

        // if (gameover) {
        //     // reset();
        // }
        
    });

    canvas.addEventListener('mousedown', e => {
        // mousedownE(e.offsetX, e.offsetY);
        let mx = e.offsetX;
        let my = e.offsetY;
        if (!mDown) {
            mDown = true;

            if (gameover) {
                // if (isBtnClicked(mx, my, HUD.endscreenButtons)) {
                //     submitScore();
                // }
            } else if (gameStart) {
                mouseMoveOrigin.x = mx;


                if (isBtnClicked(mx, my, joystick.hitbox) || !joystick.on) {
                    joystick.active = true;
                }
            }

            
        }

        
    });


    canvas.addEventListener('mousemove', e => {
        // mousemoveE(e.offsetX, e.offsetY);
        let mx = e.offsetX;
        let my = e.offsetY;
        // let my = e.offsetY;

        if (gameover) mDown = false;

        if (mDown) {
            mouseMove(mx, my, prevPos, prevPosY);
            
            prevPos = mx;
            prevPosY = my;
        }

    });
    
    canvas.addEventListener('mouseup', e => {
        // mouseupE();
        let mx = e.offsetX;
        let my = e.offsetY;
        
        
    });

}

// *********************************** GAME INITIATLIZATIONS AND CONTROLS END ******************************************************** //

/*
 * PHYSICS
 */

function checkRectCollisions(obj1, obj2) {
    return (obj1.x <= obj2.x + obj2.w &&
        obj1.x + obj1.w >= obj2.x &&
        obj1.y <= obj2.y + obj2.h &&
        obj1.h + obj1.y >= obj2.y);
}

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
    let cx = (rect.x + rect.w / 2); 
    let cy = (rect.y + rect.h / 2); 

    return [
        transformPoint({ x: rect.x, y: rect.y }, cx, cy, degrees),
        transformPoint({ x: rect.x + rect.w, y: rect.y }, cx, cy, degrees),
        transformPoint({ x: rect.x + rect.w, y: rect.y + rect.h }, cx, cy, degrees),
        transformPoint({ x: rect.x, y: rect.y + rect.h }, cx, cy, degrees)
    ];
}

function checkAngledCollisions(obj1, obj2) {
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

// *********************************** TEXT DISPLAYS END ******************************************************** //


/*
 * SOUNDS
 */
function playHit() {
    // if (HUD.volumeOn) {
        setTimeout(() => {
            AM.audio.cluck.img.volume = 0.5;
            AM.audio.cluck.img.currentTime = 0;
            AM.audio.cluck.img.play();
        }, 0);
    // }
}

function playFail() {
    // if (HUD.volumeOn) {
        setTimeout(() => {
            AM.audio.ppput.img.volume = 1;
            AM.audio.ppput.img.currentTime = 0;
            AM.audio.ppput.img.play();
        }, 0);
    // }
}

// *********************************** SOUNDS END ******************************************************** //

// #11A5CC
// #F8E7CD
/*
 * GAME UPDATES AND CYCLES
 */

function updateBarrierHitbox() {
    const { x, y, w, h } = barrier;
    barrierInfo.hitbox.x = barrier.x + barrierInfo.h * 0.25;
    barrierInfo.hitbox.y = canvas.height - barrierInfo.h * 1;
}

function rngMultiplier() {
    let rng = Math.floor(Math.random() * 2);
    return rng ? 1 : -1;
}

function bounceBall() {
    let dx = rngMultiplier();
    if (ball.y + ball.h > barrierInfo.hitbox.y + barrierInfo.hitbox.h * 0.5) {
        let d = barrier.vx > 0 ? 1 : -1; 
        ball.vx = F * dx * d;
        ball.vy = -F * 0.25;
    } else {
        ball.vx = F * dx;
        ball.vy = -F;
    }
    
}

function wallCollisions(obj) {
    if (obj.x <= 0) {
        let dy = rngMultiplier();
        obj.vx = F;
        obj.vy = F * dy;

        return true;
    } else if (obj.x + obj.w >= canvas.width) {
        let dy = rngMultiplier();
        obj.vx = -F;
        obj.vy = F * dy;

        return true;
    } else if (obj.y <= 0) {
        obj.vx = F * rngMultiplier();
        obj.vy = F;

        return true;
    }

    return false;
}

function update() {
    barrier.update(delta, barrierSpeed);
    if (barrier.x + barrier.w >= canvas.width) {
        barrier.x = canvas.width - barrier.w;
    } else if (barrier.x <= 0) {
        barrier.x = 0;
    }

    updateBarrierHitbox();

    ball.update(delta, ballSpeed);
    ball.t += 0.5 * delta;
    ball.zRotate = Math.sin(ball.t) * 720;

    if (ball.y + ball.h >= barrierInfo.hitbox.y + barrierInfo.hitbox.h * 0.5) {
        gameover = true;
        playFail();
    } else {
        if (checkRectCollisions(ball, barrierInfo.hitbox)) {
            bounceBall();
            playHit();
            ballSpeed += ballSpeedInc;
        }
    
        if (wallCollisions(ball)) {
            playHit();
        } 
    }
    

    
    
    
    ball.drawWithRotation(ctx, AM.images.ball.img);
    barrier.draw(ctx, AM.images.barrier.img);

    // RiveInfo.timer = inputs.find(i => i.name === 'Timer');
    // RiveInfo.urgent = inputs.find(i => i.name === 'Urgent');
    if (delta < 1) {
        currT -= 1 * delta;

        if (currT <= 0) {
            currT = 0;
            gameover = true;
            playFail();
        }

        let p = currT / gameDuration;
        RiveInfo.timer.value = 100 * p;
        let timerTxt = Math.floor(gameDuration * p);
        if (timerTxt < 4) {
            RiveInfo.urgent.value = true;
        }
        RiveInfo.r.setTextRunValue(RiveInfo.textRun, timerTxt + '');
    }
    

    // ctx.beginPath();
    // ctx.rect(barrierInfo.hitbox.x, barrierInfo.hitbox.y, barrierInfo.hitbox.w, barrierInfo.hitbox.h);
    // ctx.stroke();
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    if (!gameover) {
        if (gameStart) {
            // bg
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // ctx.drawImage(AM.images.bg.img, 0, 0, AM.images.bg.cw, AM.images.bg.ch, 0, 0, canvas.width, 428);
            drawLines();
            // if (onMobile)
            joystick.draw(ctx);

            update();
        } else {
            // ctx.drawImage(AM.images.intro.img, 0, 0, AM.images.intro.cw, AM.images.intro.ch, 0, 0, canvas.width, canvas.height);
            // drawStartPage();
        }

        
    } else {
        console.log('Gameover!');
        reset();
        // HUD.gameover(ctx, splashInfo, delta);
    }

    requestAnimationFrame(gameCycle);
}
// *********************************** GAME UPDATES AND CYCLES END ******************************************************** //
