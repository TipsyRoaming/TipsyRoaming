export const holidayData = {
    zh: { m1: "碧瑤花節慶典", m2: "碧瑤花節慶典", m4: "復活節聖週", m9: "碧瑤建市紀念日", m12: "聖誕佳節", default: "探索避暑之都" },
    en: { m1: "Flower Festival", m2: "Flower Festival", m4: "Holy Week", m9: "Baguio Charter Day", m12: "Christmas Season", default: "Explore Pine City" },
    ja: { m1: "バギオ・フラワーフェス", m2: "バギオ・フラワーフェス", m4: "イースター・セマナサンタ", m9: "バギオ憲章記念日", m12: "クリスマスシーズン", default: "避暑地を探索" }
};

export const translations = {
    zh: {
        nav: {
            about: "關於", study: "遊學", travel: "旅遊", contact: "聯絡", register: "註冊",
            joinUs: "加入我們", weather: "天氣", population: "人口", holidays: "假期",
            whyVisit: "為什麼造訪碧瑤？", studyTitle: "在碧瑤學習英語", publish: "發佈",
            travelTitle: "碧瑤旅遊", sightseeing: "熱門景點", gourmet: "在地美食",
            registerTitle: "註冊", createAccount: "建立帳戶", contactTitle: "與我們聯絡",
            revealContact: "顯示聯絡資訊"
        },
        placeholder: { review: "撰寫評價...", sightseeing: "分享景點心得...", gourmet: "分享美食心得..." },
        about: [
            '漫步在海拔一千五百公尺的碧瑤，空氣中總氤氳著淡淡的松香與薄霧。這裡沒有馬尼拉的酷熱與喧囂，取而代之的是四季如春的清爽。',
            '這裡的「慢」，是有靈魂的。你可以在伯納姆公園划船看夕陽，或在瀰漫藝術氣息的文藝餐廳裡，佐著山城微涼的風讀一本書。對於遊學者而言，這裡的人情味如溫潤的松樹般親切，在學習與漫遊的驚奇旅遊中，心靈總能於這座「夏之都」找到最安穩的棲息。這不僅是一次異地停留，更是一場在雲端上的自我對話。'
        ]
    },
    ja: {
        nav: {
            about: "概要", study: "留学", travel: "観光", contact: "連絡", register: "登録",
            joinUs: "参加する", weather: "天気", population: "人口", holidays: "祝日",
            whyVisit: "なぜバギオを訪れるのか？", studyTitle: "バギオで英語を学ぶ", publish: "公開",
            travelTitle: "バギオの観光", sightseeing: "人気の観光スポット", gourmet: "絶品グルメ",
            registerTitle: "登録", createAccount: "登録する", contactTitle: "お問い合わせ",
            revealContact: "連絡先を表示する"
        },
        placeholder: { review: "レビューを書く...", sightseeing: "観光の感想を共有...", gourmet: "グルメの感想を共有..." },
        about: [
            '標高1,500メートルのバギオを散策すれば、空気の中にはいつもほのかな松の香りと薄霧が漂っています。マニラの酷暑や喧騒とは無縁の、まるで一年中春のような爽やかさがここにはあります。',
            'この街の「ゆったりとした時間」には、魂が宿っています。バーナム公園で夕日を眺めながらボートを漕いだり、芸術的な香りが漂うレストランで、山城の涼やかな風を感じながら一冊の本を読み耽ったり。留学生にとって、人々の温かさは穏やかな松の木のように親しみ深く、学びと放浪の「オデッセイ」の中で、この「夏の首都」はいつも心に安らぎを与えてくれます。これは単なる異国での滞在ではなく、雲の上で行われる自分自身との対話なのです。'
        ]
    },
    en: {
        nav: {
            about: "About", study: "Study", travel: "Travel", contact: "Connect", register: "Register",
            joinUs: "Join Us", weather: "Weather", population: "Population", holidays: "Holidays",
            whyVisit: "Why Visit Baguio?", studyTitle: "Study English in Baguio", publish: "Publish",
            travelTitle: "Travel in Baguio", sightseeing: "Sightseeing", gourmet: "Gourmet",
            registerTitle: "Register", createAccount: "Create Account", contactTitle: "Connect With Us",
            revealContact: "Reveal Contact Info"
        },
        placeholder: { review: "Write review...", sightseeing: "Share sightseeing tips...", gourmet: "Share food reviews..." },
        about: [
            'Strolling through Baguio at an altitude of 1,500 meters, the air is ever-infused with a delicate scent of pine and gentle mist. Gone is the sweltering heat and clamor of Manila, replaced by a refreshing crispness that feels like perpetual spring.',
            'The "slowness" here possesses a soul of its own. You might find yourself rowing across Burnham Park Lake under a setting sun, or lost in a book at an artistic bistro, accompanied by the cool mountain breeze. For students and seekers, the local warmth is as comforting as the sturdy pines. Within this odyssey of learning and roaming, one always finds the most tranquil sanctuary in the "Summer Capital." It is more than just a stay in a foreign land; it is a profound dialogue with oneself above the clouds.'
        ]
    }
};

export function renderAbout(lang) {
    const area = document.getElementById('about-content');
    area.replaceChildren();
    translations[lang].about.forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        area.appendChild(p);
    });
}

export function updateDynamicInfo(lang) {
    const month = new Date().getMonth() + 1;
    const holidayKey = `m${month}`;
    const holidayText = holidayData[lang][holidayKey] || holidayData[lang].default;
    document.getElementById('baguio-holiday').textContent = holidayText;
}

export function setLang(lang) {
    document.querySelectorAll('[data-i18n-nav]').forEach(el => { 
        el.textContent = translations[lang].nav[el.dataset.i18nNav]; 
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { 
        el.placeholder = translations[lang].placeholder[el.dataset.i18nPlaceholder]; 
    });
    document.documentElement.lang = lang;
    renderAbout(lang);
    updateDynamicInfo(lang);
}