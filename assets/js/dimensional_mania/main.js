// main.js
import { CustomOrbitControls } from '../controls/custom_orbit_controls.js';
import { NDimensionalCube } from './n_dimensional_cube.js';

/**
 * Simple Tweening Mechanism
 * This is a minimal implementation to handle property interpolation.
 */
class Tween {
    constructor(object, to, duration, onUpdate, onComplete) {
        this.object = object;
        this.to = to;
        this.duration = duration;
        this.onUpdate = onUpdate;
        this.onComplete = onComplete;
        this.start = null;
        this.easing = this.easeInOutQuad;
    }

    startTween() {
        requestAnimationFrame(this.animate.bind(this));
    }

    animate(timestamp) {
        if (!this.start) this.start = timestamp;
        const elapsed = timestamp - this.start;
        const t = Math.min(elapsed / this.duration, 1);
        const easedT = this.easing(t);

        // Update properties
        for (let prop in this.to) {
            this.object[prop] = this.object[prop] + (this.to[prop] - this.object[prop]) * easedT;
        }

        if (this.onUpdate) this.onUpdate(easedT);

        if (t < 1) {
            requestAnimationFrame(this.animate.bind(this));
        } else {
            if (this.onComplete) this.onComplete();
        }
    }

    // Easing function
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
}

/**
 * Tween Manager to handle multiple tweens
 */
class TweenManager {
    constructor() {
        this.tweens = [];
    }

    add(tween) {
        this.tweens.push(tween);
        tween.startTween();
    }
}

const tweenManager = new TweenManager();

/**
 * Configuration Parameters
 */
const CONFIG = {
    initialDimension: 3,
    maxDimension: 10,
    size: 50,
    speed: 50,
    colorPalette: [
        0x9b59b6, // 3D - Neon Purple
        0xe74c3c, // 4D - Neon Red
        0x3498db, // 5D - Neon Blue
        0x1abc9c, // 6D - Neon Teal
        0xf1c40f, // 7D - Neon Yellow
        0xe67e22, // 8D - Neon Orange
        0x2ecc71, // 9D - Neon Green
        0x34495e, // 10D - Neon Dark Blue
    ]
};

let scene, camera, renderer, controls;
let rootCube;
let currentDimension = CONFIG.initialDimension;
let size = CONFIG.size;
let speed = CONFIG.speed;
let isAnimating = true;
let isStaticMode = false; // Variable to track mode

// Store all rotation matrices
let rotationMatrices = [];

