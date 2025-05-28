"""
数据库初始化模块，用于创建数据库表结构和初始数据
"""
import logging
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os
from pathlib import Path
from sqlalchemy.sql import select
from app.models.user import User, UserRole
from app.services.auth import get_password_hash

# 加载环境变量
load_dotenv()

# 获取数据库URL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./verdance.db")

# 创建数据库引擎
engine = create_engine(DATABASE_URL, echo=True)

# 导入所有模型以确保它们被注册
from app.models.task import ESGTask
from app.models.action import UserAction

def init_db():
    """初始化数据库，创建表和填充测试数据"""
    # 创建引擎和数据库表
    engine = create_engine(DATABASE_URL, echo=True)
    SQLModel.metadata.create_all(engine)
    
    # 创建会话
    with Session(engine) as session:
        # 检查是否已经有管理员用户
        admin = session.exec(select(User).where(User.role == UserRole.ADMIN)).first()
        
        if not admin:
            # 创建管理员用户
            admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
            admin = User(
                username="admin",
                email="admin@example.com",
                hashed_password=get_password_hash(admin_password),
                role=UserRole.ADMIN,
                full_name="系统管理员",
                department="IT部门"
            )
            session.add(admin)
            
            # 创建测试用户
            test_user = User(
                username="testuser",
                email="test@example.com",
                hashed_password=get_password_hash("password123"),
                role=UserRole.USER,
                full_name="测试用户",
                department="测试部门"
            )
            session.add(test_user)
            
            # 创建一些测试任务
            tasks = [
                ESGTask(
                    title="节水行动",
                    description="记录今日节约用水的行为，如关紧水龙头、收集雨水等",
                    category="environment",
                    date="2023-06-01"
                ),
                ESGTask(
                    title="减少用纸",
                    description="今日使用电子设备替代纸质文档，记录节约的纸张数量",
                    category="environment",
                    date="2023-06-01"
                ),
                ESGTask(
                    title="志愿服务",
                    description="参与社区志愿服务活动，并记录服务时间和内容",
                    category="society",
                    date="2023-06-01"
                ),
                ESGTask(
                    title="环保知识分享",
                    description="向身边的朋友分享一个环保小知识或技巧",
                    category="governance",
                    date="2023-06-01"
                )
            ]
            
            # 检查任务是否已存在
            existing_tasks = session.query(ESGTask).all()
            if not existing_tasks:
                for task in tasks:
                    session.add(task)
            
            session.commit()
    
    logging.info("数据库表创建完成！")

def seed_db():
    """填充初始测试数据"""
    logging.info("填充初始数据...")
    
    # 创建测试用户
    with Session(engine) as session:
        # 检查是否已有测试用户
        user = session.query(User).filter(User.email == "test@example.com").first()
        if not user:
            from app.services.auth import get_password_hash
            test_user = User(
                username="测试用户",
                email="test@example.com",
                hashed_password=get_password_hash("123456"),
                points=0
            )
            session.add(test_user)
            
        # 创建示例ESG任务
        tasks = [
            ESGTask(
                title="节水行动",
                description="记录今日节约用水的行为，如关紧水龙头、收集雨水等",
                category="environment",
                date="2023-06-01"
            ),
            ESGTask(
                title="减少用纸",
                description="今日使用电子设备替代纸质文档，记录节约的纸张数量",
                category="environment",
                date="2023-06-01"
            ),
            ESGTask(
                title="志愿服务",
                description="参与社区志愿服务活动，并记录服务时间和内容",
                category="society",
                date="2023-06-01"
            ),
            ESGTask(
                title="环保知识分享",
                description="向身边的朋友分享一个环保小知识或技巧",
                category="governance",
                date="2023-06-01"
            )
        ]
        
        # 检查任务是否已存在
        existing_tasks = session.query(ESGTask).all()
        if not existing_tasks:
            for task in tasks:
                session.add(task)
        
        session.commit()
    
    logging.info("初始数据填充完成！")

if __name__ == "__main__":
    # 设置日志
    logging.basicConfig(level=logging.INFO)
    
    # 初始化数据库
    init_db()
    
    # 填充测试数据
    seed_db()
    
    print("数据库初始化完成！") 