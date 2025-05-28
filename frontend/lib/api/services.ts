import apiClient from './client';

/**
 * 用户认证服务
 */
export const authService = {
  /**
   * 用户登录
   * @param email 电子邮箱
   * @param password 密码
   * @returns 登录结果，包含token和用户信息
   */
  login: async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await apiClient.post('/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  /**
   * 用户注册
   * @param userData 用户注册信息
   * @returns 注册结果
   */
  register: async (userData: any) => {
    // 确保后端需要的字段都包含在请求中
    const backendData = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      full_name: userData.full_name,
      department: userData.department,
      // 可以添加role字段，但默认是USER
    };
    
    const response = await apiClient.post('/register', backendData);
    return response.data;
  },

  /**
   * 获取当前用户信息
   * @returns 用户信息
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/user/me');
    return response.data;
  },

  /**
   * 退出登录
   */
  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
};

/**
 * 任务服务
 */
export const taskService = {
  /**
   * 获取所有任务
   * @param params 查询参数（分页、筛选等）
   * @returns 任务列表
   */
  getTasks: async (params?: any) => {
    const response = await apiClient.get('/tasks', { params });
    return response.data;
  },

  /**
   * 获取任务详情
   * @param taskId 任务ID
   * @returns 任务详情
   */
  getTask: async (taskId: string) => {
    const response = await apiClient.get(`/tasks/${taskId}`);
    return response.data;
  },

  /**
   * 创建新任务
   * @param taskData 任务数据
   * @returns 创建的任务
   */
  createTask: async (taskData: any) => {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  },

  /**
   * 更新任务
   * @param taskId 任务ID
   * @param taskData 更新的任务数据
   * @returns 更新后的任务
   */
  updateTask: async (taskId: string, taskData: any) => {
    const response = await apiClient.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  /**
   * 删除任务
   * @param taskId 任务ID
   */
  deleteTask: async (taskId: string) => {
    await apiClient.delete(`/tasks/${taskId}`);
  },

  /**
   * 参与任务
   * @param taskId 任务ID
   * @returns 参与结果
   */
  participateTask: async (taskId: string) => {
    const response = await apiClient.post(`/tasks/${taskId}/participate`);
    return response.data;
  },

  /**
   * 完成任务
   * @param taskId 任务ID
   * @param completionData 完成任务的相关数据
   * @returns 完成结果，通常包含获得的积分
   */
  completeTask: async (taskId: string, completionData?: any) => {
    const response = await apiClient.post(`/tasks/${taskId}/complete`, completionData);
    return response.data;
  }
};

/**
 * 积分服务
 */
export const pointService = {
  /**
   * 获取用户积分明细
   * @param params 查询参数（分页、时间范围等）
   * @returns 积分记录列表
   */
  getPointsHistory: async (params?: any) => {
    const response = await apiClient.get('/points/history', { params });
    return response.data;
  },

  /**
   * 获取积分排行榜
   * @param params 查询参数（时间范围、部门等）
   * @returns 排行榜数据
   */
  getLeaderboard: async (params?: any) => {
    const response = await apiClient.get('/points/leaderboard', { params });
    return response.data;
  },

  /**
   * 获取当前用户积分摘要
   * @returns 积分摘要信息
   */
  getPointsSummary: async () => {
    const response = await apiClient.get('/points/summary');
    return response.data;
  }
};

/**
 * 用户服务
 */
export const userService = {
  /**
   * 获取用户资料
   * @param userId 用户ID，不提供则获取当前用户
   * @returns 用户资料
   */
  getUserProfile: async (userId?: string) => {
    const url = userId ? `/users/${userId}/profile` : '/users/profile';
    const response = await apiClient.get(url);
    return response.data;
  },

  /**
   * 更新用户资料
   * @param profileData 更新的资料数据
   * @returns 更新后的用户资料
   */
  updateUserProfile: async (profileData: any) => {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  },

  /**
   * 更改密码
   * @param oldPassword 旧密码
   * @param newPassword 新密码
   */
  changePassword: async (oldPassword: string, newPassword: string) => {
    await apiClient.post('/users/change-password', {
      old_password: oldPassword,
      new_password: newPassword
    });
  }
}; 