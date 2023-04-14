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

  function generateDescription(planet) {
    let description = `Welcome to ${planet.pl_name}! `;
  
    // Calculate and add more characteristics based on the available data
    if (planet.sy_dist !== null) {
      const lightYears = (planet.sy_dist * 3.26156).toFixed(2);
      description += `This exoplanet is located ${lightYears} light-years away from Earth in the ${planet.hostname} star system. `;
    }
  
    if (planet.pl_orbper !== null && planet.pl_orbsmax !== null) {
      const orbitalVelocity = (2 * Math.PI * planet.pl_orbsmax * 215) / planet.pl_orbper;
      description += `It orbits its host star at an approximate speed of ${orbitalVelocity.toFixed(2)} km/s. `;
    }
  
    if (planet.pl_rade !== null) {
      const planetRadiusKm = (planet.pl_rade * 6371).toFixed(2);
      description += `With a radius of ${planetRadiusKm} km, it's ${planet.pl_rade.toFixed(2)} times larger than Earth. `;
    }
  
    if (planet.st_teff !== null) {
      description += `The host star has an effective temperature of ${planet.st_teff.toFixed(2)} K. `;
    }
  
    return description;
  }
  
  function displayPlanets(planets) {
    carousel.innerHTML = '';
    planets.forEach(planet => {
      const card = document.createElement('div');
      card.classList.add('carousel-item');
      card.innerHTML = `
        <h2>${planet.pl_name}</h2>
        <p>${generateDescription(planet)}</p>
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

let carouselPaused = false;
  
  function initializeCarousel() {
    if ($('.carousel').hasClass('slick-initialized')) {
      $('.carousel').slick('unslick');
    }
  
    $('.carousel').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
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
$('.load-more-button').hide().fadeIn(1000);