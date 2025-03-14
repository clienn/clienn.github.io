function initBuffers(gl) {
    const squareBuffer = initSquareBuffer(gl, [[1.0, 0.0, 0.0, 1.0], [0.0, 1.0, 0.0, 1.0], [0.0, 0.0, 1.0, 1.0]]); // rgb
    
    return {
        piano: {
            position: pianoPositionBuffer(gl),
            indices: pianoIndexBuffer(gl),
            colors: {
                white: whiteKeysColorBuffer(gl),
                black: blackKeysColorBuffer(gl)
            },
            normal: pianoNormalBuffer(gl)
        },
        square: {
            positions: squareBuffer.positions,
            indices: squareBuffer.indices,
            vertexCount: squareBuffer.vertexCount,
            colors: squareBuffer.colors,
            normal: squareBuffer.normals,
            textureCoord: squareBuffer.texcoords,
        },
    };
}

function addColorsToNoteBuffers(stemBuffer, headBuffer, r, g, b, a) {
    stemBuffer.colorList.push(initColorBuffer(gl,  getNoteStemColor(r, g, b, a)));
    headBuffer.colorList.push(addSphereColor(headBuffer.positionsCount, r, g, b, a)); // red
}

// piano buffer
function pianoPositionBuffer(gl) {
    const positions = [
        // Front face
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.5, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.5,

        // Bottom face
        -1.0, -1.0, -1.5, 1.0, -1.0, -1.5, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.5, 1.0, 1.0, -1.5, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.5, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.5,
    ];

    return initPositionBuffer(gl, positions);
}

function pianoIndexBuffer(gl) {
    const indices = [
        0,
        1,
        2,
        0,
        2,
        3, // front
        4,
        5,
        6,
        4,
        6,
        7, // back
        8,
        9,
        10,
        8,
        10,
        11, // top
        12,
        13,
        14,
        12,
        14,
        15, // bottom
        16,
        17,
        18,
        16,
        18,
        19, // right
        20,
        21,
        22,
        20,
        22,
        23, // left
    ];

    return initIndexBuffer(gl, indices);
}

function whiteKeysColorBuffer(gl) {
    const faceColors = [
        [1.0, 1.0, 1.0, 1.0], // Front face: white
        [1.0, 1.0, 1.0, 1.0], // Back face: red
        [1.0, 1.0, 1.0, 1.0], // Top face: green
        [1.0, 1.0, 1.0, 1.0], // Bottom face: blue
        [1.0, 1.0, 1.0, 1.0], // Right face: yellow
        [1.0, 1.0, 1.0, 1.0], // Left face: purple
    ];

    return initColorBuffer(gl, faceColors);
}

function blackKeysColorBuffer(gl) {
    const faceColors = [
        [0.0, 0.0, 0.0, 1.0], // Front face: white
        [0.0, 0.0, 0.0, 1.0], // Back face: red
        [0.0, 0.0, 0.0, 1.0], // Top face: green
        [0.0, 0.0, 0.0, 1.0], // Bottom face: blue
        [0.0, 0.0, 0.0, 1.0], // Right face: yellow
        [0.0, 0.0, 0.0, 1.0], // Left face: purple
    ];
    
    return initColorBuffer(gl, faceColors);
}

function pianoNormalBuffer(gl) {
    const vertexNormals = [
        // Front
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

        // Back
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

        // Top
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

        // Bottom
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

        // Right
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

        // Left
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
    ];

    return initNormalBuffer(gl, vertexNormals);
}
//////////

// square buffer
function initSquareBuffer(gl, colors) {
    const positions = [-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0]; // Front face
    const indices = [0, 1, 2, 0, 2, 3]; // front
    const normals = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0]; // Front
    // const colors = [[1.0, 0.0, 0.0, 1.0]]; // Front face: white
    const texcoords = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];

    let colorList = [];
    for (let k in colors) {
        colorList.push(initColorBuffer(gl, [colors[k]]));
    }
    
    return {
        positions: initPositionBuffer(gl, positions),
        indices: initIndexBuffer(gl, indices),
        colors: colorList,
        normals: initNormalBuffer(gl, normals),
        vertexCount: indices.length,
        texcoords: initTextureBuffer(gl, texcoords)
    }
}


// initializations
function initPositionBuffer(gl, positions) {
    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
}

function initIndexBuffer(gl, indices) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // Now send the element array to GL

    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW
    );

    return indexBuffer;
}

function initColorBuffer(gl, faceColors) {
    // Convert the array of colors into a table for all the vertices.
    var colors = [];
    for (var j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];
        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c);
    }

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    return colorBuffer;
}

function initNormalBuffer(gl, vertexNormals) {
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertexNormals),
        gl.STATIC_DRAW
    );

    return normalBuffer;
}

function initTextureBuffer(gl, textureCoordinates) {
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(textureCoordinates),
      gl.STATIC_DRAW,
    );
  
    return textureCoordBuffer;
  }