// Explanatory Content (Static HTML)
const explanatoryContent = `
<h2>Understanding Dimensions from 1D to 10D</h2>

<p>The concept of dimensions is essential in understanding the geometry of different objects, from simple lines to hypercubes. Let's explore each dimension from 1D to 10D, detailing their properties, relationships, and the mathematics and physics of their rotations.</p>

<h3>1D: The Line Segment</h3>
<ul>
    <li><strong>Vertices:</strong> 2</li>
    <li><strong>Edges:</strong> 1</li>
</ul>
<p>A 1-dimensional (1D) object is a line segment. It is defined by two points, or vertices, connected by a single edge. There are no faces, and movement is limited to one direction.</p>

<h3>2D: The Square</h3>
<ul>
    <li><strong>Vertices:</strong> 4</li>
    <li><strong>Edges:</strong> 4</li>
    <li><strong>Faces:</strong> 1 (square)</li>
</ul>
<p>A 2-dimensional (2D) object is a square. It has four vertices and four edges, all lying in a flat plane.</p>

<h3>3D: The Cube</h3>
<ul>
    <li><strong>Vertices:</strong> 8</li>
    <li><strong>Edges:</strong> 12</li>
    <li><strong>Faces:</strong> 6 (squares)</li>
</ul>
<p>A 3-dimensional (3D) object is a cube. It extends the square into the third dimension, adding depth.</p>

<h3>4D: The Tesseract</h3>
<ul>
    <li><strong>Vertices:</strong> 16</li>
    <li><strong>Edges:</strong> 32</li>
    <li><strong>Faces:</strong> 24 (squares)</li>
    <li><strong>Cells:</strong> 8 (cubes)</li>
</ul>
<p>A 4-dimensional (4D) object is a tesseract, or hypercube. It consists of two cubes connected along their corresponding vertices.</p>

<h3>5D: The Penteract</h3>
<ul>
    <li><strong>Vertices:</strong> 32</li>
    <li><strong>Edges:</strong> 80</li>
    <li><strong>Faces:</strong> 80 (squares)</li>
    <li><strong>Cells:</strong> 40 (cubes)</li>
    <li><strong>4-Faces:</strong> 10 (tesseracts)</li>
</ul>
<p>A 5-dimensional (5D) object is a penteract, extending the concept of hypercubes into the fifth dimension.</p>

<h3>6D: The Hexacontact</h3>
<ul>
    <li><strong>Vertices:</strong> 64</li>
    <li><strong>Edges:</strong> 192</li>
    <li><strong>Faces:</strong> 240 (squares)</li>
    <li><strong>Cells:</strong> 160 (cubes)</li>
    <li><strong>4-Faces:</strong> 40 (tesseracts)</li>
</ul>
<p>A 6-dimensional (6D) object is a hexacontact, continuing the extension into higher dimensions.</p>

<h3>7D: The Heptacontact</h3>
<ul>
    <li><strong>Vertices:</strong> 128</li>
    <li><strong>Edges:</strong> 448</li>
    <li><strong>Faces:</strong> 672 (squares)</li>
    <li><strong>Cells:</strong> 560 (cubes)</li>
    <li><strong>4-Faces:</strong> 160 (tesseracts)</li>
    <li><strong>5-Faces:</strong> 60 (penteracts)</li>
</ul>
<p>A 7-dimensional (7D) object is a heptacontact, adding another layer of complexity.</p>

<h3>8D: The Octacontact</h3>
<ul>
    <li><strong>Vertices:</strong> 256</li>
    <li><strong>Edges:</strong> 1024</li>
    <li><strong>Faces:</strong> 1792 (squares)</li>
    <li><strong>Cells:</strong> 2240 (cubes)</li>
    <li><strong>4-Faces:</strong> 1120 (tesseracts)</li>
    <li><strong>5-Faces:</strong> 420 (penteracts)</li>
    <li><strong>6-Faces:</strong> 84 (hexacontacts)</li>
    <li><strong>7-Faces:</strong> 12 (heptacontacts)</li>
</ul>
<p>An 8-dimensional (8D) object is an octacontact, further expanding the dimensional framework.</p>

<h3>9D: The Enneacontact</h3>
<ul>
    <li><strong>Vertices:</strong> 512</li>
    <li><strong>Edges:</strong> 2304</li>
    <li><strong>Faces:</strong> 4032 (squares)</li>
    <li><strong>Cells:</strong> 5376 (cubes)</li>
    <li><strong>4-Faces:</strong> 2688 (tesseracts)</li>
    <li><strong>5-Faces:</strong> 840 (penteracts)</li>
    <li><strong>6-Faces:</strong> 168 (hexacontacts)</li>
    <li><strong>7-Faces:</strong> 24 (heptacontacts)</li>
    <li><strong>8-Faces:</strong> 2 (octacontacts)</li>
</ul>
<p>A 9-dimensional (9D) object is an enneacontact, introducing even more complexity.</p>

<h3>10D: The Decacontact</h3>
<ul>
    <li><strong>Vertices:</strong> 1024</li>
    <li><strong>Edges:</strong> 4608</li>
    <li><strong>Faces:</strong> 8064 (squares)</li>
    <li><strong>Cells:</strong> 10752 (cubes)</li>
    <li><strong>4-Faces:</strong> 5376 (tesseracts)</li>
    <li><strong>5-Faces:</strong> 1680 (penteracts)</li>
    <li><strong>6-Faces:</strong> 336 (hexacontacts)</li>
    <li><strong>7-Faces:</strong> 48 (heptacontacts)</li>
    <li><strong>8-Faces:</strong> 4 (octacontacts)</li>
    <li><strong>9-Faces:</strong> 1 (enneacontact)</li>
</ul>
<p>A 10-dimensional (10D) object is a decacontact, the culmination of extending hypercubes into ten dimensions. Visualizing such high-dimensional objects requires abstract representations and advanced mathematical concepts.</p>
`;

