const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("animation") });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0.8); // Add this line
const canvas = document.getElementById("animation");
canvas.removeAttribute("width");
canvas.removeAttribute("height");

const parentObject = new THREE.Object3D();

// Create cube
const cubeGeometry = new THREE.BoxGeometry();
const edges = new THREE.EdgesGeometry(cubeGeometry);
const cube = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));

// Create sphere
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

// Add both cube and sphere to the parent object
parentObject.add(cube);
parentObject.add(sphere);

// Initially hide the sphere
sphere.visible = false;

scene.add(parentObject);

camera.position.z = 5;

let isAnimating = true;
let scale = 1;
let speed = 0.01;

document.getElementById("toggleAnimation").addEventListener("click", () => {
  isAnimating = !isAnimating;
});

document.getElementById("rangeSize").addEventListener("input", (e) => {
  scale = e.target.value / 50;
});

document.getElementById("rangeSpeed").addEventListener("input", (e) => {
  speed = e.target.value * 0.01;
});

const animate = function () {
  requestAnimationFrame(animate);

  if (isAnimating) {
    parentObject.rotation.x += speed;
    parentObject.rotation.y += speed;
  }

  parentObject.scale.set(scale, scale, scale);

  renderer.render(scene, camera);
};

animate();

const container = document.querySelector('.animation-container');

// Get the shape selector element
const shapeSelector = document.getElementById("shapeSelector");

// Add event listener to handle shape changes
shapeSelector.addEventListener("change", (e) => {
  const selectedShape = e.target.value;

  if (selectedShape === "cube") {
    cube.visible = true;
    sphere.visible = false;
  } else if (selectedShape === "sphere") {
    cube.visible = false;
    sphere.visible = true;
  }
});

function onWindowResize() {
  // Update the camera aspect ratio and the renderer size
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth * 0.97, container.clientHeight * 0.97);

}

// Add the event listener to call the function when the window is resized
window.addEventListener("resize", onWindowResize, false);
// Call the function once to set the initial sizes correctly
onWindowResize();
