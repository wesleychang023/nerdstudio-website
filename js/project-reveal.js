const projectCards = document.querySelectorAll(
    ".project-card, .arrangement-works > a, .design-card"
);

const projectObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("is-visible");

                observer.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px"
    }
);

projectCards.forEach((card) => {
    projectObserver.observe(card);
});