const canvas = document.getElementById('game-surface');
const gl = canvas.getContext("webgl");

var last = 0;
var delta = 0;

var G = 9.8 * 10;

var scaleX = 1;
var scaleY = 1;

var cubeRotation = 0.0;

var programInfo = null;
var buffers = null;

var keys = {};
const totalKeys = 21;

const PIANO_KEYS = {
    'q': 0,
    'w': 1,
    'e': 2,
    'r': 3,
    'u': 4,
    'i': 5,
    'o': 6,
    'p': 7,
    'a': 8,
    's': 9,
    'd': 10,
    'f': 11,
    'j': 12,
    'k': 13,
    'l': 14,
    ';': 15,
    'z': 16,
    'x': 17,
    'c': 18,
    'v': 19,
    'm': 20
}

const pianoKeysPos = {
    white: {
        lower : {
            x: -21.0,
            y: -10.5,
            z: -27.0,
        },
        upper: {
            x: -21.0,
            y: -10.5,
            z: -28.8,
        }
        
    },
    black: {
        x: -21.0,
        y: -10.5,
        z: -29.5,
        guide: {
            2: 1, 6: 1, 9: 1, 13: 1, 16: 1, 20: 1
        }
    },
    gap: 2.1
};

const hero = {
    pos: 0,
    moveTo: 0,
    x: 0,
    y: 0,
    z: 0,
    adjX: 0.25,
    pressDepth: 0.30,
    dashSpeed: 50,
    isDashing: false,
    isAirborne: false,
    allowJump: false,
    ay: 0,
    ax: 0,
    vx: 0,
    vy: 0
};

const mob = {
    pressDepth: 0.50
}


var groundY = 0;
var ceilingY = 0;

var isKeyDown = false;


// const yPos = (-8.0 - 2.5) * scaleX + 2.25;
//     let zPos = (-22.0 - 5.0) * scaleX;
//     let xPos = (-10.0 - 11.0) + 2.1 * heroPos + 0.2;

//     let heroY = -1.30 * scaleX;
//     let heroZ = (-24.5 - 4.0) * scaleX;
    
//     drawHero(projectionMatrix, xPos, yPos, zPos, 1.0, 1.0);

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    canvas.style.display = 'block';

    scaleX = 1792 / w;
    // scaleX = w / 1792;
    scaleY = h / 922;

    pianoKeysPos.white.upper.y *= scaleX;
    pianoKeysPos.white.upper.z *= scaleX;

    pianoKeysPos.white.lower.y *= scaleX;
    pianoKeysPos.white.lower.z *= scaleX;

    pianoKeysPos.black.y *= scaleX;
    pianoKeysPos.black.z *= scaleX;

    groundY = pianoKeysPos.white.lower.y + 2.25;
    ceilingY = 10.2 * scaleX;

    hero.x = pianoKeysPos.white.lower.x + hero.adjX;
    hero.y = groundY;
    hero.z = pianoKeysPos.white.lower.z;

    hero.pressDepth *= scaleX;
    mob.pressDepth *= scaleX;
    hero.dashSpeed *= scaleX;

    G *= scaleX;

    init();
    
    gameCycle();
}

function init() {
    // Only continue if WebGL is available and working
    if (gl === null) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
        );
        return;
    }

    gl.viewport(0,0,canvas.width,canvas.height);

    /*================ Shaders ====================*/
     
    // Vertex shader source code
    var vertCode = `
        attribute vec4 aVertexPosition;
        attribute vec3 aVertexNormal;
        attribute vec4 aVertexColor;
    
        uniform mat4 uNormalMatrix;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
    
        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;

        varying lowp vec4 vColor;
    
        void main(void) {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        
            // Apply lighting effect
            highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
            highp vec3 directionalLightColor = vec3(1, 1, 1);
            highp vec3 directionalVector = normalize(vec3(1.0, 2.0, 3.0));
        
            highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
        
            highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
            vLighting = ambientLight + (directionalLightColor * directional);

            vColor = aVertexColor;
        }
   `;
        
    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);

    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);

    // Compile the vertex shader
    gl.compileShader(vertShader);

    //fragment shader source code
    var fragCode = `
        varying highp vec3 vLighting;
        varying lowp vec4 vColor;

        void main(void) {
            gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);
        }
   `;
        
     // Create fragment shader object
     var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

     // Attach fragment shader source code
     gl.shaderSource(fragShader, fragCode); 
     
     // Compile the fragmentt shader
     gl.compileShader(fragShader);

     // Create a shader program object to store
     // the combined shader program
     var shaderProgram = gl.createProgram();

     // Attach a vertex shader
     gl.attachShader(shaderProgram, vertShader);

     // Attach a fragment shader
     gl.attachShader(shaderProgram, fragShader);

     // Link both the programs
     gl.linkProgram(shaderProgram);

     // Use the combined shader program object

    programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
          vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
          vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal")
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(
            shaderProgram,
            "uProjectionMatrix"
          ),
          modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
          normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix")
        },
    };

    buffers = initBuffers(gl);

    initKeys();

    // keys[8].pressed = true;
    // keys[3].pressed = true;


    controls();
}

