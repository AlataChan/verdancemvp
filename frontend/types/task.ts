import { User } from './auth';

/**
 * 任务状态枚举
 */
export enum TaskStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

/**
 * 任务类型枚举
 */
export enum TaskType {
  INDIVIDUAL = 'individual',
  TEAM = 'team',
  DEPARTMENT = 'department',
  COMPANY = 'company',
}

/**
 * 任务参与状态枚举
 */
export enum ParticipationStatus {
  NOT_STARTED = 'not_started',
  PARTICIPATING = 'participating',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

/**
 * 任务模型定义
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  type: TaskType;
  category: string;
  points_reward: number;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  max_participants?: number;
  current_participants?: number;
  requirements?: string;
  attachments?: TaskAttachment[];
  tags?: string[];
  creator?: User;
}

/**
 * 任务附件类型
 */
export interface TaskAttachment {
  id: string;
  task_id: string;
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

/**
 * 任务参与记录
 */
export interface TaskParticipation {
  id: string;
  task_id: string;
  user_id: string;
  status: ParticipationStatus;
  joined_at: string;
  completed_at?: string;
  points_earned?: number;
  evidence?: string;
  feedback?: string;
  user?: User;
  task?: Task;
}

/**
 * 任务创建请求
 */
export interface CreateTaskRequest {
  title: string;
  description: string;
  type: TaskType;
  category: string;
  points_reward: number;
  start_date: string;
  end_date: string;
  requirements?: string;
  max_participants?: number;
  tags?: string[];
}

/**
 * 任务筛选参数
 */
export interface TaskFilterParams {
  status?: TaskStatus;
  type?: TaskType;
  category?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
  created_by?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * 任务参与请求
 */
export interface TaskParticipationRequest {
  task_id: string;
}

/**
 * 任务完成请求
 */
export interface TaskCompletionRequest {
  task_id: string;
  evidence?: string;
  feedback?: string;
}

/**
 * 任务完成响应
 */
export interface TaskCompletionResponse {
  message: string;
  points_earned: number;
  participation: TaskParticipation;
} 