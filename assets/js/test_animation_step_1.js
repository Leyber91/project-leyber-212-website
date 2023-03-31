const createScene = function () {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
  camera.setPosition(new BABYLON.Vector3(0, 0, -100));
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 50}, scene);

  scene.registerBeforeRender(function () {
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
  });

  return scene;
};

const canvas = document.getElementById("animation-container");
const engine = new BABYLON.Engine(canvas, true);

const scene = createScene();
engine.runRenderLoop(function () {
  scene.render();
});

window.addEventListener('DOMContentLoaded', function() {
  const animationCanvas = document.getElementById('animationCanvas');
  if (animationCanvas) {
      const engine = new BABYLON.Engine(animationCanvas, true);
      // Rest of your Babylon.js implementation
  } else {
      console.error('Animation canvas not found');
  }
});
