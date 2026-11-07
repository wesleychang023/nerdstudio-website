
document.addEventListener("DOMContentLoaded", () => {
    const videos = [...document.querySelectorAll(".smart-video")];

    const MAX_LOADING = 2;
    const PRELOAD_DISTANCE = 600;
    const MIN_BUFFER_SECONDS = 2;

    const states = new Map();

    videos.forEach((video) => {
        const source = video.querySelector("source");

        if (!source) return;

        const url = source.getAttribute("src");

        source.removeAttribute("src");
        video.preload = "none";
        video.load();

        states.set(video, {
            source,
            url,
            requested: false,
            loading: false,
            ready: false
        });
    });

    function distanceFromViewport(video) {
        const rect = video.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        if (rect.bottom < 0) return -rect.bottom;
        if (rect.top > viewportHeight) {
            return rect.top - viewportHeight;
        }

        return 0;
    }

    function isVisible(video) {
        const rect = video.getBoundingClientRect();

        return rect.bottom > 0 &&
               rect.top < window.innerHeight &&
               rect.width > 0 &&
               rect.height > 0;
    }

    function bufferedSeconds(video) {
        const time = video.currentTime;

        for (let i = 0; i < video.buffered.length; i++) {
            if (
                video.buffered.start(i) <= time &&
                video.buffered.end(i) >= time
            ) {
                return video.buffered.end(i) - time;
            }
        }

        return 0;
    }

    function canStart(video) {
        return video.readyState >= 3 &&
            (
                bufferedSeconds(video) >= MIN_BUFFER_SECONDS ||
                (
                    Number.isFinite(video.duration) &&
                    bufferedSeconds(video) >= video.duration - video.currentTime - 0.1
                )
            );
    }

    function tryPlay(video) {
        if (!isVisible(video) || document.hidden) {
            video.pause();
            return;
        }

        if (!canStart(video)) return;

        if (video.paused) {
            video.play().catch(() => {});
        }
    }

    function startLoading(video) {
        const state = states.get(video);

        if (!state || state.requested) return;

        state.requested = true;
        state.loading = true;

        state.source.src = state.url;
        video.preload = "auto";
        video.load();
    }

    function schedule() {
        const ranked = [...states.keys()]
            .map((video) => ({
                video,
                distance: distanceFromViewport(video)
            }))
            .sort((a, b) => a.distance - b.distance);

        for (const { video } of ranked) {
            if (!isVisible(video) || document.hidden) {
                video.pause();
            } else {
                tryPlay(video);
            }
        }

        let loadingCount = [...states.values()]
            .filter((state) => state.loading).length;

        for (const { video, distance } of ranked) {
            if (distance > PRELOAD_DISTANCE) break;
            if (loadingCount >= MAX_LOADING) break;

            const state = states.get(video);

            if (!state.requested) {
                startLoading(video);
                loadingCount++;
            }
        }
    }

    videos.forEach((video) => {
        const state = states.get(video);
        if (!state) return;

        const markReady = () => {
            if (canStart(video)) {
                state.ready = true;
                state.loading = false;
                schedule();
            }
        };

        video.addEventListener("progress", markReady);
        video.addEventListener("canplay", markReady);
        video.addEventListener("canplaythrough", markReady);
        video.addEventListener("loadeddata", markReady);

        video.addEventListener("waiting", () => {
            // 瀏覽器正在等待更多影片資料
        });

        video.addEventListener("error", () => {
            state.loading = false;
            schedule();
        });
    });

    let scheduled = false;

    function requestSchedule() {
        if (scheduled) return;

        scheduled = true;

        requestAnimationFrame(() => {
            scheduled = false;
            schedule();
        });
    }

    window.addEventListener("scroll", requestSchedule, {
        passive: true
    });

    window.addEventListener("resize", requestSchedule);

    document.addEventListener(
        "visibilitychange",
        requestSchedule
    );

    schedule();
});
