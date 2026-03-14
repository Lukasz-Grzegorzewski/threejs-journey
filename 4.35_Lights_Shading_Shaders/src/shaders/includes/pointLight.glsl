vec3 pointLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float powerSpecular, vec3 position, float lightDecay)
{
  vec3 lightDelta = lightPosition - position;
  float lightDistance = length(lightDelta);
  /** bring position closer to point 0,0,0 so the ength = 1
      example: normalize(vec3(0.0, 0.0, 3.0)) = vec3(0.0, 0.0, 1.0) */
  vec3 lightDirection = normalize(lightDelta);
  vec3 lightReflection = reflect(-lightDirection, normal);  // minus to change direction. from light to fragment and not from fragment to the light

  // shading
  float shading = dot(normal, lightDirection); // angle between: 0° -> 1, 45° -> 0, 90° -> -1
  shading = max(0.0, shading);  // to prevent shading never goes below 0

  // Specular
  float specular = - dot(lightReflection, viewDirection); // the vectors are oposite. when lightReflection is oposite to viewDirection we want 1 instead of -1
  specular = max(0.0, specular);
  specular = pow(specular, powerSpecular);

  //Decay
  float decay = 1.0 - lightDistance * lightDecay;
  decay = max(0.0, decay);

  return  (lightColor * lightIntensity * decay) * (shading + specular);
}
