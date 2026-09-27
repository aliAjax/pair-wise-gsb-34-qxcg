CREATE TABLE IF NOT EXISTS building (
  id INTEGER PRIMARY KEY,
  name TEXT,
  campus TEXT,
  floor_count TEXT,
  fire_grade TEXT,
  manager_id TEXT,
  address_code TEXT
);

CREATE TABLE IF NOT EXISTS fire_device (
  id INTEGER PRIMARY KEY,
  building_id TEXT,
  device_code TEXT,
  device_type TEXT,
  floor TEXT,
  location_desc TEXT,
  install_date TEXT,
  status TEXT,
  next_maintenance_at TEXT
);

CREATE TABLE IF NOT EXISTS inspection_task (
  id INTEGER PRIMARY KEY,
  building_id TEXT,
  inspector_id TEXT,
  plan_date TEXT,
  task_type TEXT,
  status TEXT,
  checklist_version TEXT,
  finished_at TEXT
);

CREATE TABLE IF NOT EXISTS inspection_result (
  id INTEGER PRIMARY KEY,
  task_id TEXT,
  device_id TEXT,
  item_code TEXT,
  result_status TEXT,
  measured_value TEXT,
  photo_url TEXT,
  note TEXT
);

CREATE TABLE IF NOT EXISTS hazard_ticket (
  id INTEGER PRIMARY KEY,
  result_id TEXT,
  severity TEXT,
  owner_id TEXT,
  deadline TEXT,
  rectify_status TEXT,
  rectify_note TEXT,
  closed_at TEXT
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY,
  actor TEXT,
  action TEXT,
  target_type TEXT,
  target_id TEXT,
  created_at TEXT
);

-- 种子数据与 backend/src/seed.py、frontend/src/mocks/seedData.ts 保持一致
INSERT INTO building (id, name, campus, floor_count, fire_grade, manager_id, address_code) VALUES
  (1, '研发1号楼', '高新园区', '12', '一级', '1', 'GX-001'),
  (2, '研发2号楼', '高新园区', '8', '二级', '2', 'GX-002'),
  (3, '综合仓库', '临港园区', '3', '一级', '3', 'LG-001');

INSERT INTO fire_device (id, building_id, device_code, device_type, floor, location_desc, install_date, status, next_maintenance_at) VALUES
  (1, '1', 'EXT-1F-001', 'EXTINGUISHER', '1F', '1层东侧走廊', '2025-03-11T09:00:00Z', 'NORMAL', '2026-10-11T09:00:00Z'),
  (2, '2', 'SD-2F-002', 'SMOKE_DETECTOR', '2F', '2层会议室吊顶', '2025-04-12T09:00:00Z', 'PENDING_RECTIFY', '2026-10-12T09:00:00Z'),
  (3, '3', 'SPR-3F-003', 'SPRINKLER', '3F', '3层货架区', '2025-05-13T09:00:00Z', 'NORMAL', '2026-10-13T09:00:00Z'),
  (4, '1', 'EXT-2F-004', 'EXTINGUISHER', '2F', '2层西侧楼梯间', '2025-06-14T09:00:00Z', 'NORMAL', '2026-10-14T09:00:00Z'),
  (5, '1', 'EXIT-1F-005', 'EXIT_LIGHT', '1F', '1层安全出口', '2025-07-15T09:00:00Z', 'NORMAL', '2026-10-15T09:00:00Z'),
  (6, '2', 'HYD-1F-006', 'HYDRANT', '1F', '1层大厅消火栓箱', '2025-08-16T09:00:00Z', 'NORMAL', '2026-10-16T09:00:00Z');

INSERT INTO inspection_task (id, building_id, inspector_id, plan_date, task_type, status, checklist_version, finished_at) VALUES
  (1, '1', '1', '2026-09-27T09:00:00Z', 'ROUTINE', 'PLANNED', 'CL-2026-09', ''),
  (2, '2', '2', '2026-09-20T09:00:00Z', 'ROUTINE', 'SUBMITTED', 'CL-2026-09', '2026-09-20T15:30:00Z'),
  (3, '3', '3', '2026-09-21T09:00:00Z', 'SPECIAL', 'SUBMITTED', 'CL-2026-09', '2026-09-21T16:10:00Z');

INSERT INTO inspection_result (id, task_id, device_id, item_code, result_status, measured_value, photo_url, note) VALUES
  (1, '2', '2', 'SMOKE_TEST', 'ABNORMAL', '无报警响应', '/mock/photo_url-1.png', '烟感按下测试钮无联动'),
  (2, '3', '3', 'PRESSURE_CHECK', 'ABNORMAL', '0.05MPa', '/mock/photo_url-2.png', '末端试水压力不足'),
  (3, '2', '6', 'HYDRANT_PRESSURE', 'NORMAL', '0.35MPa', '/mock/photo_url-3.png', '水压正常');

INSERT INTO hazard_ticket (id, result_id, severity, owner_id, deadline, rectify_status, rectify_note, closed_at) VALUES
  (1, '1', 'HIGH', '2', '2026-10-04T09:00:00Z', 'OPEN', '', ''),
  (2, '2', 'MEDIUM', '3', '2026-09-28T09:00:00Z', 'CLOSED', '已更换喷头并复验合格', '2026-09-24T10:00:00Z');
