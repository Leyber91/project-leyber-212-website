// Set up WebGL context
const canvasTest = document.getElementById('glCanvas');
const gl = canvasTest.getContext('webgl2');
if (!gl) {
  alert('Your browser does not support WebGL 2');
}class Mat4 {
    static create() {
      let mat = new Float32Array(16);
      mat[0] = mat[5] = mat[10] = mat[15] = 1;
      return mat;
    }
  
    static perspective(out, fov, aspect, near, far) {
      const f = 1.0 / Math.tan(fov / 2);
      const nf = 1 / (near - far);
      out[0] = f / aspect;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = f;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = (far + near) * nf;
      out[11] = -1;
      out[12] = 0;
      out[13] = 0;
      out[14] = 2 * far * near * nf;
      out[15] = 0;
      return out;
    }
  
    static multiply(out, a, b) {
      let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
      let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
      let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
      let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  
      let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
      out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  
      b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
      out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  
      b0 = b[8];
      b1 = b[9]; b2 = b[10]; b3 = b[11];
      out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  
      b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
      out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      return out;
    }
  
    static rotateY(out, a, rad) {
      const s = Math.sin(rad);
      const c = Math.cos(rad);
      const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
      const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  
      out[0] = c * a00 - s * a20;
      out[1] = c * a01 - s * a21;
      out[2] = c * a02 - s * a22;
      out[3] = c * a03 - s * a23;
      out[8] = s * a00 + c * a20;
      out[9] = s * a01 + c * a21;
      out[10] = s * a02 + c * a22;
      out[11] = s * a03 + c * a23;
  
      if (a !== out) {
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
      }
      return out;
    }
  }
    



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
  const viewMatrix = Mat4.create();
  const projectionMatrix = Mat4.create();
  Mat4.perspective(projectionMatrix, (45 * Math.PI) / 180, canvasTest.width / canvasTest.height, 0.1, 100);
  
  // Set the initial model matrix
  const modelMatrix = Mat4.create();
  
  // Main render loop
  function render() {
    // Clear the canvas
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
  
    // Rotate the model matrix
    Mat4.rotateY(modelMatrix, modelMatrix, 0.01);
  
    // Update the model-view matrix
    const modelViewMatrix = Mat4.create();
    Mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
  
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
    Mat4.perspective(projectionMatrix, (45 * Math.PI) / 180, canvasTest.width / canvasTest.height, 0.1, 100);
  }
  
  // Add the event listener for window resizing
  window.addEventListener('resize', onWindowResize, false);

  // ...

// Function to draw the scene
function drawScene() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    Mat4.rotateX(modelMatrix, modelMatrix, 0.01);
    Mat4.rotateY(modelMatrix, modelMatrix, 0.01);
  
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
  