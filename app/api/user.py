"""
用户相关的API路由
"""
from fastapi import APIRouter, Depends, HTTPException, status, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from typing import List, Dict, Any, Optional

from app.db import get_session
from app.models.user import User, UserCreate, UserRead, UserUpdate
from app.services.auth import (
    get_password_hash, 
    verify_password, 
    create_access_token,
    get_current_user
)

router = APIRouter()

@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, session: Session = Depends(get_session)):
    """
    用户注册接口
    
    参数:
        user: 用户注册信息
        session: 数据库会话
        
    返回:
        UserRead: 注册成功的用户信息
        
    异常:
        HTTPException: 当用户邮箱已存在时抛出
    """
    # 检查邮箱是否已存在
    db_user = session.exec(select(User).where(User.email == user.email)).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="邮箱已被注册"
        )
    
    # 创建新用户
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        department=user.department,
        hashed_password=hashed_password
    )
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=Dict[str, Any])
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    """
    用户登录接口
    
    参数:
        form_data: OAuth2表单数据（用户名和密码）
        session: 数据库会话
        
    返回:
        dict: 包含访问令牌、令牌类型和用户基本信息
        
    异常:
        HTTPException: 当用户不存在或密码错误时抛出
    """
    # 查找用户 (使用form_data.username作为email)
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的凭证",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 创建访问令牌
    access_token = create_access_token(data={"sub": user.id})
    
    # 返回令牌和基本用户信息
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "points_total": user.points  # 与前端类型保持一致
        }
    }

@router.get("/user/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    获取当前登录用户信息
    
    参数:
        current_user: 当前登录用户
        
    返回:
        UserRead: 用户信息
    """
    return current_user

@router.get("/user/points")
def get_user_points(current_user: User = Depends(get_current_user)):
    """
    获取当前用户积分
    
    参数:
        current_user: 当前登录用户
        
    返回:
        dict: 包含用户积分
    """
    return {"points": current_user.points, "points_total": current_user.points} 