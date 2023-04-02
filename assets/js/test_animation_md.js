const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("animation") });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0.8);

const parentObject = new THREE.Object3D();

const cubeGeometry = new THREE.BoxGeometry();

const cube = new THREE.LineSegments(
  new THREE.EdgesGeometry(cubeGeometry),
  new THREE.LineBasicMaterial({ color: 0xffffff })
);
cube.edgesGeometry = cube.geometry;
parentObject.add(cube);

const innerCube = new THREE.LineSegments(
  new THREE.EdgesGeometry(cubeGeometry),
  new THREE.LineBasicMaterial({ color: 0xffffff })
);
innerCube.edgesGeometry = innerCube.geometry;
innerCube.scale.set(0.5, 0.5, 0.5);
parentObject.add(innerCube);

// Connect the vertices of the outer and inner cubes
const connectingLinesGeometry = new THREE.Geometry();
for (let i = 0; i < cube.geometry.vertices.length; i++) {
  connectingLinesGeometry.vertices.push(cube.geometry.vertices[i]);
  connectingLinesGeometry.vertices.push(innerCube.geometry.vertices[i]);
}
const connectingLines = new THREE.LineSegments(connectingLinesGeometry, new THREE.LineBasicMaterial({ color: 0xffffff }));
parentObject.add(connectingLines);

scene.add(parentObject);

camera.position.z = 5;

const animate = function () {
  requestAnimationFrame(animate);

  parentObject.rotation.x += 0.01;
  parentObject.rotation.y += 0.01;

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
