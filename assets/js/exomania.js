fetch('exoplanet_data.json')
  .then(response => response.json())
  .then(data => {
    populateCarousel(data);
    initializeCarousel();
  });

  function formatValue(value, unit) {
    return value !== null ? `${value.toFixed(2)} ${unit}` : 'N/A';
  }
  
  function populateCarousel(data) {
    const carousel = document.querySelector('.carousel');
    data.forEach(planet => {
      const card = document.createElement('div');
      card.classList.add('carousel-item');
      card.innerHTML = `
        <h2>${planet.pl_name}</h2>
        <p>Host Star: ${planet.hostname}</p>
        <p>Distance from Earth: ${formatValue(planet.sy_dist, 'Parsecs')}</p>
        <p>Orbital Period: ${formatValue(planet.pl_orbper, 'Days')}</p>
        <p>Semi-Major Axis: ${formatValue(planet.pl_orbsmax, 'AU')}</p>
        <p>Planet Radius: ${formatValue(planet.pl_rade, 'Earth Radii')}</p>
        <p>Planet Mass: ${formatValue(planet.pl_masse, 'Earth Masses')}</p>
        <p>Equilibrium Temperature: ${formatValue(planet.pl_eqt, 'K')}</p>
        <p>Stellar Effective Temperature: ${formatValue(planet.st_teff, 'K')}</p>
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
