window.onload = function() {
  function initialize() {
    let sphere;
    let colorPicker;
    let rangeSpeed;
    let rangeSize;
    let rangeRotationX;
    let rangeRotationY;
    let rangeRotationZ;
    let isAnimating = true;

    function setup() {
      let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
      canvas.parent('animation-container');

      sphere = createSphere(50);

      colorPicker = select('#colorPicker');

      rangeSpeed = select('#rangeSpeed');

      rangeSize = select('#rangeSize');

      rangeRotationX = select('#rangeRotationX');

      rangeRotationY = select('#rangeRotationY');

      rangeRotationZ = select('#rangeRotationZ');

      const toggleAnimationButton = select('#toggleAnimation');
      toggleAnimationButton.mousePressed(function (event) {
        isAnimating = !isAnimating;
      });
    }

    function draw() {
      background(50);

      let size = rangeSize.value();
      let angleX = radians(rangeRotationX.value());
      let angleY = radians(rangeRotationY.value());
      let angleZ = radians(rangeRotationZ.value());
      let speed = rangeSpeed.value();

      push();
      if (isAnimating) {
        rotateX(angleX + frameCount * speed * 0.01);
        rotateY(angleY + frameCount * speed * 0.01);
        rotateZ(angleZ + frameCount * speed * 0.01);
      } else {
        rotateX(angleX);
        rotateY(angleY);
        rotateZ(angleZ);
      }
      scale(size / 50);
      fill(colorPicker.color());
      sphere();
      pop();
    }

    function createSphere(radius) {
      const sphere = () => {
        ellipsoid(radius, radius, radius);
      };
      return sphere;
    }

    new p5(setup, draw);
  }

  initialize();
};
