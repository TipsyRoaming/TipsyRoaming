import { db, auth, authReady, ref, push, onValue } from "./firebase.js";

function triggerSuccessUI(btn) {
    const originalText = btn.textContent;
    btn.textContent = "Success!";
    btn.classList.add('success');
    setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('success');
        startCooldown(btn);
    }, 1500);
}

function startCooldown(button) {
    let cooldownTime = 10; 
    button.disabled = true;
    const originalText = button.textContent;
    const timer = setInterval(() => {
        cooldownTime--;
        button.textContent = `${cooldownTime}s`;
        if (cooldownTime <= 0) {
            clearInterval(timer);
            button.disabled = false;
            button.textContent = originalText;
        }
    }, 1000);
}

export async function saveReview(type, btn, currentLang) {
    try {
        await authReady; // 等待匿名登入完成
        if (!auth.currentUser) throw new Error("Not authenticated");
    } catch {
        return alert("System initializing secure connection. Please try again in 2 seconds.");
    }

    const contentInput = document.getElementById(`input-${type}`);
    const rawContent = contentInput.value;
    
    if(!rawContent.trim()) return alert("Please enter some text.");
    const safeContent = rawContent.trim().slice(0, 300);
    
    const dbRef = ref(db, `reviews/${type}`);
    push(dbRef, {
        content: safeContent,
        lang: currentLang,
        timestamp: Date.now()
    }).then(() => {
        contentInput.value = ""; 
        document.getElementById(`counter-${type}`).textContent = "0 / 300";
        triggerSuccessUI(btn); 
    }).catch((error) => {
        alert("Error saving review: " + error.message);
    });
}