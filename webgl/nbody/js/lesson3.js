const canvas = document.getElementById('game-surface');
const gl = canvas.getContext("webgl2");

var last = 0;
var delta = 0;

var G = 1;

var scaleX = 1;
var scaleY = 1;

let total = 100;
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

    // var vertices = [
    //     -0.5,0.5,0.0,
    //     -0.5,-0.5,0.0,
    //     0.5,-0.5,0.0, 
    //  ];
    var vertices = [];
    var vertices2 = [];
     
    // var indices = [0, 1, 20, 21, 1, 20];
    // var indices = [0, 1, 2];
    // var indices = [];
    var textureBufferData = [];
    

    // var coords = [];

    let aspectRatio = 1 - gl.canvas.width / gl.canvas.height;
    let tmp = 1 - aspectRatio;

     for (let i = 0; i <= total; ++i) {
        let lat = mapNumRange(i, 0, total, 0, Math.PI);
        for (let j = 0; j <= total; ++j) {
            let lon = mapNumRange(j, 0, total, 0, Math.PI * 2);
            let x = radius * Math.sin(lat) * Math.cos(lon);
            let y = radius * Math.sin(lat) * Math.sin(lon);
            let z = radius * Math.cos(lat);

            vertices.push(x, y, z);
            textureBufferData.push(j / total, 1-i / total);

            x = mapNumRange(j, 0, total, -tmp, tmp);
            y = mapNumRange(i, 0, total, -aspectRatio, aspectRatio);
            z = 0;
            vertices2.push(x* 600, y* 600, z);
            
        }
     }

    //  vertices2[0] = -0.5;
    //  vertices2[1] = 0.5;
    //  vertices2[2] = 0.0;
    //  vertices2[3] = -0.5;
    //  vertices2[4] = -0.5;
    //  vertices2[5] = 0.0;
    //  vertices2[6] = 0.5;
    //  vertices2[7] = -0.5;
    //  vertices2[8] = 0.0;

     

    // set indices
    
    for (let i = 0; i < total; ++i) {
        let level = i * total;
        for (let j = 0; j < total + 1; ++j) {
            let pos = level + j;
            let pos2 = (i + 1) * total + j

            indices.push(pos, pos + 1, pos2, pos2 + 1, pos + 1, pos2);
            // indices.push(pos, pos2, pos + 1, pos2 + 1, pos + 1, pos2);

            
        }
    }

    // console.log(textureBufferData.length, vertices.length, indices.length)
    // console.log(vertices)
    


    //  for (let i = 0; i < indices.length; ++i) {
    //     max = Math.max(indices[i], max);
    //  }

    //  console.log(max, indices.length)

     
     // Create an empty buffer object to store vertex buffer
     vertex_buffer = gl.createBuffer();

     // Bind appropriate array buffer to it
     gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
     
     // Pass the vertex data to the buffer
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

     // Unbind the buffer
     gl.bindBuffer(gl.ARRAY_BUFFER, null);

     

     vertex_square_buffer = gl.createBuffer();

     // Bind appropriate array buffer to it
     gl.bindBuffer(gl.ARRAY_BUFFER, vertex_square_buffer);
     
     // Pass the vertex data to the buffer
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices2), gl.STATIC_DRAW);

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

    
     

     textureBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureBufferData), gl.STATIC_DRAW);
     gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
     gl.enableVertexAttribArray(1);

    //  const pixels = new Uint8Array([
    //     255,255,255,		230,25,75,			60,180,75,			255,225,25,
    //     67,99,216,			245,130,49,			145,30,180,			70,240,240,
    //     240,50,230,			188,246,12,			250,190,190,		0,128,128,
    //     230,190,255,		154,99,36,			255,250,200,		0,0,0,
    // ]);
    
    // const pixelBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, pixelBuffer);
    // gl.bufferData(gl.PIXEL_UNPACK_BUFFER, pixels, gl.STATIC_DRAW);


     /*=========Drawing the triangle===========*/

     // Clear the canvas
     gl.clearColor(0.5, 0.5, 0.5, 0.9);

     // Enable the depth test
     gl.enable(gl.DEPTH_TEST);

     // Clear the color buffer bit
     gl.clear(gl.COLOR_BUFFER_BIT);

     // Set the view port
     gl.viewport(0,0,canvas.width,canvas.height);

     const modelLoc = gl.getUniformLocation(shaderProgram, 'uModel');
     const viewLoc = gl.getUniformLocation(shaderProgram, 'uView');
     const projectionLoc = gl.getUniformLocation(shaderProgram, 'uProjection');

     const model = mat4.create();
     const view = mat4.create();
     const projection = mat4.create();

     mat4.rotate(
        model, // destination matrix
        model, // matrix to rotate
        Math.PI * 0.5, // amount to rotate in radians
       [1, 0, 0]
    );

    // mat4.rotate(
    //     model, // destination matrix
    //     model, // matrix to rotate
    //     Math.PI / 2, // amount to rotate in radians
    //    [1, 0, 0]
    // );


    //  mat4.lookAt(view, [100, 100, 300], [0, 0, 0], [0, 1, 0]);
     mat4.lookAt(view, [0, 0, 300], [0, 0, 0], [0, 1, 0]);

     mat4.perspective(projection, Math.PI / 1.5, gl.canvas.width / gl.canvas.height, 0.1, 1000.0);

     gl.uniformMatrix4fv(modelLoc, false, model);
     gl.uniformMatrix4fv(viewLoc, false, view);
     gl.uniformMatrix4fv(projectionLoc, false, projection);
    
    const loadImage = () => new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => { 
            resolve(image) 
        });
        image.src = './assets/earth_high.jpg';
        // image.src = './assets/earth.jpg';
        // image.src = './assets/grid.jpeg';
    }).catch((err) => {
        console.error(err);
    });



    const run = async () => {
        image = await loadImage();

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        const textureSlot = 1;
        gl.activeTexture(gl.TEXTURE0 + textureSlot);
        gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uSampler'), textureSlot);


        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 8192, 4096, 0, gl.RGB, gl.UNSIGNED_BYTE, image);

        gl.generateMipmap(gl.TEXTURE_2D);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        gameCycle();

        // const textureSlot = 1;
        // gl.activeTexture(gl.TEXTURE0 + textureSlot);
        // gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uSampler'), textureSlot);


        // const texture = gl.createTexture();
        // gl.bindTexture(gl.TEXTURE_2D, texture);
        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 8192, 4096, 0, gl.RGB, gl.UNSIGNED_BYTE, image);

        // gl.generateMipmap(gl.TEXTURE_2D);

		// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // //  console.log(vertices)

        // // Draw the triangle
        // gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
        // // gl.drawArrays(gl.TRIANGLES, 0, 3);
        // // gl.drawArrays(gl.POINTS, 0, total * total);
    }

    
    run();

}

