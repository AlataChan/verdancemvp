import { User } from './auth';
import { Task } from './task';

/**
 * 积分记录类型
 */
export interface PointRecord {
  id: string;
  user_id: string;
  points: number;
  source_type: PointSourceType;
  source_id: string;
  description: string;
  created_at: string;
  user?: User;
  task?: Task;
}

/**
 * 积分来源类型枚举
 */
export enum PointSourceType {
  TASK_COMPLETION = 'task_completion',
  ADMIN_ADJUSTMENT = 'admin_adjustment',
  SYSTEM_REWARD = 'system_reward',
  BONUS = 'bonus',
}

/**
 * 积分摘要类型
 */
export interface PointSummary {
  total_points: number;
  points_this_month: number;
  points_this_week: number;
  completed_tasks: number;
  rank: number;
  department_rank: number;
}

/**
 * 排行榜用户类型
 */
export interface LeaderboardUser {
  id: string;
  username: string;
  full_name: string;
  department: string;
  profile_image?: string;
  points: number;
  rank: number;
  tasks_completed: number;
}

/**
 * 排行榜请求参数
 */
export interface LeaderboardParams {
  period?: 'all' | 'year' | 'month' | 'week' | 'day';
  department?: string;
  limit?: number;
  page?: number;
}

/**
 * 积分历史请求参数
 */
export interface PointHistoryParams {
  start_date?: string;
  end_date?: string;
  source_type?: PointSourceType;
  page?: number;
  limit?: number;
}

/**
 * 部门积分摘要
 */
export interface DepartmentPointSummary {
  department: string;
  total_points: number;
  member_count: number;
  average_points: number;
  rank: number;
} 