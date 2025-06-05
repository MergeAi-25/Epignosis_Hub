
import React from 'react';

const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg', message?: string }> = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className={`animate-spin rounded-full border-t-4 border-b-4 border-ep-primary ${sizeClasses[size]}`}></div>
      {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
