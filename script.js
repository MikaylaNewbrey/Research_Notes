document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("entries")) {
        loadMarkdownFiles("Notebook", "entries");
    }
    if (document.getElementById("posts-container")) {
        loadMarkdownFiles("Posts", "posts-container");
    }
});

/* ✅ Function to Load Markdown Files from GitHub ✅ */
async function loadMarkdownFiles(folder, containerId) {
    let container = document.getElementById(containerId);
    container.innerHTML = "<p>Loading...</p>"; // Show loading message

    try {
        const repoOwner = "MikaylaNewbrey";
        const repoName = "Research_Notes";
        const branch = "main";

        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folder}`);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        const files = await response.json();

        container.innerHTML = ""; // Clear loading message

        if (files.length === 0) {
            container.innerHTML = "<p>No posts found.</p>"; // Show message if empty
            return;
        }

        files.forEach(async (file) => {
            // ✅ Ignore "Template.md" files from appearing
            if (file.name.endsWith(".md") && file.name.toLowerCase() !== "template.md") {
                let contentResponse = await fetch(file.download_url);
                let markdownContent = await contentResponse.text();

                let entryDiv = document.createElement("div");
                entryDiv.classList.add("post-item");

                // Create title and clickable event for modal
                entryDiv.innerHTML = `
                    <h2 class="post-title" onclick="openPost('${file.name}', \`${markdownContent}\`)">${file.name.replace(".md", "")}</h2>
                `;

                container.appendChild(entryDiv);
            }
        });
    } catch (error) {
        console.error("Error loading Markdown files:", error);
        container.innerHTML = `<p>Error loading posts. Check console.</p>`;
    }
}

/* ✅ Lightbox Variables for Image & Video Gallery ✅ */
const mediaItems = [
    { type: 'image', src: 'images/gallery/research1.jpg' },
    { type: 'image', src: 'images/gallery/research2.jpg' },
    { type: 'video', src: 'images/gallery/fieldwork.mp4' }
];

let currentIndex = 0;

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
        lightboxVideo.style.display = "block";
        lightboxImg.style.display = "none";
    }
}

function changeMedia(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = mediaItems.length - 1;
    else if (currentIndex >= mediaItems.length) currentIndex = 0;

    openLightbox(currentIndex);
}

function closeLightbox() {
    let lightbox = document.getElementById("lightbox");
    let lightboxImg = document.getElementById("lightbox-img");
    let lightboxVideo = document.getElementById("lightbox-video");

    lightbox.style.display = "none";
    lightboxImg.src = "";
    lightboxVideo.pause();
    lightboxVideo.src = "";
}

/* ✅ Search Filter for Lab Notebook & Updates ✅ */
function filterEntries() {
    let input = document.getElementById("search").value.toLowerCase();
    let entries = document.querySelectorAll(".post-item");

    entries.forEach(entry => {
        let text = entry.innerText.toLowerCase();
        if (text.includes(input)) {
            entry.style.display = "block";
        } else {
            entry.style.display = "none";
        }
    });
}

/* ✅ Open Post in Modal Pop-Up ✅ */
function openPost(title, content) {
    let modal = document.getElementById("post-modal");
    let modalTitle = document.getElementById("modal-title");
    let modalContent = document.getElementById("modal-content");

    modalTitle.textContent = title.replace(".md", ""); // Format title
    modalContent.innerHTML = marked.parse(content); // Render markdown

    modal.style.display = "flex"; // ✅ Enlarged modal
}

function closePost() {
    document.getElementById("post-modal").style.display = "none";
}
