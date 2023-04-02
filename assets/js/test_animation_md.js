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

function project4DTo3D(vertices) {
    const newVertices = [];
    const w = 2; // Change this value to zoom in/out in the 4D space
  
    for (let i = 0; i < vertices.length; i++) {
      const vertex = vertices[i];
      const projectedVertex = new THREE.Vector3(
        vertex.x * (w / (w - vertex.w)),
        vertex.y * (w / (w - vertex.w)),
        vertex.z * (w / (w - vertex.w))
      );
      newVertices.push(projectedVertex);
    }
    return newVertices;
  }
  

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
    } else {
      const tesseractVertices = generateTesseractVertices();
      const geometry = new THREE.BufferGeometry().setFromPoints(tesseractVertices);
      const indices = [];
      for (let i = 0; i < 16; i++) {
        for (let j = i + 1; j < 16; j++) {
          if (hammingDistance(i, j) === 1) {
            indices.push(i, j);
          }
        }
      }
      geometry.setIndex(indices);
      cube.geometry = new THREE.EdgesGeometry(geometry);
    }
    cube.edgesGeometry.dispose();
    cube.edgesGeometry = new THREE.EdgesGeometry(cube.geometry);
  });

  function projectToHigherDimension(vertices, dimension) {
    const angle = 0.01;
    const rotationMatrix = rotateMatrix(dimension, angle);
    const rotationMatrix3D = new THREE.Matrix4();
    rotationMatrix3D.fromArray(rotationMatrix);
  
    const newVertices = [];
    for (let i = 0; i < vertices.length; i += 3) {
      const vertex = new THREE.Vector4(vertices[i], vertices[i + 1], vertices[i + 2], 0);
      const rotatedVertex = vertex.applyMatrix4(rotationMatrix3D);
      newVertices.push(rotatedVertex);
    }
    return newVertices;
  }
  
  
const animate = function () {
  requestAnimationFrame(animate);

  if (isAnimating) {
    const selectedDimension = parseInt(dimensionSelector.value);
    if (selectedDimension > 3) {
        const newVertices = projectToHigherDimension(cube.geometry.attributes.position.array, selectedDimension);
        const projectedVertices = project4DTo3D(newVertices);
        cube.geometry.setFromPoints(projectedVertices);
        cube.geometry.computeBoundingSphere();
        cube.edgesGeometry.dispose();
        cube.edgesGeometry = new THREE.EdgesGeometry(cube.geometry);
        cube.geometry = cube.edgesGeometry;
        
      }
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
  
  function identityMatrix(dimension) {
    const matrix = [];
    for (let i = 0; i < dimension; i++) {
      matrix[i] = [];
      for (let j = 0; j < dimension; j++) {
        matrix[i][j] = i === j ? 1 : 0;
      }
    }
    return matrix;
  }
  
  function rotateMatrix(dimension, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const matrix = identityMatrix(dimension);
    matrix[0][0] = c;
    matrix[0][dimension - 1] = -s;
    matrix[dimension - 1][0] = s;
    matrix[dimension - 1][dimension - 1] = c;
    return matrix;
  }