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
var groundLimit = 0;
var ceilingY = 0;
var maxRight = 0;
var minLeft = 0;

var isKeyDown = false;

var g_texture = null;

var sun = {
    x: 0.0,
    y: 0.0,
    r: 1.0
}

var noteInfo = {
    0: {
        stem: {
            x: 0.25,
            y: 0.60,
            sw: 0.5,
            sh: 4.5,
        },
        head: {
            x: 0.0,
            y: 0.0,
            sw: 0.25,
            sh: 0.25,
        },
    },
    1: {
        stem: {
            x: 1.40,
            y: 0.95,
            sw: 0.5,
            sh: 4.0,
        },
        head: {
            x: 1.20,
            y: 0.35,
            sw: 0.25,
            sh: 0.25,
        },
        beam: {
            x: 0.80,
            y: 1.40,
            sw: 0.5,
            sh: 4.0,
            rotation: 1.7 // radians
        }
    },
    z: 0.0,
    SINGLE: 0,
    DOUBLE: 1,
    patterns: {
        DROP: 0,
        BOUNCE: 1,
        TRAIL: 2,
    }
};

const notes = [];

var maxTrail = 10;
var trailCount = 0;
var timer = 0;

// if (type == 0) {
//     drawNoteStem(projectionMatrix, 0.25, 0.60, hero.z, 0.5, 4.5, 0);
//     drawSphere(projectionMatrix, sun.x, sun.y, hero.z, 0.25, 0.25, false);
// } else {
//     drawNoteStem(projectionMatrix, 0.25, 0.60, hero.z, 0.5, 4.5, 0);
//     drawSphere(projectionMatrix, sun.x, sun.y, hero.z, 0.25, 0.25, false);

//     drawNoteStem(projectionMatrix, 0.80, 1.40, hero.z, 0.5, 4.0, 1.7);
    
