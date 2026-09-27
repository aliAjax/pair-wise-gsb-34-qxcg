def create_inspection_task_dto(**overrides):
    row = {"id": 1, "building_id": 1, "inspector_id": 21, "plan_date": "2026-09-20T09:00:00Z", "task_type": "ROUTINE", "status": "PLANNED", "checklist_version": "v2026.09", "finished_at": ""}
    row.update(overrides)
    return row
