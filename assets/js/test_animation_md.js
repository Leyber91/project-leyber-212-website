// Utility functions for matrix operations
function createIdentityMatrix(dimension) {
    const matrix = [];
    for (let i = 0; i < dimension; i++) {
      matrix[i] = [];
      for (let j = 0; j < dimension; j++) {
        matrix[i][j] = i === j ? 1 : 0;
      }
    }
    return matrix;
  }
  
  function applyMatrix(vec, matrix) {
    const result = new THREE.Vector3();
    result.x = vec.x * matrix[0][0] + vec.y * matrix[0][1] + vec.z * matrix[0][2];
    result.y = vec.x * matrix[1][0] + vec.y * matrix[1][1] + vec.z * matrix[1][2];
    result.z = vec.x * matrix[2][0] + vec.y * matrix[2][1] + vec.z * matrix[2][2];
    return result;
  }
  
  function rotateAroundAxis(axis, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const t = 1 - c;
    const x = axis.x;
    const y = axis.y;
    const z = axis.z;
  
    return [
      [t * x * x + c, t * x * y - z * s, t * x * z + y * s],
      [t * x * y + z * s, t * y * y + c, t * y * z - x * s],
      [t * x * z - y * s, t * y * z + x * s, t * z * z + c],
    ];
  }
  
  function projectToHigherDimension(vertices, dimension) {
    const rotationAngle = 0.01;
    const rotationAxis = new THREE.Vector3(1, 1, 1).normalize();
    const rotationMatrix = rotateAroundAxis(rotationAxis, rotationAngle);
  
    return vertices.map(vertex => {
      let projectedVertex = vertex.clone();
      for (let i = 0; i < dimension - 3; i++) {
        projectedVertex = applyMatrix(projectedVertex, rotationMatrix);
      }
      return projectedVertex;
    });
  }
  
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  
  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("animation") });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0.8);
  const canvas = document.getElementById("animation");
  canvas.removeAttribute("width");
  canvas.removeAttribute("height");
  
  const parentObject = new THREE.Object3D();
  
  const cubeGeometry = new THREE.BoxGeometry();
  const cubeEdges = new THREE.EdgesGeometry(cubeGeometry);
  const cube = new THREE.LineSegments(cubeEdges, new THREE.LineBasicMaterial({ color: 0xffffff }));
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
  
  dimensionSelector.addEventListener("change", () => {
    cube.geometry = new THREE.BoxGeometry();
    cube.geometry.computeBoundingSphere();
  });
  
  const animate = function () {
    requestAnimationFrame(animate);
  
    if (isAnimating) {
      const selectedDimension = parseInt(dimensionSelector.value);
      if (selectedDimension > 3) {
        const projectedVertices = projectToHigherDimension(cube.geometry.vertices, selectedDimension);
        for (let i = 0; i < cube.geometry.vertices.length; i++) {
          cube.geometry.vertices[i].copy(projectedVertices[i]);
        }
        cube.geometry.verticesNeedUpdate = true;
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
  
  