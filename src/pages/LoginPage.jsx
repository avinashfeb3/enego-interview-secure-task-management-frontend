import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import authAPI from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { Lock, Mail } from 'lucide-react';

export const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();
  const { error: showError, success: showSuccess } = useNotification();

  const mutation = useMutation({
    mutationFn: (data) => {
      return authAPI.login(data);
    },
    onSuccess: (response) => {
      console.log('Login successful:', response.data);
      const { token, user } = response.data;
      if (!token || !user) {
        showError('Invalid response from server');
        return;
      }
      login(token, user);
      showSuccess('Login successful!');
      // Add small delay to allow auth context state to update before navigating
      setTimeout(() => {
        navigate('/tasks');
      }, 100);
    },
    onError: (err) => {
      const message = err.response?.data?.message || err.message || 'Login failed';
      console.error('Login error:', {
        message,
        status: err.response?.status,
        data: err.response?.data,
      });
      showError(message);
      setErrors({ submit: message });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-3 sm:p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Login Card */}
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
                  <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Secure Task Management System
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-2 font-medium">
                Secure & Efficient Task Management
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
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                    className="pl-12 text-base"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={errors.password}
                    className="pl-12 text-base"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-3 sm:py-2.5 text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!formData.email || !formData.password}
                loading={mutation.isPending}
              >
                {mutation.isPending ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6 sm:mt-8 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-xs sm:text-sm text-gray-500 font-medium">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Signup Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-700 text-sm sm:text-base">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Sign up here
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

export default LoginPage;
