var vertexShader = `#version 300 es
    // #pragma vscode_glsllint_stage: vert

    layout(location=0) in vec3 coordinates;
    layout(location=1) in vec2 texcoord;

    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;

    out vec2 vTexCoord;

    void main()
    {
        vTexCoord = texcoord;
        gl_Position = uProjection * uView * uModel * vec4(coordinates, 1.0);
        gl_PointSize = 5.0;
    }
`;
