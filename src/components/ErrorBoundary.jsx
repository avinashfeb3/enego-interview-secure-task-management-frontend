import React from 'react';
import { AlertTriangle, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-red-100 to-orange-50 p-3 sm:p-4 overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Error Card */}
          <div className="relative max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-red-100">
              {/* Header Line */}
              <div className="h-1 bg-gradient-to-r from-red-600 to-orange-600"></div>

              {/* Content */}
              <div className="p-6 sm:p-8 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-red-600 to-orange-600 p-4 rounded-full shadow-lg">
                    <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                  Oops! Something Went Wrong
                </h1>

                {/* Subtitle */}
                <p className="text-gray-600 text-sm sm:text-base mb-6">
                  An unexpected error occurred. Don't worry, we're here to help.
                </p>

                {/* Error Message */}
                {this.state.error?.message && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                    <p className="text-xs sm:text-sm text-red-700 font-mono break-words">
                      {this.state.error.message}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 px-6 py-3 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold transition-all"
                  >
                    Reload Page
                  </button>
                  <button
                    onClick={() => (window.location.href = '/tasks')}
                    className="flex-1 px-6 py-3 sm:py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    <span>Go To Dashboard</span>
                  </button>
                </div>

                {/* Help Text */}
                <p className="text-xs sm:text-sm text-gray-500 mt-6 pt-6 border-t border-gray-200">
                  If the problem persists, please contact support or try again later.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
