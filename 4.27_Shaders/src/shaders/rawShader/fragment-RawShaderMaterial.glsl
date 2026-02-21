precision mediump float;

// varying float vRandom;
varying vec2 vUv;
varying float vElevation;

// uniform vec3 uColor;
uniform sampler2D uTexture;

void main()
{

  vec4 textureColor = texture2D(uTexture, vUv);
  textureColor.rgb *= vElevation * 1.5 + 0.5; // Add 0.1 to avoid complete darkness

  gl_FragColor = textureColor;

  /*
    gl_FragColor = vec4(
      // 1.0, 0.0, 0.5, 1.0
      // vRandom, 1.0, 0.0, 0.5
      uColor, 1.0
    );
  */


}
