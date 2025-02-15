document.addEventListener("DOMContentLoaded", function () {
  // Load lab notebook entries
  if (document.getElementById("entries")) {
      loadMarkdownFiles("Notebook", "entries");
  }
  // Load posts
  if (document.getElementById("posts-container")) {
      loadMarkdownFiles("Posts", "posts-container");
  }
  // No longer automatically fetching from Google Drive API
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


/* ✅ Lightbox (If You Still Want It) */
let currentIndex = 0;
function openLightbox(index) {
  // Insert your lightbox code or remove entirely if not needed
  // For a manual approach, you can reference an array or just remove the feature
}

function changeMedia(direction) {
  // If you had an array for images, handle next/prev logic
}

function closeLightbox() {
  // Hide the lightbox
}
