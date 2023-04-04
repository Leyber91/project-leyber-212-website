// Define the vertices of the cube
const vertices = [
    new THREE.Vector3(-1, -1, -1),
    new THREE.Vector3(-1, -1, 1),
    new THREE.Vector3(-1, 1, -1),
    new THREE.Vector3(-1, 1, 1),
    new THREE.Vector3(1, -1, -1),
    new THREE.Vector3(1, -1, 1),
    new THREE.Vector3(1, 1, -1),
    new THREE.Vector3(1, 1, 1),
  ];
  
  // Define the edges of the cube
  const edges = [
    [0, 1], [0, 2], [0, 4],
    [1, 3], [1, 5],
    [2, 3], [2, 6],
    [3, 7],
    [4, 5], [4, 6],
    [5, 7],
    [6, 7]
  ];
  // Create the hollow cube
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(edges.length * 2 * 3);
  
  //let index = 0;
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    const v1 = vertices[edge[0]];
    const v2 = vertices[edge[1]];
    
    // Define the positions of the vertices for the edge
    positions[index++] = v1.x;
    positions[index++] = v1.y;
    positions[index++] = v1.z;
    positions[index++] = v2.x;
    positions[index++] = v2.y;
    positions[index++] = v2.z;
  }
  
  // Set the positions of the edges in the buffer geometry
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  // Create the mesh for the hollow cube
  const cube = new THREE.LineSegments(geometry, material);

//Teseract

// Define the vertices of the tesseract
const vertices_3 = [
    new THREE.Vector4(-1, -1, -1, -1),
    new THREE.Vector4(-1, -1, -1, 1),
    new THREE.Vector4(-1, -1, 1, -1),
    new THREE.Vector4(-1, -1, 1, 1),
    new THREE.Vector4(-1, 1, -1, -1),
    new THREE.Vector4(-1, 1, -1, 1),
    new THREE.Vector4(-1, 1, 1, -1),
    new THREE.Vector4(-1, 1, 1, 1),
    new THREE.Vector4(1, -1, -1, -1),
    new THREE.Vector4(1, -1, -1, 1),
    new THREE.Vector4(1, -1, 1, -1),
    new THREE.Vector4(1, -1, 1, 1),
    new THREE.Vector4(1, 1, -1, -1),
    new THREE.Vector4(1, 1, -1, 1),
    new THREE.Vector4(1, 1, 1, -1),
    new THREE.Vector4(1, 1, 1, 1),
  ];
  
  // Define the edges of the tesseract
  const edges_3 = [
    [0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3], [2, 6], [3, 7], [4, 5], [4, 6], [5, 7], [6, 7],
    [8, 9], [8, 10], [8, 12], [9, 11], [9, 13], [10, 11], [10, 14], [11, 15], [12, 13], [12, 14], [13, 15], [14, 15],
    [0, 8], [1, 9], [2, 10], [3, 11], [4, 12], [5, 13], [6, 14], [7, 15]
  ];
  
