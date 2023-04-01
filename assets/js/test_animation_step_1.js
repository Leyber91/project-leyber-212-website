const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("animation") });
renderer.setSize(window.innerWidth, window.innerHeight);
const canvas = document.getElementById("animation");
canvas.removeAttribute("width");
canvas.removeAttribute("height");

const geometry = new THREE.BoxGeometry();
const edges = new THREE.EdgesGeometry(geometry);
const line = new THREE.LineSegments(
  edges,
  new THREE.LineBasicMaterial({ color: 0xffffff })
);

scene.add(line);

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
    line.rotation.x += speed;
    line.rotation.y += speed;
  }

  line.scale.set(scale, scale, scale);

  renderer.render(scene, camera);
};

animate();

const container = document.querySelector('.animation-container');


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
