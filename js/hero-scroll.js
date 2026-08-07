const hero = document.querySelector(".engineering-hero");
const topArea = document.querySelector(".top-area");

function updateHero() {

    if (!hero || !topArea) return;

    const heroTop = hero.getBoundingClientRect().top;

    // Hero 到這裡開始淡出
    const fadeStart = 220;

    // Hero 到 Top Area 完全消失
    const fadeEnd = topArea.offsetHeight;

    let progress =
        (fadeStart - heroTop) /
        (fadeStart - fadeEnd);

    progress = Math.min(Math.max(progress, 0), 1);

    hero.style.opacity = 1 - progress;

    hero.style.transform = `
        translateY(${-progress * 5}px)
        scale(${1 - progress * 0.01})
    `;
}

window.addEventListener("scroll", updateHero);
window.addEventListener("resize", updateHero);

updateHero();