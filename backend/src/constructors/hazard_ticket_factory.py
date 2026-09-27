def create_hazard_ticket_dto(**overrides):
    row = {"id": 1, "result_id": 1, "severity": "MEDIUM", "owner_id": 31, "deadline": "2026-09-30T09:00:00Z", "rectify_status": "PENDING", "rectify_note": "", "closed_at": ""}
    row.update(overrides)
    return row
