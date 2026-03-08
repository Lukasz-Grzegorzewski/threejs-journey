uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

#include ../includes/rotate2D.glsl

void main()
{
  // Animate
  vec3 newPosition = position;

  // Twist
  float twistPerlin =
    texture(
      uPerlinTexture,
      vec2(0.5, uv.y * 0.2 - uTime * 0.01)  // 0.2 to make frequency lower
    ).r;
  float angle = twistPerlin * 10.0;
  newPosition.xz = rotate2D(newPosition.xz, angle);

  // Wind
  vec2 windOffset = vec2(
    texture(
      uPerlinTexture,
      vec2(0.25, uTime * 0.01)
    ).r - 0.5, // 0.5 because i want a range from -0.5 to 0.5 and not from 0.0 to 1.0
    texture(
      uPerlinTexture,
      vec2(0.75, uTime * 0.01)
    ).r - 0.5
  );
  windOffset *= pow(uv.y, 3.0) * 10.0;  // pow to make wind stronger at the top
  newPosition.xz += windOffset;

  // Final position
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  vUv = uv;
}
