#!/bin/bash

# 激活虚拟环境（如果有）
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# 安装依赖
pip install -r requirements.txt

# 创建数据库表
python -c "from app.db import create_db_and_tables; create_db_and_tables()"

# 启动服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 