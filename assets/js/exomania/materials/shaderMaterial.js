// File: assets/js/exomania/materials/shaderMaterial.js

/**
 * Shader Material for Exomania Planets
 * 
 * This module defines a customizable shader material for rendering exoplanets
 * with realistic terrains, lighting, and atmospheric effects. The shader adapts
 * its appearance based on the planet's type and properties provided in the
 * planetData object. Enhancements include expanded color palettes, increased
 * texture variety, and support for multiple planet variations.
 * 
 * Dependencies:
 * - THREE.js library
 * - Utility functions from utils.js
 */
import { isGasGiant, calculateGravity, calculateDensity, getPlanetType } from '../utils.js';

// GLSL Shader Chunks for Noise and Utility Functions
const shaderChunks = `
//
// GLSL Noise Functions and Utilities
// Author: Ian McEwan, Ashima Arts
// Source: https://github.com/ashima/webgl-noise
//

// mod289: Overloaded for vec3 and vec4
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

// permute: Overloaded for vec3 and vec4
vec4 permute(vec4 x) {
  return mod289(((x*34.0)+1.0)*x);
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

// taylorInvSqrt: Overloaded for vec3 and vec4
vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 taylorInvSqrt(vec3 r) {
  return vec3(
    1.79284291400159 - 0.85373472095314 * r.x,
    1.79284291400159 - 0.85373472095314 * r.y,
    1.79284291400159 - 0.85373472095314 * r.z
  );
}

// fade: Overloaded for float and vec3
float fade(float t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

vec3 fade(vec3 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

// Simplex Noise function (snoise)
float snoise(vec3 v) {
  const vec2  C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  // x0 = x0 - 0.0 + 0.0 * C
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  // Permutations
  i = mod289(i);
  vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients
  float n_ = 1.0 / 7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

// Fractal Brownian Motion (fbm) for smoother terrain
float fbm(vec3 position) {
  float total = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;

  for (int i = 0; i < 5; i++) { // 5 octaves for detail
    total += amplitude * snoise(position * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }

  return total;
}

// Ridged Multifractal Noise for mountainous terrain
float ridgedMF(vec3 position, float lacunarity, float gain, int octaves) {
  float sum = 0.0;
  float frequency = 1.0;
  float amplitude = 0.5;
  float prev = 1.0;
  for (int i = 0; i < octaves; i++) {
    float n = abs(snoise(position * frequency));
    n = 1.0 - n;
    n = n * n;
    sum += n * amplitude * prev;
    prev = n;
    frequency *= lacunarity;
    amplitude *= gain;
  }
  return sum;
}

// Turbulence function for additional noise
float turbulence(vec3 position) {
  float t = -0.5;
  for (int i = 1; i <= 5; i++) {
    float power = pow(2.0, float(i));
    t += abs(snoise(position * power)) / power;
  }
  return t;
}

// Calculate normals based on noise derivatives
vec3 calculateNormal(vec3 position, float elevationScale) {
  float epsilon = 0.0001;
  float nx = fbm(position + vec3(epsilon, 0.0, 0.0)) - fbm(position - vec3(epsilon, 0.0, 0.0));
  float ny = fbm(position + vec3(0.0, epsilon, 0.0)) - fbm(position - vec3(0.0, epsilon, 0.0));
  float nz = fbm(position + vec3(0.0, 0.0, epsilon)) - fbm(position - vec3(0.0, 0.0, epsilon));

  vec3 normal = normalize(vec3(nx, ny, nz));
  return normal;
}

// Simple atmospheric scattering model
vec3 atmosphericScattering(vec3 viewDir, vec3 normal, vec3 lightDir, vec3 baseColor) {
  float cosTheta = dot(normal, viewDir);
  float rayleigh = pow(1.0 - cosTheta, 2.5);
  vec3 scatteredLight = vec3(0.5, 0.6, 0.7) * rayleigh;
  return mix(baseColor, scatteredLight, 0.5);
}
`;

