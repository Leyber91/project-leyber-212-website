// 1. Set up the 3D environment using a WebGL library such as Three.js
/*function setupScene() {
    // Set up the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
  
    // Create a scene
    const scene = new THREE.Scene();
  
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
  
    // Add a resize event listener
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
  
    // Set up an animation loop
    function animate() {
        requestAnimationFrame(animate);
        animateBlackHole();
        animateAccretionDisk();
        renderer.render(scene, camera);
      }
      
  
    // Start the animation loop
    animate();
  
    // Return the scene and camera objects for future use
    return { scene, camera };
  }
  
  // Initialize the 3D environment
  const { scene, camera } = setupScene();

  function createEventHorizon() {
    const geometry = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
    return geometry;
  }

  function createBlackHoleMaterial() {
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
  
    const fragmentShader = `
      varying vec2 vUv;
      void main() {
        float intensity = 1.0 - distance(vUv, vec2(0.5, 0.5)) * 2.0;
        gl_FragColor = vec4(vec3(intensity), 1.0);
      }
    `;
  
    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    });
  
    return material;
  }

  function createBlackHole() {
    const geometry = createEventHorizon();
    const material = createBlackHoleMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }
  
  const blackHole = createBlackHole();
  scene.add(blackHole);

  function getRandomPositionInDisk(radius, innerRadius) {
    const angle = Math.random() * Math.PI * 2;
    const distance = innerRadius + Math.random() * (radius - innerRadius);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    return new THREE.Vector3(x, y, (Math.random() - 0.5) * 0.2);
  }

  function createAccretionDiskGeometry(particleCount, radius, innerRadius) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
  
    for (let i = 0; i < particleCount; i++) {
      const position = getRandomPositionInDisk(radius, innerRadius);
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;
    }
  
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }
  function createAccretionDiskMaterial() {
    const vertexShader = `
      varying vec3 vColor;
      void main() {
        vColor = vec3(1.0, 0.5, 0.2) * clamp(length(position) / 5.0, 0.0, 1.0);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 0.05 * (300.0 / length(mvPosition.xyz));
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
  
    const fragmentShader = `
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      void main() {
        gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
      }
    `;
  
    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: new THREE.TextureLoader().load('path/to/your/texture.png') },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  
    return material;
  }
  

  function createAccretionDisk(particleCount, radius, innerRadius) {
    const geometry = createAccretionDiskGeometry(particleCount, radius, innerRadius);
    const material = createAccretionDiskMaterial();
    const disk = new THREE.Points(geometry, material);
    return disk;
  }
  
  const accretionDisk = createAccretionDisk(10000, 5, 2);
  scene.add(accretionDisk);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  function createPointLight(color, distance, intensity) {
    const light = new THREE.PointLight(color, intensity, distance);
    return light;
  }
  
  const pointLight1 = createPointLight(0x00ffff, 10, 2);
  const pointLight2 = createPointLight(0xff00ff, 10, 2);
  const pointLight3 = createPointLight(0xffff00, 10, 2);
  
  pointLight1.position.set(5, 0, 5);
  pointLight2.position.set(-5, 0, -5);
  pointLight3.position.set(0, 0, -5);
  
  scene.add(pointLight1);
  scene.add(pointLight2);
  scene.add(pointLight3);

  
  function animateBlackHole() {
    blackHole.rotation.y += 0.005;
  }

  function animateAccretionDisk() {
    accretionDisk.geometry.vertices.forEach((vertex) => {
      const distance = vertex.length();
      const offset = distance / 200;
      vertex.theta += (1 / distance) * 0.1 + offset;
      vertex.x = Math.sin(vertex.theta) * distance;
      vertex.y = Math.cos(vertex.theta) * distance;
    });
    accretionDisk.geometry.verticesNeedUpdate = true;
  }

  function createStarfield() {
    const starGeometry = new THREE.Geometry();
    for (let i = 0; i < 10000; i++) {
      const star = new THREE.Vector3();
      star.x = THREE.Math.randFloatSpread(2000);
      star.y = THREE.Math.randFloatSpread(2000);
      star.z = THREE.Math.randFloatSpread(2000);
      starGeometry.vertices.push(star);
    }
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
  }

  function generateLensFlareTexture(size, color, alpha = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
  
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
  
    gradient.addColorStop(0, `rgba(${color}, ${alpha})`);
    gradient.addColorStop(0.5, `rgba(${color}, ${alpha * 0.5})`);
    gradient.addColorStop(1, `rgba(${color}, 0)`);
  
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  
    return canvas;
  }
  
  function createLensFlare() {
  const textureLoader = new THREE.TextureLoader();
  // Remove the previous PNG loading lines
  // const textureFlare0 = textureLoader.load('assets/textures/lensflare0.png');
  // const textureFlare3 = textureLoader.load('assets/textures/lensflare3.png');

  // Add the following lines to create the lens flare textures using canvas
  const textureFlare0 = new THREE.CanvasTexture(generateLensFlareTexture(64, '#ffffff'));
  const textureFlare3 = new THREE.CanvasTexture(generateLensFlareTexture(256, '#ffffff', 0.1));

  addLight(0.55, 0.9, 0.5, 0, 0, 10000, textureFlare0, textureFlare3);

  const lensFlare = new THREE.Lensflare();
  lensFlare.addElement(new THREE.LensflareElement(textureFlare0, 700, 0.0));
  lensFlare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.6));
  lensFlare.addElement(new THREE.LensflareElement(textureFlare3, 70, 0.7));
  lensFlare.addElement(new THREE.LensflareElement(textureFlare3, 120, 0.9));
  lensFlare.addElement(new THREE.LensflareElement(textureFlare3, 70, 1.0));

  lensFlare.position.set(-200, 0, -200);
  scene.add(lensFlare);
}



function init() {
    createCamera();
    createScene();
    createLights();
    createBlackHole();
    createAccretionDisk();
    createStarfield();
    createLensFlare();
    createRenderer();
  
    document.body.appendChild(renderer.domElement);
    animate();
  }
  
  window.addEventListener('DOMContentLoaded', createBlackHoleEffect);*/






  const canvas = document.getElementById('glCanvas');
  const gl = canvas.getContext('webgl');
  
  if (!gl) {
      console.error('WebGL not supported');
  }

  // Vertex shader
