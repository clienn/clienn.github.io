var vertexShader = `#version 300 es
    // #pragma vscode_glsllint_stage: vert

    layout(location=0) in vec3 coordinates;
    layout(location=1) in vec2 texcoord;
    layout(location=2) in vec3 squareCoordinates;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    uniform float uTime;
    uniform float uCTime;
    uniform vec3 uTranslation;

    out vec2 vTexCoord;
    out float vBrightness;

    vec3 lightDirection = normalize(vec3(-0.3, 0.3, 0.0));

    void main()
    {
        vTexCoord = texcoord;

        // vBrightness = max(dot(lightDirection, mat3(uModel) * coordinates), 0.0);

        // float x = mix(coordinates.x, squareCoordinates.x, uTime);
        // float y = mix(coordinates.y, squareCoordinates.y, uTime);
        // float z = mix(coordinates.z, squareCoordinates.z, uTime);

        // gl_Position = uProjection * uView * uModel * vec4(x, y, z, 1.0);
        
        // gl_Position = uProjection * uView * uModel * vec4(coordinates, 1.0);
        // gl_PointSize = 5.0;


        // float angleZ = 45.0 * uCTime;
        float angleX = 90.0;
        float angleY = 45.0 * uCTime;
        // Compute the rotation matrix for the Z-axis
        // mat4 rotationMatrixZ = mat4(
        //     cos(angleZ), -sin(angleZ), 0.0, 0.0,
        //     sin(angleZ), cos(angleZ),  0.0, 0.0,
        //     0.0,        0.0,         1.0, 0.0,
        //     0.0,        0.0,         0.0, 1.0
        // );

        // Compute the rotation matrix for the X-axis
        mat4 rotationMatrixX = mat4(
            1.0,  0.0,          0.0,         0.0,
            0.0,  cos(angleX),   -sin(angleX), 0.0,
            0.0,  sin(angleX),   cos(angleX),  0.0,
            0.0,  0.0,          0.0,         1.0
        );

        // Compute the rotation matrix for the Y-axis
        mat4 rotationMatrixY = mat4(
            cos(angleY), 0.0, sin(angleY), 0.0,
            0.0,         1.0, 0.0,         0.0,
            -sin(angleY), 0.0, cos(angleY), 0.0,
            0.0,         0.0, 0.0,         1.0
        );

        mat4 rotationMatrix = rotationMatrixY * rotationMatrixX;

        vBrightness = max(dot(lightDirection, mat3(uModel * rotationMatrix) * coordinates), 0.0);


        // Apply the rotation matrix to the vertex position
        vec4 rotatedPosition = rotationMatrix * vec4(coordinates, 1.0);

        // gl_Position = uProjection * uView * uModel * rotatedPosition;
        gl_Position = uProjection * uView * uModel * vec4(rotatedPosition.xyz + uTranslation, 1.0);
    }
`;
