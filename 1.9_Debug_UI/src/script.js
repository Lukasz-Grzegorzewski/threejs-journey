import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

// Debug UI init
const gui = new GUI({
  width: 300,
  title: "Dubug UI controls",
  closeFolders: true,
});
// gui.hide();
// gui.close();
window.addEventListener("keydown", (event) => {
  if (event.key === "h") {
    gui.show(gui._hidden);
  }
});
const customVariable = { custom: 123, color: "#824f4f" };
const cubeFolder = gui.addFolder("Cube Folder");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  color: customVariable.color,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Debug UI
cubeFolder
  .add(mesh.position, "y")
  .min(-3)
  .max(3)
  .step(0.01)
  .name("Mesh Y Position");
cubeFolder.add(customVariable, "custom");
cubeFolder.add(mesh, "visible");
cubeFolder.add(material, "wireframe");

cubeFolder.addColor(material, "color").name("WRONG WAY - color debug"); // ! it doesnt show proper color because of thr THREE.js menage it behind the scenes for render optimalisations
cubeFolder
  .addColor(customVariable, "color")
  .onChange(() => {
    material.color.set(customVariable.color);
  })
  .name("CORRECT WAY - color debug"); // ! this is the correct way to debug color in THREE.js

customVariable.spin = () => {
  gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 });
};
cubeFolder.add(customVariable, "spin").name("Spin Mesh");

customVariable.subdivision = 2;
cubeFolder
  .add(customVariable, "subdivision")
  .min(0)
  .max(5)
  .step(1)
  .onFinishChange(() => {
    mesh.geometry.dispose(); // Dispose the old geometry
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      customVariable.subdivision,
      customVariable.subdivision,
      customVariable.subdivision
    );
  })
  .name("Subdivisions");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
