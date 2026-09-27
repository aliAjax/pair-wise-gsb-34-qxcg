# 消防设施巡检维保平台

面向园区和物业公司的消防设备巡检、隐患整改、维保计划和合规台账系统。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20103>

后端健康检查：<http://localhost:21103/health>


## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`
- 后端：`cd backend && pip install -r requirements.txt && uvicorn src.main:app --reload --port 8000`，接口统一挂在 `/api`。

## 核心业务流（巡检 → 隐患 → 复验）

1. **逐项录入与提交**：巡检任务页选中任务后，按设备逐项录入检查结果（正常/异常、实测值、备注），`POST /api/inspection-task/{id}/submit` 提交。
2. **隐患自动生成**：提交结果中只要有一件设备异常，就为该异常结果生成一张隐患整改单（严重度按设备类型缺省），并把设备状态置为 `PENDING_RECTIFY`（待整改）。
3. **幂等提交**：巡检结果按 `(task_id, device_id, item_code)` 覆盖更新，隐患单按 `result_id` 唯一；同一任务重复提交不会产生重复隐患单（已关闭的单据会被重新打开而不是新建）。
4. **复验关闭**：隐患整改页对 `OPEN` 单据执行“复验通过并关闭”（`POST /api/hazard-ticket/{id}/close`），该设备上没有其他待整改隐患时恢复为 `NORMAL`；重复关闭幂等返回。
5. **总览联动**：合规总览的“待整改隐患 / 待整改设备 / 逾期整改”统计直接消费同一批 store，提交或关闭后数量即时变化。

### 接口一览

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/inspection-task` | 任务列表 |
| POST | `/api/inspection-task/{id}/submit` | 逐项录入并提交（幂等） |
| GET | `/api/hazard-ticket` | 隐患单列表 |
| POST | `/api/hazard-ticket/{id}/close` | 复验通过并关闭（幂等） |
| GET | `/api/fire-device` `/api/inspection-result` `/api/building` | 台账/结果/楼栋列表 |

写操作按角色控制（请求头 `x-role`，默认 `admin`）：提交需 `inspector`/`admin`，关闭需 `maintainer`/`admin`。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite + Material UI + Redux Toolkit |
| 后端 | FastAPI + Python 3.11 + SQLAlchemy 2.0 |
| 数据库 | PostgreSQL 15 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks
backend/src/routes, controllers, services, models, repositories, middlewares, constants, constructors, utils, types, config
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `fire-inspect`
- `FRONTEND_PORT`: 前端端口，默认 `20103`
- `BACKEND_PORT`: 后端端口，默认 `21103`
- `DB_PORT`: 数据库宿主机端口
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: fire-inspect`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-fire-inspect}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- DeviceType: 前端 `constants/DeviceType.ts`（含 `DeviceTypeItemCode` 检查项映射）、`types/DeviceType.ts`；后端 `constants/device_type.py`；构造器、logTemplates、errorMessages、设备筛选与展示组件均有引用。
- InspectionStatus: 前端 `constants/InspectionStatus.ts`、`types/InspectionStatus.ts`；后端 `constants/inspection_status.py`；构造器、logTemplates、errorMessages、任务筛选与展示组件均有引用。
- HazardSeverity: 前端 `constants/HazardSeverity.ts`（含 `DEFAULT_SEVERITY_BY_DEVICE_TYPE`）、`types/HazardSeverity.ts`；后端 `constants/hazard_severity.py`；构造器、logTemplates、errorMessages、`HazardSeverityTag`、`utils/formatters.formatRisk` 均有引用。
- DeviceStatus（NORMAL / PENDING_RECTIFY）: 前端 `constants/DeviceStatus.ts`；后端 `constants/device_status.py`；`inspection_task_service.submit`、`hazard_ticket_service.close`、设备台账与合规总览均有引用。
- ResultStatus（NORMAL / ABNORMAL）: 前端 `constants/ResultStatus.ts`；后端 `constants/result_status.py`；`ChecklistPanel`、`useChecklistProgress`、`inspection_task_service` 均有引用。
- RectifyStatus（OPEN / CLOSED）: 前端 `constants/RectifyStatus.ts`；后端 `constants/rectify_status.py`；隐患整改页、合规总览统计、`hazard_ticket_service` 均有引用。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
