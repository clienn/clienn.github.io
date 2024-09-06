const fragmentShader = `#version 300 es
    // #pragma vscode_glsllint_stage: frag

    precision highp float;

    in vec2 vTexCoord;
    out vec4 fragColor;

    in float vBrightness;

    uniform sampler2D uSampler;

    void main() {
        fragColor = vec4(1.0, 0.0, 0.0, 1.0); // Background color
        
        // vec4 color = texture(uSampler, vTexCoord);
        // fragColor = (color * 0.4) + (color * vBrightness * 0.02);
        // fragColor.a = 1.0;

        // fragColor = color;
    }
`;