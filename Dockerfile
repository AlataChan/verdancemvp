FROM python:3.9-slim

WORKDIR /app

# 设置Python环境
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 安装系统依赖
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 复制项目文件
COPY requirements.txt .
COPY .env.example .env

# 安装Python依赖
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 初始化数据库
RUN python -m app.db_init

# 暴露端口
EXPOSE 8000

# 运行应用
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 