const reviewForm = document.getElementById('reviewForm');
const ratingLabel = document.getElementById('ratingLabel');
const reviewStatus = document.getElementById('reviewStatus');

const ratingLabels = {
  1: 'Very poor',
  2: 'Poor',
  3: 'Average',
  4: 'Good',
  5: 'Excellent'
};

document.querySelectorAll('input[name="rating"]').forEach((input) => {
  input.addEventListener('change', () => {
    ratingLabel.textContent = ratingLabels[input.value] || 'Select a rating';
  });
});

reviewForm.addEventListener('submit', (event) => {
  event.preventDefault();
  reviewStatus.textContent = '';

  const rating = reviewForm.querySelector('input[name="rating"]:checked');
  if (!rating) {
    reviewStatus.textContent = 'Please select a rating before submitting.';
    reviewStatus.style.color = '#b42318';
    return;
  }

  if (!reviewForm.checkValidity()) {
    reviewStatus.textContent = 'Please complete the required fields.';
    reviewStatus.style.color = '#b42318';
    return;
  }

  reviewStatus.textContent = 'Thank you! Your review has been submitted.';
  reviewStatus.style.color = '#2d8f5b';
  reviewForm.reset();
  ratingLabel.textContent = 'Select a rating';
});

