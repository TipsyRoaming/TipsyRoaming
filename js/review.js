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

    // ================= Auth =================
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
            signInWithPopup(auth, provider).catch(err => console.error(err));
        });

        logoutBtn.addEventListener('click', () => {
            signOut(auth);
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
                preview.innerHTML = `<img src="${ev.target.result}" style="max-width:100%;" />`;
            };
            reader.readAsDataURL(file);
        });
    });

    // ================= publish =================
    document.querySelectorAll('.publish-btn').forEach(btn => {
        btn.addEventListener('click', async () => {

            const type = btn.dataset.type;
            const input = document.getElementById(`input-${type}`);

            if (!input || !input.value.trim()) return;

            const user = getUser();
            if (!user) return alert("Please login first");

            btn.disabled = true;

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

            } catch (err) {
                console.error(err);
                alert("Publish failed");
            } finally {
                btn.disabled = false;
            }
        });
    });

    // ================= realtime & search hook =================
    ['study', 'sightseeing', 'gourmet'].forEach(type => {
        const box = document.getElementById(`display-${type}`);
        if (!box) return;

        onValue(ref(database, `reviews/${type}`), snap => {
            box.innerHTML = '';
            
            // 清除陣列中對應區塊的舊資料，準備塞入最新資料
            window.__reviews = window.__reviews.filter(item => item.category !== type);

            const data = snap.val();
            if (!data) return;

            Object.values(data)
                .sort((a, b) => b.timestamp - a.timestamp)
                .forEach(post => {
                    
                    // 同步到搜尋系統
                    window.__reviews.push({
                        content: post.text,
                        category: type,
                        link: `#${type}`
                    });

                    // 完全還原您的簡潔卡片樣式
                    const div = document.createElement('div');
                    div.style.padding = "10px";
                    div.style.margin = "10px 0";
                    div.style.background = "rgba(255,255,255,0.05)";
                    
                    const dateStr = new Date(post.timestamp).toLocaleDateString();

                    div.innerHTML = `
                        <div style="display: flex; justify-content: space-between;">
                            <strong>${post.author}</strong>
                            <small style="color: #888;">${dateStr}</small>
                        </div>
                        <div style="margin-top: 5px;">${post.text}</div>
                        ${post.imageUrl ? `<img src="${post.imageUrl}" style="max-width:100%; margin-top: 10px;">` : ''}
                    `;

                    box.appendChild(div);
                });
        });
    });
}