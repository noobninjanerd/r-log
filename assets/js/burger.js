// assets/js/burger.js

// grab html elements using assigned unique class
// use let so variables aren't hoisted 
// (uninitialized hoisting: https://www.freecodecamp.org/news/javascript-let-and-const-hoisting/)
let burgerBtn = document.querySelector(".burger-menu-btn");
let burgerMenu = document.querySelector(".burger-menu");

let isBurgerOpen = false;

burgerBtn.onclick = function() {
  if (!isBurgerOpen) {
      burgerMenu.style.display = "block"; // block-mode of display (inline)
      burgerBtn.style.backgroundPosition = "center left 50px, center";
      isBurgerOpen = true;
  }
  else if (isBurgerOpen) {
    burgerMenu.style.display = "none";  // removes element from document
    burgerBtn.style.backgroundPosition = "center, center left 50px";
    isBurgerOpen = false;
  }
}