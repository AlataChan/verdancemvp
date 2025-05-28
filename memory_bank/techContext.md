# 蔚澜智越技术背景

## 技术栈概览

### 前端技术栈

- **核心框架**：Next.js 14+
- **UI组件**：基于TailwindCSS的自定义组件库
- **状态管理**：React Context + SWR
- **开发语言**：TypeScript
- **包管理器**：npm / pnpm
- **构建工具**：Webpack / Turbopack

### 后端技术栈

- **API框架**：FastAPI
- **开发语言**：Python 3.10+
- **数据库**：
  - 关系型：PostgreSQL 16
  - 图数据库：Neo4j
  - 向量数据库：Weaviate / Qdrant
  - 缓存：Redis
- **消息队列**：RabbitMQ
- **搜索引擎**：Elasticsearch
- **AI框架**：LangChain / LangGraph / Autogen / CrewAI

### 部署与运维

- **容器化**：Docker
- **编排**：Kubernetes
- **CI/CD**：GitHub Actions
- **监控**：Prometheus + Grafana
- **日志**：ELK Stack (Elasticsearch, Logstash, Kibana)

## 核心技术组件

### 1. 大语言模型（LLM）集成

系统支持多种LLM提供商：

- **OpenAI**: GPT-4o (默认)
- **Anthropic**: Claude-3 系列
- **Azure OpenAI**: 托管版OpenAI模型
- **Google**: Gemini 系列
- **DeepSeek**: DeepSeek-V2

模型选择策略：
- 通用任务使用GPT-4o
- 长文本处理使用Claude-3-Sonnet
- 细致推理任务使用Claude-3-Opus
- 低延迟场景使用DeepSeek或Gemini

### 2. 向量检索系统

- **嵌入模型**：OpenAI text-embedding-3-large / BAAI/bge-large-zh-v1.5
- **分块策略**：递归式文本分块，块大小1000字符
- **检索方式**：混合检索 (BM25 + 向量相似度)
- **重排序**：基于上下文相关性和时效性

### 3. 知识图谱

- **图数据模型**：Neo4j属性图模型
- **关系抽取**：基于规则 + LLM提取
- **查询语言**：Cypher
- **应用场景**：实体关系分析、路径发现、知识推理

### 4. 多模态处理

- **图像分析**：基于GPT-4o Vision
- **视频处理**：关键帧提取 + 图像分析
- **音频处理**：语音转文字 + 特征提取
- **文档解析**：结构化提取 + 表格识别

### 5. 安全与合规

- **身份认证**：OAuth 2.0 / JWT
- **权限控制**：RBAC (基于角色的访问控制)
- **内容安全**：多层内容过滤 + 敏感信息检测
- **数据加密**：AES-256 / RSA

## 开发环境设置

### 环境要求

- **操作系统**：
  - Linux (推荐 Ubuntu 22.04+)
  - macOS 12+
  - Windows 10/11 with WSL2
- **软件依赖**：
  - Python 3.10+
  - Node.js 18+
  - Docker 20+
  - PostgreSQL 16
  - Redis 7+

### 开发工具

- **IDE**: Visual Studio Code + DevContainer
- **API测试**: Postman / Insomnia
- **数据库工具**: DBeaver / pgAdmin
- **容器管理**: Docker Desktop
- **代码质量**: ESLint / Pylint / Black

### 本地开发流程

1. **环境准备**：
   ```bash
   # 克隆仓库
   git clone https://github.com/yourusername/verdance.git
   cd verdance
   
   # 配置环境变量
   cp .env.example .env
   # 编辑.env填入必要配置
   ```

2. **启动后端**：
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # 或
   venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

3. **启动前端**：
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **使用Docker**：
   ```bash
   docker-compose up -d
   ```

### DevContainer（推荐）

项目支持使用VS Code的DevContainer功能，提供一致的开发环境：

1. 安装前置条件:
   - Docker Desktop
   - Visual Studio Code
   - Remote - Containers 扩展

2. 使用DevContainer:
   - 在VS Code中打开项目
   - 点击左下角图标，选择"Reopen in Container"

## 依赖与集成

### 核心Python依赖

```
fastapi>=0.104.0
uvicorn>=0.23.2
sqlalchemy>=2.0.22
pydantic>=2.4.2
langchain>=0.0.335
langchain-openai>=0.0.2
neo4j>=5.13.0
weaviate-client>=3.24.1
redis>=5.0.1
psycopg2-binary>=2.9.9
```

### 核心JavaScript依赖

```json
{
  "dependencies": {
    "next": "^14.0.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.5",
    "swr": "^2.2.4",
    "typescript": "^5.2.2"
  }
}
```

### 外部服务集成

- **OpenAI API**: 智能体核心能力
- **Azure Blob Storage**: 文件存储
- **SendGrid**: 邮件通知
- **Twilio**: 短信通知
- **ElasticSearch Cloud**: 全文搜索服务

## 技术限制与挑战

1. **LLM延迟**：
   - 多轮对话可能导致累积延迟
   - 解决方案：流式传输、预缓存常见响应

2. **知识时效性**：
   - LLM训练数据可能过时
   - 解决方案：实时检索外部数据源

3. **多语言支持**：
   - 中英文混合处理的一致性
   - 解决方案：多语言嵌入模型、专用处理管道

4. **扩展性挑战**：
   - 高并发下的系统响应能力
   - 解决方案：微服务架构、自动扩缩容

5. **安全防护**：
   - 提示词注入风险
   - 解决方案：输入过滤、沙箱执行、输出验证 