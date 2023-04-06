async function fetchData() {
  const allData = await fetchAllData();
  return processData(allData);
}

async function fetchAllData() {
  const proxyUrl = 'https://leyber-cors-proxy-server.herokuapp.com/';
  const url = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,pl_rade,pl_masse,pl_orbper,pl_orbeccen,pl_orbincl+from+ps&format=json';

  const response = await fetch(proxyUrl + url);
  const data = await response.json();
  return data;
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

function displayCatalog(data) {
  const catalogElement = document.getElementById('catalog');

  data.forEach(planet => {
    const card = document.createElement('div');
    card.className = 'exoplanet-card';
    card.innerHTML = `
      <h3>${planet.pl_name}</h3>
      <p>Mass: ${planet.pl_mass} Earth Masses</p>
      <p>Radius: ${planet.pl_radius} Earth Radii</p>
      <p>Orbital Period: ${planet.pl_orbper} days</p>
      <p>Orbital Eccentricity: ${planet.pl_orbeccen}</p>
      <p>Orbital Inclination: ${planet.pl_orbincl} degrees</p>
    `;
    catalogElement.appendChild(card);
  });
}

fetchAllData().then(data => {
  console.log(data);
  displayCatalog(data);
});
