
const isTouchDevice = window.matchMedia("(hover: none)").matches;

if (isTouchDevice) {
    document.querySelectorAll(".project-card").forEach((card) => {
        card.addEventListener("click", (event) => {
            if (event.target.closest("a")) return;

            card.classList.toggle("is-open");
        });
    });
}
