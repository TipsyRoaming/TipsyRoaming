import {
    database,
    ref,
    push,
    onValue,
    storage,
    storageRef,
    uploadBytes,
    getDownloadURL,
    auth
} from "./firebase.js";

let selectedFiles = {
    sightseeing: null,
    gourmet: null
};

function getUser() {
    return auth.currentUser;
}

export function initReview() {

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
            if (!user) return alert("Please login");

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

    // ================= realtime =================
    ['study', 'sightseeing', 'gourmet'].forEach(type => {
        const box = document.getElementById(`display-${type}`);
        if (!box) return;

        onValue(ref(database, `reviews/${type}`), snap => {
            box.innerHTML = '';

            const data = snap.val();
            if (!data) return;

            Object.values(data)
                .sort((a, b) => b.timestamp - a.timestamp)
                .forEach(post => {

                    const div = document.createElement('div');
                    div.style.padding = "10px";
                    div.style.margin = "10px 0";
                    div.style.background = "rgba(255,255,255,0.05)";

                    div.innerHTML = `
                        <strong>${post.author}</strong>
                        <div>${post.text}</div>
                        ${post.imageUrl ? `<img src="${post.imageUrl}" style="max-width:100%;">` : ''}
                    `;

                    box.appendChild(div);
                });
        });
    });
}