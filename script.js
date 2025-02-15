/*******************************************
 * 1. Load Notebook & Posts from GitHub
 *******************************************/
document.addEventListener("DOMContentLoaded", function () {
  // Load lab notebook entries
  if (document.getElementById("entries")) {
    loadMarkdownFiles("Notebook", "entries");
  }
  // Load posts
  if (document.getElementById("posts-container")) {
    loadMarkdownFiles("Posts", "posts-container");
  }
  // Load gallery
  if (document.getElementById("image-gallery") || document.getElementById("video-gallery")) {
    loadGallery();
  }
});

/* ✅ Function to Load Markdown Files from GitHub ✅ */
async function loadMarkdownFiles(folder, containerId) {
  let container = document.getElementById(containerId);
  container.innerHTML = "<p>Loading...</p>";

  try {
    const repoOwner = "MikaylaNewbrey";
    const repoName = "Research_Notes";
    const branch = "main";

    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folder}`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    const files = await response.json();

    container.innerHTML = "";

    if (files.length === 0) {
      container.innerHTML = "<p>No posts found.</p>";
      return;
    }

    for (const file of files) {
      if (file.name.endsWith(".md") && file.name.toLowerCase() !== "template.md") {
        const contentResponse = await fetch(file.download_url);
        const markdownContent = await contentResponse.text();

        // Extract metadata
        let titleMatch = markdownContent.match(/title:\s*["'](.+?)["']/);
        let dateMatch = markdownContent.match(/date:\s*["'](.+?)["']/);
        let summaryMatch = markdownContent.match(/summary:\s*["'](.+?)["']/);

        let title = titleMatch ? titleMatch[1] : file.name.replace(".md", "");
        let date = dateMatch ? dateMatch[1] : "Unknown Date";
        let summary = summaryMatch ? summaryMatch[1] : "No summary available.";

        // Create post item
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
    }
  } catch (error) {
    console.error("Error loading Markdown files:", error);
    container.innerHTML = `<p>Error loading posts. Check console.</p>`;
  }
}

/*******************************************
 * 2. Modal for Posts
 *******************************************/
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

// Close Post Modal
function closePost() {
  let modal = document.getElementById("post-modal");
  modal.style.display = "none";
}

/*******************************************
 * 3. Search Filter
 *******************************************/
function filterEntries() {
  let input = document.getElementById("search").value.toLowerCase();
  let entries = document.querySelectorAll(".post-item");

  entries.forEach(entry => {
    let text = entry.innerText.toLowerCase();
    entry.style.display = text.includes(input) ? "block" : "none";
  });
}

/*******************************************
 * 4. Gallery (Google Drive)
 *******************************************/
const galleryItems = [
  { type: "image", id: "1o-cMnKZoqqr25Wjj6HUqjnX-9F-SCxFW", name: "Remus_Wellfleet" },
  { type: "image", id: "YOUR_SECOND_IMAGE_ID", name: "Another Image" },
  { type: "video", id: "YOUR_VIDEO_FILE_ID", name: "Research Video" }
];

let currentIndex = 0;

function loadGallery() {
  let imageGallery = document.getElementById("image-gallery");
  let videoGallery = document.getElementById("video-gallery");

  galleryItems.forEach((item, index) => {
    let element;
    let url = `https://drive.google.com/uc?export=view&id=${item.id}`;

    if (item.type === "image") {
      element = document.createElement("img");
      element.src = url;
      element.alt = item.name;
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

/*******************************************
 * 5. Lightbox Functionality
 *******************************************/
function openLightbox(index) {
  currentIndex = index;
  let lightbox = document.getElementById("lightbox");
  let lightboxImg = document.getElementById("lightbox-img");
  let lightboxVideo = document.getElementById("lightbox-video");

  let item = galleryItems[currentIndex];
  let url = `https://drive.google.com/uc?export=view&id=${item.id}`;

  if (item.type === "image") {
    lightboxImg.src = url;
    lightboxImg.style.display = "block";
    lightboxVideo.style.display = "none";
  } else {
    lightboxVideo.src = `https://drive.google.com/file/d/${item.id}/preview`;
    lightboxVideo.style.display = "block";
    lightboxImg.style.display = "none";
  }

  lightbox.style.display = "flex";
}

// Next/Prev image navigation
function changeMedia(direction) {
  currentIndex += direction;
  if (currentIndex < 0) currentIndex = galleryItems.length - 1;
  else if (currentIndex >= galleryItems.length) currentIndex = 0;

  openLightbox(currentIndex);
}

// Close lightbox
function closeLightbox() {
  let lightbox = document.getElementById("lightbox");
  let lightboxImg = document.getElementById("lightbox-img");
  let lightboxVideo = document.getElementById("lightbox-video");

  lightbox.style.display = "none";
  lightboxImg.src = "";
  lightboxVideo.src = "";
}

// Load gallery on page load
document.addEventListener("DOMContentLoaded", loadGallery);
