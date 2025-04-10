document.addEventListener("DOMContentLoaded", function () {
    let menuButton = document.querySelector(".menu-button");
    let banner = document.querySelector(".banner");

    menuButton.addEventListener("click", function () {
        banner.classList.toggle("show"); // Affiche ou cache la bannière
    });
});
