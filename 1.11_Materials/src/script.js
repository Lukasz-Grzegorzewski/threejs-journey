import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x999999);

// image loader
const loadingMenager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingMenager);

function loadSRGBColorSpaceTexture(url) {
  const tex = textureLoader.load(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Textures
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorColorTexture = loadSRGBColorSpaceTexture("/textures/door/color.jpg");
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = loadSRGBColorSpaceTexture("/textures/matcaps/1.png");
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");

/**
 * Objects
 */

// SPHERE1
const materialSphere1 = new THREE.MeshMatcapMaterial();
materialSphere1.matcap = matcapTexture;
// PLANE
const materialPlane1 = new THREE.MeshBasicMaterial();
materialPlane1.map = doorColorTexture;
materialPlane1.color = new THREE.Color("rgb(255, 0, 0)");
materialPlane1.alphaMap = doorAlphaTexture;
materialPlane1.side = THREE.DoubleSide;
materialPlane1.wireframe = true;
// TORUS1
const materialTorus1 = new THREE.MeshNormalMaterial();
materialTorus1.flatShading = true;
materialTorus1.transparent = true;
materialTorus1.opacity = 0.5;
// SPHERE2
const materialSphere2 = new THREE.MeshDepthMaterial();
// TORUS2
const materialTorus2 = new THREE.MeshLambertMaterial();
// SPHERE3
const materialSphere3 = new THREE.MeshPhongMaterial();
materialSphere3.shininess = 100;
materialSphere3.specular = new THREE.Color("rgb(0, 255, 0)");
// SPHERE4
const materialSphere4 = new THREE.MeshToonMaterial();
gradientTexture.generateMipmaps = false;
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
materialSphere4.gradientMap = gradientTexture;
// TORUS3
const materialTorus3 = new THREE.MeshBasicMaterial();
// SPHERE5
const materialSphere5 = new THREE.MeshBasicMaterial();

// Sphere1 geometry
const sphereMesh1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  materialSphere1
);
sphereMesh1.position.x = -1.2;
sphereMesh1.position.y = 1.2;
// Plane geometry
const planeMesh1 = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  materialPlane1
);
planeMesh1.position.x = 0;
planeMesh1.position.y = 1.2;
// Thorus1 geometry
const torusMesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 100),
  materialTorus1
);
torusMesh1.position.x = 1.2;
torusMesh1.position.y = 1.2;

// Sphere2 geometry
const sphereMesh2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  materialSphere2
);
sphereMesh2.position.x = -1.2;
sphereMesh2.position.y = 0;
// Thorus2 geometry
const torusMesh2 = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 100),
  materialTorus2
);
torusMesh2.position.x = 0;
torusMesh2.position.y = 0;
// Sphere3 geometry
const sphereMesh3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  materialSphere3
);
sphereMesh3.position.x = 1.2;
sphereMesh3.position.y = 0;

// Sphere4 geometry
const sphereMesh4 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  materialSphere4
);
sphereMesh4.position.x = -1.2;
sphereMesh4.position.y = -1.2;
// Thorus3 geometry
const torusMesh3 = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 100),
  materialTorus3
);
torusMesh3.position.x = 0;
torusMesh3.position.y = -1.2;
// Sphere3 geometry
const sphereMesh5 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  materialSphere5
);
sphereMesh5.position.x = 1.2;
sphereMesh5.position.y = -1.2;

scene.add(
  sphereMesh1,
  planeMesh1,
  torusMesh1,
  sphereMesh2,
  torusMesh2,
  sphereMesh3,
  sphereMesh4,
  torusMesh3,
  sphereMesh5
);

// Lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// Point light
const pointLight = new THREE.PointLight(0xffffff, 10);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 0;
scene.add(pointLight);

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

  // Update objects
  for (let i = 0; i < scene.children.length; i++) {
    const mesh = scene.children[i];
    if (!mesh.isMesh) continue;
    mesh.rotation.y = 0.1 * elapsedTime;
    mesh.rotation.x = -0.15 * elapsedTime;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
