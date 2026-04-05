uniform float uTime;
uniform float uDeltaTime;
uniform sampler2D uBase;
uniform float uFlowFieldInfluence;
uniform float uFlowFieldStrength;
uniform float uFlowFieldFrequency;

#include ../includes/simplexNoise4d.glsl

void main()
{
  float time = uTime * 0.2;

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 particle = texture(uParticles, uv); // uParticles uniform comes from script.js 'gpgpu.computation.addVariable(...)'
  vec4 base = texture(uBase, uv); // uParticles uniform comes from script.js 'gpgpu.computation.addVariable(...)'

  // Dead
  if(particle.a >= 1.0)
  {
    particle.a = mod(particle.a, 1.0); // in case of leaving the browser tab so deltaTime gets very high and particles dying at the same time because all of the will be bigger than 1.0 at the same time. Mod will not reset them to zero but to some small number below 1.0
    particle.xyz = base.xyz;
  }
  // Alive
  else
  {
    // Strength
    float strength = simplexNoise4d(vec4(base.xyz * 0.2, time + 1.0)); // -1 -> 1
    float influence = (uFlowFieldInfluence - 0.5) * (-2.0); // uFlowFieldInfluence tweek = 0 -> 1 but we need -1 -> 1
    strength = smoothstep(influence, 1.0, strength);

    // Flow field
    vec3 flowField = vec3(
      simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 0.0, time)), // -1 -> 1
      simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 1.0, time)), // -1 -> 1
      simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 2.0, time))  // -1 -> 1
    );

    flowField = normalize(flowField);

    particle.xyz += flowField * uDeltaTime * strength * uFlowFieldStrength;

    // Decay (life time of Particle)
    particle.a += uDeltaTime * 0.3;
  }

  gl_FragColor = particle;
}
