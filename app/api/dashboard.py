"""
仪表盘数据API路由
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select, func, desc
from typing import Dict, Any, List
from datetime import datetime, timedelta

from app.db import get_session
from app.services.auth import get_current_user, get_current_admin
from app.models.user import User, UserRead
from app.models.action import UserAction
from app.models.task import ESGTask, ESGTaskCategory
from app.services.points import get_user_ranking

router = APIRouter()

@router.get("/dashboard/user", response_model=Dict[str, Any])
def get_user_dashboard(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    获取用户仪表盘数据
    
    返回用户的积分、任务完成情况和最近活动等统计信息
    
    参数:
        current_user: 当前登录用户
        session: 数据库会话
        
    返回:
        Dict[str, Any]: 仪表盘数据
    """
    # 查询用户总共完成的任务数
    total_actions = session.exec(
        select(func.count()).where(UserAction.user_id == current_user.id)
    ).one()
    
    # 查询用户最近7天完成的任务数
    seven_days_ago = datetime.now() - timedelta(days=7)
    recent_actions = session.exec(
        select(func.count()).where(
            UserAction.user_id == current_user.id,
            UserAction.timestamp >= seven_days_ago
        )
    ).one()
    
    # 查询用户最近的5条活动记录
    recent_activities = session.exec(
        select(UserAction)
        .where(UserAction.user_id == current_user.id)
        .order_by(desc(UserAction.timestamp))
        .limit(5)
    ).all()
    
    # 查询用户各任务类别的完成情况
    task_categories = {}
    for category in [cat.value for cat in ESGTaskCategory]:
        count = session.exec(
            select(func.count())
            .join(ESGTask, UserAction.task_id == ESGTask.id)
            .where(
                UserAction.user_id == current_user.id,
                ESGTask.category == category
            )
        ).one()
        task_categories[category] = count
    
    # 构建仪表盘数据
    dashboard_data = {
        "user_id": current_user.id,
        "username": current_user.username,
        "points": current_user.points,
        "total_tasks_completed": total_actions,
        "recent_tasks_completed": recent_actions,
        "tasks_by_category": task_categories,
        "recent_activities": [
            {
                "id": act.id,
                "task_id": act.task_id,
                "timestamp": act.timestamp,
                "status": act.status,
                "points_earned": act.points_earned
            }
            for act in recent_activities
        ]
    }
    
    return dashboard_data

@router.get("/dashboard/admin", response_model=Dict[str, Any])
def get_admin_dashboard(
    current_user: User = Depends(get_current_admin),
    session: Session = Depends(get_session)
):
    """
    获取管理员仪表盘数据
    
    返回系统级别的统计信息
    
    参数:
        current_user: 当前管理员用户
        session: 数据库会话
        
    返回:
        Dict[str, Any]: 管理员仪表盘数据
    """
    # 查询总用户数
    total_users = session.exec(select(func.count()).select_from(User)).one()
    
    # 查询总任务数
    total_tasks = session.exec(select(func.count()).select_from(ESGTask)).one()
    
    # 查询总完成任务数
    total_actions = session.exec(select(func.count()).select_from(UserAction)).one()
    
    # 查询最近7天注册的用户数
    seven_days_ago = datetime.now() - timedelta(days=7)
    new_users = session.exec(
        select(func.count()).where(User.created_at >= seven_days_ago)
    ).one()
    
    # 查询最近7天完成的任务数
    recent_actions = session.exec(
        select(func.count()).where(UserAction.timestamp >= seven_days_ago)
    ).one()
    
    # 查询各任务类别的完成情况
    task_categories = {}
    for category in [cat.value for cat in ESGTaskCategory]:
        count = session.exec(
            select(func.count())
            .select_from(UserAction)
            .join(ESGTask, UserAction.task_id == ESGTask.id)
            .where(ESGTask.category == category)
        ).one()
        task_categories[category] = count
    
    # 查询今日活跃用户数
    today = datetime.now().date()
    start_of_day = datetime.combine(today, datetime.min.time())
    end_of_day = datetime.combine(today, datetime.max.time())
    
    active_users_today = session.exec(
        select(func.count(func.distinct(UserAction.user_id)))
        .where(
            UserAction.timestamp >= start_of_day,
            UserAction.timestamp <= end_of_day
        )
    ).one()
    
    # 获取表现最好的10名用户
    top_users = session.exec(
        select(User)
        .order_by(desc(User.points))
        .limit(10)
    ).all()
    
    # 构建管理员仪表盘数据
    admin_dashboard = {
        "total_users": total_users,
        "total_tasks": total_tasks,
        "total_actions": total_actions,
        "new_users_last_7_days": new_users,
        "actions_last_7_days": recent_actions,
        "actions_by_category": task_categories,
        "active_users_today": active_users_today,
        "top_users": [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "points": user.points
            }
            for user in top_users
        ]
    }
    
    return admin_dashboard

@router.get("/leaderboard", response_model=List[Dict[str, Any]])
def get_leaderboard(
    limit: int = Query(10, ge=1, le=100, description="返回的用户数量"),
    session: Session = Depends(get_session)
):
    """
    获取用户积分排行榜
    
    参数:
        limit: 返回的用户数量，默认10，最大100
        session: 数据库会话
        
    返回:
        List[Dict[str, Any]]: 排行榜数据
    """
    rankings = get_user_ranking(session, limit)
    
    leaderboard = [
        {
            "rank": rank,
            "user_id": user.id,
            "username": user.username,
            "points": user.points
        }
        for user, rank in rankings
    ]
    
    return leaderboard

@router.get("/dashboard/overview", response_model=Dict[str, Any])
def get_system_overview(
    session: Session = Depends(get_session)
):
    """
    获取系统概览数据（公开API，无需登录）
    
    参数:
        session: 数据库会话
        
    返回:
        Dict[str, Any]: 系统概览数据
    """
    # 查询总用户数
    total_users = session.exec(select(func.count()).select_from(User)).one()
    
    # 查询总任务数
    total_tasks = session.exec(select(func.count()).select_from(ESGTask)).one()
    
    # 查询总完成任务数
    total_actions = session.exec(select(func.count()).select_from(UserAction)).one()
    
    # 查询各任务类别的完成情况
    task_categories = {}
    for category in [cat.value for cat in ESGTaskCategory]:
        count = session.exec(
            select(func.count())
            .select_from(UserAction)
            .join(ESGTask, UserAction.task_id == ESGTask.id)
            .where(ESGTask.category == category)
        ).one()
        task_categories[category] = count
    
    # 获取前5名用户
    top_users = session.exec(
        select(User)
        .order_by(desc(User.points))
        .limit(5)
    ).all()
    
    # 构建系统概览数据
    overview = {
        "total_users": total_users,
        "total_tasks": total_tasks,
        "total_actions": total_actions,
        "actions_by_category": task_categories,
        "top_users": [
            {
                "username": user.username,
                "points": user.points,
                "rank": idx + 1
            }
            for idx, user in enumerate(top_users)
        ]
    }
    
    return overview

