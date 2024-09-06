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

        gl_Position = uProjection * uView * uModel * vec4(coordinates, 1.0);
        gl_PointSize = 5.0;
    }
`;
