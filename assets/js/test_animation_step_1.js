// Vertex shader
const vertexShaderSource = `
  attribute vec4 a_position;
  uniform mat4 u_projectionMatrix;
  uniform mat4 u_modelViewMatrix;
  void main() {
    gl_Position = u_projectionMatrix * u_modelViewMatrix * a_position;
  }
`;

// Fragment shader
const fragmentShaderSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
  }
`;

// Set up WebGL context
const canvasTest = document.getElementById('glCanvas');
const gl = canvasTest.getContext('webgl');
if (!gl) {
  alert('Your browser does not support WebGL');
}

// Set up WebGL shader program
const shaderProgram = createShaderProgram(vertexShaderSource, fragmentShaderSource);
gl.useProgram(shaderProgram);

// Set up vertex data for cube
const vertices = [
  // Front face
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,
  
  // Back face
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0, -1.0, -1.0,
  
  // Top face
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,
  
  // Bottom face
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,
  
  // Right face
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,
  
  // Left face
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0
];
const indices = [
    0, 1, 2, 0, 2, 3, // front
    4, 5, 6, 4, 6, 7, // back
    8, 9, 10, 8, 10, 11, // top
    12, 13, 14, 12, 14, 15, // bottom
    16, 17, 18, 16, 18, 19, // right
    20, 21, 22, 20, 22, 23 // left
  ];
  
  // Create and bind VAO
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  
  // Create and bind VBO
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  // Set up vertex attributes
  const aPosition = gl.getAttribLocation(shaderProgram, 'a_position');
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPosition);
  
  // Create and bind EBO
  const ebo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  
  // Set up uniforms
  const uProjectionMatrix = gl.getUniformLocation(shaderProgram, 'u_projectionMatrix');
  const uModelViewMatrix = gl.getUniformLocation(shaderProgram, 'u_modelViewMatrix');
  
  // Set up the view and projection matrices
  const viewMatrix = mat4.create();
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, (45 * Math.PI) / 180, canvasTest.width / canvasTest.height, 0.1, 100);
  
  // Set the initial model matrix
  const modelMatrix = mat4.create();
  
  // Main render loop
  function render() {
    // Clear the canvas
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
  
    // Rotate the model matrix
    mat4.rotateY(modelMatrix, modelMatrix, 0.01);
  
    // Update the model-view matrix
    const modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
  
    // Set uniform values
    gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);
  
    // Draw the cube
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  
    // Request the next frame
    requestAnimationFrame(render);
  }
  
  // Start the render loop
  requestAnimationFrame(render);
  
  // Helper function to create a shader
  function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
  
    return shader;
  }
  
// Helper function to create a shader program
function createShaderProgram(vertexSource, fragmentSource) {
    const vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);
  
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
  
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('An error occurred linking the shader program:', gl.getProgramInfoLog(program));
      return null;
    }
  
    return program;
  }
  
  // Function to resize the canvas when the window is resized
  function onWindowResize() {
    canvasTest.width = window.innerWidth;
    canvasTest.height = window.innerHeight;
    gl.viewport(0, 0, canvasTest.width, canvasTest.height);
    mat4.perspective(projectionMatrix, (45 * Math.PI) / 180, canvasTest.width / canvasTest.height, 0.1, 100);
  }
  
  // Add the event listener for window resizing
  window.addEventListener('resize', onWindowResize, false);

  // ...

// Function to draw the scene
function drawScene() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    mat4.rotateX(modelMatrix, modelMatrix, 0.01);
    mat4.rotateY(modelMatrix, modelMatrix, 0.01);
  
    gl.useProgram(shaderProgram);
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uModel"), false, modelMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uView"), false, viewMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uProjection"), false, projectionMatrix);
  
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  }
  

  
  // Start the animation loop
// ...

// Animation loop function
function animate() {
    drawScene();
    animationId = requestAnimationFrame(animate);
  }
  
  // Function to start the animation
  function startAnimation() {
    if (!animationId) {
      animate();
    }
  }
  
  // Function to stop the animation
  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }
  
  // Add event listeners for the buttons
  document.getElementById('startAnimation').addEventListener('click', startAnimation);
  document.getElementById('stopAnimation').addEventListener('click', stopAnimation);
  
  // ...
  
  
  // ...
  