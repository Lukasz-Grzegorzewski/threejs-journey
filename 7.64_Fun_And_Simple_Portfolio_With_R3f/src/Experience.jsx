import {
  Text,
  Html,
  ContactShadows,
  PresentationControls,
  Float,
  Environment,
  useGLTF,
} from "@react-three/drei";

export default function Experience() {
  const computer = useGLTF(
    "https://threejs-journey.com/resources/models/macbook_model.gltf",
  );
  return (
    <>
      <Environment preset="city" />

      <color args={["#241a1a"]} attach={"background"} />

      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[-0.2, 0.2]}
        azimuth={[-1, 0.75]}
        damping={0.1}
        snap
      >
        <Float rotationIntensity={0.4}>
          {/* Light : to drop on the laptop's keyboard */}
          <rectAreaLight
            width={2.5}
            height={1.65}
            intensity={65}
            color={"#5050aa"}
            rotation={[0.1, Math.PI, 0]}
            position={[0, 0.55, -1.15]}
          />
          {/* Macbook */}
          <primitive object={computer.scene} position-y={-1.2} rotation-z={0.1}>
            {/* Screen : iframe */}
            <Html
              wrapperClass="htmlScreen"
              transform
              distanceFactor={1.17}
              position={[0, 1.56, -1.4]}
              rotation-x={-0.256}
            >
              <iframe src="https://luc-dev.com" />
            </Html>
          </primitive>
          {/* Text */}
          <Text
            font="./bangers-v20-latin-regular.woff"
            fontSize={0.6}
            position={[2, 0.75, 0.5]}
            rotation-y={-1.25}
            maxWidth={2}
            textAlign="center"
          >
            LUKASZ GRZEGORZEWSKI
          </Text>
        </Float>
      </PresentationControls>

      <ContactShadows position-y={-1.4} opacity={0.4} scale={5} blur={2.4} />
    </>
  );
}
