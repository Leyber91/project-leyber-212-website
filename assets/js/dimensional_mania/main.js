import { NDimensionalCube } from './n_dimensional_cube.js';
import { CustomOrbitControls } from '../controls/custom_orbit_controls.js';

let scene, camera, renderer, cube, controls;
let nDCube, projectedCube;
let dimension = 3;
let size = 50;
let speed = 50;
let isAnimating = true;

const rotationMatrices = [];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('animation').appendChild(renderer.domElement);

    camera.position.z = 5;

    controls = new CustomOrbitControls(camera, renderer.domElement);

    createCube();
    setupEventListeners();

    animate();
}

function createCube() {
    nDCube = new NDimensionalCube(dimension);
    projectedCube = nDCube.project(rotationMatrices);

    if (cube) {
        scene.remove(cube);
    }

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const lines = [];

    projectedCube.vertices.forEach(vertex => {
        // Check for NaN values before adding to positions
        if (!vertex.some(isNaN)) {
            positions.push(vertex[0] * size / 100, vertex[1] * size / 100, vertex[2] * size / 100);
        }
    });

    projectedCube.edges.forEach(edge => {
        // Only add edges if both vertices exist in the positions array
        if (edge[0] * 3 < positions.length && edge[1] * 3 < positions.length) {
            lines.push(edge[0], edge[1]);
        }
    });

    // Only create the geometry if we have valid positions
    if (positions.length > 0) {
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setIndex(lines);

        const material = new THREE.LineBasicMaterial({ color: 0x00ffff });
        cube = new THREE.LineSegments(geometry, material);
        scene.add(cube);

        // Calculate the center of the cube
        const box = new THREE.Box3().setFromObject(cube);
        const center = box.getCenter(new THREE.Vector3());

        // Set the target of the controls to the center of the cube
        controls.setTarget(center.x, center.y, center.z);

        // Optionally, you can also move the cube to the origin
        cube.position.sub(center);
    } else {
        console.warn('No valid positions for cube geometry');
    }
}

function updateRotationMatrices(time) {
    rotationMatrices.length = 0;
    for (let i = 0; i < dimension - 1; i++) {
        for (let j = i + 1; j < dimension; j++) {
            const angle = time * speed / 5000;
            const matrix = new Array(dimension).fill().map(() => new Array(dimension).fill(0));
            for (let k = 0; k < dimension; k++) {
                matrix[k][k] = 1;
            }
            matrix[i][i] = Math.cos(angle);
            matrix[i][j] = -Math.sin(angle);
            matrix[j][i] = Math.sin(angle);
            matrix[j][j] = Math.cos(angle);
            rotationMatrices.push(matrix);
        }
    }
}

function animate(time) {
    requestAnimationFrame(animate);

    controls.update(); // Update controls first

    if (isAnimating) {
        updateRotationMatrices(time);
        projectedCube = nDCube.project(rotationMatrices);

        if (cube && cube.geometry) {
            const positions = cube.geometry.attributes.position.array;
            projectedCube.vertices.forEach((vertex, index) => {
                if (index * 3 + 2 < positions.length) {
                    positions[index * 3] = vertex[0] * size / 100;
                    positions[index * 3 + 1] = vertex[1] * size / 100;
                    positions[index * 3 + 2] = vertex[2] * size / 100;
                }
            });
            cube.geometry.attributes.position.needsUpdate = true;
        }
    }

    renderer.render(scene, camera);
}

function setupEventListeners() {
    document.getElementById('dimensionSelector').addEventListener('change', (e) => {
        dimension = parseInt(e.target.value);
        createCube();
    });

    document.getElementById('toggleAnimation').addEventListener('click', () => {
        isAnimating = !isAnimating;
        document.getElementById('toggleAnimation').textContent = isAnimating ? 'Stop Animation' : 'Start Animation';
    });

    document.getElementById('rangeSize').addEventListener('input', (e) => {
        size = parseInt(e.target.value);
    });

    document.getElementById('rangeSpeed').addEventListener('input', (e) => {
        speed = parseInt(e.target.value);
    });

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();