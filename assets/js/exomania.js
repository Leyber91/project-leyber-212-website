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
    if (planet.pl_eqt !== null) {
        description += `The surface temperature of this exoplanet is approximately ${planet.pl_eqt.toFixed(2)} K. `;
    }
    // Fallback message when no data is available
    if (description === `Welcome to ${planet.pl_name}! `) {
    description += "Unfortunately, there's not much information available about this exoplanet.";
    }

  
    return description;
  }

  function temperatureToColor(temperature) {
    const minTemp = 0;
    const maxTemp = 2000;
    const ratio = (temperature - minTemp) / (maxTemp - minTemp);
  
    const hue = (1 - ratio) * 240;
    return `hsl(${hue}, 100%, 50%)`;
  }


//STYLE FOR EXOPLANETS
function generateCompositionStyle(composition) {
    // For the basic version, we will use a simple linear gradient
    // You can replace this with a more sophisticated approach later
    const gradient = composition === 'gas' ? 'linear-gradient(135deg, #F0B27A, #E6B0AA)' : 'linear-gradient(135deg, #D7BDE2, #A9CCE3)';
    return {
      backgroundImage: gradient,
    };
  }
  
  function generateStarBrightnessStyle(starTemperature) {
    // For the basic version, we will use a simple brightness value
    // You can replace this with a more sophisticated approach later
    const brightness = starTemperature ? (starTemperature / 10000) * 100 : 50;
    return {
      filter: `brightness(${brightness}%)`,
    };
  }


// Function to generate a color based on the temperature spectrum

function createSvgTexture(color, ratio) {
  const firePattern = `
    <pattern id="firePattern" patternUnits="userSpaceOnUse" width="20" height="20" viewBox="0 0 20 20">
        <path d="M10,20 L10,15" stroke="${color}" stroke-width="2" filter="url(#fireGlow)" />
        <path d="M5,20 L5,15" stroke="${color}" stroke-width="2" filter="url(#fireGlow)" />
        <path d="M15,20 L15,15" stroke="${color}" stroke-width="2" filter="url(#fireGlow)" />
        <circle cx="10" cy="10" r="5" fill="${color}" filter="url(#fireGlow)" />
    </pattern>
  `;

  const crystalPattern = `
    <pattern id="crystalPattern" patternUnits="userSpaceOnUse" width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="5" fill="none" stroke="${color}" stroke-width="1" />
      <circle cx="10" cy="10" r="8" fill="none" stroke="${color}" stroke-width="1" />
      <path d="M0,10 L20,10" stroke="${color}" stroke-width="1" />
      <path d="M10,0 L10,20" stroke="${color}" stroke-width="1" />
      <path d="M0,0 L20,20" stroke="${color}" stroke-width="1" />
      <path d="M0,20 L20,0" stroke="${color}" stroke-width="1" />
    </pattern>
  `;

  const interpolatedPattern = `
    <pattern id="interpolatedPattern" patternUnits="userSpaceOnUse" width="20" height="20" viewBox="0 0 20 20">
      <rect width="20" height="20" fill="url(#firePattern)" opacity="${ratio}" />
      <rect width="20" height="20" fill="url(#crystalPattern)" opacity="${1 - ratio}" />
    </pattern>
  `;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <filter id="fireGlow" width="150%" height="150%" x="-25%" y="-25%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0
                                                        0 1 0 0 0
                                                        0 0 1 0 0
                                                        0 0 0 18 -8" result="glow" />
          <feBlend in="SourceGraphic" in2="glow" mode="screen" />
        </filter>
        ${firePattern}
        ${crystalPattern}
        ${interpolatedPattern}
      </defs>
      <rect width="100%" height="100%" fill="url(#interpolatedPattern)" />
    </svg>
  `;
}


  

function displayPlanets(planets) {
    carousel.innerHTML = '';
    planets.forEach(planet => {
      const card = document.createElement('div');
      card.classList.add('carousel-item');
  
      // Generate the styles for the card
      const compositionStyle = generateCompositionStyle(planet.pl_dens);
      const starBrightnessStyle = generateStarBrightnessStyle(planet.st_teff);
      const color = temperatureToColor(planet.pl_eqt);
      const minTemp = 0;
      const maxTemp = 2000;
      const ratio = (planet.pl_eqt - minTemp) / (maxTemp - minTemp);
      const fireRatio = ratio;
      const crystalRatio = 1 - ratio;
      const svgTexture = createSvgTexture(color, fireRatio, crystalRatio);
      const dataUrl = 'data:image/svg+xml;base64,' + btoa(svgTexture);
  
      const temperatureBorderStyle = {
        borderImageSource: `url(${dataUrl})`,
        borderImageSlice: '5',
        borderColor: color,
        borderWidth: '1em',
        borderStyle: 'solid',
        animation: 'border-animation 5s linear infinite',
      };
  
      const cardStyle = {
        ...compositionStyle,
        ...starBrightnessStyle,
        ...temperatureBorderStyle,
      };
  
      // Apply the styles to the card
      Object.assign(card.style, cardStyle);
  
      // Set the card's content
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