const canvas = document.getElementById('game-surface');
const gl = canvas.getContext("webgl2");

var last = 0;
var delta = 0;

var G = 1;

var scaleX = 1;
var scaleY = 1;

let total = 20;
let radius = 200;
let sqT = 0;
let sqFlag = 0;
let sqSpeed = 1.25;

const mapNumRange = (num, inMin, inMax, outMin, outMax) =>
  ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

const clampNumber = (num, a, b) =>
  Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

var vertex_buffer = null;
var vertex_square_buffer = null;
var Index_Buffer = null;
var textureBuffer = null;
var shaderProgram = null;
var image = null;
var indices = [];

var rotation = 0;

function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    canvas.style.display = 'block';

    scaleX = w / 1792;
    scaleY = h / 922;

    G *= scaleX;

    init();

    controls();
    
    // gameCycle();
}

function controls() {
    let mdown = false;
    canvas.addEventListener('mousedown', (e) => {
        if (!mdown) {
            mdown = true;
        }
    });

    canvas.addEventListener('mouseup', (e) => {
        if (mdown) {
            sqFlag = !sqFlag;
            mdown = false;
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

    /*======== Defining and storing the geometry ===========*/

    var vertices = [
        -0.5,0.5,0.0,
        -0.5,-0.5,0.0,
        0.5,-0.5,0.0, 
        // 0.5,0.5,0.0, 
    ];
    
    indices = [0, 1, 2];

     
     // Create an empty buffer object to store vertex buffer
     vertex_buffer = gl.createBuffer();

     // Bind appropriate array buffer to it
     gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
     
     // Pass the vertex data to the buffer
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

     // Unbind the buffer
     gl.bindBuffer(gl.ARRAY_BUFFER, null);



     // Create an empty buffer object to store Index buffer
     Index_Buffer = gl.createBuffer();

     // Bind appropriate array buffer to it
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

     // Pass the vertex data to the buffer
     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
     
     // Unbind the buffer
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

     /*================ Shaders ====================*/
     
     // Vertex shader source code

     // Create a vertex shader object
     var vertShader = gl.createShader(gl.VERTEX_SHADER);

     // Attach vertex shader source code
     gl.shaderSource(vertShader, vertexShader);

     // Compile the vertex shader
     gl.compileShader(vertShader);

     //fragment shader source code

     // Create fragment shader object
     var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

     // Attach fragment shader source code
     gl.shaderSource(fragShader, fragmentShader); 
     
     // Compile the fragmentt shader
     gl.compileShader(fragShader);

     // Create a shader program object to store
     // the combined shader program
     shaderProgram = gl.createProgram();

     // Attach a vertex shader
     gl.attachShader(shaderProgram, vertShader);

     // Attach a fragment shader
     gl.attachShader(shaderProgram, fragShader);

     // Link both the programs
     gl.linkProgram(shaderProgram);

     // Use the combined shader program object
     gl.useProgram(shaderProgram);

    var compiled = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
    console.log('Shader compiled successfully: ' + compiled);
    var compilationLog = gl.getShaderInfoLog(vertShader);
    console.log('Shader compiler log: ' + compilationLog);
     

     /*======= Associating shaders to buffer objects =======*/

     // Bind vertex buffer object
     gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

     // Bind index buffer object
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
     
     // Get the attribute location
     var coord = gl.getAttribLocation(shaderProgram, "coordinates");

     // Point an attribute to the currently bound VBO
     gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0); 
     
     // Enable the attribute
     gl.enableVertexAttribArray(0);

     /*=========Drawing the triangle===========*/

     // Clear the canvas
     gl.clearColor(0.5, 0.5, 0.5, 0.9);

     // Enable the depth test
     gl.enable(gl.DEPTH_TEST);

     // Clear the color buffer bit
     gl.clear(gl.COLOR_BUFFER_BIT);

     // Set the view port
     gl.viewport(0,0,canvas.width,canvas.height);

     
    //  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
     gl.drawElements(gl.POINTS, indices.length, gl.UNSIGNED_SHORT,0);

}

function scene() {
   
}

function update() {
    
}


function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    // scene();
    // update();

    requestAnimationFrame(gameCycle);
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);
