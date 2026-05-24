import { setLang } from "./i18n.js";
import { fetchWeather } from "./weather.js";
import { saveReview, listenReviews } from "./reviews.js";
import { setupSearch } from "./search.js";
import { setupUI } from "./ui.js";

/* ===== 狀態管理 ===== */
let currentLang = "en";

// O(n) 記憶體優化：分開儲存各板塊留言，避免無窮迴圈疊加
const reviewsMemory = { study: [], sightseeing: [], gourmet: [] };

/* ===== 核心初始化 ===== */
document.addEventListener("DOMContentLoaded", async () => {

    /* 1. 基礎 UI 與追蹤 */
    setupUI();

    /* 2. 語系切換綁定與初次渲染 */
    setLang(currentLang);
    document.getElementById('langSelect').addEventListener('change', function() { 
        currentLang = this.value;
        setLang(currentLang); 
    });
    document.getElementById('navJoinUsBtn').addEventListener('click', () => window.location.href = '#register');

    /* 3. 載入天氣 API */
    const temp = await fetchWeather();
    if (temp !== null) {
        document.getElementById("baguio-weather").textContent = `${temp}°C | Baguio`;
    }

    /* 4. 啟動 Firebase 留言板讀取監聽 */
    ['study', 'sightseeing', 'gourmet'].forEach(type => {
        listenReviews(type, (category, data) => {
            reviewsMemory[category] = data; // 更新該分類的記憶庫
        });
    });

    /* 5. 綁定發佈按鈕 */
    document.querySelectorAll('.publish-btn').forEach(btn => {
        btn.addEventListener('click', function(e) { 
            saveReview(btn.dataset.type, btn, currentLang); 
        });
    });

    /* 6. 啟動即時搜尋器 (透過回呼函式動態攤平取得最新的留言陣列) */
    setupSearch(
        document.getElementById('searchInput'),
        document.getElementById('searchResults'),
        () => Object.values(reviewsMemory).flat() 
    );
});