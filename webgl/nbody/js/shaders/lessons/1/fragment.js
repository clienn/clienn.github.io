const fragmentShader = `#version 300 es
    // #pragma vscode_glsllint_stage: frag

    precision highp float;

    out vec4 fragColor;

    void main() {
        fragColor = vec4(1.0, 0.0, 0.0, 1.0); // Background color
    }
`;