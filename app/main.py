"""
蔚澜智越 FastAPI 应用入口
"""
import os
import contextlib
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import uvicorn
from contextlib import asynccontextmanager

# 加载路由模块
from app.api import user, task, action, dashboard
from app.db import create_db_and_tables
from app import config

# 加载环境变量
load_dotenv()

# 定义lifespan上下文管理器，替代on_event
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    应用生命周期管理
    
    启动时创建数据库表，关闭时执行清理
    """
    # 应用启动时执行
    create_db_and_tables()
    yield
    # 应用关闭时执行
    # 这里可以添加清理代码

# 创建应用
app = FastAPI(
    title=config.APP_NAME,
    description="一个基于任务驱动的ESG行为打卡与积分奖励系统",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# 配置CORS - 开发环境允许特定源
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],  # 允许多个常用前端端口
    allow_credentials=True,  # 启用凭证支持
    allow_methods=["*"],
    allow_headers=["*"],
)

# 配置API前缀
API_PREFIX = os.getenv("API_PREFIX", "/api")

# 包含路由模块
app.include_router(user.router, prefix=API_PREFIX, tags=["用户"])
app.include_router(task.router, prefix=API_PREFIX, tags=["任务"])
app.include_router(action.router, prefix=API_PREFIX, tags=["行为记录"])
app.include_router(dashboard.router, prefix=API_PREFIX, tags=["仪表盘"])


@app.get("/", tags=["健康检查"])
async def health_check():
    """健康检查端点"""
    return {"status": "ok", "app_name": config.APP_NAME}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 