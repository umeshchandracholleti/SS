import axios from 'axios';

// API Base URL - defaults to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      } else if (status === 403) {
        console.error('Forbidden:', data.message);
      } else if (status === 404) {
        console.error('Not found:', data.message);
      } else if (status >= 500) {
        console.error('Server error:', data.message);
      }
      
      return Promise.reject(data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network error: No response from server');
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    } else {
      // Error in request setup
      console.error('Request error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

// API Methods
export const api = {
  // Auth
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
  
  // Products
  getProducts: (params) => apiClient.get('/products', { params }),
  getProduct: (id) => apiClient.get(`/products/${id}`),
  searchProducts: (query) => apiClient.get('/products/search', { params: { q: query } }),
  
  // Cart
  getCart: () => apiClient.get('/cart'),
  addToCart: (productId, quantity) => apiClient.post('/cart/items', { productId, quantity }),
  updateCartItem: (itemId, quantity) => apiClient.put(`/cart/items/${itemId}`, { quantity }),
  removeFromCart: (itemId) => apiClient.delete(`/cart/items/${itemId}`),
  clearCart: () => apiClient.delete('/cart'),
  
  // Orders
  getOrders: () => apiClient.get('/orders'),
  getOrder: (id) => apiClient.get(`/orders/${id}`),
  createOrder: (orderData) => apiClient.post('/orders', orderData),
  trackOrder: (orderId) => apiClient.get(`/orders/${orderId}/track`),
  
  // Payments
  createPayment: (paymentData) => apiClient.post('/payments', paymentData),
  verifyPayment: (paymentId, signature) => apiClient.post('/payments/verify', { paymentId, signature }),
  
  // RFQ (Request for Quote)
  submitRFQ: (rfqData) => apiClient.post('/rfq', rfqData),
  getRFQs: () => apiClient.get('/rfq'),
  getRFQ: (id) => apiClient.get(`/rfq/${id}`),
  
  // Buy on Credit
  submitCreditRequest: (creditData) => apiClient.post('/credit/request', creditData),
  getCreditStatus: () => apiClient.get('/credit/status'),
  
  // Reviews
  getReviews: (productId) => apiClient.get(`/products/${productId}/reviews`),
  submitReview: (productId, reviewData) => apiClient.post(`/products/${productId}/reviews`, reviewData),
  
  // Support
  submitSupportTicket: (ticketData) => apiClient.post('/support/tickets', ticketData),
  getTickets: () => apiClient.get('/support/tickets'),
  getTicket: (id) => apiClient.get(`/support/tickets/${id}`),
  
  // Grievances
  submitGrievance: (grievanceData) => apiClient.post('/grievances', grievanceData),
  getGrievances: () => apiClient.get('/grievances'),
  getGrievance: (id) => apiClient.get(`/grievances/${id}`),
  
  // User
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (userData) => apiClient.put('/user/profile', userData),
  getAddresses: () => apiClient.get('/user/addresses'),
  addAddress: (addressData) => apiClient.post('/user/addresses', addressData),
  updateAddress: (id, addressData) => apiClient.put(`/user/addresses/${id}`, addressData),
  deleteAddress: (id) => apiClient.delete(`/user/addresses/${id}`),
};

export default apiClient;
