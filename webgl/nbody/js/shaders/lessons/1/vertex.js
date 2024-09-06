var vertexShader = `#version 300 es
    // #pragma vscode_glsllint_stage: vert

    layout(location=0) in vec3 coordinates;

    void main()
    {
        gl_Position = vec4(coordinates, 1.0);
        gl_PointSize = 5.0;
    }
`;
