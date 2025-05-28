import os
from dotenv import load_dotenv
from pathlib import Path

# 加载环境变量
env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

# 应用配置
APP_NAME = os.getenv("APP_NAME", "蔚澜智越")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
DEBUG = os.getenv("DEBUG", "True").lower() in ('true', '1', 't')

# 数据库配置
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./verdance.db")

# 安全配置
SECRET_KEY = os.getenv("SECRET_KEY", "verdance_development_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# 日志配置
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
