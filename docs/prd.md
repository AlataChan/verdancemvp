
✅ 「蔚澜智越」MVP 产品需求文档（PRD）

⸻

🧭 项目简介

项目名称：蔚澜智越 MVP
目标用户：参与 ESG 实践的青少年与公众
核心目标：构建一个基于任务驱动的 ESG 行为打卡与积分奖励系统，完成行为记录、目标反馈和结果展示的闭环。

⸻

🧩 核心模块

模块	功能概述
用户系统	实现用户注册、登录、身份校验
ESG任务模块	获取每日ESG任务清单，提交任务完成状态
行为记录模块	每次打卡/提交任务时，记录行为数据（含时间、IP、任务ID等）
积分系统	用户完成任务后自动获取积分，可用于排行或奖励兑换等后续功能
数据仪表盘	展示用户个人进度、积分总数、任务完成率等简要统计


⸻

🗃️ 数据模型设计（简化）

1. User

{
  "id": "string",
  "username": "string",
  "email": "string",
  "hashed_password": "string",
  "points": "integer"
}

2. ESGTask

{
  "id": "string",
  "title": "string",
  "description": "string",
  "category": "environment | society | governance",
  "date": "ISODate"
}

3. UserAction

{
  "id": "string",
  "user_id": "string",
  "task_id": "string",
  "timestamp": "ISODate"
}


⸻

🔐 用户权限

操作	是否需登录
浏览任务列表	否
提交打卡	✅ 是
查看积分	✅ 是
查看仪表盘	✅ 是


⸻

🔌 API 接口规范（部分）

接口说明	路由	方法	请求参数	返回内容
用户注册	/api/register	POST	username, email, password	user_id
用户登录	/api/login	POST	email, password	token
获取ESG任务列表	/api/tasks	GET	可选：日期、分类	[task1, task2...]
提交打卡	/api/actions	POST	task_id（用户由token识别）	success
获取当前积分	/api/user/points	GET	需带token	points: integer
查看用户仪表盘	/api/user/dashboard	GET	需带token	完成任务数、积分等数据


⸻

🎯 功能验收标准

模块	验收标准（简化）
用户系统	用户可注册、登录，token校验有效
ESG任务模块	任务可按日期加载，支持展示、分类筛选
行为记录模块	每次打卡均成功写入记录表，防止重复提交
积分系统	每完成任务积分+1，积分随行为增长，且可通过接口实时查询
数据仪表盘	可展示总完成任务数、总积分、任务完成时间分布等图表


⸻

🛠️ 技术栈建议（用于后续Cursor开发）
	•	后端：FastAPI + SQLite（或 PostgreSQL）
	•	前端：Next.js + Tailwind CSS + Axios
	•	接口测试工具：.http 文件 或 Postman
	•	可视化：Recharts（React图表库）
	•	数据库工具：SQLModel / SQLAlchemy
	•	API文档生成：Swagger UI (FastAPI 默认支持)

