import { useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useHelper,
  ContactShadows,
  // Sky,
  Environment,
  Lightformer,
  // AccumulativeShadows,
  // RandomizedLight,
  // BakeShadows,
  // SoftShadows,
  Stage,
} from "@react-three/drei";
import { useRef, useEffect } from "react";
import { Perf } from "r3f-perf";
import * as THREE from "three";
import { useControls } from "leva";

export default function Experience() {
  const cube = useRef();
  const directionalLightRef = useRef();

  useFrame((state, delta) => {
    // const elapsedTime = state.clock.elapsedTime;
    // cube.current.position.x = 2 + Math.sin(elapsedTime);

    cube.current.rotation.y += delta * 0.2;
  });

  const { color, opacity, blur } = useControls("contact shadows", {
    color: "#1d8f75",
    opacity: { value: 0.4, min: 0, max: 1 },
    blur: { value: 2.8, min: 0, max: 10 },
  });

  // const { sunPosition } = useControls("sky", {
  //   sunPosition: { value: [1, 2, 3] },
  // });

  const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } =
    useControls("environment map", {
      envMapIntensity: { value: 3.5, min: 0, max: 12 },
      envMapHeight: { value: 7, min: 0, max: 100 },
      envMapRadius: { value: 20, min: 10, max: 1000 },
      envMapScale: { value: 100, min: 10, max: 1000 },
    });

  // const scene = useThree((state) => state.scene);
  // useEffect(() => {
  //   scene.environmentIntensity = envMapIntensity;
  // }, [envMapIntensity]);

  // useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1);

  return (
    <>
      {/* <Environment
        // background
        // files={[
        //   "environmentMaps/2/px.jpg",
        //   "environmentMaps/2/nx.jpg",
        //   "environmentMaps/2/py.jpg",
        //   "environmentMaps/2/ny.jpg",
        //   "environmentMaps/2/pz.jpg",
        //   "environmentMaps/2/nz.jpg",
        // ]}
        // files={"./environmentMaps/the_sky_is_on_fire_2k.hdr"}
        preset="sunset"
        // resolution={32} // very low if we dontt see background(no preset or files env Map)
        ground={{
          height: envMapHeight,
          radius: envMapRadius,
          scale: envMapScale,
        }}
      > */}
      {/* <color args={["black"]} attach={"background"} /> */}
      {/* <mesh position-z={-5} scale={10}>
          <planeGeometry />
          <meshBasicMaterial color={[100, 0, 0]} />
        </mesh> */}
      {/* <Lightformer
          position-z={-5}
          scale={10}
          color={"red"}
          intensity={10}
          form={"ring"}
        /> */}
      {/* </Environment> */}

      {/* <BakeShadows /> */}
      {/* <SoftShadows size={40} samples={32} focus={0} /> */}
      {/* <color> attach new THREE.Color("ivory")
      to the Parent(<scene>) that has 'background' property*/}
      {/* <color args={["ivory"]} attach={"background"} /> */}

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      {/* <AccumulativeShadows
        position={[0, -0.99, 0]}
        scale={10}
        color="#316d39"
        opacity={0.8}
        // frames={100}
        frames={Infinity}
        temporal
        blend={100}
      >
        <RandomizedLight
          amount={8}
          radius={1}
          ambient={0.5}
          intensity={3}
          bias={0.001}
          position={[1, 2, 3]}
        />
      </AccumulativeShadows> */}

      {/* <ContactShadows
        position={[0, -0.99, 0]}
        scale={10}
        resolution={512}
        far={5}
        color={color}
        opacity={opacity}
        blur={blur}
        frames={1} // it renders only on the first frame ("bake it")
      /> */}

      {/* <directionalLight
        ref={directionalLightRef}
        position={sunPosition}
        intensity={4.5}
        castShadow
        shadow-mapSize={[1024 * 2, 1024 * 2]}
        shadow-camera-top={4}
        shadow-camera-right={4}
        shadow-camera-bottom={-4}
        shadow-camera-left={-4}
        shadow-camera-near={1}
        shadow-camera-far={10}
      /> */}
      {/* <ambientLight intensity={1.5} /> */}

      {/* <Sky sunPosition={sunPosition} /> */}

      {/* <mesh position-y={1} position-x={-2} castShadow>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh position-y={1} ref={cube} position-x={2} scale={1.5} castShadow>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh> */}

      {/* <mesh
        position-y={0}
        rotation-x={-Math.PI * 0.5}
        scale={10}
        // receiveShadow
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh> */}
      <Stage
        shadows={{ type: "contact", opacity: 0.2, blur: 3 }}
        environment="sunset"
        preset="portrait"
        intensity={envMapIntensity}
      >
        <mesh position-y={1} position-x={-2} castShadow>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>

        <mesh position-y={1} ref={cube} position-x={2} scale={1.5} castShadow>
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </Stage>
    </>
  );
}
