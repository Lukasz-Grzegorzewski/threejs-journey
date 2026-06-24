import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";

export default function CustomObject() {
  const geometryRef = useRef();

  const vericesCount = 10 * 3;

  const positions = useMemo(() => {
    const positions = new Float32Array(vericesCount * 3);

    for (let i = 0; i < positions.length; i++) {
      positions[i] = (Math.random() - 0.5) * 3;
    }

    return positions;
  }, []);

  useEffect(() => {
    geometryRef.current.computeVertexNormals();
  }, []);

  return (
    <mesh>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={vericesCount}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <meshStandardMaterial color="red" side={THREE.DoubleSide} />
    </mesh>
  );
}
