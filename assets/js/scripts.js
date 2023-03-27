document.addEventListener('DOMContentLoaded', () => {
    // Add the Tryverse section
    const tryverseSection = document.createElement('section');
    tryverseSection.classList.add('tryverse');
    tryverseSection.innerHTML = `
        <h2>The Tryverse</h2>
        <p>Enter the Tryverse, where we explore alternative realities based on the events of the current timeline. Experience two unique dimensions: one where reality is even better than it is now, and another where everything takes a darker turn. Let's dive into these fascinating worlds and discover how small events can drastically change the course of history.</p>
    `;
    
    document.querySelector('main').appendChild(tryverseSection);
  });

  document.addEventListener('DOMContentLoaded', function () {
    // Toggle sidebar on click
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('#sidebar');

    menuToggle.addEventListener('click', function () {
        sidebar.classList.toggle('show');
    });

    // Add parallax effect to the title
    const title = document.querySelector('.title');

    window.addEventListener('scroll', function () {
        let scrollPosition = window.pageYOffset;
        title.style.transform = 'translateY(' + scrollPosition * 0.5 + 'px)';
    });
});
