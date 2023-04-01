import * as THREE from 'three';

let camera, scene, renderer, geometry, material, mesh, parent, size, speed;
let animationId;
let animating = true;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
  camera.position.z = 1;

  scene = new THREE.Scene();

  // Add geometry for each shape
  const cubeGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
  const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32);
  const torusGeometry = new THREE.TorusGeometry(0.1, 0.03, 16, 100);
  const octahedronGeometry = new THREE.OctahedronGeometry(0.1, 0);

  material = new THREE.MeshNormalMaterial();

  parent = new THREE.Object3D();
  scene.add(parent);

  // Create meshes for each shape
  const cubeMesh = new THREE.Mesh(cubeGeometry, material);
  const sphereMesh = new THREE.Mesh(sphereGeometry, material);
  const cylinderMesh = new THREE.Mesh(cylinderGeometry, material);
  const torusMesh = new THREE.Mesh(torusGeometry, material);
  const octahedronMesh = new THREE.Mesh(octahedronGeometry, material);

  parent.add(cubeMesh);
  mesh = cubeMesh;

  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('animation') });
  // Set the initial renderer size and add the clearColor
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0.8);

  // Remove the canvas attributes
  const canvas = document.getElementById("animation");
  canvas.removeAttribute("width");
  canvas.removeAttribute("height");
  document.body.appendChild(renderer.domElement);

  // Controls
  document.getElementById('shapeSelector').addEventListener('change', (e) => {
    const shape = e.target.value;
    parent.remove(mesh);

    if (shape === 'cube') {
      mesh = cubeMesh;
    } else if (shape === 'sphere') {
      mesh = sphereMesh;
    } else if (shape === 'cylinder') {
      mesh = cylinderMesh;
    } else if (shape === 'torus') {
      mesh = torusMesh;
    } else if (shape === 'octahedron') {
      mesh = octahedronMesh;
    }

    parent.add(mesh);
  });

  document.getElementById('toggleAnimation').addEventListener('click', () => {
    animating = !animating;
    document.querySelector('#toggleAnimation .fas.fa-play').style.display = animating ? 'none' : 'inline-block';
    document.querySelector('#toggleAnimation .fas.fa-pause').style.display = animating ? 'inline-block' : 'none';
  });

  document.getElementById('rangeSize').addEventListener('input', (e) => {
    size = parseFloat(e.target.value);
    mesh.scale.set(size / 10, size / 10, size / 10);
  });

  document.getElementById('rangeSpeed').addEventListener('input', (e) => {
    speed = parseFloat(e.target.value);
  });

  window.addEventListener('resize', onWindowResize);
}

function animate() {
  animationId = requestAnimationFrame(animate);

  if (animating) {
    mesh.rotation.x += (speed || 5) / 1000;
    mesh.rotation.y += (speed || 5) / 1000;
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Add the event listener to call the function when the window is resized
window.addEventListener("resize", onWindowResize, false);
// Call the function once to set the initial sizes correctly
onWindowResize();