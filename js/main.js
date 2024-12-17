// Select necessary elements
const hamburger = document.querySelector(".hamburguer");
const navMenu = document.querySelector(".nav-menu");

// Toggle menu visibility on hamburger click
hamburger.addEventListener("click", toggleMenu);

function toggleMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}

// Close menu when a nav link is clicked
document.querySelectorAll(".nav-links a").forEach(link =>
    link.addEventListener("click", closeMenu)
);

function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}



// Assuming you have a success message div with id "success-message"
document.getElementById("success-message").innerHTML = "Message sent successfully!";

function showMessage(message, isError) {
    const messageDiv = document.getElementById("message-div");
    messageDiv.textContent = message;
    messageDiv.style.color = isError ? "red" : "green";
}


// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            // Smooth scroll to the target element
            targetElement.scrollIntoView({
                behavior: "smooth",
            });
        }

        // Close menu after navigation
        closeMenu();
    });
});
