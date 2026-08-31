document.addEventListener('DOMContentLoaded', () => {
    const repo = "daanbrouwer0-collab/Lappendag";
    const SHA_KEY = "lappendag-cdn-sha";

    const landingView = document.getElementById("landingView");
    const mainCard = document.getElementById("mainCard");
    const startBtn = document.getElementById("startLappendagBtn");
    const appContainer = document.getElementById("appContainer");
    const backBtn = document.getElementById("backBtn");
    const frame = document.getElementById("site-frame");
    const loading = document.getElementById("site-loading");
    const errorContainer = document.getElementById("site-error");
    const errorMessage = document.getElementById("error-message");

    let version = "main";
    let isLoaded = false;
    let base = "";

    try {
        const cached = localStorage.getItem(SHA_KEY);
        if (cached && /^[0-9a-f]{40}$/i.test(cached)) {
            version = cached;
        } else if (cached) {
            localStorage.removeItem(SHA_KEY);
        }
    } catch (_) {}

    // Subtle 3D Card tilt effect on mouse move
    if (window.matchMedia('(pointer: fine)').matches && mainCard) {
        document.addEventListener('mousemove', (e) => {
            if (landingView.classList.contains('fade-out')) return;
            const { innerWidth, innerHeight } = window;
            const xOffset = (e.clientX / innerWidth - 0.5) * 14;
            const yOffset = (e.clientY / innerHeight - 0.5) * 14;
            mainCard.style.transform = `perspective(1000px) rotateY(${xOffset}deg) rotateX(${-yOffset}deg)`;
        });

        document.addEventListener('mouseleave', () => {
            mainCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
        });
    }

    // Button ripple animation
    startBtn.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;

        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${e.clientX - rect.left - radius}px`;
        ripple.style.top = `${e.clientY - rect.top - radius}px`;
        ripple.classList.add('ripple');

        const existingRipple = this.querySelector('.ripple');
        if (existingRipple) existingRipple.remove();

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);

        openLappendag();
    });

    backBtn.addEventListener('click', () => {
        appContainer.classList.remove('fade-in');
        setTimeout(() => {
            appContainer.hidden = true;
            landingView.classList.remove('fade-out');
            document.title = "Voorhoorn";
        }, 300);
    });

    function setVersion(next) {
        version = next;
        try {
            if (/^[0-9a-f]{40}$/i.test(next)) {
                localStorage.setItem(SHA_KEY, next);
            }
        } catch (_) {}
    }

    function clearCachedVersion() {
        version = "main";
        try {
            localStorage.removeItem(SHA_KEY);
        } catch (_) {}
    }

    function candidateBases(ver) {
        const list = [];
        if (ver && ver !== "main") {
            list.push(`https://cdn.jsdelivr.net/gh/${repo}@${ver}`);
        }
        list.push(`https://cdn.jsdelivr.net/gh/${repo}@main`);
        list.push(`https://raw.githubusercontent.com/${repo}/${ver && ver !== "main" ? ver : "main"}`);
        list.push(`https://raw.githubusercontent.com/${repo}/main`);
        return [...new Set(list)];
    }

    async function fetchPage(path) {
        const bases = candidateBases(version);
        let lastErr = null;

        for (const tryBase of bases) {
            try {
                const res = await fetch(`${tryBase}/${path}`, { cache: "no-cache" });
                if (!res.ok) {
                    lastErr = `${res.status} @ ${tryBase}`;
                    continue;
                }
                const html = await res.text();
                if (!html || !/<html/i.test(html)) {
                    lastErr = `Geen geldige HTML @ ${tryBase}`;
                    continue;
                }
                base = tryBase.endsWith("/") ? tryBase.slice(0, -1) : tryBase;
                return html;
            } catch (err) {
                lastErr = String(err && err.message ? err.message : err);
            }
        }
        throw new Error(lastErr || "Geen CDN bereikbaar");
    }

    function refreshSha() {
        fetch(`https://api.github.com/repos/${repo}/commits/main?per_page=1`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data && data.sha) setVersion(data.sha);
            })
            .catch(() => {});
    }

    function rewriteAssetUrls(html, pagePath) {
        const pageDir = pagePath.includes("/")
            ? pagePath.slice(0, pagePath.lastIndexOf("/") + 1)
            : "";
        const pageBase = `${base}/${pageDir}`;

        if (!/<base\s/i.test(html)) {
            html = html.replace(
                /<head([^>]*)>/i,
                `<head$1><base href="${pageBase}">`
            );
        }
        return html;
    }

    async function openLappendag() {
        if (isLoaded) {
            landingView.classList.add('fade-out');
            appContainer.hidden = false;
            setTimeout(() => appContainer.classList.add('fade-in'), 50);
            return;
        }

        loading.hidden = false;

        try {
            const htmlRaw = await fetchPage("index.html");
            const html = rewriteAssetUrls(htmlRaw, "index.html");

            frame.onload = () => {
                loading.hidden = true;
                landingView.classList.add('fade-out');
                appContainer.hidden = false;
                setTimeout(() => appContainer.classList.add('fade-in'), 50);
                isLoaded = true;

                try {
                    const doc = frame.contentDocument;
                    if (doc) {
                        const title = doc.querySelector("title");
                        if (title && title.textContent) {
                            document.title = title.textContent;
                        }
                    }
                } catch (_) {}
            };

            frame.srcdoc = html;
        } catch (err) {
            loading.hidden = true;
            clearCachedVersion();
            if (errorContainer) {
                errorContainer.hidden = false;
                if (errorMessage) {
                    errorMessage.innerHTML = `Kon de Lappendag-site niet laden vanaf GitHub.<br><small style="opacity: 0.7; font-size: 0.8em;">${err && err.message ? err.message : err}</small>`;
                }
            }
        }
    }

    refreshSha();
});
