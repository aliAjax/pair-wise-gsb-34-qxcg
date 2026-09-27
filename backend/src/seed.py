seed = {
  "building": [
    {
      "id": 1,
      "name": "1号研发楼",
      "campus": "东区",
      "floor_count": 6,
      "fire_grade": "一级",
      "manager_id": 11,
      "address_code": "EAST-01"
    },
    {
      "id": 2,
      "name": "2号实验楼",
      "campus": "东区",
      "floor_count": 4,
      "fire_grade": "二级",
      "manager_id": 12,
      "address_code": "EAST-02"
    },
    {
      "id": 3,
      "name": "3号仓库",
      "campus": "西区",
      "floor_count": 2,
      "fire_grade": "一级",
      "manager_id": 13,
      "address_code": "WEST-01"
    }
  ],
  "fireDevice": [
    {
      "id": 1,
      "building_id": 1,
      "device_code": "EXT-1F-001",
      "device_type": "EXTINGUISHER",
      "floor": "1F",
      "location_desc": "大堂东侧灭火器箱",
      "install_date": "2025-03-12T09:00:00Z",
      "status": "NORMAL",
      "next_maintenance_at": "2026-10-15T09:00:00Z"
    },
    {
      "id": 2,
      "building_id": 1,
      "device_code": "HYD-2F-002",
      "device_type": "HYDRANT",
      "floor": "2F",
      "location_desc": "走廊尽头消火栓",
      "install_date": "2025-03-12T09:00:00Z",
      "status": "NORMAL",
      "next_maintenance_at": "2026-10-15T09:00:00Z"
    },
    {
      "id": 3,
      "building_id": 2,
      "device_code": "SMK-3F-003",
      "device_type": "SMOKE_DETECTOR",
      "floor": "3F",
      "location_desc": "机房门口烟感探测器",
      "install_date": "2025-06-20T09:00:00Z",
      "status": "NORMAL",
      "next_maintenance_at": "2026-11-01T09:00:00Z"
    },
    {
      "id": 4,
      "building_id": 2,
      "device_code": "SPR-4F-004",
      "device_type": "SPRINKLER",
      "floor": "4F",
      "location_desc": "仓库上方喷淋头",
      "install_date": "2025-06-20T09:00:00Z",
      "status": "PENDING_RECTIFY",
      "next_maintenance_at": "2026-11-01T09:00:00Z"
    },
    {
      "id": 5,
      "building_id": 3,
      "device_code": "EXIT-1F-005",
      "device_type": "EXIT_LIGHT",
      "floor": "1F",
      "location_desc": "安全出口指示灯",
      "install_date": "2024-11-05T09:00:00Z",
      "status": "NORMAL",
      "next_maintenance_at": "2026-09-30T09:00:00Z"
    },
    {
      "id": 6,
      "building_id": 3,
      "device_code": "EXT-2F-006",
      "device_type": "EXTINGUISHER",
      "floor": "2F",
      "location_desc": "配电间旁灭火器",
      "install_date": "2024-11-05T09:00:00Z",
      "status": "NORMAL",
      "next_maintenance_at": "2026-09-30T09:00:00Z"
    }
  ],
  "inspectionTask": [
    {
      "id": 1,
      "building_id": 1,
      "inspector_id": 21,
      "plan_date": "2026-09-20T09:00:00Z",
      "task_type": "ROUTINE",
      "status": "IN_PROGRESS",
      "checklist_version": "v2026.09",
      "finished_at": ""
    },
    {
      "id": 2,
      "building_id": 2,
      "inspector_id": 21,
      "plan_date": "2026-09-18T09:00:00Z",
      "task_type": "ROUTINE",
      "status": "SUBMITTED",
      "checklist_version": "v2026.09",
      "finished_at": "2026-09-18T10:30:00Z"
    },
    {
      "id": 3,
      "building_id": 3,
      "inspector_id": 22,
      "plan_date": "2026-09-28T09:00:00Z",
      "task_type": "SPECIAL",
      "status": "PLANNED",
      "checklist_version": "v2026.09",
      "finished_at": ""
    },
    {
      "id": 4,
      "building_id": 3,
      "inspector_id": 22,
      "plan_date": "2026-09-10T09:00:00Z",
      "task_type": "ROUTINE",
      "status": "REVIEWED",
      "checklist_version": "v2026.08",
      "finished_at": "2026-09-10T11:00:00Z"
    }
  ],
  "inspectionResult": [
    {
      "id": 1,
      "task_id": 2,
      "device_id": 3,
      "item_code": "ALARM_TEST",
      "result_status": "NORMAL",
      "measured_value": "报警联动正常",
      "photo_url": "",
      "note": "烟感测试合格"
    },
    {
      "id": 2,
      "task_id": 2,
      "device_id": 4,
      "item_code": "SPRINKLER_HEAD",
      "result_status": "ABNORMAL",
      "measured_value": "喷头被杂物遮挡",
      "photo_url": "",
      "note": "喷淋头前方堆物，需清理"
    },
    {
      "id": 3,
      "task_id": 4,
      "device_id": 5,
      "item_code": "LIGHT_TEST",
      "result_status": "ABNORMAL",
      "measured_value": "指示灯不亮",
      "photo_url": "",
      "note": "疏散指示灯损坏"
    },
    {
      "id": 4,
      "task_id": 4,
      "device_id": 6,
      "item_code": "PRESSURE_CHECK",
      "result_status": "NORMAL",
      "measured_value": "压力 1.2MPa",
      "photo_url": "",
      "note": "压力正常"
    }
  ],
  "hazardTicket": [
    {
      "id": 1,
      "result_id": 2,
      "severity": "HIGH",
      "owner_id": 31,
      "deadline": "2026-09-30T09:00:00Z",
      "rectify_status": "PENDING",
      "rectify_note": "",
      "closed_at": ""
    },
    {
      "id": 2,
      "result_id": 3,
      "severity": "MEDIUM",
      "owner_id": 31,
      "deadline": "2026-09-20T09:00:00Z",
      "rectify_status": "CLOSED",
      "rectify_note": "已更换指示灯并复验合格",
      "closed_at": "2026-09-19T15:00:00Z"
    }
  ]
}
