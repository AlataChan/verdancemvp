"""
用户行为记录数据模型
"""
from typing import Optional
from datetime import datetime
import uuid
from sqlmodel import Field, SQLModel, Relationship
from enum import Enum

from app.models.user import User
from app.models.task import ESGTask


class ActionStatus(str, Enum):
    """行为状态枚举"""
    COMPLETED = "completed"  # 已完成
    VERIFIED = "verified"    # 已验证
    REJECTED = "rejected"    # 已拒绝
    PENDING = "pending"      # 待审核


class UserAction(SQLModel, table=True):
    """用户行为记录数据模型"""
    __tablename__ = "user_actions"
    
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    task_id: str = Field(foreign_key="esg_tasks.id", index=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)
    ip_address: Optional[str] = None
    device_info: Optional[str] = None
    status: ActionStatus = Field(default=ActionStatus.COMPLETED, index=True)  # 状态
    points_earned: Optional[int] = Field(default=0)  # 获得的积分
    comment: Optional[str] = None  # 用户评论或记录
    
    # 关系
    user: User = Relationship(back_populates="actions")
    task: ESGTask = Relationship(back_populates="actions")


class UserActionCreate(SQLModel):
    """用户行为记录创建模型"""
    task_id: str
    ip_address: Optional[str] = None
    device_info: Optional[str] = None
    comment: Optional[str] = None


class UserActionRead(SQLModel):
    """用户行为记录读取模型"""
    id: str
    user_id: str
    task_id: str
    timestamp: datetime
    ip_address: Optional[str] = None
    device_info: Optional[str] = None
    status: ActionStatus
    points_earned: int
    comment: Optional[str] = None


class UserActionUpdate(SQLModel):
    """用户行为记录更新模型"""
    status: Optional[ActionStatus] = None
    points_earned: Optional[int] = None
    comment: Optional[str] = None 