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
 * 4. Lightbox Functionality for Manual Gallery
 *******************************************/
function openLightboxWithImage(imageUrl) {
    let lightbox = document.getElementById("lightbox");
    let lightboxImg = document.getElementById("lightbox-img");
    let lightboxVideo = document.getElementById("lightbox-video");

    lightboxImg.src = imageUrl;
    lightboxImg.style.display = "block";
    lightboxVideo.style.display = "none";

    lightbox.style.display = "flex";
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

/*******************************************
 * 5. Gallery Filtering & Masonry Layout
 *******************************************/
document.addEventListener("DOMContentLoaded", function () {
    const filters = document.querySelectorAll(".list");
    const images = document.querySelectorAll(".gallery-item");

    filters.forEach(filter => {
        filter.addEventListener("click", function () {
            const filterValue = this.getAttribute("data-filter");

            // Remove active class from all filters
            filters.forEach(f => f.classList.remove("active"));
            this.classList.add("active");

            // Show or hide images based on category
            images.forEach(img => {
                if (filterValue === "all" || img.classList.contains(filterValue)) {
                    img.style.display = "block";
                } else {
                    img.style.display = "none";
                }
            });
        });
    });
});
