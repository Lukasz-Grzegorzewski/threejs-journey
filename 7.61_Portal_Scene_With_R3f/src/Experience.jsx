import {
  Sparkles,
  Center,
  OrbitControls,
  useGLTF,
  useTexture,
  shaderMaterial,
} from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import portalVertexShader from "./shaders/portal/vertex.glsl";
import portalFragmentShader from "./shaders/portal/fragment.glsl";
import { useRef } from "react";

// to replace <shaderMaterial/> tag with drei helper
const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color("#ffffff"),
    uColorEnd: new THREE.Color("#000000"),
  },
  portalVertexShader,
  portalFragmentShader,
);
extend({ PortalMaterial });

export default function Experience() {
  const portalMaterialRef = useRef();
  const { nodes } = useGLTF("./portal.glb");

  const bakedTexture = useTexture("./baked.jpg");
  bakedTexture.flipY = false;

  useFrame((_, delta) => {
    portalMaterialRef.current.uTime += delta;
  });

  return (
    <>
      <color args={["#030202"]} attach="background" />

      <OrbitControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2 + 0.1}
      />

      <Center>
        {/* baked */}
        <mesh geometry={nodes.baked.geometry}>
          <meshBasicMaterial
            map={bakedTexture}
            // map-flipY={false}
          />
        </mesh>

        {/* poleLightA */}
        <mesh
          geometry={nodes.poleLightA.geometry}
          position={nodes.poleLightA.position}
        >
          <meshBasicMaterial color="#ffffe5" />
        </mesh>

        {/* poleLightB */}
        <mesh
          geometry={nodes.poleLightB.geometry}
          position={nodes.poleLightB.position}
        >
          <meshBasicMaterial color="#ffffe5" />
        </mesh>

        {/* portalLight */}
        <mesh geometry={nodes.portalLight.geometry}>
          {/* <shaderMaterial
            vertexShader={portalVertexShader}
            fragmentShader={portalFragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uColorStart: { value: new THREE.Color("#ffffff") },
              uColorEnd: { value: new THREE.Color("#000000") },
            }}
          /> */}
          <portalMaterial ref={portalMaterialRef} />
        </mesh>

        <Sparkles
          size={3}
          scale={[4, 2, 4]}
          position-y={1.2}
          speed={0.5}
          count={40}
        />
      </Center>
    </>
  );
}
