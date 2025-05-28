# 蔚澜智越 MVP 编码规范

## Python 代码规范

### 命名约定
- **模块名**：使用小写字母，如有必要使用下划线分隔（`snake_case`）
  - 示例：`auth_service.py`, `user_model.py`
- **类名**：使用大驼峰命名法（`PascalCase`）
  - 示例：`UserService`, `ESGTask`
- **函数和变量**：使用小写字母和下划线（`snake_case`）
  - 示例：`get_user_by_id()`, `user_points`
- **常量**：全部大写，使用下划线分隔
  - 示例：`MAX_POINTS`, `DEFAULT_CATEGORIES`
- **私有属性和方法**：以单下划线开头
  - 示例：`_calculate_points()`, `_user_cache`

### 代码格式
- 使用4个空格缩进（不使用Tab）
- 每行代码最大长度为88个字符
- 函数和类定义之间空两行
- 类中的方法之间空一行
- 在运算符前后、逗号后、冒号和分号后使用空格

### 注释规范
- 使用中文编写注释
- 使用三引号文档字符串（docstring）为模块、类和函数添加说明
- 函数文档字符串应包含参数、返回值和异常说明

```python
def calculate_points(user_id: str, action_id: str) -> int:
    """
    计算用户完成任务获得的积分
    
    参数:
        user_id: 用户ID
        action_id: 行为记录ID
        
    返回:
        int: 获得的积分数量
        
    异常:
        ValueError: 当用户ID或行为ID无效时抛出
    """
```

### 导入规范
- 导入顺序：标准库 -> 第三方库 -> 本地应用导入
- 每个部分之间空一行
- 在每个部分中按字母顺序排序

```python
import os
import json
from datetime import datetime

import fastapi
from sqlmodel import SQLModel, Field

from app.models.user import User
from app.services.auth import verify_password
```

## API 设计规范

### URL 命名
- 使用复数名词表示资源集合
  - 示例：`/api/users`, `/api/tasks`
- 使用HTTP方法表示动作
  - GET：获取资源
  - POST：创建资源
  - PUT：完全更新资源
  - PATCH：部分更新资源
  - DELETE：删除资源
- 使用嵌套URL表示资源关系
  - 示例：`/api/users/{user_id}/actions`

### 请求和响应
- 请求体和响应体使用JSON格式
- 使用Pydantic模型定义请求和响应结构
- 每个API端点应在OpenAPI文档中有完整描述

### 错误处理
- 使用标准HTTP状态码
- 错误响应应包含错误代码和详细信息
- 使用统一的错误响应格式

```json
{
  "error": {
    "code": "invalid_credentials",
    "message": "用户名或密码错误"
  }
}
```

## 数据库规范

### 表命名
- 表名使用小写复数形式
  - 示例：`users`, `esg_tasks`
- 关联表使用两个表名加下划线连接
  - 示例：`users_groups`

### 字段命名
- 主键统一使用`id`
- 外键使用`<表名>_id`（单数形式）
  - 示例：`user_id`, `task_id`
- 时间戳字段：`created_at`, `updated_at`
- 布尔类型字段使用`is_`或`has_`前缀
  - 示例：`is_active`, `has_submitted`

### 索引和约束
- 每个表应有主键
- 外键应添加适当的索引
- 使用有意义的约束名称
  - 示例：`uq_users_email`（唯一约束）

## 测试规范

### 测试文件命名
- 测试文件名以`test_`开头
  - 示例：`test_user_service.py`

### 测试函数命名
- 测试函数名应描述被测试的行为
  - 示例：`test_user_registration_with_valid_data`

### 测试组织
- 使用pytest fixtures组织测试
- 每个测试函数应专注测试一个行为
- 使用参数化测试处理多种情况

## 日志规范

### 日志级别使用
- ERROR：影响系统运行的错误
- WARNING：可能的问题，但不影响系统运行
- INFO：常规操作信息
- DEBUG：详细调试信息

### 日志消息格式
- 包含时间戳、日志级别、模块名、信息
- 结构化日志使用JSON格式

## 版本控制

### 提交消息规范
- 使用中文编写提交消息
- 消息格式：`<类型>: <简短描述>`
  - 类型：feat(新功能)、fix(修复)、docs(文档)、style(格式)、refactor(重构)、test(测试)、chore(日常任务)
  - 示例：`feat: 添加用户注册功能`

### 分支策略
- master/main：主分支，保持可部署状态
- develop：开发分支，新功能集成
- feature/*：功能分支
- bugfix/*：Bug修复分支
- release/*：发布准备分支 