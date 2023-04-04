(function () {
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
let distortionFactor = 0;
let distortionSpeed = 0;
let rotationSpeed = 0;
let lenght;
let adjacencyMatrix; // Move adjacencyMatrix variable to the higher scope

// Optimize for performance

const parentObject = new THREE.Object3D();
scene.add(parentObject);



  function createProjectionMatrix(n) {
    const matrix = [];
    const angle = Math.PI / 4;
  
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < n; j++) {
        if (i === j) {
          row.push(Math.cos(angle));
        } else if (i === (j + 1) % n || (i === 0 && j === n - 1)) {
          row.push(-Math.sin(angle));
        } else {
          row.push(0);
        }
      }
      matrix.push(row);
    }
    return matrix;
  }
///Extra control to distort the projection
  function distortProjectionMatrix(projectionMatrix, distortionFactor) {
    const distortedMatrix = projectionMatrix.map(row =>
      row.map(value => value + distortionFactor * (Math.random() * 2 - 1))
    );
    return distortedMatrix;
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

    function createRotationMatrices(dimension, angle) {
        const rotationMatrices = [];
      
        for (let i = 0; i < dimension - 1; i++) {
          const matrix = [];
          for (let j = 0; j < dimension; j++) {
            const row = [];
            for (let k = 0; k < dimension; k++) {
              if (j === i && k === i) {
                row.push(Math.cos(angle));
              } else if (j === i && k === i + 1) {
                row.push(-Math.sin(angle));
              } else if (j === i + 1 && k === i) {
                row.push(Math.sin(angle));
              } else if (j === i + 1 && k === i + 1) {
                row.push(Math.cos(angle));
              } else if (j === k) {
                row.push(1);
              } else {
                row.push(0);
              }
            }
            matrix.push(row);
          }
          rotationMatrices.push(matrix);
        }
      
        return rotationMatrices;
      }

      function applyRotation(vertices, rotationMatrices) {
        return vertices.map(vertex => {
          let rotatedVertex = vertex.slice();
          rotationMatrices.forEach(matrix => {
            const newVertex = [];
            for (let i = 0; i < matrix.length; i++) {
              const newValue = rotatedVertex.reduce((acc, curr, idx) => acc + (curr * matrix[i][idx]), 0);
              newVertex.push(newValue);
            }
            rotatedVertex = newVertex;
          });
          return rotatedVertex;
        });
      }
      
      

  // Interface for selecting dimensions
    const dimensionSelector = document.querySelector('#dimensionSelector');
    
// Move adjacencyMatrix variable to the higher scope



dimensionSelector.addEventListener('change', () => {
  const dimension = parseInt(dimensionSelector.value, 10);
  scale = 3 / dimension;

  // Remove existing wireframes from the scene
  parentObject.remove(...parentObject.children);

  // Generate the n-dimensional vertices and adjacency matrix
  const vertices = generateNDimensionalVertices(dimension, 1);
  adjacencyMatrix = generateNDimensionalAdjacencyMatrix(vertices, dimension);

  // Create the projection matrix and project the n-dimensional vertices to 3D
  const projectionMatrix = createProjectionMatrix(dimension);
  
  // Add distortion to the projection matrix based on the distortionFactor (controlled by the range input)
  const distortedMatrix = distortProjectionMatrix(projectionMatrix, distortionFactor);

  // Project the n-dimensional vertices to 3D using the distorted projection matrix
  const projectedVertices = projectNDimensionalTo3D(vertices, distortedMatrix);

  // Generate the wireframe representation and add it to the scene
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  const wireframe = createNDimensionalWireframe(projectedVertices, adjacencyMatrix, material);

  parentObject.add(wireframe);
});

// Trigger the 'change' event to initialize the dimension and render the shape
dimensionSelector.dispatchEvent(new Event('change'));
// Animation and interaction




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

  document.getElementById("rangeDistortion").addEventListener("input", (e) => {
    distortionFactor = e.target.value * 0.01;
  
    // Update the projection matrix with the new distortion factor
    const dimension = parseInt(dimensionSelector.value, 10);
    const vertices = generateNDimensionalVertices(dimension, 1);
    const projectionMatrix = createProjectionMatrix(dimension);
    const distortedMatrix = distortProjectionMatrix(projectionMatrix, distortionFactor);
    const projectedVertices = projectNDimensionalTo3D(vertices, distortedMatrix);
  
    // Update the wireframe
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const wireframe = createNDimensionalWireframe(projectedVertices, adjacencyMatrix, material);
  
    parentObject.remove(...parentObject.children);
    parentObject.add(wireframe);
    });

  document.getElementById("rangeDistortionSpeed").addEventListener("input", (e) => {
    distortionSpeed = e.target.value * 0.0001;
    });
  
  document.getElementById("rangeRotationSpeed").addEventListener("input", (e) => {
  rotationSpeed = e.target.value * 0.01;
    });


// Consider implementing level of detail (LOD) techniques, spatial partitioning, or selectively rendering only parts of the hypercube that are most relevant to the viewer.
// ...

const animate = function () {
    requestAnimationFrame(animate);
  
    if (isAnimating) {
      parentObject.rotation.x += speed * directionX;
      parentObject.rotation.y += speed * directionY;
      parentObject.rotation.z += speed * directionZ;
  
      // Update distortionFactor and regenerate the wireframe
      distortionFactor += distortionSpeed;
      const dimension = parseInt(dimensionSelector.value, 10);
      const vertices = generateNDimensionalVertices(dimension, 1);
      const rotationMatrices = createRotationMatrices(dimension, rotationSpeed);
      const rotatedVertices = applyRotation(vertices, rotationMatrices);
      const projectionMatrix = createProjectionMatrix(dimension);
      const distortedMatrix = distortProjectionMatrix(projectionMatrix, distortionFactor);
      const projectedVertices = projectNDimensionalTo3D(vertices, distortedMatrix);
  
      const material = new THREE.LineBasicMaterial({ color: 0xffffff });
      const wireframe = createNDimensionalWireframe(projectedVertices, adjacencyMatrix, material);


  
      parentObject.remove(...parentObject.children);
      parentObject.add(wireframe);
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

})();
