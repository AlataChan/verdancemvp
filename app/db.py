"""
数据库连接和会话管理
"""
import os
from sqlmodel import SQLModel, Session, create_engine
from typing import Generator
from . import config

# 读取数据库URL（开发环境默认使用SQLite）
DATABASE_URL = os.getenv(
    "DATABASE_URL", "sqlite:///./verdance_mvp.db"
)

# 创建数据库引擎
engine = create_engine(
    config.DATABASE_URL, 
    echo=config.DEBUG,  # 在开发环境打印SQL语句
    connect_args={"check_same_thread": False} if config.DATABASE_URL.startswith("sqlite") else {}
)

# 依赖函数，用于获取数据库会话
def get_session() -> Generator[Session, None, None]:
    """
    创建一个数据库会话依赖，用于FastAPI路由函数
    
    返回:
        Generator[Session, None, None]: 数据库会话生成器
    """
    with Session(engine) as session:
        yield session

# 创建数据库表
def create_db_and_tables():
    """
    创建所有在SQLModel中定义的数据库表
    """
    SQLModel.metadata.create_all(engine) 