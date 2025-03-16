/*******************************************
 * 1. Load Notebook & Posts from GitHub
 *******************************************/
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("entries")) {
    loadMarkdownFiles("Notebook", "entries", "notebook");
  }
  if (document.getElementById("posts-container")) {
    loadMarkdownFiles("Posts", "posts-container", "updates");
  }
});

/*******************************************
 * 2. Load Markdown Files from GitHub (Fixing Modal)
 *******************************************/
async function loadMarkdownFiles(folder, containerId, type) {
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
      container.innerHTML = `<p>No ${type === "notebook" ? "notebook entries" : "updates"} found.</p>`;
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

        // Create entry item
        let entryDiv = document.createElement("div");
        entryDiv.classList.add("post-item");
        entryDiv.dataset.title = title;
        entryDiv.dataset.content = markdownContent;
        entryDiv.dataset.type = type; // ✅ Identifies if it’s a notebook entry or update

        entryDiv.innerHTML = `
          <h2 class="post-title">${title}</h2>
          <p class="post-date">${date}</p>
          <p class="post-summary">${summary}</p>
          <span class="post-read-more">→</span>
        `;

        entryDiv.addEventListener("click", () => openPost(title, markdownContent, type)); 
        container.appendChild(entryDiv);
      }
    }
  } catch (error) {
    console.error(`Error loading ${type === "notebook" ? "notebook entries" : "updates"}:`, error);
    container.innerHTML = `<p>Error loading ${type === "notebook" ? "notebook entries" : "updates"}. Check console.</p>`;
  }
}

/*******************************************
 * 3. Fixing Notebook Modal (Ensuring It Opens)
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

    // ✅ Extract Metadata and Remove It from Content
    let cleanedContent = content.replace(/---[\s\S]*?---/, ""); // Remove YAML metadata block
    modalContent.innerHTML = marked.parse(cleanedContent.trim());

    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";
    modal.focus();
}


// ✅ Close Post Modal
function closePost() {
  let modal = document.getElementById("post-modal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; 
  }
}
