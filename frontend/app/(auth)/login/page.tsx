'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await login(data.email, data.password);
    } catch (err: any) {
      const errorMessage = typeof err.response?.data?.detail === 'string' 
        ? err.response?.data?.detail 
        : '登录失败，请检查邮箱和密码';
      
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">登录</h1>
          <p className="mt-2 text-sm text-gray-600">
            欢迎回到蔚澜智越ESG积分与任务平台
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">
                电子邮箱
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                {...register('email', { required: '请输入邮箱' })}
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="form-label">
                密码
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                {...register('password', { required: '请输入密码' })}
              />
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                记住我
              </label>
            </div>
            
            <div className="text-sm">
              <Link href="/forgot-password" className="text-primary-600 hover:text-primary-500">
                忘记密码?
              </Link>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed"
            >
              {isLoading ? '登录中...' : '登录'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              还没有账号?{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-500">
                立即注册
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 