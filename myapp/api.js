const API_BASE = window.API_BASE || 'http://localhost:4000/api';
window.API_BASE = API_BASE;

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('customerToken');
  const headers = {
    ...(options.headers || {})
  };
  
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers,
    ...options
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload.error || 'Request failed';
    
    // Handle token expiration
    if (response.status === 401 && token) {
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerName');
      if (!path.includes('/auth/')) {
        window.location.href = 'Login.html';
      }
    }
    
    throw new Error(message);
  }

  return response.json();
}

window.apiFetch = apiFetch;
