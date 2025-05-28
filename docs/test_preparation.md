# 蔚澜智越功能模块测试方案

## 一、测试环境准备

### 1. 开发环境配置

```bash
# 克隆项目代码库（如果尚未克隆）
git clone <项目仓库地址>
cd verdance

# 安装后端依赖
pip install -r requirements.txt

# 安装前端依赖
cd frontend
npm install
cd ..

# 复制环境配置文件
cp config/env.example .env
```

### 2. 启动测试环境

```bash
# 启动Docker容器化环境（包含数据库等依赖服务）
docker-compose up -d

# 等待所有服务启动完成
sleep 10
```

## 二、分层测试策略

### 1. 单元测试 - 验证各层模块的独立功能

#### 蔚澜策（规划层）测试

```bash
# 测试规划层各模块功能
cd backend
./run_tests.sh tests/verdance_ce
```

#### 蔚澜行（调用层）测试

```bash
# 测试调用层各模块功能
cd backend
./run_tests.sh tests/verdance_xing
```

#### 蔚澜源（知识层）测试

```bash
# 测试知识层各模块功能
cd backend
./run_tests.sh tests/verdance_yuan
```

#### 蔚澜境（交互层）测试

```bash
# 测试交互层各模块功能
cd backend
./run_tests.sh tests/verdance_jing
```

#### 蔚澜鉴（控制层）测试

```bash
# 测试控制层各模块功能
cd backend
./run_tests.sh tests/verdance_jian
```

### 2. 集成测试 - 验证模块间协作

```bash
# 执行集成测试
cd backend
python -m pytest tests/integration -v
```

### 3. 端到端测试 - 验证完整功能流程

```bash
# 启动后端服务
cd backend
python app/main.py &
BACKEND_PID=$!

# 启动前端开发服务器
cd frontend
npm run dev &
FRONTEND_PID=$!

# 等待服务完全启动
sleep 10

# 执行端到端测试
cd ../tests
python -m pytest tests/e2e -v

# 测试完成后关闭服务
kill $BACKEND_PID $FRONTEND_PID
```

## 三、功能模块测试工具

### 1. LLM API工具测试

```bash
# 测试LLM API工具
python tools/llm_api.py --prompt "测试查询内容" --provider openai --model gpt-4o
```

### 2. 网页爬取工具测试

```bash
# 测试网页爬取工具
python tools/web_scraper.py --max-concurrent 2 https://example.com
```

### 3. 截图验证工具测试

```bash
# 测试截图验证工具
python tools/screenshot_utils.py https://example.com --output test_screenshot.png --width 1200 --height 800
```

### 4. 搜索引擎工具测试

```bash
# 测试搜索引擎工具
python tools/search_engine.py "蔚澜智越测试关键词"
```

## 四、自动化测试脚本

在项目根目录创建`scripts/run_all_tests.sh`脚本，用于一键运行所有测试：

```bash
#!/bin/bash

# 设置环境变量
export PYTHONPATH=$(pwd)
export TEST_ENV=development

echo "===== 启动测试环境 ====="
docker-compose up -d
sleep 10

echo "===== 运行单元测试 ====="
cd backend
./run_tests.sh tests/verdance_ce
./run_tests.sh tests/verdance_xing
./run_tests.sh tests/verdance_yuan
./run_tests.sh tests/verdance_jing
./run_tests.sh tests/verdance_jian
cd ..

echo "===== 运行集成测试 ====="
cd backend
python -m pytest tests/integration -v
cd ..

echo "===== 运行工具测试 ====="
python tools/llm_api.py --prompt "测试查询" --provider openai --model gpt-4o
python tools/web_scraper.py --max-concurrent 1 https://example.com
python tools/screenshot_utils.py https://example.com --output test.png
python tools/search_engine.py "测试关键词"

echo "===== 运行端到端测试 ====="
cd backend
python app/main.py &
BACKEND_PID=$!
cd ../frontend
npm run dev &
FRONTEND_PID=$!
sleep 10
cd ../tests
python -m pytest tests/e2e -v
kill $BACKEND_PID $FRONTEND_PID

echo "===== 关闭测试环境 ====="
docker-compose down

echo "===== 测试完成 ====="
```

## 五、测试报告与结果分析

### 1. 生成测试覆盖率报告

```bash
cd backend
python -m pytest --cov=app --cov-report=html:coverage_report
```

### 2. 生成测试结果报告

```bash
cd backend
python -m pytest --junitxml=test-results.xml
```

### 3. 查看测试报告

```bash
# 打开测试覆盖率报告
open backend/coverage_report/index.html
```

## 六、持续集成测试

通过GitHub Actions自动运行测试：

```bash
# 推送代码到仓库
git add .
git commit -m "更新功能模块"
git push

# 查看GitHub Actions测试结果
open https://github.com/YOUR_REPO/verdance/actions
```

## 七、故障排查指南

1. 检查日志文件：`backend/verdance_xing.log`
2. 检查Docker容器状态：`docker-compose ps`
3. 检查数据库连接：`docker-compose exec postgres psql -U postgres -d verdance`
4. 检查网络连接：`curl http://localhost:8000/api/health`

## 八、测试数据管理

1. 使用种子脚本生成测试数据：`python scripts/seed_test_data.py`
2. 清理测试数据：`python scripts/clean_test_data.py`
3. 备份测试数据：`python scripts/backup_test_data.py` 