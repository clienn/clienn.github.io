const fragCode = `#version 300 es
    // #pragma vscode_glsllint_stage: frag

    precision highp float;

    uniform vec2 uResolution;
    uniform vec3 uMouse;
    uniform float iTime;

    in vec2 uv;

    out vec4 fragColor;

    void main() {
        vec2 uv0 = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;
        vec3 col = vec3(1.0, 0.5, 0.2);

        float d = length(uv0) - 0.2;

        // d = smoothstep(0.0, 0.1, d);
        d = pow(0.01 / d, 1.2);
        // d = d * 0.02;

        col *= d;

        fragColor = vec4(col, 1.0);
        
    }
`;
