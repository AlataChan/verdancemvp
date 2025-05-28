'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';

// 表单验证模式
const registerSchema = z.object({
  username: z.string().min(3, '用户名至少需要3个字符').max(20, '用户名最多20个字符'),
  email: z.string().email('请输入有效的电子邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
  confirmPassword: z.string(),
  full_name: z.string().min(2, '姓名至少需要2个字符'),
  department: z.string().min(1, '请选择部门'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 剔除confirmPassword字段
      const { confirmPassword, ...registerData } = data;
      
      await registerUser(registerData);
    } catch (err: any) {
      // 确保错误消息始终是字符串
      const errorMessage = typeof err.response?.data?.detail === 'string' 
        ? err.response?.data?.detail 
        : '注册失败，请检查输入信息';
      
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">注册账号</h1>
          <p className="mt-2 text-sm text-gray-600">
            加入蔚澜智越ESG积分与任务平台
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
              <label htmlFor="username" className="form-label">
                用户名 <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                className="form-input"
                {...register('username')}
              />
              {errors.username && (
                <p className="form-error">{errors.username.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="form-label">
                电子邮箱 <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                {...register('email')}
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="full_name" className="form-label">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                id="full_name"
                type="text"
                className="form-input"
                {...register('full_name')}
              />
              {errors.full_name && (
                <p className="form-error">{errors.full_name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="department" className="form-label">
                部门 <span className="text-red-500">*</span>
              </label>
              <select
                id="department"
                className="form-input"
                {...register('department')}
              >
                <option value="">请选择部门</option>
                <option value="人力资源">人力资源</option>
                <option value="财务">财务</option>
                <option value="市场营销">市场营销</option>
                <option value="技术开发">技术开发</option>
                <option value="运营">运营</option>
                <option value="行政">行政</option>
                <option value="其他">其他</option>
              </select>
              {errors.department && (
                <p className="form-error">{errors.department.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="form-label">
                密码 <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                {...register('password')}
              />
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                确认密码 <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="form-input"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="form-error">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              我已阅读并同意 <Link href="/terms" className="text-primary-600 hover:text-primary-500">服务条款</Link> 和 <Link href="/privacy" className="text-primary-600 hover:text-primary-500">隐私政策</Link>
            </label>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed"
            >
              {isLoading ? '注册中...' : '注册'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              已有账号?{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-500">
                立即登录
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 