// Project the tesseract onto 3D space
const projectionMatrix = new THREE.Matrix4().makePerspective(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const cameraPosition = new THREE.Vector3(0, 0, 10);
const cameraLookAt = new THREE.Vector3(0, 0, 0);
const projectVertex = (vertex) => {
const projectedVertex = vertex.clone().applyMatrix4(projectionMatrix);
projectedVertex.divideScalar(projectedVertex.w);
projectedVertex.multiplyScalar(500);
return projectedVertex;
};
const vertices3D = vertices.map(projectVertex);

// Create the tesseract
let index = 0;
for (let i = 0; i < edges.length; i++) {
const edge = edges[i];
const v1 = vertices3D[edge[0]];
const v2 = vertices3D[edge[1]];
positions[index++] = v1.x;
positions[index++] = v1.y;
positions[index++] = v1.z;
positions[index++] = v2.x;
positions[index++] = v2.y;
positions[index++] = v2.z;
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const material = new THREE.LineBasicMaterial({ color: 0xffffff });
const tesseract = new THREE.LineSegments(geometry, material);

// Set the camera position and look at the center of the tesseract
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(cameraPosition);
camera.lookAt(cameraLookAt);

// Create the scene and add the tesseract and camera to it
const scene = new THREE.Scene();
scene.add(tesseract);
scene.add(camera);

// Render the scene
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);
    
//Penteract:
// Define the vertices of the penteract
const vertices_2 = [
    new THREE.Vector4(-1, -1, -1, -1, -1),
    new THREE.Vector4(-1, -1, -1, -1, 1),
    new THREE.Vector4(-1, -1, -1, 1, -1),
    new THREE.Vector4(-1, -1, -1, 1, 1),
    new THREE.Vector4(-1, -1, 1, -1, -1),
    new THREE.Vector4(-1, -1, 1, -1, 1),
    new THREE.Vector4(-1, -1, 1, 1, -1),
    new THREE.Vector4(-1, -1, 1, 1, 1),
    new THREE.Vector4(-1, 1, -1, -1, -1),
    new THREE.Vector4(-1, 1, -1, -1, 1),
    new THREE.Vector4(-1, 1, -1, 1, -1),
    new THREE.Vector4(-1, 1, -1, 1, 1),
    new THREE.Vector4(-1, 1, 1, -1, -1),
    new THREE.Vector4(-1, 1, 1, -1, 1),
    new THREE.Vector4(-1, 1, 1, 1, -1),
    new THREE.Vector4(-1, 1, 1, 1, 1),
    new THREE.Vector4(1, -1, -1, -1, -1),
    new THREE.Vector4(1, -1, -1, -1, 1),
    new THREE.Vector4(1, -1, -1, 1, -1),
    new THREE.Vector4(1, -1, -1, 1, 1),
    new THREE.Vector4(1, -1, 1, -1, -1),
    new THREE.Vector4(1, -1, 1, -1, 1),
    new THREE.Vector4(1, -1, 1, 1, -1),
    new THREE.Vector4(1, -1, 1, 1, 1),
    new THREE.Vector4(1, 1, -1, -1, -1),
    new THREE.Vector4(1, 1, -1, -1, 1),
    new THREE.Vector4(1, 1, -1, 1, -1),
    new THREE.Vector4(1, 1, -1, 1, 1),
    new THREE.Vector4(1, 1, 1, -1, -1),
    new THREE.Vector4(1, 1, 1, -1, 1),
    new THREE.Vector4(1, 1, 1, 1, -1),
    new THREE.Vector4(1, 1, 1, 1, 1),
  ];
  
// Define the edges of the penteract
const edges_2 = [
    [0, 1], [0, 2], [0, 4], [0, 8], [1, 3], [1, 5], [1, 9], [2, 3], [2, 6], [2, 10], [3, 7], [3, 11],
    [4, 5], [4, 6], [4, 12], [5, 7], [5, 13], [6, 7], [6, 14], [7, 15], [8, 9], [8, 10], [8, 12], [9, 11],
    [9, 13], [10, 11], [10, 14], [11, 15], [12, 13], [12, 14], [13, 15], [14, 15]
  ];
  
  // Create a Three.js geometry to represent the penteract
  
  // Create a Float32Array to hold the vertex data
  const verticesArray = new Float32Array(vertices.length * 3);
  
  // Copy the vertex data into the array
  for (let i = 0; i < vertices.length; i++) {
    verticesArray[i * 3] = vertices[i].x;
    verticesArray[i * 3 + 1] = vertices[i].y;
    verticesArray[i * 3 + 2] = vertices[i].z;
  }
  
  // Set the vertex data for the geometry
  geometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3));
  
  // Create a Three.js material for the penteract
  
  // Create a Three.js object to represent the penteract
  const penteract = new THREE.LineSegments(geometry, material);
  
  // Add the penteract to the scene
  scene.add(penteract);
  
  