// Vertex Shader Code
const vertexShader = `

varying vec3 vNormal;        // Interpolated normal vector
varying vec3 vPosition;      // Vertex position in world space
varying float vElevation;    // Elevation value for displacement mapping
varying vec2 vUv;            // UV coordinates for texture mapping

uniform float elevationScale;  // Scale factor for terrain elevation
uniform float time;            // Time uniform for animations
uniform int planetType;        // Type of planet (0: rocky, 1: gas giant, 2: ice, etc.)

${shaderChunks}               // Include noise and lighting functions

void main() {
  vUv = uv;                                   // Pass UV coordinates to fragment shader

  // Generate elevation based on planet type
  float elevation = 0.0;
  vec3 noisePosition = position * 2.0 + time * 0.05;

  if (planetType == 0) {
    // Rocky planet terrain with smooth hills and valleys
    elevation = fbm(noisePosition) * elevationScale;
    elevation = pow(elevation, 0.8); // Apply smoothing
    elevation = clamp(elevation, -0.05, 0.05); // Limit elevation to reduce protrusions
  } else if (planetType == 1) {
    // Gas giant with subtle banding
    elevation = sin(position.y * 10.0 + fbm(noisePosition)) * 0.01;
  } else if (planetType == 2) {
    // Icy planet with ridged multifractal noise for icy mountains
    elevation = ridgedMF(noisePosition, 2.0, 0.5, 5) * elevationScale;
    elevation = clamp(elevation, -0.05, 0.05); // Limit elevation for smoothness
  } else if (planetType == 3) {
    // Lava planet with volcanic features
    elevation = fbm(noisePosition * 3.0) * elevationScale * 0.5;
    elevation = clamp(elevation, -0.05, 0.05); // Limit elevation to prevent extreme peaks
  }

  vElevation = elevation;                     // Pass elevation to fragment shader

  // Displace vertex position along the normal vector
  vec3 displacedPosition = position + normal * elevation;

  // Transform position and normal to world space
  vPosition = (modelMatrix * vec4(displacedPosition, 1.0)).xyz;
  vNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
`;

