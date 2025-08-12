const apiUrl = "https://sheetdb.io/api/v1/ryfrpvo1jz2sp";
const commentsDiv = document.getElementById("comments");
const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("commentInput");
const warningOverlay = document.getElementById("warningOverlay");
const overlayContent = warningOverlay.querySelector(".overlay-content");
const acceptBtn = document.getElementById("acceptBtn");
const declineBtn = document.getElementById("declineBtn");

const colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Pink", "Orange", "Cyan", "Magenta"];
const animals = ["Cat", "Dog", "Fox", "Rabbit", "Panda", "Bear", "Koala", "Owl", "Wolf", "Tiger"];

function generateNickname() {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const number = Math.floor(Math.random() * 1001);
    return `${color}${animal}${number}`;
}

function getFormattedDate() {
    const d = new Date();
    let day = String(d.getDate()).padStart(2, '0');
    let month = String(d.getMonth() + 1).padStart(2, '0');
    let year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

async function loadComments() {
    commentsDiv.innerHTML = "<p>Loading comments...</p>";
    try {
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (data.length === 0) {
            commentsDiv.innerHTML = "<p>No comments yet. Be the first!</p>";
            return;
        }

        commentsDiv.innerHTML = "";
        data.reverse().forEach(c => {
            const el = document.createElement("div");
            el.className = "comment";
            el.innerHTML = `<strong>${c.user}</strong> <em>(${c.date})</em><br>${c.comment}`;
            commentsDiv.appendChild(el);
        });
    } catch (err) {
        commentsDiv.innerHTML = "<p>Error loading comments.</p>";
    }
}

commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newComment = {
        user: generateNickname(),
        comment: commentInput.value.trim(),
        date: getFormattedDate()
    };

    try {
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: [newComment] })
        });
        commentInput.value = "";
        loadComments();
    } catch (err) {
        alert("Error sending comment.");
    }
});

function showUI() {
    document.body.classList.remove("hidden");
}

acceptBtn.addEventListener("click", () => {
    overlayContent.classList.remove("animate-in");
    overlayContent.classList.add("animate-out");
    setTimeout(() => {
        warningOverlay.style.display = "none";
        showUI();
        loadComments();
    }, 600);
});

declineBtn.addEventListener("click", () => {
    overlayContent.classList.remove("animate-in");
    overlayContent.classList.add("animate-out");
    setTimeout(() => {
        warningOverlay.style.display = "none";
        showUI();
        commentsDiv.innerHTML = "<p>Comments are hidden.</p>";
    }, 600);
});
