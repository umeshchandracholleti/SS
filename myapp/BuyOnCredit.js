// Modal elements
const applyBtn = document.getElementById('applyBtn');
const applicationModal = document.getElementById('applicationModal');
const successModal = document.getElementById('successModal');
const closeBtn = document.getElementById('closeBtn');
const creditForm = document.getElementById('creditForm');

// Form validation setup
// eslint-disable-next-line no-unused-vars
const form = creditForm;

// Open application form modal
applyBtn.addEventListener('click', () => {
  applicationModal.classList.add('show');
});

// Close application form modal
closeBtn.addEventListener('click', () => {
  applicationModal.classList.remove('show');
});

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
  if (e.target === applicationModal) {
    applicationModal.classList.remove('show');
  }
  if (e.target === successModal) {
    successModal.classList.remove('show');
  }
});

// Form submission
creditForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get form data
  const formData = new FormData(creditForm);
  const data = Object.fromEntries(formData);

  // Validate form
  if (!validateForm(data)) {
    alert('Please fill all required fields correctly');
    return;
  }

  // Log form data (in real app, send to server)
  console.log('Credit Application Data:', data);

  // Show success modal
  showSuccessModal();

  // Reset form
  creditForm.reset();
});

// Form validation function
function validateForm(data) {
  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    alert('Please enter a valid email address');
    return false;
  }

  // Check phone format
  if (data.phone.length !== 10 || !/^\d+$/.test(data.phone)) {
    alert('Please enter a valid 10-digit phone number');
    return false;
  }

  // Check PAN format
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(data.panNumber)) {
    alert('Please enter a valid PAN number (e.g., ABCDE1234F)');
    return false;
  }

  // Check age (must be 18+)
  const dob = new Date(data.dob);
  const age = new Date().getFullYear() - dob.getFullYear();
  if (age < 18) {
    alert('You must be at least 18 years old to apply');
    return false;
  }

  // Check pincode format
  if (data.pincode.length !== 6 || !/^\d+$/.test(data.pincode)) {
    alert('Please enter a valid 6-digit pincode');
    return false;
  }

  // Check monthly income
  if (parseFloat(data.monthlyIncome) <= 0) {
    alert('Please enter a valid monthly income');
    return false;
  }

  // Check credit amount
  if (parseFloat(data.creditAmount) <= 0 || parseFloat(data.creditAmount) > 1000000) {
    alert('Credit amount should be between ₹0 and ₹10,00,000');
    return false;
  }

  // Check terms agreement
  if (!document.getElementById('agreeTerms').checked) {
    alert('Please agree to terms and conditions');
    return false;
  }

  return true;
}

// Show success modal
function showSuccessModal() {
  // Generate reference ID
  const referenceId = generateReferenceId();
  document.getElementById('referenceId').textContent = referenceId;

  // Close application modal and show success modal
  applicationModal.classList.remove('show');
  successModal.classList.add('show');
}

// Generate reference ID
function generateReferenceId() {
  const prefix = 'BOC';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

// Real-time validation for email
const emailInput = document.getElementById('email');
if (emailInput) {
  emailInput.addEventListener('blur', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value && !emailRegex.test(emailInput.value)) {
      emailInput.style.borderColor = '#ff6b6b';
    } else {
      emailInput.style.borderColor = '#e0e0e0';
    }
  });
}

// Real-time validation for phone
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
  });

  phoneInput.addEventListener('blur', () => {
    if (phoneInput.value && phoneInput.value.length !== 10) {
      phoneInput.style.borderColor = '#ff6b6b';
    } else {
      phoneInput.style.borderColor = '#e0e0e0';
    }
  });
}

// Real-time validation for pincode
const pincodeInput = document.getElementById('pincode');
if (pincodeInput) {
  pincodeInput.addEventListener('input', () => {
    pincodeInput.value = pincodeInput.value.replace(/\D/g, '').slice(0, 6);
  });

  pincodeInput.addEventListener('blur', () => {
    if (pincodeInput.value && pincodeInput.value.length !== 6) {
      pincodeInput.style.borderColor = '#ff6b6b';
    } else {
      pincodeInput.style.borderColor = '#e0e0e0';
    }
  });
}

// Real-time validation for PAN
const panInput = document.getElementById('panNumber');
if (panInput) {
  panInput.addEventListener('input', () => {
    panInput.value = panInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
  });

  panInput.addEventListener('blur', () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (panInput.value && !panRegex.test(panInput.value)) {
      panInput.style.borderColor = '#ff6b6b';
    } else {
      panInput.style.borderColor = '#e0e0e0';
    }
  });
}

// Calculate EMI on repayment period change
const creditAmountInput = document.getElementById('creditAmount');
const repaymentPeriod = document.getElementById('repaymentPeriod');

if (repaymentPeriod) {
  repaymentPeriod.addEventListener('change', () => {
    const amount = parseFloat(creditAmountInput.value) || 0;
    const period = repaymentPeriod.value;

    if (amount > 0 && period) {
      const rates = {
        '30': 0,
        '90': 0.08,
        '180': 0.10,
        '360': 0.12
      };

      const annualRate = rates[period];
      const months = period / 30;
      const monthlyRate = annualRate / 12;

      // Simple EMI calculation
      let emi = 0;
      if (monthlyRate === 0) {
        emi = amount / months;
      } else {
        emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
              (Math.pow(1 + monthlyRate, months) - 1);
      }

      console.log(`EMI for ₹${amount} over ${months} months at ${annualRate * 100}% p.a.: ₹${emi.toFixed(2)}`);
    }
  });
}

// Log form state for debugging
console.log('Buy on Credit form script loaded successfully');
