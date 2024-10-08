export function createSkybox(scene) {
  // Create a procedurally generated skybox using shaders
  const size = 1000;
  const geometry = new THREE.BoxGeometry(size, size, size);

  const materialArray = [];
  for (let i = 0; i < 6; i++) {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vPosition;

        // Simplex noise function (omitted here for brevity)

        void main() {
          vec3 direction = normalize(vPosition);

          // Star field
          float starDensity = 0.0001;
          float starChance = fract(sin(dot(direction.xy + time, vec2(12.9898,78.233))) * 43758.5453);
          float star = step(1.0 - starDensity, starChance);
          vec3 starColor = vec3(star);

          // Nebula effect using noise
          float noise = fract(sin(dot(direction + time * 0.05, vec3(12.9898,78.233,45.164))) * 43758.5453);
          vec3 nebulaColor = vec3(0.2, 0.0, 0.5) * noise * 0.5;

          vec3 color = starColor + nebulaColor;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide,
    });
    materialArray.push(material);
  }

  const skybox = new THREE.Mesh(geometry, materialArray);
  scene.add(skybox);

  // Update function to animate the skybox
  function updateSkybox(delta) {
    materialArray.forEach(material => {
      material.uniforms.time.value += delta;
    });
  }

  // Return the update function
  return updateSkybox;
}
