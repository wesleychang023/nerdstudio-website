const menuToggle = document.querySelector(".menu-toggle");
const serviceMenu = document.querySelector(".service-menu");

if (menuToggle && serviceMenu) {

    menuToggle.addEventListener("click", () => {

        const isOpen =
            menuToggle.classList.toggle("is-open");

        serviceMenu.classList.toggle(
            "is-open",
            isOpen
        );

        document.body.classList.toggle(
            "menu-open",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );
    });
}