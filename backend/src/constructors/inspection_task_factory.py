def create_inspection_task_dto(**overrides):
    row = {"id":1,"building_id":1,"inspector_id":1,"plan_date":"2026-09-27T09:00:00Z","task_type":"ROUTINE","status":"PLANNED","checklist_version":"CL-2026-09","finished_at":""}
    row.update(overrides)
    return row
