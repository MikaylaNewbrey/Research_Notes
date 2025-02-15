document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("entries")) {
        loadMarkdownFiles("Notebook", "entries");
    }
    if (document.getElementById("posts-container")) {
        loadMarkdownFiles("Posts", "posts-container");
    }
    if (document.getElementById("gallery")) {
        loadGallery();
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

                // ✅ Extract metadata from the Markdown file
                let titleMatch = markdownContent.match(/title:\s*["'](.+?)["']/);
                let dateMatch = markdownContent.match(/date:\s*["'](.+?)["']/);
                let summaryMatch = markdownContent.match(/summary:\s*["'](.+?)["']/);

                let title = titleMatch ? titleMatch[1] : file.name.replace(".md", "");
                let date = dateMatch ? dateMatch[1] : "Unknown Date";
                let summary = summaryMatch ? summaryMatch[1] : "No summary available.";

                let entryDiv = document.createElement("div");
                entryDiv.classList.add("post-item");

                // ✅ Store full content in a dataset for retrieval
                entryDiv.dataset.content = markdownContent;

                // ✅ Create modern post layout with title, date, summary, and arrow
                entryDiv.innerHTML = `
                    <h2 class="post-title">${title}</h2>
                    <p class="post-date">${date}</p>
                    <p class="post-summary">${summary}</p>
                    <span class="post-read-more">→</span>
                `;

                entryDiv.addEventListener("click", () => openPost(title, entryDiv.dataset.content));
                container.appendChild(entryDiv);
            }
        });
    } catch (error) {
        console.error("Error loading Markdown files:", error);
        container.innerHTML = `<p>Error loading posts. Check console.</p>`;
    }
}

/* ✅ Open Post in Modal Pop-Up ✅ */
function openPost(title, content) {
    let modal = document.getElementById("post-modal");
    let modalTitle = document.getElementById("modal-title");
    let modalContent = document.getElementById("modal-content");

    modalTitle.textContent = title; // ✅ Uses extracted title
    modalContent.innerHTML = marked.parse(content); // ✅ Render Markdown content

    modal.style.display = "flex"; // ✅ Ensure modal is visible
    modal.style.justifyContent = "center"; // ✅ Center modal on screen
    modal.style.alignItems = "center"; 
    modal.style.zIndex = "1000"; // ✅ Keep modal above everything
    modal.focus(); // ✅ Ensure it can be interacted with
}

/* ✅ Close Modal Pop-Up ✅ */
function closePost() {
    let modal = document.getElementById("post-modal");
    modal.style.display = "none";
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

/* ✅ Google Drive Gallery Integration ✅ */
const galleryItems = [
    { type: "image", id: "YOUR_IMAGE_FILE_ID_1" },
    { type: "image", id: "YOUR_IMAGE_FILE_ID_2" },
    { type: "video", id: "YOUR_VIDEO_FILE_ID_1" },
];

function loadGallery() {
    let imageGallery = document.getElementById("image-gallery");
    let videoGallery = document.getElementById("video-gallery");

    galleryItems.forEach((item, index) => {
        let element;
        let url = `https://drive.google.com/uc?export=view&id=${item.id}`;

        if (item.type === "image") {
            element = document.createElement("img");
            element.src = url;
            element.classList.add("gallery-item");
            element.onclick = () => openLightbox(index);
            imageGallery.appendChild(element);
        } else if (item.type === "video") {
            element = document.createElement("iframe");
            element.src = `https://drive.google.com/file/d/${item.id}/preview`;
            element.width = "640";
            element.height = "360";
            element.classList.add("gallery-item");
            videoGallery.appendChild(element);
        }
    });
}

/* ✅ Lightbox Functionality ✅ */
let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;
    let lightbox = document.getElementById("lightbox");
    let lightboxImg = document.getElementById("lightbox-img");
    let lightboxVideo = document.getElementById("lightbox-video");
    let lightboxVideoSource = document.getElementById("lightbox-video-source");

    lightbox.style.display = "flex";

    let item = galleryItems[index];
    let url = `https://drive.google.com/uc?export=view&id=${item.id}`;

    if (item.type === "image") {
        lightboxImg.src = url;
        lightboxImg.style.display = "block";
        lightboxVideo.style.display = "none";
    } else {
        lightboxVideoSource.src = `https://drive.google.com/file/d/${item.id}/preview`;
        lightboxVideo.load();
        lightboxVideo.style.display = "block";
        lightboxImg.style.display = "none";
    }
}

function changeMedia(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = galleryItems.length - 1;
    else if (currentIndex >= galleryItems.length) currentIndex = 0;

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
