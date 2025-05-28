#!/usr/bin/env python
"""
设置Alembic数据库迁移工具的脚本
"""
import os
import subprocess
from pathlib import Path

def setup_alembic():
    """设置Alembic数据库迁移环境"""
    # 确保alembic已安装
    try:
        subprocess.run(["alembic", "--version"], check=True, capture_output=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Alembic未安装，正在安装...")
        subprocess.run(["pip", "install", "alembic"], check=True)
    
    # 创建alembic目录
    if not Path("alembic").exists():
        print("初始化Alembic...")
        subprocess.run(["alembic", "init", "alembic"], check=True)
    
    # 创建alembic.ini文件
    alembic_ini_content = """
[alembic]
script_location = alembic
prepend_sys_path = .
sqlalchemy.url = sqlite:///./verdance.db

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
"""
    
    with open("alembic.ini", "w") as f:
        f.write(alembic_ini_content.strip())
    
    # 创建env.py文件
    alembic_env_path = Path("alembic") / "env.py"
    alembic_env_content = """
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context
from sqlmodel import SQLModel

# 导入所有SQLModel模型以便Alembic可以检测它们
from app.models.user import User
from app.models.task import ESGTask
from app.models.action import UserAction

# 此为Alembic配置，用于读取alembic.ini文件
config = context.config

# 导入配置文件的元数据
target_metadata = SQLModel.metadata

# 解析loggers配置
fileConfig(config.config_file_name)

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
"""
    
    # 确保alembic目录存在
    if alembic_env_path.parent.exists():
        with open(alembic_env_path, "w") as f:
            f.write(alembic_env_content.strip())
    
    print("Alembic配置完成！")
    print("现在可以使用以下命令创建迁移：")
    print("  alembic revision --autogenerate -m \"初始迁移\"")
    print("并应用迁移：")
    print("  alembic upgrade head")

if __name__ == "__main__":
    setup_alembic() 