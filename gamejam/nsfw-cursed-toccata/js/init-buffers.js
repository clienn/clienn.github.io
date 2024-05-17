function initBuffers(gl) {
    const sphereBuffer = initSphere(gl, 20);
    const noteStem = initNoteStem(gl);

    addColorsToNoteBuffers(noteStem, sphereBuffer, 1.0, 0.0, 0.0, 1.0); // red
    addColorsToNoteBuffers(noteStem, sphereBuffer, 0.0, 1.0, 0.0, 1.0); // red
    addColorsToNoteBuffers(noteStem, sphereBuffer, 0.0, 0.0, 1.0, 1.0); // red

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
        hero: {
            position: heroPositionBuffer(gl),
            indices: heroIndexBuffer(gl),
            colors: {
                default: heroColorBuffer(gl),
            },
            normal: heroNormalBuffer(gl)
        },
        sphere: {
            position: sphereBuffer.positions,
            indices: sphereBuffer.triangles,
            vertexCount: sphereBuffer.vertexCount,
            colors: {
                default: sphereBuffer.colors,
                list: sphereBuffer.colorList
            },
            normal: sphereBuffer.normals,
            textureCoord: sphereBuffer.textureCoord,
        },
        noteStem: {
            position: noteStem.positions,
            indices: noteStem.indices,
            vertexCount: noteStem.vertexCount,
            colors: {
                default: noteStem.colors,
                list: noteStem.colorList
            },
            normal: noteStem.normals
        }
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


// hero buffer
function heroPositionBuffer(gl) {
    const positions = [
        // Front face
        //   -0.075, -0.30, 0.0, 0.075, -0.30, 0.0, 0.075, 0.30, 0.0, -0.075, 0.30, 0.0,
        //   -0.30, -0.30, 0.30, 0.15, -0.30, 0.30, 0.15, 0.30, 0.30, -0.30, 0.30, 0.30,
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    ];

    return initPositionBuffer(gl, positions);
}

function heroIndexBuffer(gl) {
    const indices = [
        0,
        1,
        2,
        0,
        2,
        3, // front
    ];

    return initIndexBuffer(gl, indices);
}

function heroColorBuffer(gl) {
    const faceColors = [
        [1.0, 0.0, 0.0, 1.0], // Front face: white
    ];

    return initColorBuffer(gl, faceColors);
}

function heroNormalBuffer(gl) {
    const vertexNormals = [
        // Front
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0
    ];

    return initNormalBuffer(gl, vertexNormals);
}

////////////////

// note stem
function initNoteStem(gl) {
    const positions = [
        -0.15, -0.15, 0.15, 0.15, -0.15, 0.15, 0.15, 0.15, 0.15, -0.15, 0.15, 0.15,

        // Back face
        -0.15, -0.15, -0.15, -0.15, 0.15, -0.15, 0.15, 0.15, -0.15, 0.15, -0.15, -0.15,

        // Top face
        -0.15, 0.15, -0.15, -0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, -0.15,

        // Bottom face
        -0.15, -0.15, -0.15, 0.15, -0.15, -0.15, 0.15, -0.15, 0.15, -0.15, -0.15, 0.15,

        // Right face
        0.15, -0.15, -0.15, 0.15, 0.15, -0.15, 0.15, 0.15, 0.15, 0.15, -0.15, 0.15,

        // Left face
        -0.15, -0.15, -0.15, -0.15, -0.15, 0.15, -0.15, 0.15, 0.15, -0.15, 0.15, -0.15,
    ];

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

    const faceColors = [
        [1.0, 1.0, 1.0, 1.0], // Front face: white
        [1.0, 1.0, 1.0, 1.0], // Back face: red
        [1.0, 1.0, 1.0, 1.0], // Top face: green
        [1.0, 1.0, 1.0, 1.0], // Bottom face: blue
        [1.0, 1.0, 1.0, 1.0], // Right face: yellow
        [1.0, 1.0, 1.0, 1.0], // Left face: purple
    ];

    return {
		positions: initPositionBuffer(gl, positions.flat()),
		colors: initColorBuffer(gl, faceColors),
		indices: initIndexBuffer(gl, indices.flat()),
        vertexCount: indices.flat().length,
		normals: initNormalBuffer(gl, positions.flat()),
        colorList: []
		// textureName: "earth"
	};
}

function getNoteStemColor(r, g, b, a) {
    return [
        [r, g, b, a], // Front face: white
        [r, g, b, a], // Back face: red
        [r, g, b, a], // Top face: green
        [r, g, b, a], // Bottom face: blue
        [r, g, b, a], // Right face: yellow
        [r, g, b, a], // Left face: purple
    ];
}
//////

// sphere
function initSphere(gl, density) {
    const QUARTER_TURN = Math.PI / 2;
    const TWO_PI = Math.PI * 2;
	const radsPerUnit = Math.PI / density;
	const sliceVertCount = density * 2;

	//positions and UVs
	const positions = [];
	const uvs = [];
	let latitude = -Math.PI / 2;
	//latitude
	for(let i = 0; i <= density; i++){
		const v = inverseLerp(-QUARTER_TURN, QUARTER_TURN, -latitude);
		let longitude = 0;
		let vertLength = sliceVertCount + ((i > 0 && i < density) ? 1 : 0); //middle rings need extra vert for end U value
		//longitude
		for (let j = 0; j < vertLength; j++) {
			positions.push(latLngToCartesian([1, latitude, longitude]));
			uvs.push([inverseLerp(0, TWO_PI, longitude), v]);
			longitude += radsPerUnit;
		}
		latitude += radsPerUnit;
	}

	//triangles
	const triangles = [];
	let ringStartP = 0;
	for (let ring = 0; ring < density; ring++){ // start at first ring
		const vertexBump = (ring > 0 ? 1 : 0);
		for (let sliceVert = 0; sliceVert < sliceVertCount; sliceVert++){
			const thisP = ringStartP + sliceVert;
			const nextP = ringStartP + sliceVert + 1;
			const nextRingP = thisP + sliceVertCount + vertexBump;
			const nextRingNextP = nextP + sliceVertCount + vertexBump;

			if(ring === 0){
				triangles.push([thisP, nextRingNextP, nextRingP]);
			}
			if(ring === density - 1){
				triangles.push([thisP, nextP, nextRingP]);
			}
			if(ring > 0 && ring < density - 1 && density > 2){
				triangles.push([thisP, nextRingNextP, nextRingP])
				triangles.push([thisP, nextP, nextRingNextP])
			}
		}
		if(ring === 0) {
			ringStartP += sliceVertCount;
		} else {
			ringStartP += sliceVertCount + 1;
		}
	}

	const colors = [];
	for(let i = 0; i < positions.length; i++){
		colors.push([1, 1, 1, 1]);
	}

    // const positions = [
    //     // Front face
    //     //   -0.075, -0.30, 0.0, 0.075, -0.30, 0.0, 0.075, 0.30, 0.0, -0.075, 0.30, 0.0,
    //     //   -0.30, -0.30, 0.30, 0.15, -0.30, 0.30, 0.15, 0.30, 0.30, -0.30, 0.30, 0.30,
    //     -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    // ];

    // const indices = [
    //     0,
    //     1,
    //     2,
    //     0,
    //     2,
    //     3, // front
    // ];

    // const vertexNormals = [
    //     // Front
    //     0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0
    // ];

    // const faceColors = [
    //     [1.0, 0.0, 0.0, 1.0], // Front face: white
    // ];
    // console.log(indices.length)

    // return {
	// 	positions: initPositionBuffer(gl, positions.flat()),
	// 	colors: initColorBuffer(gl, faceColors),
	// 	triangles: initIndexBuffer(gl, indices.flat()),
    //     vertexCount: indices.length,
	// 	// uvs: uvs.flat(),
	// 	normals: initNormalBuffer(gl, vertexNormals.flat()),
	// 	// textureName: "earth"
	// };

	return {
		positions: initPositionBuffer(gl, positions.flat()),
		colors: initColorBuffer(gl, colors),
		triangles: initIndexBuffer(gl, triangles.flat()),
        vertexCount: triangles.flat().length,
		textureCoord: initTextureBuffer(gl, uvs.flat()),
		normals: initNormalBuffer(gl, positions.flat()),
		colorList: [],
        positionsCount: positions.length
		// textureName: "earth"
	};
}

function addSphereColor(positionsCount, r, g, b, a) {
    const colors = [];
	for(let i = 0; i < positionsCount; i++){
		colors.push([r, g, b, a]);
	}

    return initColorBuffer(gl, colors);
}

function inverseLerp(start, end, value) {
    return (value - start) / (end - start);
}

function cartesianToLatLng([x, y, z]) {
	const radius = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
	return [
		radius,
		(Math.PI / 2) - Math.acos(y / radius),
		normalizeAngle(Math.atan2(x, -z)),
	];
}

function latLngToCartesian([radius, lat, lng]){
	lng = -lng + Math.PI / 2;
	return [
		radius * Math.cos(lat) * Math.cos(lng),
		radius * Math.sin(lat),
		radius * -Math.cos(lat) * Math.sin(lng),
	];
}


/////////


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