uniform float uTime;
uniform float uPositionFrequency;
uniform float uStrength;
uniform float uWarpFrequency;
uniform float uWarpStrength;

varying vec3 vPosition;
varying float vUpDot;

#include ../includes/simplexNoise2d.glsl;

float getElevation(vec2 position)
{
  // float uPositionFrequency = 0.2;
  // float uStrength = 2.0;
  // float uWarpFrequency = 5.0;
  // float uWarpStrength = 0.5;

  vec2 warpedPosition = position;
  warpedPosition += uTime * 0.2;  // moving terrain
  warpedPosition += simplexNoise2d(warpedPosition * uPositionFrequency * uWarpFrequency) * uWarpStrength;

  float elevation = 0.0;
  elevation += simplexNoise2d(warpedPosition * uPositionFrequency) / 2.0;
  elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 2.0) / 4.0;
  elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 4.0) / 8.0;

  float elevationSign = sign(elevation);
  elevation = pow(  // to achive => lesser input values will give smaller results
    abs(elevation), // sign negative is added next to have the same behaviour for odd or even power values
    2.0
  );
  elevation *= elevationSign; //  to avoid not having minus values.

  elevation *= uStrength;

  return elevation;
}

void main()
{
  // Neighbours positions
  float shift = 0.01;
  vec3 positionA = position + vec3(shift, 0.0, 0.0);
  vec3 positionB = position + vec3(0.0, 0.0, - shift);

  // Elevation
  float elevation = getElevation(csm_Position.xz);
  csm_Position.y += elevation;
  positionA.y = getElevation(positionA.xz);
  positionB.y = getElevation(positionB.xz);

  // Compute normal
  vec3 toA = normalize(positionA - csm_Position);
  vec3 toB = normalize(positionB - csm_Position);
  csm_Normal = cross(toA, toB);

  // Varyings
  vPosition = csm_Position;
  vPosition.xz += uTime * 0.2;
  vUpDot = dot(csm_Normal, vec3(0.0, 1.0, 0.0));
}
