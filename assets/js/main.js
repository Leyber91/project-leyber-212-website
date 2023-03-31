// Vertex shader source code
const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

// Fragment shader source code
const fragmentShaderSource = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;

  float circle(vec2 coord, float radius) {
    return 1.0 - smoothstep(radius - 0.01, radius, length(coord));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 coord = uv * 2.0 - 1.0;
    coord.x *= u_resolution.x / u_resolution.y;

    float radius = 0.5 + 0.1 * sin(u_time * 2.0);
    float circleShape = circle(coord, radius);

    gl_FragColor = vec4(vec3(circleShape), 1.0);
  }
`;

// Initialize WebGL and create shaders, program, buffers, etc.
function initGL() {
  // ... your WebGL initialization code here ...
}

// Create a loop to render the scene
function renderLoop(time) {
  // ... your rendering code here ...
}

// Initialize WebGL and start the rendering loop
initGL();
renderLoop();
