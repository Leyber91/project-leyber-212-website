const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("animation") });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0.8);

const parentObject = new THREE.Object3D();

const cubeGeometry = new THREE.BoxBufferGeometry(); // Use BoxBufferGeometry

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
  const geometry = new THREE.BoxBufferGeometry(); // Use BoxBufferGeometry
  cube.geometry.dispose();
  cube.geometry = new THREE.EdgesGeometry(geometry);
}

// Creating the tesseract:
function projectToHigherDimension(geometry, dimension) {
  const angle = 0.01;
  const rotationMatrix = rotateMatrix(dimension, angle);
  const rotationMatrix3D = new THREE.Matrix4();
  rotationMatrix3D.fromArray(rotationMatrix);

  const vertices = geometry.getAttribute('position').array;
  const newVertices = new Float32Array(vertices.length);

  for (let i = 0; i < vertices.length; i += 3) {
    const vertex = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
    const vertex4D = new THREE.Vector4(vertex.x, vertex.y, vertex.z, 0);
    const rotatedVertex = vertex4D.applyMatrix4(rotationMatrix3D);
    newVertices[i] = rotatedVertex.x;
    newVertices[i + 1] = rotatedVertex.y;
    newVertices[i + 2] = rotatedVertex.z;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(newVertices, 3));
}

function createTesseract() {
    const innerCube = new THREE.BoxBufferGeometry(); // Use BoxBufferGeometry
    const outerCube = new THREE.BoxBufferGeometry(); // Use BoxBufferGeometry
    outerCube.scale(1.5, 1.5, 1.5);
  
    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries([innerCube, outerCube]);
    const tesseractGeometry = new THREE.BufferGeometry().copy(mergedGeometry);
    
    const lineSegments = new THREE.LineSegments(new THREE.EdgesGeometry(tesseractGeometry), new THREE.LineBasicMaterial({ color: 0xffffff }));
  
    return lineSegments;
  }
  
  
  function updateGeometryForTesseract() {
    const tesseract = createTesseract();
    cube.geometry.dispose();
    cube.geometry = tesseract.geometry;
    cube.edgesGeometry.dispose();
    cube.edgesGeometry = new THREE.EdgesGeometry(cube.geometry);
  }
  
  dimensionSelector.addEventListener("change", (e) => {
    resetCubeGeometry();
    const selectedDimension = parseInt(e.target.value);
    if (selectedDimension === 4) {
      updateGeometryForTesseract();
    } else {
      const matrix = new THREE.Matrix4();
      matrix.set(
        1, 0, 0, 0,
        0, selectedDimension > 1 ? 1 : 0, 0, 0,
        0, 0, selectedDimension > 2 ? 1 : 0, 0,
        0, 0, 0, 1
      );
      cube.geometry.applyMatrix4(matrix);
      cube.edgesGeometry.dispose();
      cube.edgesGeometry = new THREE.EdgesGeometry(cube.geometry);
    }
  });
  
  const animate = function () {
    requestAnimationFrame(animate);
  
    if (isAnimating) {
      const selectedDimension = parseInt(dimensionSelector.value);
      if (selectedDimension > 3) {
        projectToHigherDimension(cube.geometry, selectedDimension);
        cube.geometry.attributes.position.needsUpdate = true; // Update vertices
        cube.geometry.computeBoundingSphere();
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
  