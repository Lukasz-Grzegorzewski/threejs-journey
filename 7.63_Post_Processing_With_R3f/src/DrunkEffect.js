import { Effect, BlendFunction } from "postprocessing";
import { Uniform } from "three";

const fragmentShader = `
  uniform float frequency;
  uniform float amplitude;
  uniform float offset;

  void mainUv(inout vec2 uv){
    uv.y += sin(uv.x * frequency + offset) * amplitude;
  }
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // vec4 color = inputColor;
    // color.rgb *= vec3(0.8, 1.0, 0.5);
    // outputColor = color;

    outputColor = vec4(0.8, 1.0, 0.5, inputColor.a);

  }
`;

export default class DrunkEffect extends Effect {
  constructor({ frequency, amplitude, blendFunction = BlendFunction.DARKEN }) {
    super("DrunkEffect", fragmentShader, {
      uniforms: new Map([
        ["frequency", new Uniform(frequency)],
        ["amplitude", new Uniform(amplitude)],
        ["offset", new Uniform(0)],
      ]),
      blendFunction,
    });
    // this.fragmentShader = fragmentShader;
  }

  // update method updates automaticly. DeltaTime is given as 3rd parameter
  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get("offset").value += deltaTime;
  }
}
