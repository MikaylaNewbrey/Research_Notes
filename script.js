document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("entries")) {
        loadEntries("entries.json", "entries");
    }
    if (document.getElementById("posts")) {
        loadEntries("posts.json", "posts");
    }
});

async function loadEntries(file, containerId) {
    const response = await fetch(file);
    const entries = await response.json();

    let container = document.getElementById(containerId);
    container.innerHTML = "";

    entries.forEach(entry => {
        let div = document.createElement("div");
        div.classList.add("entry");
        div.innerHTML = `
            <h2>${entry.title}</h2>
            <p><strong>Date:</strong> ${entry.date}</p>
            <p><strong>Tags:</strong> ${entry.tags.join(", ")}</p>
            <p>${entry.content}</p>
        `;
        container.appendChild(div);
    });
}

function openLightbox(imageSrc) {
    let lightbox = document.getElementById("lightbox");
    let lightboxImg = document.getElementById("lightbox-img");

    lightbox.style.display = "flex";
    lightboxImg.src = imageSrc;
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}
