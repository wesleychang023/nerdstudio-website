const projectWall = document.querySelector(".project-wall");

if (projectWall) {
    const cards = [...projectWall.querySelectorAll(".project-card")];

    let animationFrame = null;

    function getNumber(value) {
        const number = Number.parseFloat(value);
        return Number.isFinite(number) ? number : 0;
    }

    function layoutMasonry() {
        const wallStyles = window.getComputedStyle(projectWall);

        const columns = Math.max(
            1,
            Number.parseInt(
                wallStyles.getPropertyValue("--project-columns"),
                10
            ) || 1
        );

        const gap = getNumber(
            wallStyles.getPropertyValue("--project-gap")
        );

        const paddingLeft = getNumber(wallStyles.paddingLeft);
        const paddingRight = getNumber(wallStyles.paddingRight);
        const paddingBottom = getNumber(wallStyles.paddingBottom);

        const availableWidth =
            projectWall.clientWidth - paddingLeft - paddingRight;

        const cardWidth =
            (availableWidth - gap * (columns - 1)) / columns;

        /*
         * 每一欄目前累積的高度。
         */
        const columnHeights = new Array(columns).fill(0);

        cards.forEach((card, index) => {
            card.style.width = `${cardWidth}px`;

            /*
             * 關鍵修改：
             * 不再尋找最短欄位。
             *
             * Project 1 → 第 1 欄
             * Project 2 → 第 2 欄
             * Project 3 → 第 3 欄
             * Project 4 → 第 4 欄
             * Project 5 → 第 5 欄
             * Project 6 → 回到第 1 欄
             */
            const column = index % columns;

            const x =
                paddingLeft + column * (cardWidth + gap);

            const y = columnHeights[column];

            card.style.transform =
                `translate(${x}px, ${y}px)`;

            /*
             * 量取卡片展開後的真實高度，
             * 再更新該欄下一張作品的位置。
             */
            const cardHeight = card.offsetHeight;

            columnHeights[column] =
                y + cardHeight + gap;
        });

        const tallestColumn = Math.max(...columnHeights, 0);

        projectWall.style.height =
            `${tallestColumn + paddingBottom}px`;
    }

    function scheduleLayout() {
        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
        }

        animationFrame = requestAnimationFrame(() => {
            layoutMasonry();
            animationFrame = null;
        });
    }

    document.addEventListener(
        "DOMContentLoaded",
        scheduleLayout
    );

    window.addEventListener("load", scheduleLayout);
    window.addEventListener("resize", scheduleLayout);

    projectWall.querySelectorAll("img").forEach((image) => {
        if (!image.complete) {
            image.addEventListener(
                "load",
                scheduleLayout,
                { once: true }
            );
        }
    });

    projectWall.querySelectorAll("video").forEach((video) => {
        if (video.readyState < 1) {
            video.addEventListener(
                "loadedmetadata",
                scheduleLayout,
                { once: true }
            );
        }
    });

    const resizeObserver = new ResizeObserver(() => {
        scheduleLayout();
    });

    cards.forEach((card) => {
        resizeObserver.observe(card);
    });
}