import { 
    database, ref, push, onValue, 
    auth, provider, signInWithPopup, onAuthStateChanged, signOut,
    storage, storageRef, uploadBytes, getDownloadURL 
} from './firebase.js';

// ==========================================
// 1. 多國語系翻譯字典與邏輯 (已完整還原您的翻譯)
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
            p1: "Strolling through Baguio at an altitude of 1,500 meters, the air is ever-infused with a delicate scent of pine and gentle mist. Gone is the sweltering heat and clamor of Manila, replaced by a refreshing crispness that feels like perpetual spring.",
            p2: "The \"slowness\" here possesses a soul of its own. You might find yourself rowing across Burnham Park Lake under a setting sun, or lost in a book at an artistic bistro, accompanied by the cool mountain breeze. For students and seekers, the local warmth is as comforting as the sturdy pines. Within this odyssey of learning and roaming, one always finds the most tranquil sanctuary in the \"Summer Capital.\" It is more than just a stay in a foreign land; it is a profound dialogue with oneself above the clouds."
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
            p1: "漫步在海拔 1,500 公尺的碧瑤，空氣中始終瀰漫著淡淡的松香與輕柔的薄霧。遠離了馬尼拉的酷熱與喧囂，取而代之的是宛如四季如春般的清爽宜人。",
            p2: "這裡的「慢」擁有著自己的靈魂。你或許會在夕陽下的伯納姆公園（Burnham Park）湖面上划著小船，又或者在涼爽山風的伴隨下，沉浸於充滿藝術氣息的小酒館裡閱讀。對於學生與探索者而言，當地人的熱情與溫暖就如同那些堅韌的松樹般令人安心。在這趟學習與漫遊的旅程中，人們總能在這座「夏都」找到最寧靜的避風港。這不僅僅是一段異鄉的停留；更是一場在雲端之上與自己進行的深刻對話。"
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
            p1: "標高1,500メートルのバギオを散策すると、空気には常にほのかな松の香りと優しい霧が漂っています。マニラのうだるような暑さと喧騒から離れ、そこにあるのは永遠の春を感じさせるような清々しさです。",
            p2: "ここでの「ゆっくりとした時間」には、それ独自の魂が宿っています。夕暮れ時のバーナム・パークの湖でボートを漕いだり、涼しい山風に吹かれながらアートな雰囲気のビストロで読書に没頭したりするかもしれません。学生や探求者にとって、地元の人々の温かさは、力強くそびえ立つ松の木のように心を落ち着かせてくれます。この学びと放浪の旅の中で、誰もがこの「夏の首都」に最も穏やかな聖域を見出します。それは単なる異国での滞在にとどまらず、雲の上で自分自身と深く対話するような体験なのです。"
        }
    }
};

function updateLanguage(lang) {
    const dict = translations[lang] || translations['en'];
    
    // 更新標題與按鈕
    document.querySelectorAll('.lang-text').forEach(el => {
        const key = el.getAttribute('data-i18n-nav');
        if (key && dict.nav[key]) el.textContent = dict.nav[key];
    });
    
    // 更新輸入框提示
    document.querySelectorAll('.lang-placeholder').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key && dict.placeholder[key]) el.setAttribute('placeholder', dict.placeholder[key]);
    });

    // 完整還原：更新關於碧瑤的文章內容
    const aboutContainer = document.getElementById('about-content');
    if (aboutContainer && dict.aboutContent) {
        aboutContainer.innerHTML = `
            <p>${dict.aboutContent.p1}</p>
            <p>${dict.aboutContent.p2}</p>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 2. 語言切換初始化
    // ==========================================
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            updateLanguage(e.target.value);
        });
    }

    // ==========================================
    // 3. 聯絡資訊顯示功能 (⚠️ 請在下方填入您真實的聯絡方式！)
    // ==========================================
    const revealContactBtn = document.getElementById('revealContactBtn');
    const contactContainer = document.getElementById('contact-container');
    if (revealContactBtn && contactContainer) {
        revealContactBtn.addEventListener('click', () => {
            // ⚠️ 這裡的內容，請您把原本的聯絡方式（Email 或電話）填寫回去！
            contactContainer.innerHTML = `
                <p style="color: var(--mist-white); font-size: 1.1rem; margin-top: 15px; animation: fadeIn 0.5s;">
                    <i class="fas fa-envelope"></i> tipsyroamingintheworld@gmail.com
                </p>
            `;
        });
    }

    // ==========================================
    // 4. 站內搜尋功能 
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
    // 5. Google 登入與狀態接聽
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
    // 6. 評論字數即時計算 
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
    // 7. 照片選擇與縮圖預覽 
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
                if ((type === 'sightseeing' || type === 'gourmet') && selectedFiles[type]) {
                    const file = selectedFiles[type];
                    const fileName = `${Date.now()}_${file.name}`;
                    const imageRef = storageRef(storage, `reviews/${type}/${fileName}`);
                    
                    const uploadResult = await uploadBytes(imageRef, file);
                    const photoUrl = await getDownloadURL(uploadResult.ref);
                    postData.imageUrl = photoUrl;
                }

                await push(ref(database, `reviews/${type}`), postData);
                
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
    // 9. 即時讀取並渲染評論
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