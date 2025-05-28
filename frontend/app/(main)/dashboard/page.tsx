'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { BarChart, Activity, Award, Calendar } from 'lucide-react';

/**
 * 任务类型定义
 */
interface Task {
  id: string;
  title: string;
  description: string;
  category: 'environmental' | 'social' | 'governance';
  points: number;
  date: string;
  status: 'pending' | 'in_progress' | 'completed';
}

/**
 * 仪表盘页面
 * @returns {React.JSX.Element} 仪表盘组件
 */
export default function DashboardPage(): React.JSX.Element {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    totalPoints: 0,
    completedTasks: 0,
    rankInDepartment: 0,
    pointsThisMonth: 0
  });
  
  // 模拟从API获取数据
  useEffect(() => {
    // 模拟API调用延迟
    setTimeout(() => {
      // 设置任务数据
      setTasks([
        {
          id: '1',
          title: '参与碳减排培训',
          description: '完成公司组织的碳减排意识培训课程',
          category: 'environmental',
          points: 50,
          date: '2025-06-15',
          status: 'pending'
        },
        {
          id: '2',
          title: '参与志愿服务活动',
          description: '参与公司组织的社区志愿服务活动',
          category: 'social',
          points: 80,
          date: '2025-06-20',
          status: 'in_progress'
        },
        {
          id: '3',
          title: '完成合规培训',
          description: '完成年度合规和商业道德培训',
          category: 'governance',
          points: 60,
          date: '2025-06-25',
          status: 'completed'
        }
      ]);
      
      // 设置统计数据
      setStats({
        totalPoints: user?.points_total || 750,
        completedTasks: 12,
        rankInDepartment: 3,
        pointsThisMonth: 120
      });
      
      setIsLoading(false);
    }, 1000);
  }, [user]);
  
  /**
   * 渲染统计卡片
   * @param {string} title 标题
   * @param {string|number} value 值
   * @param {React.ElementType} icon 图标组件
   * @returns {JSX.Element} 统计卡片组件
   */
  const renderStatCard = (
    title: string, 
    value: string | number, 
    icon: React.ElementType
  ) => {
    const Icon = icon;
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
            <Icon className="h-6 w-6 text-primary-600" />
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    );
  };
  
  /**
   * 渲染任务卡片
   * @param {Task} task 任务数据
   * @returns {JSX.Element} 任务卡片组件
   */
  const renderTaskCard = (task: Task) => {
    const categoryStyles = {
      environmental: 'bg-green-100 text-green-800',
      social: 'bg-blue-100 text-blue-800',
      governance: 'bg-purple-100 text-purple-800',
    };
    
    const categoryLabels = {
      environmental: '环境',
      social: '社会',
      governance: '治理',
    };
    
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
    };
    
    const statusLabels = {
      pending: '待处理',
      in_progress: '进行中',
      completed: '已完成',
    };
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryStyles[task.category]}`}>
              {categoryLabels[task.category]}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[task.status]}`}>
              {statusLabels[task.status]}
            </span>
          </div>
          <h3 className="mt-2 text-base font-medium text-gray-900">{task.title}</h3>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{task.description}</p>
          <div className="mt-3 flex justify-between items-center">
            <div className="text-sm text-gray-500">截止日期: {task.date}</div>
            <div className="text-sm font-medium text-primary-600">{task.points} 积分</div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <button className="w-full text-center text-sm font-medium text-primary-600 hover:text-primary-700">
            查看详情
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">仪表盘</h1>
        <p className="mt-2 text-sm text-gray-700">
          欢迎来到蔚澜智越ESG积分与任务平台。通过完成任务获取积分，提升个人和企业的可持续发展水平。
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {/* 统计数据 */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {renderStatCard('累计积分', stats.totalPoints, Award)}
            {renderStatCard('已完成任务', stats.completedTasks, Activity)}
            {renderStatCard('部门排名', `第 ${stats.rankInDepartment} 名`, BarChart)}
            {renderStatCard('本月积分', stats.pointsThisMonth, Calendar)}
          </div>
          
          {/* 进行中的任务 */}
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-medium text-gray-900">我的任务</h2>
              <a href="/tasks" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                查看全部
              </a>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.map(task => renderTaskCard(task))}
            </div>
          </div>
          
          {/* ESG活动与建议 */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-5">ESG活动与建议</h2>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-base font-medium text-gray-900">近期ESG活动</h3>
                <ul className="mt-3 space-y-3">
                  <li className="flex space-x-3">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green-600"></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">6月10日</span> - 世界环境日主题活动
                    </p>
                  </li>
                  <li className="flex space-x-3">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">6月18日</span> - ESG倡议讨论会
                    </p>
                  </li>
                  <li className="flex space-x-3">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">6月25日</span> - 可持续发展经验分享会
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 