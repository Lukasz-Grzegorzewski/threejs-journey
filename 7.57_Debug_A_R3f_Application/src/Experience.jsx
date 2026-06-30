import { OrbitControls } from "@react-three/drei";
import { button, useControls } from "leva";
import { Perf } from "r3f-perf";

export default function Experience() {
  const { perfControl } = useControls({ perfControl: true });

  const { positionSphere, colorSphere, visibleSphere } = useControls("sphere", {
    positionSphere: {
      value: { x: -2, y: 0 },
      step: 0.01,
      joystick: "invertY",
    },
    colorSphere: "#ff0000",
    visibleSphere: true,
    myInterval: {
      min: 0,
      max: 10,
      value: [4, 5],
    },
    clickMe: button(() => {
      console.log("ok");
    }),
    choice: { options: ["a", "b", "c"] },
  });

  const { positionCube, colorCube, visibleCube, scaleCube } = useControls(
    "cube",
    {
      positionCube: {
        value: { x: 2, y: 0 },
        step: 0.01,
        joystick: "invertY",
      },
      colorCube: "#00ff00",
      visibleCube: true,
      myInterval: {
        min: 0,
        max: 10,
        value: [4, 5],
      },
      clickMe: button(() => {
        console.log("ok");
      }),
      choice: { options: ["a", "b", "c"] },
      scaleCube: { value: 1.5, step: 0.01, min: 0, max: 5 },
    },
  );

  return (
    <>
      {perfControl ? <Perf position="top-left" /> : null}
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh
        position={[positionSphere.x, positionSphere.y, 0]}
        visible={visibleSphere}
      >
        <sphereGeometry />
        <meshStandardMaterial color={colorSphere} />
      </mesh>

      <mesh
        position={[positionCube.x, positionCube.y, 0]}
        scale={scaleCube}
        visible={visibleCube}
      >
        <boxGeometry />
        <meshStandardMaterial color={colorCube} />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}
