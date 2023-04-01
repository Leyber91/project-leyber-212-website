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
  
  const rotationMatrix = new THREE.Matrix4();
  
  function projectTo3D(cube, dimension) {
    const rotationAngle = 0.01;
    rotationMatrix.fromArray(rotateMatrix(dimension, rotationAngle));
    cube.geometry.applyMatrix(rotationMatrix);
    cube.edgesGeometry.dispose();
    cube.edgesGeometry = new THREE.EdgesGeometry(cube.geometry);
    cube.geometry.computeBoundingSphere();
  }
  
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
  
  const cubeGeometry = new THREE.Geometry().fromBufferGeometry(new THREE.BoxGeometry());
  
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
    const geometry = new THREE.Geometry().fromBufferGeometry(new THREE.BoxGeometry());
    cube.geometry.dispose();
    cube.geometry = geometry;
    cube.edgesGeometry.dispose();
    cube.edgesGeometry = new THREE.EdgesGeometry(geometry);
  }
  
  dimensionSelector.addEventListener("change", (e) => {
    resetCubeGeometry();
    const selectedDimension = parseInt(e.target.value);
    const matrix = new THREE.Matrix4();
    matrix.set(
      1, 0, 0, 0,
      0, selectedDimension > 1 ? 1 : 0, 0, 0,
      0, 0, selectedDimension > 2 ? 1 : 0, 0,
      0, 0, 0, 1
    );
    cube.geometry.applyMatrix(matrix);
    cube.edgesGeometry.dispose();
    cube.edgesGeometry = new THREE.EdgesGeometry(cube.geometry);
  });
  
  const animate = function () {
    requestAnimationFrame(animate);
  
    if (isAnimating) {
      const selectedDimension = parseInt(dimensionSelector.value);
      if (selectedDimension > 3) {
        projectTo3D(cube, selectedDimension);
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
  