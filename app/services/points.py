"""
积分管理服务
"""
from sqlmodel import Session, select, desc
from typing import Dict, Optional, List, Tuple
from datetime import datetime, timedelta

from app.models.user import User
from app.models.task import ESGTask
from app.models.action import UserAction, ActionStatus

# 积分规则：不同类别任务的积分奖励
POINTS_BY_CATEGORY: Dict[str, int] = {
    "environment": 10,  # 环境类任务10分
    "society": 8,       # 社会类任务8分
    "governance": 12,   # 治理类任务12分
}

# 默认积分
DEFAULT_POINTS = 5

# 连续打卡奖励规则
STREAK_BONUSES = {
    3: 5,    # 连续3天额外奖励5分
    7: 10,   # 连续7天额外奖励10分
    30: 50,  # 连续30天额外奖励50分
}

def add_points_for_action(session: Session, user: User, task: ESGTask, bonus_points: Optional[int] = None) -> int:
    """
    用户完成任务后增加积分
    
    参数:
        session: 数据库会话
        user: 用户对象
        task: 任务对象
        bonus_points: 可选，额外奖励积分
        
    返回:
        int: 增加后的总积分
    """
    # 根据任务类别获取基础积分
    base_points = POINTS_BY_CATEGORY.get(task.category, DEFAULT_POINTS)
    
    # 计算连续打卡天数奖励
    streak_bonus = calculate_streak_bonus(session, user.id)
    
    # 计算总积分（基础积分 + 连续打卡奖励 + 额外积分）
    points_to_add = base_points + streak_bonus + (bonus_points or 0)
    
    # 更新用户积分
    user.points += points_to_add
    session.add(user)
    
    # 更新最新的行为记录的积分字段
    latest_action = session.exec(
        select(UserAction)
        .where(
            UserAction.user_id == user.id,
            UserAction.task_id == task.id
        )
        .order_by(desc(UserAction.timestamp))
        .limit(1)
    ).first()
    
    if latest_action:
        latest_action.points_earned = points_to_add
        session.add(latest_action)
    
    return user.points


def calculate_streak_bonus(session: Session, user_id: str) -> int:
    """
    计算用户连续打卡的奖励积分
    
    参数:
        session: 数据库会话
        user_id: 用户ID
        
    返回:
        int: 连续打卡奖励积分
    """
    today = datetime.utcnow().date()
    streak_days = 1  # 今天算第一天
    
    # 检查过去30天的打卡记录
    for days_ago in range(1, 31):
        check_date = today - timedelta(days=days_ago)
        start_of_day = datetime.combine(check_date, datetime.min.time())
        end_of_day = datetime.combine(check_date, datetime.max.time())
        
        # 查询该日期是否有打卡记录
        has_action = session.exec(
            select(UserAction)
            .where(
                UserAction.user_id == user_id,
                UserAction.timestamp >= start_of_day,
                UserAction.timestamp <= end_of_day,
                UserAction.status != ActionStatus.REJECTED
            )
        ).first() is not None
        
        if has_action:
            streak_days += 1
        else:
            # 连续打卡中断
            break
    
    # 根据连续天数返回奖励积分
    for days, bonus in sorted(STREAK_BONUSES.items(), reverse=True):
        if streak_days >= days:
            return bonus
    
    return 0


def get_user_ranking(session: Session, limit: int = 10) -> List[Tuple[User, int]]:
    """
    获取用户积分排行榜
    
    参数:
        session: 数据库会话
        limit: 返回的用户数量
        
    返回:
        List[Tuple[User, int]]: 用户和排名的元组列表
    """
    users = session.exec(
        select(User)
        .order_by(desc(User.points))
        .limit(limit)
    ).all()
    
    # 添加排名信息
    ranking = [(user, idx + 1) for idx, user in enumerate(users)]
    return ranking


def get_user_points_history(session: Session, user_id: str, days: int = 30) -> Dict[str, int]:
    """
    获取用户过去一段时间的积分历史
    
    参数:
        session: 数据库会话
        user_id: 用户ID
        days: 天数，默认30天
        
    返回:
        Dict[str, int]: 日期和积分的字典
    """
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # 查询用户在该时间范围内的所有行为记录
    actions = session.exec(
        select(UserAction)
        .where(
            UserAction.user_id == user_id,
            UserAction.timestamp >= start_date,
            UserAction.status != ActionStatus.REJECTED
        )
    ).all()
    
    # 按日期统计积分
    points_history = {}
    for action in actions:
        date_str = action.timestamp.date().isoformat()
        points_history[date_str] = points_history.get(date_str, 0) + action.points_earned
    
    return points_history
