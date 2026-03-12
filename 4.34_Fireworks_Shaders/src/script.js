import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import gsap from "gsap";
import fireworksVertexShader from "./shaders/fireworks/vertex.glsl";
import fireworksFragmentShader from "./shaders/fireworks/fragment.glsl";
import { Sky } from "three/examples/jsm/objects/Sky.js";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};
sizes.resolution = new THREE.Vector2(
  sizes.width * sizes.pixelRatio,
  sizes.height * sizes.pixelRatio,
);

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);
  sizes.resolution.set(
    sizes.width * sizes.pixelRatio,
    sizes.height * sizes.pixelRatio,
  );

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.set(1.5, 0, 6);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
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

// Textures
const textures = [
  textureLoader.load("./particles/1.png"),
  textureLoader.load("./particles/2.png"),
  textureLoader.load("./particles/3.png"),
  textureLoader.load("./particles/4.png"),
  textureLoader.load("./particles/5.png"),
  textureLoader.load("./particles/6.png"),
  textureLoader.load("./particles/7.png"),
  textureLoader.load("./particles/8.png"),
];

/**
 * Fireworks
 */
const createFirework = (count, position, size, texture, radius, color) => {
  // Geometry
  const positionsArray = new Float32Array(count * 3);
  const sizesArray = new Float32Array(count);
  const timeMultipliersArray = new Float32Array(count); // serves to randomness for twinkling, scaling, falling

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    const spherical = new THREE.Spherical(
      radius * (0.75 + Math.random() * 0.25), // it will take radius and multiply by a random number between 0.75 and 1.
      Math.random() * Math.PI, // Phi - vertical side of a sphere
      Math.random() * Math.PI * 2, // Theta - horizontal side of a sphere
    );

    const position = new THREE.Vector3();
    position.setFromSpherical(spherical);

    positionsArray[i3 + 0] = position.x;
    positionsArray[i3 + 1] = position.y;
    positionsArray[i3 + 2] = position.z;

    sizesArray[i] = Math.random();

    timeMultipliersArray[i] = Math.random() + 1; // + 1 to have a valut from 1 -> 2 so it multiplies by for example * 1.5 | * 1.2 ... and not * 0.5
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positionsArray, 3),
  );
  geometry.setAttribute(
    "aSize",
    new THREE.Float32BufferAttribute(sizesArray, 1),
  );
  geometry.setAttribute(
    "aTimeMultiplier",
    new THREE.Float32BufferAttribute(timeMultipliersArray, 1),
  );

  texture.flipY = false; // do not flip texture upside down

  // Material
  const material = new THREE.ShaderMaterial({
    vertexShader: fireworksVertexShader,
    fragmentShader: fireworksFragmentShader,
    uniforms: {
      uSize: new THREE.Uniform(size),
      uResolution: new THREE.Uniform(sizes.resolution),
      uTexture: new THREE.Uniform(texture),
      uColor: new THREE.Uniform(color),
      uProgress: new THREE.Uniform(0),
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  // Points
  const firework = new THREE.Points(geometry, material);
  firework.position.copy(position);
  scene.add(firework);

  // Destroy
  const destroy = () => {
    scene.remove(firework);
    geometry.dispose();
    material.dispose();
  };

  // Animate
  gsap.to(material.uniforms.uProgress, {
    value: 1,
    duration: 3,
    ease: "linear",
    onComplete: destroy,
  });
};

const createRandowFirework = () => {
  const count = Math.round(400 + Math.random() * 1000); // 400 - 1400
  const position = new THREE.Vector3(
    (Math.random() - 0.5) * 2, // x
    Math.random(), // y
    (Math.random() - 0.5) * 2, // z
  );
  const size = 0.1 + Math.random() * 0.1;
  const texture = textures[Math.floor(Math.random() * textures.length)];
  const radius = 0.5 + Math.random();
  const color = new THREE.Color();
  color.setHSL(Math.random(), 1, 0.7);

  createFirework(count, position, size, texture, radius, color);
};

createRandowFirework();

window.addEventListener("click", createRandowFirework);

/**
 * Sky
 */
const sky = new Sky();
sky.scale.setScalar(450000);
scene.add(sky);

const sun = new THREE.Vector3();

const skyParameters = {
  turbidity: 0.4,
  rayleigh: 2,
  mieCoefficient: 0.002,
  mieDirectionalG: 0.95,
  elevation: -0.41,
  azimuth: -160,
  exposure: renderer.toneMappingExposure,
};

const updateSky = () => {
  const uniforms = sky.material.uniforms;
  uniforms["turbidity"].value = skyParameters.turbidity;
  uniforms["rayleigh"].value = skyParameters.rayleigh;
  uniforms["mieCoefficient"].value = skyParameters.mieCoefficient;
  uniforms["mieDirectionalG"].value = skyParameters.mieDirectionalG;

  const phi = THREE.MathUtils.degToRad(90 - skyParameters.elevation);
  const theta = THREE.MathUtils.degToRad(skyParameters.azimuth);

  sun.setFromSphericalCoords(1, phi, theta);

  uniforms["sunPosition"].value.copy(sun);

  renderer.toneMappingExposure = skyParameters.exposure;
  renderer.render(scene, camera);
};

gui.add(skyParameters, "turbidity", 0.0, 20.0, 0.1).onChange(updateSky);
gui.add(skyParameters, "rayleigh", 0.0, 4, 0.001).onChange(updateSky);
gui.add(skyParameters, "mieCoefficient", 0.0, 0.1, 0.001).onChange(updateSky);
gui.add(skyParameters, "mieDirectionalG", 0.0, 1, 0.001).onChange(updateSky);
gui.add(skyParameters, "elevation", -3, 90, 0.01).onChange(updateSky);
gui.add(skyParameters, "azimuth", -180, 180, 0.1).onChange(updateSky);
gui.add(skyParameters, "exposure", 0, 1, 0.0001).onChange(updateSky);

updateSky();

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
