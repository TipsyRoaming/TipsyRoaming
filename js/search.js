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
    document.getElementById('ga4SearchForm').addEventListener('submit', e => { e.preventDefault(); });

    searchInput.addEventListener('input', function() {
        const val = this.value.toLowerCase();
        searchResults.replaceChildren();
        if(!val) { searchResults.style.display = 'none'; return; }

        const dynamicSearchData = getDynamicData();
        const filteredStatic = staticSearchData.filter(item => item.name.toLowerCase().includes(val));
        const filteredDynamic = dynamicSearchData.filter(item => item.content.toLowerCase().includes(val));

        if(filteredStatic.length > 0 || filteredDynamic.length > 0) {
            searchResults.style.display = 'block';
            
            filteredStatic.forEach(item => {
                const a = document.createElement('a');
                a.href = item.link;
                a.className = 'search-item';
                const strong = document.createElement('strong'); strong.textContent = item.name;
                const small = document.createElement('small'); small.textContent = ' School Info';
                a.appendChild(strong); a.appendChild(small);
                a.onclick = () => { searchResults.style.display = 'none'; searchInput.value = ''; };
                searchResults.appendChild(a);
            });

            filteredDynamic.forEach(item => {
                const a = document.createElement('a');
                a.href = item.link;
                a.className = 'search-item';
                let snippet = item.content.length > 25 ? item.content.substring(0, 25) + '...' : item.content;
                const strong = document.createElement('strong'); strong.textContent = `"${snippet}"`;
                const small = document.createElement('small'); small.textContent = ` User Review in ${item.category.toUpperCase()}`;
                a.appendChild(strong); a.appendChild(small);
                a.onclick = () => { searchResults.style.display = 'none'; searchInput.value = ''; };
                searchResults.appendChild(a);
            });
        } else {
            searchResults.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if(!document.querySelector('.ga4-search-container').contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}