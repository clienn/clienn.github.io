const canvas = document.getElementById('game-surface');
var gl = null;
// const gl = canvas.getContext("webgl2");

var last = 0;
var delta = 0;

var G = 1;

var scaleX = 1;
var scaleY = 1;

var programInfo = null;

var vertexBuffer = null;
var texcoordBuffer = null;
var indexBuffer = null;

var vertices = [-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0];
var texcoords = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
var indices = [0, 1, 2, 0, 2, 3];

var iTime = 0;

var mousePos = {
    x: 0.0,
    y: 0.0,
    z: -1.0
};

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    canvas.style.display = 'block';

    gl = canvas.getContext("webgl2");

    // Set the view port
    gl.viewport(0,0,canvas.width, canvas.height);

    scaleX = w / 1792;
    scaleY = h / 922;

    G *= scaleX;

    init();
    controls();

    mousePos.x = w / 2;
    mousePos.y = h / 2;
    
    gameCycle();
}

function controls() {
    let mDown = false;

    document.addEventListener('mousedown', (e) => {
        if (!mDown) {
            mDown = true;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (mDown) {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
            mousePos.z = 0.0;
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (mDown) {
            mDown = false;
            mousePos.z = -1.0;
        }
        
    });
}

function init() {
    // Only continue if WebGL is available and working
    if (gl === null) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
        );
        return;
    }

    // gl.viewport(0,0,canvas.width,canvas.height);

    /*================ Shaders ====================*/
        
    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);

    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);

    // Compile the vertex shader
    gl.compileShader(vertShader);

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

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log(gl.getShaderInfoLog(vertShader));
        console.log(gl.getShaderInfoLog(fragShader));
    }

    // Use the combined shader program object

    programInfo = {
        program: shaderProgram,
        attribLocations: {
        //   vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        //   texcoord: gl.getAttribLocation(shaderProgram, "aTexcoord"),
        },
        uniformLocations: {
            resolution: gl.getUniformLocation(shaderProgram, "uResolution"),
            mouse: gl.getUniformLocation(shaderProgram, "uMouse"),
            iTime: gl.getUniformLocation(shaderProgram, "iTime"),
        },
    };

    // Create an empty buffer object to store vertex buffer
    vertexBuffer = gl.createBuffer();

    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    
    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Create an empty buffer object to store Index buffer
    indexBuffer = gl.createBuffer();

    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // Pass the vertex data to the buffer
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    // Unbind the buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // create texture coord buffer
    texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    // // Tell WebGL to use our program when drawing
    // gl.useProgram(programInfo.program);

    
}

function drawSquare() {
    // Use the combined shader program object
    gl.useProgram(programInfo.program);
    gl.uniform1f(
        programInfo.uniformLocations.iTime,
        iTime
    );

    // Set the shader uniforms
    gl.uniform2fv(
        programInfo.uniformLocations.resolution,
        [canvas.width, canvas.height]
    );

    // Set the shader uniforms
    gl.uniform3fv(
        programInfo.uniformLocations.mouse,
        [mousePos.x, mousePos.y, mousePos.z]
    );

    /*======= Associating shaders to buffer objects =======*/

    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Bind index buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0); 

    // // Bind texcoord buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 8, 0); 
    
    // Enable the attribute
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);


    // Draw the triangle
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

function drawScene() {
    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);


    drawSquare();
}

function update() {
    iTime += delta;
}

function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    if (delta < 1) {
        drawScene();
        update();
    }

    

    requestAnimationFrame(gameCycle);
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);
