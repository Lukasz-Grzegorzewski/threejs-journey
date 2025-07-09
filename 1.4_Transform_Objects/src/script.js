// Import everything from the three.js library
import * as THREE from "three";

// Select the <canvas> element with class "webgl" in the HTML
const canvas = document.querySelector("canvas.webgl");

// Create a new scene — the container for all 3D objects, lights, and cameras
const scene = new THREE.Scene();

/*
 * Geometry
 * BoxGeometry creates a cube or cuboid shape.
 * Arguments: width (1), height (1), depth (1) in world units.
 * Units are arbitrary but consistent — e.g., 1 unit can be 1 meter.
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);

/*
 * Material
 * MeshBasicMaterial is a simple material that does not respond to lighting.
 * Here, it's set to pure red using hexadecimal (0xff0000).
 */
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

/*
 * Mesh
 * A mesh is the combination of geometry (shape) and material (appearance).
 */
const mesh = new THREE.Mesh(geometry, material);

// Add the mesh (red cube) to the scene so it can be rendered
scene.add(mesh);

/*
 * Sizes
 * Define the width and height of the canvas (in pixels).
 * This affects the aspect ratio and render resolution.
 */
const sizes = {
  width: 800,
  height: 600,
};

/*
 * Camera
 * PerspectiveCamera mimics the human eye.
 * First parameter: field of view (75° vertical FOV).
 * Second: aspect ratio (based on canvas size).
 * Near and far clipping planes are optional here (defaults used).
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

// Move the camera back along the Z axis so we can see the cube
// By default, the camera looks at (0, 0, 0), and the cube is centered there
camera.position.z = 3;

// Add the camera to the scene
scene.add(camera);

/*
 * Renderer
 * WebGLRenderer is responsible for rendering the scene using WebGL.
 * We bind it to the canvas we selected earlier.
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

// Set the renderer's output size to match our canvas dimensions
renderer.setSize(sizes.width, sizes.height);

/*
 * Render
 * This draws the current state of the scene from the camera's point of view.
 * At this point, it's just a red cube in front of the camera.
 */
renderer.render(scene, camera);
