def create_fire_device_dto(**overrides):
    row = {"id": 1, "building_id": 1, "device_code": "EXT-1F-001", "device_type": "EXTINGUISHER", "floor": "1F", "location_desc": "大堂东侧灭火器箱", "install_date": "2025-03-12T09:00:00Z", "status": "NORMAL", "next_maintenance_at": "2026-10-15T09:00:00Z"}
    row.update(overrides)
    return row
