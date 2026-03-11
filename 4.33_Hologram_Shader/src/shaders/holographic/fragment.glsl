uniform float uTime;
uniform mat4 modelMatrix;
uniform vec3 uColor;

varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
  // Normal
  vec3 normal = normalize(vNormal); // Normalize the normal vector. Because vertice between vertices can be little bit different, we need to normalize it to make sure it's always the same length and direction.
  if(!gl_FrontFacing) { // if the fragment is back facing, we invert the normal to make it point in the opposite direction.
    normal *= -1.0;
  }

  // Stripes
  float stripes = mod(
    (
      vPosition.y - // y = from -1 to 1
      uTime * 0.02  // subtract time to make it move up. y = 20 and goes down slowly(* 0.02)
    ) * 20.0,       // we multiply it by 20 to have more stripes (so y = 20.0), So 20.0 is going down with a speed of uTime * 0.02.
    1.0             // 1.0 is the length of the stripe(it goes from 0 to 1, and then it starts again from 0). So we have 20 times more stripes than from before.
  );
  stripes = pow(stripes, 3.0); // pow to make the stripes sharper. The higher the power, the sharper the stripes. So a white stripe part (1.0) goes to 0 quickly.

  // Fresnel
  vec3 viewDirection = normalize( // vector between cameraPosition and vPosition shorten so the lenght is 1.0
    vPosition - cameraPosition    // vector from cameraPosition to vPosition translated to have beggining at point 0.0
  );

  // Fresnel effect is the effect that makes the edges of the object brighter than the center. It is based on the angle between the view direction and the normal. The more parallel they are, the stronger the effect. The more perpendicular they are, the weaker the effect.
  float fresnel = dot(viewDirection, normal)   // it calculates the angle between two vectors. Returns from -1 to 1. parallel = 1. Perpendicular = 0. Opposite = -1.
    + 1.0; // +1 to make it positive and range from 0 to 2 and not from -1 to 1
  fresnel = pow(fresnel, 3.0);  // pow to make the fresnel effect stronger. The higher the power, the stronger the fresnel effect. So a white part (1.0) goes to 0 quickly.

  // Falloff
  float falloff =  smoothstep(0.8, 0.0, fresnel); //

  // Holographic
  float holographic = stripes * fresnel; // multiply stripes and fresnel to have both effects. So the holographic effect is stronger on the edges of the object and weaker in the center, and it has moving stripes.
  holographic += fresnel * 1.25;
  holographic *= falloff; // multiply by falloff to make the effect fade out on the edges of the object. So the holographic effect is stronger in the center of the object and weaker on the edges.

  // Final color
  gl_FragColor = vec4(uColor, holographic);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
