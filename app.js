import { setupUI } from './ui.js';
import { setupI18n } from './i18n.js';
import { 
    database, ref, push, onValue, 
    auth, provider, signInWithPopup, onAuthStateChanged, signOut,
    storage, storageRef, uploadBytes, getDownloadURL 
} from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化原有的 UI 與多國語系
    setupUI();
    setupI18n();

    // 2. 處理 Google 登入與登出狀態
    const loginBtn = document.getElementById('navLoginBtn');
    const logoutBtn = document.getElementById('navLogoutBtn');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');

    let currentUser = null; // 記錄當前登入者

    // 監聽登入狀態改變
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            loginBtn.style.display = 'none';
            userProfile.style.display = 'flex';
            userName.textContent = user.displayName;
            userAvatar.src = user.photoURL;
        } else {
            currentUser = null;
            loginBtn.style.display = 'inline-block';
            userProfile.style.display = 'none';
        }
    });

    // 綁定登入按鈕
    loginBtn.addEventListener('click', () => {
        signInWithPopup(auth, provider).catch((error) => {
            console.error("Login failed:", error);
            alert("Login failed, please try again.");
        });
    });

    // 綁定登出按鈕
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            alert("You have been logged out.");
        });
    });

    // 3. 處理照片選擇與預覽 (目前針對 Study 區塊)
    let selectedFile = null;
    const fileInput = document.getElementById('file-study');
    const previewContainer = document.getElementById('preview-study');

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // 簡單的檔案大小限制 (限制 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File is too large! Please choose an image under 5MB.");
                fileInput.value = '';
                return;
            }

            selectedFile = file;
            
            // 產生預覽圖
            const reader = new FileReader();
            reader.onload = (e) => {
                previewContainer.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        });
    }

    // 4. 攔截 Publish 按鈕，執行上傳與資料庫寫入
    document.querySelectorAll('.publish-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const type = btn.getAttribute('data-type');
            const inputField = document.getElementById(`input-${type}`);
            const textContent = inputField.value.trim();

            if (!textContent) {
                alert("Please write something before publishing!");
                return;
            }

            // 強制必須登入才能留言
            if (!currentUser) {
                alert("Please Sign in with Google first to share your experience!");
                return;
            }

            // 準備要寫入資料庫的包裹
            const postData = {
                text: textContent,
                author: currentUser.displayName,
                uid: currentUser.uid,
                timestamp: new Date().toISOString(),
                imageUrl: null // 預設沒有圖片
            };

            btn.disabled = true;
            btn.textContent = "Publishing...";

            try {
                // 如果是 Study 區塊且有選擇照片，先上傳到 Storage
                if (type === 'study' && selectedFile) {
                    // 建立一個獨一無二的檔案名稱避免覆蓋
                    const fileName = `${Date.now()}_${selectedFile.name}`;
                    const imageRef = storageRef(storage, `reviews/${type}/${fileName}`);
                    
                    // 執行上傳
                    const uploadResult = await uploadBytes(imageRef, selectedFile);
                    // 取得照片的公開下載網址
                    const photoUrl = await getDownloadURL(uploadResult.ref);
                    postData.imageUrl = photoUrl;
                }

                // 將文字與照片網址一起寫入 Database
                await push(ref(database, `reviews/${type}`), postData);
                
                // 清空輸入框與預覽
                inputField.value = '';
                document.getElementById(`counter-${type}`).textContent = '0 / 300';
                if (type === 'study') {
                    selectedFile = null;
                    if (fileInput) fileInput.value = '';
                    previewContainer.innerHTML = '';
                }
                
                alert("Published successfully!");
            } catch (error) {
                console.error("Error publishing:", error);
                alert("Failed to publish. Check console for details.");
            } finally {
                btn.disabled = false;
                btn.textContent = "Publish";
            }
        });
    });

    // 5. 即時讀取並顯示留言 (包含圖片顯示邏輯)
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
                    
                    // 格式化時間
                    const date = new Date(post.timestamp).toLocaleDateString();
                    
                    // 組合 HTML，如果有圖片網址就顯示圖片
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