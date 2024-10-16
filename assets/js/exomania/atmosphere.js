// File: assets/js/exomania/atmosphere.js

import { getPlanetType } from './utils.js';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import { noiseFunctions } from './materials/shaderChunks.js';
/**
 * Creates an atmospheric effect around the planet mesh with normal mapping.
 * @param {THREE.Mesh} planetMesh - The mesh of the planet.
 * @param {object} planetData - Data of the planet to determine atmospheric properties.
 */
export function createAtmosphere(planetMesh, planetData) {
  const atmosphereGeometry = planetMesh.geometry.clone();

  // Calculate planet radius safely
  let planetRadius = 1;
  if (planetMesh.geometry.boundingSphere && planetMesh.geometry.boundingSphere.radius) {
    planetRadius = planetMesh.geometry.boundingSphere.radius;
  } else if (planetData.pl_rade) {
    planetRadius = planetData.pl_rade * 0.1;
  }

  const planetType = getPlanetType(planetData);

  // Define uniforms with expanded properties
  const uniforms = {
    atmosphereColor: { value: new THREE.Color(0.5, 0.6, 0.7) },
    planetRadius: { value: planetRadius },
    atmosphereRadius: { value: planetRadius * 1.025 },
    cameraPosition: { value: new THREE.Vector3() },
    atmosphereDensity: { value: 1.0 },
    scatteringCoefficient: { value: 0.05 },
    planetType: { value: planetType },
    time: { value: 0 },
    normalScale: { value: new THREE.Vector2(1, 1) },
    colorGradientStart: { value: new THREE.Color(0.5, 0.6, 0.7) },
    colorGradientEnd: { value: new THREE.Color(0.2, 0.3, 0.4) },
  };

  // Adjust uniforms based on planet type
  switch (planetType) {
    case 0:
      // Rocky Planet atmosphere color gradients
      uniforms.colorGradientStart.value.setHSL(0.3, 0.8, 0.6);
      uniforms.colorGradientEnd.value.setHSL(0.3, 0.5, 0.4);
      break;
    case 1:
      // Gas Giant atmosphere color gradients
      uniforms.colorGradientStart.value.setHSL(0.6, 0.6, 0.7);
      uniforms.colorGradientEnd.value.setHSL(0.6, 0.4, 0.5);
      break;
    case 2:
      // Icy Planet atmosphere color gradients
      uniforms.colorGradientStart.value.setHSL(0.55, 0.5, 0.8);
      uniforms.colorGradientEnd.value.setHSL(0.55, 0.3, 0.6);
      break;
    case 3:
      // Lava Planet atmosphere color gradients
      uniforms.colorGradientStart.value.setHSL(0.05, 0.8, 0.7);
      uniforms.colorGradientEnd.value.setHSL(0.05, 0.6, 0.5);
      break;
    default:
      // Default atmosphere color gradients
      uniforms.colorGradientStart.value.setHSL(0.5, 0.6, 0.7);
      uniforms.colorGradientEnd.value.setHSL(0.5, 0.4, 0.5);
      break;
  }

  // Vertex shader remains the same or can be optimized further if needed
  const vertexShader = `
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Updated fragment shader with color gradients
  const fragmentShader = `
    uniform vec3 atmosphereColor;
    uniform float planetRadius;
    uniform float atmosphereRadius;
    uniform float atmosphereDensity;
    uniform float scatteringCoefficient;
    uniform int planetType;
    uniform float time;
    uniform vec2 normalScale;
    uniform vec3 colorGradientStart;
    uniform vec3 colorGradientEnd;

    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec2 vUv;

    ${noiseFunctions} // Include noise functions

    // Simple normal map generation function
    vec3 createSimpleNormalMap(vec2 uv) {
      float noise = snoise(vec3(uv * 10.0, time * 0.1));
      return vec3(noise, noise, 1.0);
    }

    void main() {
      vec3 viewDir = normalize(vWorldPosition - cameraPosition);
      float height = length(vWorldPosition) - planetRadius;
      float atmosphereThickness = atmosphereRadius - planetRadius;

      // Generate normal map with enhanced texture
      vec3 normalMap = createSimpleNormalMap(vUv);
      vec3 normal = normalize(vNormal + normalMap * normalScale.x);

      // Calculate atmosphere density
      float density = exp(-height / (atmosphereThickness * atmosphereDensity));

      // Scattering based on view angle
      float cosAngle = dot(normalize(vWorldPosition), viewDir);
      float scattering = pow(1.0 - cosAngle, 3.0) * scatteringCoefficient;

      // Apply color gradient based on height
      vec3 gradientColor = mix(colorGradientStart, colorGradientEnd, height / atmosphereThickness);
      vec3 finalColor = gradientColor;

      // Additional animated effects
      if (planetType == 1) { // Gas giant
        finalColor *= 1.0 + 0.2 * sin(vWorldPosition.y * 10.0 + time * 0.1);
      } else if (planetType == 3) { // Lava planet
        finalColor *= 1.0 + 0.1 * sin(vWorldPosition.x * 20.0 + vWorldPosition.y * 20.0 + time * 0.2);
      }

      // Apply normal mapping effect
      float normalEffect = dot(normal, viewDir);
      finalColor *= 1.0 + normalEffect * 0.2;

      // Calculate final intensity
      float intensity = density * scattering;

      gl_FragColor = vec4(finalColor, intensity);
    }
  `;

  const atmosphereMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.FrontSide,
    transparent: true,
    depthWrite: false,
  });

  const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

  const atmosphereScale = uniforms.atmosphereRadius.value / planetRadius;
  atmosphereMesh.scale.set(atmosphereScale, atmosphereScale, atmosphereScale);

  planetMesh.add(atmosphereMesh);

  atmosphereMesh.userData.update = (camera, delta) => {
    if (!camera || !camera.position) {
      console.error('Camera is undefined or missing position in atmosphereMesh.userData.update');
      return;
    }

    atmosphereMaterial.uniforms.cameraPosition.value.copy(camera.position);
    atmosphereMaterial.uniforms.time.value += delta;
  };

  return atmosphereMesh;
}