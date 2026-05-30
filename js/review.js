import {
    database, ref, push, onValue,
    storage, storageRef, uploadBytes, getDownloadURL
} from "./firebase.js";

let selectedFiles = {
    sightseeing: null,
    gourmet: null
};

export function initReview() {

    // ================= 檔案上傳預覽功能 =================
    ['sightseeing', 'gourmet'].forEach(type => {
        const input = document.getElementById(`file-${type}`);
        const preview = document.getElementById(`preview-${type}`);

        if (!input || !preview) return;

        input.addEventListener('change', e => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (file.size > 5 * 1024 * 1024) {
                alert("Image too large (max 5MB)");
                input.value = '';
                return;
            }

            selectedFiles[type] = file;

            const reader = new FileReader();
            reader.onload = ev => {
                preview.innerHTML = `<img src="${ev.target.result}" style="max-width:100%; border-radius: 4px; margin-top: 10px;" />`;
            };
            reader.readAsDataURL(file);
        });
    });

    // ================= 發布留言功能 (免登入版) =================
    document.querySelectorAll('.publish-btn').forEach(btn => {
        btn.addEventListener('click', async () => {

            const type = btn.dataset.type;
            const input = document.getElementById(`input-${type}`);
            
            // 抓取您在 index.html 新增的姓名輸入框 (如果沒找到或沒填，預設為 Anonymous)
            const nameInput = document.getElementById(`guest-name-${type}`);
            let guestName = nameInput && nameInput.value.trim() !== "" ? nameInput.value.trim() : "Anonymous";

            if (!input || !input.value.trim()) {
                alert("Please write something before publishing!");
                return;
            }

            btn.disabled = true;
            const originalText = btn.textContent;
            btn.textContent = "Publishing...";

            try {
                let imageUrl = null;
                const file = selectedFiles[type];
                
                // 如果有選擇圖片，先上傳到 Storage 取得網址
                if (file) {
                    const name = `${Date.now()}_${file.name}`;
                    const refPath = storageRef(storage, `reviews/${type}/${name}`);
                    const snap = await uploadBytes(refPath, file);
                    imageUrl = await getDownloadURL(snap.ref);
                }

                // 抓取目前的語系 (確保符合 JSON 規則的 'en', 'zh', 'ja')
                const langSelect = document.getElementById('langSelect');
                let currentLang = langSelect ? langSelect.value : "en";
                if (!['en', 'zh', 'ja'].includes(currentLang)) {
                    currentLang = 'en';
                }

                // 準備上傳到資料庫的資料 (欄位名稱必須與 JSON 規則一模一樣)
                const reviewData = {
                    content: input.value.trim(),
                    author: guestName,
                    lang: currentLang,
                    timestamp: Date.now()
                };

                // 如果有圖片才加入 imageUrl 屬性
                if (imageUrl) {
                    reviewData.imageUrl = imageUrl;
                }

                // 推送資料到 Firebase Realtime Database
                await push(ref(database, `reviews/${type}`), reviewData);

                // 發布成功後清空表單
                input.value = '';
                if (nameInput) nameInput.value = '';
                selectedFiles[type] = null;

                const counter = document.getElementById(`counter-${type}`);
                if (counter) counter.textContent = "0 / 300";

                const preview = document.getElementById(`preview-${type}`);
                const fileInput = document.getElementById(`file-${type}`);

                if (preview) preview.innerHTML = '';
                if (fileInput) fileInput.value = '';

                alert("Published successfully!");

            } catch (err) {
                console.error("Publish failed:", err);
                alert("Publish failed. Please check console for details.");
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    });

    // ================= 即時載入留言與搜尋同步 =================
    ['study', 'sightseeing', 'gourmet'].forEach(type => {
        const box = document.getElementById(`display-${type}`);
        if (!box) return;

        onValue(ref(database, `reviews/${type}`), snap => {
            box.innerHTML = '';
            
            // 清除陣列中舊資料，準備塞入最新資料給搜尋框使用
            window.__reviews = window.__reviews.filter(item => item.category !== type);

            const data = snap.val();
            if (!data) return;

            Object.values(data)
                .sort((a, b) => b.timestamp - a.timestamp)
                .forEach(post => {
                    
                    // 同步到搜尋系統 (注意這裡改成 post.content)
                    window.__reviews.push({
                        content: post.content, 
                        category: type,
                        link: `#${type}`
                    });

                    // 建立精美的留言卡片
                    const div = document.createElement('div');
                    div.className = 'review-card';
                    div.style.cssText = 'background: rgba(255,255,255,0.05); padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid var(--accent-gold);';
                    
                    const dateStr = new Date(post.timestamp).toLocaleDateString();

                    div.innerHTML = `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <strong style="color: var(--accent-gold); font-size: 1.1em;">
                                <i class="fas fa-user"></i> ${post.author}
                            </strong>
                            <small style="color: #888;">${dateStr}</small>
                        </div>
                        <div style="color: var(--mist-white); line-height: 1.5; margin-top: 5px; white-space: pre-wrap;">${post.content}</div>
                        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Photo" style="max-width:100%; max-height:250px; border-radius: 4px; margin-top: 10px; border: 1px solid #444;">` : ''}
                    `;

                    box.appendChild(div);
                });
        });
    });
}