const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("animation") });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0.8);
const canvas = document.getElementById("animation");
canvas.removeAttribute("width");
canvas.removeAttribute("height");

const parentObject = new THREE.Object3D();

const cubeGeometry = new THREE.BoxGeometry();
const edges = new THREE.EdgesGeometry(cubeGeometry);
const cube = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
parentObject.add(cube);

scene.add(parentObject);

camera.position.z = 5;

let isAnimating = true;
let scale = 1;
let speed = 0.01;
let directionX = 0;
let directionY = 0;
let directionZ = 0;

document.getElementById("toggleAnimation").addEventListener("click", () => {
  isAnimating = !isAnimating;
});

document.getElementById("rangeSize").addEventListener("input", (e) => {
  scale = e.target.value / 50;
});

document.getElementById("rangeSpeed").addEventListener("input", (e) => {
  speed = e.target.value * 0.01;
});

document.getElementById("rangeDirectionX").addEventListener("input", (e) => {
  directionX = e.target.value * 0.01;
});

document.getElementById("rangeDirectionY").addEventListener("input", (e) => {
  directionY = e.target.value * 0.01;
});

document.getElementById("rangeDirectionZ").addEventListener("input", (e) => {
  directionZ = e.target.value * 0.01;
});

const dimensionSelector = document.getElementById("dimensionSelector");
dimensionSelector.addEventListener("change", (e) => {
  const selectedDimension = parseInt(e.target.value);
  const matrix = new THREE.Matrix4();
  matrix.set(
    1, 0, 0, 0,
    0, selectedDimension > 1 ? 1 : 0, 0, 0,
    0, 0, selectedDimension > 2 ? 1 : 0, 0,
    0, 0, 0, 1
  );
  cubeGeometry.applyMatrix4(matrix);
  cube.geometry = new THREE.EdgesGeometry(cubeGeometry);
});

const animate = function () {
  requestAnimationFrame(animate);

  if (isAnimating) {
    parentObject.rotation.x += speed * directionX;
    parentObject.rotation.y += speed * directionY;
    parentObject.rotation.z += speed * directionZ;
  }

  parentObject.scale.set(scale, scale, scale);

  renderer.render(scene, camera);
};

animate();

const container = document.querySelector('.animation-container');

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth * 0.97, container.clientHeight * 0.97);
}

window.addEventListener("resize", onWindowResize, false);
onWindowResize();
