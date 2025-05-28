'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, BarChart2, CheckSquare, Settings, User, LogOut } from 'lucide-react'; // 使用 lucide-react 图标

/**
 * 侧边栏导航项
 * @interface NavItemProps
 */
interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

/**
 * 侧边栏导航项组件
 * @param {NavItemProps} props - 组件属性
 * @returns {React.JSX.Element} NavItem 组件
 */
const NavItem = ({ href, icon: Icon, label }: NavItemProps): React.JSX.Element => (
  <Link href={href} className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-primary-100 hover:text-primary-700 rounded-md transition-colors duration-150">
    <Icon className="w-5 h-5 mr-3" />
    {label}
  </Link>
);

/**
 * 侧边栏组件
 * @returns {React.JSX.Element} Sidebar 组件
 */
export default function Sidebar(): React.JSX.Element {
  const navItems = [
    { href: '/dashboard', icon: Home, label: '仪表盘' },
    { href: '/tasks', icon: CheckSquare, label: '任务中心' },
    { href: '/leaderboard', icon: BarChart2, label: '积分排行' },
    { href: '/profile', icon: User, label: '个人资料' },
    { href: '/settings', icon: Settings, label: '设置' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link href="/dashboard" className="flex flex-col items-center">
          <div className="w-24 h-24 relative mb-2">
            <Image 
              src="/images/logo.svg" 
              alt="蔚澜智越" 
              fill 
              style={{ objectFit: 'contain' }} 
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-primary-600">蔚澜智越</h1>
        </Link>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center w-full px-4 py-2.5 text-gray-700 hover:bg-red-100 hover:text-red-700 rounded-md transition-colors duration-150">
          <LogOut className="w-5 h-5 mr-3" />
          退出登录
        </button>
      </div>
    </aside>
  );
} 