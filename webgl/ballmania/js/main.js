// assets
// Donut: https://sketchfab.com/3d-models/donut-cat-3800caad4695418f9f60bfca87a85304
// Orange Cat: https://sketchfab.com/3d-models/toon-cat-free-b2bd1ee7858444bda366110a2d960386
// White Cat: https://sketchfab.com/3d-models/cat-rigged-eccebebd5a60484eaa49036f8a4b6ed7
// Ghost Cat: https://sketchfab.com/3d-models/cute-spooky-cat-563ee36ca4904008a55ff4deb4f48209
// Wiz Cat: https://sketchfab.com/3d-models/vrc-quest-1a2ee6f7a86b4c09a2541614ea6e4ff5
// Loli: https://sketchfab.com/3d-models/luoli-run-3bb3c812efa1447a9bb82000856d9bf3
// Rabbit: https://sketchfab.com/3d-models/rabbit-run-7ab75a9c956340bbb917e5851c714536
// Girl: https://sketchfab.com/3d-models/shelyn-run-3d8dc2cab5e647898bba98f6945bece9
// Monster: https://sketchfab.com/3d-models/monster-run-2bd3ffa56ae8450a826de7386031a0a1
// Girl 2: https://sketchfab.com/3d-models/dawn-run-3af58663b6944db0a847afe9514030f9

const BALL_COUNT = 100;
const EXPLOSION_COUNT = 300;
const VERTEX_SIZE = 6 * Float32Array.BYTES_PER_ELEMENT;
const SCALE_VERTEX_OFFSET = 2 * Float32Array.BYTES_PER_ELEMENT;
const COLOR_VERTEX_OFFSET = 3 * Float32Array.BYTES_PER_ELEMENT;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
var isHeroMoving = false;

const CONTROLS = {
    LEFT: false,
    RIGHT: false
}

var vertexShaderText = `
    precision mediump float;

    attribute vec2 vertPosition;
    attribute vec2 vertOffset;
    attribute float vertScale;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    uniform vec2 heroPosition;

    void main()
    {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition * vertScale + vertOffset + heroPosition, 0.0, 1.0);
    }
`;

var fragmentShaderText = `
    precision mediump float;

    varying vec3 fragColor;

    void main()
    {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`;

var heroVertexShaderText = `
    precision mediump float;

    attribute vec2 vertPosition;
    attribute vec2 texPosition;
    
    varying vec2 v_texcoord;

    uniform vec2 u_heroOffset;
    uniform float u_heroDirection;

    void main()
    {
        gl_Position = vec4(vertPosition + u_heroOffset, 0.0, 1.0);
        // gl_Position = u_matrix * vec4(vertPosition, 0.0, 1.0);
        v_texcoord = (texPosition * vec2(u_heroDirection, 1.0)) * vec2(0.055, 0.30) + vec2(0.1, 0.5);
        // v_texcoord = (u_textureMatrix * vec4(texPosition, 0, 1)).xy;
    }
`;

var heroFragmentShaderText = `
    precision mediump float;

    varying vec2 v_texcoord;
    uniform float u_frame;
    uniform sampler2D sampler;

    void main()
    {
        gl_FragColor = texture2D(sampler, v_texcoord + vec2(u_frame, 0.0));
    }
`;

