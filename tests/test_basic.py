"""
基本功能测试
"""
from typing import Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.config import APP_NAME

client = TestClient(app)

def test_health_check() -> None:
    """测试健康检查端点"""
    response = client.get("/")
    assert response.status_code == 200
    response_data: Dict[str, Any] = response.json()
    assert response_data["status"] == "ok"
    assert response_data["app_name"] == APP_NAME

def test_docs_endpoints() -> None:
    """测试API文档端点是否可访问"""
    # 测试Swagger文档
    response = client.get("/docs")
    assert response.status_code == 200
    
    # 测试ReDoc文档
    response = client.get("/redoc")
    assert response.status_code == 200

def test_nonexistent_endpoint() -> None:
    """测试访问不存在的端点返回404"""
    response = client.get("/nonexistent-endpoint")
    assert response.status_code == 404 