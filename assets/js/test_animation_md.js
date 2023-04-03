class Vector5 {
  constructor(x, y, z, w, u) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.u = u;
  }
}

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
  const w = 2; // You can adjust this value to change the size of the inner cube

  for (const vertex of vertices4D) {
    const projectedVertex = new THREE.Vector3(
      vertex.x / (vertex.w + w),
      vertex.y / (vertex.w + w),
      vertex.z / (vertex.w + w)
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
  cube.geometry.dispose();
  const geometry = new THREE.BoxGeometry();
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  cube.geometry = edgesGeometry;
}


function resetPenteractGeometry() {
  cube.geometry.dispose();
  const vertices5D = generatePenteractVertices();
  const vertices3D = project5DTo3D(vertices5D);
  const geometry = new THREE.BufferGeometry().setFromPoints(vertices3D);
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  cube.geometry = edgesGeometry;
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

// 1. Update the generateTesseractVertices function to generate 5D vertices and rename it to generatePenteractVertices
function generatePenteractVertices() {
  const vertices = [];
  for (let i = 0; i < 32; i++) {
    const x = (i & 1) * 2 - 1;
    const y = ((i >> 1) & 1) * 2 - 1;
    const z = ((i >> 2) & 1) * 2 - 1;
    const w = ((i >> 3) & 1) * 2 - 1;
    const u = ((i >> 4) & 1) * 2 - 1;

    const vw = 2; // Adjust this value to change the size of the inner tesseract
    const vu = 3; // Adjust this value to change the size of the inner cubes

    const px = x + w / (w + vw) + u / (u + vu);
    const py = y + w / (w + vw) + u / (u + vu);
    const pz = z + w / (w + vw) + u / (u + vu);

    vertices.push(new THREE.Vector3(px, py, pz));
  }
  return vertices;
}


// ...


// Function to create cubes
function createCube(scale, color) {
  
  const cubeGeometry = new THREE.BoxGeometry(scale, scale, scale);
  const edges = new THREE.EdgesGeometry(cubeGeometry);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: color })
  );
  return line;
}

// Function to create a penteract model with interconnected cubes
function createPenteractModel() {
  const penteract = new THREE.Object3D();

  const outerCube = createCube(1, 0xffffff);
  const innerCube = createCube(0.5, 0xff0000);
  outerCube.add(innerCube);

  // Connect the vertices of the outer cube to the corresponding vertices of the inner cube
  for (let i = 0; i < 8; i++) {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3().fromArray(outerCube.geometry.attributes.position.array, i * 3),
    new THREE.Vector3().fromArray(innerCube.geometry.attributes.position.array, i * 3),

    ]);
    const line = new THREE.Line(
      lineGeometry,
      new THREE.LineBasicMaterial({ color: 0x00ff00 })
    );
    outerCube.add(line);
  }

  const faceCubes = [];
  for (let i = 0; i < 6; i++) {
    const faceCube = createCube(0.25, 0x0000ff);
    const smallerCube = createCube(0.125, 0xffff00);
    faceCube.add(smallerCube);
    faceCubes.push(faceCube);
  }

  // Position the smaller cubes on the faces of the outer cube and connect their vertices
  for (let i = 0; i < 6; i++) {
    const faceCube = faceCubes[i];
    const axis = Math.floor(i / 2);
    const direction = (i % 2) * 2 - 1;
    faceCube.position.set(
      axis === 0 ? direction * 0.5 : 0,
      axis === 1 ? direction * 0.5 : 0,
      axis === 2 ? direction * 0.5 : 0
    );

    // Connect the vertices of the face cube to the corresponding vertices of the smaller cube inside it
    for (let j = 0; j < 8; j++) {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3().fromArray(faceCube.geometry.attributes.position.array, j * 3),
        new THREE.Vector3().fromArray(faceCube.children[0].geometry.attributes.position.array, j * 3),
      ]);
      const line = new THREE.Line(
        lineGeometry,
        new THREE.LineBasicMaterial({ color: 0x00ff00 })
      );
      faceCube.add(line);
    }
    outerCube.add(faceCube);
  }

  penteract.add(outerCube);
  return penteract;
}


// ...

let penteractModel = createPenteractModel();

function generatePenteractVertices() {
  const vertices = [];
  for (let i = 0; i < 32; i++) {
    vertices.push(new THREE.Vector5(
      (i & 1) * 2 - 1,
      ((i >> 1) & 1) * 2 - 1,
      ((i >> 2) & 1) * 2 - 1,
      ((i >> 3) & 1) * 2 - 1,
      ((i >> 4) & 1) * 2 - 1
    ));
  }
  return vertices;
}

function project5DTo3D(vertices5D) {
  const vertices3D = [];
  const w = 2;
  const u = 3;

  for (const vertex of vertices5D) {
    const projectedVertex = new THREE.Vector3(
      vertex.x / (vertex.w + w) + vertex.u / (vertex.u + u),
      vertex.y / (vertex.w + w) + vertex.u / (vertex.u + u),
      vertex.z / (vertex.w + w) + vertex.u / (vertex.u + u)
    );
    vertices3D.push(projectedVertex);
  }
  return vertices3D;
}

// 2. Update the project4DTo3D function to project 5D vertices to 3D and rename it to project5DTo3D

dimensionSelector.addEventListener("change", (e) => {
  resetCubeGeometry();
  const selectedDimension = parseInt(e.target.value);
  if (selectedDimension <= 3) {
    const matrix = new THREE.Matrix4();
    matrix.set(
      1, 0, 0, 0,
      0, selectedDimension > 1 ? 1 : 0, 0, 0,
      0, 0, selectedDimension > 2 ? 1 : 0, 0,
      0, 0, 0, 1
    );
    cube.geometry.applyMatrix4(matrix);
  } else if (selectedDimension === 4) {
    const tesseractVertices = generateTesseractVertices();
    const projectedVertices = project4DTo3D(tesseractVertices);
    const lines = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        if (hammingDistance(i, j) === 1) {
          lines.push(projectedVertices[i], projectedVertices[j]);
        }
      }
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(lines);
    cube.geometry.dispose();
    cube.geometry = geometry;
  } else if (selectedDimension === 5) {
    resetPenteractGeometry();

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