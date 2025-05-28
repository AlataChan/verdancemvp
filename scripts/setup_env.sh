#!/bin/bash

# 创建并激活Python虚拟环境
python -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 创建必要的目录
mkdir -p logs
mkdir -p data

echo "开发环境设置完成！"
echo "请使用 'source venv/bin/activate' 激活虚拟环境" 