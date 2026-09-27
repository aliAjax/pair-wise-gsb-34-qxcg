def create_inspection_result_dto(**overrides):
    row = {"id": 1, "task_id": 1, "device_id": 1, "item_code": "PRESSURE_CHECK", "result_status": "NORMAL", "measured_value": "", "photo_url": "", "note": ""}
    row.update(overrides)
    return row
