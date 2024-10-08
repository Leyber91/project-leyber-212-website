
export class CustomOrbitControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    // Parameters
    this.enabled = true;
    this.rotateSpeed = 0.002;
    this.zoomSpeed = 0.5;
    this.minDistance = 5;
    this.maxDistance = 50;

    // Internal state
    this.spherical = new THREE.Spherical();
    this.sphericalDelta = new THREE.Spherical();

    this.mouse = {
      left: { isDown: false, x: 0, y: 0 },
      wheel: { delta: 0 }
    };

    // Initialize spherical coordinates based on camera position
    this.updateSpherical();

    // Bind event handlers
    this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    this.domElement.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    this.domElement.addEventListener('wheel', this.onMouseWheel.bind(this), false);

    // Add touch event listeners for mobile devices
    this.domElement.addEventListener('touchstart', this.onTouchStart.bind(this), false);
    this.domElement.addEventListener('touchmove', this.onTouchMove.bind(this), false);
    this.domElement.addEventListener('touchend', this.onTouchEnd.bind(this), false);

    // Black hole parameters
    this.blackHoleRadius = 1;
    this.eventHorizonRadius = 2.5 * this.blackHoleRadius;
    this.accretionDiskInnerRadius = 3 * this.blackHoleRadius;
    this.accretionDiskOuterRadius = 10 * this.blackHoleRadius;
  }

  updateSpherical() {
    const target = new THREE.Vector3(0, 0, 0); // Black hole center
    const offset = new THREE.Vector3().copy(this.camera.position).sub(target);
    this.spherical.setFromVector3(offset);
  }

  onMouseDown(event) {
    if (!this.enabled) return;
    if (event.button === 0) {
      this.mouse.left.isDown = true;
      this.mouse.left.x = event.clientX;
      this.mouse.left.y = event.clientY;
    }
  }

  onMouseMove(event) {
    if (!this.enabled || !this.mouse.left.isDown) return;

    const deltaX = event.clientX - this.mouse.left.x;
    const deltaY = event.clientY - this.mouse.left.y;

    this.mouse.left.x = event.clientX;
    this.mouse.left.y = event.clientY;

    this.rotateCamera(deltaX, deltaY);
  }

  onMouseUp(event) {
    if (!this.enabled) return;
    if (event.button === 0) {
      this.mouse.left.isDown = false;
    }
  }

  onMouseWheel(event) {
    if (!this.enabled) return;
    const delta = event.deltaY > 0 ? 1 : -1;
    this.zoomCamera(delta);
  }

  onTouchStart(event) {
    if (!this.enabled) return;
    if (event.touches.length === 1) {
      this.mouse.left.isDown = true;
      this.mouse.left.x = event.touches[0].pageX;
      this.mouse.left.y = event.touches[0].pageY;
    }
  }

  onTouchMove(event) {
    if (!this.enabled || !this.mouse.left.isDown) return;
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const deltaX = touch.pageX - this.mouse.left.x;
      const deltaY = touch.pageY - this.mouse.left.y;

      this.mouse.left.x = touch.pageX;
      this.mouse.left.y = touch.pageY;

      this.rotateCamera(deltaX, deltaY);
    }
  }

  onTouchEnd(event) {
    if (!this.enabled) return;
    this.mouse.left.isDown = false;
  }

  rotateCamera(deltaX, deltaY) {
    this.sphericalDelta.theta -= deltaX * this.rotateSpeed;
    this.sphericalDelta.phi -= deltaY * this.rotateSpeed;

    const EPS = 0.000001;
    this.spherical.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.spherical.phi + this.sphericalDelta.phi));
    this.spherical.theta += this.sphericalDelta.theta;

    this.sphericalDelta.theta = 0;
    this.sphericalDelta.phi = 0;
  }

  zoomCamera(delta) {
    this.spherical.radius += delta * this.zoomSpeed;
    this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));
  }

  update() {
    if (!this.enabled) return;

    const offset = new THREE.Vector3().setFromSpherical(this.spherical);
    this.camera.position.copy(offset);

    // Apply gravitational lensing effect
    const distanceToBlackHole = this.camera.position.length();
    const lensStrength = Math.max(0, 1 - distanceToBlackHole / (5 * this.eventHorizonRadius));
    
    // Distort camera view based on proximity to black hole
    const fov = THREE.MathUtils.lerp(75, 120, lensStrength);
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();

    // Add subtle camera shake when close to the event horizon
    if (distanceToBlackHole < 3 * this.eventHorizonRadius) {
      const shake = 0.05 * Math.random() * lensStrength;
      this.camera.position.x += shake * (Math.random() - 0.5);
      this.camera.position.y += shake * (Math.random() - 0.5);
      this.camera.position.z += shake * (Math.random() - 0.5);
    }

    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
}