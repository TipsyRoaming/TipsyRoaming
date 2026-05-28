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

export function setupI18n() {
    const langSelect = document.getElementById('langSelect');
    if (!langSelect) return;

    // 綁定下拉選單的切換事件
    langSelect.addEventListener('change', (e) => {
        updateLanguage(e.target.value);
    });
}

function updateLanguage(lang) {
    const dict = translations[lang] || translations['en'];

    // 1. 更新導覽列與標題
    document.querySelectorAll('.lang-text').forEach(el => {
        const key = el.getAttribute('data-i18n-nav');
        if (key && dict.nav[key]) {
            el.textContent = dict.nav[key];
        }
    });

    // 2. 更新輸入框的背景提示文字 (Placeholder)
    document.querySelectorAll('.lang-placeholder').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key && dict.placeholder[key]) {
            el.setAttribute('placeholder', dict.placeholder[key]);
        }
    });
}
}