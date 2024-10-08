export function createAccretionDisk(scene, camera) {
  const geometry = new THREE.PlaneGeometry(50, 50, 1, 1);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    },
    vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec2 uResolution;
      varying vec3 vPosition;

      void main() {
        vec2 uv = vPosition.xz / 50.0 + 0.5;
        float radius = length(uv - 0.5);
        float angle = atan(uv.y - 0.5, uv.x - 0.5);

        // Disk boundaries
        float disk = smoothstep(0.1, 0.105, radius) - smoothstep(0.4, 0.405, radius);

        // Temperature gradient
        float temp = 6000.0 * pow(radius / 0.1, -0.75);

        // Blackbody color approximation
        vec3 color = vec3(
          clamp(pow(temp / 1500.0, -5.0), 0.0, 1.0),
          clamp(pow(temp / 2000.0, -4.0), 0.0, 1.0),
          clamp(pow(temp / 2500.0, -3.0), 0.0, 1.0)
        );

        // Procedural turbulence
        float turbulence = sin(10.0 * angle + time * 5.0) * 0.5 + 0.5;
        color *= turbulence;

        gl_FragColor = vec4(color * disk, disk);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });

  const accretionDisk = new THREE.Mesh(geometry, material);
  accretionDisk.rotation.x = -Math.PI / 2;
  scene.add(accretionDisk);

  function updateAccretionDisk(delta) {
    material.uniforms.time.value += delta;
  }

  return updateAccretionDisk;
}
