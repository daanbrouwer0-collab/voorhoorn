(async function loadLappendag() {
    const repo = "daanbrouwer0-collab/Lappendag";
    const SHA_KEY = "lappendag-cdn-sha";
    const loading = document.getElementById("site-loading");
    const frame = document.getElementById("site-frame");
    const errorContainer = document.getElementById("site-error");
    const errorMessage = document.getElementById("error-message");

    let version = "main";
    try {
        const cached = localStorage.getItem(SHA_KEY);
        if (cached && /^[0-9a-f]{40}$/i.test(cached)) {
            version = cached;
        } else if (cached) {
            localStorage.removeItem(SHA_KEY);
        }
    } catch (_) {
        // localStorage not available
    }

    let base = "";
    let overlayHidden = false;

    function hideOverlay() {
        if (overlayHidden) return;
        overlayHidden = true;
        if (loading) {
            loading.hidden = true;
            loading.style.display = "none";
        }
    }

    function showError(detail) {
        hideOverlay();
        if (errorContainer) {
            errorContainer.hidden = false;
            if (errorMessage && detail) {
                errorMessage.innerHTML = `Kon de Lappendag-site niet laden vanaf GitHub.<br><small style="opacity: 0.7; font-size: 0.8em;">${detail}</small>`;
            }
        }
    }

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

    function refreshShaAndMaybeReload() {
        fetch(`https://api.github.com/repos/${repo}/commits/main?per_page=1`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!data || !data.sha) return;
                if (data.sha !== version) {
                    setVersion(data.sha);
                }
            })
            .catch(() => {});
    }

    function normalizePath(path) {
        let p = (path || "index.html").replace(/^\/+/, "");
        if (!p || p.endsWith("/")) p += "index.html";
        return p;
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

    async function show(path) {
        const pagePath = normalizePath(path);
        const htmlRaw = await fetchPage(pagePath);
        const html = rewriteAssetUrls(htmlRaw, pagePath);

        frame.onload = () => {
            hideOverlay();
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
    }

    refreshShaAndMaybeReload();

    try {
        await show("index.html");
    } catch (err) {
        clearCachedVersion();
        try {
            await show("index.html");
        } catch (err2) {
            showError(String(err2 && err2.message ? err2.message : err2));
        }
    }
})().catch((err) => {
    const loading = document.getElementById("site-loading");
    if (loading) {
        loading.hidden = true;
        loading.style.display = "none";
    }
    const errorContainer = document.getElementById("site-error");
    if (errorContainer) {
        errorContainer.hidden = false;
        const msg = document.getElementById("error-message");
        if (msg) msg.textContent = String(err && err.message ? err.message : err);
    }
});
