import { useGLTF, OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {
  CuboidCollider,
  CylinderCollider,
  Physics,
  RigidBody,
  InstancedRigidBodies,
} from "@react-three/rapier";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useState } from "react";
import { useMemo } from "react";

export default function Experience() {
  const twisterRef = useRef();
  const cubeRef = useRef();
  const [audio] = useState(new Audio("./hit.mp3"));

  const hamburger = useGLTF("./hamburger.glb");

  const cubeJump = (a) => {
    const cube = cubeRef.current;
    const mass = cube.mass();
    cube.applyImpulse({ x: 0, y: 5 * mass, z: 0 });
    cube.applyTorqueImpulse({
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
      z: Math.random() - 0.5,
    });
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const eulerRotation = new THREE.Euler(0, time * 3, 0);
    const quaternionRotation = new THREE.Quaternion();
    const a = quaternionRotation.setFromEuler(eulerRotation);
    twisterRef.current.setNextKinematicRotation(quaternionRotation);

    const angle = time * 0.3;
    const x = Math.cos(angle) * 2;
    const z = Math.sin(angle) * 2;
    if (!twisterRef.current) return;
    twisterRef.current.setNextKinematicTranslation({ x, y: -0.8, z });
  });

  const collisionEnter = () => {
    audio.currentTime = 0;
    audio.volume = Math.random();
    audio.play();
  };

  const cubesCount = 100;
  // const cubesRefs = useRef();

  // useEffect(() => {
  //   for (let i = 0; i < cubesCount; i++) {
  //     const matrix = new THREE.Matrix4();
  //     matrix.compose(
  //       new THREE.Vector3(i * 2, 0, 0), // position
  //       new THREE.Quaternion(), // Rotation
  //       new THREE.Vector3(1, 1, 1), // scale
  //     );
  //     cubesRefs.current.setMatrixAt(i, matrix);
  //   }
  // }, []);

  const instances = useMemo(() => {
    const instances = [];

    for (let i = 0; i < cubesCount; i++) {
      instances.push({
        key: "instance_" + i,
        position: [
          (Math.random() - 0.5) * 8,
          6 + i * 0.2,
          (Math.random() - 0.5) * 8,
        ],
        rotation: [Math.random(), Math.random(), Math.random()],
      });
    }

    return instances;
  }, []);

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />
      <Physics debug={false} gravity={[0, -9.81, 0]}>
        <RigidBody colliders="ball">
          <mesh castShadow position={[-1.5, 2, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        <RigidBody
          ref={cubeRef}
          position={[1.5, 2, 0]}
          gravityScale={1} //  gravityScale controls the strength of gravity
          restitution={0} // bounce (1 - means object will return to its original position)
          friction={1.5} // friction of the surface
          colliders={false}
          onCollisionEnter={collisionEnter}
          // onCollisionExit={() => console.log("exit")}
          // onSleep={() => console.log("sleep")}
          // onWake={() => console.log("wake")}
        >
          <mesh castShadow onClick={cubeJump}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
          <CuboidCollider mass={0.5} args={[0.5, 0.5, 0.5]} />
        </RigidBody>

        <RigidBody type="fixed" restitution={0} friction={0}>
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>

        <RigidBody
          ref={twisterRef}
          position={[0, -0.8, 0]}
          friction={0}
          type="kinematicPosition"
        >
          <mesh castShadow scale={[0.4, 0.4, 3]}>
            <boxGeometry />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>

        <RigidBody
          // colliders="hull"
          // colliders="trimesh"
          position={[0, 4, 0]}
          colliders={false}
        >
          <primitive object={hamburger.scene} scale={0.25} />
          <CylinderCollider args={[0.5, 1.25]} />
        </RigidBody>

        <RigidBody type="fixed">
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.25]} />
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.25]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[-5.25, 1, 0]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[5.25, 1, 0]} />
        </RigidBody>

        <InstancedRigidBodies instances={instances}>
          <instancedMesh
            // ref={cubesRefs}
            castShadow
            receiveShadow
            args={[null, null, cubesCount]}
          >
            <boxGeometry />
            <meshStandardMaterial color="tomato" />
          </instancedMesh>
        </InstancedRigidBodies>
      </Physics>
    </>
  );
}
