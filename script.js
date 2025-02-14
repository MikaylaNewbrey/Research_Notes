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

/* Lightbox Variables */
const mediaItems = [
    { type: 'image', src: 'images/gallery/research1.jpg' },
    { type: 'image', src: 'images/gallery/research2.jpg' },
    { type: 'video', src: 'images/gallery/fieldwork.mp4' }
];

let currentIndex = 0;

/* Open Lightbox */
function openLightbox(index) {
    currentIndex = index;
    let lightbox = document.getElementById("lightbox");
    let lightboxImg = document.getElementById("lightbox-img");
    let lightboxVideo = document.getElementById("lightbox-video");
    let lightboxVideoSource = document.getElementById("lightbox-video-source");

    lightbox.style.display = "flex";

    if (mediaItems[index].type === 'image') {
        lightboxImg.src = mediaItems[index].src;
        lightboxImg.style.display = "block";
        lightboxVideo.style.display = "none";
    } else {
        lightboxVideoSource.src = mediaItems[index].src;
        lightboxVideo.load();
        lightboxVideo.play();
        lightboxVideo.style.display = "block";
        lightboxImg.style.display = "none";
    }
}

/* Change Image/Video in Lightbox */
function changeMedia(direction) {
    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = mediaItems.length - 1;
    } else if (currentIndex >= mediaItems.length) {
        currentIndex = 0;
    }

    openLightbox(currentIndex);
}

/* Close Lightbox */
function closeLightbox() {
    let lightbox = document.getElementById("lightbox");
    let lightboxImg = document.getElementById("lightbox-img");
    let lightboxVideo = document.getElementById("lightbox-video");

    lightbox.style.display = "none";
    lightboxImg.src = "";
    lightboxVideo.pause();
    lightboxVideo.src = "";
}
