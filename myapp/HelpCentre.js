// FAQ Toggle Functionality
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const faqItem = question.parentElement;
    // eslint-disable-next-line no-unused-vars
    const isActive = faqItem.classList.contains('active');

    // Close all other FAQ items
    document.querySelectorAll('.faq-item.active').forEach(item => {
      if (item !== faqItem) {
        item.classList.remove('active');
      }
    });

    // Toggle current FAQ item
    faqItem.classList.toggle('active');
  });
});

// Quick Links Filter
const linkCards = document.querySelectorAll('.link-card');
linkCards.forEach(card => {
  card.addEventListener('click', () => {
    const category = card.getAttribute('data-category');
    scrollToCategory(category);
  });
});

function scrollToCategory(category) {
  const categorySection = document.querySelector(`.faq-category[data-category="${category}"]`);
  if (categorySection) {
    categorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Search Functionality
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    performSearch();
  }
});

function performSearch() {
  const query = searchInput.value.toLowerCase().trim();

  if (!query) {
    showAllFAQs();
    return;
  }

  const faqItems = document.querySelectorAll('.faq-item');
  let foundCount = 0;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question span').textContent.toLowerCase();
    const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();

    if (question.includes(query) || answer.includes(query)) {
      item.style.display = 'block';
      item.classList.add('active');
      foundCount++;
    } else {
      item.style.display = 'none';
      item.classList.remove('active');
    }
  });

  // Show message if no results
  if (foundCount === 0) {
    alert(`No results found for "${query}". Please contact support for further assistance.`);
  }
}

function showAllFAQs() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.style.display = 'block';
    item.classList.remove('active');
  });
}

// Message Modal Functionality
const messageBtn = document.querySelector('.message-btn');
const messageModal = document.getElementById('messageModal');
const modalOverlay = document.getElementById('modalOverlay');
const closeBtn = document.getElementById('closeBtn');
const messageForm = document.getElementById('messageForm');

messageBtn.addEventListener('click', () => {
  messageModal.classList.add('show');
  modalOverlay.classList.add('show');
});

closeBtn.addEventListener('click', () => {
  messageModal.classList.remove('show');
  modalOverlay.classList.remove('show');
});

modalOverlay.addEventListener('click', () => {
  messageModal.classList.remove('show');
  modalOverlay.classList.remove('show');
});

// Message Form Submission
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(messageForm);
  const data = Object.fromEntries(formData);

  // Validate form
  if (!data.name || !data.email || !data.subject || !data.category || !data.message) {
    alert('Please fill all fields');
    return;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    alert('Please enter a valid email address');
    return;
  }

  // Log data (in real app, send to server)
  console.log('Support Message:', data);

  // Show success message
  alert('Thank you for your message! Our team will respond within 1 hour.');

  // Reset form and close modal
  messageForm.reset();
  messageModal.classList.remove('show');
  modalOverlay.classList.remove('show');
});

// Chat Button (placeholder)
const chatBtn = document.querySelector('.chat-btn');
if (chatBtn) {
  chatBtn.addEventListener('click', () => {
    alert('Chat feature coming soon! Please contact us via email or phone.');
  });
}

console.log('Help Centre script loaded successfully');
