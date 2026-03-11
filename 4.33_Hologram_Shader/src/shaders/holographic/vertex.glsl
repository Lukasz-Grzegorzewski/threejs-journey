uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

#include ../includes/random2D.glsl

void main()
{
  // Position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Glitch
  float glitchTime = uTime - modelPosition.y;
  float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.45) + sin(glitchTime * 8.76); // we use a combination of sine and cosine functions to create a more interesting glitch pattern. The glitchTime is based on the y position of the vertex, so the glitch will be different for each vertex and it will move over time.
  glitchStrength /= 3.0; // we divide it by 3 to have a value between -1 and 1, because the maximum value of the sum of three sine functions is 3 (when all three are at their maximum of 1) and the minimum value is -3 (when all three are at their minimum of -1).
  glitchStrength = smoothstep(0.3, 1.0, glitchStrength); // all below 0.3 becomes 0, and all above 1.0 becomes 1, and between 0.3 and 1.0 it goes from 0 to 1 smoothly.
  glitchStrength *=  0.25;

  float randomX = random2D(modelPosition.xz + uTime) - 0.5; // random2D returns a value between 0 and 1, so we subtract 0.5 to have a value between -0.5 and 0.5. So the glitch can go in both directions.
  modelPosition.x += randomX * glitchStrength; // we multiply it by glitchStrength to make the glitch stronger or weaker depending on the value of glitchStrength. So when glitchStrength is 0, there is no glitch, and when glitchStrength is 1, there is a strong glitch.

  float randomZ = random2D(modelPosition.zx + uTime) - 0.5;
  modelPosition.z += randomZ * glitchStrength;

  // Final position
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  // Model normal
  vec4 modelNormal = modelMatrix * vec4(normal, 0.0); // 0.0 to turn off translation

  vPosition = modelPosition.xyz;
  vNormal = modelNormal.xyz;
}
