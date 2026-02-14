// Auth state management
function checkAuthState() {
  const token = localStorage.getItem('customerToken');
  const userName = localStorage.getItem('customerName');
  const authSection = document.getElementById('authSection');
  const userSection = document.getElementById('userSection');
  const userNameEl = document.getElementById('userName');

  if (token && userName) {
    authSection.style.display = 'none';
    userSection.style.display = 'flex';
    userNameEl.textContent = `Hello, ${userName.split(' ')[0]}`;
  } else {
    authSection.style.display = 'flex';
    userSection.style.display = 'none';
  }
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    const token = localStorage.getItem('customerToken');
    if (token) {
      try {
        await window.apiFetch('/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (e) {
        console.warn('Logout request failed:', e);
      }
    }
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerName');
    window.location.reload();
  });
}

checkAuthState();

const categoryButtons = document.querySelectorAll('.category-list button');
const selectedCategory = document.getElementById('selectedCategory');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('siteSearch');
const searchSuggestions = document.getElementById('searchSuggestions');

const suggestions = [
  'Office chairs',
  'Safety gloves',
  'Packaging tape',
  'Cleaning supplies',
  'Power drills',
  'Measurement tools'
];

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedCategory.textContent = button.dataset.category;
  });
});

function renderSuggestions(filterText = '') {
  const items = suggestions.filter((item) => item.toLowerCase().includes(filterText.toLowerCase()));
  searchSuggestions.innerHTML = '';

  if (!items.length) {
    searchSuggestions.classList.remove('show');
    return;
  }

  items.forEach((item) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = item;
    button.addEventListener('click', () => {
      searchInput.value = item;
      searchSuggestions.classList.remove('show');
    });
    searchSuggestions.appendChild(button);
  });

  searchSuggestions.classList.add('show');
}

searchInput.addEventListener('input', (event) => {
  renderSuggestions(event.target.value);
});

searchInput.addEventListener('focus', () => {
  renderSuggestions(searchInput.value);
});

document.addEventListener('click', (event) => {
  if (!searchForm.contains(event.target)) {
    searchSuggestions.classList.remove('show');
  }
});

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  searchSuggestions.classList.remove('show');
});

let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const carousel = document.querySelector('.carousel-container');
const heroBadges = document.querySelector('.hero-badges');

function showSlide(index) {
  slides.forEach((slide) => slide.classList.remove('active'));
  dots.forEach((dot) => dot.classList.remove('active'));

  slides[index].classList.add('active');
  dots[index].classList.add('active');
}

function nextSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % slides.length;
  showSlide(currentSlideIndex);
}

let autoScroll = setInterval(nextSlide, 5000);

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    const index = Number(dot.dataset.slide);
    currentSlideIndex = index;
    showSlide(index);
    clearInterval(autoScroll);
    autoScroll = setInterval(nextSlide, 5000);
  });
});

carousel.addEventListener('mouseenter', () => clearInterval(autoScroll));
carousel.addEventListener('mouseleave', () => {
  autoScroll = setInterval(nextSlide, 5000);
});

if (heroBadges) {
  requestAnimationFrame(() => {
    heroBadges.classList.add('animate');
  });
}

const featuredSection = document.querySelector('.featured-section');
if (featuredSection) {
  const track = featuredSection.querySelector('.featured-track');
  const cards = Array.from(featuredSection.querySelectorAll('.featured-card'));
  const prevBtn = featuredSection.querySelector('[data-action="prev"]');
  const nextBtn = featuredSection.querySelector('[data-action="next"]');
  let index = 0;

  function getCardSize() {
    if (!cards.length) {
      return 0;
    }
    const cardWidth = cards[0].getBoundingClientRect().width;
    return cardWidth + 16;
  }

  function updateFeatured() {
    const cardSize = getCardSize();
    if (!cardSize) {
      return;
    }
    const visibleCount = Math.max(1, Math.floor(track.parentElement.offsetWidth / cardSize));
    const maxIndex = Math.max(0, cards.length - visibleCount);
    index = Math.min(index, maxIndex);
    track.style.transform = `translateX(${-index * cardSize}px)`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= maxIndex;
  }

  prevBtn.addEventListener('click', () => {
    index = Math.max(0, index - 1);
    updateFeatured();
  });

  nextBtn.addEventListener('click', () => {
    index = Math.min(cards.length - 1, index + 1);
    updateFeatured();
  });

  window.addEventListener('resize', updateFeatured);
  updateFeatured();
}