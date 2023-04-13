fetch('exoplanet_data.json')
  .then(response => response.json())
  .then(data => {
    populateCarousel(data);
    initializeCarousel();
  });

function populateCarousel(data) {
  const carousel = document.querySelector('.carousel');
  data.forEach(planet => {
    const card = document.createElement('div');
    card.classList.add('carousel-item');
    card.innerHTML = `
      <h2>${planet.pl_name}</h2>
      <p>Host Star: ${planet.hostname}</p>
      <p>Distance from Earth: ${planet.sy_dist.toFixed(2)} Parsecs</p>
      <p>Orbital Period: ${planet.pl_orbper.toFixed(2)} Days</p>
      <p>Semi-Major Axis: ${planet.pl_orbsmax.toFixed(2)} AU</p>
      <p>Planet Radius: ${planet.pl_rade.toFixed(2)} Earth Radii</p>
      <p>Planet Mass: ${planet.pl_masse.toFixed(2)} Earth Masses</p>
      <p>Equilibrium Temperature: ${planet.pl_eqt ? planet.pl_eqt.toFixed(2) : 'N/A'} K</p>
      <p>Stellar Effective Temperature: ${planet.st_teff.toFixed(2)} K</p>
    `;
    carousel.appendChild(card);
  });
}

function initializeCarousel() {
  $('.carousel').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });
}
