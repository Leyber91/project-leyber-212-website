// particle_system.js

/**
 * Enhanced Particle System for Black Hole Simulation
 * 
 * This module creates and manages a particle system that visualizes particles orbiting
 * and being influenced by the black hole's gravitational field. It includes realistic
 * physics such as gravitational attraction, dynamic velocity adjustments, and visual
 * enhancements to represent particle behavior near the event horizon.
 * 
 * Dependencies:
 * - THREE.js (already imported in the main HTML file)
 */

export function createParticleSystem(scene) {
  // Configuration Parameters
  const PARTICLE_COUNT = 50000;          // Total number of particles
  const INITIAL_RADIUS_MIN = 10;         // Minimum initial distance from black hole
  const INITIAL_RADIUS_MAX = 60;         // Maximum initial distance from black hole
  const EVENT_HORIZON_RADIUS = 3.0;      // Radius of the black hole's event horizon
  const PARTICLE_SPEED_MULTIPLIER = 0.1; // Multiplier for initial particle velocities
  const GRAVITATIONAL_CONSTANT = 0.1;    // Simplified gravitational constant for simulation
  const PARTICLE_LIFETIME = 1000;        // Lifetime of particles before reset (in frames)

  // Create Buffer Geometry for Particles
  const geometry = new THREE.BufferGeometry();

  // Initialize Arrays for Particle Attributes
  const positions = new Float32Array(PARTICLE_COUNT * 3);    // x, y, z positions
  const velocities = new Float32Array(PARTICLE_COUNT * 3);   // vx, vy, vz velocities
  const colors = new Float32Array(PARTICLE_COUNT * 3);       // r, g, b colors
  const sizes = new Float32Array(PARTICLE_COUNT);            // Particle sizes
  const lifetimes = new Float32Array(PARTICLE_COUNT);        // Particle lifetimes

  // Temporary Variables for Calculations
  const tempPosition = new THREE.Vector3();
  const tempVelocity = new THREE.Vector3();
  const blackHolePosition = new THREE.Vector3(0, 0, 0);      // Assuming black hole is at origin

  // Initialize Particle Attributes
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Random Initial Position in Spherical Coordinates
    const radius = THREE.MathUtils.randFloat(INITIAL_RADIUS_MIN, INITIAL_RADIUS_MAX);
    const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
    const phi = THREE.MathUtils.randFloat(0, Math.PI);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Calculate Initial Velocity for Orbital Motion (Perpendicular to Radius Vector)
    // Using a simplified orbital velocity formula: v = sqrt(G * M / r)
    // Here, G * M is encapsulated in GRAVITATIONAL_CONSTANT for simplicity
    const distance = Math.sqrt(x * x + y * y + z * z);
    const orbitalSpeed = Math.sqrt(GRAVITATIONAL_CONSTANT / distance) * PARTICLE_SPEED_MULTIPLIER;

    // Direction perpendicular to radius vector (for circular orbit)
    // Using a random perpendicular direction for diversity
    const randomAngle = THREE.MathUtils.randFloat(0, Math.PI * 2);
    const vx = -y * orbitalSpeed * Math.cos(randomAngle) - z * orbitalSpeed * Math.sin(randomAngle);
    const vy = x * orbitalSpeed * Math.cos(randomAngle) - z * orbitalSpeed * Math.sin(randomAngle);
    const vz = x * orbitalSpeed * Math.sin(randomAngle) + y * orbitalSpeed * Math.cos(randomAngle);

    velocities[i * 3] = vx;
    velocities[i * 3 + 1] = vy;
    velocities[i * 3 + 2] = vz;

    // Assign Colors Based on Distance from Black Hole (Closer particles are hotter)
    const distanceFactor = THREE.MathUtils.clamp((distance - INITIAL_RADIUS_MIN) / (INITIAL_RADIUS_MAX - INITIAL_RADIUS_MIN), 0, 1);
    const color = new THREE.Color();
    color.setHSL(0.6 - 0.5 * distanceFactor, 1.0, 0.5); // From blue to red based on distance
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    // Assign Random Sizes within a Range
    sizes[i] = THREE.MathUtils.randFloat(0.5, 3.0);

    // Initialize Lifetimes
    lifetimes[i] = PARTICLE_LIFETIME;
  }

  // Set Attributes to Geometry
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
  geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));

  // Define Shader Material for Particles
  const material = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: { value: generatePointTexture() }, // Procedurally generated point texture
      blackHolePosition: { value: blackHolePosition },
      eventHorizonRadius: { value: EVENT_HORIZON_RADIUS },
    },
    vertexShader: `
      attribute float size;
      attribute vec3 customColor;
      attribute float lifetime;
      varying vec3 vColor;
      varying float vLifetime;
      void main() {
        vColor = customColor;
        vLifetime = lifetime;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        // Adjust point size based on distance from camera
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      varying float vLifetime;
      void main() {
        // Create a circular point with smooth edges
        float alpha = 1.0 - smoothstep(0.0, 0.5, distance(gl_PointCoord, vec2(0.5)));
        // Fade out particles as they reach the end of their lifetime
        alpha *= vLifetime / ${PARTICLE_LIFETIME}.0;
        gl_FragColor = vec4(vColor, alpha);
        // Discard fragments with low alpha to create transparency
        if (gl_FragColor.a < 0.01) discard;
      }
    `,
    blending: THREE.AdditiveBlending, // Additive blending for glowing effect
    depthTest: false,                  // Disable depth testing for better blending
    transparent: true,                 // Enable transparency
  });

  // Create the Particle System
  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  /**
   * Generates a simple circular texture for particles.
   * This eliminates the need for external textures and ensures particles are rendered smoothly.
   * @returns {THREE.Texture} - The generated point texture.
   */
  function generatePointTexture() {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');

    // Draw a circle
    context.beginPath();
    context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    context.closePath();

    // Create gradient for smooth edges
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fill();

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  /**
   * Updates the particle system each frame.
   * Applies gravitational attraction towards the black hole and handles particle lifecycle.
   * @param {number} delta - The time elapsed since the last frame (in seconds).
   */
  function updateParticles(delta) {
    const positions = particleSystem.geometry.attributes.position.array;
    const velocities = particleSystem.geometry.attributes.velocity.array;
    const lifetimes = particleSystem.geometry.attributes.lifetime.array;
    const colors = particleSystem.geometry.attributes.customColor.array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const index = i * 3;

      // Current Position Vector
      tempPosition.set(
        positions[index],
        positions[index + 1],
        positions[index + 2]
      );

      // Current Velocity Vector
      tempVelocity.set(
        velocities[index],
        velocities[index + 1],
        velocities[index + 2]
      );

      // Calculate Distance from Black Hole
      const distance = tempPosition.length();

      // Apply Gravitational Force if outside the event horizon
      if (distance > EVENT_HORIZON_RADIUS) {
        // Gravitational Acceleration: a = G * M / r^2
        const accelerationMagnitude = GRAVITATIONAL_CONSTANT / (distance * distance);

        // Acceleration Vector (towards black hole)
        const acceleration = tempPosition.clone().multiplyScalar(-accelerationMagnitude / distance);

        // Update Velocity: v = v + a * delta
        tempVelocity.add(acceleration.multiplyScalar(delta));

        // Update Position: p = p + v * delta
        tempPosition.add(tempVelocity.clone().multiplyScalar(delta));

        // Update Attributes
        positions[index] = tempPosition.x;
        positions[index + 1] = tempPosition.y;
        positions[index + 2] = tempPosition.z;

        velocities[index] = tempVelocity.x;
        velocities[index + 1] = tempVelocity.y;
        velocities[index + 2] = tempVelocity.z;

        // Decrease Lifetime
        lifetimes[i] -= 1;
      } else {
        // Particle has crossed the event horizon; reset it
        resetParticle(i);
      }

      // Reset Particle if Lifetime Expired
      if (lifetimes[i] <= 0) {
        resetParticle(i);
      }
    }

    // Inform Three.js that attributes have been updated
    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleSystem.geometry.attributes.velocity.needsUpdate = true;
    particleSystem.geometry.attributes.lifetime.needsUpdate = true;
  }

  /**
   * Resets a particle to a new random position and velocity outside the event horizon.
   * @param {number} i - The index of the particle to reset.
   */
  function resetParticle(i) {
    const index = i * 3;

    // Random Initial Position in Spherical Coordinates
    const radius = THREE.MathUtils.randFloat(INITIAL_RADIUS_MIN, INITIAL_RADIUS_MAX);
    const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
    const phi = THREE.MathUtils.randFloat(0, Math.PI);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    positions[index] = x;
    positions[index + 1] = y;
    positions[index + 2] = z;

    // Calculate Initial Velocity for Orbital Motion
    const distance = Math.sqrt(x * x + y * y + z * z);
    const orbitalSpeed = Math.sqrt(GRAVITATIONAL_CONSTANT / distance) * PARTICLE_SPEED_MULTIPLIER;

    const randomAngle = THREE.MathUtils.randFloat(0, Math.PI * 2);
    const vx = -y * orbitalSpeed * Math.cos(randomAngle) - z * orbitalSpeed * Math.sin(randomAngle);
    const vy = x * orbitalSpeed * Math.cos(randomAngle) - z * orbitalSpeed * Math.sin(randomAngle);
    const vz = x * orbitalSpeed * Math.sin(randomAngle) + y * orbitalSpeed * Math.cos(randomAngle);

    velocities[index] = vx;
    velocities[index + 1] = vy;
    velocities[index + 2] = vz;

    // Reassign Colors Based on New Distance
    const distanceFactor = THREE.MathUtils.clamp((distance - INITIAL_RADIUS_MIN) / (INITIAL_RADIUS_MAX - INITIAL_RADIUS_MIN), 0, 1);
    const color = new THREE.Color();
    color.setHSL(0.6 - 0.5 * distanceFactor, 1.0, 0.5); // From blue to red based on distance
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;

    // Reset Lifetime
    lifetimes[i] = PARTICLE_LIFETIME;
  }

  /**
   * Removes the particle system from the scene and disposes of its resources.
   */
  function disposeParticleSystem() {
    particleSystem.geometry.dispose();
    particleSystem.material.dispose();
    scene.remove(particleSystem);
  }

  // Return the update and dispose functions for integration in the main loop
  return {
    update: updateParticles,
    dispose: disposeParticleSystem,
  };
}
