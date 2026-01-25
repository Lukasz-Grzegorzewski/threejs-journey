import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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
 * Objects primitives
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" }),
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" }),
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" }),
);
object3.position.x = 2;

scene.add(object1, object2, object3);

// Objects to

/**
 * Object model
 */
const gltfLoader = new GLTFLoader();

let duck;
gltfLoader.load("/models/Duck/glTF/Duck.gltf", (gltf) => {
  scene.add(gltf.scene);
  duck = gltf.scene;
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(3, 2, -1);
scene.add(directionalLight);

/**
 * Raycaster
 */
const objectsToTest = [object1, object2, object3]; // Update the matrix world of the objects
const raycaster = new THREE.Raycaster();
/* const objectsToUpdateBeforeRaycaster = [object1, object2, object3]; // Update the matrix world of the objects
objectsToUpdateBeforeRaycaster.forEach((obj) => obj.updateMatrixWorld());
const rayOrigin = new THREE.Vector3(-3, 0, 0);
const rayDirection = new THREE.Vector3(1, 0, 0);
rayDirection.normalize();
raycaster.set(rayOrigin, rayDirection);
const intersect = raycaster.intersectObject(object1);
const intersects = raycaster.intersectObjects([object1, object2, object3]); */

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
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

// Click event
window.addEventListener("click", () => {
  objectsToTest.forEach((obj) => obj.updateMatrixWorld());
  objectsToTest.find((obj) =>
    obj.userData.isHovered ? console.log("Clicked on", obj) : null,
  );
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
camera.position.z = 3;
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

  // Animate objects
  object1.position.y = Math.sin(elapsedTime * 0.5) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8 + Math.PI * 0.5) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.2 + Math.PI) * 1.5;

  // Raycaster
  // const rayOrigin = new THREE.Vector3(-3, 0, 0);
  // const rayDirection = new THREE.Vector3(1, 0, 0);
  // rayDirection.normalize();
  // raycaster.set(rayOrigin, rayDirection);
  // const intersects = raycaster.intersectObjects(objectsToTest);

  // // Reset colors
  // for (const object of objectsToTest) {
  //   object.material.color.set("#ff0000");
  // }
  // for (const intersect of intersects) {
  //   intersect.object.material.color.set("#0000ff");
  // }

  // Update the raycaster to use the mouse position

  // Update the raycaster
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(objectsToTest);

  // Reset colors
  for (const object of objectsToTest) {
    object.material.color.set("#ff0000");
  }
  for (const intersect of intersects) {
    intersect.object.material.color.set("#0000ff");
  }

  // Mouse enter and leave events
  for (const object of objectsToTest) {
    if (intersects.find((intersect) => intersect.object === object)) {
      if (!object.userData.isHovered) {
        console.log("Mouse enter", object);
        object.userData.isHovered = true;
      }
    } else {
      if (object.userData.isHovered) {
        console.log("Mouse leave", object);
        object.userData.isHovered = false;
      }
    }
  }

  // Raycaster for a Duck
  if (duck) {
    const intersectDuck = raycaster.intersectObject(duck);
    duck.scale.set(1, 1, 1);
    if (intersectDuck.length) {
      duck.scale.set(1.5, 1.5, 1.5);
    }
  }
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
