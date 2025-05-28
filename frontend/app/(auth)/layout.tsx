'use client';

import Link from 'next/link';
import { AuthProvider } from '@/hooks/useAuth';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              蔚澜智越
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-primary-600">
                    首页
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-primary-600">
                    关于我们
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-primary-600">
                    联系我们
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main className="flex-grow">
          {children}
        </main>
        
        <footer className="bg-gray-100 py-4">
          <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} 蔚澜智越ESG积分与任务平台. 保留所有权利.
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
} 