const API_BASE = window.API_BASE || 'http://localhost:4000/api';
window.API_BASE = API_BASE;

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload.error || 'Request failed';
    throw new Error(message);
  }

  return response.json();
}

window.apiFetch = apiFetch;
