const sketch = (p) => {
  let sphere;
  let colorPicker;
  let rangeSpeed;
  let rangeSize;
  let rangeRotationX;
  let rangeRotationY;
  let rangeRotationZ;
  let isAnimating = true;

  p.setup = () => {
    let canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    canvas.parent('animation-container');

    sphere = createSphere(50);

    colorPicker = p.select('#colorPicker');

    rangeSpeed = p.select('#rangeSpeed');

    rangeSize = p.select('#rangeSize');

    rangeRotationX = p.select('#rangeRotationX');

    rangeRotationY = p.select('#rangeRotationY');

    rangeRotationZ = p.select('#rangeRotationZ');

    const toggleAnimationButton = p.select('#toggleAnimation');
    toggleAnimationButton.mousePressed(function (event) {
      isAnimating = !isAnimating;
    });
  };

  p.draw = () => {
    p.background(50);

    let size = rangeSize.value();
    let angleX = p.radians(rangeRotationX.value());
    let angleY = p.radians(rangeRotationY.value());
    let angleZ = p.radians(rangeRotationZ.value());
    let speed = rangeSpeed.value();

    p.push();
    if (isAnimating) {
      p.rotateX(angleX + p.frameCount * speed * 0.01);
      p.rotateY(angleY + p.frameCount * speed * 0.01);
      p.rotateZ(angleZ + p.frameCount * speed * 0.01);
    } else {
      p.rotateX(angleX);
      p.rotateY(angleY);
      p.rotateZ(angleZ);
    }
    p.scale(size / 50);
    p.fill(colorPicker.color());
    sphere();
    p.pop();
  };

  function createSphere(radius) {
    const sphere = () => {
      p.ellipsoid(radius, radius, radius);
    };
    return sphere;
  }
}

window.onload = function() {
  new p5(sketch);
};
