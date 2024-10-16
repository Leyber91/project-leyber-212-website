// File: assets/js/exomania/lighting.js

// Import necessary modules
import { temperatureToColor } from './utils.js'; // Import utility function
import { calculateLuminosity } from './utils.js'; // Import luminosity calculation

/**
 * Sets up the lighting in the scene to simulate the host star's illumination.
 * @param {THREE.Scene} scene - The Three.js scene.
 * @param {object} planetData - Data of the planet to determine star properties.
 * @returns {object} An object containing the light and optional lens flare.
 */
export function setupLighting(scene, planetData) {
  // Calculate star properties
  const starTemp = planetData.st_teff || 5778; // Effective temperature in Kelvin
  const starLuminosity = calculateLuminosity(planetData); // Relative to the Sun

  // Map temperature to color
  const starColor = temperatureToColor(starTemp);

  // Create directional light to simulate star light
  const directionalLight = new THREE.DirectionalLight(starColor, 1.0);
  directionalLight.position.set(10, 10, 10);
  directionalLight.castShadow = false; // Shadows may not be necessary for distant stars

  // Adjust light intensity based on luminosity
  directionalLight.intensity = starLuminosity;

  // Add the light to the scene
  scene.add(directionalLight);

  // Create a lens flare effect to represent the star visually
  const lensFlare = createLensFlare(starColor);
  lensFlare.position.copy(directionalLight.position);
  scene.add(lensFlare);

  // Return an object containing the light and lens flare for future updates
  return {
    light: directionalLight,
    lensFlare: lensFlare,
  };
}

/**
 * Updates the lighting based on new planet data.
 * @param {object} lighting - Object containing the light and lens flare.
 * @param {object} planetData - Data of the new planet.
 */
export function updateLighting(lighting, planetData) {
  if (!lighting || !lighting.light) return;

  const starTemp = planetData.st_teff || 5778; // Effective temperature in Kelvin
  const starLuminosity = calculateLuminosity(planetData); // Relative to the Sun

  // Map temperature to color
  const starColor = temperatureToColor(starTemp);

  // Update light color and intensity
  lighting.light.color.copy(starColor);
  lighting.light.intensity = starLuminosity;

  // Update lens flare color
  if (lighting.lensFlare) {
    updateLensFlare(lighting.lensFlare, starColor);
  }
}

/**
 * Creates a lens flare effect to represent the host star.
 * @param {THREE.Color} color - The color of the star.
 * @returns {THREE.Sprite} A sprite with lens flare effect.
 */
function createLensFlare(color) {
  // Generate a procedural texture for the flare
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Create a radial gradient
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 1)`);
  gradient.addColorStop(0.8, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 0.5)`);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  // Draw the gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  // Create a texture from the canvas
  const texture = new THREE.CanvasTexture(canvas);

  const lensFlareMaterial = new THREE.SpriteMaterial({
    map: texture,
    color: color,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });

  const lensFlare = new THREE.Sprite(lensFlareMaterial);
  lensFlare.scale.set(2, 2, 1); // Adjust the scale as needed

  return lensFlare;
}

/**
 * Updates the lens flare effect when the star color changes.
 * @param {THREE.Sprite} lensFlare - The lens flare sprite.
 * @param {THREE.Color} color - The new color of the star.
 */
function updateLensFlare(lensFlare, color) {
  lensFlare.material.color.copy(color);
  
  // Update the texture with the new color
  const canvas = lensFlare.material.map.image;
  const ctx = canvas.getContext('2d');

  // Create a new radial gradient with the updated color
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 1)`);
  gradient.addColorStop(0.8, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 0.5)`);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  // Clear the canvas and draw the new gradient
  ctx.clearRect(0, 0, 256, 256);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  // Update the texture
  lensFlare.material.map.needsUpdate = true;
}

/**
 * Adjusts the position of the light and lens flare based on camera movement.
 * @param {object} lighting - Object containing the light and lens flare.
 * @param {THREE.Camera} camera - The Three.js camera.
 */
export function updateLightPosition(lighting, camera) {
  if (!lighting || !lighting.light) return;

  // For simplicity, position the light relative to the camera
  const lightDistance = 1000; // Adjust as needed
  lighting.light.position.copy(camera.position);
  lighting.light.position.add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(lightDistance));

  // Update lens flare position
  if (lighting.lensFlare) {
    lighting.lensFlare.position.copy(lighting.light.position);
  }
}
