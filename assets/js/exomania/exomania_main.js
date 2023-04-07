const proxyUrl = 'https://leyber-cors-proxy-server.herokuapp.com/';
const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,pl_rade,pl_masse,pl_orbper,pl_orbeccen,pl_orbincl+from+ps&format=json`;

let exoplanets = [];
let filteredExoplanets = [];
let currentPage = 1;
const itemsPerPage = 10;

// Fetch exoplanet data from API and map to objects
function fetchExoplanetData() {
  fetch(proxyUrl + url)
    .then(response => response.json())
    .then(data => {
      exoplanets = data.map(item => ({
        name: item.pl_name,
        radius: item.pl_rade,
        mass: item.pl_masse,
        period: item.pl_orbper,
        eccentricity: item.pl_orbeccen,
        inclination: item.pl_orbincl
      }));
      filteredExoplanets = [...exoplanets];
      displayExoplanets(currentPage);
      displayPagination();
    })
    .catch(error => console.log(error));
}

// Display exoplanets in grid format
function displayExoplanets(page) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const exoplanetGrid = document.getElementById('exoplanet-grid');
  exoplanetGrid.innerHTML = '';
  filteredExoplanets.slice(startIndex, endIndex).forEach(exoplanet => {
    const exoplanetCard = `
      <div class="card">
        <div class="card-front">
          <h3>${exoplanet.name}</h3>
        </div>
        <div class="card-back">
          <p>Radius: ${exoplanet.radius}</p>
          <p>Mass: ${exoplanet.mass}</p>
          <p>Period: ${exoplanet.period}</p>
          <p>Eccentricity: ${exoplanet.eccentricity}</p>
          <p>Inclination: ${exoplanet.inclination}</p>
        </div>
      </div>
    `;
    exoplanetGrid.innerHTML += exoplanetCard;
  });
}

// Display pagination buttons
function displayPagination() {
  const totalPages = Math.ceil(filteredExoplanets.length / itemsPerPage);
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const button = `
      <button class="pagination-button${i === currentPage ? ' active' : ''}" onclick="changePage(${i})">
        ${i}
      </button>
    `;
    pagination.innerHTML += button;
  }
}

// Change page and update exoplanet grid and pagination
function changePage(page) {
  currentPage = page;
  displayExoplanets(currentPage);
  displayPagination();
}

// Search exoplanets by name
function searchExoplanets(searchTerm) {
  filteredExoplanets = exoplanets.filter(exoplanet =>
    exoplanet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  currentPage = 1;
  displayExoplanets(currentPage);
  displayPagination();
}

// Filter exoplanets by planet characteristic
function filterExoplanets() {
  const searchQuery = document.getElementById('search-query').value.toLowerCase();
  const filteredExoplanets = exoplanets.filter(exoplanet => {
    const name = exoplanet.name.toLowerCase();
    return name.includes(searchQuery);
  });
  exoplanets = filteredExoplanets;
  displayExoplanets(currentPage);
  displayPagination();
}

fetchExoplanetData();

document.getElementById('search-input').addEventListener('input', (event) => {
  searchExoplanets(event.target.value);
});
