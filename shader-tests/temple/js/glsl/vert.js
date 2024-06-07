const vertCode = `#version 300 es
    #pragma vscode_glsllint_stage: vert

    layout(location=0) in vec4 aVertexPosition;
    layout(location=1) in vec2 aTexcoord;

    out vec2 uv;
    out vec2 iResolution;

    uniform vec2 uResolution;

    void main()
    {
        uv = aTexcoord;
        iResolution = uResolution;
        vec4 position = aVertexPosition;
        position.xy = position.xy * 2.0 - 1.0;
        gl_Position = position;;
    }
`;

// attribute vec4 aVertexPosition;
    // attribute vec4 aTexcoord;

    // uniform highp vec2 iResolution;

    // varying highp vec4 uv;
    // varying highp vec2 res;

    // void main(void) {
    //     uv = aTexcoord;
    //     res = iResolution;
    //     vec4 position = aVertexPosition;
    //     position.xy = position.xy * 2.0 - 1.0;
    //     gl_Position = position;
    // }