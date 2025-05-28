"""
用户数据模型
"""
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
import uuid
from sqlmodel import Field, SQLModel, Relationship
from enum import Enum

if TYPE_CHECKING:
    from app.models.action import UserAction


class UserRole(str, Enum):
    """用户角色枚举"""
    ADMIN = "admin"
    USER = "user"


class UserBase(SQLModel):
    """用户模型基类"""
    username: str = Field(index=True)
    email: str = Field(index=True, unique=True)
    full_name: Optional[str] = None
    department: Optional[str] = None


class User(SQLModel, table=True):
    """
    用户数据模型
    
    属性:
        id: 用户唯一标识
        username: 用户名
        email: 用户邮箱
        hashed_password: 哈希后的密码
        role: 用户角色（admin或user）
        points: 用户积分
        full_name: 用户姓名
        department: 用户部门
        created_at: 创建时间
        updated_at: 更新时间
        actions: 用户的行为记录关系
    """
    __tablename__ = "users"
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    username: str = Field(index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    role: UserRole = Field(default=UserRole.USER)
    points: int = Field(default=0)
    full_name: Optional[str] = None
    department: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    
    # 关系定义
    actions: List["UserAction"] = Relationship(back_populates="user")


class UserCreate(UserBase):
    """用户创建模型"""
    password: str
    role: Optional[UserRole] = UserRole.USER


class UserRead(UserBase):
    """用户读取模型"""
    id: str
    role: UserRole
    points: int
    created_at: datetime


class UserUpdate(SQLModel):
    """用户更新模型"""
    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    full_name: Optional[str] = None
    department: Optional[str] = None
    role: Optional[UserRole] = None 