  // particle_system.js

  /**
   * Advanced Particle System for Black Hole Simulation with Accretion Disk and Gravitational Lensing
   * 
   * This module creates and manages a highly realistic particle system that visualizes particles forming
   * an accretion disk around a black hole. It incorporates gravitational lensing effects that bend the
   * appearance of the accretion disk and particles over the sphere, similar to the visual effects seen in "Interstellar".
   * The particles' movements are heavily influenced by the black hole's gravity, magnetic fields, and
   * frame dragging, providing an immersive and scientifically inspired experience.
   * 
   * Dependencies:
   * - THREE.js
   */


  export function createParticleSystem(scene, blackHole, camera) {
    // Configuration Parameters
    const PARTICLE_COUNT = 200000;
    const ACCRETION_DISK_OUTER_RADIUS = 120.0;
    const ACCRETION_DISK_HEIGHT = 0.5; // Thinner disk
    const EVENT_HORIZON_RADIUS = 4.0;
    const PARTICLE_SPEED_MULTIPLIER = 1.4;
    const GRAVITATIONAL_CONSTANT = 0.1;
    const PARTICLE_LIFETIME = 1000;
    const MAGNETIC_FIELD_STRENGTH = 0.5;
    const SYNCHROTRON_RADIATION_FACTOR = 0.05;
    const TRAIL_LENGTH = 50;
    const RELATIVISTIC_FACTOR = 0.1;
    const VERTICAL_ACCELERATION_FACTOR = 0.;
    const SIZE_INCREASE_FACTOR = 2.0;
    const baseSize = 1.0;
    const INWARD_ACCELERATION_FACTOR = 0.05; // Adjust as needed

  
    // Black Hole Spin Parameters
    const BLACK_HOLE_SPIN = new THREE.Vector3(0, 1, 0).normalize();
    const FRAME_DRAGGING_FACTOR = 0.1;
  
    // Gravitational Lensing Parameters
    const LENSING_FACTOR = 40.0;
    const LENSING_RADIUS = 20.0;
    const LENSING_EXPONENT = 4.0;
    const SCHWARZSCHILD_RADIUS = EVENT_HORIZON_RADIUS * 2.0;
    const ACCRETION_DISK_INNER_RADIUS = SCHWARZSCHILD_RADIUS * 1.1;

    const OUTER_LENSING_LIMIT = ACCRETION_DISK_OUTER_RADIUS * 1.1;


    // Create Buffer Geometry for Particles
    const geometry = new THREE.BufferGeometry();

    // Initialize Arrays for Particle Attributes
    const positions = new Float32Array(PARTICLE_COUNT * 3);    // Current positions
    const velocities = new Float32Array(PARTICLE_COUNT * 3);   // Current velocities
    const colors = new Float32Array(PARTICLE_COUNT * 3);       // Current colors
    const sizes = new Float32Array(PARTICLE_COUNT);            // Particle sizes
    const lifetimes = new Float32Array(PARTICLE_COUNT);        // Particle lifetimes
    const energies = new Float32Array(PARTICLE_COUNT);         // Particle energies

    // Initialize Circular Buffers for Particle Trails
    const trailPositions = new Float32Array(PARTICLE_COUNT * TRAIL_LENGTH * 3);
    const trailSizes = new Float32Array(PARTICLE_COUNT * TRAIL_LENGTH);
    const trailColors = new Float32Array(PARTICLE_COUNT * TRAIL_LENGTH * 3);
    const trailIndices = new Uint16Array(PARTICLE_COUNT * TRAIL_LENGTH);
    const trailCurrentIndex = new Uint16Array(PARTICLE_COUNT).fill(0);

    for (let i = 0; i < PARTICLE_COUNT * TRAIL_LENGTH; i++) {
      trailIndices[i] = i;
    }

    // Temporary Variables for Calculations
    const tempPosition = new THREE.Vector3();
    const tempVelocity = new THREE.Vector3();
    const tempAcceleration = new THREE.Vector3();
    const tempMagneticField = new THREE.Vector3();

    // Initialize Particle Attributes
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      resetParticle(i);
    }

    // Set Attributes to Geometry
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('energy', new THREE.BufferAttribute(energies, 1).setUsage(THREE.DynamicDrawUsage));

    // Trail Geometry using InstancedBufferGeometry for performance
    const trailGeometry = new THREE.InstancedBufferGeometry();
    const baseTrailGeometry = new THREE.BufferGeometry();
    baseTrailGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
    trailGeometry.index = baseTrailGeometry.index;
    trailGeometry.attributes.position = baseTrailGeometry.attributes.position;

    // Instance attributes for trail positions, sizes, and colors
    trailGeometry.setAttribute('instanceStart', new THREE.InstancedBufferAttribute(trailPositions, 3, false).setUsage(THREE.DynamicDrawUsage));
    trailGeometry.setAttribute('instanceSize', new THREE.InstancedBufferAttribute(trailSizes, 1, false).setUsage(THREE.DynamicDrawUsage));
    trailGeometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(trailColors, 3, false).setUsage(THREE.DynamicDrawUsage));

    // Define Shader Material for Trails with Gravitational Lensing
    const trailMaterial = new THREE.ShaderMaterial({
      uniforms: {
        trailTexture: { value: generateTrailTexture() },
        time: { value: 0.0 },
        blackHolePosition: { value: blackHole.position },
        schwarzschildRadius: { value: SCHWARZSCHILD_RADIUS },
        lensingRadius: { value: LENSING_RADIUS },
        outerLensingLimit: { value: OUTER_LENSING_LIMIT },
        lensingExponent: { value: LENSING_EXPONENT },
        lensingFactor: { value: LENSING_FACTOR },
        uCameraPosition: { value: camera.position }, // Renamed uniform
        spinParameter: { value: BLACK_HOLE_SPIN }, // New uniform
        speedOfLight: { value: 1.0 }, // Normalized units

      },
      vertexShader: `
        uniform vec3 uCameraPosition;
        uniform vec3 blackHolePosition;
        uniform float schwarzschildRadius;
        uniform float lensingFactor;
        uniform float outerLensingLimit;
        uniform float lensingRadius;
        uniform float lensingExponent;
      

        attribute vec3 instanceStart;
        attribute float instanceSize;
        attribute vec3 instanceColor;
        varying vec3 vColor;

        vec3 applyGravitationalLensing(vec3 position) {
          vec3 toCamera = uCameraPosition - position;
          vec3 toBlackHole = blackHolePosition - position;
          float r = length(toBlackHole);

          if (r > schwarzschildRadius) {
            float lensingStrength = (4.0 * schwarzschildRadius) / r;
            lensingStrength *= lensingFactor;

            vec3 bendingDirection = normalize(cross(toBlackHole, toCamera));
            position += bendingDirection * lensingStrength;
          }

          return position;
        }

        void main() {
          vColor = instanceColor;
          vec3 lensedPosition = applyGravitationalLensing(instanceStart);
          vec4 mvPosition = modelViewMatrix * vec4(lensedPosition, 1.0);
          gl_PointSize = instanceSize * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }


      `,
      fragmentShader: `
        uniform sampler2D trailTexture;
        varying vec3 vColor;

        void main() {
          float alpha = texture2D(trailTexture, gl_PointCoord.xy).a;
          gl_FragColor = vec4(vColor, alpha);
          if (gl_FragColor.a < 0.1) discard;
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
    });

    // Create the Trail System
    const trailSystem = new THREE.Points(trailGeometry, trailMaterial);
    scene.add(trailSystem);

    // Define Shader Material for Particles with Gravitational Lensing
    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: generatePointTexture() },
        time: { value: 0.0 },
        blackHolePosition: { value: blackHole.position },
        schwarzschildRadius: { value: SCHWARZSCHILD_RADIUS },
        lensingFactor: { value: LENSING_FACTOR },
        lensingExponent: { value: LENSING_EXPONENT },
        lensingRadius: { value: LENSING_RADIUS },
        outerLensingLimit: { value: OUTER_LENSING_LIMIT },
        uCameraPosition: { value: camera.position },
        spinParameter: { value: BLACK_HOLE_SPIN }, // New uniform
        speedOfLight: { value: 1.0 }, // Normalized units
      },
      vertexShader: `
        uniform vec3 uCameraPosition;
        uniform vec3 blackHolePosition;
        uniform float schwarzschildRadius;
        uniform float lensingRadius;
        uniform float lensingFactor;
        uniform float lensingExponent;
        uniform float outerLensingLimit;
        uniform float accretionDiskOuterRadius; 
        uniform vec3 spinParameter; // New uniform
        uniform float speedOfLight; // New uniform  


        attribute float size;
        attribute vec3 customColor;
        attribute float lifetime;
        attribute float energy;
        varying vec3 vColor;
        varying float vLifetime;

        vec3 applyGravitationalLensing(vec3 position) {
          vec3 toCamera = uCameraPosition - position;
          vec3 toBlackHole = blackHolePosition - position;
          float r = length(toBlackHole);

          if (r > schwarzschildRadius) {
            float lensingStrength = (4.0 * schwarzschildRadius) / r;
            lensingStrength *= lensingFactor;

            vec3 bendingDirection = normalize(cross(toBlackHole, toCamera));
            position += bendingDirection * lensingStrength;
          }

          return position;
        }


      void main() {
        vColor = customColor;
        vLifetime = lifetime;

          vec3 lensedPosition = applyGravitationalLensing(position);
          vec4 mvPosition = modelViewMatrix * vec4(lensedPosition, 1.0);

          float distance = length(mvPosition.xyz);
          float beaming = 1.0 + energy * 0.5;
          gl_PointSize = size * (300.0 / distance) * beaming;
          gl_Position = projectionMatrix * mvPosition;
        }



      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        varying float vLifetime;

        void main() {
          float alpha = texture2D(pointTexture, gl_PointCoord.xy).a;
          alpha *= vLifetime / ${PARTICLE_LIFETIME}.0;
          gl_FragColor = vec4(vColor, alpha);
          if (gl_FragColor.a < 0.01) discard;
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
    });

    // Create the Particle System
    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    /**
     * Generates a simple circular texture for particles.
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
     * Generates a simple circular texture for trails.
     * @returns {THREE.Texture} - The generated trail texture.
     */
    function generateTrailTexture() {
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
      gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = gradient;
      context.fill();

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    }

    /**
     * Updates the particle system each frame.
     * Applies gravitational and electromagnetic forces, synchrotron radiation,
     * and handles particle lifecycle and energy updates.
     * Also updates particle trails.
     * @param {number} delta - The time elapsed since the last frame (in seconds).
     */
    function updateParticles(delta) {
      const positionsArray = particleSystem.geometry.attributes.position.array;
      const velocitiesArray = particleSystem.geometry.attributes.velocity.array;
      const lifetimesArray = particleSystem.geometry.attributes.lifetime.array;
      const energiesArray = particleSystem.geometry.attributes.energy.array;
      const colorsArray = particleSystem.geometry.attributes.customColor.array;
      const sizesArray = particleSystem.geometry.attributes.size.array;

      const trailPositionsArray = trailGeometry.attributes.instanceStart.array;
      const trailSizesArray = trailGeometry.attributes.instanceSize.array;
      const trailColorsArray = trailGeometry.attributes.instanceColor.array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const index = i * 3;

        // Current Position Vector
        tempPosition.set(
          positionsArray[index],
          positionsArray[index + 1],
          positionsArray[index + 2]
        );

        // Current Velocity Vector
        tempVelocity.set(
          velocitiesArray[index],
          velocitiesArray[index + 1],
          velocitiesArray[index + 2]
        );

        // Calculate Distance from Black Hole
        const distance = tempPosition.length();

        // Apply General Relativistic Gravitational Acceleration
        if (distance > SCHWARZSCHILD_RADIUS) { // Adjusted distance check
          // Schwarzschild correction factor
          const denom = 1.0 - SCHWARZSCHILD_RADIUS / distance;
          const gamma = denom > 0 ? 1.0 / Math.sqrt(denom) : 0.0; // Safeguard against negative values

          const accelerationMagnitude = GRAVITATIONAL_CONSTANT / (distance * distance) * gamma;

          // Acceleration Vector (towards black hole)
          tempAcceleration.copy(tempPosition).normalize().multiplyScalar(-accelerationMagnitude);

          // Apply Electromagnetic Force (Lorentz Force: F = q(v × B))
          const magneticField = calculateDipoleField(tempPosition);
          const lorentzForce = tempVelocity.clone().cross(magneticField);

          // Apply Frame Dragging
          const frameDragging = BLACK_HOLE_SPIN.clone().cross(tempPosition).multiplyScalar(FRAME_DRAGGING_FACTOR);

          // Total Acceleration
          tempAcceleration.add(lorentzForce).add(frameDragging);

          // Apply Viscous Forces to keep particles in the accretion disk plane
          const diskNormal = BLACK_HOLE_SPIN;
          const heightAboveDisk = tempPosition.dot(diskNormal);
          const dampingForce = diskNormal.clone().multiplyScalar(-heightAboveDisk * 0.1);
          tempAcceleration.add(dampingForce);

          // Introduce Vertical Acceleration Near Black Hole
          if (distance < LENSING_RADIUS) {
            const normalizedDistance = (LENSING_RADIUS - distance) / (LENSING_RADIUS - SCHWARZSCHILD_RADIUS);
            const verticalAccelerationMagnitude = normalizedDistance * VERTICAL_ACCELERATION_FACTOR;

            // Calculate vertical acceleration direction (away from disk plane)
            const verticalDirection = tempPosition.clone().normalize();
            tempAcceleration.add(verticalDirection.multiplyScalar(verticalAccelerationMagnitude));
          }

          // Relativistic Correction: Limit velocity to below the speed of light (c = 1 in normalized units)
          const speed = tempVelocity.length();
          if (speed > 0.99) {
            tempVelocity.multiplyScalar(0.99 / speed);
          }

          // Update Velocity and Position
          tempVelocity.add(tempAcceleration.clone().multiplyScalar(delta));
          tempPosition.add(tempVelocity.clone().multiplyScalar(delta));

          // Synchrotron Radiation: Energy loss proportional to acceleration squared and velocity
          const synchrotronLoss = SYNCHROTRON_RADIATION_FACTOR * tempAcceleration.lengthSq() * tempVelocity.length() * delta;
          energiesArray[i] = Math.max(energiesArray[i] - synchrotronLoss, 0.1);

          // Update Color and Size Based on Distance to Black Hole
          const proximityFactor = THREE.MathUtils.smoothstep(distance, SCHWARZSCHILD_RADIUS, LENSING_RADIUS);
          sizesArray[i] = baseSize * (1.0 + proximityFactor * SIZE_INCREASE_FACTOR);

          const energyFactor = THREE.MathUtils.clamp(energiesArray[i] / 2.0, 0, 1);
          const redshiftDenom = 1.0 - SCHWARZSCHILD_RADIUS / distance;
          const redshift = redshiftDenom > 0 ? Math.sqrt(redshiftDenom) : 0.0; // Safeguard against negative values

          const colorFactor = proximityFactor;
          const color = new THREE.Color();
          color.setHSL(0.05 + 0.15 * energyFactor * redshift + colorFactor * 0.1, 1.0, 0.5 + colorFactor * 0.5);
          colorsArray[index] = color.r;
          colorsArray[index + 1] = color.g;
          colorsArray[index + 2] = color.b;

          // Decrease Lifetime
          lifetimesArray[i] -= delta * 60; // Assuming 60 FPS

          // Update Attributes
          positionsArray[index] = tempPosition.x;
          positionsArray[index + 1] = tempPosition.y;
          positionsArray[index + 2] = tempPosition.z;

          velocitiesArray[index] = tempVelocity.x;
          velocitiesArray[index + 1] = tempVelocity.y;
          velocitiesArray[index + 2] = tempVelocity.z;
        } else {
          // Particle is too close to the black hole; reset it
          resetParticle(i);
          continue;
        }

        // Reset Particle if Lifetime Expired or Energy Too Low
        if (lifetimesArray[i] <= 0 || energiesArray[i] <= 0.1 || isNaN(tempPosition.x)) {
          resetParticle(i);
          continue;
        }

        // Update Trails
        updateTrails(i);
      }

      // Inform Three.js that attributes have been updated
      particleSystem.geometry.attributes.position.needsUpdate = true;
      particleSystem.geometry.attributes.velocity.needsUpdate = true;
      particleSystem.geometry.attributes.lifetime.needsUpdate = true;
      particleSystem.geometry.attributes.energy.needsUpdate = true;
      particleSystem.geometry.attributes.customColor.needsUpdate = true;
      particleSystem.geometry.attributes.size.needsUpdate = true;

      trailGeometry.attributes.instanceStart.needsUpdate = true;
      trailGeometry.attributes.instanceSize.needsUpdate = true;
      trailGeometry.attributes.instanceColor.needsUpdate = true;

      // Update time uniform for shaders
      material.uniforms.time.value += delta;
      trailMaterial.uniforms.time.value += delta;
    }

    /**
     * Calculates a dipole magnetic field at a given position.
     * @param {THREE.Vector3} position - The position to calculate the magnetic field.
     * @returns {THREE.Vector3} - The magnetic field vector at the position.
     */
    function calculateDipoleField(position) {
      const dipoleMoment = BLACK_HOLE_SPIN.clone().multiplyScalar(MAGNETIC_FIELD_STRENGTH);
      const r = position.length();
      if (r === 0) return new THREE.Vector3(0, 0, 0); // Prevent division by zero
      const rHat = position.clone().normalize();
      const term1 = rHat.clone().multiplyScalar(3 * rHat.dot(dipoleMoment));
      const term2 = dipoleMoment;
      const magneticField = term1.sub(term2).multiplyScalar(1 / Math.pow(r, 3));
      return magneticField;
    }

    /**
     * Updates the trails for a specific particle using a circular buffer approach.
     * @param {number} i - The index of the particle to update trails for.
     */
    function updateTrails(i) {
      const trailIdx = trailCurrentIndex[i];
      const trailBaseIndex = i * TRAIL_LENGTH * 3 + trailIdx * 3;
      const trailSizeBaseIndex = i * TRAIL_LENGTH + trailIdx;
      const trailColorBaseIndex = i * TRAIL_LENGTH * 3 + trailIdx * 3;

      // Add current position to the trail
      trailPositions[trailBaseIndex] = positions[i * 3];
      trailPositions[trailBaseIndex + 1] = positions[i * 3 + 1];
      trailPositions[trailBaseIndex + 2] = positions[i * 3 + 2];

      // Update trail size based on current energy
      trailSizes[trailSizeBaseIndex] = sizes[i] * (energies[i] / 2.0);

      // Update trail color based on current energy
      trailColors[trailColorBaseIndex] = colors[i * 3];
      trailColors[trailColorBaseIndex + 1] = colors[i * 3 + 1];
      trailColors[trailColorBaseIndex + 2] = colors[i * 3 + 2];

      // Increment and wrap the trail index
      trailCurrentIndex[i] = (trailCurrentIndex[i] + 1) % TRAIL_LENGTH;
    }

    /**
     * Resets a particle to a new random position and velocity within the accretion disk.
     * @param {number} i - The index of the particle to reset.
     */
    function resetParticle(i) {
      const index = i * 3;
    
      // Random Initial Position in Cylindrical Coordinates within the Accretion Disk
      const radius = THREE.MathUtils.randFloat(
        ACCRETION_DISK_INNER_RADIUS,
        ACCRETION_DISK_OUTER_RADIUS * (1 - Math.pow(Math.random(), 3))
      );
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const height = THREE.MathUtils.randFloat(-ACCRETION_DISK_HEIGHT / 2, ACCRETION_DISK_HEIGHT / 2);
    
      const x = radius * Math.cos(theta);
      const y = height; // Small height variation for a thin disk
      const z = radius * Math.sin(theta);
    
      positions[index] = x;
      positions[index + 1] = y;
      positions[index + 2] = z;
    
      // Calculate Initial Velocity for Circular Orbit in the Accretion Disk Plane
      const orbitalSpeed = Math.sqrt(GRAVITATIONAL_CONSTANT / radius) * PARTICLE_SPEED_MULTIPLIER;
    
      const vx = -orbitalSpeed * Math.sin(theta);
      const vy = 0; // Minimal vertical motion
      const vz = orbitalSpeed * Math.cos(theta);
    
      velocities[index] = vx;
      velocities[index + 1] = vy;
      velocities[index + 2] = vz;

    

      // Reassign Energy Based on New Velocity with Relativistic Correction
      const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
      const energy = speed * (1 + RELATIVISTIC_FACTOR);
      energies[i] = energy;

      // Reassign Colors Based on New Energy
      const energyFactor = THREE.MathUtils.clamp(energy / 2.0, 0, 1);
      const color = new THREE.Color();
      color.setHSL(0.1 + 0.5 * energyFactor, 1.0, 0.5); // From reddish to bluish based on energy
      colors[index] = color.r;
      colors[index + 1] = color.g;
      colors[index + 2] = color.b;

      // Assign Random Size
      sizes[i] = THREE.MathUtils.randFloat(0.5, 2.0);

      // Reset Lifetime
      lifetimes[i] = PARTICLE_LIFETIME;

      // Initialize Trails with Current Position
      const trailBaseIndex = i * TRAIL_LENGTH * 3;
      const trailSizeBaseIndex = i * TRAIL_LENGTH;
      const trailColorBaseIndex = i * TRAIL_LENGTH * 3;

      for (let t = 0; t < TRAIL_LENGTH; t++) {
        trailPositions[trailBaseIndex + t * 3] = x;
        trailPositions[trailBaseIndex + t * 3 + 1] = y;
        trailPositions[trailBaseIndex + t * 3 + 2] = z;

        trailSizes[trailSizeBaseIndex + t] = sizes[i];

        trailColors[trailColorBaseIndex + t * 3] = color.r;
        trailColors[trailColorBaseIndex + t * 3 + 1] = color.g;
        trailColors[trailColorBaseIndex + t * 3 + 2] = color.b;
      }

      // Reset trail index
      trailCurrentIndex[i] = 0;
    }

    /**
     * Removes the particle system and trails from the scene and disposes of their resources.
     */
    function disposeParticleSystem() {
      particleSystem.geometry.dispose();
      particleSystem.material.dispose();
      scene.remove(particleSystem);

      trailSystem.geometry.dispose();
      trailSystem.material.dispose();
      scene.remove(trailSystem);
    }

    // Return the update and dispose functions for integration in the main loop
    return {
      update: updateParticles,
      dispose: disposeParticleSystem,
      particleSystem,
      trailSystem,
      material,
      trailMaterial,
    };
  }
