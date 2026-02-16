const signupForm = document.getElementById('signupForm');
const signupStatus = document.getElementById('signupStatus');
const submitBtn = signupForm.querySelector('button[type="submit"]');

function setStatus(message, isError) {
  signupStatus.textContent = message;
  signupStatus.style.color = isError ? '#b42318' : '#2d8f5b';
}

function validatePhone(phone) {
  if (!phone) return true; // Optional field
  return /^[0-9]{10}$/.test(phone);
}

function validatePassword(password) {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
}

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  signupStatus.textContent = '';

  const formData = new FormData(signupForm);
  const data = Object.fromEntries(formData);

  // Validation
  if (!data.fullName.trim()) {
    setStatus('Please enter your full name.', true);
    return;
  }

  if (!data.email.trim() || !data.email.includes('@')) {
    setStatus('Please enter a valid email address.', true);
    return;
  }

  if (data.phone && !validatePhone(data.phone)) {
    setStatus('Please enter a valid 10-digit phone number.', true);
    return;
  }

  const passwordError = validatePassword(data.password);
  if (passwordError) {
    setStatus(passwordError, true);
    return;
  }

  if (data.password !== data.confirm) {
    setStatus('Passwords do not match.', true);
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Creating account...';

  try {
    const response = await window.apiFetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone || null,
        password: data.password
      })
    });

    // Store JWT token and user info
    localStorage.setItem('customerToken', response.token);
    localStorage.setItem('customerName', response.user.fullName);
    localStorage.setItem('customerEmail', response.user.email);
    localStorage.setItem('customerId', response.user.id);
    localStorage.setItem('userRole', response.user.role || 'customer');
    
    setStatus('✓ Account created successfully! Redirecting...', false);
    
    setTimeout(() => {
      window.location.href = 'TopRowbanner.html';
    }, 1000);
  } catch (error) {
    setStatus(error.message || 'Failed to create account. Please try again.', true);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Create account';
  }
});
