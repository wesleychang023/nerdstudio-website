const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card) => {
    card.addEventListener("click", (event) => {

        // 如果點的是平台連結，不要把卡片收起來
        if (event.target.closest("a")) return;

        card.classList.toggle("is-open");
    });
});


const isTouchDevice = window.matchMedia("(hover: none)").matches;

if (isTouchDevice) {
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach((card) => {
        card.addEventListener("click", (event) => {
            if (event.target.closest("a")) return;

            card.classList.toggle("is-open");
        });
    });
}