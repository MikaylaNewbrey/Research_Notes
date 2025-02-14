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

/* Lightbox for Images */
function openLightbox(imageSrc) {
    let lightbox = document.getElementById("lightbox");
    let lightboxImg = document.getElementById("lightbox-img");
    let lightboxVideo = document.getElementById("lightbox-video");

    lightbox.style.display = "flex";
    lightboxImg.src = imageSrc;
    lightboxImg.style.display = "block";
    lightboxVideo.style.display = "none";
}

/* Lightbox for Videos */
function openLightboxVideo(videoSrc) {
    let lightbox = document.getElementById("lightbox");
    let lightboxImg = document.getElementById("lightbox-img");
    let lightboxVideo = document.getElementById("lightbox-video");
    let lightboxVideoSource = document.getElementById("lightbox-video-source");

    lightbox.style.display = "flex";
    lightboxVideoSource.src = videoSrc;
    lightboxVideo.load(); // Refresh video source
    lightboxVideo.play(); // Auto-play video
    lightboxVideo.style.display = "block";
    lightboxImg.style.display = "none";
}

/* Close Lightbox */
function closeLightbox() {
    let lightbox = document.getElementById("lightbox");
    let lightboxImg = document.getElementById("lightbox-img");
    let lightboxVideo = document.getElementById("lightbox-video");

    lightbox.style.display = "none";
    lightboxImg.src = "";
    lightboxVideo.pause(); // Stop video playback
    lightboxVideo.src = ""; // Reset video source
}
