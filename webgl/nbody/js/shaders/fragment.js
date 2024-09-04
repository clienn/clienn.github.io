const fragmentShader = `#version 300 es
    // #pragma vscode_glsllint_stage: frag

    precision highp float;

    in vec2 vTexCoord;
    out vec4 fragColor;

    uniform sampler2D uSampler;

    void main() {
        // fragColor = vec4(1.0, 0.0, 0.0, 1.0); // Background color
        fragColor = texture(uSampler, vTexCoord);
    }
`;