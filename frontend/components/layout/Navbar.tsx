'use client';

import React from 'react';
import { User } from '@/types/auth'; // 假设User类型定义在此
import { Bell, Search } from 'lucide-react';

/**
 * Navbar 组件属性
 * @interface NavbarProps
 */
interface NavbarProps {
  user: User;
}

/**
 * 顶部导航栏组件
 * @param {NavbarProps} props - 组件属性
 * @returns {React.JSX.Element} Navbar 组件
 */
export default function Navbar({ user }: NavbarProps): React.JSX.Element {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* 左侧：搜索框等 (可选) */}
      <div className="flex items-center">
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <input 
          type="text" 
          placeholder="搜索任务或用户..." 
          className="text-sm focus:outline-none"
        />
      </div>

      {/* 右侧：通知、用户头像等 */}
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="flex items-center">
          {user.profile_image ? (
            <img 
              src={user.profile_image} 
              alt={user.username} 
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold">
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
            {user.full_name || user.username}
          </span>
        </div>
      </div>
    </header>
  );
} 