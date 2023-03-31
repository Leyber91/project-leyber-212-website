    // Initialize WebGL context
    const canvas = document.getElementById("glCanvas");
    const gl = canvas.getContext("webgl");

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Set up Mat4 transformation matrices
    const modelMatrix = mat4.create();
    const viewMatrix = mat4.create();
    const projectionMatrix = mat4.create();

    // Set up transformation parameters
    let angle = 0;
    let scale = 1;

    // Set up shader program
    const vertexShaderSource = `
        attribute vec3 a_position;

        uniform mat4 u_model;
        uniform mat4 u_view;
        uniform mat4 u_projection;

        void main() {
            gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
        }
    `;
    const fragmentShaderSource = `
        precision mediump float;

        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `;
    const shaderProgram = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

    // Set up buffer data
    const positions = [
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0,
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
    ];
    const indices = [
        0, 1, 2,
        0, 2, 3,
    ];
    const positionBuffer = createBuffer(gl, positions);
    const indexBuffer = createIndexBuffer(gl, indices);

    // Set up render loop
    let animationId = null;
    const render = () => {
        // Clear canvas
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Update transformation matrices
        mat4.rotate(modelMatrix, modelMatrix, angle, [0, 0, 1]);
        mat4.scale(modelMatrix, modelMatrix, [scale, scale, scale]);

        // Bind buffers and set uniforms
        gl.useProgram(shaderProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        setAttribute(gl, shaderProgram, "a_position", 3, gl.FLOAT, false, 0, 0);
        setUniformMat4(gl, shaderProgram, "u_model", modelMatrix);
        setUniformMat4(gl, shaderProgram, "u_view", viewMatrix);
        setUniformMat4(gl, shaderProgram, "u_projection", projectionMatrix);

      // Draw the rectangle
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

        // Update the rotation for the next draw
        angle += deltaAngle;

        // Request the next frame
        requestAnimationFrame(drawScene);
        }

        // Set up the canvas and WebGL context
        const canvas = document.getElementById("glCanvas");
        const gl = canvas.getContext("webgl");

        if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        }

        // Set the clear color and enable depth testing and blending
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Set up the shaders, buffers, and attributes
        const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
        const programInfo = {
        program: shaderProgram,
        attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
        },
        uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        },
        };
        const buffers = initBuffers(gl);
        const indices = buffers.indices;

        // Set up the initial rotation angle and delta angle
        let angle = 0.0;
        const deltaAngle = Math.PI / 60.0;

        // Draw the scene continuously
        requestAnimationFrame(drawScene);

        // Define the vertex shader
const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec2 aTextureCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying highp vec2 vTextureCoord;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
  }
`;

// Define the fragment shader
const fsSource = `
  varying highp vec2 vTextureCoord;

  uniform sampler2D uSampler;

  void main() {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
  }
`;

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
    return null;
  }

  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function initBuffers(gl) {
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [    -1.0,  1.0,     1.0,  1.0,    -1.0, -1.0,     1.0, -1.0,  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  const textureCoordinates = [    0.0, 0.0,    1.0, 0.0,    0.0, 1.0,    1.0, 1.0,  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    textureCoord: textureCoordBuffer,
  };
}

function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D),
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 3);

// Cleanup
gl.bindBuffer(gl.ARRAY_BUFFER, null);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
gl.bindVertexArray(null);

// Request another animation frame
requestAnimationFrame(render);
}

// Call the render function to start the animation
render();

// Add event listeners to start and stop the animation
const startButton = document.getElementById('startAnimation');
const stopButton = document.getElementById('stopAnimation');
startButton.addEventListener('click', startAnimation);
stopButton.addEventListener('click', stopAnimation);

function startAnimation() {
// Set the animation state to true
animationState.isPlaying = true;
}

function stopAnimation() {
// Set the animation state to false
animationState.isPlaying = false;
}

// Define a function to handle mouse events
function handleMouse(event) {
const x = event.clientX;
const y = event.clientY;

// Update the rotation matrix based on the mouse movement
if (event.type === 'mousedown') {
    rotationState.isDragging = true;
    rotationState.mouseStart = {x, y};
} else if (event.type === 'mouseup') {
    rotationState.isDragging = false;
} else if (event.type === 'mousemove') {
    if (rotationState.isDragging) {
        const dx = x - rotationState.mouseStart.x;
        const dy = y - rotationState.mouseStart.y;

        rotationState.angleY += dx / 100;
        rotationState.angleX += dy / 100;

        rotationState.mouseStart = {x, y};
    }
}
}

// Add event listeners to the canvas element for mouse events
glCanvas.addEventListener('mousedown', handleMouse);
glCanvas.addEventListener('mouseup', handleMouse);
glCanvas.addEventListener('mousemove', handleMouse);




