// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("animation") });
renderer.setSize(window.innerWidth, window.innerHeight);

// Create a hollow cube geometry
const geometry = new THREE.BoxGeometry();
const edges = new THREE.EdgesGeometry(geometry);
const line = new THREE.LineSegments(
  edges,
  new THREE.LineBasicMaterial({ color: 0x00aaff })
  );

scene.add(line);

// Position the camera
camera.position.z = 5;

// Animation loop
const animate = function () {
  requestAnimationFrame(animate);

  // Rotate the cube
  line.rotation.x += 0.01;
  line.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();
