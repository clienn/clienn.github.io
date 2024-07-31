const fragCode = `#version 300 es
    // #pragma vscode_glsllint_stage: frag

    precision highp float;

    uniform vec2 uResolution;
    uniform vec3 uMouse;
    uniform float iTime;

    in vec2 uv;

    out vec4 fragColor;

    void main() {
        // vec2 uv0 = (gl_FragCoord.xy / uResolution.xy) * 2.0 - 1.0;
        vec2 uv0 = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;
        vec2 pos = uv0;
        //**********         Glow        **********
    
        // Equation 1/x gives a hyperbola which is a nice shape to use for drawing glow as 
        // it is intense near 0 followed by a rapid fall off and an eventual slow fade
        float dist = 1.0/length(pos);
        
        //**********        Radius       **********
        
        // Dampen the glow to control the radius
        dist *= 0.1;
        
        //**********       Intensity     **********
        
        // Raising the result to a power allows us to change the glow fade behaviour
        // See https://www.desmos.com/calculator/eecd6kmwy9 for an illustration
        // (Move the slider of m to see different fade rates)
        dist = pow(dist, 0.8);
        
        // Knowing the distance from a fragment to the source of the glow, the above can be 
        // written compactly as: 
        //	float getGlow(float dist, float radius, float intensity){
        //		return pow(radius/dist, intensity);
        //	}
        // The returned value can then be multiplied with a colour to get the final result
        
        // Add colour
        vec3 col = dist * vec3(1.0, 0.5, 0.25);
        
        // Tonemapping. See comment by P_Malin
        col = 1.0 - exp( -col );
        
        // Output to screen
        fragColor = vec4(col, 1.0);
        
    }
`;
