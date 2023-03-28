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