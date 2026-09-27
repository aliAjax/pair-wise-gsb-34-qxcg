seed = {
  "building": [
    {
      "id": 1,
      "name": "研发1号楼",
      "campus": "高新园区",
      "floor_count": 12,
      "fire_grade": "一级",
      "manager_id": 1,
      "address_code": "GX-001"
    },
    {
      "id": 2,
      "name": "研发2号楼",
      "campus": "高新园区",
      "floor_count": 8,
      "fire_grade": "二级",
      "manager_id": 2,
      "address_code": "GX-002"
    },
    {
      "id": 3,
      "name": "综合仓库",
      "campus": "临港园区",
      "floor_count": 3,
      "fire_grade": "一级",
      "manager_id": 3,
      "address_code": "LG-001"
    }
  ],
  "fireDevice": [
    {
      "id": 1,
      "building_id": 1,
      "device_code": "EXT-1F-001",
      "device_type": "EXTINGUISHER",
      "floor": "1F",
      "location_desc": "1层东侧走廊",
      "install_date": "2025-03-11T09:00:00Z",
      "status": "NORMAL",
      "next_maintenance_at": "2026-10-11T09:00:00Z"
    },
    {
      "id": 2,
      "building_id": 2,
      "device_code": "SD-2F-002",
      "device_type": "SMOKE_DETECTOR",
      "floor": "2F",
      "location_desc": "2层会议室吊顶",
      "install_date": "2025-04-12T09:00:00Z",
      "status": "PENDING_RECTIFY",
      "next_maintenance_at": "2026-10-12T09:00:00Z"
    },
    {
      "id": 3,
      "building_id": 3,
      "device_code": "SPR-3F-003",
      "device_type": "SPRINKLER",
      "floor": "3F",
      "location_desc": "3层货架区",
      "install_date": "2025-05-13T09:00:00Z",
      "status": "NORMAL",
      "next_maintenance_at": "2026-10-13T09:00:00Z"
    },
    {
      "id": 4,
      "building_id": 1,
      "device_code": "EXT-2F-004",
      "device_type": "EXTINGUISHER",
      "floor": "2F",
      "location_desc": "2层西侧楼梯间",
      "install_date": "2025-06-14T09:00:00Z",
      "status": "NORMAL",
      "next_maintenance_at": "2026-10-14T09:00:00Z"
    },
    {
      "id": 5,
      "building_id": 1,
      "device_code": "EXIT-1F-005",
      "device_type": "EXIT_LIGHT",
      "floor": "1F",
      "location_desc": "1层安全出口",
      "install_date": "2025-07-15T09:00:00Z",
      "status": "NORMAL",
      "next_maintenance_at": "2026-10-15T09:00:00Z"
    },
    {
      "id": 6,
      "building_id": 2,
      "device_code": "HYD-1F-006",
      "device_type": "HYDRANT",
      "floor": "1F",
      "location_desc": "1层大厅消火栓箱",
      "install_date": "2025-08-16T09:00:00Z",
      "status": "NORMAL",
      "next_maintenance_at": "2026-10-16T09:00:00Z"
    }
  ],
  "inspectionTask": [
    {
      "id": 1,
      "building_id": 1,
      "inspector_id": 1,
      "plan_date": "2026-09-27T09:00:00Z",
      "task_type": "ROUTINE",
      "status": "PLANNED",
      "checklist_version": "CL-2026-09",
      "finished_at": ""
    },
    {
      "id": 2,
      "building_id": 2,
      "inspector_id": 2,
      "plan_date": "2026-09-20T09:00:00Z",
      "task_type": "ROUTINE",
      "status": "SUBMITTED",
      "checklist_version": "CL-2026-09",
      "finished_at": "2026-09-20T15:30:00Z"
    },
    {
      "id": 3,
      "building_id": 3,
      "inspector_id": 3,
      "plan_date": "2026-09-21T09:00:00Z",
      "task_type": "SPECIAL",
      "status": "SUBMITTED",
      "checklist_version": "CL-2026-09",
      "finished_at": "2026-09-21T16:10:00Z"
    }
  ],
  "inspectionResult": [
    {
      "id": 1,
      "task_id": 2,
      "device_id": 2,
      "item_code": "SMOKE_TEST",
      "result_status": "ABNORMAL",
      "measured_value": "无报警响应",
      "photo_url": "/mock/photo_url-1.png",
      "note": "烟感按下测试钮无联动"
    },
    {
      "id": 2,
      "task_id": 3,
      "device_id": 3,
      "item_code": "PRESSURE_CHECK",
      "result_status": "ABNORMAL",
      "measured_value": "0.05MPa",
      "photo_url": "/mock/photo_url-2.png",
      "note": "末端试水压力不足"
    },
    {
      "id": 3,
      "task_id": 2,
      "device_id": 6,
      "item_code": "HYDRANT_PRESSURE",
      "result_status": "NORMAL",
      "measured_value": "0.35MPa",
      "photo_url": "/mock/photo_url-3.png",
      "note": "水压正常"
    }
  ],
  "hazardTicket": [
    {
      "id": 1,
      "result_id": 1,
      "severity": "HIGH",
      "owner_id": 2,
      "deadline": "2026-10-04T09:00:00Z",
      "rectify_status": "OPEN",
      "rectify_note": "",
      "closed_at": ""
    },
    {
      "id": 2,
      "result_id": 2,
      "severity": "MEDIUM",
      "owner_id": 3,
      "deadline": "2026-09-28T09:00:00Z",
      "rectify_status": "CLOSED",
      "rectify_note": "已更换喷头并复验合格",
      "closed_at": "2026-09-24T10:00:00Z"
    }
  ]
}
