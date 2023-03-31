let sphere;
let colorPicker;
let rangeSpeed;
let rangeSize;
let rangeRotationX;
let rangeRotationY;
let rangeRotationZ;
let isAnimating = true;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  sphere = createSphere(50);

  colorPicker = createColorPicker('#ff0000');
  colorPicker.position(10, 10);

  rangeSpeed = createSlider(1, 10, 5);
  rangeSpeed.position(10, 40);

  rangeSize = createSlider(10, 200, 50);
  rangeSize.position(10, 70);

  rangeRotationX = createSlider(-180, 180, 0);
  rangeRotationX.position(10, 100);

  rangeRotationY = createSlider(-180, 180, 0);
  rangeRotationY.position(10, 130);

  rangeRotationZ = createSlider(-180, 180, 0);
  rangeRotationZ.position(10, 160);

  const toggleAnimationButton = document.getElementById('toggleAnimation');
  toggleAnimationButton.addEventListener('click', function (event) {
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
  detail(32);
  sphere();
  pop();
}

function createSphere(radius) {
  const sphere = () => {
    ellipsoid(radius, radius, radius);
  };
  return sphere;
}
