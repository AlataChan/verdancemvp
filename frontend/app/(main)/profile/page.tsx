'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * 个人资料页面
 * @returns {React.JSX.Element} 个人资料组件
 */
export default function ProfilePage(): React.JSX.Element {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    full_name: user?.full_name || '',
    email: user?.email || '',
    department: user?.department || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里应该调用API更新用户信息
    console.log('提交更新:', formData);
    // 模拟API调用成功
    setTimeout(() => {
      setIsEditing(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">个人资料</h1>
      <p className="text-sm text-gray-700">
        查看和编辑您的个人信息
      </p>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-24 w-24 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 text-2xl font-medium">
                  {user?.full_name ? user.full_name.slice(0, 1) : 'U'}
                </span>
              </div>
              <div className="ml-6">
                <h2 className="text-xl font-semibold text-gray-900">{user?.full_name}</h2>
                <p className="text-sm text-gray-600">{user?.department}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <p className="text-sm mt-2">
                  <span className="font-medium text-primary-600">{user?.points_total || 0}</span>
                  <span className="text-gray-600 ml-1">ESG积分</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isEditing ? '取消' : '编辑资料'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    用户名
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                    姓名
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="full_name"
                      id="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    电子邮箱
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      disabled
                    />
                    <p className="mt-1 text-xs text-gray-500">邮箱不可更改</p>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    部门
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="department"
                      id="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-3"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  保存
                </button>
              </div>
            </form>
          ) : (
            <div className="border-t border-gray-200 mt-6 pt-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">用户名</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.username}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">姓名</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.full_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">电子邮箱</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">部门</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.department}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">加入时间</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('zh-CN') : ''}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">账户角色</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.role === 'admin' ? '管理员' : 
                     user?.role === 'manager' ? '经理' : '普通用户'}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">安全设置</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">修改密码</h4>
              <p className="mt-1 text-sm text-gray-600">
                定期更新密码可提高账户安全性
              </p>
            </div>
            <button
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              修改密码
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 