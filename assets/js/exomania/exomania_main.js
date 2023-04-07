const exoplanetCardsElement = document.querySelector('.exoplanet-cards');
const navigationElement = document.querySelector('#navigation');
const detailsElement = document.querySelector('#details');


let currentPage = 0;
const itemsPerPage = 10;

async function fetchExoplanetData(offset, limit) {
  try {
    const proxyUrl = 'https://leyber-cors-proxy-server.herokuapp.com/';
    const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,pl_rade,pl_masse,pl_orbper,pl_orbeccen,pl_orbincl+from+ps&format=json&offset=${offset}&limit=${limit}`;

    const response = await fetch(proxyUrl + url);
    const data = await response.json();
    return processData(data);
  } catch (error) {
    console.error('Error fetching exoplanet data:', error);
    return [];
  }
}



function processData(data) {
  return data.map(planet => ({
    name: planet.pl_name,
    radius: planet.pl_rade,
    mass: planet.pl_masse,
    orbitalPeriod: planet.pl_orbper,
    orbitalEccentricity: planet.pl_orbeccen,
    orbitalInclination: planet.pl_orbincl,
  }));
}

function showExoplanetDetails(planet) {
  detailsElement.innerHTML = `
    <h3>${planet.name}</h3>
    <p>Radius: ${planet.radius} Earth radii</p>
    <p>Mass: ${planet.mass} Earth masses</p>
    <p>Orbital period: ${planet.orbitalPeriod} days</p>
    <p>Orbital eccentricity: ${planet.orbitalEccentricity}</p>
    <p>Orbital inclination: ${planet.orbitalInclination} degrees</p>
  `;
}


function createExoplanetCard(planet) {
  const card = document.createElement('div');
  card.classList.add('exoplanet-card');

  const cardFront = document.createElement('div');
  cardFront.classList.add('card-face', 'card-front');
  cardFront.innerHTML = `
    <h3>${planet.name}</h3>
    <p>Click to view details</p>
  `;

  const cardBack = document.createElement('div');
  cardBack.classList.add('card-face', 'card-back');
  cardBack.innerHTML = `
    <h3>${planet.name}</h3>
    <p>Radius: ${planet.radius} Earth radii</p>
    <p>Mass: ${planet.mass} Earth masses</p>
    <p>Orbital period: ${planet.orbitalPeriod} days</p>
    <p>Orbital eccentricity: ${planet.orbitalEccentricity}</p>
    <p>Orbital inclination: ${planet.orbitalInclination} degrees</p>
  `;

  card.appendChild(cardFront);
  card.appendChild(cardBack);

  card.addEventListener('click', () => {
    if (card.classList.contains('card-flipped')) {
      card.classList.remove('card-flipped');
    } else {
      card.classList.add('card-flipped');
      showExoplanetDetails(planet);
    }
  });

  return card;
}


function renderExoplanetCards(data, page) {
  exoplanetCardsElement.innerHTML = '';
  const start = page * itemsPerPage;
  const end = start + itemsPerPage;

  data.slice(start, end).forEach(planet => {
    const card = createExoplanetCard(planet);
    exoplanetCardsElement.appendChild(card);
  });
}

function renderNavigation(totalItems, page) {
  navigationElement.innerHTML = '';
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (page > 0) {
    const prevButton = document.createElement('button');
    prevButton.classList.add('nav-button', 'hover-effect');
    prevButton.textContent = 'Previous';
    prevButton.addEventListener('click', () => {
      currentPage--;
      renderExoplanetCards(planets, currentPage);
      renderNavigation(planets.length, currentPage);
    });
    navigationElement.appendChild(prevButton);
  }

  if (page < totalPages - 1) {
    const nextButton = document.createElement('button');
    nextButton.classList.add('nav-button', 'hover-effect');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
      currentPage++;
      renderExoplanetCards(planets, currentPage);
      renderNavigation(planets.length, currentPage);
    });
    navigationElement.appendChild(nextButton);
  }
}

(async function() {
  const planets = await fetchExoplanetData(currentPage * itemsPerPage, itemsPerPage);
  renderExoplanetCards(planets, currentPage);
  renderNavigation(planets.length, currentPage);
})();

document.addEventListener('scroll', function() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const parallaxBackgrounds = document.querySelectorAll('.parallax-container .background');
  
  parallaxBackgrounds.forEach(function(bg) {
    bg.style.transform = `translateY(${scrollTop * 0.5}px)`;
  });
});

