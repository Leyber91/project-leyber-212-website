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

function generateHypercubeVertices(dimension) {
  const numVertices = Math.pow(2, dimension);
  const vertices = [];

  for (let i = 0; i < numVertices; i++) {
    const vertex = new THREE.Vector10();
    for (let j = 0; j < dimension; j++) {
      vertex.setComponent(j, ((i >> j) & 1) * 2 - 1);
    }
    vertices.push(vertex);
  }
  return vertices;
}

function projectHigherDimensionTo3D(verticesHigherDimension, dimension) {
  const vertices3D = [];
  const w = 2;

  for (const vertex of verticesHigherDimension) {
    const projectedVertex = new THREE.Vector3();
    for (let i = 0; i < 3; i++) {
      let value = vertex.getComponent(i);
      for (let j = 3; j < dimension; j++) {
        value *= (vertex.getComponent(j) + w) / (2 * w);
      }
      projectedVertex.setComponent(i, value);
    }
    vertices3D.push(projectedVertex);
  }
  return vertices3D;
}

function createHigherDimensionEdgesGeometry(vertices3D, dimension) {
  const geometry = new THREE.BufferGeometry().setFromPoints(vertices3D);
  const numVertices = vertices3D.length;
  const indices = [];

  for (let i = 0; i < numVertices; i++) {
    for (let j = i + 1; j < numVertices; j++) {
      const bitmask = i ^ j;
      if (bitmask & (bitmask - 1)) continue;
      indices.push(i, j);
    }
  }

  geometry.setIndex(indices);
  return new THREE.EdgesGeometry(geometry);
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
      const verticesHigherDimension = generateHypercubeVertices(selectedDimension);
      const projectedVertices = projectHigherDimensionTo3D(verticesHigherDimension, selectedDimension);
      const geometry = createHigherDimensionEdgesGeometry(projectedVertices, selectedDimension);
      cube.geometry.dispose();
      cube.geometry = geometry;
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
  
