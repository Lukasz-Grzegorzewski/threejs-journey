import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import useGame from "./stores/useGame";

export default function Player() {
  const bodyRef = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();

  const [smoothCameraPosition] = useState(new THREE.Vector3(10, 10, 10));
  const [smoothCameraTarget] = useState(new THREE.Vector3());

  const start = useGame((state) => state.start);
  const restart = useGame((state) => state.restart);
  const end = useGame((state) => state.end);
  const blocksCount = useGame((state) => state.blocksCount);

  const jump = () => {
    //
    const origin = bodyRef.current.translation();

    origin.y -= 0.31;

    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);

    const hit = world.castRay(
      ray, // ray(origin and direction),
      10, // distance between origin and object colliding,
      true, //  - all objects in the rapier world becomes solid. (not just walls... ex: cube with just 6 walls becomes a solid full cube)
    );

    if (hit?.timeOfImpact < 0.15)
      // if the ray hits an object and it doest it within 15ms, apply an impulse to the body
      bodyRef.current.applyImpulse({ x: 0, y: 0.4, z: 0 });
  };

  const reset = () => {
    bodyRef.current.setTranslation({ x: 0, y: 1, z: 0 });
    bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }); // reset forces applied on the object
    bodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }); // reset forces applied on the object
  };

  useFrame((state, delta) => {
    /**
     * Controls
     */
    const { forward, backward, leftward, rightward } = getKeys();
    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }
    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }
    bodyRef.current.applyImpulse(impulse);
    bodyRef.current.applyTorqueImpulse(torque);

    /**
     * Camera
     */
    const bodyPosition = bodyRef.current.translation();

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    smoothCameraPosition.lerp(cameraPosition, 5 * delta); // Smooth camera movement. Delta to unify results no mater what refresh time
    smoothCameraTarget.lerp(cameraTarget, 5 * delta); // Smooth camera target. Delta to unify results no mater what refresh time

    state.camera.position.copy(smoothCameraPosition);
    state.camera.lookAt(smoothCameraTarget);

    /**
     * Phases of the game
     */
    if (bodyPosition.z < -(blocksCount * 4 + 2)) end();
    if (bodyPosition.y < -4) restart();
  });

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) => {
        if (value === "ready") reset();
      },
    );

    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) jump();
      },
    );

    const unsubscribeAny = subscribeKeys(() => {
      start();
    }); // any key down

    return () => {
      unsubscribeJump();
      unsubscribeAny();
      unsubscribeReset();
    };
  }, []);

  return (
    <RigidBody
      ref={bodyRef}
      canSleep={false}
      colliders="ball"
      position={[0, 1, 0]}
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  );
}
