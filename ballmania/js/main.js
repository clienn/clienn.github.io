const balls = [];
const speed = 0.0005;
const gravity = 0.01;
var width = 1048;
const centerCanvas = width / 2;
var height = 600;
const LIMIT = 40;
const POPULATION_SPEED = 3;

const KEY_LEFT = 37;
const KEY_RIGHT = 39;


window.onload = function() {
    var timerDiv = document.getElementById('timer');
    var canvas = document.getElementById("renderCanvas");
    var container = document.getElementById("container");
    var ctx = canvas.getContext("2d");

    var timer = 0;
    var gameover = false;
    var isWinner = false;
    var dayTime = 0;
    var currHex = '#ffffff';

    // canvas.width = width;
    // canvas.height = height;

    resize();

    canvas.addEventListener('click', (e) => {
        // console.log('test')
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left; //x position within the element.
        var y = e.clientY - rect.top;  //y position within the element.

        var p = ctx.getImageData(x, y, 1, 1).data; 
        var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        console.log(hex);
    });

    let last = Date.now();

    let heroImg = new Image();
    heroImg.src = 'assets/hero2.png';

    const hero = new Hero(width / 2, height - 30, 17, width);

    heroImg.onload = function() {
        hero.setSprite(heroImg);
        animate();
    };

    function resize() {
        width = width > screen.width ? window.innerWidth - 20 : width;
        height = height > screen.height ? window.innerHeight : height;

        canvas.width = width;
        canvas.height = height;

        container.style.width = width + "px";
        // container.style.height = height + "px";
    }

    function animate() {
        if (!gameover) {
            // ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = currHex;
            ctx.fillRect(0, 0, width, height);
        
            let now = Date.now();
            let delta = now - last;
            last = now;

            // populate();

            update(delta);
            draw(ctx);

            setTimer(delta);

            requestAnimationFrame(animate);
        } else {
            ctx.font = "50px Comic Sans MS";
            if (isWinner) {
                ctx.fillStyle = "#aef359";
                ctx.fillText("Congratulations! You Won!!! ^_^", width / 6, height / 2);
            } else {
                ctx.fillStyle = "#ff0000";
                ctx.fillText("Gameover! You Lose!!! :(", width / 4, height / 2);
            }
        }
    }

    function update(delta) {
        let fy = gravity * delta;

        hero.update(delta);
        hero.move(delta);

        if (hero.direction > 0 && hero.x >= hero.boundX) {
            hero.setPos(hero.boundX, hero.y);
        } else if (hero.direction < 0 && hero.x <= hero.collsionW) {
            hero.setPos(hero.collsionW, hero.y);
        }

        for (k in balls) {
            if (balls[k].y <= balls[k].getBounds().y) {
                balls[k].addForce(balls[k].speedX * delta, fy);
            } else {
                balls[k].bounce();
            }

            balls[k].move();

            if (checkCollision(hero.x, hero.y, hero.radius, balls[k].x, balls[k].y, balls[k].radius)) {
                gameover = true;
            }

            if (
                (balls[k].direction > 0 && balls[k].x >= balls[k].getBounds().x) ||
                (balls[k].direction < 0 && balls[k].x < 0) 
            ) {
                balls[k].reset();
            }
        }
    }

    function lerpColor(a, b, amount) { 
        var ah = +a.replace('#', '0x'),
            ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
            bh = +b.replace('#', '0x'),
            br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab);
    
        return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
    }

    function setTimer(delta) {
        timer += 1 * delta;
        let t = timer / 1000;
        let ms = Math.floor(timer) % 100;
        let seconds = Math.floor(t) % 60;
        let minutes = Math.floor(timer / 60000);

        if (minutes >= 3) {
            isWinner = true;
            gameover = true;
        }

        populate(t);

        timerDiv.innerHTML = minutes + ':' + (seconds < 10 ? ('0' + seconds) : seconds) + ':' + (ms < 10 ? ('0' + ms) : ms);
    }
    
    function populate(t) {
        if (t / POPULATION_SPEED > balls.length) {
            if (balls.length < LIMIT) {
                balls.push(new Ball(getRandomColor(), getRandomColor(), { x: width, y: height }));
            }

            if (t >= 90) {
                dayTime = 1 * ((t - 90) / 90);
                currHex = lerpColor('#f79459', '#172c3c', dayTime); //'#172c3c'
            } else {
                dayTime = 1 * (t / 90);
                currHex = lerpColor('#ffffff', '#f79459', dayTime); //'#172c3c'
            }

            // currHex = lerpColor('#ffffff', '#f79459', dayTime); //'#172c3c'
        }
    }

    function getRandomColor() {
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);

        // return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
        return '#' + rgbToHex(r, g, b);
    }

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function checkCollision(p1x, p1y, r1, p2x, p2y, r2) {
        return ((r1 + r2) ** 2 > (p1x - p2x) ** 2 + (p1y - p2y) ** 2)
    }

    function draw(ctx) {
        hero.draw(ctx);

        for (k in balls) {
            balls[k].draw(ctx)
        }
    }

    document.addEventListener('keydown', (e) => {
        e.preventDefault();

        if (e.keyCode == KEY_LEFT) {
            hero.initMovement(-1);
        } else if (e.keyCode == KEY_RIGHT) {
            hero.initMovement(1);
        }
    });

    document.addEventListener('touchstart', (e) => {
        e.preventDefault();

        var x = 0;

        if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
            var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
            var touch = evt.touches[0] || evt.changedTouches[0];
            x = touch.pageX;
            y = touch.pageY;
        } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
            x = e.clientX;
            y = e.clientY;
        }

        if (x >= screen.width) {
            hero.initMovement(1);
        } else {
            hero.initMovement(-1);
        }
    });

    function rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }

    document.addEventListener('keyup', (e) => {
        e.preventDefault();
        hero.initMovement(0);
    });

    document.addEventListener('touchend', (e) => {
        e.preventDefault();
        hero.initMovement(0);
    });

}



