// event_horizon.js


/**
 * Event Horizon Representation
 * 
 * This module creates and manages the visual representation of the black hole's event horizon,
 * including its shadow and emissive properties.
 * 
 * Dependencies:
 * - THREE.js
 */

export function createEventHorizon(scene, blackHole, camera) {
  const geometry = new THREE.SphereGeometry(blackHole.schwarzschildRadius, 64, 64);
  
  const material = new THREE.ShaderMaterial({
    uniforms: {
      // No uniforms needed for a solid black sphere
    },
    vertexShader: `
      varying vec3 vNormal;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;

      void main() {
        // Render the event horizon as a solid black sphere
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }
    `,
    transparent: true,
    depthWrite: false,
  });

  const eventHorizon = new THREE.Mesh(geometry, material);
  scene.add(eventHorizon);

  return eventHorizon;
}
