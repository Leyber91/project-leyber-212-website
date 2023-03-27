// scripts.js
document.addEventListener("DOMContentLoaded", function() {
    // Parallax scrolling effect
    const parallax = document.querySelector(".introduction");

    window.addEventListener("scroll", function() {
        let offset = window.pageYOffset;
        parallax.style.backgroundPositionY = offset * 0.7 + "px";
    });
});
