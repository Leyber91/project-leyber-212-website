// main.js

/**
 * Black Hole Simulation Main Module
 * 
 * This module initializes and manages the entire black hole simulation,
 * including scene setup, camera configuration, renderer initialization,
 * and integration of various visual components such as the skybox,
 * accretion disk, gravitational lensing, and particle system.
 * 
 * Dependencies:
 * - Three.js (imported via script tag in index.html)
 * - Custom Modules:
 *   - custom_orbit_controls.js
 *   - skybox.js
 *   - gravitational_lensing.js
 *   - accretion_disk.js
 *   - particle_system.js
 */

// Import Custom Modules (ensure correct relative paths)
import { CustomOrbitControls } from './custom_orbit_controls.js';
import { createSkybox } from './skybox.js';
import { createGravitationalLensing } from './gravitational_lensing.js';
import { createAccretionDisk } from './accretion_disk.js';
import { createParticleSystem } from './particle_system.js';

/**
 * Initialize the Simulation Once the DOM is Fully Loaded
 * This ensures that all DOM elements (like the canvas and controls)
 * are available when the script runs.
 */
document.addEventListener('DOMContentLoaded', () => {
  // **1. Scene Setup**
  const scene = new THREE.Scene();

  // **2. Camera Configuration**
  const camera = new THREE.PerspectiveCamera(
    75,                                 // Field of View
    window.innerWidth / window.innerHeight, // Aspect Ratio
    0.1,                                // Near Clipping Plane
    1000                                // Far Clipping Plane
  );
  camera.position.set(0, 5, 30);        // Position the camera

  // **3. Renderer Initialization**
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("animation"), // Reference to the canvas element
    antialias: true                              // Enable antialiasing for smoother edges
  });
  renderer.setSize(window.innerWidth, window.innerHeight);      // Set renderer size
  renderer.setPixelRatio(window.devicePixelRatio);               // Optimize for device pixel ratio
  renderer.setClearColor(0x000000, 1);                           // Set background color to black

  // **4. Custom Orbit Controls**
  const controls = new CustomOrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;           // Enable damping (inertia)
  controls.dampingFactor = 0.05;           // Damping factor
  controls.enablePan = false;              // Disable panning
  controls.minDistance = 10;               // Minimum zoom distance
  controls.maxDistance = 100;              // Maximum zoom distance

  // **5. Parent Object for Rotating Elements**
  const parentObject = new THREE.Object3D(); // Create a parent object
  scene.add(parentObject);                    // Add it to the scene

  // **6. Create Black Hole Core**
  const coreGeometry = new THREE.SphereGeometry(2, 64, 64);  // High-resolution sphere
  const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black material
  const blackHole = new THREE.Mesh(coreGeometry, coreMaterial);            // Create mesh
  parentObject.add(blackHole);                                             // Add to parent

  // **7. Procedurally Generated Skybox**
  const updateSkybox = createSkybox(scene); // Initialize skybox and get its update function

  // **8. Accretion Disk**
  const updateAccretionDisk = createAccretionDisk(scene, camera); // Initialize accretion disk

  // **9. Gravitational Lensing**
  const updateLensing = createGravitationalLensing(scene, camera); // Initialize gravitational lensing

  // **10. Enhanced Particle System**
  const particleSystem = createParticleSystem(scene); // Initialize particle system

  // **11. Control Variables for Animation**
  let isAnimating = true;    // Flag to control animation state
  let scale = 1;             // Scaling factor for the parent object
  let speed = 0.5;           // Rotation speed

  // **12. User Interface Elements and Event Listeners**

  // **Toggle Animation Button**
  const toggleAnimationBtn = document.getElementById("toggleAnimation");
  toggleAnimationBtn.addEventListener("click", () => {
    isAnimating = !isAnimating; // Toggle animation state
    toggleAnimationBtn.textContent = isAnimating ? "Stop Animation" : "Start Animation"; // Update button text
  });

  // **Size Range Slider**
  const rangeSize = document.getElementById("rangeSize");
  rangeSize.addEventListener("input", (e) => {
    scale = e.target.value / 50; // Update scale based on slider value
  });

  // **Speed Range Slider**
  const rangeSpeed = document.getElementById("rangeSpeed");
  rangeSpeed.addEventListener("input", (e) => {
    speed = e.target.value * 0.5; // Update speed based on slider value
  });

  // **Shape Selector Dropdown**
  const shapeSelector = document.getElementById("shapeSelector");
  shapeSelector.addEventListener("change", (e) => {
    const selectedShape = e.target.value; // Get selected shape

    // Remove existing black hole mesh from parent
    parentObject.remove(blackHole);

    // Create new geometry based on selection
    let newGeometry;
    switch (selectedShape) {
      case "sphere":
        newGeometry = new THREE.SphereGeometry(2, 64, 64);
        break;
      case "cube":
        newGeometry = new THREE.BoxGeometry(3, 3, 3);
        break;
      case "torus":
        newGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
        break;
      case "octahedron":
        newGeometry = new THREE.OctahedronGeometry(2);
        break;
      case "cone":
        newGeometry = new THREE.ConeGeometry(2, 4, 32);
        break;
      default:
        newGeometry = new THREE.SphereGeometry(2, 64, 64);
    }

    // Dispose of old geometry to free memory
    blackHole.geometry.dispose();
    blackHole.geometry = newGeometry; // Assign new geometry

    parentObject.add(blackHole); // Add updated mesh back to parent
  });

  // **Toggle Controls Visibility on Smaller Screens**
  const toggleBtn = document.querySelector('.toggle-btn');
  const controlsDiv = document.querySelector('.controls');

  toggleBtn.addEventListener('click', () => {
    controlsDiv.classList.toggle('active'); // Toggle 'active' class to show/hide controls
  });

  // **Window Resize Handler**
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight; // Update camera aspect
    camera.updateProjectionMatrix();                        // Apply aspect change
    renderer.setSize(window.innerWidth, window.innerHeight); // Update renderer size
  }
  window.addEventListener("resize", onWindowResize, false); // Listen for resize events

  // **Animation Loop Setup**
  const clock = new THREE.Clock(); // Clock to track time between frames

  function animate() {
    requestAnimationFrame(animate); // Request the next frame

    const delta = clock.getDelta(); // Get time elapsed since last frame

    if (isAnimating) {
      parentObject.rotation.x += speed * delta; // Rotate around X-axis
      parentObject.rotation.y += speed * delta; // Rotate around Y-axis
    }

    parentObject.scale.set(scale, scale, scale); // Apply scaling to parent object

    // Update all visual components
    updateSkybox(delta);
    updateAccretionDisk(delta);
    updateLensing(delta);
    particleSystem.update(delta); // Update particle system with delta time

    controls.update();                // Update orbit controls
    renderer.render(scene, camera);   // Render the scene from the camera's perspective
  }

  animate(); // Start the animation loop

  /**
   * Cleanup Function (Optional)
   * Call this function when you need to dispose of all resources, e.g., when navigating away from the simulation.
   */
  function disposeSimulation() {
    particleSystem.dispose();           // Dispose of particle system
    // Dispose of other components as needed
    updateSkybox = null;
    updateAccretionDisk = null;
    updateLensing = null;
    // Remove event listeners if necessary
  }

  // **Optional: Expose Cleanup Function Globally**
  window.disposeSimulation = disposeSimulation; // Allow manual cleanup via console or other scripts
});
