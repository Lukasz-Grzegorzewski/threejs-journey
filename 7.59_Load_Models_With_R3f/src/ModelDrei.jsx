// useGLTF
import { Clone, useGLTF } from "@react-three/drei";

export default function ModelDrei() {
  const model = useGLTF("./hamburger-draco.glb");

  return (
    <>
      <Clone
        receiveShadow
        castShadow
        object={model.scene}
        scale={0.35}
        position={[-3, 0, -4]}
      />
      ;
      <Clone
        receiveShadow
        castShadow
        object={model.scene}
        scale={0.35}
        position={[-3, 0, 0]}
      />
      ;
      <Clone
        receiveShadow
        castShadow
        object={model.scene}
        scale={0.35}
        position={[-3, 0, 4]}
      />
      ;
    </>
  );
}

useGLTF.preload("./hamburger-draco.glb");
