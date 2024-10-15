// vertexAnimation.js
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

/**
 * Creates a fractal sphere and adds it to the specified parent group.
 * @param {number} radius - Radius of the sphere.
 * @param {number} level - Current recursion level.
 * @param {number} color - Color of the fractal sphere.
 * @param {THREE.Group} parentGroup - The group to which the sphere will be added.
 * @returns {THREE.Mesh|null} - The created sphere mesh or null if level is 0.
 */
function createFractalSphere(radius, level, color, parentGroup) {
    if (level === 0) return null; // Base case

    const geometry = new THREE.SphereGeometry(radius, 16, 16);
    const material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true, // Hollow appearance
        transparent: true,
        opacity: 0.5,
    });
    const sphere = new THREE.Mesh(geometry, material);
    parentGroup.add(sphere);

    const numChildren = 4; // Increased for more detail
    for (let i = 0; i < numChildren; i++) {
        const child = createFractalSphere(radius * 0.5, level - 1, color, parentGroup);
        if (child) {
            const angle = (i / numChildren) * Math.PI * 2;
            child.position.set(
                Math.cos(angle) * radius * 1.5,
                Math.sin(angle) * radius * 1.5,
                (Math.random() - 0.5) * radius * 1.5
            );
            parentGroup.add(child);
        }
    }

    return sphere; // Ensure the sphere is returned
}

/**
 * Creates a particle system and returns its components.
 * @param {number} color - Hex color value.
 * @param {number} count - Number of particles.
 * @param {number} size - Size of each particle.
 * @returns {object} - Contains the particles object, geometry, and velocities.
 */
function createParticleSystem(color, count, size) {
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        velocities[i * 3] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: color,
        size: size,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    return { particles, particlesGeometry, velocities };
}

/**
 * Initializes the Welcome Animation.
 * @param {string} canvasId - The ID of the canvas element.
 */
