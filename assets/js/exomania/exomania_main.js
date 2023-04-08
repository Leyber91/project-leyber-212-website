document.addEventListener('DOMContentLoaded', function () {
  fetchExoplanets();
});

function fetchExoplanets() {
  fetch('https://exomania-main.herokuapp.com/get_exoplanets/get_exoplanets')
      .then(response => response.json())
      .then(data => displayExoplanets(data))
      .catch(error => console.error('Error fetching exoplanets:', error));
}

function displayExoplanets(data) {
  const exoplanetList = document.getElementById('exoplanet-list');
  data.forEach(planet => {
      const planetItem = document.createElement('div');
      planetItem.className = 'exoplanet-item';
      planetItem.innerHTML = `
          <h3>${planet.name}</h3>
          <p>Mass: ${planet.mass} Earth Masses</p>
          <p>Distance from Earth: ${planet.distance} Light Years</p>
      `;
      exoplanetList.appendChild(planetItem);
  });
}
