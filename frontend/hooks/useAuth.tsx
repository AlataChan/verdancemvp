'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/services';
import { 
  User, 
  AuthContextType, 
  LoginRequest, 
  RegisterRequest 
} from '@/types/auth';

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者属性
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 认证提供者组件
 * @param children 子组件
 * @returns 认证上下文提供者
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 检查用户是否已认证
  const isAuthenticated = !!user;

  /**
   * 加载当前用户信息
   */
  const loadUser = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setError(null);
    } catch (err) {
      console.error('Failed to load user:', err);
      localStorage.removeItem('auth_token');
      setUser(null);
      setError('获取用户信息失败');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 用户登录
   * @param email 电子邮箱
   * @param password 密码
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.login(email, password);
      
      // 保存token
      localStorage.setItem('auth_token', response.access_token);
      
      // 如果登录响应中包含用户信息，直接使用
      if (response.user) {
        setUser(response.user);
      } else {
        // 否则单独请求用户信息
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
      
      // 使用直接导航而不是router.push，确保重定向成功
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.response?.data?.detail || '登录失败，请检查邮箱和密码');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 用户注册
   * @param data 注册数据
   */
  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await authService.register(data);
      
      // 注册成功后自动登录，使用email作为登录名
      await login(data.email, data.password);
    } catch (err: any) {
      console.error('Registration failed:', err);
      const errorDetail = err.response?.data?.detail;
      setError(errorDetail || '注册失败，请检查输入信息');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 用户登出
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      setIsLoading(false);
      router.push('/login');
    }
  };

  // 首次渲染时加载用户信息
  useEffect(() => {
    loadUser();
  }, []);

  // 提供的上下文值
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 使用认证Hook
 * @returns 认证上下文
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth; 