const main = function() {
    const timerDiv = document.getElementById('timer');
    const resultDiv = document.getElementById('result');
    const instructionDiv = document.getElementById('instructions');
    const canvas = document.getElementById('game-surface');

    if (window.innerHeight > window.innerWidth) {
        let newW = window.innerWidth - 20;
        // canvas.width = newW;
        // canvas.height = 600;
        
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
        resultDiv.style.width = newW + 'px';
        timerDiv.style.width = newW + 'px';
        instructionDiv.style.width = newW + 'px';
    } else {
        // canvas.width = 800;
        // canvas.height = 600;

        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
        resultDiv.style.width = '800px';
        timerDiv.style.width = '800px';
        instructionDiv.style.width = '800px';
    }

    resultDiv.style.marginTop = (600 / 2 - 30) + 'px';

    const gl = canvas.getContext('webgl2');
    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    if (!gl) {
        gl = canvas.getContext('experimental-webgl');
    }

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling vertext shader!', gl.getShaderInfoLog(vertextShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    // balls program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linking program!', gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('Error validating program!', gl.getProgramInfoLog(program));
        return;
    }

    // Create a vertex array object (attribute state)
    const vao = gl.createVertexArray();

    // and make it the one we're currently working with
    gl.bindVertexArray(vao);

    var triangleStripVertices = [];
    for (let i = 0.0; i <= 360; ++i) {
        let j = i * Math.PI / 180;

        let v1 = [Math.sin(j), Math.cos(j)];
        let v2 = [0, 0];

        triangleStripVertices = triangleStripVertices.concat(v1);
        triangleStripVertices = triangleStripVertices.concat(v2);
    }

    let n = triangleStripVertices.length / 2;

    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleStripVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation,
        2, // number of elements per attribute
        gl.FLOAT,
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT, // size of vertex
        0 // offset from beginning of a single vertext to this attribute
    );

    gl.enableVertexAttribArray(positionAttribLocation);

    const hero = new Hero(0.0, -0.85, 0.05);
    const heroBuffer = gl.createBuffer();
    const heroData = new Float32Array([hero.x, hero.y, hero.radius, 0.0, 0.0, 0.0])

    var transformData = [];
    const balls = [];

    for (let i = 0; i < BALL_COUNT; ++i) {
        balls.push(new Ball());
        transformData.push(balls[i].x, balls[i].y, balls[i].radius, balls[i].color[0], balls[i].color[1], balls[i].color[2]);
    }

    transformData = new Float32Array(transformData);

    
    var explosionData = [];
    var explosion = [];

    for (let i = 0; i < EXPLOSION_COUNT; ++i) {
        explosion.push(new Ball());
        explosion[i].x = hero.x;
        explosion[i].y = -1.05;
        explosion[i].setForce(explosion[i].fx, explosion[i].restitution);
        explosionData.push(explosion[i].x, explosion[i].y, 0.005, explosion[i].color[0], explosion[i].color[1], explosion[i].color[2]);
    }

    // console.log(explosion[0].x, explosion[0].y);

    explosionData = new Float32Array(explosionData);


    const transformBuffer = gl.createBuffer();

    //
    // test shader
    //
    // Create a vertex array object (attribute state)
    const vao2 = gl.createVertexArray();

    // and make it the one we're currently working with
    gl.bindVertexArray(vao2);
    var heroVertexShader = gl.createShader(gl.VERTEX_SHADER);
    var heroFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(heroVertexShader, heroVertexShaderText);
    gl.shaderSource(heroFragmentShader, heroFragmentShaderText);

    gl.compileShader(heroVertexShader);
    if (!gl.getShaderParameter(heroVertexShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling vertext shader!', gl.getShaderInfoLog(heroVertexShader));
        return;
    }

    gl.compileShader(heroFragmentShader);
    if (!gl.getShaderParameter(heroFragmentShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling fragment shader!', gl.getShaderInfoLog(heroFragmentShader));
        return;
    }

    const heroProgram = gl.createProgram();
    gl.attachShader(heroProgram, heroVertexShader);
    gl.attachShader(heroProgram, heroFragmentShader);

    gl.linkProgram(heroProgram);
    if (!gl.getProgramParameter(heroProgram, gl.LINK_STATUS)) {
        console.error('Error linking program!', gl.getProgramInfoLog(heroProgram));
        return;
    }

    gl.validateProgram(heroProgram);
    if (!gl.getProgramParameter(heroProgram, gl.VALIDATE_STATUS)) {
        console.error('Error validating program!', gl.getProgramInfoLog(heroProgram));
        return;
    }

    // const triangle = new Float32Array([
    //     -1.0, 1.0,
    //     1.0, 1.0,
    //     1.0, -1.0,
    //     -1.0, 1.0,
    //     1.0, -1.0,
    //     -1.0, -1.0,
    // ]);
    
    // const triangle = new Float32Array([
    //     -0.5, 0.5,
    //     0.5, 0.5,
    //     0.5, -0.5,
    //     -0.5, 0.5,
    //     0.5, -0.5,
    //     -0.5, -0.5,
    // ]);

    const tx = 0.05;
    const ty = 0.15;

    const triangle = new Float32Array([
        -tx, ty,
        tx, ty,
        tx, -ty,
        -tx, ty,
        tx, -ty,
        -tx, -ty,
    ]);

    var triangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangle, gl.DYNAMIC_DRAW);

    var triangleAttribLocation = gl.getAttribLocation(heroProgram, 'vertPosition');
    var textAttribLocation = gl.getAttribLocation(heroProgram, 'texPosition');
    var heroLocation = gl.getUniformLocation(heroProgram, "u_heroOffset");
    var heroDirectionLocation = gl.getUniformLocation(heroProgram, "u_heroDirection");
    var frameLocation = gl.getUniformLocation(heroProgram, "u_frame");

    // var textureLocation = gl.getUniformLocation(heroProgram, "sampler");
    
    gl.vertexAttribPointer(
        triangleAttribLocation,
        2, // number of elements per attribute
        gl.FLOAT,
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT, // size of vertex
        0 // offset from beginning of a single vertext to this attribute
    );

    var texCoords = new Float32Array([
        -1.0, 1.0,
        1.0, 1.0,
        1.0, -1.0,
        -1.0, 1.0,
        1.0, -1.0,
        -1.0, -1.0,
    ]);

    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(
        textAttribLocation,
        2, // number of elements per attribute
        gl.FLOAT,
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT, // size of vertex
        0 // offset from beginning of a single vertext to this attribute
    );


    gl.enableVertexAttribArray(triangleAttribLocation);
    gl.enableVertexAttribArray(textAttribLocation);

    var boxTexture = gl.createTexture();

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);


    const texInfo = {
        width: 1,
        height: 1
    }
    
    var img = new Image();
    img.addEventListener('load', function() {
        texInfo.width = img.width;
        texInfo.height = img.height;

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE,
            img
        );
        gl.bindTexture(gl.TEXTURE_2D, null);
    });
    // img.src = 'assets/star.jpeg';
    img.src = 'assets/hero.png';
	

    //
    // game loop
    //
    var gameover = false;
    let last = new Date();

    const g = -0.04;
    var isExplode = false;
    var isExplosionOver = false;
    
    // gl.useProgram(program);

    const heroFrames = [0.0, 0.12, 0.23, 0.33, 0.45, 0.57, 0.68, 0.795];
    var tmp = 0;
    var frameIdx = 0;
    var t = 0;

    var ms = 0;
    var seconds = 0;
    var minutes = 0;
    var level = 0;

    function render() {
        if (!gameover) {
            let now = new Date();
            let delta = (now - last) / 1000;
            last = now;

            // gl.clearColor(0.75, 0.85, 0.80, 1.0);
            gl.clearColor(0.09, 0.173, 0.235, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);

            if (!isExplode) {
                if (CONTROLS.LEFT) {
                    hero.initMovement(-1);
                } else if (CONTROLS.RIGHT) {
                    hero.initMovement(1);
                }else {
                    hero.initMovement(0);
                }

                hero.move(delta);

                level = Math.min(Math.floor((seconds + 3) / 3), BALL_COUNT);
            }

            // for (let i in balls) {
            // for (let i = 0; i < level; ++i) {
            for (let i = 0; i < BALL_COUNT; ++i) {
                balls[i].move();

                // process ground collision
                let dy = balls[i].y - -1.0;
                if (dy >= balls[i].radius) {
                    balls[i].addForce(0, g * delta);
                } else {
                    balls[i].setPos(balls[i].x, -1.0 + balls[i].radius);
                    balls[i].setForce(balls[i].fx, balls[i].restitution);
                    balls[i].hasBounced = true;
                }

                // process ball x-axis bounds
                let dx1 = balls[i].radius + 1.0;
                let dx2 = -balls[i].radius + -1.0;

                if (balls[i].hasBounced) {
                    if (balls[i].direction > 0) {
                        if (balls[i].x >= dx1) {
                            balls[i].reset();
                        }
                    } else {
                        if (balls[i].x <= dx2) {
                            balls[i].reset();
                        }
                    }
                }

                // if (checkCollision(hero, balls[i])) {
                //     // gameover = true;
                //     // break;
                // }
                
                if (!isExplode && rectCircleCollision(balls[i], hero)) {
                    // gameover = true;
                    // isExplode = true;
                    // displayGameResult('You Lose!');
                }

                let idx = i * 6;
                transformData[idx] = balls[i].x;
                transformData[idx + 1] = balls[i].y;
            }

            if (isExplode && !isExplosionOver) {
                explodeHero(delta);
            }

            gl.useProgram(program);
            gl.bindVertexArray(vao);
            
            initTransformBuffer(transformData);
            // gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
            // gl.bufferSubData(gl.ARRAY_BUFFER, 0, transformData);
            gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, n, balls.length);

            if (!isExplosionOver) {
                initTransformBuffer(explosionData);
                gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, n, EXPLOSION_COUNT);
            }

            // if (!isExplode) {
            //     heroData[0] = hero.x;

            //     // initHeroBuffer();
            //     // // // var offset = gl.getUniformLocation(program, "heroPosition");
            //     // // // gl.uniform2fv(offset, [hero.x, 0.0]);
            //     // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

            //     // draw test
            //     // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            //     gl.useProgram(heroProgram);
            //     gl.bindVertexArray(vao2);

            //     gl.bindTexture(gl.TEXTURE_2D, boxTexture);
            //     // gl.activeTexture(gl.TEXTURE0);

            //     gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
            //     gl.bufferData(gl.ARRAY_BUFFER, triangle, gl.DYNAMIC_DRAW);

            //     // var triangleAttribLocation = gl.getAttribLocation(heroProgram, 'vertPosition');
            //     gl.vertexAttribPointer(
            //         triangleAttribLocation,
            //         2, // number of elements per attribute
            //         gl.FLOAT,
            //         gl.FALSE,
            //         2 * Float32Array.BYTES_PER_ELEMENT, // size of vertex
            //         0 // offset from beginning of a single vertext to this attribute
            //     );

            //     gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
            //     gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.DYNAMIC_DRAW);

            //     gl.vertexAttribPointer(
            //         textAttribLocation,
            //         2, // number of elements per attribute
            //         gl.FLOAT,
            //         gl.FALSE,
            //         2 * Float32Array.BYTES_PER_ELEMENT, // size of vertex
            //         0 // offset from beginning of a single vertext to this attribute
            //     );

            //     // gl.vertexAttribDivisor(triangleAttribLocation, 1);
            //     gl.enableVertexAttribArray(triangleAttribLocation);
            //     gl.enableVertexAttribArray(textAttribLocation);

            //     tmp += 20 * delta;
                
            //     frameIdx = Math.floor(tmp) % heroFrames.length;

            //     gl.uniform2fv(heroLocation, [hero.x, -0.85]);
            //     gl.uniform1f(heroDirectionLocation, hero.lastDirection);
            //     gl.uniform1f(frameLocation, heroFrames[frameIdx]);
                
            //     gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);

            //     setTimer(delta);
            // }
            
            requestAnimationFrame( render );
        } else {
            displayGameResult('You Won!');
        }
    }

    function explodeHero(delta) {
        let flag = false;

        for (let i in explosion) {
            explosion[i].move(delta);
            explosion[i].addForce(0.0, -0.1 * delta);
            // console.log(explosion[i].x, explosion[i].y);
            let idx = i * 6;
            explosionData[idx] = hero.x + explosion[i].x;
            explosionData[idx + 1] = explosion[i].y;

            if (explosion[i].y > -1.2) {
                flag = true;
            }
        }
        
        isExplosionOver = !flag;

        // console.log(explosion[0].x, explosion[0].y);
    }

    function initTransformBuffer(buffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.DYNAMIC_DRAW);

        var offsetAttribLocation = gl.getAttribLocation(program, 'vertOffset');
        
        gl.vertexAttribPointer(
            offsetAttribLocation,
            2, // number of elements per attribute
            gl.FLOAT,
            gl.FALSE,
            VERTEX_SIZE, // size of vertex
            0 // offset from beginning of a single vertext to this attribute
        );

        var scaleAttribLocation = gl.getAttribLocation(program, 'vertScale');
        
        gl.vertexAttribPointer(
            scaleAttribLocation,
            1, // number of elements per attribute
            gl.FLOAT,
            gl.FALSE,
            VERTEX_SIZE, // size of vertex
            SCALE_VERTEX_OFFSET // offset from beginning of a single vertext to this attribute
        );

        var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
        
        gl.vertexAttribPointer(
            colorAttribLocation,
            3, // number of elements per attribute
            gl.FLOAT,
            gl.FALSE,
            VERTEX_SIZE, // size of vertex
            COLOR_VERTEX_OFFSET // offset from beginning of a single vertext to this attribute
        );

        gl.vertexAttribDivisor(offsetAttribLocation, 1);
        gl.vertexAttribDivisor(scaleAttribLocation, 1);
        gl.vertexAttribDivisor(colorAttribLocation, 1);

        gl.enableVertexAttribArray(offsetAttribLocation);
        gl.enableVertexAttribArray(scaleAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);
    }

    function initHeroBuffer() {
        gl.bindBuffer(gl.ARRAY_BUFFER, heroBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, heroData, gl.STATIC_DRAW);

        var offsetAttribLocation = gl.getAttribLocation(program, 'vertOffset');
        
        gl.vertexAttribPointer(
            offsetAttribLocation,
            2, // number of elements per attribute
            gl.FLOAT,
            gl.FALSE,
            VERTEX_SIZE, // size of vertex
            0 // offset from beginning of a single vertext to this attribute
        );

        var scaleAttribLocation = gl.getAttribLocation(program, 'vertScale');
        
        gl.vertexAttribPointer(
            scaleAttribLocation,
            1, // number of elements per attribute
            gl.FLOAT,
            gl.FALSE,
            VERTEX_SIZE, // size of vertex
            SCALE_VERTEX_OFFSET // offset from beginning of a single vertext to this attribute
        );

        var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
        
        gl.vertexAttribPointer(
            colorAttribLocation,
            3, // number of elements per attribute
            gl.FLOAT,
            gl.FALSE,
            VERTEX_SIZE, // size of vertex
            COLOR_VERTEX_OFFSET // offset from beginning of a single vertext to this attribute
        );

        gl.vertexAttribDivisor(offsetAttribLocation, 1);
        gl.vertexAttribDivisor(scaleAttribLocation, 1);
        gl.vertexAttribDivisor(colorAttribLocation, 1);

        gl.enableVertexAttribArray(offsetAttribLocation);
        gl.enableVertexAttribArray(scaleAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);
    }

    function checkCollision(b1, b2) {
        return ((b1.radius + b2.radius) ** 2 > (b1.x - b2.x) ** 2 + (b1.y - b2.y) ** 2);
    }

    function rectCircleCollision(circle, rect){
        var distX = Math.abs(circle.x - rect.x - rect.w / 2);
        var distY = Math.abs(circle.y - rect.y - rect.h / 2);
    
        if (distX > (rect.w / 2 + circle.radius)) { return false; }
        if (distY > (rect.h / 2 + circle.radius)) { return false; }
    
        if (distX <= (rect.w / 2)) { return true; } 
        if (distY <= (rect.h / 2)) { return true; }
    
        var dx = distX - rect.w / 2;
        var dy = distY - rect.h / 2;
        return (dx * dx + dy * dy <= (circle.radius * circle.radius));
    }

    function setTimer(delta) {
        t += 1 * delta;

        // let t = timer / 1000;
        ms = Math.floor(t * 1000) % 100;
        seconds = Math.floor(t) % 60;
        minutes = Math.floor(t / 60);

        if (minutes >= 3) {
            isWinner = true;
            gameover = true;
        }

        timerDiv.innerHTML = minutes + ':' + (seconds < 10 ? ('0' + seconds) : seconds) + ':' + (ms < 10 ? ('0' + ms) : ms);
    }

    function displayGameResult(str) {
        resultDiv.innerHTML = str;
        resultDiv.style.display = 'block';
    }

    document.addEventListener('keydown', (e) => {
        e.preventDefault();

        if (e.keyCode == KEY_LEFT) {
            CONTROLS.LEFT = true;
        } else if (e.keyCode == KEY_RIGHT) {
            CONTROLS.RIGHT = true;
        }
    });

    document.addEventListener('keyup', (e) => {
        e.preventDefault();

        if (e.keyCode == KEY_LEFT) {
            CONTROLS.LEFT = false;
        } else if (e.keyCode == KEY_RIGHT) {
            // hero.initMovement(1);
            CONTROLS.RIGHT = false;
        }
    });

    document.addEventListener('touchstart', (e) => {
        e.preventDefault();

        var x = 0, x1 = 0;

        if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
            var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
            var touch = evt.touches[0] || evt.changedTouches[0];
            x = touch.pageX;

            if (evt.touches.length > 1) {
                var touch2 = evt.touches[1] || evt.changedTouches[1];
                x1 = touch2.pageX;

                if (x >= screen.width) {
                    CONTROLS.RIGHT = true;
                    // CONTROLS.LEFT = false;
                } else  {
                    CONTROLS.LEFT = true;
                    // CONTROLS.RIGHT = false;
                }

                if (x1 >= screen.width) {
                    CONTROLS.RIGHT = true;
                    // CONTROLS.LEFT = false;
                } else {
                    CONTROLS.LEFT = true;
                    // CONTROLS.RIGHT = false;
                }
            } else {
                if (x >= screen.width) {
                    CONTROLS.RIGHT = true;
                    // CONTROLS.LEFT = false;
                } else  {
                    CONTROLS.LEFT = true;
                    // CONTROLS.RIGHT = false;
                }
            }
        }
        
    });

    var lastMove = null;
    document.addEventListener('touchmove', (e) => {
        lastMove = e;
    });

    document.addEventListener('touchend', (e) => {
        e.preventDefault();
 
        var x = e.changedTouches[event.changedTouches.length-1].pageX;

        if (x >= screen.width) {
            CONTROLS.RIGHT = false;
        } else {
            CONTROLS.LEFT = false;
        }
    });

    requestAnimationFrame( render );
}

