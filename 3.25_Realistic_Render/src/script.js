import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

/**
 * Loaders
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const hdrLoader = new HDRLoader();
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
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child.isMesh) {
      // Activate shadow here
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment map
 */
// Intensity
scene.environmentIntensity = 1;
gui.add(scene, "environmentIntensity").min(0).max(10).step(0.001);

// HDR (RGBE) equirectangular
hdrLoader.load("/environmentMaps/0/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

/**
 * Directional light
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 6);
directionalLight.position.set(-4, 2.5, 2.5);
directionalLight.shadow.normalBias = 0.027;
directionalLight.shadow.bias = -0.004;
scene.add(directionalLight);

gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("Dir. light intensity");
gui
  .add(directionalLight.position, "x")
  .min(-10)
  .max(10)
  .step(0.001)
  .name("Dir. lightX");
gui
  .add(directionalLight.position, "y")
  .min(-10)
  .max(10)
  .step(0.001)
  .name("Dir. lightY");
gui
  .add(directionalLight.position, "z")
  .min(-10)
  .max(10)
  .step(0.001)
  .name("Dir. lightZ");
gui
  .add(directionalLight.shadow, "normalBias")
  .min(0)
  .max(0.1)
  .step(0.001)
  .name("Dir. light normal bias");
gui
  .add(directionalLight.shadow, "bias")
  .min(-0.1)
  .max(0.1)
  .step(0.001)
  .name("Dir. light bias");

/**
 * Shadows
 */
directionalLight.castShadow = true;
// directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.shadow.mapSize.set(1024, 1024);
// blur Shadows
// directionalLight.shadow.radius = 2; // Only for THREE.VSMShadowMap

gui.add(directionalLight, "castShadow").name("Dir. light cast shadow");

/**
 * Helpers
 */
// const directionalLightCameraHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera,
// );
// scene.add(directionalLightCameraHelper);

/**
 * Target
 */
directionalLight.target.position.set(0, 4, 0);
// directionalLight.target.updateMatrixWorld(); // No need to update the matrix world, it will be updated automatically in the next render loop
// scene.add(directionalLight.target); // No need to add the target to the scene, it is already added by default as a child of the light

/**
 * Models
 */
// Helmet
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  scene.add(gltf.scene);

  updateAllMaterials();
});

// Burger
gltfLoader.load("/models/myBurger.glb", (gltf) => {
  const burger = gltf.scene;
  burger.scale.set(0.4, 0.4, 0.4);
  burger.position.z = 4;

  scene.add(burger);

  // updateAllMaterials();
});

/*
 * Planes
 */
const bricksARMTexture = textureLoader.load(
  "/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg",
);
const bricksColorTexture = textureLoader.load(
  "/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg",
);
bricksColorTexture.colorSpace = THREE.SRGBColorSpace; // default is linear color, so we need to set it to sRGB color space for the color texture
const bricksNormalTexture = textureLoader.load(
  "/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png",
);

const floorARMTexture = textureLoader.load(
  "/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg",
);
const floorColorTexture = textureLoader.load(
  "/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg",
);
floorColorTexture.colorSpace = THREE.SRGBColorSpace; // default is linear color, so we need to set it to sRGB color space for the color texture
const floorNormalTexture = textureLoader.load(
  "/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png",
);

// Bottom plane
const planeBottom = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    normalMap: floorNormalTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
  }),
);
planeBottom.rotation.x = -Math.PI * 0.5;
scene.add(planeBottom);

// Back plane
const planeBack = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    normalMap: bricksNormalTexture,
    aoMap: bricksARMTexture,
    roughnessMap: bricksARMTexture,
    metalnessMap: bricksARMTexture,
  }),
);
planeBack.position.set(0, 4, -4);
scene.add(planeBack);

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
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Tone mapping
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3;

gui.add(renderer, "toneMapping").options({
  None: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
});
gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

/**
 * Phisycally accurate lighting
 */
renderer.useLegacyLights = false;
gui.add(renderer, "useLegacyLights").name("Legacy lights");

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
