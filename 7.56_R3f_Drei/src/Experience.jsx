import {
  MeshReflectorMaterial,
  Float,
  Html,
  Text,
  PivotControls,
  TransformControls,
  OrbitControls,
} from "@react-three/drei";
import { useRef } from "react";

export default function Experience() {
  const cubeRef = useRef();

  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <PivotControls
        anchor={[0, 0, 0]}
        depthTest={false}
        lineWidth={4}
        axisColors={["#9381ff", "#ff4d6d", "#00b8d4"]}
        scale={100} // size of the pivot
        fixed={true} // perspective camera on/off. Off by default.
      >
        <mesh position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
          <Html
            wrapperClass="label"
            position={[1, 1, 0]}
            center
            distanceFactor={8}
            occlude={[cubeRef]}
          >
            This is a sphere 👋
          </Html>
        </mesh>
      </PivotControls>

      <mesh ref={cubeRef} position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
      <TransformControls object={cubeRef} mode="translate" />

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <MeshReflectorMaterial
          resolution={512}
          blur={[1000, 1000]}
          mixBlur={1}
          mirror={0.75}
          color={"greenyellow"}
        />
        {/* <meshStandardMaterial color="greenyellow" /> */}
      </mesh>

      <Float speed={5} floatIntensity={10}>
        <Text
          font="./bangers-v20-latin-regular.woff"
          fontSize={1}
          color={"salmon"}
          position-y={2}
          maxWidth={2}
          textAlign="center"
        >
          I LOVE R3F
          {/* <meshNormalMaterial /> */}
        </Text>
      </Float>
    </>
  );
}
