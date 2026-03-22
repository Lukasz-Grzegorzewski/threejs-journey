uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;

attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;

void main()
{
  // Displacement
  vec3 newPosition = position;
  float displacementIntensity = texture(uDisplacementTexture, uv).r; // between 0 -> 1
  displacementIntensity = smoothstep(0.2, 0.3, displacementIntensity);

  vec3 displacement = vec3(
    cos(aAngle) * 0.2,
    sin(aAngle) * 0.2,
    1.0
  );
  displacement = normalize(displacement);
  displacement *= displacementIntensity;
  displacement *= 3.0;
  displacement *= aIntensity;

  newPosition += displacement;

  // Final position
  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  /** Picture */
  /* Sizing particules
  * checking intensity of color in the current uv coordinate to choose size of particule
  * the picture is only in shade color so only 'r' channel is needed.
  */
  float pictureIntensity = texture(uPictureTexture, uv).r;

  // Point size
  gl_PointSize = 0.15 * pictureIntensity * uResolution.y ;
  gl_PointSize *= (1.0 / - viewPosition.z); // size change when hight of screen changes

  // make pictureIntensity stronger
  // color of particle will be stronger. Shade becomes darker but white stays white


  // Varyings
  vColor = vec3(
    pow(pictureIntensity, 2.0) // make pictureIntensity stronger. 1 -> 1 || 0.6 -> 0.1 ...
  );
}
