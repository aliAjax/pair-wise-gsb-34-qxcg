from fastapi import HTTPException
from src.middlewares.error_handler_middleware import BizError, to_error_payload
from src.services.inspection_task_service import InspectionTaskService

service = InspectionTaskService()


def list_inspection_task():
    return service.list()


def submit_inspection_task(task_id: int, payload: dict):
    try:
        return service.submit(task_id, payload)
    except BizError as exc:
        raise HTTPException(status_code=exc.status, detail=to_error_payload(exc))
