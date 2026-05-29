import {
    database, ref, push, onValue,
    storage, storageRef, uploadBytes, getDownloadURL,
    auth, provider, signInWithPopup, onAuthStateChanged, signOut
} from "./firebase.js";

let selectedFiles = {
    sightseeing: null,
    gourmet: null
};

function getUser() {
    return auth.currentUser;
}

export function initReview() {

    // ================= Auth Login / Logout UI =================
    const loginBtn = document.getElementById('navLoginBtn');
    const logoutBtn = document.getElementById('navLogoutBtn');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');

    if (loginBtn && logoutBtn && userProfile) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                loginBtn.style.display = 'none';
                userProfile.style.display = 'flex';
                if (userName) userName.textContent = user.displayName;
                if (userAvatar) userAvatar.src = user.photoURL;
            } else {
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

    // ================= file upload =================
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
                preview.innerHTML = `<img src="${ev.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        });
    });

    // ================= publish =================
    document.querySelectorAll('.publish-btn').forEach(btn => {
        btn.addEventListener('click', async () => {

            const type = btn.dataset.type;
            const input = document.getElementById(`input-${type}`);

            if (!input || !input.value.trim()) {
                alert("Please write something before publishing!");
                return;
            }

            const user = getUser();
            if (!user) {
                alert("Please Sign in with Google first to share your experience!");
                return;
            }

            btn.disabled = true;
            const originalText = btn.textContent;
            btn.textContent = "Publishing...";

            try {
                let imageUrl = null;

                const file = selectedFiles[type];
                if (file) {
                    const name = `${Date.now()}_${file.name}`;
                    const refPath = storageRef(storage, `reviews/${type}/${name}`);

                    const snap = await uploadBytes(refPath, file);
                    imageUrl = await getDownloadURL(snap.ref);
                }

                await push(ref(database, `reviews/${type}`), {
                    text: input.value.trim(),
                    author: user.displayName || "Anonymous",
                    uid: user.uid,
                    timestamp: Date.now(),
                    imageUrl
                });

                input.value = '';
                selectedFiles[type] = null;

                const counter = document.getElementById(`counter-${type}`);
                if (counter) counter.textContent = "0 / 300";

                const preview = document.getElementById(`preview-${type}`);
                const fileInput = document.getElementById(`file-${type}`);

                if (preview) preview.innerHTML = '';
                if (fileInput) fileInput.value = '';

                alert("Published successfully!");

            } catch (err) {
                console.error(err);
                alert("Publish failed. Check console for details.");
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    });

    // ================= realtime & search state sync =================
    ['study', 'sightseeing', 'gourmet'].forEach(type => {
        const box = document.getElementById(`display-${type}`);
        if (!box) return;

        onValue(ref(database, `reviews/${type}`), snap => {
            box.innerHTML = '';
            
            // 每次載入時，先清空舊的搜尋緩存陣列中屬於這一個類別的資料
            window.__reviews = window.__reviews.filter(item => item.category !== type);

            const data = snap.val();
            if (!data) return;

            Object.values(data)
                .sort((a, b) => b.timestamp - a.timestamp)
                .forEach(post => {
                    
                    // 1. 除錯修復：把即時留言推送到 window.__reviews，讓搜尋框找得到！
                    window.__reviews.push({
                        content: post.text,
                        category: type,
                        link: `#${type}`
                    });

                    // 2. 視覺美觀：還原帶有側邊金色線條與正確間距的卡片樣式
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
                            <strong style="color: var(--accent-gold);"><i class="fas fa-user-circle"></i> ${post.author}</strong>
                            <small style="color: #888;">${date}</small>
                        </div>
                        <p style="margin: 0; color: var(--mist-white); line-height: 1.5;">${post.text}</p>
                        ${imageHtml}
                    `;
                    box.appendChild(div);
                });
        });
    });
}