function scene() {
    // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Bind index buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0); 
    
    // Enable the attribute
    gl.enableVertexAttribArray(0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_square_buffer);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(2);

    const modelLoc = gl.getUniformLocation(shaderProgram, 'uModel');
    const viewLoc = gl.getUniformLocation(shaderProgram, 'uView');
    const projectionLoc = gl.getUniformLocation(shaderProgram, 'uProjection');
    const timeLoc = gl.getUniformLocation(shaderProgram, 'uTime');


    const model = mat4.create();
    const view = mat4.create();
    const projection = mat4.create();

    var lookX = 0.0;

    mat4.lookAt(view, [0, 0, 300], [0, 0, 0], [0, 1, 0]);

    mat4.perspective(projection, Math.PI / 1.5, gl.canvas.width / gl.canvas.height, 0.1, 1000.0);

    mat4.translate(
        model, // destination matrix
        model, // matrix to translate
        [lookX, 0, 0]
    ); // amount to translate

    if (sqT == 0 && sqFlag) {
        mat4.rotate(
            model, // destination matrix
            model, // matrix to rotate
            rotation, // amount to rotate in radians
            // Math.PI * 1.85, // amount to rotate in radians
           [0, 1, 0]
         );
     
         mat4.rotate(
             model, // destination matrix
             model, // matrix to rotate
             -Math.PI / 2, // amount to rotate in radians
            [1, 0, 0]
          );
    }
    



   //  mat4.lookAt(view, [100, 100, 300], [0, 0, 0], [0, 1, 0]);
    // mat4.lookAt(view, [0, 0, 0.145], [0, 0, 0], [0, 1, 0]);
    

    gl.uniformMatrix4fv(modelLoc, false, model);
    gl.uniformMatrix4fv(viewLoc, false, view);
    gl.uniformMatrix4fv(projectionLoc, false, projection);
    gl.uniform1f(timeLoc, sqT);

    // console.log(sqT)
    //  console.log(vertices)

    // Draw the triangle
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
}

function update() {
    if (delta < 1) {
        rotation += 0.1 * delta;

        if (sqFlag) {
            if (sqT > 0.0) {
                sqT -= sqSpeed * delta;
                if (sqT <= 0.0) sqT = 0.0;
            }
        } else {
            if (sqT < 1.0) {
                sqT += sqSpeed * delta;
                if (sqT >= 1.0) sqT = 1.0;
            }
        }
        
        
    }
    
}


function gameCycle() {
    let now = Date.now();
    delta = (now - last) / 1000;
    last = now;

    // Set clear color to black, fully opaque
    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    // gl.clear(gl.COLOR_BUFFER_BIT);

    scene();
    update();

    requestAnimationFrame(gameCycle);
}

// main(document.documentElement.clientWidth, document.documentElement.clientHeight);
