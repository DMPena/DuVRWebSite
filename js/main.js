const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", toggleMenu);

function toggleMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", closeMenu));

function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            // Close the menu if it's open
            closeMenu();

            // Smooth scroll to the target element
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});