import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import Model from "./Model";
import { Suspense } from "react";
import Placeholder from "./Placeholder";
import ModelDrei from "./ModelDrei";
import Hamburger from "./Hamburger";
import Fox from "./Fox";

export default function Experience() {
  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight
        shadow-normalBias={0.04}
        castShadow
        position={[1, 2, 3]}
        intensity={4.5}
      />
      <ambientLight intensity={1.5} />

      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>

      <Suspense
        fallback={<Placeholder scale={[2, 3, 2]} position={[0, 0.5, 0]} />}
      >
        <Model />
      </Suspense>

      <Suspense
        fallback={<Placeholder scale={[2, 3, 2]} position={[-3, 0, 0]} />}
      >
        <ModelDrei />
      </Suspense>

      <Suspense
        fallback={<Placeholder scale={[2, 3, 2]} position={[0, 0, 3]} />}
      >
        <Hamburger scale={0.35} position-x={3} />
      </Suspense>
      <Suspense
        fallback={<Placeholder scale={[2, 3, 2]} position={[1, 0, 3.5]} />}
      >
        <Fox />
      </Suspense>
    </>
  );
}
