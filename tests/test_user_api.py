"""
用户API测试
"""
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from typing import Dict, Any
import uuid

from app.models.user import User, UserRole
from app.services.auth import get_password_hash, create_access_token


@pytest.fixture
def test_user(session: Session) -> User:
    """创建测试用户"""
    # 先检查是否已存在同名用户
    existing_user = session.exec(select(User).where(User.email == "test@example.com")).first()
    if existing_user:
        return existing_user
        
    # 如果不存在，创建新用户
    user = User(
        username="testuser",
        email="test@example.com",
        hashed_password=get_password_hash("password123"),
        role=UserRole.USER
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture
def test_admin(session: Session) -> User:
    """创建测试管理员用户"""
    # 先检查是否已存在同名管理员
    existing_admin = session.exec(select(User).where(User.email == "admin@example.com")).first()
    if existing_admin:
        return existing_admin
        
    # 如果不存在，创建新管理员
    admin = User(
        username="admin",
        email="admin@example.com",
        hashed_password=get_password_hash("admin123"),
        role=UserRole.ADMIN
    )
    session.add(admin)
    session.commit()
    session.refresh(admin)
    return admin


@pytest.fixture
def user_token(test_user: User) -> str:
    """创建用户JWT令牌"""
    return create_access_token(data={"sub": test_user.id})


@pytest.fixture
def admin_token(test_admin: User) -> str:
    """创建管理员JWT令牌"""
    return create_access_token(data={"sub": test_admin.id})


def test_login(client: TestClient, test_user: User) -> None:
    """测试用户登录"""
    response = client.post(
        "/api/login",
        data={
            "username": "test@example.com",
            "password": "password123",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client: TestClient, test_user: User) -> None:
    """测试密码错误登录"""
    response = client.post(
        "/api/login",
        data={
            "username": "test@example.com",
            "password": "wrongpassword",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    
    assert response.status_code == 401


def test_get_current_user(client: TestClient, user_token: str, test_user: User) -> None:
    """测试获取当前用户信息"""
    response = client.get(
        "/api/user/me",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_user.id
    assert data["username"] == test_user.username
    assert data["email"] == test_user.email


def test_create_user(client: TestClient) -> None:
    """测试创建用户"""
    # 使用随机邮箱避免冲突
    email = f"newuser_{uuid.uuid4()}@example.com"
    
    response = client.post(
        "/api/register",
        json={
            "username": "newuser",
            "email": email,
            "password": "newpassword123"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == email
    assert "id" in data


@pytest.mark.skip(reason="管理员接口尚未实现")
def test_admin_access(client: TestClient, admin_token: str) -> None:
    """测试管理员访问"""
    response = client.get(
        "/api/admin/users",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    
    assert response.status_code == 200 