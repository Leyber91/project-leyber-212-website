const modeSelector = document.getElementById("modeSelector");
const rotationSpeedControl = document.getElementById("rotationSpeedControl");
const distortionSpeedControl = document.getElementById("distortionSpeedControl");
const distortionControl = document.getElementById("distortionControl");

function toggleControlsByMode() {
  switch (modeSelector.value) {
    case "alpha":
      rotationSpeedControl.style.display = "none";
      distortionSpeedControl.style.display = "none";
      distortionControl.style.display = "none";
      break;
    case "beta":
      rotationSpeedControl.style.display = "none";
      distortionSpeedControl.style.display = "none";
      distortionControl.style.display = "flex";
      break;
    case "gamma":
      rotationSpeedControl.style.display = "none";
      distortionSpeedControl.style.display = "flex";
      distortionControl.style.display = "flex";
      break;
    case "delta":
      rotationSpeedControl.style.display = "flex";
      distortionSpeedControl.style.display = "flex";
      distortionControl.style.display = "none";
      break;
  }

  loadScriptByMode(modeSelector.value);
}

function loadScriptByMode(mode) {
  const oldScript = document.getElementById("animationScript");
  if (oldScript) {
    oldScript.remove();
  }

  const script = document.createElement("script");
  script.src = `./assets/js/animation_md_${mode}.js`;
  script.id = "animationScript";
  document.body.appendChild(script);
}

modeSelector.addEventListener("change", toggleControlsByMode);

// Initialize the page with the default mode
toggleControlsByMode();
