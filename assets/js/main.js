// assets/js/main.js

// JS to set up the burger menu toggle - only for mobiles
function setupBurger() 
{
  let burgerBtn = document.querySelector(".burger-menu-btn"); // grab the burger-menu-button element by it's class from the html
  if (burgerBtn) 
  {
    let burgerMenu = document.querySelector(".burger-menu");
    let isBurgerMenuOpen = false;
    burgerBtn.onclick = function() { // anonymous function that is called when click event takes place

      if (!isBurgerMenuOpen)  // if burger-menu is closed
        {
          burgerMenu.style.display = "block";
          burgerBtn.style.backgroundPosition = "center left 50px, center";
          isBurgerMenuOpen = true;
        } else {
          burgerMenu.style.display = "none"; //  remove element from the document
          burgerBtn.style.backgroundPosition = "center, center left 50px";
          isBurgerMenuOpen = false;
        }
    };
  }
}

function loadIncludes()
{
   fetch('./includes/header.html') // send HTTP GET request, 
  // fetch() immediately returns a Promise so that means while .then() waits for the response, the browser moves on and runs code beyond this fetch(): here, that is the next fetch() for the footer 
  .then(response => response.text()) 
  // wait for the previous async event operation to complete (async: we don't know when it'll finish) 
  // fetch() returns a "Promise" which is a placeholder for "i'll give the RESPONSE as soon as i get it myself"
    .then(htmlFromHeaderFile => {
      
      // response.text() returns all the html from header.html and we place it in the document
      document.getElementById('header').innerHTML = htmlFromHeaderFile;
    
      // Once header is loaded, set up the burger menu

      setupBurger();
      // important you keep it in the then. block, 
      // as the function can only properly run 
      // once there are proper header html elements to attach the "click listener" to

    });

  fetch('./includes/burger.html')
  .then(response => response.text())
    .then(htmlFromBurgerFile => {
        document.getElementById('burger-nav').innerHTML = htmlFromBurgerFile;
  }); 

  fetch('./includes/footer.html')
    .then(response => response.text())
      .then(htmlFromFooterFile => {
          document.getElementById('footer').innerHTML = htmlFromFooterFile;
  });
}

function loadConvertedHTML() 
{
    // Get the current file name from the URL
    let currentFile = window.location.pathname.split('/').pop(); // e.g., "blog1.html"

    // Construct the path to the corresponding converted HTML file
    let srcFilePath = './content/' + currentFile;

    fetch(srcFilePath)
      .then(response => {
        if (!response.ok) 
          { 
          // .ok is property of the Response object and is a simple true/false flag
          // .ok === true : the server said 200-299
          // .ok === false : 404 not found or 500 Error
          throw new Error("Network response was not ok: " + response.statusText);
          }
        
          return response.text();
      })
      .then(htmlContent => {
        document.getElementById('converted-html-body').innerHTML = htmlContent;
        
        // MathJax needs to process the math,
        if (window.MathJax) 
          {
          MathJax.typesetPromise()
          .catch(err => console.error(err.message));
          }

      })
      .catch(error => console.error('Error loading HTML content:', error));
}

// Initialize the page content when DOM is loaded
//https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
document.addEventListener('DOMContentLoaded', function() {
  // DOMContentLoaded event fires when the HTML doc has been completely parsed: 
  // https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
  // https://stackoverflow.com/questions/73425012/window-domcontentloaded-vs-document-domcontentloaded  
  
  // 1. go to the source header and footer html files and inject their content in the ID'd html containers on the document
  loadIncludes();
  
  // Only load converted HTML content if the element exists on the page
  if (document.getElementById('converted-html-body')) 
    {
      // 2. Function to load pre-converted HTML content from ./content/
      loadConvertedHTML();
    }
});


// Functions that worked with marked.js -> switched to python for md-to-html conversion now tho

// Helper functions to preserve mathblocks
// function preserveMathBlocks(markdown) {
//     const mathBlocks = [];
//     // This regex matches anything between $$ and $$ (including newlines)
//     const replaced = markdown.replace(/\$\$(.*?)\$\$/gs, (match, content) => {
//       // Trim any extra whitespace from the content
//       let trimmed = content.trim();
//       // Ensure the math block has proper newlines before and after the content
//       const fullBlock = "\\[\n" + trimmed + "\n\\]";
//       const placeholder = `@@MATH${mathBlocks.length}@@`;
//       mathBlocks.push(fullBlock);
//       // Wrap in a container so we can style it if needed
//       return "\n<div class=\"display-math\">" + placeholder + "</div>\n";
//     });
//     return { replaced, mathBlocks };
// }
  
// function restoreMathBlocks(html, mathBlocks) {
//     mathBlocks.forEach((block, index) => {
//       const placeholder = `@@MATH${index}@@`;
//       // Replace the placeholder with the original math block
//       html = html.replace(placeholder, block);
//     });
//     return html;
// }
  
// // fetch and process the markdown file
// function loadMarkdownContent() {  
//   fetch('./content/T1.B-vs-H.md')
//   .then(response => response.text())
//   .then(markdown => {
//     // First, preserve math blocks so Marked.js doesn't alter them.
//     const { replaced, mathBlocks } = preserveMathBlocks(markdown);
//     // Parse the rest of the Markdown
//     let htmlContent = marked.parse(replaced);
//     // Restore the original math blocks into the final HTML
//     htmlContent = restoreMathBlocks(htmlContent, mathBlocks);
//     document.getElementById('markdown-body').innerHTML = htmlContent;
//     // Tell MathJax to process the newly inserted math
//     if (window.MathJax) {
//       MathJax.typesetPromise().catch(err => console.error(err.message));
//     }
//   })
//   .catch(error => console.error('Error loading Markdown:', error));
// }