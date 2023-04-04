// Global variables
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#animation') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0.8);
camera.position.z = 5;
let scale = 1;
let speed = 0.01;
let directionX = 0;
let directionY = 0;
let directionZ = 0;
let isAnimating = true;

// Create a projection matrix for n dimensions
function createProjectionMatrix(n) {
    // This is a simple example, you can create a more sophisticated projection matrix if needed.
    const matrix = [];
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < n; j++) {
        row.push(Math.random() * 2 - 1);
      }
      matrix.push(row);
    }
    return matrix;
  }

  // Generate n-dimensional vertices
function generateNDimensionalVertices(n, size) {
  const vertices = [];
  const numVertices = Math.pow(2, n);

  for (let i = 0; i < numVertices; i++) {
    const vertex = [];
    for (let j = 0; j < n; j++) {
      vertex.push((i & (1 << j)) ? size : -size);
    }
    vertices.push(vertex);
  }

  return vertices;
}

// Generate adjacency matrix
function generateNDimensionalAdjacencyMatrix(vertices, n) {
    const adjacencyMatrix = [];

    for (let i = 0; i < vertices.length; i++) {
        const row = [];
        for (let j = 0; j < vertices.length; j++) {
        if (i === j) {
            row.push(false);
        } else {
            const hammingDistance = vertices[i].reduce(
            (acc, curr, idx) => acc + (curr !== vertices[j][idx] ? 1 : 0),
            0
            );
            row.push(hammingDistance === 1);
        }
        }
        adjacencyMatrix.push(row);
    }

    return adjacencyMatrix;
    }

// Projection function
function projectNDimensionalTo3D(vertices, projectionMatrix) {
    return vertices.map(vertex => {
        const projectedVertex = new THREE.Vector3();
        for (let i = 0; i < projectionMatrix.length; i++) {
            const projectedValue = vertex.reduce(
            (acc, curr, idx) => acc + (curr * projectionMatrix[i][idx]),
            0
            );
            projectedVertex.setComponent(i, projectedValue);
        }
        return projectedVertex;
        });
    }
  // Wireframe rendering function
function createNDimensionalWireframe(vertices, adjacencyMatrix, material) {
    const geometry = new THREE.BufferGeometry();

    const positionData = [];
    for (let i = 0; i < adjacencyMatrix.length; i++) {
        for (let j = 0; j < adjacencyMatrix[i].length; j++) {
        if (adjacencyMatrix[i][j]) {
            positionData.push(vertices[i].x, vertices[i].y, vertices[i].z);
            positionData.push(vertices[j].x, vertices[j].y, vertices[j].z);
            }
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionData, 3));
    return new THREE.LineSegments(geometry, material);
    }

  // Interface for selecting dimensions
    const dimensionSelector = document.querySelector('#dimensionSelector');
    
    dimensionSelector.addEventListener('change', () => {
        const dimension = parseInt(dimensionSelector.value, 10);
        scale = 3 / dimension;
      
        // Remove existing wireframes from the scene
        parentObject.remove(...parentObject.children);
      
        // Generate the n-dimensional vertices and adjacency matrix
        const vertices = generateNDimensionalVertices(dimension, 1);
        const adjacencyMatrix = generateNDimensionalAdjacencyMatrix(vertices, dimension);
      
        // Create the projection matrix and project the n-dimensional vertices to 3D
        const projectionMatrix = createProjectionMatrix(dimension);
        const projectedVertices = projectNDimensionalTo3D(vertices, projectionMatrix);
      
        // Generate the wireframe representation and add it to the scene
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        const wireframe = createNDimensionalWireframe(projectedVertices, adjacencyMatrix, material);
      
        parentObject.add(wireframe);
      });
      
// Animation and interaction


// Optimize for performance

const parentObject = new THREE.Object3D();
scene.add(parentObject);

// Scene controls
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
  

// Consider implementing level of detail (LOD) techniques, spatial partitioning, or selectively rendering only parts of the hypercube that are most relevant to the viewer.
// ...

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

  window.addEventListener('resize', onWindowResize);    