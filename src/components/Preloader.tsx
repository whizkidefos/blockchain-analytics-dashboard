import React from 'react';
import { Activity } from 'lucide-react';

const Preloader: React.FC = () => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-xl opacity-20 animate-pulse" />
        <Activity className="w-12 h-12 text-indigo-500 animate-spin relative" />
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">Loading data...</p>
      <div className="mt-4 flex gap-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-indigo-500"
            style={{
              animation: `bounce 1.4s infinite ease-in-out ${i * 0.16}s`
            }}
          />
        ))}
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
        `
      }} />
    </div>
  );
};

export default Preloader;