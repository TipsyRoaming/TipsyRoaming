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

export function initI18n() {
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

    const aboutContainer = document.getElementById('about-content');
    if (aboutContainer && dict.aboutContent) {
        aboutContainer.innerHTML = `
            <p>${dict.aboutContent.p1}</p>
            <p>${dict.aboutContent.p2}</p>
        `;
    }
}