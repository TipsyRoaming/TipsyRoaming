export const staticSearchData = [
    { name: "WALES", type: "School", link: "#study" },
    { name: "BECI", type: "School", link: "#study" },
    { name: "PINES", type: "School", link: "#study" },
    { name: "JIC", type: "School", link: "#study" },
    { name: "MONOL", type: "School", link: "#study" },
    { name: "HELP", type: "School", link: "#study" },
    { name: "CNS", type: "School", link: "#study" },
    { name: "ANJ", type: "School", link: "#study" }
];

export function setupSearch(searchInput, searchResults, getDynamicData) {

    const form = document.getElementById('ga4SearchForm');
    if (form) {
        form.addEventListener('submit', e => e.preventDefault());
    }

    if (!searchInput || !searchResults) return;

    searchInput.addEventListener('input', () => {
        const val = searchInput.value.toLowerCase().trim();

        searchResults.replaceChildren();

        if (!val) {
            searchResults.style.display = 'none';
            return;
        }

        const dynamic = getDynamicData?.() || [];

        const staticMatches = staticSearchData.filter(i =>
            i.name.toLowerCase().includes(val)
        );

        const dynamicMatches = dynamic.filter(i =>
            (i.content || '').toLowerCase().includes(val)
        );

        if (staticMatches.length === 0 && dynamicMatches.length === 0) {
            searchResults.style.display = 'none';
            return;
        }

        searchResults.style.display = 'block';

        staticMatches.forEach(item => {
            const a = document.createElement('a');
            a.className = 'search-item';
            a.href = item.link;

            a.innerHTML = `<strong>${item.name}</strong><small>School</small>`;

            a.onclick = () => {
                searchResults.style.display = 'none';
                searchInput.value = '';
            };

            searchResults.appendChild(a);
        });

        dynamicMatches.forEach(item => {
            const a = document.createElement('a');
            a.className = 'search-item';
            a.href = item.link || '#';

            const snippet = (item.content || '').slice(0, 25);

            a.innerHTML = `<strong>"${snippet}"</strong><small>${item.category || 'Review'}</small>`;

            a.onclick = () => {
                searchResults.style.display = 'none';
                searchInput.value = '';
            };

            searchResults.appendChild(a);
        });
    });

    document.addEventListener('click', (e) => {
        const container = document.querySelector('.ga4-search-container');
        if (!container) return;

        if (!container.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}