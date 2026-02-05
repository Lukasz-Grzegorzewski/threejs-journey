import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { HDRLoader } from "three/examples/jsm/Addons.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import { GroundedSkybox } from "three/addons/objects/GroundedSkybox.js";

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const hdrLoader = new HDRLoader();
const exrLoader = new EXRLoader();
const textureLoader = new THREE.TextureLoader();

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
 * Environment Map
 */
scene.environmentIntensity = 1;
scene.backgroundBlurriness = 0;
scene.backgroundIntensity = 1;
scene.backgroundRotation.y = 0;
scene.environmentRotation.y = 0;

gui
  .add(scene, "environmentIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("Env Map Intensity");
gui
  .add(scene, "backgroundBlurriness")
  .min(0)
  .max(1)
  .step(0.001)
  .name("BG Blurriness");
gui
  .add(scene, "backgroundIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("BG Intensity");
gui
  .add(scene.backgroundRotation, "y")
  .min(0)
  .max(Math.PI * 2)
  .step(0.001)
  .name("BG Rotation Y");
gui
  .add(scene.environmentRotation, "y")
  .min(0)
  .max(Math.PI * 2)
  .step(0.001)
  .name("Env Rotation Y");

// LDR cube texture
// const environmentMap = cubeTextureLoader.load([
//   "/environmentMaps/2/px.png",
//   "/environmentMaps/2/nx.png",
//   "/environmentMaps/2/py.png",
//   "/environmentMaps/2/ny.png",
//   "/environmentMaps/2/pz.png",
//   "/environmentMaps/2/nz.png",
// ]);
// scene.background = environmentMap;
// scene.environment = environmentMap; // all standard material will use this environment map

// HDR (RGBE) equirextangular
// hdrLoader.load("/environmentMaps/0/2k.hdr", (environmentMap) => {
// hdrLoader.load("/environmentMaps/blender-2k.hdr", (environmentMap) => {
// hdrLoader.load("/environmentMaps/blender-2k-studio.hdr", (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//   // scene.background = environmentMap;
//   scene.environment = environmentMap;
// });

// HDR (EXR) equirextangular
// exrLoader.load("/environmentMaps/nvidiaCanvas-4k.exr", (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//   scene.background = environmentMap;
//   scene.environment = environmentMap;
// });

// // LDR equirextangular
// textureLoader.load(
//   // "/environmentMaps/blockadesLabsSkybox/anime_art_style_japan_streets_with_cherry_blossom_.jpg",
//   // "/environmentMaps/blockadesLabsSkybox/digital_painting_neon_city_night_orange_lights_.jpg",
//   // "/environmentMaps/blockadesLabsSkybox/fantasy_lands_castles_at_night.jpg",
//   // "/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg",
//   "/environmentMaps/blockadesLabsSkybox/scifi_white_sky_scrapers_in_clouds_at_day_time.jpg",
//   (environmentMap) => {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//     environmentMap.colorSpace = THREE.SRGBColorSpace;
//     scene.background = environmentMap;
//     scene.environment = environmentMap;
//   },
// );

// Ground projected skybox
// hdrLoader.load(
//   // envMap that works well for grounded skybox :
//   "/environmentMaps/2/2k.hdr",
//   // envMap that doesn't work well for grounded skybox :
//   // "/environmentMaps/1/2k.hdr"
//   (environmentMap) => {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//     scene.environment = environmentMap;
//     // Grounded skybox
//     const skybox = new GroundedSkybox(environmentMap, 15, 70); // squashed bottom of the skybox
//     skybox.position.y = 15;
//     scene.add(skybox);
//   },
// );

/**
 * Real time environment map
 */
textureLoader.load(
  "/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg",
  (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    environmentMap.colorSpace = THREE.SRGBColorSpace;
    scene.background = environmentMap;
    // scene.environment = environmentMap;
  },
);

/**
 * Holy donut
 */
const holyDonut = new THREE.Mesh(
  new THREE.TorusGeometry(8, 0.5),
  new THREE.MeshBasicMaterial({
    color: new THREE.Color(10, 4, 2), // super bright color to better see the reflections
  }),
);
// holyDonut.material.envMap = environmentMap; // not needed when scene.environment is used
holyDonut.layers.enable(1); // put the holy donut in layer 1, so that it will only be rendered by the cube camera
holyDonut.position.y = 3.5;
scene.add(holyDonut);

/**
 * Cube render target
 */
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  type: THREE.HalfFloatType,
});
scene.environment = cubeRenderTarget.texture; // all standard material will use this environment map

// Cube camera
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
cubeCamera.position.y = 3.5;
cubeCamera.layers.set(1); // only render objects in layer 1 (holy donut)
scene.add(cubeCamera);

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    roughness: 0.3,
    metalness: 1,
    color: "#aaaaaa",
  }),
);
// torusKnot.material.envMap = environmentMap; // not needed when scene.environment is used
torusKnot.position.x = -4;
torusKnot.position.y = 4;
scene.add(torusKnot);

/**
 * Models
 */
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  // gltf.scene.position.set(0, 0, 0);
  // gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);

  // gui
  //   .add(gltf.scene.rotation, "y")
  //   .min(-Math.PI)
  //   .max(Math.PI)
  //   .step(0.001)
  //   .name("Helmet Rotation");
});

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
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
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
  // Time
  const elapsedTime = clock.getElapsedTime();

  // Holy donut rotation
  if (holyDonut) {
    holyDonut.rotation.x = Math.sin(elapsedTime) * 2;
    holyDonut.rotation.y = Math.cos(elapsedTime * 1.2) * 3;
    cubeCamera.update(renderer, scene);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
