"""
任务API测试
"""
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from typing import Dict, Any
from datetime import date

from app.models.user import User, UserRole
from app.models.task import ESGTask, ESGTaskCategory
from app.services.auth import get_password_hash, create_access_token


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
def admin_token(test_admin: User) -> str:
    """创建管理员JWT令牌"""
    return create_access_token(data={"sub": test_admin.id})


@pytest.fixture
def sample_task(session: Session) -> ESGTask:
    """创建示例任务"""
    task = ESGTask(
        title="节约用水",
        description="连续一周减少用水量",
        category=ESGTaskCategory.ENVIRONMENT,
        points=50,
        date=date.today().isoformat()
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


def test_create_task(client: TestClient, admin_token: str) -> None:
    """测试创建任务"""
    task_data = {
        "title": "节能减排",
        "description": "使用节能设备一周",
        "category": "environment",
        "points": 30,
        "date": date.today().isoformat()
    }
    
    response = client.post(
        "/api/tasks",
        json=task_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == task_data["title"]
    assert data["description"] == task_data["description"]
    assert data["category"] == task_data["category"]
    assert data["points"] == task_data["points"]
    assert "id" in data


def test_get_tasks(client: TestClient, sample_task: ESGTask) -> None:
    """测试获取任务列表"""
    response = client.get("/api/tasks")
    assert response.status_code == 200
    
    tasks = response.json()
    assert len(tasks) >= 1
    
    # 检查示例任务是否在列表中
    task_ids = [task["id"] for task in tasks]
    assert sample_task.id in task_ids


def test_get_tasks_with_filter(client: TestClient, sample_task: ESGTask) -> None:
    """测试按类别筛选任务"""
    response = client.get(f"/api/tasks?category={sample_task.category.value}")
    assert response.status_code == 200
    
    tasks = response.json()
    assert len(tasks) >= 1
    
    # 检查所有返回的任务类别是否匹配
    for task in tasks:
        assert task["category"] == sample_task.category.value


def test_get_task_by_id(client: TestClient, sample_task: ESGTask) -> None:
    """测试通过ID获取单个任务"""
    response = client.get(f"/api/tasks/{sample_task.id}")
    assert response.status_code == 200
    
    task = response.json()
    assert task["id"] == sample_task.id
    assert task["title"] == sample_task.title
    assert task["description"] == sample_task.description
    assert task["category"] == sample_task.category.value
    assert task["points"] == sample_task.points


def test_get_nonexistent_task(client: TestClient) -> None:
    """测试获取不存在的任务"""
    response = client.get("/api/tasks/nonexistent-id")
    assert response.status_code == 404 