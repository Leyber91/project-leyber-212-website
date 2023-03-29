// Variables for the scene, camera, and renderer
let scene, camera, renderer;

// Function to create the basic black hole sphere
function createBlackHole() {
    // Create a sphere geometry with a radius of 5 and 32 width and height segments
    const geometry = new THREE.SphereGeometry(5, 32, 32);

    // Create a simple black material for the black hole
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // Create a mesh using the geometry and material
    const blackHole = new THREE.Mesh(geometry, material);

    // Add the black hole to the scene
    scene.add(blackHole);
}

// Export the createBlackHole function so it can be used in init.js
export { createBlackHole };