function controls() {
    document.addEventListener('keydown', (e) => {
        e.preventDefault();

        let key = e.key;
        if (key == ' ') {
            let steppedKeys = getSteppedKeys(hero.x, 1.0);
            hero.moveTo = steppedKeys[0];
            hero.isDashing = false;
            hero.ay = -50 * scaleX;
        } else if (key in PIANO_KEYS) {
            if (!keys[PIANO_KEYS[key]].pressed) {
                pressPianoKey(PIANO_KEYS[key]);
                hero.moveTo = PIANO_KEYS[key];
                // if (!hero.isAirborne) {
                    
                // }
                hero.allowJump = true;
                isKeyDown = true;
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        e.preventDefault();

        let key = e.key;
        if (key in PIANO_KEYS) {
            if (keys[PIANO_KEYS[key]].pressed) {
                keys[PIANO_KEYS[key]].up = true;
                keys[PIANO_KEYS[key]].pressed = false;
                


                // if (hero.allowJump) {
                //     hero.allowJump = false;
                // }
                
                if (hero.isDashing) {
                    let steppedKeys = getSteppedKeys(hero.x, 1.0);
                    hero.pos = steppedKeys[0];
                }

                isKeyDown = false;
            }
        } else {
            if (key == 'ArrowRight') {
                moveHeroToPos(Math.min(20, hero.pos + 1));
            } if (key == 'ArrowLeft') {
                moveHeroToPos(Math.max(0, hero.pos - 1));
            }
        }
    });
}

function moveHeroToPos(pos) {
    hero.pos = pos;
    let centerAdj = (pos < 11 ? 0.025 : 0.030) * pos;
    hero.x = pianoKeysPos.white.upper.x + pianoKeysPos.gap * hero.pos + hero.adjX - centerAdj;
}

function pressPianoKey(idx) {
    keys[idx].pressed = true;
    keys[idx].up = false;
    keys[idx].pressT = 0;
    keys[idx].depth = keys[idx].pressDepth;
}

function spritePianoKeyDown(idx, pressDepth) {
    keys[idx].sprites.pressed = true;
    keys[idx].sprites.up = false;
    keys[idx].sprites.pressT = 0;
    keys[idx].sprites.pressDepth = pressDepth;
    keys[idx].sprites.depth = keys[idx].sprites.pressDepth;
}

function spritePianoKeyUp(idx) {
    keys[idx].sprites.pressed = false;
    keys[idx].sprites.up = true;
}

function getPianoKeyPressDepth(idx) {
    let pressDepth = 0;
    if (keys[idx].up || keys[idx].pressed) {
        pressDepth = keys[idx].depth;
    } else if (keys[idx].sprites.up || keys[idx].sprites.pressed) {
        if (!hero.isAirborne)
        pressDepth = keys[idx].sprites.depth;
    }

    return pressDepth;
}

function updatePianoKeys(obj) {
    if (obj.up) {
        obj.pressT += 10 * delta;
        
        let percentage = 1.0 - obj.pressT / 1.0;

        // keys[i].depth = Math.min(keys[i].pressDepth * percentage, 0.75);
        obj.depth = obj.pressDepth * percentage
        // console.log(keys[i].depth, keys[i].pressDepth * percentage)
        if (obj.pressT >= 1.0) {
            obj.pressed = false;
            obj.pressT = 0;
            obj.up = false;
        }
    }
}

function initKeys() {
    let pressDepth = 0.75 * scaleX;

    for (let i = 0; i < totalKeys; ++i) {
        keys[i] = {
            pressed: false,
            up: false,
            pressDepth: pressDepth,
            pressT: 0,
            depth: 0,
            sprites: {
                pressed: false,
                up: false,
                pressT: 0,
                pressDepth: 0,
                depth: 0
            }
        }
    }
}

function drawScene() {
    gl.clearColor(0.1, 0.2, 0.3, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  
    // Clear the canvas before we start drawing on it.
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
  
    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
  
    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    // drawPiano(projectionMatrix, 9.7, 2.5, 5.0);
    // drawPiano(projectionMatrix, 11.0, 2.5, 5.0);
    drawPiano(projectionMatrix, pianoKeysPos.white.lower.x, pianoKeysPos.white.lower.y, pianoKeysPos.white.lower.z);
    drawHero(projectionMatrix, hero.x, hero.y, hero.z, 1.0, 1.0);
    
}

function projectPointTo2D(x3D, y3D, z3D, d) {
    const x2D = (x3D * d) / (z3D + d);
    const y2D = (y3D * d) / (z3D + d);
    return { x: x2D, y: y2D };
}

function drawPiano(projectionMatrix, xAdj, yAdj, zAdj) {
    const yPos = yAdj;

    let start = xAdj;
    for (let i = 0; i < totalKeys; ++i) {
        let pressDepth = getPianoKeyPressDepth(i);
        // if (keys[i].up || keys[i].pressed) {
        //     pressDepth = keys[i].depth;
        // }

        drawKey(projectionMatrix, start, yPos - pressDepth, pianoKeysPos.white.lower.z, 1.0, 1.0, 0);
        start += pianoKeysPos.gap;
    }

    let r = 0.4;
    start = xAdj - 0.4;
    let start2 = xAdj;

    let mod = [3, 7, 10, 14, 17];
    let idx = 0;
    let counter = 0;

    for (let i = 0; i < totalKeys; ++i) {
        if (counter && counter % mod[idx] == 0) {
            idx++;
            if (idx % 2) {
                r = 0.33;
                start = start2 - 0.5;
            } else {
                r = 0.4;
                start = start2 - r;
            }
        }

        let pressDepth = getPianoKeyPressDepth(i);
        // if (keys[i].up || keys[i].pressed) {
        //     pressDepth = keys[i].depth;
        // }

        if (r == 0.4) {
            drawKey(projectionMatrix, start, yPos - pressDepth, pianoKeysPos.white.upper.z, 0.6, 1.0, 0);
        } else {
            drawKey(projectionMatrix, start, yPos - pressDepth, pianoKeysPos.white.upper.z, 0.5, 1.0, 0);
        }

        if (!pianoKeysPos.black.guide[i]) { // bruteforce
            if (i == 4) {
                drawKey(projectionMatrix, (start + pianoKeysPos.gap + r) - 1.2, yPos + 0.35, pianoKeysPos.black.z, 0.6, 1.35, 1);
            } else if (i == 5) {
                drawKey(projectionMatrix, (start + pianoKeysPos.gap + r) - 1.2, yPos + 0.35, pianoKeysPos.black.z, 0.6, 1.35, 1);
            } else {
                drawKey(projectionMatrix, (start + pianoKeysPos.gap + r) - 1.2, yPos + 0.35, pianoKeysPos.black.z, 0.6, 1.35, 1);
            }
        }

        counter++;
        start += pianoKeysPos.gap + r;
        start2 += pianoKeysPos.gap;
    }
}

function drawKey(projectionMatrix, x, y, z, width, height, colorIdx) {
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();
  
    // Now move the drawing position a bit to where we want to
    // start drawing the square.
    mat4.translate(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to translate
      [x, y, z]
    ); // amount to translate
  
    // mat4.rotate(
    //   modelViewMatrix, // destination matrix
    //   modelViewMatrix, // matrix to rotate
    //   cubeRotation, // amount to rotate in radians
    //   [0, 0, 1]
    // ); // axis to rotate around (Z)
    // mat4.rotate(
    //   modelViewMatrix, // destination matrix
    //   modelViewMatrix, // matrix to rotate
    //   cubeRotation * 0.7, // amount to rotate in radians
    //   [0, 1, 0]
    // ); // axis to rotate around (Y)
    // mat4.rotate(
    //   modelViewMatrix, // destination matrix
    //   modelViewMatrix, // matrix to rotate
    //   cubeRotation * 0.3, // amount to rotate in radians
    //   [1, 0, 0]
    // );

    mat4.scale(modelViewMatrix, modelViewMatrix, [width, height, 1]);

    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    setPositionAttribute(gl, buffers.piano.position, programInfo);

    if (colorIdx) {
        setColorAttribute(gl, buffers.piano.colors.black, programInfo);
    } else {
        setColorAttribute(gl, buffers.piano.colors.white, programInfo);
    }
    

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.piano.indices);

    setNormalAttribute(gl, buffers.piano.normal, programInfo);

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix
    );

    {
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}


function drawHero(projectionMatrix, x, y, z, width, height) {
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();
  
    // Now move the drawing position a bit to where we want to
    // start drawing the square.
    mat4.translate(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to translate
      [x, y, z]
    ); // amount to translate
  
    // mat4.rotate(
    //   modelViewMatrix, // destination matrix
    //   modelViewMatrix, // matrix to rotate
    //   cubeRotation, // amount to rotate in radians
    //   [0, 0, 1]
    // ); // axis to rotate around (Z)

    mat4.scale(modelViewMatrix, modelViewMatrix, [width, height, 1]);

    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    setPositionAttribute(gl, buffers.hero.position, programInfo);

    setColorAttribute(gl, buffers.hero.colors.default, programInfo);
    

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.hero.indices);

    setNormalAttribute(gl, buffers.hero.normal, programInfo);

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix
    );

    {
        const vertexCount = 6;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}

function getSteppedKeys(x, w) {
    let loX = x - pianoKeysPos.white.lower.x;
    let hiX = x + w - pianoKeysPos.white.lower.x
    let lo = Math.floor(loX / pianoKeysPos.gap);
    let hi = Math.floor(hiX / pianoKeysPos.gap);

    let p1 = 0;
    let p2 = 0;

    let a = lo * pianoKeysPos.gap + w;
    let b = hi * pianoKeysPos.gap + w;
    if (loX <= a) {
        p1 = lo;
    } else {
        p1 = hi;
    }

    if (hiX <= b) {
        p2 = hi;
    } else {
        p2 = lo;
    }

    return [p1, p2];
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(gl, position, programInfo) {
    const numComponents = 3;
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }
  
  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  function setColorAttribute(gl, color, programInfo) {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, color);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  }

// Tell WebGL how to pull out the normals from
// the normal buffer into the vertexNormal attribute.
function setNormalAttribute(gl, normal, programInfo) {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, normal);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexNormal,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}

