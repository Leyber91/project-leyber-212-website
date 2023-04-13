fetch('exoplanet_data.json')
  .then(response => response.json())
  .then(data => {
    populateCarousel(data);
    initializeCarousel();
  });

function formatValue(value, unit) {
  return value !== null ? `${value.toFixed(2)} ${unit}` : 'N/A';
}

function animateLogo() {
    const logo = document.querySelector('.logo');
    logo.classList.add('logo-animation');
  }
  

function populateCarousel(data) {
  const carousel = document.querySelector('.carousel');
  const loadMoreButton = document.createElement('button');
  loadMoreButton.textContent = 'Load More Planets';
  loadMoreButton.classList.add('load-more-button');
  document.body.appendChild(loadMoreButton);

  const goBackHomeButton = document.createElement('button');
  goBackHomeButton.textContent = 'Go Back Home';
  goBackHomeButton.classList.add('back-home-button');
  goBackHomeButton.onclick = () => window.location.href = 'index.html';
  document.body.appendChild(goBackHomeButton);

  function getRandomPlanets(num) {
    const planets = [];
    for (let i = 0; i < num; i++) {
      const randomIndex = Math.floor(Math.random() * data.length);
      planets.push(data[randomIndex]);
    }
    return planets;
  }

  function displayPlanets(planets) {
    carousel.innerHTML = '';
    planets.forEach(planet => {
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
    initializeCarousel();
  }

  loadMoreButton.addEventListener('click', () => {
    const randomPlanets = getRandomPlanets(10);
    displayPlanets(randomPlanets);
  });

  const initialPlanets = getRandomPlanets(10);
  displayPlanets(initialPlanets);
  animateLogo();
}

function initializeCarousel() {
  if ($('.carousel').hasClass('slick-initialized')) {
    $('.carousel').slick('unslick');
  }

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

animateLogo();
