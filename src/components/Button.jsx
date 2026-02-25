import React from 'react';
import { Loader } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses =
    'font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center gap-2';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg focus:ring-blue-500 active:from-blue-800 active:to-blue-900',
    secondary:
      'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-md focus:ring-gray-400 active:bg-gray-300',
    danger:
      'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-lg focus:ring-red-500 active:from-red-700 active:to-red-800',
    ghost:
      'text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:ring-gray-400 active:bg-gray-200',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs sm:text-sm',
    md: 'px-4 py-2 sm:py-2 text-sm sm:text-base',
    lg: 'px-6 py-3 sm:py-3 text-base sm:text-lg',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          <span className="hidden sm:inline">Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
