document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("entries")) {
        loadMarkdownFiles("Notebook", "entries");
    }
    if (document.getElementById("posts")) {
        loadMarkdownFiles("Posts", "posts");
    }
});

/* ✅ Function to Load Markdown Files from GitHub ✅ */
async function loadMarkdownFiles(folder, containerId) {
    let container = document.getElementById(containerId);
    container.innerHTML = "";

    try {
        // Fetch file list from GitHub API
        const repoOwner = "MikaylaNewbrey";
        const repoName = "Research_Notes";
        const branch = "main";

        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folder}`);
        const files = await response.json();

        for (let file of files) {
            if (file.name.endsWith(".md")) {
                let contentResponse = await fetch(file.download_url);
                let markdownContent = await contentResponse.text();

                let entryDiv = document.createElement("div");
                entryDiv.classList.add("entry");

                entryDiv.innerHTML = `
                    <h2>${file.name.replace(".md", "")}</h2>
                    <div class="markdown-content">${marked.parse(markdownContent)}</div>
                `;

                container.appendChild(entryDiv);
            }
        }
    } catch (error) {
        console.error("Error loading Markdown files:", error);
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
        lightboxVideo.play(); // ✅ Auto-play video when opened
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
function filterEntries() {
    let input = document.getElementById("search").value.toLowerCase();
    let entries = document.querySelectorAll(".entry");

    entries.forEach(entry => {
        let text = entry.innerText.toLowerCase();
        if (text.includes(input)) {
            entry.style.display = "block";
        } else {
            entry.style.display = "none";
        }
    });
}
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("posts-container")) {
        loadPosts();
    }
});

async function loadPosts() {
    const response = await fetch("posts.json"); // Fetch posts
    const posts = await response.json();

    let container = document.getElementById("posts-container");
    container.innerHTML = "";

    posts.forEach((post, index) => {
        let postDiv = document.createElement("div");
        postDiv.classList.add("post-item");
        postDiv.innerHTML = `
            <h2 class="post-title" onclick="openPost(${index})">${post.title}</h2>
            <p class="post-date">${post.date}</p>
        `;
        container.appendChild(postDiv);
    });

    // Store posts in a variable for modal usage
    window.postsData = posts;
}

function openPost(index) {
    let modal = document.getElementById("post-modal");
    let title = document.getElementById("modal-title");
    let date = document.getElementById("modal-date");
    let content = document.getElementById("modal-content");

    title.textContent = window.postsData[index].title;
    date.textContent = `Date: ${window.postsData[index].date}`;
    content.innerHTML = marked.parse(window.postsData[index].content); // Render markdown

    modal.style.display = "block";
}

function closePost() {
    document.getElementById("post-modal").style.display = "none";
}