function heroDashJump(to) {
    let centerAdj = (to < 11 ? 0.025 : 0.030) * to;
    let edge = pianoKeysPos.white.upper.x + pianoKeysPos.gap * to + hero.adjX - centerAdj;

    if (hero.pos < to) {
        if (hero.x < edge) {
            hero.x += hero.dashSpeed * delta;
            hero.isDashing = true;
        } else {
            hero.x = edge;
            hero.pos = to;
            hero.isDashing = false;   
        }
    } else if (hero.pos > to) {
        if (hero.x > edge) {
            hero.x -= hero.dashSpeed * delta;
            hero.isDashing = true;
        } else {
            hero.x = edge;
            hero.pos = to;
            hero.isDashing = false;
        }
    } else {
        // jump
        hero.isDashing = false;

        if (isKeyDown) {
            if (hero.allowJump) {
                hero.ay = 25 * scaleX;
                hero.allowJump = false;
                
            } 
            
            if (isKeyDown) {
                hero.ay += 1.20 * scaleX;
            }
        }
        
    }
}

function updateHero() {
    // hero.vy += hero.ay * delta;
    
    if (!hero.isDashing) {
        hero.y += hero.ay * delta;
        hero.ay -= G * delta;
    }
    
    if (hero.y > groundY) {
        hero.isAirborne = true;
    } else {
        hero.isAirborne = false;
    }

    if (hero.y <= groundY) {
        hero.y = groundY;
    } else if (hero.y >= ceilingY) {
        hero.y = ceilingY;
    }

    if (!hero.isAirborne) {
        let steppedKeys = getSteppedKeys(hero.x, 1.0);
        for (let i = 0; i < totalKeys; ++i) {
            if (!keys[i].sprites.pressed) {
                if (steppedKeys[0] == i || steppedKeys[1] == i) {
                    spritePianoKeyDown(i, hero.pressDepth);
                }
            } else if (!keys[i].sprites.up) {
                if (steppedKeys[0] != i && steppedKeys[1] != i) {
                    spritePianoKeyUp(i);
                }
            }
        }
    }
}

function update() {
    // cubeRotation += delta;
    if (delta < 1) {
        heroDashJump(hero.moveTo);
        updateHero();
        for (let i = 0; i < totalKeys; ++i) {
            updatePianoKeys(keys[i]);
            updatePianoKeys(keys[i].sprites);
        }

        
    }
    
}


function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    drawScene();
    update();

    requestAnimationFrame(gameCycle);
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);
