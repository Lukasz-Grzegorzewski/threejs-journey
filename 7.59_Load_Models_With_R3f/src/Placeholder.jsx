export default function Placeholder({
  scale = [1, 1, 1],
  position = [0, 0, 0],
  color = "red",
  wireframe = true,
}) {
  return (
    <mesh receiveShadow position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
      <meshStandardMaterial color={color} wireframe={wireframe} />
    </mesh>
  );
}
