uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;
attribute float aTimeMultiplier;

varying float vExploadingProgress;

#include ../includes/remap.glsl;

void main()
{
  float progress = uProgress * aTimeMultiplier; // randomness multiply by 1->2
  vec3 newPosition = position;

  // Exploading
  float exploadingProgress = remap(progress, 0.0, 0.1, 0.0, 1.0); // When progress goes from 0 → 0.1, the output goes from 0 → 1 /  it compresses the animation(progress 0 -> 1 in 3sec) into the first 10% of the timeline.
  /**   clamp it to max 1.0 because :
   *  Time      progress   remap result
      0s        0.0         0
      0.15s     0.05        0.5
      0.3s      0.1         1
      3s        1.0         10 (❗️ too much)
  */
  exploadingProgress = clamp(exploadingProgress, 0.0, 1.0);
  /** transform the linear function to curved one - fast in the begining and slowes down quickly at the end
  *   linear          transformed
      0.0 -> 0.0      0.0 -> 0.000  (fast)
      0.1 -> 0.1      0.1 -> 0.271  (fast)
      0.2 -> 0.2      0.2 -> 0.488  (fast)
      0.3 -> 0.3      0.3 -> 0.657  (fast)
      0.4 -> 0.4      0.4 -> 0.784  (slower)
      0.5 -> 0.5      0.5 -> 0.875  (slower)
      0.6 -> 0.6      0.6 -> 0.936  (slower)
      0.7 -> 0.7      0.7 -> 0.973  (very slow)
      0.8 -> 0.8      0.8 -> 0.992  (very slow)
      0.9 -> 0.9      0.9 -> 0.999  (very slow)
      1.0 -> 1.0      1.0 -> 1.000  (very slow)

  */
  exploadingProgress = 1.0 - pow(1.0 - exploadingProgress, 3.0);
  // newPosition is a position that particle will finish. So we multiply by 0 first so it starts from the point 0.0 and goes to newPosition passed with material uniform
  newPosition *= exploadingProgress;

  // Falling
  // remap to start progress from 0.1 value upto 1
  float fallingProgress = remap(progress, 0.1, 1.0, 0.0, 1.0);
  // clamp them from 0 to 1
  fallingProgress = clamp(fallingProgress, 0.0, 1.0);
  // slow down at the end of falling
  fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
  // minus progress so it will slowly deduct value from 0 to 1 and multiply by 0.2 to limit falling length from 1 to 0.2
  newPosition.y -= fallingProgress * 0.2;

  // Scaling
  float sizeOpeningProgress = remap(progress, 0.0, 0.125, 0.0, 1.0); // 0 -> 0       ||   0.125 -> 1
  float sizeClosingProgress = remap(progress, 0.125, 1.0, 1.0, 0.0); // 0.125 -> 1   ||   1 -> 0
  float sizeProgress = min(sizeOpeningProgress, sizeClosingProgress);
  sizeProgress = clamp(sizeProgress, 0.0, 1.0);

  // Twinkling
  float twinklingProgress = remap(progress, 0.2, 0.8, 0.0, 1.0);
  twinklingProgress = clamp(twinklingProgress, 0.0, 1.0);
  float sizeTwinkling = sin(progress * 30.0) * 0.5 + 0.5; // -1 -> 1 || 0 -> 1
  sizeTwinkling = 1.0 - sizeTwinkling * twinklingProgress; // sizeTwinkling * twinklingProgress - at the begining 1 * 0 = 0 and we want at the beggining 1 * 1 = 1 so we offset it by 1 (1.0 - ...)

  // Final position
  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  // Final size
  gl_PointSize = uSize * uResolution.y * aSize * sizeProgress * sizeTwinkling ;
  gl_PointSize *= 1.0 / - viewPosition.z;

  // mostly for windows OS. Instead of disappearing, the GPU may still render a 1-pixel dot, causing noise.
  if(gl_PointSize < 1.0)
    gl_Position = vec4(9999.9);
}
