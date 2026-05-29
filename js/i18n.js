const translations = {
    en: { nav: {}, placeholder: {} },
    zh: { nav: {}, placeholder: {} },
    ja: { nav: {}, placeholder: {} }
};

export function setupI18n() {
    const sel = document.getElementById('langSelect');
    if (!sel) return;

    sel.addEventListener('change', e => {
        update(e.target.value);
    });
}

function update(lang) {
    const dict = translations[lang] || translations.en;

    document.querySelectorAll('.lang-text').forEach(el => {
        const key = el.dataset.i18nNav;
        if (key && dict.nav[key]) el.textContent = dict.nav[key];
    });

    document.querySelectorAll('.lang-placeholder').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (key && dict.placeholder[key]) {
            el.setAttribute('placeholder', dict.placeholder[key]);
        }
    });
}