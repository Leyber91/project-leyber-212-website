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

scene.add(parentObject);

camera.position.z = 5;

let isAnimating = true;
let scale = 1;
let speed = 0.01;
let directionX = 0;
let directionY = 0;
let directionZ = 0;

function generateTesseractVertices() {
  const vertices = [];
  for (let i = 0; i < 16; i++) {
    vertices.push(new THREE.Vector4(
      (i & 1) * 2 - 1,
      ((i >> 1) & 1) * 2 - 1,
      ((i >> 2) & 1) * 2 - 1,
      ((i >> 3) & 1) * 2 - 1
    ));
  }
  return vertices;
}

function project4DTo3D(vertices4D) {
  const vertices3D = [];
  const w = 2; // You can adjust this value to change the separation between the inner and outer cubes

  for (const vertex of vertices4D) {
    const projectedVertex = new THREE.Vector3(
      vertex.x + vertex.w * w,
      vertex.y + vertex.w * w,
      vertex.z + vertex.w * w
    );
    vertices3D.push(projectedVertex);
  }
  return vertices3D;
}


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

function resetCubeGeometry() {
  const geometry = new THREE.BoxGeometry();
  cube.geometry.dispose();
  cube.geometry = new THREE.EdgesGeometry(geometry);
}

function hammingDistance(a, b) {
  let distance = 0;
  let xor = a ^ b;
  while (xor) {
    distance += xor & 1;
    xor >>= 1;
  }
  return distance;
}
// Generate the adjacency matrix for the tesseract
function generateTesseractAdjacencyMatrix() {
  const matrix = new Array(16).fill(null).map(() => new Array(16).fill(0));

  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      if (hammingDistance(i, j) === 1) {
        matrix[i][j] = 1;
        matrix[j][i] = 1;
      }
    }
  }

  return matrix;
}

const tesseractAdjacencyMatrix = generateTesseractAdjacencyMatrix();

dimensionSelector.addEventListener("change", (e) => {
  const selectedDimension = parseInt(e.target.value);
  if (selectedDimension <= 3) {
    resetCubeGeometry();
    const matrix = new THREE.Matrix4();
    matrix.set(
      1, 0, 0, 0,
      0, selectedDimension > 1 ? 1 : 0, 0, 0,
      0, 0, selectedDimension > 2 ? 1 : 0, 0,
      0, 0, 0, 1
    );
    cube.geometry.applyMatrix4(matrix);
  } else {
    const tesseractVertices = generateTesseractVertices();
    const projectedVertices = project4DTo3D(tesseractVertices);
    const lines = [];

    // Create a Set to store unique line pairs
    const uniqueLinePairs = new Set();

    for (let i = 0; i < tesseractAdjacencyMatrix.length; i++) {
      for (let j = i + 1; j < tesseractAdjacencyMatrix[i].length; j++) {
        if (tesseractAdjacencyMatrix[i][j] === 1) {
          uniqueLinePairs.add(JSON.stringify([i, j])); // Add the line pair as a string
        }
      }
    }

    // Iterate over the unique line pairs and create lines
    for (const pairStr of uniqueLinePairs) {
      const [i, j] = JSON.parse(pairStr);
      lines.push(projectedVertices[i], projectedVertices[j]);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(lines);
    cube.geometry.dispose();
    cube.geometry = new THREE.EdgesGeometry(geometry);
    cube.material.needsUpdate = true;
  }
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

     
