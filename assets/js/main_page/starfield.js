document.addEventListener('DOMContentLoaded', () => {
    initializeStarLayers();
});

/* Function to Initialize Multiple Star Layers for Parallax */
function initializeStarLayers() {
    const layers = [
        { count: 100, speed: 0.2, size: 1, zIndex: -3 },
        { count: 50, speed: 0.5, size: 2, zIndex: -2 },
        { count: 25, speed: 1, size: 3, zIndex: -1 }
    ];

    layers.forEach(layer => {
        const starLayer = document.createElement('div');
        starLayer.classList.add('star-layer');
        starLayer.style.zIndex = layer.zIndex;
        document.body.appendChild(starLayer);

        for (let i = 0; i < layer.count; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.width = `${layer.size}px`;
            star.style.height = `${layer.size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDuration = `${Math.random() * 3 + 2}s`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            starLayer.appendChild(star);
        }
    });
}
