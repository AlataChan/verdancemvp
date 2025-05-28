'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, UserRole } from '@/types/auth';

/**
 * 排行用户类型定义
 */
interface LeaderboardUser extends User {
  rank: number;
}

/**
 * 积分排行页面
 * @returns {React.JSX.Element} 积分排行组件
 */
export default function LeaderboardPage(): React.JSX.Element {
  const { user } = useAuth();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'department'>('all');
  
  // 模拟排行榜数据，实际项目中应该从API获取
  useEffect(() => {
    // 模拟API调用延迟
    setTimeout(() => {
      setUsers([
        {
          id: '1',
          username: 'zhangwei',
          email: 'zhangwei@example.com',
          full_name: '张伟',
          department: '研发部',
          rank: 1,
          points_total: 1250,
          role: UserRole.USER,
          created_at: '2025-01-01',
          updated_at: '2025-01-01'
        },
        {
          id: '2',
          username: 'liuming',
          email: 'liuming@example.com',
          full_name: '刘明',
          department: '市场部',
          rank: 2,
          points_total: 980,
          role: UserRole.USER,
          created_at: '2025-01-01',
          updated_at: '2025-01-01'
        },
        {
          id: '3',
          username: 'wangjing',
          email: 'wangjing@example.com',
          full_name: '王静',
          department: '人力资源',
          rank: 3,
          points_total: 840,
          role: UserRole.USER,
          created_at: '2025-01-01',
          updated_at: '2025-01-01'
        },
        {
          id: '4',
          username: 'chenjia',
          email: 'chenjia@example.com',
          full_name: '陈佳',
          department: '研发部',
          rank: 4,
          points_total: 820,
          role: UserRole.USER,
          created_at: '2025-01-01',
          updated_at: '2025-01-01'
        },
        {
          id: '5',
          username: 'zhaolei',
          email: 'zhaolei@example.com',
          full_name: '赵雷',
          department: '财务部',
          rank: 5,
          points_total: 790,
          role: UserRole.USER,
          created_at: '2025-01-01',
          updated_at: '2025-01-01'
        },
        {
          id: '6',
          username: 'yanglin',
          email: 'yanglin@example.com',
          full_name: '杨林',
          department: '市场部',
          rank: 6,
          points_total: 760,
          role: UserRole.USER,
          created_at: '2025-01-01',
          updated_at: '2025-01-01'
        },
        {
          id: '7',
          username: 'sunyi',
          email: 'sunyi@example.com',
          full_name: '孙毅',
          department: '研发部',
          rank: 7,
          points_total: 740,
          role: UserRole.USER,
          created_at: '2025-01-01',
          updated_at: '2025-01-01'
        },
        {
          id: '8',
          username: 'huxiaojing',
          email: 'huxiaojing@example.com',
          full_name: '胡晓静',
          department: '人力资源',
          rank: 8,
          points_total: 720,
          role: UserRole.USER,
          created_at: '2025-01-01',
          updated_at: '2025-01-01'
        },
        {
          id: '9',
          username: 'chengtao',
          email: 'chengtao@example.com',
          full_name: '程涛',
          department: '财务部',
          rank: 9,
          points_total: 690,
          role: UserRole.USER,
          created_at: '2025-01-01',
          updated_at: '2025-01-01'
        },
        {
          id: '10',
          username: 'liuqian',
          email: 'liuqian@example.com',
          full_name: '刘倩',
          department: '市场部',
          rank: 10,
          points_total: 650,
          role: UserRole.USER,
          created_at: '2025-01-01',
          updated_at: '2025-01-01'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  // 根据选择的筛选条件过滤用户
  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(u => user && u.department === user.department);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">积分排行</h1>
      <p className="text-sm text-gray-700">
        查看ESG任务积分排行榜，激励团队共同参与可持续发展行动。
      </p>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          全公司排名
        </button>
        <button
          onClick={() => setFilter('department')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            filter === 'department'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          部门内排名
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  排名
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用户
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  部门
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  积分
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((leaderUser, index) => (
                <tr key={leaderUser.id} className={user && leaderUser.id === user.id ? 'bg-primary-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {index + 1 <= 3 ? (
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-900 bg-opacity-20 text-yellow-900'
                      } font-bold`}>
                        {index + 1}
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-gray-700">
                        {index + 1}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-medium">{leaderUser.full_name.slice(0, 1)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{leaderUser.full_name}</div>
                        <div className="text-sm text-gray-500">{leaderUser.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{leaderUser.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-primary-600">{leaderUser.points_total} 分</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 