// Fragment Shader Code with Enhanced Color Palettes and Texture Variety
const fragmentShader = `

varying vec3 vNormal;        // Interpolated normal vector from vertex shader
varying vec3 vPosition;      // Vertex position in world space
varying float vElevation;    // Elevation value from vertex shader
varying vec2 vUv;            // UV coordinates

uniform vec3 colorDeep;      // Deep water color
uniform vec3 colorShallow;   // Shallow water color
uniform vec3 colorLandLow;   // Low elevation land color
uniform vec3 colorLandHigh;  // High elevation land color
uniform float waterLevel;    // Water level threshold
uniform float specularStrength; // Strength of specular highlights
uniform vec3 lightDirection;    // Direction of the main light source
uniform float time;             // Time uniform for animations
uniform int planetType;         // Type of planet (0: rocky, 1: gas giant, 2: ice, etc.)
uniform float atmosphereDensity; // Density of the atmosphere
uniform vec3 atmosphereColor;    // Color of the atmosphere

// Enhanced water rendering uniforms
uniform float waterReflectivity; // Reflectivity factor of water
uniform float waterSpecular;     // Specular highlight intensity for water
uniform float waveAmplitude;     // Amplitude of water waves
uniform float waveFrequency;     // Frequency of water waves

${shaderChunks}               // Include noise and lighting functions

// Enhanced color palette arrays with more variety and realism
const int PALETTE_SIZE = 16;

// Improved color palettes for diverse planet surfaces
vec3 getColorFromPalette(int type, float value) {
  int paletteStart = type * PALETTE_SIZE;
  
  // Define enhanced color palettes
  vec3 palettes[PALETTE_SIZE * 4];
  
  // Rocky planet palettes (Earth-like, Mars-like, etc.)
  palettes[0] = vec3(0.05, 0.2, 0.05);   // Dark forest
  palettes[1] = vec3(0.6, 0.55, 0.5);    // Sandy desert
  palettes[2] = vec3(0.3, 0.3, 0.3);     // Rocky mountains
  palettes[3] = vec3(0.8, 0.8, 0.8);     // Snowy peaks
  palettes[4] = vec3(0.2, 0.15, 0.1);    // Rich soil
  palettes[5] = vec3(0.7, 0.7, 0.6);     // Dry savanna
  palettes[6] = vec3(0.5, 0.25, 0.1);    // Red desert
  palettes[7] = vec3(0.1, 0.1, 0.1);     // Volcanic rock
  palettes[8] = vec3(0.4, 0.45, 0.35);   // Mossy terrain
  palettes[9] = vec3(0.6, 0.6, 0.5);     // Arid plains
  palettes[10] = vec3(0.2, 0.2, 0.25);   // Slate mountains
  palettes[11] = vec3(0.7, 0.65, 0.6);   // Sandstone cliffs
  palettes[12] = vec3(0.3, 0.35, 0.3);   // Coniferous forests
  palettes[13] = vec3(0.5, 0.5, 0.45);   // Grasslands
  palettes[14] = vec3(0.15, 0.15, 0.2);  // Dark basalt
  palettes[15] = vec3(0.55, 0.5, 0.45);  // Weathered rock
  
  // Gas giant palettes (Jupiter-like, Neptune-like, etc.)
  palettes[16] = vec3(0.8, 0.7, 0.5);    // Beige bands
  palettes[17] = vec3(0.6, 0.4, 0.2);    // Orange storms
  palettes[18] = vec3(0.4, 0.3, 0.2);    // Dark belts
  palettes[19] = vec3(0.9, 0.8, 0.6);    // Light zones
  palettes[20] = vec3(0.7, 0.5, 0.3);    // Turbulent eddies
  palettes[21] = vec3(0.5, 0.4, 0.3);    // Muted bands
  palettes[22] = vec3(0.3, 0.5, 0.7);    // Blue-tinted storms
  palettes[23] = vec3(0.2, 0.3, 0.5);    // Deep blue layers
  palettes[24] = vec3(0.6, 0.6, 0.7);    // Pale striations
  palettes[25] = vec3(0.4, 0.4, 0.6);    // Purple-tinged clouds
  palettes[26] = vec3(0.7, 0.7, 0.8);    // White cloud tops
  palettes[27] = vec3(0.5, 0.5, 0.6);    // Gray storm systems
  palettes[28] = vec3(0.3, 0.4, 0.5);    // Dark blue depths
  palettes[29] = vec3(0.6, 0.5, 0.4);    // Tan cloud layers
  palettes[30] = vec3(0.5, 0.6, 0.7);    // Light blue hazes
  palettes[31] = vec3(0.4, 0.5, 0.4);    // Green-tinted bands
  
  // Icy planet palettes (Europa-like, Enceladus-like, etc.)
  palettes[32] = vec3(0.9, 0.95, 1.0);   // Pure ice
  palettes[33] = vec3(0.7, 0.8, 0.9);    // Blue-tinged ice
  palettes[34] = vec3(0.8, 0.85, 0.9);   // Compacted snow
  palettes[35] = vec3(0.6, 0.7, 0.8);    // Glacial crevasses
  palettes[36] = vec3(0.5, 0.6, 0.7);    // Deep ice fissures
  palettes[37] = vec3(0.75, 0.8, 0.85);  // Frost-covered plains
  palettes[38] = vec3(0.65, 0.7, 0.75);  // Icy mountains
  palettes[39] = vec3(0.85, 0.9, 0.95);  // Fresh snow
  palettes[40] = vec3(0.55, 0.65, 0.7);  // Shadowed ice valleys
  palettes[41] = vec3(0.8, 0.9, 1.0);    // Reflective ice sheets
  palettes[42] = vec3(0.7, 0.75, 0.8);   // Dirty ice
  palettes[43] = vec3(0.6, 0.65, 0.7);   // Methane ice
  palettes[44] = vec3(0.5, 0.55, 0.6);   // Ancient ice layers
  palettes[45] = vec3(0.75, 0.85, 0.9);  // Crystalline ice structures
  palettes[46] = vec3(0.65, 0.75, 0.85); // Subsurface ocean hints
  palettes[47] = vec3(0.7, 0.8, 0.85);   // Fractured ice terrain
  
  // Lava planet palettes (Io-like, super-heated worlds, etc.)
  palettes[48] = vec3(1.0, 0.6, 0.0);    // Molten lava
  palettes[49] = vec3(0.9, 0.3, 0.0);    // Cooling lava crust
  palettes[50] = vec3(0.7, 0.2, 0.0);    // Solidified magma
  palettes[51] = vec3(0.5, 0.1, 0.0);    // Volcanic rock
  palettes[52] = vec3(1.0, 0.8, 0.0);    // Sulfur deposits
  palettes[53] = vec3(0.8, 0.4, 0.0);    // Lava tubes
  palettes[54] = vec3(0.6, 0.2, 0.0);    // Cooling pyroclastic flows
  palettes[55] = vec3(1.0, 0.5, 0.0);    // Fresh lava flows
  palettes[56] = vec3(0.4, 0.1, 0.0);    // Charred crust
  palettes[57] = vec3(0.9, 0.6, 0.2);    // Hot spots
  palettes[58] = vec3(0.7, 0.3, 0.1);    // Cooling lava lakes
  palettes[59] = vec3(0.5, 0.2, 0.1);    // Volcanic plains
  palettes[60] = vec3(0.8, 0.3, 0.0);    // Lava fountains
  palettes[61] = vec3(0.6, 0.3, 0.1);    // Solidifying magma chambers
  palettes[62] = vec3(1.0, 0.7, 0.2);    // Erupting volcanoes
  palettes[63] = vec3(0.7, 0.4, 0.1);    // Cooling lava rivers

  // Use improved noise function for more natural color variation
  float noiseValue = fbm(vec3(value * 10.0, 0.0, 0.0));
  int paletteIndex = paletteStart + int(mod(noiseValue * float(PALETTE_SIZE), float(PALETTE_SIZE)));
  return palettes[paletteIndex];
}

void main() {
  // Normalize the normal vector
  vec3 normal = normalize(vNormal);

  // Calculate light direction and view direction
  vec3 lightDir = normalize(lightDirection);
  vec3 viewDir = normalize(cameraPosition - vPosition);

  // Calculate diffuse lighting using Lambertian reflectance
  float lambertian = max(dot(normal, lightDir), 0.0);

  // Calculate specular lighting using Blinn-Phong model
  float specular = 0.0;
  if (lambertian > 0.0) {
    vec3 halfDir = normalize(lightDir + viewDir);
    float specAngle = max(dot(halfDir, normal), 0.0);
    specular = pow(specAngle, 64.0) * specularStrength;
  }

  // Determine base color based on planet type and elevation
  vec3 baseColor;
  if (planetType == 0) {
    // Rocky planet with water and land
    if (vElevation < waterLevel) {
      // Underwater
      float waterDepth = (waterLevel - vElevation) / waterLevel;
      waterDepth = clamp(waterDepth, 0.0, 1.0);
      
      // Enhanced water with dynamic waves
      float wave = snoise(vPosition * waveFrequency + vec3(0.0, time * 0.5, 0.0));
      wave = clamp(wave, -1.0, 1.0) * waveAmplitude;
      
      // Fresnel effect
      float fresnel = pow(1.0 - dot(viewDir, normal), 3.0);
      vec3 reflectColor = vec3(1.0) * fresnel * waterReflectivity;
      
      // Specular highlights
      vec3 specularHighlight = vec3(specular) * waterSpecular;
      
      // Mix shallow and deep colors with waves and reflections
      vec3 waterColor = mix(colorShallow, colorDeep, waterDepth);
      waterColor += wave;
      waterColor = mix(waterColor, reflectColor, fresnel);
      waterColor += specularHighlight;
      
      baseColor = waterColor;
    } else {
      // Land
      float landHeight = (vElevation - waterLevel) / (1.0 - waterLevel);
      landHeight = clamp(landHeight, 0.0, 1.0);
      
      // Use color palette for variety
      baseColor = getColorFromPalette(planetType, landHeight);
      
      // Add subtle terrain detail using fbm
      float terrainDetail = fbm(vPosition * 5.0 + time * 0.1);
      baseColor += terrainDetail * 0.1;
      
      // Ensure baseColor remains within [0,1]
      baseColor = clamp(baseColor, 0.0, 1.0);
    }
  } else if (planetType == 1) {
    // Gas giant with multiple color bands
    float banding = sin(vUv.y * 50.0 + fbm(vPosition * 10.0)) * 0.5 + 0.5;
    baseColor = getColorFromPalette(planetType, banding);
  } else if (planetType == 2) {
    // Icy planet with bluish tones and snow caps
    float iceFactor = fbm(vPosition * 3.0 + time * 0.1);
    iceFactor = clamp(iceFactor, 0.0, 1.0);
    baseColor = getColorFromPalette(planetType, iceFactor);
    
    // Add snow caps based on elevation
    if (vElevation > 0.04) {
      baseColor = mix(baseColor, vec3(1.0), 0.7);
    }
  } else if (planetType == 3) {
    // Lava planet with glowing cracks
    float lava = smoothstep(0.8, 1.0, fbm(vPosition * 5.0 + time * 0.5));
    lava = clamp(lava, 0.0, 1.0);
    baseColor = getColorFromPalette(planetType, lava);
    
    // Add glowing effects based on waves
    float glow = sin(vUv.x * waveFrequency + time) * 0.5 + 0.5;
    glow = clamp(glow, 0.0, 1.0);
    baseColor += vec3(glow) * 0.2;
  } else {
    // Default gray color for undefined planet types
    baseColor = vec3(0.5, 0.5, 0.5);
  }

  // Combine base color with lighting
  vec3 color = baseColor * lambertian + vec3(specular);

  // Apply atmospheric scattering if atmosphere is present
  if (atmosphereDensity > 0.0) {
    color = atmosphericScattering(viewDir, normal, lightDir, color);
  }

  gl_FragColor = vec4(color, 1.0);
}
`;

