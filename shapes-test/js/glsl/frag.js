const fragCode = `#version 300 es
    // #pragma vscode_glsllint_stage: frag

    precision highp float;

    uniform vec2 uResolution;
    uniform vec3 uMouse;
    uniform float iTime;

    in vec2 uv;

    out vec4 fragColor;

    mat2 rot2D(float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return mat2(c, -s, s, c);
    }

    float sdSphere(vec3 p, vec3 center, float r) {
        return length(p + center) - r;
    }

    float sdBox(vec3 p, vec3 b) {
        vec3 q = abs(p) - b;
        return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
    }

    float sdPlane( vec3 p, vec3 n, float h ) {
        // n must be normalized
        return dot(p,n) + h;
    }

    float smin(float a, float b, float k) {
        float h = clamp(0.5 + 0.5 * (a - b) / k, 0.0, 1.0);
        return mix(a, b, h) - k * h * (1.0 - h);
    }

    float map(vec3 p) {
        // float box = sdBox(p, vec3(0.5));
        vec3 center = vec3(0.0);
        center = vec3(0.0, 0.25 + sin(iTime) * 0.75, 0.0);

        float sphere = sdSphere(p, center, 0.75);


        float h = 1.0;
        vec3 normal = vec3(0.0, 1.0, 0.0);
        float plane = sdPlane(p, normal, h);
        // float r = min(sphere, plane);
        float r = smin(sphere, plane, 0.5);
        return r;
    }

    vec3 getNormal(vec3 p) {
        vec2 d = vec2(0.01, 0.0);
        float gx = map(p + d.xyy) - map(p - d.xyy);
        float gy = map(p + d.yxy) - map(p - d.yxy);
        float gz = map(p + d.yyx) - map(p - d.yyx);
        vec3 normal = vec3(gx, gy, gz);
        return normalize(normal);
    }

    void main() {
        vec2 uv0 = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;
        vec2 m = (uMouse.xy * 2.0 - uResolution.xy) / uResolution.y;

        // initialization
        vec3 ro = vec3(0.0, 0.0, -3.0); // ray origin
        vec3 rd = normalize(vec3(uv0, 1.0)); // ray direction
        vec3 col = vec3(0.0); // ray origin

        float t = 0.0; // total distance travelled

        // vertical camera rotation
        ro.yz *= rot2D(-m.y);
        rd.yz *= rot2D(-m.y);

        // horizontal camera rotation
        ro.xz *= rot2D(-m.x);
        rd.xz *= rot2D(-m.x);

        // raymarching
        int i;
        for (i = 0; i < 80; ++i) {
            vec3 p = ro + rd * t;
            float d = map(p);

            // 
            // d = pow(0.01 / d, 1.2);
    
            // col *= d;

            t += d;

            // col = vec3(i) / 80.0;

            if (d < 0.001 || t > 80.0) break;
        }

        if (t <= 80.0) {
            vec3 p = ro + rd * t;
            vec3 normal = getNormal(p);
            // col = normal;

            // lighting

            // diffuse
            vec3 lightColor = vec3(1.0);
            vec3 lightSource = vec3(2.5, 2.5, -1.0);
            float diffuseStrength = max(0.0, dot(normalize(lightSource), normal));
            vec3 diffuse = lightColor * diffuseStrength;

            // specular
            vec3 viewSource = normalize(ro);
            vec3 reflectSource = normalize(reflect(-lightSource, normal));
            float specularStrength = max(0.0, dot(viewSource, reflectSource));
            specularStrength = pow(specularStrength, 64.0);
            vec3 specular = specularStrength * lightColor;

            vec3 lighting = diffuse * 0.75 + specular * 0.25;
            col = lighting;

            // shadows
            vec3 lightDirection = normalize(lightSource);
            float distToLightSource = length(lightSource - p);
            ro = p + normal * 0.1;
            rd = lightDirection;

            t = 0.0;
            for (i = 0; i < 80; ++i) {
                vec3 p = ro + rd * t;
                float d = map(p);
    
                // 
                // d = pow(0.01 / d, 1.2);
        
                // col *= d;
    
                t += d;
    
                // col = vec3(i) / 80.0;
    
                if (d < 0.001 || t > 80.0) break;
            }

            if (t < distToLightSource) {
                col = col * vec3(0.25);
            }
            

            // col = vec3(t * float(i) * 0.005);
            // col = vec3(t * 0.05);
            // col = vec3(1.0);

            col = pow(col, vec3(1.0 / 2.2));
        }
        
        
        
        fragColor = vec4(col, 1.0); // Background color
    }
`;
