/**
 * 用户类型定义
 */
export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  department: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  profile_image?: string;
  points_total: number;
}

/**
 * 用户角色枚举
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

/**
 * 登录请求类型
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 登录响应类型
 */
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

/**
 * 注册请求类型
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
  department: string;
}

/**
 * 注册响应类型
 */
export interface RegisterResponse {
  message: string;
  user: User;
}

/**
 * 认证上下文类型
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

/**
 * 更改密码请求类型
 */
export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
} 