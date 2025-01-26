// Function to load posts dynamically
async function loadPosts() {
  const postsContainer = document.getElementById("posts");

  try {
    // Fetch the list of posts from the server
    const response = await fetch("posts/");
    if (!response.ok) {
      throw new Error("Failed to fetch posts.");
    }

    const text = await response.text();

    // Parse the HTML response to extract post filenames
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(text, "text/html");
    const links = htmlDoc.querySelectorAll("a");

    // Filter and load only HTML files
    links.forEach((link) => {
      const fileName = link.getAttribute("href");
      if (fileName.endsWith(".html")) {
        fetch(`posts/${fileName}`)
          .then((response) => response.text())
          .then((content) => {
            const postElement = document.createElement("div");
            postElement.className = "post";
            postElement.innerHTML = `
              <h2>${fileName.replace(".html", "")}</h2>
              <div>${content}</div>
            `;
            postsContainer.appendChild(postElement);
          })
          .catch((error) => {
            console.error(`Error loading post ${fileName}:`, error);
          });
      }
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    postsContainer.innerHTML = "<p>Failed to load posts. Please try again later.</p>";
  }
}

// Load posts when the page loads
window.onload = loadPosts;
