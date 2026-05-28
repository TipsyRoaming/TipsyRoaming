import { 
    database, ref, push, onValue, 
    auth, provider, signInWithPopup, onAuthStateChanged, signOut,
    storage, storageRef, uploadBytes, getDownloadURL 
} from './firebase.js';

// ==========================================
// 1. 多國語系翻譯字典與邏輯 (內嵌確保功能絕對獨立安全)
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
        }
    }
};

function updateLanguage(lang) {
    const dict = translations[lang] || translations['en'];
    document.querySelectorAll('.lang-text').forEach(el => {
        const key = el.getAttribute('data-i18n-nav');
        if (key && dict.nav[key]) el.textContent = dict.nav[key];
    });
    document.querySelectorAll('.lang-placeholder').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key && dict.placeholder[key]) el.setAttribute('placeholder', dict.placeholder[key]);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 2. 語言切換初始化 (修復完畢)
    // ==========================================
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            updateLanguage(e.target.value);
        });
    }

    // ==========================================
    // 3. 聯絡資訊顯示功能 (Reveal Contact Info 修復完畢)
    // ==========================================
    const revealContactBtn = document.getElementById('revealContactBtn');
    const contactContainer = document.getElementById('contact-container');
    if (revealContactBtn && contactContainer) {
        revealContactBtn.addEventListener('click', () => {
            contactContainer.innerHTML = `
                <p style="color: var(--mist-white); font-size: 1.1rem; margin-top: 15px; animation: fadeIn 0.5s;">
                    <i class="fas fa-envelope"></i> info@tipsyroaming.com
                </p>
            `;
        });
    }

    // ==========================================
    // 4. 站內搜尋功能 (修復完畢，並對應學校清單)
    // ==========================================
    const searchForm = document.getElementById('ga4SearchForm');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchForm && searchInput && searchResults) {
        searchForm.addEventListener('submit', (e) => e.preventDefault());

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

            const matches = schools.filter(s => s.name.toLowerCase().includes(query));

            if (matches.length > 0) {
                matches.forEach(school => {
                    const div = document.createElement('div');
                    div.className = 'search-result-item';
                    div.textContent = school.name;
                    div.style.cssText = 'padding: 10px; cursor: pointer; color: #fff; border-bottom: 1px solid #444;';
                    div.addEventListener('click', () => {
                        window.open(school.url, '_blank');
                        searchResults.style.display = 'none';
                        searchInput.value = '';
                    });
                    searchResults.appendChild(div);
                });
                searchResults.style.display = 'block';
            } else {
                const noResult = document.createElement('div');
                noResult.textContent = 'No schools found';
                noResult.style.cssText = 'padding: 10px; color: #888;';
                searchResults.appendChild(noResult);
                searchResults.style.display = 'block';
            }
        });

        document.addEventListener('click', (e) => {
            if (!searchForm.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    // ==========================================
    // 5. Google 登入與狀態接聽 (Sign In 功能防禦與修復)
    // ==========================================
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
                loginBtn.style.display = 'inline-block';
                userProfile.style.display = 'none';
            }
        });

        loginBtn.addEventListener('click', () => {
            signInWithPopup(auth, provider).catch((error) => {
                console.error("Login failed:", error);
                alert("Google Sign-In failed. Please ensure Firebase configuration is correct.");
            });
        });

        logoutBtn.addEventListener('click', () => {
            signOut(auth).then(() => alert("You have been logged out."));
        });
    }

    // ==========================================
    // 6. 評論字數即時計算 (維持基本 UI 操作)
    // ==========================================
    ['study', 'sightseeing', 'gourmet'].forEach(type => {
        const textarea = document.getElementById(`input-${type}`);
        const counter = document.getElementById(`counter-${type}`);
        if (textarea && counter) {
            textarea.addEventListener('input', () => {
                counter.textContent = `${textarea.value.length} / 300`;
            });
        }
    });

    // ==========================================
    // 7. 照片選擇與縮圖預覽 (獨立支援 Sightseeing 與 Gourmet)
    // ==========================================
    let selectedFiles = {
        sightseeing: null,
        gourmet: null
    };

    ['sightseeing', 'gourmet'].forEach(type => {
        const fileInput = document.getElementById(`file-${type}`);
        const previewContainer = document.getElementById(`preview-${type}`);

        if (fileInput && previewContainer) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                if (file.size > 5 * 1024 * 1024) {
                    alert("File is too large! Please choose an image under 5MB.");
                    fileInput.value = '';
                    return;
                }

                selectedFiles[type] = file;
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewContainer.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            });
        }
    });

    // ==========================================
    // 8. 評論發布邏輯 (Publish)
    // ==========================================
    document.querySelectorAll('.publish-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const type = btn.getAttribute('data-type');
            const inputField = document.getElementById(`input-${type}`);
            if (!inputField) return;

            const textContent = inputField.value.trim();

            if (!textContent) {
                alert("Please write something before publishing!");
                return;
            }

            if (!currentUser) {
                alert("Please Sign in with Google first to share your experience!");
                return;
            }

            const postData = {
                text: textContent,
                author: currentUser.displayName,
                uid: currentUser.uid,
                timestamp: new Date().toISOString(),
                imageUrl: null
            };

            btn.disabled = true;
            const originalText = btn.textContent;
            btn.textContent = "Publishing...";

            try {
                // 只有觀光或美食區有選相片，才上傳至 Storage
                if ((type === 'sightseeing' || type === 'gourmet') && selectedFiles[type]) {
                    const file = selectedFiles[type];
                    const fileName = `${Date.now()}_${file.name}`;
                    const imageRef = storageRef(storage, `reviews/${type}/${fileName}`);
                    
                    const uploadResult = await uploadBytes(imageRef, file);
                    const photoUrl = await getDownloadURL(uploadResult.ref);
                    postData.imageUrl = photoUrl;
                }

                // 文字與照片資料同步寫入 Realtime Database
                await push(ref(database, `reviews/${type}`), postData);
                
                // 表單重設
                inputField.value = '';
                const counter = document.getElementById(`counter-${type}`);
                if (counter) counter.textContent = '0 / 300';
                
                if (type === 'sightseeing' || type === 'gourmet') {
                    selectedFiles[type] = null;
                    const fIn = document.getElementById(`file-${type}`);
                    const pCon = document.getElementById(`preview-${type}`);
                    if (fIn) fIn.value = '';
                    if (pCon) pCon.innerHTML = '';
                }
                alert("Published successfully!");
            } catch (error) {
                console.error("Error publishing:", error);
                alert("Failed to publish review. Please try again.");
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    });

    // ==========================================
    // 9. 即時讀取並渲染評論 (包含相片卡片顯示)
    // ==========================================
    ['study', 'sightseeing', 'gourmet'].forEach(type => {
        const displayArea = document.getElementById(`display-${type}`);
        if (!displayArea) return;

        onValue(ref(database, `reviews/${type}`), (snapshot) => {
            displayArea.innerHTML = '';
            const data = snapshot.val();
            if (data) {
                const posts = Object.values(data).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                posts.forEach(post => {
                    const div = document.createElement('div');
                    div.className = 'review-card';
                    div.style.cssText = 'background: rgba(255,255,255,0.05); padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid var(--accent-gold);';
                    
                    const date = new Date(post.timestamp).toLocaleDateString();
                    
                    let imageHtml = '';
                    if (post.imageUrl) {
                        imageHtml = `<img src="${post.imageUrl}" alt="Review Image" style="max-width: 100%; max-height: 200px; border-radius: 4px; margin-top: 10px; border: 1px solid #444;">`;
                    }

                    div.innerHTML = `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <strong style="color: var(--accent-gold);"><i class="fas fa-user-circle"></i> ${post.author || 'Anonymous'}</strong>
                            <small style="color: #888;">${date}</small>
                        </div>
                        <p style="margin: 0; color: var(--mist-white); line-height: 1.5;">${post.text}</p>
                        ${imageHtml}
                    `;
                    displayArea.appendChild(div);
                });
            }
        });
    });
});