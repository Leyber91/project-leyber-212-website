// Global variables
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#animation') });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

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
  
    // Remove existing wireframe from the scene
    if (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
     // Generate the n-dimensional vertices and adjacency matrix
  const vertices = generateNDimensionalVertices(dimension, 1);
  const adjacencyMatrix = generateNDimensionalAdjacencyMatrix(vertices, dimension);

  // Create the projection matrix and project the n-dimensional vertices to 3D
  const projectionMatrix = createProjectionMatrix(dimension);
  const projectedVertices = projectNDimensionalTo3D(vertices, projectionMatrix);

  // Generate the wireframe representation and add it to the scene
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  const wireframe = createNDimensionalWireframe(projectedVertices, adjacencyMatrix, material);
  scene.add(wireframe);

  });
// Animation and interaction
let isAnimating = true;
const toggleAnimationBtn = document.querySelector('#toggleAnimation');
toggleAnimationBtn.addEventListener('click', () => {
  isAnimating = !isAnimating;
});

// Update loop
function animate() {
  requestAnimationFrame(animate);

  if (isAnimating) {
    // Apply rotation, scaling, and
        // other adjustments to the visualization as needed
    // ...

    renderer.render(scene, camera);
  }
}

animate();

// Optimize for performance
// Consider implementing level of detail (LOD) techniques, spatial partitioning, or selectively rendering only parts of the hypercube that are most relevant to the viewer.
// ...

  