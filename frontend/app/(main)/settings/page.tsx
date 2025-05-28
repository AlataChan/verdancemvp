'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * 系统设置类型定义
 */
interface SettingsState {
  notifications: {
    email: boolean;
    browser: boolean;
    tasks: boolean;
    news: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'team' | 'private';
    showRank: boolean;
    shareActivities: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
  };
}

/**
 * 设置页面
 * @returns {React.JSX.Element} 设置组件
 */
export default function SettingsPage(): React.JSX.Element {
  const { user } = useAuth();
  
  // 设置状态
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      email: true,
      browser: true,
      tasks: true,
      news: false,
    },
    privacy: {
      profileVisibility: 'team',
      showRank: true,
      shareActivities: true,
    },
    appearance: {
      theme: 'system',
      fontSize: 'medium',
    }
  });
  
  // 保存状态
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // 处理通知设置变更
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }));
  };
  
  // 处理隐私设置变更
  const handlePrivacyChange = (
    name: keyof SettingsState['privacy'], 
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [name]: value
      }
    }));
  };
  
  // 处理外观设置变更
  const handleAppearanceChange = (
    name: keyof SettingsState['appearance'],
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [name]: value
      }
    }));
  };
  
  // 保存设置
  const saveSettings = () => {
    setIsSaving(true);
    setSaveMessage('');
    
    // 模拟API调用
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('设置已保存');
      
      // 3秒后清除消息
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">系统设置</h1>
          <p className="text-sm text-gray-700">
            管理您的账户设置和偏好
          </p>
        </div>
        <div className="flex items-center">
          {saveMessage && (
            <p className="text-sm text-green-600 mr-3">{saveMessage}</p>
          )}
          <button
            onClick={saveSettings}
            disabled={isSaving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isSaving ? '保存中...' : '保存设置'}
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">通知设置</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="email"
                name="email"
                type="checkbox"
                checked={settings.notifications.email}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="email" className="font-medium text-gray-700">
                邮件通知
              </label>
              <p className="text-gray-500">接收有关任务更新、活动提醒和系统公告的邮件通知</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="browser"
                name="browser"
                type="checkbox"
                checked={settings.notifications.browser}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="browser" className="font-medium text-gray-700">
                浏览器通知
              </label>
              <p className="text-gray-500">在使用系统时接收浏览器推送通知</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="tasks"
                name="tasks"
                type="checkbox"
                checked={settings.notifications.tasks}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="tasks" className="font-medium text-gray-700">
                任务通知
              </label>
              <p className="text-gray-500">接收新任务分配、截止日期提醒等任务相关通知</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="news"
                name="news"
                type="checkbox"
                checked={settings.notifications.news}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="news" className="font-medium text-gray-700">
                新闻通讯
              </label>
              <p className="text-gray-500">接收ESG相关新闻、最佳实践和行业动态</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">隐私设置</h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-700">
              个人资料可见性
            </label>
            <div className="mt-1">
              <select
                id="profileVisibility"
                name="profileVisibility"
                value={settings.privacy.profileVisibility}
                onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="public">公开 - 所有人可见</option>
                <option value="team">团队 - 仅部门成员可见</option>
                <option value="private">私密 - 仅自己可见</option>
              </select>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              控制您的个人资料对其他用户的可见程度
            </p>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="showRank"
                name="showRank"
                type="checkbox"
                checked={settings.privacy.showRank}
                onChange={(e) => handlePrivacyChange('showRank', e.target.checked)}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="showRank" className="font-medium text-gray-700">
                在排行榜显示
              </label>
              <p className="text-gray-500">允许您的名字和积分在排行榜中显示</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="shareActivities"
                name="shareActivities"
                type="checkbox"
                checked={settings.privacy.shareActivities}
                onChange={(e) => handlePrivacyChange('shareActivities', e.target.checked)}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="shareActivities" className="font-medium text-gray-700">
                分享活动
              </label>
              <p className="text-gray-500">允许系统分享您完成的任务和获得的成就</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">界面设置</h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
              主题
            </label>
            <div className="mt-1">
              <select
                id="theme"
                name="theme"
                value={settings.appearance.theme}
                onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="light">浅色</option>
                <option value="dark">深色</option>
                <option value="system">跟随系统</option>
              </select>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              选择您偏好的界面主题
            </p>
          </div>
          
          <div>
            <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700">
              字体大小
            </label>
            <div className="mt-1">
              <select
                id="fontSize"
                name="fontSize"
                value={settings.appearance.fontSize}
                onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="small">小</option>
                <option value="medium">中</option>
                <option value="large">大</option>
              </select>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              调整界面文字大小
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 