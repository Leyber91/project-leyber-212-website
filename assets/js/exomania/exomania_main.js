const catalogElement = document.querySelector('#catalog');
const navigationElement = document.querySelector('#navigation');

let currentPage = 0;
const itemsPerPage = 10;

async function fetchAllData(offset, limit) {
  const proxyUrl = 'https://leyber-cors-proxy-server.herokuapp.com/';
  const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,pl_rade,pl_masse,pl_orbper,pl_orbeccen,pl_orbincl+from+ps&format=json&offset=${offset}&limit=${limit}`;

  const response = await fetch(proxyUrl + url);
  const data = await response.json();
  return processData(data);
}

function processData(data) {
  return data.map(planet => ({
    pl_name: planet.pl_name,
    pl_radius: planet.pl_rade,
    pl_mass: planet.pl_masse,
    pl_orbper: planet.pl_orbper,
    pl_orbeccen: planet.pl_orbeccen,
    pl_orbincl: planet.pl_orbincl,
  }));
}

function renderCatalog(data, page) {
  catalogElement.innerHTML = '';
  const start = page * itemsPerPage;
  const end = start + itemsPerPage;

  data.slice(start, end).forEach(planet => {
    const entry = document.createElement('div');
    entry.classList.add('entry', 'card-3d');
  
    const frontFace = document.createElement('div');
    frontFace.classList.add('card-face');
    frontFace.innerHTML = `
      <h3>${planet.pl_name}</h3>
      <p>Click to view details</p>
    `;
  
    const backFace = document.createElement('div');
    backFace.classList.add('card-face', 'card-back');
    backFace.innerHTML = `
      <h3>${planet.pl_name}</h3>
      <p>Radius: ${planet.pl_radius} Earth radii</p>
      <p>Mass: ${planet.pl_mass} Earth masses</p>
      <p>Orbital period: ${planet.pl_orbper} days</p>
      <p>Orbital eccentricity: ${planet.pl_orbeccen}</p>
      <p>Orbital inclination: ${planet.pl_orbincl} degrees</p>
    `;
  
    entry.appendChild(frontFace);
    entry.appendChild(backFace);
    catalogElement.appendChild(entry);

    // Add click event listener to each card
    entry.addEventListener('click', () => {
      entry.classList.toggle('flipped');
    });
  });
  
}


function renderNavigation(totalItems, page) {
  navigationElement.innerHTML = '';
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (page > 0) {
    const prevButton = document.createElement('button');
    prevButton.classList.add('nav-button', 'hover-effect');
    prevButton.innerHTML = '<i class="icon-arrow-left"></i> Previous';
    prevButton.addEventListener('click', () => {
      currentPage--;
      renderCatalog(planets, currentPage);
      renderNavigation(planets.length, currentPage);
    });
    navigationElement.appendChild(prevButton);
  }

  if (page < totalPages - 1) {
    const nextButton = document.createElement('button');
    nextButton.classList.add('nav-button', 'hover-effect');
    nextButton.innerHTML = 'Next <i class="icon-arrow-right"></i>';
    nextButton.addEventListener('click', () => {
      currentPage++;
      renderCatalog(planets, currentPage);
      renderNavigation(planets.length, currentPage);
    });
    navigationElement.appendChild(nextButton);
  }
}


let planets = [];

(async function() {
  planets = await fetchAllData(currentPage * itemsPerPage, itemsPerPage);
  renderCatalog(planets, currentPage);
  renderNavigation(planets.length, currentPage);
})();

document.addEventListener('scroll', function() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const parallaxBackgrounds = document.querySelectorAll('.parallax-container .background');
  
  parallaxBackgrounds.forEach(function(bg) {
    bg.style.transform = `translateY(${scrollTop * 0.5}px)`;
  });
});

