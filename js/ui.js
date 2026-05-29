export function setupUI() {

    const $ = (id) => document.getElementById(id);

    // ================= Back to top =================
    const btt = $('backToTop');

    if (btt) {
        window.addEventListener('scroll', () => {
            btt.classList.toggle('visible', window.pageYOffset > 300);
        });

        btt.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ================= Counter =================
    ['study', 'sightseeing', 'gourmet'].forEach(type => {
        const input = $(`input-${type}`);
        const counter = $(`counter-${type}`);
        if (!input || !counter) return;

        if (input.dataset.bound === "1") return;
        input.dataset.bound = "1";

        input.addEventListener('input', () => {
            let v = input.value || '';
            if (v.length > 300) v = v.slice(0, 300);

            input.value = v;
            counter.textContent = `${v.length} / 300`;
        });
    });

    // ================= Register =================
    const registerForm = $('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Account creation function will be unlocked in the next session!");
        });
    }

    // ================= Contact =================
    const revealBtn = $('revealContactBtn');
    const container = $('contact-container');

    if (revealBtn && container) {
        revealBtn.addEventListener('click', () => {
            if (container.dataset.done === "1") return;
            container.dataset.done = "1";

            const user = atob('dGlwc3lyb2FtaW5naW50aGV3b3JsZA==');
            const domain = atob('Z21haWwuY29t');

            container.innerHTML = `
                <p>
                    <a href="mailto:${user}@${domain}" style="color: var(--accent-gold);">
                        Email: ${user}@${domain}
                    </a>
                </p>
            `;
        });
    }

    // ================= GA4 =================
    document.querySelectorAll('.track-hover').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (typeof gtag !== "function") return;

            gtag('event', 'hover_item', {
                item_name: el.dataset.name || el.innerText,
                item_category: el.dataset.category || 'General'
            });
        });
    });
}