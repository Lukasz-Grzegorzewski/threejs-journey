import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Experience from "./Experience.jsx";

const root = ReactDOM.createRoot(document.querySelector("#root"));

/**
 * Once when scene is created
 */
// const created = (state) => {
//   // state.gl.setClearColor("#ff0000", 1);
//   state.scene.background = new THREE.Color("red");
// };

root.render(
  <Canvas
    // shadows={{ type: THREE.PCFShadowMap }}
    // shadows
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [-4, 3, 6],
    }}
    // onCreated={created}
  >
    <Experience />
  </Canvas>,
);
