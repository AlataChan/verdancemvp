'use client';

import React from 'react';

/**
 * 加载指示器组件
 * @returns {React.JSX.Element} LoadingSpinner 组件
 */
export default function LoadingSpinner(): React.JSX.Element {
  return (
    <div className="flex justify-center items-center">
      <div 
        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">加载中...</span>
      </div>
    </div>
  );
} 