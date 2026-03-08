uniform float uTime;

uniform sampler2D uPerlinTexture;

varying vec2 vUv;

void main()
{
  // Scale and animate
  vec2 smokeUv = vUv;

  smokeUv.x *= 0.5 ;
  smokeUv.y *= 0.3;
  smokeUv.y -= uTime * 0.05;

  float smoke = texture(uPerlinTexture, smokeUv).r;

  // Remap from 0.4 to 1.0 smoothly
  smoke = smoothstep(0.4, 1.0, smoke);

  // Remap smoothe edges
  smoke *= smoothstep(0.0, 0.1, vUv.x); // left side
  smoke *= smoothstep(1.0, 0.9, vUv.x); // right side
  smoke *= smoothstep(0.0, 0.1, vUv.y); // bottom side
  smoke *= smoothstep(1.0, 0.4, vUv.y); // top side

  // Final color
  gl_FragColor = vec4(0.6, 0.3, 0.2, smoke);
  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
