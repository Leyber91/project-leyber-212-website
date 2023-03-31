const canvasTest = document.getElementById('glCanvas');
const ctx = canvasTest.getContext('2d');

// Set initial position and velocity for the rectangle
let posX = 0;
let posY = 0;
let velocityX = 2;
let velocityY = 1;
let color = 'rgba(255, 0, 0, 1)';
let isLooping = true;
let animationId;

// Function to update and draw the rectangle
function updateAndDrawRectangle() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvasTest.width, canvasTest.height);

    // Update the position
    posX += velocityX;
    posY += velocityY;

    // Check for collisions with the canvas edges and reverse the velocity
    if (posX < 0 || posX + 50 > canvasTest.width) {
        posX -= velocityX;
        velocityX = -velocityX; // Reverse direction
    }
    if (posY < 0 || posY + 50 > canvasTest.height) {
        posY -= velocityY;
        velocityY = -velocityY; // Reverse direction
    }

    // Draw the rectangle
    ctx.fillStyle = color;
    ctx.fillRect(posX, posY, 50, 50);

    // Request the next frame if looping is enabled
    if (isLooping) {
        animationId = requestAnimationFrame(updateAndDrawRectangle);
    }
}

function startAnimation() {
    // Start the animation loop
    isLooping = true;
    updateAndDrawRectangle();
}

function stopAnimation() {
    // Stop the animation loop
    isLooping = false;
    cancelAnimationFrame(animationId);
}

// Event listeners for controlling the animation
document.getElementById('startAnimation').addEventListener('click', startAnimation);
document.getElementById('stopAnimation').addEventListener('click', stopAnimation);

// Event listeners for controlling color, speed, direction, and looping
document.getElementById('colorPicker').addEventListener('input', function(event) {
    color = event.target.value;
});

document.getElementById('velocityXSlider').addEventListener('input', function(event) {
    velocityX = event.target.valueAsNumber;
});

document.getElementById('velocityYSlider').addEventListener('input', function(event) {
    velocityY = event.target.valueAsNumber;
});

document.getElementById('directionButton').addEventListener('click', function() {
    velocityX = -velocityX;
    velocityY = -velocityY;
});

document.getElementById('loopCheckbox').addEventListener('change', function(event) {
    isLooping = event.target.checked;
    if (isLooping) {
        updateAndDrawRectangle();
    }
});
