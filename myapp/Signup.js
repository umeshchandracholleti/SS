const signupForm = document.getElementById('signupForm');
const signupStatus = document.getElementById('signupStatus');

function setStatus(message, isError) {
  signupStatus.textContent = message;
  signupStatus.style.color = isError ? '#b42318' : '#2d8f5b';
}

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  signupStatus.textContent = '';

  const formData = new FormData(signupForm);
  const data = Object.fromEntries(formData);

  if (data.password !== data.confirm) {
    setStatus('Passwords do not match.', true);
    return;
  }

  try {
    const response = await window.apiFetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password
      })
    });

    localStorage.setItem('customerToken', response.token);
    localStorage.setItem('customerName', response.fullName);
    setStatus('Account created successfully.', false);
    setTimeout(() => {
      window.location.href = 'TopRowbanner.html';
    }, 800);
  } catch (error) {
    setStatus(error.message, true);
  }
});
