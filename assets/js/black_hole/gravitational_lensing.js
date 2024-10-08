export function createGravitationalLensing(scene, camera) {
  const fragmentShader = `
    uniform samplerCube skybox;
    uniform float time;
    uniform vec3 blackHolePosition;
    uniform float blackHoleRadius;
    varying vec3 vWorldPosition;

    void main() {
      vec3 direction = normalize(vWorldPosition - cameraPosition);
      vec3 blackHoleDir = normalize(blackHolePosition - cameraPosition);
      float distToBlackHole = length(blackHolePosition - vWorldPosition);

      // Simplified gravitational lensing effect
      float lensingStrength = blackHoleRadius / distToBlackHole;
      direction = mix(direction, blackHoleDir, lensingStrength);

      // Sample skybox
      vec4 color = textureCube(skybox, direction);

      // Gravitational redshift
      float redshift = sqrt(1.0 - (2.0 * blackHoleRadius) / distToBlackHole);
      color.rgb *= redshift;

      gl_FragColor = color;
    }
  `;

  const vertexShader = `
    varying vec3 vWorldPosition;

    void main() {
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const geometry = new THREE.SphereGeometry(20, 128, 128);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      skybox: { value: scene.background },
      time: { value: 0.0 },
      blackHolePosition: { value: new THREE.Vector3(0, 0, 0) },
      blackHoleRadius: { value: 2.0 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.BackSide,
    transparent: true,
  });

  const lensingMesh = new THREE.Mesh(geometry, material);
  scene.add(lensingMesh);

  // Update function
  function updateLensing(delta) {
    material.uniforms.time.value += delta;
  }

  return updateLensing;
}
