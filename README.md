# 蔚澜智越ESG积分与任务平台

蔚澜智越是一个面向企业的ESG（环境、社会、治理）积分与任务管理平台，旨在推动企业可持续发展实践，提高员工参与度，并实现ESG目标的量化管理。

## 项目架构

本项目采用五层体系架构，各模块职责清晰分离：

- **蔚澜策**：规划层 - 负责规划与目标分解
- **蔚澜行**：调用层 - 负责任务调度与工具调用
- **蔚澜源**：知识层 - 负责企业知识和向量存储
- **蔚澜境**：交互层 - 负责多模态交互界面
- **蔚澜鉴**：控制层 - 负责安全与合规

## 技术栈

### 前端
- Next.js 14.0+
- TailwindCSS
- Zustand (状态管理)
- TypeScript

### 后端
- FastAPI
- PostgreSQL
- Neo4j (知识图谱)
- Weaviate/Qdrant (向量数据库)

### AI与智能体
- OpenAI API, Claude
- LangGraph, Autogen, CrewAI (智能体编排)

## 功能特性

- 员工ESG任务管理与积分记录
- 部门与个人积分排行榜
- ESG知识库与学习资源
- 管理员任务创建与积分规则设置
- 数据可视化与ESG报告生成

## 项目状态

- ✅ 前端基础架构
- ✅ 用户认证系统
- ✅ 仪表盘页面
- ✅ 任务管理页面
- 🚧 后端API接口
- 🚧 积分系统
- 📅 数据可视化
- 📅 管理员后台

## 快速开始

### 前端开发
```bash
cd frontend
npm install
npm run dev
```

### 后端开发
```bash
cd backend
pip install -r requirements.txt
python main.py
```

## 贡献指南

我们欢迎各种形式的贡献，包括但不限于：

1. 报告问题和错误
2. 提出新功能建议
3. 提交代码改进
4. 完善文档

请先创建Issue讨论您要解决的问题或添加的功能，然后提交Pull Request。

## 许可证

[MIT](LICENSE)
# verdancemvp
