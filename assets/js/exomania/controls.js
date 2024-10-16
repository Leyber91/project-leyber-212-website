// File: assets/js/exomania/controls.js

export function setupControls(camera, domElement, planetMesh) {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraPosition = { x: 0, y: 0, z: 0 };
  
    // Event Listeners
    domElement.addEventListener('mousedown', onMouseDown, false);
    domElement.addEventListener('mousemove', onMouseMove, false);
    domElement.addEventListener('mouseup', onMouseUp, false);
    domElement.addEventListener('wheel', onMouseWheel, false);
  
    // Touch Event Listeners for Mobile Support
    domElement.addEventListener('touchstart', onTouchStart, false);
    domElement.addEventListener('touchmove', onTouchMove, false);
    domElement.addEventListener('touchend', onMouseUp, false);
  
    function onMouseDown(event) {
      isDragging = true;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  
    function onMouseMove(event) {
      if (isDragging) {
        const deltaMove = {
          x: event.clientX - previousMousePosition.x,
          y: event.clientY - previousMousePosition.y,
        };
  
        if (event.buttons === 1) { // Left mouse button: rotate planet
          if (planetMesh) {
            const rotationSpeed = 0.005;
            planetMesh.rotation.y += deltaMove.x * rotationSpeed;
            planetMesh.rotation.x += deltaMove.y * rotationSpeed;
          }
        } else if (event.buttons === 2) { // Right mouse button: move camera
          const moveSpeed = 0.01;
          camera.position.x -= deltaMove.x * moveSpeed;
          camera.position.y += deltaMove.y * moveSpeed;
        }
  
        previousMousePosition = {
          x: event.clientX,
          y: event.clientY,
        };
      }
    }
  
    function onMouseUp(event) {
      isDragging = false;
    }
  
    function onMouseWheel(event) {
      event.preventDefault();
      const zoomFactor = 1.1;
      if (event.deltaY < 0) {
        camera.position.multiplyScalar(1 / zoomFactor);
      } else {
        camera.position.multiplyScalar(zoomFactor);
      }
    }
  
    // Touch Handlers
    function onTouchStart(event) {
      if (event.touches.length === 1) {
        isDragging = true;
        previousMousePosition = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      }
    }
  
    function onTouchMove(event) {
      if (isDragging && planetMesh && event.touches.length === 1) {
        const deltaMove = {
          x: event.touches[0].clientX - previousMousePosition.x,
          y: event.touches[0].clientY - previousMousePosition.y,
        };
  
        const rotationSpeed = 0.005;
        planetMesh.rotation.y += deltaMove.x * rotationSpeed;
        planetMesh.rotation.x += deltaMove.y * rotationSpeed;
  
        previousMousePosition = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      }
    }
  
    // Prevent context menu from appearing on right-click
    domElement.addEventListener('contextmenu', (event) => event.preventDefault());
  
    return; // No return value needed for custom controls
  }
  