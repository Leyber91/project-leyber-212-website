fetch('exoplanet_data.json')
  .then(response => response.json())
  .then(data => {
    populateCarousel(data);
    initializeCarousel();
  });

function populateCarousel(data) {
  const carousel = document.querySelector('.carousel');
  data.forEach(planet => {
    const card = document.createElement('div');
    card.innerHTML = `
      <h2>${planet.pl_name}</h2>
      <p>Mass: ${planet.pl_masse} Earth Masses</p>
      <p>Distance from Earth: ${planet.sy_dist} Parsecs</p>
      <p>Atmospheric Composition: TBA</p>
    `;
    carousel.appendChild(card);
  });
}

function initializeCarousel() {
  $('.carousel').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
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
