
function toggleControls() {
    const controls = document.querySelector('.controls');
    const isVisible = controls.style.display !== 'none';
    controls.style.display = isVisible ? 'none' : 'block';
}

// Add this function to controls_md.js
function loadScript(mode) {
    const script = document.createElement('script');
    script.src = `./assets/js/animation_md_${mode}.js`;
    document.body.appendChild(script);
  }
  
  // Load the initial mode (alpha) by default
  loadScript('alpha');

  // (existing code)

// Get the mode selector element
const modeSelector = document.getElementById('modeSelector');

// Function to show or hide controls based on the selected mode
function toggleControlsByMode() {
    const distortionControl = document.getElementById('rangeDistortion').parentElement;
    const distortionSpeedControl = document.getElementById('rangeDistortionSpeed').parentElement;
    const rotationSpeedControl = document.getElementById('rangeRotationSpeed').parentElement;
    
    const selectedMode = modeSelector.value;
    
    if (selectedMode === 'delta') {
        distortionControl.style.display = 'inline';
        distortionSpeedControl.style.display = 'inline';
        rotationSpeedControl.style.display = 'inline';
    } else if (selectedMode === 'gamma') {
        distortionControl.style.display = 'inline';
        distortionSpeedControl.style.display = 'inline';
        rotationSpeedControl.style.display = 'none';
    } else if (selectedMode === 'beta') {
        distortionControl.style.display = 'inline';
        distortionSpeedControl.style.display = 'none';
        rotationSpeedControl.style.display = 'none';
    } else {
        distortionControl.style.display = 'none';
        distortionSpeedControl.style.display = 'none';
        rotationSpeedControl.style.display = 'none';
    }
    }

    // Add event listener for mode selector
    modeSelector.addEventListener('change', toggleControlsByMode);

    // Call the function initially to set the correct visibility of controls
    toggleControlsByMode();

    // (existing code)

  
  // Add an event listener to the mode selector
  document.getElementById('modeSelector').addEventListener('change', (event) => {
    const mode = event.target.value;
    // Remove the existing script from the DOM
    const oldScript = document.querySelector(`script[src^="./assets/js/animation_md_"]`);
    if (oldScript) oldScript.remove();
    // Load the new script based on the selected mode
    loadScript(mode);
  });
  