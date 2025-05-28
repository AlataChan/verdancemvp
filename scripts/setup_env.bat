@echo off

REM 创建并激活Python虚拟环境
python -m venv venv
call venv\Scripts\activate.bat

REM 安装依赖
pip install -r requirements.txt

REM 创建必要的目录
if not exist logs mkdir logs
if not exist data mkdir data

echo 开发环境设置完成！
echo 请使用 'venv\Scripts\activate.bat' 激活虚拟环境 