// Placeholder for future interactivity
//console.log("Header loaded successfully.");

// Future JavaScript code can be added here to enhance the header functionality.

// For now, this file is intentionally left minimal.


// sidebar
document.querySelectorAll('.category-list li').forEach(item => {
  item.addEventListener('click', () => {
    const categoryName = item.innerText.trim();
    console.log("Navigating to: " + categoryName);
    // You can add your redirect logic here:
    // window.location.href = '/search?q=' + categoryName;
  });
});

//promo scrollings

let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  
  slides[index].classList.add('active');
  dots[index].classList.add('active');
}

function nextSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % slides.length;
  showSlide(currentSlideIndex);
}

// Auto-play every 5 seconds
let autoScroll = setInterval(nextSlide, 5000);

// Allow manual clicking of dots
// eslint-disable-next-line no-unused-vars
function currentSlide(index) {
  currentSlideIndex = index;
  showSlide(index);
  clearInterval(autoScroll); // Reset timer on click
  autoScroll = setInterval(nextSlide, 5000);
}