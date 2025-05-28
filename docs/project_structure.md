project-root/
├── app/
│   ├── __init__.py
│   ├── main.py               # FastAPI 入口
│   ├── config.py             # 配置文件（JWT密钥、数据库连接等）
│   ├── models/               # 数据模型
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── task.py
│   │   └── action.py
│   ├── schemas/              # 请求/响应体定义
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── task.py
│   │   └── action.py
│   ├── api/                  # 路由逻辑
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── task.py
│   │   └── action.py
│   ├── services/             # 业务逻辑封装
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── points.py
│   └── db.py                 # 数据库初始化和依赖
│
├── tests/                   # 单元测试模块
│   ├── test_user.py
│   ├── test_task.py
│   └── test_action.py
│
├── requirements.txt         # Python依赖包
├── .env                     # 环境变量
├── README.md
└── run.sh                   # 快速启动脚本（可选）