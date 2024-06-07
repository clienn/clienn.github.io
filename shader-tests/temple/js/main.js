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
var textures = [];
var texture = null;
var texture2 = null;
function main(w, h) {
    canvas.width = w;
    canvas.height = h;

    canvas.style.display = 'block';

    gl = canvas.getContext("webgl2");

    scaleX = w / 1792;
    scaleY = h / 922;

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
          iResolution: gl.getUniformLocation(shaderProgram, "uResolution"),
          iTime: gl.getUniformLocation(shaderProgram, "iTime"),
          iChannel0: gl.getUniformLocation(shaderProgram, "iChannel0"),
          iChannel1: gl.getUniformLocation(shaderProgram, "iChannel1"),
          iChannel2: gl.getUniformLocation(shaderProgram, "iChannel2"),
          iChannel3: gl.getUniformLocation(shaderProgram, "iChannel3"),
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

    // Load texture
    texture = loadTexture(gl, "rock.jpg");
    texture2 = loadTexture(gl, "grass.jpg");

    

    // Flip image pixels into the bottom-to-top order that WebGL expects.
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);


    // // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    // Set the shader uniforms
    gl.uniform2fv(
        programInfo.uniformLocations.iResolution,
        [canvas.width, canvas.height]
    );
}

function drawSquare() {
    // Use the combined shader program object
    gl.useProgram(programInfo.program);
    gl.uniform1f(
        programInfo.uniformLocations.iTime,
        iTime
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

    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.uniform1i(programInfo.uniformLocations.iChannel2, 1);

    gl.activeTexture(gl.TEXTURE1);
    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture2);

    // Tell the shader we bound the texture to texture unit 0
    
    gl.uniform1i(programInfo.uniformLocations.iChannel3, 0);


    // Draw the triangle
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

function drawScene() {
    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);

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
      pixel,
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
        image,
      );
  
      // WebGL1 has different requirements for power of 2 images
      // vs. non power of 2 images so check if the image is a
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

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);
