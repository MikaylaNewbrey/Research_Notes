document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("entries")) {
        loadMarkdownFiles("Notebook", "entries");
    }
    if (document.getElementById("posts-container")) {
        loadMarkdownFiles("Posts", "posts-container");
    }
    if (document.getElementById("gallery")) {
        fetchGalleryImages(); // ✅ Auto-fetch images from Google Drive
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
            if (file.name.endsWith(".md") && file.name.toLowerCase() !== "template.md") {
                let contentResponse = await fetch(file.download_url);
                let markdownContent = await contentResponse.text();

                let titleMatch = markdownContent.match(/title:\s*["'](.+?)["']/);
                let dateMatch = markdownContent.match(/date:\s*["'](.+?)["']/);
                let summaryMatch = markdownContent.match(/summary:\s*["'](.+?)["']/);

                let title = titleMatch ? titleMatch[1] : file.name.replace(".md", "");
                let date = dateMatch ? dateMatch[1] : "Unknown Date";
                let summary = summaryMatch ? summaryMatch[1] : "No summary available.";

                let entryDiv = document.createElement("div");
                entryDiv.classList.add("post-item");

                entryDiv.dataset.content = markdownContent;

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

    modalTitle.textContent = title;
    modalContent.innerHTML = marked.parse(content);

    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center"; 
    modal.style.zIndex = "1000";
    modal.focus();
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

/* ✅ Google Drive Gallery Integration - Auto Fetch ✅ */
const driveFolderId = "1umgZLdQFNL-IxmPrPKO5uR9cEDFZ6TdA"; // Your Google Drive folder ID
const apiKey = "AIzaSyCUv2_rp9yVAPBfwJpkzEyvYwwbMJkB_Ts"; // Replace this with your actual API Key

async function fetchGalleryImages() {
    let galleryContainer = document.getElementById("gallery");

    try {
        const response = await fetch(`https://www.googleapis.com/drive/v3/files?q='${driveFolderId}'+in+parents&key=${apiKey}`);
        const data = await response.json();

        if (!data.files) {
            galleryContainer.innerHTML = "<p>No images found.</p>";
            return;
        }

        data.files.forEach((file, index) => {
            let url = `https://drive.google.com/uc?export=view&id=${file.id}`;
            let element = document.createElement("img");
            element.src = url;
            element.alt = file.name;
            element.classList.add("gallery-item");
            element.onclick = () => openLightbox(index);
            galleryContainer.appendChild(element);
        });
    } catch (error) {
        console.error("Error fetching images:", error);
        galleryContainer.innerHTML = "<p>Error loading gallery.</p>";
    }
}

document.addEventListener("DOMContentLoaded", fetchGalleryImages);

/* ✅ Lightbox Functionality ✅ */
let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;
    let lightbox = document.getElementById("lightbox");
    let lightboxImg = document.getElementById("lightbox-img");

    let item = galleryItems[index];
    let url = `https://drive.google.com/uc?export=view&id=${item.id}`;

    lightboxImg.src = url;
    lightbox.style.display = "flex";
}

function closeLightbox() {
    let lightbox = document.getElementById("lightbox");
    let lightboxImg = document.getElementById("lightbox-img");

    lightbox.style.display = "none";
    lightboxImg.src = "";
}
