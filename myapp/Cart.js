// Sample cart items (in real app, these would come from backend)
let cartItems = [
  { id: 1, name: 'Office Chair', price: 4500, quantity: 1, emoji: '🪑' },
  { id: 2, name: 'LED Desk Lamp', price: 1200, quantity: 2, emoji: '💡' },
  { id: 3, name: 'Wireless Keyboard', price: 2800, quantity: 1, emoji: '⌨️' }
];

const TAX_RATE = 0.18; // 18% tax
const SHIPPING_COST = 100;

// DOM Elements
const cartItemsContainer = document.getElementById('cartItems');
const emptyCart = document.getElementById('emptyCart');
const itemCount = document.getElementById('itemCount');
const subtotalEl = document.getElementById('subtotal');
const shippingEl = document.getElementById('shipping');
const taxEl = document.getElementById('tax');
const discountEl = document.getElementById('discount');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkoutBtn');
const applyPromoBtn = document.getElementById('applyPromo');
const promoInput = document.getElementById('promoCode');
const checkoutModal = document.getElementById('checkoutModal');
const successModal = document.getElementById('successModal');
const closeCheckout = document.getElementById('closeCheckout');
const modalOverlay = document.getElementById('modalOverlay');
const checkoutForm = document.getElementById('checkoutForm');

let discountAmount = 0;

// Initialize cart
function initCart() {
  renderCart();
  updateSummary();
}

// Render cart items
function renderCart() {
  cartItemsContainer.innerHTML = '';

  if (cartItems.length === 0) {
    cartItemsContainer.style.display = 'none';
    emptyCart.classList.add('show');
    return;
  }

  cartItemsContainer.style.display = 'flex';
  emptyCart.classList.remove('show');

  cartItems.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="item-image">${item.emoji}</div>
      <div class="item-details">
        <h3>${item.name}</h3>
        <div class="item-price">₹${(item.price * item.quantity).toLocaleString()}</div>
        <small>₹${item.price.toLocaleString()} each</small>
      </div>
      <div class="item-controls">
        <div class="quantity-control">
          <button onclick="decreaseQuantity(${item.id})" class="decrease-btn">−</button>
          <input type="number" value="${item.quantity}" readonly>
          <button onclick="increaseQuantity(${item.id})" class="increase-btn">+</button>
        </div>
        <button onclick="removeItem(${item.id})" class="remove-btn">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  updateItemCount();
}

// Increase quantity
// eslint-disable-next-line no-unused-vars
function increaseQuantity(itemId) {
  const item = cartItems.find(i => i.id === itemId);
  if (item) {
    item.quantity++;
    renderCart();
    updateSummary();
  }
}

// Decrease quantity
// eslint-disable-next-line no-unused-vars
function decreaseQuantity(itemId) {
  const item = cartItems.find(i => i.id === itemId);
  if (item && item.quantity > 1) {
    item.quantity--;
    renderCart();
    updateSummary();
  }
}

// Remove item
// eslint-disable-next-line no-unused-vars
function removeItem(itemId) {
  cartItems = cartItems.filter(i => i.id !== itemId);
  renderCart();
  updateSummary();
  
  // Disable checkout if cart is empty
  if (cartItems.length === 0) {
    checkoutBtn.disabled = true;
  }
}

// Update item count
function updateItemCount() {
  const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  itemCount.textContent = `${total} item${total !== 1 ? 's' : ''}`;
}

