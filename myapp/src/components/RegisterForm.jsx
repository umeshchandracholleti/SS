import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader, CheckCircle } from 'lucide-react';
import FormInput from './FormInput';
import { validateRegistrationForm } from '../utils/validation';
import { useAuth } from '../context/AuthContext';

/**
 * RegisterForm component - handles user registration with validation
 */
export const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    // Validate form
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      // Mark all fields as touched
      setTouched({
        fullName: true,
        email: true,
        phone: true,
        password: true,
        confirmPassword: true
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare data for backend (exclude confirmPassword)
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        password: formData.password
      };

      const result = await register(registrationData);

      if (result.success) {
        setSuccessMessage('Registration successful! Redirecting to home page...');
        // Redirect to home page on successful registration
        setTimeout(() => navigate('/'), 2000);
      } else {
        setServerError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setServerError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      {/* Server Error Alert */}
      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Full Name Input */}
      <FormInput
        label="Full Name"
        name="fullName"
        type="text"
        value={formData.fullName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.fullName ? errors.fullName : ''}
        placeholder="John Doe"
        required
      />

      {/* Email Input */}
      <FormInput
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email ? errors.email : ''}
        placeholder="you@example.com"
        required
      />

      {/* Phone Input (Optional) */}
      <FormInput
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.phone ? errors.phone : ''}
        placeholder="9876543210"
      />

      {/* Password Input */}
      <FormInput
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password ? errors.password : ''}
        placeholder="Create a strong password"
        required
      />

      {/* Confirm Password Input */}
      <FormInput
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.confirmPassword ? errors.confirmPassword : ''}
        placeholder="Confirm your password"
        required
      />

      {/* Password Requirements Info */}
      <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs font-medium text-blue-900 mb-2">Password Requirements:</p>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>✓ Minimum 8 characters</li>
          <li>✓ At least one uppercase letter (A-Z)</li>
          <li>✓ At least one number (0-9)</li>
          <li>✓ At least one special character (!@#$%^&*)</li>
        </ul>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {loading ? (
          <>
            <Loader size={18} className="animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </button>

      {/* Login Link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Login here
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
