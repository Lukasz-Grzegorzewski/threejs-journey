uniform vec2 uResolution;
uniform float uSize;
uniform sampler2D uParticlesTexture;

attribute vec2 aParticleUv;
attribute vec3 aColor;
attribute float aSize;

varying vec3 vColor;

void main()
{
  vec4 particle = texture(uParticlesTexture, aParticleUv);

  // Final position
  vec4 modelPosition = modelMatrix * vec4(particle.xyz, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // Point size
  float sizeIn = smoothstep(0.0, 0.1, particle.a);
  float sizeOut = 1.0 - smoothstep(0.7, 1.0, particle.a);
  float size = min(sizeIn, sizeOut); // lifetime of particle depends on particle.a(0->1). Here it grows particle at the beginning of lifetime and shrink it down at the end of life(smooth 0.0->0.1 || 0.1->0.7 = 1.0 || smooth 0.7->1.0 )

  gl_PointSize = size * aSize * uSize * uResolution.y;
  gl_PointSize *= (1.0 / - viewPosition.z);

  // Varyings
  vColor = aColor;
}