export function initializeWelcomeAnimation(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas with ID '${canvasId}' not found.`);
        return;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const scene = new THREE.Scene();

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(
        60,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 50;

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Responsive resizing
    window.addEventListener('resize', () => {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    });

    // Cluster parameters
    const clusterCount = 3;
    const particlesPerCluster = 1000;
    const clusterRadius = 25;

    // Create clusters
    const clusters = [];
    const warmColors = [0xff6347, 0xff8c00, 0xffa500]; // Warm colors

    for (let i = 0; i < clusterCount; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particlesPerCluster * 3);
        const velocities = new Float32Array(particlesPerCluster * 3);
        const colors = new Float32Array(particlesPerCluster * 3);
        const lifespans = new Float32Array(particlesPerCluster);

        const color = new THREE.Color(warmColors[i % warmColors.length]);

        for (let j = 0; j < particlesPerCluster; j++) {
            // Position
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = Math.random() * clusterRadius;

            positions[j * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[j * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[j * 3 + 2] = r * Math.cos(phi);

            // Velocity
            velocities[j * 3] = (Math.random() - 0.5) * 0.05;
            velocities[j * 3 + 1] = (Math.random() - 0.5) * 0.05;
            velocities[j * 3 + 2] = (Math.random() - 0.5) * 0.05;

            // Color
            colors[j * 3] = color.r;
            colors[j * 3 + 1] = color.g;
            colors[j * 3 + 2] = color.b;

            // Lifespan
            lifespans[j] = Math.random() * 5 + 5; // Random lifespan between 5 and 10 seconds
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('lifespan', new THREE.BufferAttribute(lifespans, 1));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.7
        });

        const cluster = new THREE.Points(geometry, material);
        cluster.position.set((i - 1) * 25, 0, 0); // Spread clusters horizontally
        scene.add(cluster);
        clusters.push(cluster);
    }

    // Animation Loop
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const deltaTime = clock.getDelta();

        clusters.forEach((cluster, index) => {
            const positions = cluster.geometry.attributes.position.array;
            const velocities = cluster.geometry.attributes.velocity.array;
            const colors = cluster.geometry.attributes.color.array;
            const lifespans = cluster.geometry.attributes.lifespan.array;

            for (let i = 0; i < particlesPerCluster; i++) {
                // Update position
                positions[i * 3] += velocities[i * 3];
                positions[i * 3 + 1] += velocities[i * 3 + 1];
                positions[i * 3 + 2] += velocities[i * 3 + 2];

                // Update lifespan
                lifespans[i] -= deltaTime;

                if (lifespans[i] <= 0) {
                    // Reset particle
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(Math.random() * 2 - 1);
                    const r = Math.random() * clusterRadius;

                    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
                    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                    positions[i * 3 + 2] = r * Math.cos(phi);

                    velocities[i * 3] = (Math.random() - 0.5) * 0.05;
                    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
                    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05;

                    lifespans[i] = Math.random() * 5 + 5;

                    // Evolve color slightly
                    colors[i * 3] += (Math.random() - 0.5) * 0.1;
                    colors[i * 3 + 1] += (Math.random() - 0.5) * 0.1;
                    colors[i * 3 + 2] += (Math.random() - 0.5) * 0.1;
                }

                // Boundary check and velocity update
                const distance = Math.sqrt(
                    positions[i * 3] ** 2 + 
                    positions[i * 3 + 1] ** 2 + 
                    positions[i * 3 + 2] ** 2
                );

                if (distance > clusterRadius) {
                    // Learn from boundary interaction
                    velocities[i * 3] = -velocities[i * 3] * 0.9 + (Math.random() - 0.5) * 0.02;
                    velocities[i * 3 + 1] = -velocities[i * 3 + 1] * 0.9 + (Math.random() - 0.5) * 0.02;
                    velocities[i * 3 + 2] = -velocities[i * 3 + 2] * 0.9 + (Math.random() - 0.5) * 0.02;
                }

                // Add some intelligent movement
                const neighborInfluence = 0.001;
                if (i > 0 && i < particlesPerCluster - 1) {
                    velocities[i * 3] += (positions[(i-1) * 3] - positions[i * 3]) * neighborInfluence;
                    velocities[i * 3 + 1] += (positions[(i-1) * 3 + 1] - positions[i * 3 + 1]) * neighborInfluence;
                    velocities[i * 3 + 2] += (positions[(i-1) * 3 + 2] - positions[i * 3 + 2]) * neighborInfluence;
                }
            }

            cluster.geometry.attributes.position.needsUpdate = true;
            cluster.geometry.attributes.velocity.needsUpdate = true;
            cluster.geometry.attributes.color.needsUpdate = true;
            cluster.geometry.attributes.lifespan.needsUpdate = true;

            // Evolve the entire cluster
            cluster.rotation.y += 0.001 * (1 + Math.sin(clock.elapsedTime * 0.1) * 0.5);
            cluster.rotation.x += 0.0005 * (1 + Math.cos(clock.elapsedTime * 0.15) * 0.5);
        });

        renderer.render(scene, camera);
    }

    animate();
}

/**
 * Initializes the Tryverse Animation.
 * @param {string} canvasId - The ID of the canvas element.
 */
export function initializeTryverseAnimation(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas with ID '${canvasId}' not found.`);
        return;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const scene = new THREE.Scene();

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(
        60,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 100;

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Responsive resizing
    window.addEventListener('resize', () => {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    });

    // Scroll Handling
    let scrollY = window.scrollY;
    let targetScrollY = 0;

    window.addEventListener('scroll', () => {
        targetScrollY = window.scrollY;
    });

    // Smooth Scroll Interpolation
    const clock = new THREE.Clock();

    // Universe Groups
    const universeGroups = [];
    const universeColors = [0x1e90ff, 0xff6347, 0x32cd32]; // Blue, Red, Green

    /**
     * Creates a complex universe with fractal structures and particle systems.
     * @param {number} color - Hex color value.
     * @param {THREE.Vector3} position - Position of the universe.
     */
    function createUniverse(color, position) {
        const group = new THREE.Group();
        group.position.copy(position);
        scene.add(group);
        universeGroups.push(group);
    
        // Create a swarm of particles instead of a solid sphere
        const particleSystem = createParticleSystem(color, 50000, 0.03);
        group.add(particleSystem);
    
        // Energy Tendrils (modified to be particle streams)
        const tendrils = createEnergyTendrils(color, 100, 1000);
        group.add(tendrils);
    
        return group;
    }
    
    function createParticleSystem(color, count, size) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
    
        for (let i = 0; i < count * 3; i += 3) {
            // Create a spherical distribution
            const radius = 20 * (1 + Math.random() * 0.2); // Slight variation in radius
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
    
            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = radius * Math.cos(phi);
    
            // Add velocities for movement
            velocities[i] = (Math.random() - 0.5) * 0.05;
            velocities[i + 1] = (Math.random() - 0.5) * 0.05;
            velocities[i + 2] = (Math.random() - 0.5) * 0.05;
    
            const particleColor = new THREE.Color(color);
            particleColor.setHSL(particleColor.getHSL({ h: 0, s: 0, l: 0 }).h, 0.8, Math.random() * 0.5 + 0.5);
            colors[i] = particleColor.r;
            colors[i + 1] = particleColor.g;
            colors[i + 2] = particleColor.b;
        }
    
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    
        const material = new THREE.PointsMaterial({
            size: size,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
        });
    
        return new THREE.Points(geometry, material);
    }
    
    function createEnergyTendrils(color, count, points) {
        const group = new THREE.Group();
    
        for (let i = 0; i < count; i++) {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(points * 3);
            const colors = new Float32Array(points * 3);
    
            for (let j = 0; j < points * 3; j += 3) {
                positions[j] = (Math.random() - 0.5) * 100;
                positions[j + 1] = (Math.random() - 0.5) * 100;
                positions[j + 2] = (Math.random() - 0.5) * 100;
    
                const particleColor = new THREE.Color(color);
                particleColor.setHSL(particleColor.getHSL({ h: 0, s: 0, l: 0 }).h, 0.8, Math.random() * 0.5 + 0.5);
                colors[j] = particleColor.r;
                colors[j + 1] = particleColor.g;
                colors[j + 2] = particleColor.b;
            }
    
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
            const material = new THREE.PointsMaterial({
                size: 0.05,
                vertexColors: true,
                transparent: true,
                opacity: 0.5,
                blending: THREE.AdditiveBlending,
            });
    
            const tendril = new THREE.Points(geometry, material);
            group.add(tendril);
        }
    
        return group;
    }

    // Create Three Universes
    const universe1 = createUniverse(universeColors[0], new THREE.Vector3(-50, 0, 0));
    const universe2 = createUniverse(universeColors[1], new THREE.Vector3(0, 0, 0));
    const universe3 = createUniverse(universeColors[2], new THREE.Vector3(50, 0, 0));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 50, 50);
    scene.add(directionalLight);

    // Animation Loop
    const animate = function () {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    universeGroups.forEach((group, index) => {
        // Smooth rotation
        group.rotation.y += 0.0002 * Math.sin(time * 0.3 + index);
        group.rotation.x += 0.0001 * Math.cos(time * 0.2 + index);

        // Subtle pulsation
        const scale = 1 + 0.03 * Math.sin(time * 0.3 + index * Math.PI * 2 / 3);
        group.scale.setScalar(scale);

        // Color transition
        const hue = (time * 0.02 + index * 0.2) % 1;
        const color = new THREE.Color().setHSL(hue, 0.7, 0.5);

        // Update particle swarm
        const particles = group.children.find(child => child instanceof THREE.Points);
        if (particles && particles.geometry.attributes.position) {
            const positions = particles.geometry.attributes.position.array;
            const velocities = particles.geometry.attributes.velocity.array;
            for (let i = 0; i < positions.length; i += 3) {
                // Update position based on velocity
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];

                // Keep particles within a spherical boundary
                const distance = Math.sqrt(positions[i]**2 + positions[i+1]**2 + positions[i+2]**2);
                if (distance > 22 || distance < 18) {
                    velocities[i] *= -1;
                    velocities[i + 1] *= -1;
                    velocities[i + 2] *= -1;
                }

                // Add some randomness to the movement
                velocities[i] += (Math.random() - 0.5) * 0.01;
                velocities[i + 1] += (Math.random() - 0.5) * 0.01;
                velocities[i + 2] += (Math.random() - 0.5) * 0.01;
            }
            particles.geometry.attributes.position.needsUpdate = true;
            particles.geometry.attributes.velocity.needsUpdate = true;
        }

        // Animate energy tendrils (inter-universe particles)
        const tendrils = group.children.find(child => child instanceof THREE.Group);
        if (tendrils) {
            tendrils.children.forEach((tendril, i) => {
                const positions = tendril.geometry.attributes.position.array;
                for (let j = 0; j < positions.length; j += 3) {
                    positions[j] += Math.sin(time * 0.5 + j) * 0.1;
                    positions[j + 1] += Math.cos(time * 0.4 + j) * 0.1;
                    positions[j + 2] += Math.sin(time * 0.3 + j) * 0.1;

                    // Reset particles that move too far away
                    if (Math.abs(positions[j]) > 50 || Math.abs(positions[j+1]) > 50 || Math.abs(positions[j+2]) > 50) {
                        positions[j] = (Math.random() - 0.5) * 100;
                        positions[j + 1] = (Math.random() - 0.5) * 100;
                        positions[j + 2] = (Math.random() - 0.5) * 100;
                    }
                }
                tendril.geometry.attributes.position.needsUpdate = true;
            });
        }
    });

    // Universe merging effect with easing
    const mergeAmount = (Math.sin(time * 0.1) + 1) * 0.5;
    const easedMerge = mergeAmount * mergeAmount * (3 - 2 * mergeAmount); // Smooth step easing
    universe1.position.x = -50 + easedMerge * 25;
    universe3.position.x = 50 - easedMerge * 25;

    // Apply parallax effect based on scroll
    camera.position.y = -scrollY * 0.03;

    renderer.render(scene, camera);
};

    animate();
}