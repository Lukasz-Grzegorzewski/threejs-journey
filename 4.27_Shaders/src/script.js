import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import vertexRawShader from "./shaders/rawShader/vertex-RawShaderMaterial.glsl";
import fragmentRawShader from "./shaders/rawShader/fragment-RawShaderMaterial.glsl";
import vertexShader from "./shaders/shader/vertex-ShaderMaterial.glsl";
import fragmentShader from "./shaders/shader/fragment-ShaderMaterial.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load("/textures/flag-french.jpg");

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
// Add random attribute to geometry
/*
  const count = geometry.attributes.position.count; // count of vertices
  const randoms = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    randoms[i] = Math.random();
  }
  geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
*/

// Materials
// RawShaderMaterial
const rawShaderMaterial = new THREE.RawShaderMaterial({
  vertexShader: vertexRawShader,
  fragmentShader: fragmentRawShader,
  // transparent: true,
  uniforms: {
    uFrequency: { value: new THREE.Vector2(10, 5) },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("orange") },
    uTexture: { value: flagTexture },
  },
});
const rawShaderMaterialFolder = gui.addFolder("RawShaderMaterial");
rawShaderMaterialFolder
  .add(rawShaderMaterial.uniforms.uFrequency.value, "x")
  .min(0)
  .max(20)
  .step(0.01)
  .name("frequencyX");
rawShaderMaterialFolder
  .add(rawShaderMaterial.uniforms.uFrequency.value, "y")
  .min(0)
  .max(20)
  .step(0.01)
  .name("frequencyY");

const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  // transparent: true,
  uniforms: {
    uFrequency: { value: new THREE.Vector2(10, 5) },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("orange") },
    uTexture: { value: flagTexture },
  },
});

const shaderMaterialFolder = gui.addFolder("ShaderMaterialFolder");
shaderMaterialFolder
  .add(shaderMaterial.uniforms.uFrequency.value, "x")
  .min(0)
  .max(20)
  .step(0.01)
  .name("frequencyX");
shaderMaterialFolder
  .add(shaderMaterial.uniforms.uFrequency.value, "y")
  .min(0)
  .max(20)
  .step(0.01)
  .name("frequencyY");

// Mesh
const mesh = new THREE.Mesh(geometry, rawShaderMaterial);
mesh.scale.y = 0.7;
mesh.position.y = 0.4;
scene.add(mesh);

const mesh2 = new THREE.Mesh(geometry, shaderMaterial);
mesh2.scale.y = 0.7;
mesh2.position.y = -0.4;
scene.add(mesh2);

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
  100,
);
camera.position.set(0.25, -0.25, 1);
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
const clock = new THREE.Timer();

const tick = (timestamp) => {
  clock.update(timestamp);
  const elapsedTime = clock.getElapsed();

  // Update material
  rawShaderMaterial.uniforms.uTime.value = elapsedTime;
  shaderMaterial.uniforms.uTime.value = elapsedTime + 2.5;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
