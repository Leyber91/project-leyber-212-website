
function toggleControls() {
    const controls = document.querySelector('.controls');
    const isVisible = controls.style.display !== 'none';
    controls.style.display = isVisible ? 'none' : 'block';
}
