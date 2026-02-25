import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import authAPI from '../services/authService';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { UserPlus } from 'lucide-react';

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { error: showError, success: showSuccess } = useNotification();

  const mutation = useMutation({
    mutationFn: (data) => authAPI.signup(data),
    onSuccess: (response) => {
      showSuccess('Account created successfully!');
      navigate('/login');
    },
    onError: (err) => {
      console.error('Full error:', err);
      const message = err.response?.data?.message || 'Signup failed';
      const backendErrors = err.response?.data?.errors || [];
      
      // Convert backend errors to field-specific errors
      const fieldErrors = {};
      if (Array.isArray(backendErrors)) {
        backendErrors.forEach((error) => {
          fieldErrors[error.field] = error.message;
        });
      }
      
      showError(message);
      setErrors(fieldErrors.length > 0 ? fieldErrors : { submit: message });
    },
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    const { confirmPassword, ...submitData } = formData;
    mutation.mutate(submitData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-3 sm:p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Signup Card */}
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
          {/* Header Gradient */}
          <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-800"></div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 sm:p-4 rounded-full shadow-lg">
                  <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Create Account
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-2 font-medium">
                Join our task management platform
              </p>
            </div>

            {/* Error Alert */}
            {errors.submit && (
              <div className="mb-6 p-4 sm:p-5 bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-semibold text-sm sm:text-base">
                  ⚠️ {errors.submit}
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800">
                  Full Name
                </label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                  className="text-base"
                  required
                />
                {errors.name && (
                  <p className="text-xs text-red-600 font-medium">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                  className="text-base"
                  required
                />
                {errors.email && (
                  <p className="text-xs text-red-600 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={errors.password}
                  className="text-base"
                  required
                />
                {errors.password && (
                  <p className="text-xs text-red-600 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  error={errors.confirmPassword}
                  className="text-base"
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 font-medium">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-3 sm:py-2.5 text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                disabled={!formData.name || !formData.email || !formData.password}
                loading={mutation.isPending}
              >
                {mutation.isPending ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6 sm:mt-8 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-xs sm:text-sm text-gray-500 font-medium">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-700 text-sm sm:text-base">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white text-xs mt-6 opacity-80">
          Copyright © 2026 Secure Task Management System. All rights reserved | Designed & Devleoped By Avinash Singh.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
