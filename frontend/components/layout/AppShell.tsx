'use client';

import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { User } from '@/types/auth'; // 假设User类型定义在此

/**
 * AppShell 组件属性
 * @interface AppShellProps
 */
interface AppShellProps {
  children: ReactNode;
  user: User; // 添加 user 属性
}

/**
 * 应用主外壳布局
 * @param {AppShellProps} props - 组件属性
 * @returns {React.JSX.Element} AppShell 组件
 */
export const AppShell = ({ children, user }: AppShellProps): React.JSX.Element => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}; 