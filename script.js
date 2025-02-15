/*******************************************
 * 1. Load Notebook & Posts from GitHub
 *******************************************/
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("entries")) {
    loadMarkdownFiles("Notebook", "entries");
  }
  if (document.getElementById("posts-container")) {
    loadMarkdownFiles("Posts", "posts-container");
  }
  if (document.getElementById("image-gallery")) {
    loadGallery();
  }
});

/*******************************************
 * 2. Load Markdown Files from GitHub (Fixing Modal)
 *******************************************/
async function loadMarkdownFiles(folder, containerId) {
  let container = document.getElementById(containerId);
  container.innerHTML = "<p>Loading...</p>";

  try {
    const repoOwner = "MikaylaNewbrey";
    const repoName = "Research_Notes";
    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folder}`);

    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

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
        entryDiv.dataset.title = title;
        entryDiv.dataset.content = markdownContent;

        entryDiv.innerHTML = `
          <h2 class="post-title">${title}</h2>
          <p class="post-date">${date}</p>
          <p class="post-summary">${summary}</p>
          <span class="post-read-more">→</span>
        `;

        entryDiv.addEventListener("click", () => openPost(title, markdownContent)); // ✅ Fixing modal event listener
        container.appendChild(entryDiv);
      }
    }
  } catch (error) {
    console.error("Error loading Markdown files:", error);
    container.innerHTML = `<p>Error loading posts. Check console.</p>`;
  }
}

/*******************************************
 * 3. Fixing Notebook Modal
 *******************************************/
function openPost(title, content) {
  let modal = document.getElementById("post-modal");
  let modalTitle = document.getElementById("modal-title");
  let modalContent = document.getElementById("modal-content");

  if (!modal) {
    console.error("Modal not found in the document.");
    return;
  }

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
  if (modal) {
    modal.style.display = "none";
  }
}

/*******************************************
 * 4. Lightbox for Images & Videos
 *******************************************/
let currentIndex = 0;
const galleryItems = [
  { type: "image", id: "1o-cMnKZoqqr25Wjj6HUqjnX-9F-SCxFW", name: "Remus Wellfleet" },
  { type: "image", id: "YOUR_IMAGE_FILE_ID_2", name: "Another Image" },
  { type: "video", id: "YOUR_VIDEO_FILE_ID", name: "Research Video" }
];

function loadGallery() {
  let imageGallery = document.getElementById("image-gallery");
  let videoGallery = document.getElementById("video-gallery");

  galleryItems.forEach((item, index) => {
    let element;
    let url = item.type === "image"
      ? `https://lh3.googleusercontent.com/d/${item.id}=s600` // ✅ Correct Drive Image Path
      : `https://drive.google.com/file/d/${item.id}/preview`;

    if (item.type === "image") {
      element = document.createElement("img");
      element.src = url;
      element.alt = item.name;
      element.classList.add("gallery-item");
      element.onclick = () => openLightbox(index);
      imageGallery.appendChild(element);
    } else {
      element = document.createElement("iframe");
      element.src = url;
      element.width = "640";
      element.height = "360";
      element.classList.add("gallery-item");
      videoGallery.appendChild(element);
    }
  });
}

// Open lightbox
function openLightbox(index) {
  currentIndex = index;
  let lightbox = document.getElementById("lightbox");
  let lightboxImg = document.getElementById("lightbox-img");
  let lightboxVideo = document.getElementById("lightbox-video");

  let item = galleryItems[index];
  let url = item.type === "image"
    ? `https://lh3.googleusercontent.com/d/${item.id}=s600`
    : `https://drive.google.com/file/d/${item.id}/preview`;

  if (item.type === "image") {
    lightboxImg.src = url;
    lightboxImg.style.display = "block";
    lightboxVideo.style.display = "none";
  } else {
    lightboxVideo.src = url;
    lightboxVideo.style.display = "block";
    lightboxImg.style.display = "none";
  }

  lightbox.style.display = "flex";
}

// Next/Prev navigation
function changeMedia(direction) {
  currentIndex += direction;
  if (currentIndex < 0) currentIndex = galleryItems.length - 1;
  if (currentIndex >= galleryItems.length) currentIndex = 0;

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

document.addEventListener("DOMContentLoaded", loadGallery);
