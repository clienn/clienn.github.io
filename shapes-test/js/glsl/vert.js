const vertCode = `#version 300 es
    // #pragma vscode_glsllint_stage: vert

    layout(location=0) in vec4 aVertexPosition;
    layout(location=1) in vec2 aTexcoord;

    out vec2 uv;

    void main()
    {
        uv = aTexcoord;
        gl_Position = aVertexPosition;;
    }
`;
