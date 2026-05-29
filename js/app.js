import {
    database, ref, push, onValue,
    auth, provider, signInWithPopup, onAuthStateChanged, signOut,
    storage, storageRef, uploadBytes, getDownloadURL
} from './firebase.js';

// ==========================================
// 1. 多國語系翻譯字典
// ==========================================
const translations = {
    en: {
        nav: {
            about: "About", study: "Study", travel: "Travel", contact: "Connect", register: "Register",
            weather: "Weather", population: "Population", holidays: "Holidays",
            whyVisit: "Why Visit Baguio?", studyTitle: "Study English in Baguio",
            travelTitle: "Travel in Baguio", sightseeing: "Sightseeing", gourmet: "Gourmet",
            registerTitle: "Register", createAccount: "Create Account",
            contactTitle: "Connect With Us", revealContact: "Reveal Contact Info",
            publish: "Publish"
        },
        placeholder: {
            review: "Write your review (max 300 chars)...",
            sightseeing: "Share your sightseeing experience...",
            gourmet: "Share your food experience..."
        },
        aboutContent: {
            p1: "Strolling through Baguio at an altitude of 1,500 meters...",
            p2: "The \"slowness\" here possesses a soul of its own..."
        }
    },
    zh: {
        nav: {
            about: "關於", study: "遊學", travel: "旅遊", contact: "聯絡我們", register: "註冊",
            weather: "天氣", population: "人口", holidays: "國定假日",
            whyVisit: "為何選擇碧瑤？", studyTitle: "碧瑤語言學校",
            travelTitle: "碧瑤旅遊", sightseeing: "景點觀光", gourmet: "在地美食",
            registerTitle: "會員註冊", createAccount: "建立帳號",
            contactTitle: "聯絡資訊", revealContact: "顯示聯絡方式",
            publish: "發布心得"
        },
        placeholder: {
            review: "分享您的遊學心得 (300字以內)...",
            sightseeing: "分享您的旅遊經驗...",
            gourmet: "分享您的美食體驗..."
        },
        aboutContent: {
            p1: "漫步在海拔 1,500 公尺的碧瑤...",
            p2: "這裡的「慢」擁有著自己的靈魂..."
        }
    },
    ja: {
        nav: {
            about: "概要", study: "留学", travel: "旅行", contact: "連絡先", register: "登録",
            weather: "天気", population: "人口", holidays: "祝日",
            whyVisit: "なぜバギオへ？", studyTitle: "バギオの語学学校",
            travelTitle: "バギオ観光", sightseeing: "観光名所", gourmet: "グルメ",
            registerTitle: "会員登録", createAccount: "アカウント作成",
            contactTitle: "お問い合わせ", revealContact: "連絡先を表示",
            publish: "投稿する"
        },
        placeholder: {
            review: "レビューを書く（300文字以内）...",
            sightseeing: "観光の思い出をシェア...",
            gourmet: "美味しい体験をシェア..."
        },
        aboutContent: {
            p1: "標高1,500メートルのバギオ...",
            p2: "ここでの「ゆっくりとした時間」には..."
        }
    }
};

// ==========================================
// 語言切換
// ==========================================
function updateLanguage(lang) {
    const dict = translations[lang] || translations.en;

    document.querySelectorAll('.lang-text').forEach(el => {
        const key = el.getAttribute('data-i18n-nav');
        if (key && dict.nav[key]) el.textContent = dict.nav[key];
    });

    document.querySelectorAll('.lang-placeholder').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key && dict.placeholder[key]) {
            el.setAttribute('placeholder', dict.placeholder[key]);
        }
    });

    const aboutContainer = document.getElementById('about-content');
    if (aboutContainer) {
        aboutContainer.innerHTML = `
            <p>${dict.aboutContent.p1}</p>
            <p>${dict.aboutContent.p2}</p>
        `;
    }
}

