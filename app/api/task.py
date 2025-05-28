"""
ESG任务相关的API路由
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from datetime import date

from app.db import get_session
from app.models.task import ESGTask, ESGTaskRead, ESGTaskCreate, ESGTaskCategory
from app.services.auth import get_current_user, get_current_admin
from app.models.user import User # 引入User模型用于类型提示

router = APIRouter()

@router.post("/tasks", response_model=ESGTaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    task: ESGTaskCreate, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin)
):
    """
    创建ESG任务（仅限管理员）
    
    参数:
        task: 任务创建信息
        session: 数据库会话
        current_user: 当前登录用户
        
    返回:
        ESGTaskRead: 创建成功的任务信息
        
    异常:
        HTTPException: 当用户不是管理员时抛出
    """
    # 使用get_current_admin依赖检查管理员权限
    
    # 使用model_validate替代已弃用的from_orm
    db_task = ESGTask.model_validate(task.model_dump())
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    
    return db_task

@router.get("/tasks", response_model=List[ESGTaskRead])
def get_tasks(
    category: Optional[str] = Query(None, description="任务类别：environment, society, governance"),
    task_date: Optional[str] = Query(None, description="任务日期（YYYY-MM-DD格式）"),
    session: Session = Depends(get_session)
):
    """
    获取ESG任务列表，支持按类别和日期筛选
    
    参数:
        category: 可选，按任务类别筛选
        task_date: 可选，按任务日期筛选
        session: 数据库会话
        
    返回:
        List[ESGTaskRead]: 任务列表
    """
    query = select(ESGTask)
    
    if category:
        # 尝试将字符串转换为枚举值，更安全的处理方式
        try:
            category_enum = ESGTaskCategory(category)
            query = query.where(ESGTask.category == category_enum)
        except ValueError:
            # 如果提供的category不是有效的枚举值，返回空列表
            return []
    
    if task_date:
        query = query.where(ESGTask.date == task_date)
    
    tasks = session.exec(query).all()
    return tasks

@router.get("/tasks/{task_id}", response_model=ESGTaskRead)
def get_task(task_id: str, session: Session = Depends(get_session)):
    """
    通过ID获取单个ESG任务
    
    参数:
        task_id: 任务ID
        session: 数据库会话
        
    返回:
        ESGTaskRead: 任务信息
        
    异常:
        HTTPException: 当任务不存在时抛出
    """
    task = session.exec(select(ESGTask).where(ESGTask.id == task_id)).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="任务不存在"
        )
    return task

@router.get("/user/dashboard") # 简单的占位符
async def get_user_dashboard(current_user: User = Depends(get_current_user)):
    """获取用户仪表盘数据 (占位符)"""
    # 实际实现会包含更复杂的统计逻辑
    return {
        "user_id": current_user.id,
        "username": current_user.username,
        "points": current_user.points,
        "tasks_completed_count": 0, # 示例，需要从UserAction统计
        "message": "仪表盘功能开发中"
    } 