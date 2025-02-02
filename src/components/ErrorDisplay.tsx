import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  message?: string;
  retry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  message = 'An error occurred while loading data',
  retry
}) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 blur-xl opacity-20" />
        <AlertCircle className="w-12 h-12 text-red-500 relative animate-bounce" />
      </div>
      <p className="mt-4 text-gray-800 dark:text-gray-200 font-medium">{message}</p>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Please check your connection and try again
      </p>
      {retry && (
        <button
          onClick={retry}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg
            hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg
            hover:shadow-indigo-500/25"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;