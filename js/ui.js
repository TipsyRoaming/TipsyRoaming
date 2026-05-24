export function setupUI() {
    // 回到頂部按鈕
    const btt = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) { btt.classList.add('visible'); } 
        else { btt.classList.remove('visible'); }
    });
    btt.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    // 字數限制計數器
    ['study', 'sightseeing', 'gourmet'].forEach(type => {
        const input = document.getElementById(`input-${type}`);
        const counter = document.getElementById(`counter-${type}`);
        input.addEventListener('input', () => {
            let val = input.value;
            if (val.length > 300) {
                val = val.slice(0, 300);
                input.value = val;
            }
            counter.textContent = `${val.length} / 300`;
        });
    });

    // 註冊假表單
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert("Account creation function will be unlocked in the next session!");
    });

    // Base64 混淆聯絡資訊 (防爬蟲)
    document.getElementById('revealContactBtn').addEventListener('click', function() {
        const user = atob('dGlwc3lyb2FtaW5naW50aGV3b3JsZA==');
        const domain = atob('Z21haWwuY29t');
        const fullEmail = `${user}@${domain}`;
        const fullPhone = atob('Kzg4Ni05ODgtNTcyLTI4OA==');
        
        const container = document.getElementById('contact-container');
        container.innerHTML = `
            <p style="margin-bottom: 10px;">
                <a href="mailto:${fullEmail}" style="color: var(--accent-gold); text-decoration: none;">Email: ${fullEmail}</a>
            </p>
            <p>
                <a href="tel:${fullPhone.replace(/-/g, '')}" style="color: var(--accent-gold); text-decoration: none;">Tel: ${fullPhone}</a>
            </p>
        `;
    });

    // GA4 滑鼠懸停追蹤
    const hoverTargets = document.querySelectorAll('.track-hover');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', function() {
            gtag('event', 'hover_item', {
                'item_name': target.getAttribute('data-name') || target.innerText,
                'item_category': target.getAttribute('data-category') || 'General',
                'browsed_from_homepage': 'true'
            });
        });
    });
}