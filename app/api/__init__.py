"""
API模块，包含所有API路由
"""

from fastapi import APIRouter

# 导入各个模块的路由
from . import user, task, action

api_router = APIRouter()
api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(task.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(action.router, prefix="/actions", tags=["actions"])

# API包初始化文件
# 该包包含所有API路由模块 