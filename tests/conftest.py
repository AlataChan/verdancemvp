"""
测试配置文件
"""
import os
import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool

from app.main import app
from app.db import get_session

# 创建测试用的内存数据库
TEST_DATABASE_URL = "sqlite:///memory:"


@pytest.fixture(name="engine", scope="session")
def engine_fixture():
    """创建数据库引擎，使用内存数据库"""
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    return engine


@pytest.fixture(name="session")
def session_fixture(engine):
    """创建数据库会话"""
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session):
    """创建FastAPI测试客户端"""
    # 覆盖应用程序的依赖项
    def get_test_session():
        return session

    app.dependency_overrides[get_session] = get_test_session
    
    # 创建测试客户端
    with TestClient(app) as client:
        yield client
    
    # 测试完成后清除依赖项覆盖
    app.dependency_overrides.clear()


@pytest.fixture(autouse=True)
def setup_test_environment():
    """设置测试环境变量"""
    # 保存原始环境变量
    original_env = {}
    for key in ["JWT_SECRET_KEY", "DATABASE_URL"]:
        original_env[key] = os.environ.get(key)
    
    # 设置测试环境变量
    os.environ["JWT_SECRET_KEY"] = "test_secret_key"
    os.environ["DATABASE_URL"] = TEST_DATABASE_URL
    
    yield
    
    # 恢复原始环境变量
    for key, value in original_env.items():
        if value is not None:
            os.environ[key] = value
        elif key in os.environ:
            del os.environ[key]
