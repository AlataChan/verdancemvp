"""
ESG任务数据模型
"""
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
import uuid
from sqlmodel import Field, SQLModel, Relationship
from enum import Enum

if TYPE_CHECKING:
    from app.models.action import UserAction


class ESGTaskCategory(str, Enum):
    """ESG任务类别枚举"""
    ENVIRONMENT = "environment"
    SOCIETY = "society"
    GOVERNANCE = "governance"


class ESGTaskBase(SQLModel):
    """ESG任务模型基类"""
    title: str
    description: str
    category: ESGTaskCategory = Field(index=True)
    date: str = Field(index=True)  # YYYY-MM-DD格式
    points: int = Field(default=10)  # 完成任务获得的积分


class ESGTask(ESGTaskBase, table=True):
    """ESG任务数据模型"""
    __tablename__ = "esg_tasks"
    
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # 关系
    actions: List["UserAction"] = Relationship(back_populates="task")


class ESGTaskCreate(ESGTaskBase):
    """ESG任务创建模型"""
    pass


class ESGTaskRead(ESGTaskBase):
    """ESG任务读取模型"""
    id: str
    created_at: datetime


class ESGTaskUpdate(SQLModel):
    """ESG任务更新模型"""
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[ESGTaskCategory] = None
    date: Optional[str] = None
    points: Optional[int] = None 