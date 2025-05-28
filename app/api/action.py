"""
用户行为（打卡）相关的API路由
"""
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from sqlmodel import Session, select, desc
from datetime import datetime, date, timedelta

from app.db import get_session
from app.models.action import UserAction, UserActionCreate, UserActionRead, UserActionUpdate, ActionStatus
from app.models.task import ESGTask
from app.models.user import User
from app.services.auth import get_current_user, get_current_admin
from app.services.points import add_points_for_action, get_user_points_history, get_user_ranking

router = APIRouter()

@router.post("/actions", response_model=UserActionRead, status_code=status.HTTP_201_CREATED)
def create_action(
    action: UserActionCreate, 
    request: Request,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    记录用户完成ESG任务的行为
    
    参数:
        action: 行为记录创建信息
        request: 请求对象，用于获取IP
        session: 数据库会话
        current_user: 当前登录用户
        
    返回:
        UserActionRead: 创建成功的行为记录
        
    异常:
        HTTPException: 当任务不存在或已经打卡时抛出
    """
    # 检查任务是否存在
    task = session.exec(select(ESGTask).where(ESGTask.id == action.task_id)).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="任务不存在"
        )
    
    # 检查是否已经为该任务打卡
    today = date.today().isoformat()
    if task.date != today:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="只能为今天的任务打卡"
        )
    
    existing_action = session.exec(
        select(UserAction).where(
            UserAction.user_id == current_user.id,
            UserAction.task_id == action.task_id
        )
    ).first()
    
    if existing_action:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="已经为该任务打卡"
        )
    
    # 创建行为记录
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent", "")
    
    db_action = UserAction(
        user_id=current_user.id,
        task_id=action.task_id,
        ip_address=client_ip,
        device_info=user_agent,
        comment=action.comment,
        status=ActionStatus.COMPLETED
    )
    
    session.add(db_action)
    
    # 增加用户积分
    add_points_for_action(session, current_user, task)
    
    session.commit()
    session.refresh(db_action)
    
    return db_action

@router.get("/actions", response_model=List[UserActionRead])
def get_user_actions(
    start_date: str = Query(None, description="开始日期（YYYY-MM-DD格式）"),
    end_date: str = Query(None, description="结束日期（YYYY-MM-DD格式）"),
    task_id: str = Query(None, description="任务ID"),
    status: ActionStatus = Query(None, description="行为状态"),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    获取当前用户的行为记录列表
    
    参数:
        start_date: 可选，过滤开始日期
        end_date: 可选，过滤结束日期
        task_id: 可选，过滤任务ID
        status: 可选，过滤行为状态
        session: 数据库会话
        current_user: 当前登录用户
        
    返回:
        List[UserActionRead]: 行为记录列表
    """
    query = select(UserAction).where(UserAction.user_id == current_user.id)
    
    # 添加过滤条件
    if start_date:
        start_datetime = datetime.fromisoformat(f"{start_date}T00:00:00")
        query = query.where(UserAction.timestamp >= start_datetime)
    
    if end_date:
        end_datetime = datetime.fromisoformat(f"{end_date}T23:59:59")
        query = query.where(UserAction.timestamp <= end_datetime)
    
    if task_id:
        query = query.where(UserAction.task_id == task_id)
    
    if status:
        query = query.where(UserAction.status == status)
    
    # 按时间降序排序
    query = query.order_by(desc(UserAction.timestamp))
    
    actions = session.exec(query).all()
    return actions

@router.get("/actions/{action_id}", response_model=UserActionRead)
def get_action(
    action_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    获取单个行为记录详情
    
    参数:
        action_id: 行为记录ID
        session: 数据库会话
        current_user: 当前登录用户
        
    返回:
        UserActionRead: 行为记录详情
        
    异常:
        HTTPException: 当记录不存在或不属于当前用户时抛出
    """
    action = session.exec(select(UserAction).where(UserAction.id == action_id)).first()
    
    if not action:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="行为记录不存在"
        )
    
    # 检查记录是否属于当前用户（管理员可以查看所有记录）
    if action.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权查看此记录"
        )
    
    return action

@router.patch("/actions/{action_id}", response_model=UserActionRead)
def update_action(
    action_id: str,
    action_update: UserActionUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin)  # 仅管理员可以更新状态
):
    """
    更新行为记录（管理员审核功能）
    
    参数:
        action_id: 行为记录ID
        action_update: 更新数据
        session: 数据库会话
        current_user: 当前管理员用户
        
    返回:
        UserActionRead: 更新后的行为记录
        
    异常:
        HTTPException: 当记录不存在时抛出
    """
    action = session.exec(select(UserAction).where(UserAction.id == action_id)).first()
    
    if not action:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="行为记录不存在"
        )
    
    # 更新状态
    if action_update.status is not None:
        action.status = action_update.status
    
    # 更新积分
    if action_update.points_earned is not None:
        # 计算积分差值
        points_diff = action_update.points_earned - action.points_earned
        
        # 更新用户总积分
        user = session.exec(select(User).where(User.id == action.user_id)).first()
        if user:
            user.points += points_diff
            session.add(user)
        
        # 更新行为记录积分
        action.points_earned = action_update.points_earned
    
    # 更新评论
    if action_update.comment is not None:
        action.comment = action_update.comment
    
    session.add(action)
    session.commit()
    session.refresh(action)
    
    return action

@router.get("/actions/stats", response_model=Dict[str, Any])
def get_user_action_stats(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    获取当前用户的行为统计信息
    
    参数:
        session: 数据库会话
        current_user: 当前登录用户
        
    返回:
        Dict[str, Any]: 统计信息
    """
    # 获取总记录数
    total_actions = session.exec(
        select(UserAction).where(UserAction.user_id == current_user.id)
    ).all()
    
    # 按类别统计
    task_ids = [action.task_id for action in total_actions]
    tasks = session.exec(select(ESGTask).where(ESGTask.id.in_(task_ids))).all()
    
    category_stats = {}
    for task in tasks:
        category = task.category
        category_stats[category] = category_stats.get(category, 0) + 1
    
    # 获取过去30天的积分历史
    points_history = get_user_points_history(session, current_user.id, 30)
    
    # 获取排名信息
    all_rankings = get_user_ranking(session, 100)  # 获取前100名
    user_rank = next((rank for user, rank in all_rankings if user.id == current_user.id), None)
    
    # 计算连续打卡天数
    today = datetime.utcnow().date()
    streak_days = 0
    
    for days_ago in range(30):  # 检查过去30天
        check_date = today - timedelta(days=days_ago)
        start_of_day = datetime.combine(check_date, datetime.min.time())
        end_of_day = datetime.combine(check_date, datetime.max.time())
        
        has_action = session.exec(
            select(UserAction)
            .where(
                UserAction.user_id == current_user.id,
                UserAction.timestamp >= start_of_day,
                UserAction.timestamp <= end_of_day,
                UserAction.status != ActionStatus.REJECTED
            )
        ).first() is not None
        
        if has_action:
            streak_days += 1
        elif days_ago > 0:  # 如果不是今天，连续记录中断
            break
    
    return {
        "total_actions": len(total_actions),
        "by_category": category_stats,
        "points_history": points_history,
        "current_rank": user_rank,
        "streak_days": streak_days,
        "total_points": current_user.points
    }

@router.get("/admin/actions", response_model=List[UserActionRead])
def admin_get_actions(
    user_id: str = Query(None, description="用户ID"),
    start_date: str = Query(None, description="开始日期（YYYY-MM-DD格式）"),
    end_date: str = Query(None, description="结束日期（YYYY-MM-DD格式）"),
    task_id: str = Query(None, description="任务ID"),
    status: ActionStatus = Query(None, description="行为状态"),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin)  # 仅管理员可访问
):
    """
    管理员获取所有用户的行为记录
    
    参数:
        user_id: 可选，过滤用户ID
        start_date: 可选，过滤开始日期
        end_date: 可选，过滤结束日期
        task_id: 可选，过滤任务ID
        status: 可选，过滤行为状态
        session: 数据库会话
        current_user: 当前管理员用户
        
    返回:
        List[UserActionRead]: 行为记录列表
    """
    query = select(UserAction)
    
    # 添加过滤条件
    if user_id:
        query = query.where(UserAction.user_id == user_id)
    
    if start_date:
        start_datetime = datetime.fromisoformat(f"{start_date}T00:00:00")
        query = query.where(UserAction.timestamp >= start_datetime)
    
    if end_date:
        end_datetime = datetime.fromisoformat(f"{end_date}T23:59:59")
        query = query.where(UserAction.timestamp <= end_datetime)
    
    if task_id:
        query = query.where(UserAction.task_id == task_id)
    
    if status:
        query = query.where(UserAction.status == status)
    
    # 按时间降序排序
    query = query.order_by(desc(UserAction.timestamp))
    
    actions = session.exec(query).all()
    return actions 