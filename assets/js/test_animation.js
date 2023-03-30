// Get the canvas and context
const canvasTest = document.getElementById('glCanvas');
const ctx = canvasTest.getContext('2d');

// Set initial position and velocity for the rectangle
let posX = 0;
let posY = 0;
const velocityX = 2;
const velocityY = 1;

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
    }
    if (posY < 0 || posY + 50 > canvasTest.height) {
        posY -= velocityY;
    }

    // Draw the rectangle
    ctx.fillStyle = 'rgba(255, 0, 0, 1)';
    ctx.fillRect(posX, posY, 50, 50);

    // Request the next frame
    requestAnimationFrame(updateAndDrawRectangle);
}

// Start the basic animation when the "Test Animation" button is clicked
document.getElementById('testAnimation').addEventListener('click', function() {
    updateAndDrawRectangle();
});
