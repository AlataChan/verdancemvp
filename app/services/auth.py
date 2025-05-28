"""
认证服务模块
"""
from datetime import datetime, timedelta, timezone
from typing import Optional
import os
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from dotenv import load_dotenv

from app import config
from app.db import get_session
from app.models.user import User, UserRole

# 加载环境变量
load_dotenv()

# 安全配置
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_jwt_secret_key_here")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# 创建密码上下文
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 创建OAuth2密码Bearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    验证密码是否匹配
    
    参数:
        plain_password: 明文密码
        hashed_password: 哈希密码
        
    返回:
        bool: 密码是否匹配
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    生成密码哈希
    
    参数:
        password: 明文密码
        
    返回:
        str: 哈希密码
    """
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    创建JWT访问令牌
    
    参数:
        data: 令牌数据
        expires_delta: 可选，令牌过期时间
        
    返回:
        str: JWT令牌
    """
    to_encode = data.copy()
    # Python 3.9+: datetime.now(timezone.UTC)
    # Python 3.8-: datetime.now(timezone.utc)
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, config.SECRET_KEY, algorithm=config.ALGORITHM)
    return encoded_jwt


def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> User:
    """
    获取当前登录用户
    
    参数:
        token: JWT令牌
        session: 数据库会话
        
    返回:
        User: 当前用户对象
        
    异常:
        HTTPException: 当令牌无效或用户不存在时抛出
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无效的认证凭证",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # 解码令牌
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    # 查找用户
    user = session.exec(select(User).where(User.id == user_id)).first()
    
    if user is None:
        raise credentials_exception
        
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """获取当前活跃用户"""
    # 这里可以添加检查用户是否被禁用等逻辑
    return current_user


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    检查当前用户是否为管理员
    
    参数:
        current_user: 当前用户
        
    返回:
        User: 当前管理员用户
        
    异常:
        HTTPException: 当用户不是管理员时抛出
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="权限不足，需要管理员权限"
        )
    return current_user


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """验证用户凭证"""
    # 查询用户
    statement = select(User).where(User.email == email)
    user = db.exec(statement).first()
    
    # 检查密码
    if not user or not verify_password(password, user.hashed_password):
        return None
    
    return user 