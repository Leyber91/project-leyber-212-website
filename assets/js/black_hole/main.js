// main.js

/**
 * Black Hole Simulation Main Module
 * 
 * This module initializes and manages the entire black hole simulation,
 * including scene setup, camera configuration, renderer initialization,
 * and integration of various visual components such as the skybox,
 * accretion disk, gravitational lensing, and enhanced particle system.
 * 
 * Dependencies:
 * - Three.js (imported via ES Modules)
 * - Custom Modules:
 *   - custom_orbit_controls.js
 *   - skybox.js
 *   - gravitational_lensing.js
 *   - accretion_disk.js
 *   - particle_system.js
 *   - event_horizon.js
 */

// Import Three.js as an ES Module

// Import Custom Modules
import { CustomOrbitControls } from './custom_orbit_controls.js';
import { createSkybox } from './skybox.js';
import { createGravitationalLensing } from './gravitational_lensing.js';
import { createAccretionDisk } from './accretion_disk.js';
import { createParticleSystem } from './particle_system.js';
import { createEventHorizon } from './event_horizon.js';

document.addEventListener('DOMContentLoaded', () => {
  // Scene Setup
  const scene = new THREE.Scene();

  // Camera Configuration
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 30);

  // Renderer Initialization
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("animation"),
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 1);

  // Custom Orbit Controls
  const controls = new CustomOrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.minDistance = 10;
  controls.maxDistance = 100;

  // Parent Object for Rotating Elements
  const parentObject = new THREE.Object3D();
  scene.add(parentObject);

  // Create Black Hole Core
  const blackHole = {
    mass: 1.989e30, // Mass of the sun in kg as placeholder
    schwarzschildRadius: 2 * 6.67430e-11 * 1.989e30 / Math.pow(299792458, 2), // Calculated Schwarzschild radius
    spinParameter: new THREE.Vector3(0, 1, 0), // Spin axis
    position: new THREE.Vector3(0, 0, 0),
  };

  const coreGeometry = new THREE.SphereGeometry(blackHole.schwarzschildRadius, 64, 64);
  const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const blackHoleMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  parentObject.add(blackHoleMesh);

  // Procedurally Generated Skybox
  const updateSkybox = createSkybox(scene);

  // Gravitational Lensing
  const { update: updateLensing, material: lensingMaterial } = createGravitationalLensing(scene, camera);

  // Accretion Disk
  const updateAccretionDisk = createAccretionDisk(scene, camera);

  // Enhanced Particle System
  const particleSystem = createParticleSystem(scene, blackHole, camera);

  // Event Horizon Representation
  const eventHorizon = createEventHorizon(scene, blackHole, camera);

  // Control Variables for Animation
  let isAnimating = true;
  let scale = 1;
  let speed = 0.5;

  // User Interface Elements and Event Listeners
  const toggleAnimationBtn = document.getElementById("toggleAnimation");
  toggleAnimationBtn.addEventListener("click", () => {
    isAnimating = !isAnimating;
    toggleAnimationBtn.textContent = isAnimating ? "Stop Animation" : "Start Animation";
  });

  const rangeSize = document.getElementById("rangeSize");
  rangeSize.addEventListener("input", (e) => {
    scale = e.target.value / 50;
  });

  const rangeSpeed = document.getElementById("rangeSpeed");
  rangeSpeed.addEventListener("input", (e) => {
    speed = e.target.value * 0.5;
  });

  const shapeSelector = document.getElementById("shapeSelector");
  shapeSelector.addEventListener("change", (e) => {
    const selectedShape = e.target.value;

    // Remove existing black hole mesh from parent
    parentObject.remove(blackHoleMesh);

    // Create new geometry based on selection
    let newGeometry;
    switch (selectedShape) {
      case "sphere":
        newGeometry = new THREE.SphereGeometry(blackHole.schwarzschildRadius, 64, 64);
        break;
      case "cube":
        newGeometry = new THREE.BoxGeometry(2 * blackHole.schwarzschildRadius, 2 * blackHole.schwarzschildRadius, 2 * blackHole.schwarzschildRadius);
        break;
      case "torus":
        newGeometry = new THREE.TorusGeometry(blackHole.schwarzschildRadius, 0.5 * blackHole.schwarzschildRadius, 16, 100);
        break;
      case "octahedron":
        newGeometry = new THREE.OctahedronGeometry(blackHole.schwarzschildRadius);
        break;
      case "cone":
        newGeometry = new THREE.ConeGeometry(blackHole.schwarzschildRadius, 4 * blackHole.schwarzschildRadius, 32);
        break;
      default:
        newGeometry = new THREE.SphereGeometry(blackHole.schwarzschildRadius, 64, 64);
    }

    // Dispose of old geometry
    blackHoleMesh.geometry.dispose();
    blackHoleMesh.geometry = newGeometry;

    parentObject.add(blackHoleMesh);
  });

  // Toggle Controls Visibility on Smaller Screens
  const toggleBtn = document.querySelector('.toggle-btn');
  const controlsDiv = document.querySelector('.controls');

  toggleBtn.addEventListener('click', () => {
    controlsDiv.classList.toggle('active');
  });

  // Window Resize Handler
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onWindowResize, false);

  // Animation Loop Setup
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (isAnimating) {
      parentObject.rotation.x += speed * delta;
      parentObject.rotation.y += speed * delta;
    }

    parentObject.scale.set(scale, scale, scale);

    // Update all visual components
    updateSkybox(delta);
    updateLensing(delta);
    updateAccretionDisk(delta);

    // Update uniforms
    particleSystem.material.uniforms.uCameraPosition.value.copy(camera.position);
    particleSystem.material.uniforms.blackHolePosition.value.copy(blackHole.position);
    particleSystem.trailMaterial.uniforms.uCameraPosition.value.copy(camera.position);
    particleSystem.trailMaterial.uniforms.blackHolePosition.value.copy(blackHole.position);

    particleSystem.update(delta);

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  // Cleanup Function (Optional)
  function disposeSimulation() {
    particleSystem.dispose();
    eventHorizon.geometry.dispose();
    eventHorizon.material.dispose();
    // Dispose of other components as needed
  }

  window.disposeSimulation = disposeSimulation;
});