// ==========================================
// DOM Ready
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    // -----------------------------
    // language switch
    // -----------------------------
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            updateLanguage(e.target.value);
        });
    }

    // -----------------------------
    // contact reveal
    // -----------------------------
    const revealContactBtn = document.getElementById('revealContactBtn');
    const contactContainer = document.getElementById('contact-container');

    if (revealContactBtn && contactContainer) {
        revealContactBtn.addEventListener('click', () => {
            contactContainer.innerHTML = `
                <p style="color: var(--mist-white); font-size: 1.1rem;">
                    <i class="fas fa-envelope"></i> tipsyroamingintheworld@gmail.com
                </p>
            `;
        });
    }

    // -----------------------------
    // search
    // -----------------------------
    const searchForm = document.getElementById('ga4SearchForm');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (searchForm && searchInput && searchResults) {
        searchForm.addEventListener('submit', e => e.preventDefault());

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            searchResults.innerHTML = '';

            if (!query) {
                searchResults.style.display = 'none';
                return;
            }

            const schools = [
                { name: 'WALES', url: 'https://walesph.com/' },
                { name: 'BECI', url: 'https://beciedu.com/' },
                { name: 'PINES', url: 'https://pinesacademy.com/' },
                { name: 'JIC', url: 'https://baguio-jic.com/' },
                { name: 'MONOL', url: 'https://mymonol.com/' },
                { name: 'HELP', url: 'https://helpenglish.org/' },
                { name: 'CNS', url: 'https://cnsphil.com/' },
                { name: 'ANJ', url: 'https://anjedudc.com/' }
            ];

            const matches = schools.filter(s =>
                s.name.toLowerCase().includes(query)
            );

            if (matches.length > 0) {
                matches.forEach(school => {
                    const div = document.createElement('div');
                    div.textContent = school.name;
                    div.style.cssText = 'padding:10px;cursor:pointer;color:#fff;border-bottom:1px solid #444;';

                    div.onclick = () => {
                        window.open(school.url, '_blank');
                        searchResults.style.display = 'none';
                        searchInput.value = '';
                    };

                    searchResults.appendChild(div);
                });
                searchResults.style.display = 'block';
            } else {
                searchResults.innerHTML = `<div style="padding:10px;color:#888;">No schools found</div>`;
                searchResults.style.display = 'block';
            }
        });

        document.addEventListener('click', (e) => {
            if (!searchForm.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    // -----------------------------
    // auth
    // -----------------------------
    const loginBtn = document.getElementById('navLoginBtn');
    const logoutBtn = document.getElementById('navLogoutBtn');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');

    let currentUser = null;

    if (loginBtn && logoutBtn && userProfile) {

        onAuthStateChanged(auth, (user) => {
            if (user) {
                currentUser = user;
                loginBtn.style.display = 'none';
                userProfile.style.display = 'flex';
                if (userName) userName.textContent = user.displayName;
                if (userAvatar) userAvatar.src = user.photoURL;
            } else {
                currentUser = null;
                loginBtn.style.display = 'block';
                userProfile.style.display = 'none';
            }
        });

        loginBtn.addEventListener('click', async () => {
            try {
                await signInWithPopup(auth, provider);
            } catch (error) {
                console.error(error);

                let msg = "Login failed";
                if (error.code === 'auth/unauthorized-domain') {
                    msg = "Unauthorized domain in Firebase.";
                } else if (error.code === 'auth/popup-closed-by-user') {
                    msg = "Popup closed.";
                }

                alert(msg);
            }
        });

        logoutBtn.addEventListener('click', () => {
            signOut(auth).then(() => alert("Logged out"));
        });
    }

    // -----------------------------
    // counters
    // -----------------------------
    ['study', 'sightseeing', 'gourmet'].forEach(type => {
        const textarea = document.getElementById(`input-${type}`);
        const counter = document.getElementById(`counter-${type}`);

        if (textarea && counter) {
            textarea.addEventListener('input', () => {
                counter.textContent = `${textarea.value.length} / 300`;
            });
        }
    });

    // -----------------------------
    // file upload
    // -----------------------------
    let selectedFiles = { sightseeing: null, gourmet: null };

    ['sightseeing', 'gourmet'].forEach(type => {
        const input = document.getElementById(`file-${type}`);
        const preview = document.getElementById(`preview-${type}`);

        if (input && preview) {
            input.addEventListener('change', e => {
                const file = e.target.files[0];
                if (!file) return;

                selectedFiles[type] = file;

                const reader = new FileReader();
                reader.onload = ev => {
                    preview.innerHTML = `<img src="${ev.target.result}" />`;
                };
                reader.readAsDataURL(file);
            });
        }
    });

    // -----------------------------
    // publish
    // -----------------------------
    document.querySelectorAll('.publish-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const type = btn.dataset.type;
            const input = document.getElementById(`input-${type}`);

            if (!input?.value.trim()) return;
            if (!currentUser) return alert("Please login");

            const post = {
                text: input.value.trim(),
                author: currentUser.displayName,
                uid: currentUser.uid,
                timestamp: new Date().toISOString(),
                imageUrl: null
            };

            await push(ref(database, `reviews/${type}`), post);

            input.value = '';
        });
    });

    // -----------------------------
    // realtime
    // -----------------------------
    ['study', 'sightseeing', 'gourmet'].forEach(type => {
        const box = document.getElementById(`display-${type}`);
        if (!box) return;

        onValue(ref(database, `reviews/${type}`), snap => {
            box.innerHTML = '';
            const data = snap.val();
            if (!data) return;

            Object.values(data)
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .forEach(post => {
                    const div = document.createElement('div');
                    div.textContent = `${post.author}: ${post.text}`;
                    box.appendChild(div);
                });
        });
    });

});
