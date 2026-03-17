uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uShadowRepetitions;
uniform vec3 uShadowColor;
uniform float uLightRepetitions;
uniform vec3 uLightColor;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl;
#include ../includes/directionalLight.glsl;

vec3 halftone(
  vec3 color,
  float repetitions,
  vec3 direction,
  float low,
  float high,
  vec3 pointColor,
  vec3 normal )
{
  float intensity = dot(normal, direction);
  intensity = smoothstep(low, high, intensity);

  vec2 uv = gl_FragCoord.xy / uResolution.y; // it keeps cells perfectly squared. (.xy keep the ratio as screen which is a rectangular)
  uv *= repetitions;
  uv = mod(uv, 1.0);

  float point = distance(uv, vec2(0.5));
  point = 1.0 - step(0.5 * intensity, point); // all below 0.5 becomes 0, and all above 0.5 becomes 1. ( -1.0 -> is to inverse the black and white)

  return mix(color, pointColor, point);
}

void main()
{
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);
  vec3 color = uColor;

  // Lights
  vec3 light = vec3(0.0, 0.0, 0.0);
  light += ambientLight(
    vec3(1.0),      // Light color
    1.0             // Light intensity
  );
  light += directionalLight(
    vec3(1.0),            // Light color
    1.0,                  // Light intensity
    normal,
    vec3(1.0, 1.0, 0.0),
    viewDirection,
    1.0
  );

  color *= light;

  // Halftone
  float repetitions = 50.0; // it will give 10 cells verticaly(because we devided uv by resolution.y)
  vec3 direction1 = vec3(0.0, -1.0, 0.0);
  vec3 direction2 = vec3(1.0, 1.0, 0.0);
  float low = -0.8;
  float high = 1.5;

  color = halftone(color, uShadowRepetitions, direction1, low, high, uShadowColor, normal);
  color = halftone(color, uLightRepetitions, direction2, low, high, uLightColor, normal);

  // Final color
  gl_FragColor = vec4(vec3(color), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
