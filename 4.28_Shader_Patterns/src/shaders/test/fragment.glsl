#define PI 3.1415926535897932384626433832795
varying vec2 vUv;

float random(vec2 st)
{
  return fract(sin(dot(st.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
  return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
  );
}

//	Classic Perlin 2D Noise
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//

vec2 fade(vec2 t)
{
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

vec4 permute(vec4 x)
{
  return mod(((x*34.0)+1.0)*x, 289.0);
}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 *
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
  // pattern 3
  // float strength = vUv.x;

  // pattern 4
  // float strength = vUv.y;

  // pattern 5
  // float strength = 1.0 - vUv.y;

  // pattern 6
  // float strength = vUv.y * 10.0;

  // pattern 7
  // float segmentsCount = 10.0;
  // float strength = mod(vUv.y * segmentsCount, 1.0);

  // pattern 8
  // float segmentsCount = 10.0;
  // float strength = mod(vUv.y * segmentsCount, 1.0);
  // // strength = strength < 0.5 ? 0.0 : 1.0;
  // strength = step(0.5, strength);

  // pattern 9
  // float segmentsCount = 10.0;
  // float strength = mod(vUv.y * segmentsCount, 1.0);
  // strength = step(0.8, strength);

  // pattern 10
  // float segmentsCount = 10.0;
  // float strength = mod(vUv.x * segmentsCount, 1.0);
  // strength = step(0.8, strength);

  // pattern 11
  // float segmentsCount = 10.0;
  // float strengthX = step(0.8, mod(vUv.x * segmentsCount, 1.0));
  // float strengthY = step(0.8, mod(vUv.y * segmentsCount, 1.0));
  // float strength = strengthX + strengthY;

  // pattern 12
  // float segmentsCount = 10.0;
  // float strengthX = step(0.8, mod(vUv.x * segmentsCount, 1.0));
  // float strengthY = step(0.8, mod(vUv.y * segmentsCount, 1.0));
  // float strength = strengthX * strengthY;

  // pattern 13
  // float segmentsCount = 10.0;
  // float strengthX = step(0.4, mod(vUv.x * segmentsCount, 1.0));
  // float strengthY = step(0.8, mod(vUv.y * segmentsCount, 1.0));
  // float strength = strengthX * strengthY;

  // pattern 14
  // float segmentsCount = 10.0;
  // float barX = step(0.4, mod(vUv.x * segmentsCount, 1.0));
  // barX *= step(0.8, mod(vUv.y * segmentsCount, 1.0));
  // float barY = step(0.8, mod(vUv.x * segmentsCount, 1.0));
  // barY *= step(0.4, mod(vUv.y * segmentsCount, 1.0));
  // float strength = barX + barY;

  // pattern 15
  // float segmentsCount = 10.0;
  // float barX = step(0.4, mod(vUv.x * segmentsCount, 1.0));
  // barX *= step(0.8, mod(vUv.y * segmentsCount + 0.2, 1.0));
  // float barY = step(0.8, mod(vUv.x * segmentsCount + 0.2, 1.0));
  // barY *= step(0.4, mod(vUv.y * segmentsCount, 1.0));
  // float strength = barY + barX;

  // pattern 16
  // float strength = abs(vUv.x - 0.5);

  // pattern 17
  // float barX = abs(vUv.x - 0.5);
  // float barY = abs(vUv.y - 0.5);
  // float strength = min(barX, barY);

  // pattern 18
  // float barX = abs(vUv.x - 0.5);
  // float barY = abs(vUv.y - 0.5);
  // float strength = max(barX, barY);

  // pattern 19
  // float barX = abs(vUv.x - 0.5);
  // float barY = abs(vUv.y - 0.5);
  // float strength = step(0.2, max(barX, barY));

  // pattern 20
  // float barX = abs(vUv.x - 0.5);
  // float barY = abs(vUv.y - 0.5);
  // float square1 = step(0.2, max(barX, barY));
  // float square2 = 1.0 - step(0.25, max(barX, barY));
  // float strength = square1 * square2;

  // pattern 21
  // float segmentsCount = 10.0;
  // float strength = floor(vUv.x * segmentsCount) / segmentsCount;

  // pattern 22
  // float segmentsCount = 10.0;
  // float barX = floor(vUv.x * segmentsCount) / segmentsCount;
  // float barY = floor(vUv.y * segmentsCount) / segmentsCount;
  // float strength = barX * barY;

  // pattern 23
  // float strength = random(vUv);

  // pattern 24
  // float segmentsCount = 10.0;
  // float x = floor(vUv.x * segmentsCount) / segmentsCount;
  // float y = floor(vUv.y * segmentsCount) / segmentsCount;
  // vec2 gridUv = vec2(x, y);
  // float strength = random(gridUv);

  // pattern 25
  // float segmentsCount = 10.0;
  // float x = floor(vUv.x * segmentsCount) / segmentsCount;
  // float y = floor((vUv.y + vUv.x * 0.5) * segmentsCount) / segmentsCount;
  // vec2 gridUv = vec2(x, y);
  // float strength = random(gridUv);

  // pattern 26
  // float strength = length(vUv);

  // pattern 27
  // float strength = length(vUv - 0.5);
  // float strength = distance(vUv, vec2(0.5));

  // pattern 28
  // float strength = 1.0 - distance(vUv, vec2(0.5));

  // pattern 29
  // float strength = 0.015 / distance(vUv, vec2(0.5));

  // pattern 30
  // vec2 lightUv = vec2(
  //   vUv.x * 0.1 + 0.45,
  //   vUv.y * 0.5 + 0.25
  // );
  // float strength = 0.015 / distance(lightUv, vec2(0.5));

  // pattern 31 - white star in the middle
  // vec2 lightUvX = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
  // float lightX = 0.015 / distance(lightUvX, vec2(0.5));
  // vec2 lightUvY = vec2(vUv.x * 0.5 + 0.25, vUv.y * 0.1 + 0.45);
  // float lightY = 0.015 / distance(lightUvY, vec2(0.5));
  // float strength = lightX * lightY;

  // pattern 32 - white star in the middle rotated
  // vec2 rotatedUv = rotate(vUv, PI*0.25, vec2(0.5));
  // vec2 lightUvX = vec2(rotatedUv.x * 0.1 + 0.45, rotatedUv.y * 0.5 + 0.25);
  // float lightX = 0.015 / distance(lightUvX, vec2(0.5));
  // vec2 lightUvY = vec2(rotatedUv.x * 0.5 + 0.25, rotatedUv.y * 0.1 + 0.45);
  // float lightY = 0.015 / distance(lightUvY, vec2(0.5));
  // float strength = lightX * lightY;

  // pattern 33 - black circle in the middle
  // float strength = step(0.25, distance(vUv, vec2(0.5)));

  // pattern 34 - black ring in the middle
  // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);

  // pattern 35 - black sharp ring in the middle
  // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

  // pattern 36 - white sharp ring in the middle
  // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

  // pattern 37 - white sharp waved ring in the middle
  // vec2 wavedUv = vec2(
  //   vUv.x,
  //   vUv.y + sin(vUv.x * 30.0) * 0.1
  // );
  // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

  // pattern 38 - white sharp distorted ring in the middle plus 4 small white sharp distorted rings around it
  // vec2 wavedUv = vec2(
  //   vUv.x + sin(vUv.y * 30.0) * 0.1,
  //   vUv.y + sin(vUv.x * 30.0) * 0.1
  // );
  // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

  // pattern 39 - white sharp distorted shape in the middle
  // vec2 wavedUv = vec2(
  //   vUv.x + sin(vUv.y * 100.0) * 0.1,
  //   vUv.y + sin(vUv.x * 100.0) * 0.1
  // );
  // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

  // pattern 40 - tangens
  // float angle = atan(vUv.x, vUv.y);
  // float strength = angle;

  // pattern 41 - tangens shift to the middle
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // float strength = angle;

  // pattern 42 - tangens - 360 clock
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // angle /= 2.0 * PI;
  // angle += 0.5;
  // float strength = angle;

  // pattern 43 - tangens - 360 clock, segmented
  // float segmentsCount = 20.0;
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // angle /= 2.0 * PI;
  // angle += 0.5;
  // angle *= segmentsCount;
  // float strength = mod(angle, 1.0);

  // pattern 44 - tangens - 360 clock, sinusoided / more sharp
  // float segmentsCount = 20.0;
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // angle /= 2.0 * PI;
  // angle += 0.5;
  // float strength = sin(angle * 100.0);

  // pattern 45 - white sharp circle, sinusoided/waved with atan
  // float segmentsCount = 20.0;
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // angle /= 2.0 * PI;
  // angle += 0.5;
  // float sinusoid = sin(angle * 100.0);
  // float radius = 0.25 + sinusoid * 0.02;
  // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

  // pattern 46 - black / white water effect
  // float strength = cnoise(vUv * 10.0);

  // pattern 47 - black / white water effect sharp
  // float strength = step(0.0, cnoise(vUv * 10.0));

  // pattern 48 - black / white water effect - conturs - reversed color
  // float strength = 1.0 - abs(cnoise(vUv * 10.0));

  // pattern 49 - black / white water effect - conturs - reversed color - sinusoided
  // float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

  // pattern 50 - black / white water effect - conturs - reversed color - sinusoided
  float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

  // Clamp tge strength
  strength = clamp(strength, 0.0, 1.0); // min 0.0 - max 1.0

  // Colored
  vec3 blackColor = vec3(0.0);
  vec3 uvColor = vec3(vUv, 1.0);
  vec3 mixedColor = mix(blackColor, uvColor, strength);
  gl_FragColor = vec4(mixedColor, 1.0);

  // Black/White
  // gl_FragColor = vec4(strength, strength, strength, 1.0);
}
