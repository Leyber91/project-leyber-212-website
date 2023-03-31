let sphere;
let colorPicker;
let rangeSpeed;
let rangeSize;
let rangeRotationX;
let rangeRotationY;
let rangeRotationZ;
let isAnimating = true;

function setup() {
  
  console.log('Setting up the sketch');
  console.log('p5.js version:', p5.prototype.VERSION);
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('animation-container');

  sphere = createSphere(50);

  colorPicker = select('#colorPicker');
  console.log('Color picker:', colorPicker);

  rangeSpeed = select('#rangeSpeed');
  console.log('Speed slider:', rangeSpeed);

  rangeSize = select('#rangeSize');
  console.log('Size slider:', rangeSize);

  rangeRotationX = select('#rangeRotationX');
  console.log('Rotation X slider:', rangeRotationX);

  rangeRotationY = select('#rangeRotationY');
  console.log('Rotation Y slider:', rangeRotationY);

  rangeRotationZ = select('#rangeRotationZ');
  console.log('Rotation Z slider:', rangeRotationZ);

  const toggleAnimationButton = select('#toggleAnimation');
  console.log('Toggle animation button:', toggleAnimationButton);
  toggleAnimationButton.mousePressed(function (event) {
    isAnimating = !isAnimating;
    console.log('Toggle animation button pressed, isAnimating:', isAnimating);
  });
}

function draw() {
  console.log('Drawing the sketch');
  background(50);

  let size = rangeSize.value();
  console.log('Size value:', size);
  let angleX = radians(rangeRotationX.value());
  console.log('Angle X value:', angleX);
  let angleY = radians(rangeRotationY.value());
  console.log('Angle Y value:', angleY);
  let angleZ = radians(rangeRotationZ.value());
  console.log('Angle Z value:', angleZ);
  let speed = rangeSpeed.value();
  console.log('Speed value:', speed);

  push();
  if (isAnimating) {
    console.log('Animating the sphere');
    rotateX(angleX + frameCount * speed * 0.01);
    rotateY(angleY + frameCount * speed * 0.01);
    rotateZ(angleZ + frameCount * speed * 0.01);
  } else {
    console.log('Not animating the sphere');
    rotateX(angleX);
    rotateY(angleY);
    rotateZ(angleZ);
  }
  scale(size / 50);
  fill(colorPicker.color());
  console.log('Drawing the sphere');
  sphere();
  pop();
}

function createSphere(radius) {
  console.log('Creating the sphere function');
  const sphere = () => {
    ellipsoid(radius, radius, radius);
  };
  return sphere;
}
