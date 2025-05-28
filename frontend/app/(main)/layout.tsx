'use client';

import React, { ReactNode } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner'; // 假设你有一个加载组件

/**
 * 应用主路由组布局属性
 * @interface AppLayoutProps
 */
interface AppLayoutProps {
  children: ReactNode;
}

/**
 * 应用主路由组布局
 * @param {AppLayoutProps} props - 组件属性
 * @returns {React.JSX.Element} 布局组件
 */
export default function AppLayout({ children }: AppLayoutProps): React.JSX.Element {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // 断言 user 不为 null，因为 isAuthenticated 为 true 时 user 必然存在
  const currentUser = user!;

  return <AppShell user={currentUser}>{children}</AppShell>;
} 