// Calculate subtotal
function calculateSubtotal() {
  return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Update summary
function updateSummary() {
  const subtotal = calculateSubtotal();
  const shipping = subtotal > 5000 ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax - discountAmount;

  subtotalEl.textContent = `₹${subtotal.toLocaleString()}`;
  shippingEl.textContent = `₹${shipping}`;
  taxEl.textContent = `₹${Math.round(tax).toLocaleString()}`;
  discountEl.textContent = `-₹${discountAmount.toLocaleString()}`;
  totalEl.textContent = `₹${Math.round(total).toLocaleString()}`;

  // Update checkout button status
  checkoutBtn.disabled = cartItems.length === 0;
}

// Apply promo code
applyPromoBtn.addEventListener('click', () => {
  const code = promoInput.value.toUpperCase().trim();

  if (!code) {
    alert('Please enter a promo code');
    return;
  }

  // Sample promo codes
  const promoCodes = {
    'SAVE10': { discount: 0.10, label: '10% discount' },
    'SAVE20': { discount: 0.20, label: '20% discount' },
    'FLAT500': { discount: 500, label: '₹500 off' },
    'WELCOME': { discount: 0.05, label: '5% discount' }
  };

  if (promoCodes[code]) {
    const subtotal = calculateSubtotal();
    const promoInfo = promoCodes[code];

    // Calculate discount
    if (typeof promoInfo.discount === 'number' && promoInfo.discount < 1) {
      discountAmount = Math.round(subtotal * promoInfo.discount);
    } else {
      discountAmount = promoInfo.discount;
    }

    updateSummary();
    alert(`Promo code "${code}" applied! You saved ₹${discountAmount}`);
    promoInput.value = '';
    applyPromoBtn.textContent = '✓ Applied';
    applyPromoBtn.disabled = true;
  } else {
    alert('Invalid promo code. Try: SAVE10, SAVE20, FLAT500, or WELCOME');
  }
});

// Checkout button
checkoutBtn.addEventListener('click', () => {
  if (cartItems.length === 0) {
    alert('Your cart is empty');
    return;
  }

  checkoutModal.classList.add('show');
  modalOverlay.classList.add('show');
});

// Close checkout modal
closeCheckout.addEventListener('click', () => {
  checkoutModal.classList.remove('show');
  modalOverlay.classList.remove('show');
});

modalOverlay.addEventListener('click', () => {
  checkoutModal.classList.remove('show');
  modalOverlay.classList.remove('show');
});

// Checkout form submission
checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(checkoutForm);
  const data = Object.fromEntries(formData);

  // Validate form
  if (!validateCheckoutForm(data)) {
    return;
  }

  // Create order
  placeOrder(data);
});

// Validate checkout form
function validateCheckoutForm(data) {
  // Check email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    alert('Please enter a valid email address');
    return false;
  }

  // Check phone
  if (data.phone.length !== 10 || !/^\d+$/.test(data.phone)) {
    alert('Please enter a valid 10-digit phone number');
    return false;
  }

  // Check pincode
  if (data.pincode.length !== 6 || !/^\d+$/.test(data.pincode)) {
    alert('Please enter a valid 6-digit pincode');
    return false;
  }

  return true;
}

// Place order
function placeOrder(data) {
  const orderId = generateOrderId();
  
  console.log('Order Data:', {
    ...data,
    items: cartItems,
    summary: {
      subtotal: calculateSubtotal(),
      discount: discountAmount,
      total: parseFloat(totalEl.textContent.replace('₹', '').replace(/,/g, ''))
    }
  });

  // Show success modal
  document.getElementById('orderId').textContent = orderId;
  checkoutModal.classList.remove('show');
  successModal.classList.add('show');

  // Clear cart
  cartItems = [];
  discountAmount = 0;
  renderCart();
  updateSummary();
  checkoutForm.reset();
  applyPromoBtn.disabled = false;
  applyPromoBtn.textContent = 'Apply';
}

// Generate order ID
function generateOrderId() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${timestamp}-${random}`;
}

// Phone input formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
  });
}

// Pincode input formatting
const pincodeInput = document.getElementById('pincode');
if (pincodeInput) {
  pincodeInput.addEventListener('input', () => {
    pincodeInput.value = pincodeInput.value.replace(/\D/g, '').slice(0, 6);
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initCart);

// Log initialization
console.log('Cart script loaded successfully');
