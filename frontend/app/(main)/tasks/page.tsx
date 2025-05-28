'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

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
}

/**
 * 任务中心页面
 * @returns {React.JSX.Element} 任务中心组件
 */
export default function TasksPage(): React.JSX.Element {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // 模拟任务数据，实际项目中应该从API获取
  useEffect(() => {
    // 模拟API调用延迟
    setTimeout(() => {
      setTasks([
        {
          id: '1',
          title: '参与碳减排培训',
          description: '完成公司组织的碳减排意识培训课程',
          category: 'environmental',
          points: 50,
          date: '2025-06-15'
        },
        {
          id: '2',
          title: '参与志愿服务活动',
          description: '参与公司组织的社区志愿服务活动',
          category: 'social',
          points: 80,
          date: '2025-06-20'
        },
        {
          id: '3',
          title: '完成合规培训',
          description: '完成年度合规和商业道德培训',
          category: 'governance',
          points: 60,
          date: '2025-06-25'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  /**
   * 渲染任务类别标签
   * @param {string} category 任务类别
   * @returns {JSX.Element} 类别标签组件
   */
  const renderCategoryBadge = (category: string) => {
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
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryStyles[category as keyof typeof categoryStyles]}`}>
        {categoryLabels[category as keyof typeof categoryLabels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">任务中心</h1>
      <p className="text-sm text-gray-700">
        通过完成ESG相关任务获取积分，提升企业和个人的可持续发展能力。
      </p>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{task.title}</h3>
                    {renderCategoryBadge(task.category)}
                  </div>
                  <div className="ml-4 flex-shrink-0 bg-primary-50 rounded-full px-3 py-1.5 text-primary-700 font-medium text-sm">
                    {task.points} 积分
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600">{task.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">截止日期: {task.date}</span>
                  <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    参与任务
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 