//     drawNoteStem(projectionMatrix, sun.x + 1.40, 0.60 + 0.35, hero.z, 0.5, 4.0, 0);
//     drawSphere(projectionMatrix, sun.x + 1.2, sun.y + 0.35, hero.z, 0.25, 0.25, false);
// }

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
    minLeft = pianoKeysPos.white.lower.x;
    maxRight = pianoKeysPos.white.lower.x + pianoKeysPos.gap * 20;

    groundLimit = groundY - 12.25;

    hero.x = pianoKeysPos.white.lower.x + hero.adjX;
    hero.y = groundY;
    hero.z = pianoKeysPos.white.lower.z;

    hero.pressDepth *= scaleX;
    mob.pressDepth *= scaleX;
    hero.dashSpeed *= scaleX;

    noteInfo.z = hero.z;

    G *= scaleY;

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
        attribute vec2 aTextureCoord;
    
        uniform mat4 uNormalMatrix;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
    
        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;

        varying lowp vec4 vColor;
    
        void main(void) {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vTextureCoord = aTextureCoord;

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
        varying highp vec2 vTextureCoord;

        uniform sampler2D uSampler;
        uniform int hasSampler;

        void main(void) {
            if (hasSampler == 1) {
                highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
                gl_FragColor = vec4(texelColor.rgb * vLighting, 1.0);
            } else {
                gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);
            }
            
        }
   `;
    //    gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);

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
          vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
          textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(
            shaderProgram,
            "uProjectionMatrix"
          ),
          modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
          normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
          uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
          hasSampler: gl.getUniformLocation(shaderProgram, "hasSampler"),
        },
    };

    buffers = initBuffers(gl);

    // console.log(buffers.sphere.colors.list);

    // Load texture
    g_texture = loadTexture(gl, "assets/textures/sun.jpg");
    // Flip image pixels into the bottom-to-top order that WebGL expects.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    initKeys();

    // keys[8].pressed = true;
    // keys[3].pressed = true;
    // let vel = getRandomVelocity(2);
    // let posX = getRandomHorizontalPos();
    // let posY = ceilingY - 5.0;
    
    // addNote(posX, posY, 0.75, noteInfo.SINGLE, 0, noteInfo.patterns.DROP, vel.x, vel.y);

    // vel = getRandomVelocity(2);
    // posX = getRandomHorizontalPos();
    // addNote(posX, posY, 1.0, noteInfo.SINGLE, 1, noteInfo.patterns.DROP, vel.x, vel.y);

    // vel = getRandomVelocity(2);
    // posX = getRandomHorizontalPos();
    // addNote(posX, posY, 1.5, noteInfo.SINGLE, 2, noteInfo.patterns.DROP, vel.x, vel.y);

    // vel = getRandomVelocity(2);
    // posX = getRandomHorizontalPos();
    // addNote(posX, posY, 2.0, noteInfo.SINGLE, 0, noteInfo.patterns.DROP, vel.x, vel.y);

    // vel = getRandomVelocity(2);
    // posX = getRandomHorizontalPos();
    // addNote(posX,posY, 1.0, noteInfo.DOUBLE, 1, noteInfo.patterns.DROP, vel.x, vel.y);
    // // addNote(-5.0, 10.0, 1.5, noteInfo.DOUBLE, 2);
    // // addNote(15.0, -10.0, 2.0, noteInfo.DOUBLE, 2);

    generateDropNote();
    generateDropNote();
    generateDropNote();
    generateDropNote();
    generateDropNote();
    generateDropNote();
    generateDropNote();

    controls();
}

function morphNote(idx) {
    let vel = getRandomVelocity(20);
    let posX = getRandomHorizontalPos();
    let posY = ceilingY + (Math.floor(Math.random() * 15) + 5.0);

    // addNote(posX, posY, 1.0, type, 0, noteInfo.patterns.DROP, vel.x, vel.y);

    let x = posX;
    let y = posY;
    let scale = 1.0 + Math.floor(Math.random() * 100) / 100;
    let type = Math.floor(Math.random() * 2);
    
    let colorIdx = Math.floor(Math.random() * 3);
    let pattern = noteInfo.patterns.DROP
    let vx = vel.x
    let vy = vel.y

    notes[idx] = {
        heads: [
            {
                x: x + noteInfo[noteInfo.SINGLE].head.x * scale,
                y: y + noteInfo[noteInfo.SINGLE].head.y * scale,
                z: noteInfo.z,
                sw: noteInfo[noteInfo.SINGLE].head.sw * scale,
                sh: noteInfo[noteInfo.SINGLE].head.sh * scale
            },
        ],
        stems: [
            {
                x: x + noteInfo[noteInfo.SINGLE].stem.x * scale,
                y: y + noteInfo[noteInfo.SINGLE].stem.y * scale,
                z: noteInfo.z,
                sw: noteInfo[noteInfo.SINGLE].stem.sw * scale,
                sh: noteInfo[noteInfo.SINGLE].stem.sh * scale
            },
        ],
        colorIdx: colorIdx,
        pattern: pattern,
        vx: vx,
        vy: vy
    };

    if (type == noteInfo.DOUBLE) {
        notes[idx].heads.push(
            {
                x: x + noteInfo[noteInfo.DOUBLE].head.x * scale,
                y: y + noteInfo[noteInfo.DOUBLE].head.y * scale,
                z: noteInfo.z,
                sw: noteInfo[noteInfo.DOUBLE].head.sw * scale,
                sh: noteInfo[noteInfo.DOUBLE].head.sh * scale
            },
        );

        notes[idx].stems.push(
            {
                x: x + noteInfo[noteInfo.DOUBLE].stem.x * scale,
                y: y + noteInfo[noteInfo.DOUBLE].stem.y * scale,
                z: noteInfo.z,
                sw: noteInfo[noteInfo.DOUBLE].stem.sw * scale,
                sh: noteInfo[noteInfo.DOUBLE].stem.sh * scale
            },
        );
        notes[idx].beam = {
            x: x + noteInfo[noteInfo.DOUBLE].beam.x * scale,
            y: y + noteInfo[noteInfo.DOUBLE].beam.y * scale,
            z: noteInfo.z,
            sw: noteInfo[noteInfo.DOUBLE].beam.sw * scale,
            sh: noteInfo[noteInfo.DOUBLE].beam.sh * scale,
            rotation: noteInfo[noteInfo.DOUBLE].beam.rotation,
        }
    }

    if (notes.length < 20) {
        generateDropNote();
    }
}

function generateDropNote() {
    let vel = getRandomVelocity(20);
    let posX = getRandomHorizontalPos();
    let posY = ceilingY + (Math.floor(Math.random() * 15) + 5.0);
    let type = Math.floor(Math.random() * 2);
    let color = Math.floor(Math.random() * 3);
    
    addNote(posX, posY, 1.0, type, color, noteInfo.patterns.DROP, vel.x, vel.y);
}

function getRandomVelocity(max) {
    let mul = Math.floor(Math.random() * 2);
    let rngX = Math.floor(Math.random() * max) * (mul ? -1 : 1);
    let rngY = Math.floor(Math.random() * max) + 1;

    return {
        x: rngX,
        y: -rngY,
    }
}

function getRandomHorizontalPos() {
    let rngPos = Math.floor(Math.random() * maxRight);
    let rngNeg = Math.floor(Math.random() * Math.abs(minLeft)) * -1;
    let rng = Math.floor(Math.random() * 1);
    let r = rng ? rngPos : rngNeg;
    return r;
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

    // drawNote(projectionMatrix, 1);
    drawNotes(projectionMatrix);
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

    // setTextureAttribute(gl, buffers.sphere.textureCoord, programInfo);
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

    gl.uniform1i(programInfo.uniformLocations.hasSampler, 0);

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

    gl.uniform1i(programInfo.uniformLocations.hasSampler, 0);

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

function drawSphere(projectionMatrix, x, y, z, width, height, colorIdx, useTexture) {
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

    mat4.scale(modelViewMatrix, modelViewMatrix, [width, height, 1]);

    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    setPositionAttribute(gl, buffers.sphere.position, programInfo);

    setColorAttribute(gl, buffers.sphere.colors.list[colorIdx], programInfo);

    

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.sphere.indices);

    
    setTextureAttribute(gl, buffers.sphere.textureCoord, programInfo);
    setNormalAttribute(gl, buffers.sphere.normal, programInfo);

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

    if (useTexture) {
        // Tell WebGL we want to affect texture unit 0
        gl.activeTexture(gl.TEXTURE0);

        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, g_texture);

        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
        gl.uniform1i(programInfo.uniformLocations.hasSampler, 1);
    } else {
        gl.uniform1i(programInfo.uniformLocations.hasSampler, 0);
    }
    
    
    {
        const vertexCount = buffers.sphere.vertexCount;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

}

function drawNote(projectionMatrix, type) {
    // single
    // if (type == 0) {
    //     let adjX = 10.0
    //     drawNoteStem(projectionMatrix, 0.40 + adjX, 0.75, hero.z, 1.0, 5.5, 0);
    //     drawSphere(projectionMatrix, sun.x + adjX, sun.y, hero.z, 0.50, 0.50, false);
    // } else {
    //     drawNoteStem(projectionMatrix, 0.35, 0.77, hero.z, 1.0, 7.0, 0);
    //     drawSphere(projectionMatrix, sun.x, sun.y, hero.z, 0.50, 0.50, false);

    //     drawNoteStem(projectionMatrix, 1.32, 1.77, hero.z, 1.0, 7.8, 1.7);
        
    //     drawNoteStem(projectionMatrix, sun.x + 2.35, 0.75 + 0.35, hero.z, 1.0, 5.0, 0);
    //     drawSphere(projectionMatrix, sun.x + 2.0, sun.y + 0.35, hero.z, 0.50, 0.50, false);
    // }

    // if (type == 0) {
    //     drawNoteStem(projectionMatrix, 0.25, 0.60, hero.z, 0.5, 4.5, 0);
    //     drawSphere(projectionMatrix, sun.x, sun.y, hero.z, 0.25, 0.25, false);
    // } else {
    //     drawNoteStem(projectionMatrix, 0.25, 0.60, hero.z, 0.5, 4.5, 0);
    //     drawSphere(projectionMatrix, sun.x, sun.y, hero.z, 0.25, 0.25, false);

    //     drawNoteStem(projectionMatrix, 0.80, 1.40, hero.z, 0.5, 4.0, 1.7);
        
    //     drawNoteStem(projectionMatrix, sun.x + 1.40, 0.60 + 0.35, hero.z, 0.5, 4.0, 0);
    //     drawSphere(projectionMatrix, sun.x + 1.2, sun.y + 0.35, hero.z, 0.25, 0.25, false);
    // }
}

function drawNoteStem(projectionMatrix, x, y, z, width, height, rotation, colorIdx) {
    const modelViewMatrix = mat4.create();
  
    // Now move the drawing position a bit to where we want to
    // start drawing the square.
    mat4.translate(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to translate
      [x, y, z]
    ); // amount to translate

    mat4.rotate(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to rotate
      rotation, // amount to rotate in radians
      [0, 0, 1]
    ); // axis to rotate around (Z)

    mat4.scale(modelViewMatrix, modelViewMatrix, [width, height, 1]);

    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    setPositionAttribute(gl, buffers.noteStem.position, programInfo);

    setColorAttribute(gl, buffers.noteStem.colors.list[colorIdx], programInfo);
    

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.noteStem.indices);

    // setTextureAttribute(gl, buffers.sphere.textureCoord, programInfo);
    setNormalAttribute(gl, buffers.noteStem.normal, programInfo);

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

    gl.uniform1i(programInfo.uniformLocations.hasSampler, 0);

    {
        const vertexCount = buffers.noteStem.vertexCount;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}

function resetTrailNote(i, j) {
    let adjX = Math.floor(Math.random() * 10);
    let color = Math.floor(Math.random() * 3);
    notes[i].heads[j].x = notes[i].heads[j].ox - adjX;
    notes[i].heads[j].y = notes[i].heads[j].oy;

    notes[i].stems[j].x = notes[i].heads[j].ox - adjX;
    notes[i].stems[j].y = notes[i].heads[j].oy;

    notes[i].colorIdx = color;

    if (notes[i].beam) {
        notes[i].beam.x = notes[i].beam.ox - adjX;
        notes[i].beam.y = notes[i].beam.oy;
    }
}


function drawNotes(projectionMatrix) {
    if (delta < 1) {
        let angle = 1.5;
        let range = 12.25;
        for (let i = 0; i < notes.length; ++i) {
            for (let j = 0; j < notes[i].heads.length; ++j) {
                if (notes[i].pattern == noteInfo.patterns.DROP) {
                    notes[i].heads[j].x += notes[i].vx * delta;
                    notes[i].heads[j].y += notes[i].vy * delta;

                    if (notes[i].heads[j].y <= groundLimit) {
                        morphNote(i);
                    }
                } else if (notes[i].pattern == noteInfo.patterns.TRAIL) {
                    notes[i].angle += angle * delta;
                    notes[i].heads[j].x += notes[i].vx * delta;
                    notes[i].heads[j].y = notes[i].heads[j].oy + Math.sin(notes[i].angle) * range;

                    if (notes[i].heads[j].x > maxRight + 10.0) {
                        resetTrailNote(i, j);
                    }
                }
    
                drawSphere(projectionMatrix, 
                    notes[i].heads[j].x, notes[i].heads[j].y, notes[i].heads[j].z, 
                    notes[i].heads[j].sw, notes[i].heads[j].sh, 
                    notes[i].colorIdx,
                    false // don't use texture if false
                );
            }
    
            for (let j = 0; j < notes[i].stems.length; ++j) {
                if (notes[i].pattern == noteInfo.patterns.DROP) {
                    notes[i].stems[j].x += notes[i].vx * delta;
                    notes[i].stems[j].y += notes[i].vy * delta;
                } else if (notes[i].pattern == noteInfo.patterns.TRAIL) {
                    notes[i].angle += angle * delta;
                    notes[i].stems[j].x += notes[i].vx * delta;
                    notes[i].stems[j].y = notes[i].stems[j].oy + Math.sin(notes[i].angle) * range;
                }

                drawNoteStem(projectionMatrix, 
                    notes[i].stems[j].x, notes[i].stems[j].y, notes[i].stems[j].z, 
                    notes[i].stems[j].sw, notes[i].stems[j].sh, 
                    0,
                    notes[i].colorIdx,
                );
            }
    
            if (notes[i].beam) {
                if (notes[i].pattern == noteInfo.patterns.DROP) {
                    notes[i].beam.x += notes[i].vx * delta;
                    notes[i].beam.y += notes[i].vy * delta;
                } else if (notes[i].pattern == noteInfo.patterns.TRAIL) {
                    notes[i].angle += angle * delta;
                    notes[i].beam.x += notes[i].vx * delta;
                    notes[i].beam.y = notes[i].beam.oy + Math.sin(notes[i].angle) * range;
                }

                drawNoteStem(projectionMatrix, 
                    notes[i].beam.x, notes[i].beam.y, notes[i].beam.z, 
                    notes[i].beam.sw, notes[i].beam.sh, 
                    notes[i].beam.rotation,
                    notes[i].colorIdx,
                );
            }
        }
    }
    
}

function addNote(x, y, scale, type, colorIdx, pattern, vx, vy) {
    let note = {
        heads: [
            {
                x: x + noteInfo[noteInfo.SINGLE].head.x * scale,
                y: y + noteInfo[noteInfo.SINGLE].head.y * scale,
                ox: x + noteInfo[noteInfo.SINGLE].head.x * scale,
                oy: y + noteInfo[noteInfo.SINGLE].head.y * scale,
                z: noteInfo.z,
                sw: noteInfo[noteInfo.SINGLE].head.sw * scale,
                sh: noteInfo[noteInfo.SINGLE].head.sh * scale
            },
        ],
        stems: [
            {
                x: x + noteInfo[noteInfo.SINGLE].stem.x * scale,
                y: y + noteInfo[noteInfo.SINGLE].stem.y * scale,
                ox: x + noteInfo[noteInfo.SINGLE].stem.x * scale,
                oy: y + noteInfo[noteInfo.SINGLE].stem.y * scale,
                z: noteInfo.z,
                sw: noteInfo[noteInfo.SINGLE].stem.sw * scale,
                sh: noteInfo[noteInfo.SINGLE].stem.sh * scale
            },
        ],
        colorIdx: colorIdx,
        pattern: pattern,
        vx: vx,
        vy: vy,
        angle: 0,
        direction: 1,
    };

    if (type == noteInfo.DOUBLE) {
        note.heads.push(
            {
                x: x + noteInfo[noteInfo.DOUBLE].head.x * scale,
                y: y + noteInfo[noteInfo.DOUBLE].head.y * scale,
                ox: x + noteInfo[noteInfo.DOUBLE].head.x * scale,
                oy: y + noteInfo[noteInfo.DOUBLE].head.y * scale,
                z: noteInfo.z,
                sw: noteInfo[noteInfo.DOUBLE].head.sw * scale,
                sh: noteInfo[noteInfo.DOUBLE].head.sh * scale
            },
        );

        note.stems.push(
            {
                x: x + noteInfo[noteInfo.DOUBLE].stem.x * scale,
                y: y + noteInfo[noteInfo.DOUBLE].stem.y * scale,
                ox: x + noteInfo[noteInfo.DOUBLE].stem.x * scale,
                oy: y + noteInfo[noteInfo.DOUBLE].stem.y * scale,
                z: noteInfo.z,
                sw: noteInfo[noteInfo.DOUBLE].stem.sw * scale,
                sh: noteInfo[noteInfo.DOUBLE].stem.sh * scale
            },
        );
        note.beam = {
            x: x + noteInfo[noteInfo.DOUBLE].beam.x * scale,
            y: y + noteInfo[noteInfo.DOUBLE].beam.y * scale,
            ox: x + noteInfo[noteInfo.DOUBLE].beam.x * scale,
            oy: y + noteInfo[noteInfo.DOUBLE].beam.y * scale,
            z: noteInfo.z,
            sw: noteInfo[noteInfo.DOUBLE].beam.sw * scale,
            sh: noteInfo[noteInfo.DOUBLE].beam.sh * scale,
            rotation: noteInfo[noteInfo.DOUBLE].beam.rotation,
        }
    }

    notes.push(note);
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

function setTextureAttribute(gl, textureCoord, programInfo) {
    const num = 2; // every coordinate composed of 2 values
    const type = gl.FLOAT; // the data in the buffer is 32-bit float
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set to the next
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoord);
    gl.vertexAttribPointer(
      programInfo.attribLocations.textureCoord,
      num,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel
    );
  
    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        image
      );
  
      // WebGL1 has different requirements for power of 2 images
      // vs non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    };
    image.src = url;
  
    return texture;
  }
  
  function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }

//////

// physics
function rectCircleCollision(circle, rect){
    var distX = Math.abs(circle.x - rect.x - rect.w / 2);
    var distY = Math.abs(circle.y - rect.y - rect.h / 2);

    if (distX > (rect.w / 2 + circle.r)) { return false; }
    if (distY > (rect.h / 2 + circle.r)) { return false; }

    if (distX <= (rect.w / 2)) { return true; } 
    if (distY <= (rect.h / 2)) { return true; }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r));
}

function checkHeroCircleCollision(circle) {
    return rectCircleCollision(circle, {
        x: hero.x,
        y: hero.y,
        w: 1.0,
        h: 1.0,
    })
}

/////////

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
        
        // if (checkHeroCircleCollision(sun)) {
        //     console.log('collided')
        // }
        if (notes.length >= 20) {
            let r = Math.ceil(timer / 0.2);
            // console.log('test', r, timer)
            if (trailCount < maxTrail) {
                if (r > trailCount) {
                    let vel = getRandomVelocity(2);
                    let color = Math.floor(Math.random() * 3);
                    addNote(minLeft - 3.0 * trailCount, 2.0 * trailCount, 1.0, noteInfo.SINGLE, color, noteInfo.patterns.TRAIL, 5.0, vel.y);
                    trailCount++;
                    // addNote(minLeft - 3.0, 2.0, 1.0, noteInfo.SINGLE, 1, noteInfo.patterns.TRAIL, 5.0, vel.y);
                    // addNote(minLeft - 3.0 * 2, 2.0 * 2, 1.0, noteInfo.SINGLE, 1, noteInfo.patterns.TRAIL, 5.0, vel.y);
                    // addNote(minLeft - 3.0 * 3, 2.0 * 3, 1.0, noteInfo.SINGLE, 1, noteInfo.patterns.TRAIL, 5.0, vel.y);
                    // addNote(minLeft - 3.0 * 4, 2.0 * 4, 1.0, noteInfo.SINGLE, 1, noteInfo.patterns.TRAIL, 5.0, vel.y);
                }
            }

            timer += 1 * delta;
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