/**
 * Creates a ShaderMaterial for a planet based on its data.
 * @param {object} planetData - Data object containing planet properties.
 * @returns {THREE.ShaderMaterial} - Configured ShaderMaterial.
 */
export function createPlanetMaterial(planetData) {
  // Helper function to calculate modulo
  const mod = (n, m) => ((n % m) + m) % m;

  // Determine planet type
  const planetType = getPlanetType(planetData); // 0: rocky, 1: gas giant, 2: ice, 3: lava

  // Calculate gravity and density (optional, can be used for further adjustments)
  const gravity = calculateGravity(planetData);
  const density = calculateDensity(planetData.pl_masse, planetData.pl_rade);

  // Define uniforms with initial values
  const uniforms = {
    elevationScale: { value: 0.05 }, // Initial elevation scale, adjust based on planet type
    colorDeep: { value: new THREE.Color(0x000080) },    // Deep water color (e.g., deep blue)
    colorShallow: { value: new THREE.Color(0x1E90FF) }, // Shallow water color (e.g., dodger blue)
    colorLandLow: { value: new THREE.Color(0x228B22) }, // Low elevation land color (e.g., forest green)
    colorLandHigh: { value: new THREE.Color(0xCCCC99) },// High elevation land color (e.g., sandy brown)
    waterLevel: { value: 0.0 },                       // Water level threshold
    specularStrength: { value: 0.5 },                 // Specular highlight strength
    lightDirection: { value: new THREE.Vector3(1.0, 1.0, 1.0).normalize() }, // Light direction
    time: { value: 0.0 },                              // Time uniform for animations
    planetType: { value: planetType },                 // Planet type identifier
    atmosphereDensity: { value: 0.0 },                 // Atmosphere density
    atmosphereColor: { value: new THREE.Color(0.5, 0.6, 0.7) }, // Atmosphere color

    // New uniforms for enhanced water rendering
    waterReflectivity: { value: 0.3 }, // Reflectivity factor of water
    waterSpecular: { value: 0.5 },     // Specular highlight intensity for water
    waveAmplitude: { value: 0.02 },    // Amplitude of water waves
    waveFrequency: { value: 2.0 },     // Frequency of water waves

    // New uniforms for enhanced color variety
    colorVariation: { value: 0.2 },    // Amount of color variation
    colorNoise: { value: 0.1 },        // Noise factor for color variation
  };

  /**
   * Adjust uniforms based on planet type for realistic rendering.
   */
  switch (planetType) {
    case 0:
      // Rocky Planet Adjustments
      uniforms.elevationScale.value = 0.05; // Smaller elevation for smoother terrain
      uniforms.waterLevel.value = -0.02;    // Water level threshold
      uniforms.specularStrength.value = 0.4; // Moderate specular highlights

      // Adjust land colors based on equilibrium temperature and composition
      {
        const temp = planetData.pl_eqt || 300; // Kelvin
        const tempFactor = THREE.MathUtils.clamp((temp - 200) / 800, 0, 1);
        const composition = planetData.pl_dens || 1.0; // Density as proxy for composition

        // Determine base hue based on temperature and composition
        let baseHue = 0.3; // Default green-ish hue
        if (temp > 500) baseHue = 0.05; // Shift towards red for hot planets
        if (composition > 5) baseHue = 0.6; // Shift towards blue for metal-rich planets

        // Set multiple land colors using gradient-based palette
        const landColorLow = new THREE.Color().setHSL(baseHue, 0.8, 0.3 + tempFactor * 0.3);
        const landColorMid = new THREE.Color().setHSL(mod(baseHue + 0.05, 1), 0.7, 0.4 + tempFactor * 0.25);
        const landColorHigh = new THREE.Color().setHSL(mod(baseHue + 0.1, 1), 0.6, 0.6 + tempFactor * 0.2);
        uniforms.colorLandLow.value.copy(landColorLow);
        uniforms.colorLandMid = { value: landColorMid };
        uniforms.colorLandHigh.value.copy(landColorHigh);

        // Add accent colors for more variety
        uniforms.colorAccent1 = { value: new THREE.Color().setHSL(mod(baseHue + 0.2, 1), 0.9, 0.5) };
        uniforms.colorAccent2 = { value: new THREE.Color().setHSL(mod(baseHue - 0.2, 1), 0.7, 0.6) };

        // Adjust terrain features based on composition
        uniforms.elevationScale.value = 0.05 + (composition - 1) * 0.01; // More varied terrain for denser planets
        uniforms.waterLevel.value = Math.max(-0.02, -0.05 + tempFactor * 0.03); // Adjust water level

        // Atmosphere settings
        const atmFactor = Math.max(0.0, 1.0 - tempFactor); // Less atmosphere for hotter planets
        uniforms.atmosphereDensity.value = 0.5 * atmFactor;
        uniforms.atmosphereColor.value.setHSL(baseHue, 0.3, 0.7);

        // Specular adjustments
        uniforms.specularStrength.value = 0.4 + tempFactor * 0.2; // More reflective for hotter planets

        // Water properties based on planet temperature and composition
        uniforms.waterReflectivity.value = 0.3 + tempFactor * 0.2; // Higher reflectivity for hotter planets
        uniforms.waterSpecular.value = 0.5 + tempFactor * 0.3;     // More specular highlights
        uniforms.waveAmplitude.value = 0.02 + composition * 0.005; // Larger waves for denser planets
        uniforms.waveFrequency.value = 2.0 + composition * 0.5;    // Higher frequency for denser planets

        // Enhanced color variety
        uniforms.colorVariation.value = 0.3 + tempFactor * 0.2;    // More variation for extreme temperatures
        uniforms.colorNoise.value = 0.15 + composition * 0.05;     // More noise for varied compositions
      }
      break;

    case 1:
      // Gas Giant Adjustments
      uniforms.elevationScale.value = 0.0; // No terrain displacement
      uniforms.waterLevel.value = -0.02;    // Irrelevant for gas giants
      uniforms.specularStrength.value = 0.3; // Lower specular highlights

      // Set banded colors based on temperature
      {
        const temp = planetData.pl_eqt || 1000; // Kelvin
        const hue = mod(temp / 360, 1); // Normalize hue
        uniforms.colorLandLow.value.setHSL(hue, 0.8, 0.5);
        uniforms.colorLandMid = { value: new THREE.Color().setHSL(mod(hue + 0.05, 1), 0.85, 0.55) };
        uniforms.colorLandHigh.value.setHSL(mod(hue + 0.1, 1), 0.8, 0.6);
        
        // Add more band colors for variety
        uniforms.colorBand1 = { value: new THREE.Color().setHSL(mod(hue + 0.15, 1), 0.9, 0.45) };
        uniforms.colorBand2 = { value: new THREE.Color().setHSL(mod(hue - 0.1, 1), 0.75, 0.65) };
        uniforms.colorBand3 = { value: new THREE.Color().setHSL(mod(hue + 0.2, 1), 0.7, 0.7) };
      }

      // Atmosphere settings
      uniforms.atmosphereDensity.value = 1.5;
      uniforms.atmosphereColor.value.setHSL(0.6, 0.6, 0.7); // Example color

      // Disable water properties for gas giants
      uniforms.waterReflectivity.value = 0.0;
      uniforms.waterSpecular.value = 0.0;
      uniforms.waveAmplitude.value = 0.0;
      uniforms.waveFrequency.value = 0.0;

      // Enhanced color variety for gas giants
      uniforms.colorVariation.value = 0.4;    // High variation for complex band structures
      uniforms.colorNoise.value = 0.2;        // More noise for turbulent atmospheres
      break;

    case 2:
      // Icy Planet Adjustments
      uniforms.elevationScale.value = 0.02; // Smaller elevation for smoother icy terrain
      uniforms.waterLevel.value = -0.02;    // Water level threshold
      uniforms.colorLandLow.value.setRGB(0.8, 0.9, 1.0); // Icy low land color
      uniforms.colorLandMid = { value: new THREE.Color(0.7, 0.85, 0.95) }; // Mid-elevation ice color
      uniforms.colorLandHigh.value.setRGB(0.6, 0.8, 1.0); // Icy high land color
      uniforms.specularStrength.value = 0.6; // Higher specular highlights for ice

      // Add more ice color variations
      uniforms.colorIce1 = { value: new THREE.Color(0.9, 0.95, 1.0) }; // Pure white ice
      uniforms.colorIce2 = { value: new THREE.Color(0.7, 0.8, 0.9) };  // Slightly blue ice
      uniforms.colorIce3 = { value: new THREE.Color(0.85, 0.9, 0.95) }; // Pale blue ice

      // Atmosphere settings
      uniforms.atmosphereDensity.value = 2.0;
      uniforms.atmosphereColor.value.setRGB(0.6, 0.7, 0.8); // Icy atmosphere color

      // Water properties based on icy conditions
      uniforms.waterReflectivity.value = 0.4; // Higher reflectivity for icy water
      uniforms.waterSpecular.value = 0.6;     // More specular highlights
      uniforms.waveAmplitude.value = 0.015;   // Smaller waves for icy water
      uniforms.waveFrequency.value = 1.8;     // Slightly lower frequency

      // Enhanced color variety for icy planets
      uniforms.colorVariation.value = 0.15;   // Subtle variations in ice colors
      uniforms.colorNoise.value = 0.08;       // Less noise for smoother ice surfaces
      break;

    case 3:
      // Lava Planet Adjustments
      uniforms.elevationScale.value = 0.03; // Slightly higher elevation for lava flows
      uniforms.waterLevel.value = -0.02;    // Irrelevant for lava planets
      uniforms.colorLandLow.value.setRGB(0.5, 0.1, 0.0); // Dark lava color
      uniforms.colorLandMid = { value: new THREE.Color(0.8, 0.3, 0.0) }; // Mid-temperature lava
      uniforms.colorLandHigh.value.setRGB(1.0, 0.5, 0.0); // Glowing lava color
      uniforms.specularStrength.value = 0.8; // Strong specular highlights for molten surfaces

      // Add more lava color variations
      uniforms.colorLava1 = { value: new THREE.Color(1.0, 0.7, 0.2) }; // Bright yellow-orange lava
      uniforms.colorLava2 = { value: new THREE.Color(0.9, 0.4, 0.1) }; // Deep orange lava
      uniforms.colorLava3 = { value: new THREE.Color(0.7, 0.2, 0.0) }; // Dark red lava

      // Atmosphere settings
      uniforms.atmosphereDensity.value = 1.0;
      uniforms.atmosphereColor.value.setRGB(0.8, 0.3, 0.1); // Fiery atmosphere color

      // Disable water properties for lava planets
      uniforms.waterReflectivity.value = 0.0;
      uniforms.waterSpecular.value = 0.0;
      uniforms.waveAmplitude.value = 0.0;
      uniforms.waveFrequency.value = 0.0;

      // Enhanced color variety for lava planets
      uniforms.colorVariation.value = 0.5;    // High variation for dynamic lava flows
      uniforms.colorNoise.value = 0.3;        // More noise for turbulent lava surfaces
      break;

    default:
      // Default Planet Adjustments
      uniforms.elevationScale.value = 0.05;
      uniforms.waterLevel.value = -0.02;
      uniforms.colorLandLow.value.setRGB(0.5, 0.5, 0.5); // Neutral gray
      uniforms.colorLandMid = { value: new THREE.Color(0.6, 0.6, 0.6) }; // Mid-tone gray
      uniforms.colorLandHigh.value.setRGB(0.7, 0.7, 0.7); // Light gray
      uniforms.specularStrength.value = 0.4;

      // Atmosphere settings
      uniforms.atmosphereDensity.value = 0.5;
      uniforms.atmosphereColor.value.setRGB(0.5, 0.6, 0.7); // Default atmosphere color

      // Default water properties
      uniforms.waterReflectivity.value = 0.3;
      uniforms.waterSpecular.value = 0.5;
      uniforms.waveAmplitude.value = 0.02;
      uniforms.waveFrequency.value = 2.0;

      // Default color variety
      uniforms.colorVariation.value = 0.2;
      uniforms.colorNoise.value = 0.1;
      break;
  }

  /**
   * Create the ShaderMaterial with defined vertex and fragment shaders.
   */
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.FrontSide,
    transparent: uniforms.atmosphereDensity.value > 0.0, // Enable transparency if atmosphere is present
    depthWrite: false, // Prevent writing depth for transparent materials
  });

  return material;
}
