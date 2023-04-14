fetch('exoplanet_data.json')
  .then(response => response.json())
  .then(data => {
    populateCarousel(data);
    initializeCarousel();
  });

function formatValue(value, unit) {
  return value !== null ? `${value.toFixed(2)} ${unit}` : 'N/A';
}

const pulsatingGlowKeyframesAndClass = `
@keyframes pulsating-glow {
    0%, 100% {
      text-shadow: 0 0 18px currentColor;
    }
    10% {
      text-shadow: 0 0 20px currentColor;
    }
    20% {
      text-shadow: 0 0 22px currentColor;
    }
    30% {
      text-shadow: 0 0 24px currentColor;
    }
    40% {
      text-shadow: 0 0 26px currentColor;
    }
    50% {
      text-shadow: 0 0 28px currentColor;
    }
    60% {
      text-shadow: 0 0 26px currentColor;
    }
    70% {
      text-shadow: 0 0 24px currentColor;
    }
    80% {
      text-shadow: 0 0 22px currentColor;
    }
    90% {
      text-shadow: 0 0 20px currentColor;
    }
  }
`;

const style = document.createElement('style');
style.innerHTML = `${icyKeyframes} ${fieryKeyframes} ${pulsatingGlowKeyframesAndClass}`;
document.head.appendChild(style);

const tempMin = 2000; // Minimum temperature for icy effect
const tempMax = 4000; // Maximum temperature for fiery effect

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

  function generateTextShadowColor(starTemperature) {
    if (starTemperature === null) return 'rgba(255, 255, 255, 1)';
  
    const minTemp = 1000;
    const maxTemp = 8000;
    const tempNormalized = Math.min(Math.max(starTemperature, minTemp), maxTemp);
    const tempRatio = (tempNormalized - minTemp) / (maxTemp - minTemp);
  
    const coolColor = 'rgba(50, 150, 255, 1)';
    const warmColor = 'rgba(255, 100, 0, 1)';
    const color = `rgba(${(1 - tempRatio) * 50 + tempRatio * 255}, ${(1 - tempRatio) * 150 + tempRatio * 100}, ${(1 - tempRatio) * 255 + tempRatio * 0}, 1)`;
  
    return color;
  }
  
  
  

  function generateTemperatureBorderStyle(temperature) {
    if (temperature === null) return {};

  
    const tempNormalized = Math.min(Math.max(temperature, tempMin), tempMax);
    const tempRatio = (tempNormalized - tempMin) / (tempMax - tempMin);
  
    const icyColor = 'rgba(50, 150, 255, 0.8)';
    const fieryColor = 'rgba(255, 100, 0, 0.8)';
    const borderColor = `linear-gradient(135deg, ${icyColor} ${100 - tempRatio * 100}%, ${fieryColor} ${tempRatio * 100}%)`;
  
    return {
      borderImage: borderColor,
      borderImageSlice: 1,
    };
  }

// Add keyframes for icy and fiery animations
const icyKeyframes = `
  @keyframes icy {
    0% {
      box-shadow: 0 0 10px rgba(50, 150, 255, 0.8);
    }
    50% {
      box-shadow: 0 0 20px rgba(50, 150, 255, 0.8);
    }
    100% {
      box-shadow: 0 0 10px rgba(50, 150, 255, 0.8);
    }
  }
`;

const fieryKeyframes = `
  @keyframes fiery {
    0% {
      box-shadow: 0 0 10px rgba(255, 100, 0, 0.8);
    }
    50% {
      box-shadow: 0 0 20px rgba(255, 100, 0, 0.8);
    }
    100% {
      box-shadow: 0 0 10px rgba(255, 100, 0, 0.8);
    }
  }
`;

// Append the keyframes to the document
const style = document.createElement('style');
style.innerHTML = `${icyKeyframes} ${fieryKeyframes}`;
document.head.appendChild(style);

  function displayPlanets(planets) {
    carousel.innerHTML = '';
    planets.forEach(planet => {
        const card = document.createElement('div');
        card.classList.add('carousel-item');
  
    // Generate the styles for the card
        const compositionStyle = generateCompositionStyle(planet.pl_dens);
        const starBrightnessStyle = generateStarBrightnessStyle(planet.st_teff);
        const temperatureBorderStyle = generateTemperatureBorderStyle(planet.pl_eqt);
    // Calculate the text shadow color and blur radius based on the star's temperature
        const textShadowColor = generateTextShadowColor(planet.st_teff);
        const textShadowBlurRadius = 18;
        const textColor = planet.st_teff > 4000 ? 'white' : 'black';

      const cardStyle = {
        ...compositionStyle,
        ...starBrightnessStyle,
        ...temperatureBorderStyle,
        textShadow: `0 0 ${textShadowBlurRadius}px ${textShadowColor}`,
        color: textColor,
      }
      Object.assign(card.style, cardStyle);
    // Add animation based on the temperature
    if (planet.pl_eqt <= tempMin * 0.9) {
        card.style.animation = 'icy 2s infinite';
      } else if (planet.pl_eqt >= tempMax * 1.1) {
        card.style.animation = 'fiery 2s infinite';
      } else {
        card.classList.add('pulsating-text');
      }
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