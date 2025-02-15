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

                // ✅ Extract metadata from the Markdown file
                let titleMatch = markdownContent.match(/title:\s*"(.+?)"/);
                let dateMatch = markdownContent.match(/date:\s*"(.+?)"/);
                let summaryMatch = markdownContent.match(/summary:\s*"(.+?)"/);

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

    modal.style.display = "flex"; // ✅ Enlarged modal, centered
}

/* ✅ Close Modal Pop-Up ✅ */
function closePost() {
    document.getElementById("post-modal").style.display = "none";
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