/**
 * Initialize the application
 */
function init() {
    // Initialize scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background for neon contrast

    // Initialize camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 15); // Start at a suitable distance

    // Initialize renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('animation').appendChild(renderer.domElement);

    // Initialize custom orbit controls
    controls = new CustomOrbitControls(camera, renderer.domElement, {
        rotateSpeed: CONFIG.speed * 0.005,
        zoomSpeed: CONFIG.speed * 0.1,
        minDistance: 5,
        maxDistance: 1000,
        dampingFactor: 0.1,
        enableDamping: true,
        inertiaDamping: 0.98,
        zoomDamping: 0.90
    });
    controls.setTarget(0, 0, 0); // Focus on the origin

    // Initialize lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Soft white light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    camera.add(pointLight);
    scene.add(camera);

    // Initialize TweenManager in scene.userData for global access
    scene.userData.tweenManager = tweenManager;

    // Create the root hypercube
    createHypercube(currentDimension);

    // Setup event listeners
    setupEventListeners();

    // Populate explanatory panel
    populateExplanatoryPanel();

    // Start animation loop
    animate();
}

/**
 * Create or recreate the hypercube based on the current dimension
 * @param {number} dimension - The dimension of the hypercube
 */
function createHypercube(dimension) {
    if (rootCube) {
        rootCube.dispose(scene);
    }
    const color = CONFIG.colorPalette[dimension - 3] || 0xffffff; // Default to white if out of range
    rootCube = new NDimensionalCube(dimension, null, color);
    scene.add(rootCube.object3D);

    // Apply scaling based on size
    rootCube.object3D.scale.set(size, size, size);

    // Update Dimension Indicator
    updateDimensionIndicator(dimension);
}

/**
 * Generate rotation matrices for all unique plane pairs
 */
function generateRotationMatrices() {
    rotationMatrices = [];

    if (!isStaticMode) {
        const currentTime = performance.now();
        // Generate rotation matrices for all unique plane pairs
        for (let i = 0; i < currentDimension; i++) {
            for (let j = i + 1; j < currentDimension; j++) {
                const angle = currentTime * 0.0005 * speed; // Dynamic angle based on time and speed

                // Initialize identity matrix
                const matrix = new Array(currentDimension).fill(0).map(() => new Array(currentDimension).fill(0));
                for (let k = 0; k < currentDimension; k++) {
                    matrix[k][k] = 1;
                }

                // Set rotation for the (i,j) plane
                matrix[i][i] = Math.cos(angle);
                matrix[i][j] = -Math.sin(angle);
                matrix[j][i] = Math.sin(angle);
                matrix[j][j] = Math.cos(angle);

                rotationMatrices.push(matrix);
            }
        }
    }
}

/**
 * Animation loop
 */
function animate(timestamp) {
    requestAnimationFrame(animate);

    controls.update(); // Update custom orbit controls

    if (isAnimating && !isStaticMode) {
        generateRotationMatrices();
        rootCube.update(rotationMatrices, timestamp); // Pass time to update method
    }

    renderer.render(scene, camera);
}

/**
 * Setup event listeners for UI controls
 */
