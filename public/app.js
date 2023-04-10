async function fetchData() {
    const dataContainer = document.getElementById("data");
    try {
      const response = await fetch("https://project-leyber-212-website-exomania.leyber91.repl.co/fetch-data");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
  
      const result = await response.json();
      displayData(result.data, dataContainer);
    } catch (error) {
      dataContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  }
  
  function displayData(data, container) {
    const table = document.createElement("table");
    const header = document.createElement("tr");
  
    // Add table headers
    const headers = [
      "Planet Name",
      "Host Name",
      "Distance (pc)",
      "Orbital Period (days)",
      "Orbit Semi-Major Axis (AU)",
      "Planet Radius (Earth radii)",
      "Planet Mass (Earth masses)",
      "Equilibrium Temperature (K)",
      "Stellar Effective Temperature (K)",
    ];
  
    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      header.appendChild(th);
    });
  
    table.appendChild(header);
  
    // Add table rows
    data.forEach((row) => {
      const tr = document.createElement("tr");
  
      const properties = [
        "pl_name",
        "hostname",
        "sy_dist",
        "pl_orbper",
        "pl_orbsmax",
        "pl_rade",
        "pl_masse",
        "pl_eqt",
        "st_teff",
      ];
  
      properties.forEach((property) => {
        const td = document.createElement("td");
        td.textContent = row[property];
        tr.appendChild(td);
      });
  
      table.appendChild(tr);
    });
  
    container.innerHTML = "";
    container.appendChild(table);
  }
  