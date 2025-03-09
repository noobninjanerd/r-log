// Function to set up the burger menu behavior
function setupBurger() {
  let burgerBtn = document.querySelector(".burger-menu-btn");
  if (burgerBtn) {
    let burgerMenu = document.querySelector(".burger-menu");
    let isBurgerOpen = false;
    burgerBtn.onclick = function() {

      if (!isBurgerOpen) {
        burgerMenu.style.display = "block";
        burgerBtn.style.backgroundPosition = "center left 50px, center";
        isBurgerOpen = true;
      } else {
        burgerMenu.style.display = "none";
        burgerBtn.style.backgroundPosition = "center, center left 50px";
        isBurgerOpen = false;
      }
    };
  }
}

// Helper functions to preserve mathblocks
function preserveMathBlocks(markdown) {
    const mathBlocks = [];
    // This regex matches anything between $$ and $$ (including newlines)
    const replaced = markdown.replace(/\$\$(.*?)\$\$/gs, (match, content) => {
      // Trim any extra whitespace from the content
      let trimmed = content.trim();
      // Ensure the math block has proper newlines before and after the content
      const fullBlock = "\\[\n" + trimmed + "\n\\]";
      const placeholder = `@@MATH${mathBlocks.length}@@`;
      mathBlocks.push(fullBlock);
      // Wrap in a container so we can style it if needed
      return "\n<div class=\"display-math\">" + placeholder + "</div>\n";
    });
    return { replaced, mathBlocks };
}
  
  
function restoreMathBlocks(html, mathBlocks) {
    mathBlocks.forEach((block, index) => {
      const placeholder = `@@MATH${index}@@`;
      // Replace the placeholder with the original math block
      html = html.replace(placeholder, block);
    });
    return html;
}
  
// fetch and process the markdown file
function loadMarkdownContent() {  
  fetch('./content/T1.B-vs-H.md')
  .then(response => response.text())
  .then(markdown => {
    // First, preserve math blocks so Marked.js doesn't alter them.
    const { replaced, mathBlocks } = preserveMathBlocks(markdown);
    // Parse the rest of the Markdown
    let htmlContent = marked.parse(replaced);
    // Restore the original math blocks into the final HTML
    htmlContent = restoreMathBlocks(htmlContent, mathBlocks);
    document.getElementById('markdown-body').innerHTML = htmlContent;
    // Tell MathJax to process the newly inserted math
    if (window.MathJax) {
      MathJax.typesetPromise().catch(err => console.error(err.message));
    }
  })
  .catch(error => console.error('Error loading Markdown:', error));
}

function loadIncludes(){
    fetch('./includes/header.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('header').innerHTML = html;
        // Once header is loaded, set up the burger menu
    let burgerBtn = document.querySelector(".burger-menu-btn");
    console.log("Burger button:", burgerBtn);
    setupBurger();
    });

fetch('./includes/footer.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('footer').innerHTML = html;
    });
}

// Initialize the page content
document.addEventListener('DOMContentLoaded', function() {
    loadIncludes();
    
    // Only load markdown content if the element exists on the page
    if (document.getElementById('markdown-body')) {
      loadMarkdownContent();
    }
});
