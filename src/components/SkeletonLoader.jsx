import React from 'react';

export const SkeletonLoader = ({ count = 5 }) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="hidden md:block bg-white rounded-xl shadow-md p-4 sm:p-6 border border-slate-100 animate-pulse"
        >
          {/* Desktop Table Row Skeleton */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-3/4"></div>
              <div className="h-3 bg-gradient-to-r from-slate-100 to-slate-50 rounded w-2/3"></div>
            </div>
            <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-20"></div>
            <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-20"></div>
            <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-24"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-16"></div>
              <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}

      {/* Mobile Card Skeleton */}
      <div className="md:hidden space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={`mobile-${index}`}
            className="bg-white rounded-lg shadow-sm p-4 border border-slate-200 animate-pulse"
          >
            <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gradient-to-r from-slate-100 to-slate-50 rounded w-full mb-2"></div>
            <div className="h-3 bg-gradient-to-r from-slate-100 to-slate-50 rounded w-2/3 mb-4"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-16"></div>
              <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-16"></div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-10 bg-gradient-to-r from-slate-200 to-slate-100 rounded"></div>
              <div className="flex-1 h-10 bg-gradient-to-r from-slate-200 to-slate-100 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