function setupEventListeners() {
    // Dimension Selector
    const dimensionSelector = document.getElementById('dimensionSelector');
    dimensionSelector.addEventListener('change', (e) => {
        const newDimension = parseInt(e.target.value);
        if (newDimension < 1 || newDimension > CONFIG.maxDimension) {
            alert(`Please select a dimension between 1 and ${CONFIG.maxDimension}.`);
            dimensionSelector.value = currentDimension;
            return;
        }
        currentDimension = newDimension;
        createHypercube(currentDimension);
    });

    // Toggle Animation
    const toggleAnimationBtn = document.getElementById('toggleAnimation');
    toggleAnimationBtn.addEventListener('click', () => {
        isAnimating = !isAnimating;
        toggleAnimationBtn.textContent = isAnimating ? 'Stop Animation' : 'Start Animation';
    });

    // Step-by-Step Mode Toggle
    const toggleStaticModeBtn = document.getElementById('toggleStaticMode');
    toggleStaticModeBtn.addEventListener('click', () => {
        isStaticMode = !isStaticMode;
        toggleStaticModeBtn.textContent = isStaticMode ? 'Switch to Animated Mode' : 'Switch to Static Mode';
        createHypercube(currentDimension); // Recreate the hypercube for static mode
    });

    // Step to Next Dimension in Static Mode
    const nextDimensionBtn = document.getElementById('nextDimension');
    nextDimensionBtn.addEventListener('click', () => {
        if (isStaticMode && currentDimension < CONFIG.maxDimension) {
            currentDimension += 1;
            createHypercube(currentDimension);
            dimensionSelector.value = currentDimension;
        }
    });

    // Transform Dimension Button
    const transformDimensionBtn = document.getElementById('transformDimension');
    transformDimensionBtn.addEventListener('click', () => {
        const newDimension = prompt(`Enter target dimension (1 to ${CONFIG.maxDimension}):`, currentDimension + 1);
        const parsedDimension = parseInt(newDimension);
        if (isNaN(parsedDimension) || parsedDimension < 1 || parsedDimension > CONFIG.maxDimension) {
            alert(`Please enter a valid dimension between 1 and ${CONFIG.maxDimension}.`);
            return;
        }
        rootCube.transformDimension(parsedDimension);
        currentDimension = parsedDimension;
        document.getElementById('dimensionSelector').value = currentDimension;
    });

    // Size Range Input
    const rangeSize = document.getElementById('rangeSize');
    rangeSize.addEventListener('input', (e) => {
        size = parseInt(e.target.value);
        // Update the scale of the hypercube
        if (rootCube) {
            rootCube.object3D.scale.set(size, size, size);
        }
    });

    // Speed Range Input
    const rangeSpeed = document.getElementById('rangeSpeed');
    rangeSpeed.addEventListener('input', (e) => {
        speed = parseInt(e.target.value);
        controls.rotateSpeed = speed * 0.005;
        controls.zoomSpeed = speed * 0.1;
    });

    // Go Back Button
    const goBackBtn = document.getElementById('goBack');
    goBackBtn.addEventListener('click', () => {
        // Implement go back functionality, e.g., navigating to a previous page or state
        window.history.back();
    });

    // Toggle Panel Button
    const togglePanelBtn = document.getElementById('togglePanel');
    const panel = document.getElementById('panel');

    togglePanelBtn.addEventListener('click', () => {
        if (panel.classList.contains('visible')) {
            panel.classList.remove('visible');
            panel.classList.add('hidden');
            togglePanelBtn.textContent = 'Show Controls & Info';
        } else {
            panel.classList.remove('hidden');
            panel.classList.add('visible');
            togglePanelBtn.textContent = 'Hide Controls & Info';
        }
    });

    // Window Resize
    window.addEventListener('resize', onWindowResize, false);
}

/**
 * Handle window resize events
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Populate the explanatory panel with HTML content
 */
function populateExplanatoryPanel() {
    const panel = document.getElementById('explanatoryPanel');
    panel.innerHTML = explanatoryContent;
}

/**
 * Update the Dimension Indicator
 * @param {number} dimension - The current dimension
 */
function updateDimensionIndicator(dimension) {
    const indicator = document.getElementById('dimensionIndicator');
    indicator.textContent = `Current Dimension: ${dimension}D`;
    indicator.classList.remove('hidden');
    indicator.classList.add('active');

    // Hide the indicator after a short delay
    setTimeout(() => {
        indicator.classList.remove('active');
        indicator.classList.add('hidden');
    }, 3000);
}

// Initialize the application after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
