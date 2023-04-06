const catalogElement = document.querySelector('#catalog');
const navigationElement = document.querySelector('#navigation');
const url = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+pscomppars+where+rownum+%3C+100+order+by+pl_name+asc&format=json';
let currentPage = 0;
const itemsPerPage = 10;

function fetchData(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => processData(data));
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
    entry.classList.add('entry');
    entry.innerHTML = `
      <h3>${planet.pl_name}</h3>
      <p>Radius: ${planet.pl_radius} Earth radii</p>
      <p>Mass: ${planet.pl_mass} Earth masses</p>
      <p>Orbital period: ${planet.pl_orbper} days</p>
      <p>Orbital eccentricity: ${planet.pl_orbeccen}</p>
      <p>Orbital inclination: ${planet.pl_orbincl} degrees</p>
    `;
    catalogElement.appendChild(entry);
  });
}

function renderNavigation(totalItems, page) {
  navigationElement.innerHTML = '';
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (page > 0) {
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.addEventListener('click', () => {
      currentPage--;
      renderCatalog(planets, currentPage);
      renderNavigation(planets.length, currentPage);
    });
    navigationElement.appendChild(prevButton);
  }

  if (page < totalPages - 1) {
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
      currentPage++;
      renderCatalog(planets, currentPage);
      renderNavigation(planets.length, currentPage);
    });
    navigationElement.appendChild(nextButton);
  }
}

let planets = [];

fetchData(url).then(data => {
  planets = data;
  renderCatalog(planets, currentPage);
  renderNavigation(planets.length, currentPage);
});
