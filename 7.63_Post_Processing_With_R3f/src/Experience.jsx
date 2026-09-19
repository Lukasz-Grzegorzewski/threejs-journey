import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {
  DepthOfField,
  Bloom,
  Vignette,
  ToneMapping,
  EffectComposer,
  Glitch,
  Noise,
} from "@react-three/postprocessing";
import { ToneMappingMode, BlendFunction, GlitchMode } from "postprocessing";
import Drunk from "./Drunk.js";
import { useRef } from "react";
import { useControls } from "leva";

export default function Experience() {
  const drunkRef = useRef();

  const drunkProps = useControls("Drunk effect", {
    frequency: { value: 2, min: 1, max: 20 },
    amplitude: { value: 0.1, min: 0, max: 1 },
  });

  return (
    <>
      <color args={["#555"]} attach="background" />
      <EffectComposer>
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette
          offset={0.3}
          darkness={0.9}
          blendFunction={BlendFunction.NORMAL}
        />
        {/* <Glitch
          delay={[0.5, 1]}
          duration={[0.1, 0.3]}
          strength={[0.2, 0.4]}
          // mode={GlitchMode.DISABLED}
        /> */}
        <Noise premultiply blendFunction={BlendFunction.AVERAGE} />
        <Bloom
          mipmapBlur // Blur the bloom effect {default is true}
          intensity={0.1} // The intensity of the bloom effect
          luminanceThreshold={0} // The threshold(amount of light) for the bloom effect
        />
        <DepthOfField
          focusDistance={0.025} // The distance from the camera to the focus point
          focalLength={0.025} // The focal length of the camera
          bokehScale={6} // The scale of the bokeh effect
        />
        <Drunk
          ref={drunkRef}
          {...drunkProps}
          blendFunction={BlendFunction.DARKEN}
        />
      </EffectComposer>

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh castShadow position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* Cube glows based on the light in the scene */}
      <mesh castShadow position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial
          color="white"
          emissive={"orange"}
          emissiveIntensity={20}
        />
      </mesh>

      {/* Cube glows all areas the same color */}
      <mesh castShadow position-x={0} scale={1.5}>
        <boxGeometry />
        <meshBasicMaterial color={[1.5 * 20, 1 * 20, 4 * 20]} />
      </mesh>

      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>

      <mesh castShadow position-x={4} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
    </>
  );
}
