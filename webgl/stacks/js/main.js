var vertexShaderText = `
    precision mediump float;

    attribute vec2 vertPosition;

    void main()
    {
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
`;

var fragmentShaderText = `
    precision mediump float;

    void main()
    {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

const main = function() {
    const canvas = document.getElementById('game-surface');

    canvas.width = 800;
    canvas.height = 600;

    const gl = canvas.getContext('webgl2');

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

    var triangle = new Float32Array([
        -0.5, -0.5,
        0.0, 0.5,
        0.5, -0.5
    ]);

    var triangleBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, triangle, gl.STATIC_DRAW);

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

    gl.useProgram(program);
    
    //
    // game loop
    //
    let last = new Date();

    const g = -0.04;

    function render() {
        let now = new Date();
        let delta = (now - last) / 1000;
        last = now;

        // gl.clearColor(0.75, 0.85, 0.80, 1.0);
        gl.clearColor(0.09, 0.173, 0.235, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.enable(gl.DEPTH_TEST);
        // gl.enable(gl.CULL_FACE);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
        
        requestAnimationFrame( render );
    }

    requestAnimationFrame( render );
}

