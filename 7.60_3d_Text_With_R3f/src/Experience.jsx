import {
  useMatcapTexture,
  Center,
  Text3D,
  OrbitControls,
} from "@react-three/drei";
import { Perf } from "r3f-perf";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const torusGeometryNativeTHREE = new THREE.TorusGeometry(1, 0.6, 16, 32);
const meshMatcapMaterialNativeTHREE = new THREE.MeshMatcapMaterial();

export default function Experience() {
  // const donutsGroupRef = useRef();   // 1: using group

  const donuts = useRef([]); // 2: using custom array

  const [matcapTexture] = useMatcapTexture("7B5254_E9DCC7_B19986_C8AC91", 256);
  matcapTexture.colorSpace = THREE.SRGBColorSpace;

  const [torusGeometry, setTorusGeometry] = useState();
  const [meshMatcapMaterial, setMeshMatcapMaterial] = useState();

  useEffect(() => {
    meshMatcapMaterialNativeTHREE.matcap = matcapTexture;
    meshMatcapMaterialNativeTHREE.needsUpdate = true;
  }, []);

  useFrame((_, delta) => {
    // 1: using group
    // for (const donut of donutsGroupRef.current.children) {
    //   donut.rotation.y += delta;
    // }

    // 2: using custom array
    for (const donut of donuts.current) {
      donut.rotation.y += delta;
    }
  });

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      {/* 1: using group */}
      {/* <torusGeometry ref={setTorusGeometry} />
      <meshMatcapMaterial ref={setMeshMatcapMaterial} matcap={matcapTexture} /> */}

      <Center>
        <Text3D
          // material={meshMatcapMaterial}
          material={meshMatcapMaterialNativeTHREE}
          font={"./fonts/helvetiker_regular.typeface.json"}
          size={0.75}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          HELLO R3F
        </Text3D>
      </Center>

      {/* 1: using group */}
      {/* <group ref={donutsGroupRef}> */}
      {[...Array(100)].map((_, index) => (
        <mesh
          ref={(element) => (donuts.current[index] = element)} // 2: using custom array
          key={index}
          // geometry={torusGeometry}
          geometry={torusGeometryNativeTHREE}
          // material={meshMatcapMaterial}
          material={meshMatcapMaterialNativeTHREE}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          ]}
          scale={0.2 + Math.random() * 0.2}
          rotation={[
            Math.PI * Math.random(),
            Math.PI * Math.random(),
            Math.PI * Math.random(),
          ]}
        />
      ))}
      {/* 1: using group */}
      {/* </group> */}
    </>
  );
}
