import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Custom Object
/*
  const geometry = new THREE.BufferGeometry();
  const count = 5000;
  const positionsArray = new Float32Array(count * 3 * 3); // 50 triangles, 3 vertices each, 3 coordinates per vertex
  for (let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 2;
  }
  const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
  geometry.setAttribute("position", positionsAttribute);
*/

// Custom Object. No vertices repeat
const maxVertexCount = 10000; // number of unique vertices
const triangleCount = 5000; // number of triangles

const uniqueVertices = new Set();
const positionsList = [];
while (uniqueVertices.size < maxVertexCount) {
  const x = (Math.random() - 0.5) * 2;
  const y = (Math.random() - 0.5) * 2;
  const z = (Math.random() - 0.5) * 2;
  const key = `${x},${y},${z}`;

  if (!uniqueVertices.has(key)) {
    uniqueVertices.add(key);
    positionsList.push(x, y, z);
  }
}
const positionsArray = new Float32Array(positionsList);
const indexArray = new Uint32Array(triangleCount * 3);

for (let i = 0; i < indexArray.length; i++) {
  indexArray[i] = Math.floor(Math.random() * maxVertexCount);
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positionsArray, 3));
geometry.setIndex(new THREE.BufferAttribute(indexArray, 1));

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
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
