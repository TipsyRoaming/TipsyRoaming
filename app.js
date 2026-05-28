import { setupUI } from './ui.js';
import { setupI18n } from './i18n.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    // 🛡️ 【安全防禦第一層】優先啟動基本網頁功能
    // 確保無論雲端發生什麼事，語言切換與聯絡按鈕 100% 正常運作
    try {
        setupUI();
        setupI18n();
        console.log("Basic UI and Language services initialized successfully.");
    } catch (uiError) {
        console.error("UI Initialization failed:", uiError);
    }

    // 🛡️ 【安全防禦第二層】將高風險的 Firebase 隔離在獨立區塊
    try {
        // 使用動態引入，防止 Firebase 錯誤導致整支程式在評估階段就卡死
        const firebaseModule = await import('./firebase.js');
        const { 
            database, ref, push, onValue, 
            auth, provider, signInWithPopup, onAuthStateChanged, signOut,
            storage, storageRef, uploadBytes, getDownloadURL 
        } = firebaseModule;

        // 2. 處理 Google 登入與登出狀態
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
                    alert("Login failed. Please check your Firebase settings or network.");
                });
            });

            logoutBtn.addEventListener('click', () => {
                signOut(auth).then(() => alert("You have been logged out."));
            });
        }

        // 3. 處理照片選擇與預覽 (專屬 Sightseeing 與 Gourmet 區塊)
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

        // 4. 攔截 Publish 按鈕，執行上傳與資料庫寫入
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
                    // 觀光或美食區若有選擇照片，則執行雲端上傳
                    if ((type === 'sightseeing' || type === 'gourmet') && selectedFiles[type]) {
                        const file = selectedFiles[type];
                        const fileName = `${Date.now()}_${file.name}`;
                        const imageRef = storageRef(storage, `reviews/${type}/${fileName}`);
                        
                        const uploadResult = await uploadBytes(imageRef, file);
                        const photoUrl = await getDownloadURL(uploadResult.ref);
                        postData.imageUrl = photoUrl;
                    }

                    // 寫入 Database
                    await push(ref(database, `reviews/${type}`), postData);
                    
                    // 恢復輸入框原狀
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
                    alert("Failed to publish to cloud. Please try again.");
                } finally {
                    btn.disabled = false;
                    btn.textContent = originalText;
                }
            });
        });

        // 5. 即時讀取並顯示雲端留言
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

    } catch (firebaseError) {
        // 即使這裡報錯，導覽列、語言包、聯絡資訊也完全不會受到任何波及
        console.warn("Cloud features temporary unvailable. Check config:", firebaseError);
    }
});