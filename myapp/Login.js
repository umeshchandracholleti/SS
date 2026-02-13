const loginForm = document.getElementById('loginForm');
const loginStatus = document.getElementById('loginStatus');

function setStatus(message, isError) {
  loginStatus.textContent = message;
  loginStatus.style.color = isError ? '#b42318' : '#2d8f5b';
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginStatus.textContent = '';

  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData);

  try {
    const response = await window.apiFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        password: data.password
      })
    });

    localStorage.setItem('customerToken', response.token);
    localStorage.setItem('customerName', response.fullName);
    setStatus('Signed in successfully.', false);
    setTimeout(() => {
      window.location.href = 'TopRowbanner.html';
    }, 800);
  } catch (error) {
    setStatus(error.message, true);
  }
});
