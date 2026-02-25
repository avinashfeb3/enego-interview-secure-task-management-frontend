import React from 'react';

export const Input = (
  {
    label,
    error,
    type = 'text',
    className = '',
    ...props
  },
  ref
) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-800">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`w-full px-4 py-3 sm:py-2.5 text-sm sm:text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 
          ${
            error
              ? 'border-red-500 focus:border-red-600 focus:ring-red-200 bg-red-50'
              : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200 hover:border-slate-400'
          } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs sm:text-sm text-red-600 font-medium flex items-center gap-1">
          ✕ {error}
        </p>
      )}
    </div>
  );
};

export default React.forwardRef(Input);
