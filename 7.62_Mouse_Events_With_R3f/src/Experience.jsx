import { useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, meshBounds } from "@react-three/drei";
import { useRef } from "react";

export default function Experience() {
  const cube = useRef();
  const hamburger = useGLTF("./hamburger.glb");

  useFrame((_, delta) => {
    cube.current.rotation.y += delta * 0.2;
  });

  const eventHandler = (e) => {
    cube.current.material.color.set(`hsl(
      ${Math.floor(Math.random() * 360)},
      ${Math.floor(Math.random() * 100)}%,
      ${Math.floor(Math.random() * 100)}%
    )`);
  };

  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh
        position-x={-2}
        onPointerEnter={(e) => e.pointer.position}
        onClick={(e) => e.stopPropagation()}
      >
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh
        ref={cube}
        raycast={meshBounds}
        position-x={2}
        scale={1.5}
        // onClick={eventHandler}
        // onPointerDown={(event) => e.stopPropagation()}
        // onPointerLeave={(e)=> e.stopPropagation()}
        // onPointerEnter={(e) => e.stopPropagation()}
        // onPointerLeave={(e) => e.stopPropagation()}
        // onDoubleClick={(event) => event.stopPropagation()}
        // onPointerUp={(event) => e.stopPropagation()}
        // onPointerMove={(event) => e.stopPropagation()}
        // onPointerOver={(event) => e.stopPropagation()}
        // onPointerOut={(event) => e.stopPropagation()}
      >
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>

      <primitive
        object={hamburger.scene}
        scale={0.25}
        position-y={0.5}
        onClick={(event) => {
          console.log("click");
          event.stopPropagation();
        }}
      />
    </>
  );
}
