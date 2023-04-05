async function fetchData() {
    const [keplerData, nasaExoplanetData] = await Promise.all([
      fetchKeplerData(),
      fetchNasaExoplanetData(),
    ]);
  
    return mergeData(keplerData, nasaExoplanetData);
  }
  
  async function fetchKeplerData() {
    const response = await fetch('https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+ps+where+pl_kepflag=1&format=json');
    const data = await response.json();
    return data.map(planet => ({
      pl_name: planet.pl_name,
      pl_mass: planet.pl_bmassj,
      pl_radius: planet.pl_radj,
      pl_orbper: planet.pl_orbper,
      st_distance: planet.st_dist,
      pl_temperature: planet.pl_eqt,
      pl_orbeccen: planet.pl_orbeccen,
      pl_orbincl: planet.pl_orbincl,
    }));
  }
  
  async function fetchNasaExoplanetData() {
    const response = await fetch('https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+ps&format=json');
    const data = await response.json();
    return data.map(planet => ({
      pl_name: planet.pl_name,
      pl_mass: planet.pl_bmassj,
      pl_radius: planet.pl_radj,
      pl_orbper: planet.pl_orbper,
      st_distance: planet.st_dist,
      pl_temperature: planet.pl_eqt,
      pl_orbeccen: planet.pl_orbeccen,
      pl_orbincl: planet.pl_orbincl,
    }));
  }
  
  function mergeData(keplerData, nasaExoplanetData) {
    const dataMap = new Map();
  
    const mergePlanet = planet => {
      if (dataMap.has(planet.pl_name)) {
        const existingPlanet = dataMap.get(planet.pl_name);
        dataMap.set(planet.pl_name, { ...existingPlanet, ...planet });
      } else {
        dataMap.set(planet.pl_name, planet);
      }
    };
  
    keplerData.forEach(mergePlanet);
    nasaExoplanetData.forEach(mergePlanet);
  
    return Array.from(dataMap.values());
  }
  
  function displayCatalog(data) {
    const catalogElement = document.getElementById('catalog');
  
    data.forEach(planet => {
      const card = document.createElement('div');
      card.className = 'exoplanet-card';
      card.innerHTML = `
        <h3>${planet.pl_name}</h3>
        <p>Mass: ${planet.pl_mass} Jupiter Masses</p>
        <p>Radius: ${planet.pl_radius} Jupiter Radii</p>
        <p>Orbital Period: ${planet.pl_orbper} days</p>
        <p>Distance: ${planet.st_distance} parsecs</p>
        <p>Temperature: ${planet.pl_temperature} K</p>
        <p>Orbital Eccentricity: ${planet.pl_orbeccen}</p>
        <p>Orbital Inclination: ${planet.pl_orbincl} degrees</p>
      `;
      catalogElement.appendChild(card);
    });
  }
  
  fetchData().then(data => {
    console.log(data);
    displayCatalog(data);
  });
  