const vertexShaderSource = `
attribute vec4 a_position;
attribute vec2 a_texCoord;

varying vec2 v_texCoord;

void main() {
    gl_Position = a_position;
    v_texCoord = a_texCoord;
}`;

// Fragment shader
const fragmentShaderSource = `
precision mediump float;

uniform sampler2D u_texture;
varying vec2 v_texCoord;

void main() {
    gl_FragColor = texture2D(u_texture, v_texCoord);
}`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
      return shader;
  }
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
      return program;
  }
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);
const textureImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAv0lEQVQ4T63TMQ4CMQxFwbBQ8QIQqYXIQqkdAqTlFbTgsZGQLpBuFw/OCyfMiax/8c1YEBXVzGQy6eb7/mz84/89w1BEr6Qn0c8WUQUxLxGRZzHnVmY9q8zqAqYhIu5G5EQk38y8WUStfDvAwne/9zyAe9/n8WU5QHvfpwLwOwC87z1OyH2fIzGnAgAAAABJRU5ErkJggg==';


function loadTexture(gl) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Placeholder 1x1 pixel texture
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

  const image = new Image();
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

    gl.generateMipmap(gl.TEXTURE_2D);
  };
  image.src = textureImageBase64;

  return texture;
}

const texture = loadTexture(gl);
gl.useProgram(program);
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.uniform1i(gl.getUniformLocation(program, 'u_texture'), 0);


// Function to create a sphere geometry
function createSphereGeometry(radius, segments) {
  const vertices = [];
  const indices = [];
  const texCoords = [];

  for (let lat = 0; lat <= segments; lat++) {
      const theta = lat * Math.PI / segments;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= segments; lon++) {
          const phi = lon * 2 * Math.PI / segments;
          const sinPhi = Math.sin(phi);
          const cosPhi = Math.cos(phi);

          const x = radius * sinTheta * cosPhi;
          const y = radius * sinTheta * sinPhi;
          const z = radius * cosTheta;

          vertices.push(x, y, z);
          texCoords.push(lon / segments, lat / segments);
      }
  }

  for (let lat = 0; lat < segments; lat++) {
      for (let lon = 0; lon < segments; lon++) {
          const first = lat * (segments + 1) + lon;
          const second = first + segments + 1;

          indices.push(first, second, first + 1);
          indices.push(second, second + 1, first + 1);
      }
  }

  return { vertices, indices, texCoords };
}

// Create sphere geometry for the event horizon
const { vertices: sphereVertices, indices: sphereIndices, texCoords: sphereTexCoords } = createSphereGeometry(5, 32);

// Create a simple disk geometry for the accretion disk
const diskVertices = [
  -10, 0, -10,
  10, 0, -10,
  10, 0, 10,
  -10, 0, 10
];

const diskIndices = [
  0, 1, 2,
  2, 3, 0
];

const diskTexCoords = [
  0, 0,
  1, 0,
  1, 1,
  0, 1
];

// Create vertex buffers for the black hole event horizon and accretion disk
const sphereVertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereVertices), gl.STATIC_DRAW);

const diskVertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, diskVertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(diskVertices), gl.STATIC_DRAW);

// Create index buffers for the black hole event horizon and accretion disk
const sphereIndexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereIndices), gl.STATIC_DRAW);

const diskIndexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, diskIndexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(diskIndices), gl.STATIC_DRAW);

// Create texture coordinate buffers for the black hole event horizon and accretion disk
const sphereTexCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, sphereTexCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTexCoords), gl.STATIC_DRAW);

const diskTexCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, diskTexCoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(diskTexCoords), gl.STATIC_DRAW);

// ... (all the previous code you provided)

function render() {
  // Clear the canvas
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Enable depth testing
  gl.enable(gl.DEPTH_TEST);

  // Set the viewport size
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Use the shader program
  gl.useProgram(program);

  // Set up shader attributes for the event horizon
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexBuffer);
  const positionAttribute = gl.getAttribLocation(program, 'a_position');
  gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionAttribute);

  gl.bindBuffer(gl.ARRAY_BUFFER, sphereTexCoordBuffer);
  const texCoordAttribute = gl.getAttribLocation(program, 'a_texCoord');
  gl.vertexAttribPointer(texCoordAttribute, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texCoordAttribute);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);

  // Draw the event horizon
  gl.drawElements(gl.TRIANGLES, sphereIndices.length, gl.UNSIGNED_SHORT, 0);

  // Set up shader attributes for the accretion disk
  gl.bindBuffer(gl.ARRAY_BUFFER, diskVertexBuffer);
  gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, diskTexCoordBuffer);
  gl.vertexAttribPointer(texCoordAttribute, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, diskIndexBuffer);

  // Draw the accretion disk
  gl.drawElements(gl.TRIANGLES, diskIndices.length, gl.UNSIGNED_SHORT, 0);

  // Request the next frame
  requestAnimationFrame(render);
}

// Animation loop
function animate() {
    // Update the scene and renderer
    render();

    // Request the next frame
    requestAnimationFrame(animate);
}

// Start the animation when the "Start Animation" button is clicked
document.getElementById('startAnimation').addEventListener('click', function() {
    animate();
});


