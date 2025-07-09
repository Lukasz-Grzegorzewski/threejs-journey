import * as THREE from "three"; // Import everything from the three.js library

const canvas = document.querySelector("canvas.webgl"); // Select the <canvas> element with class "webgl" in the HTML

const scene = new THREE.Scene(); // Create a new scene — the container for all 3D objects, lights, and cameras

const group = new THREE.Group(); // Create a new group to hold multiple objects together

scene.add(group); // Add the group to the scene

/*
 * Meshes(cubes)
 * A mesh is the combination of geometry (shape) and material (appearance).
 */
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1), // Create a new BoxGeometry with dimensions width 1, height 1, depth 1
  new THREE.MeshBasicMaterial({ color: 0xff0000 }) // MeshBasicMaterial is a simple material that does not respond to lighting.
);
cube1.position.x = -2;
group.add(cube1); // Add the first cube to the group

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1), // Create a new BoxGeometry with dimensions width 1, height 1, depth 1
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }) // MeshBasicMaterial is a simple material that does not respond to lighting.
);
cube2.position.x = 0;
group.add(cube2); // Add the second cube to the group

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1), // Create a new BoxGeometry with dimensions width 1, height 1, depth 1
  new THREE.MeshBasicMaterial({ color: 0x0000ff }) // MeshBasicMaterial is a simple material that does not respond to lighting.
);
cube3.position.x = 2;
group.add(cube3); // Add the third cube to the group

/**
 * Axes helper
 * The AxesHelper is a visual aid that shows the orientation of the scene.
 * It displays three colored lines representing the X (red), Y (green), and Z (blue) axes.
 * The size of the axes is set to 2 units.
 */
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper); // Add the axes helper to the scene for reference

/**
 * Positioning the Mesh
 * The position property of the mesh allows us to move it in 3D space.
 * The set method takes three arguments: x, y, and z coordinates.
 */
group.position.set(0.7, -0.6, 1);

/** * Scaling the Mesh
 * The scale property allows us to change the size of the mesh.
 * The set method takes three arguments: scale factor for x, y, and z axes
 */
group.scale.set(0.2, 0.5, 0.7); // Scale the mesh along the X axis by a factor of 2

/**
 * Rotation
 * The rotation property allows us to rotate the mesh around the X, Y, and Z axes
 * The set method takes three arguments: rotation in radians for x, y, and z axes.
 */
group.rotation.set(0.5 * Math.PI, 0.5 * Math.PI, 0.5 * Math.PI); // Rotate the mesh around the X axis by 576.25 degrees (2 * Math.PI radians), Y axis by 576.25 degrees (2 * Math.PI radians), and Z axis by 180 degrees (Math.PI radians)
group.rotation.reorder("YXZ"); // Change the order of rotation to YXZ, which can affect the final orientation of the mesh

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

// camera.lookAt(group.position); // Make the camera look at the mesh (the red cube)

scene.add(camera); // Add the camera to the scene

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
