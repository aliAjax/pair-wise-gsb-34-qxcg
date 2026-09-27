from fastapi import Request
from fastapi.responses import JSONResponse

from src.middlewares.error_handler_middleware import status_for_code, to_error_payload
from src.middlewares.rbac_middleware import require_permission
from src.services.inspection_task_service import InspectionTaskService
from src.services.service_error import ServiceError
from src.types.inspection_task_payload import SubmitInspectionTaskPayload

service = InspectionTaskService()

def list_inspection_task():
    return service.list()

def submit_inspection_task(task_id: int, payload: SubmitInspectionTaskPayload, request: Request):
    try:
        require_permission(request.state.user, "inspection-task.submit")
        return service.submit(task_id, payload.items)
    except ServiceError as exc:
        return JSONResponse(status_code=status_for_code(exc.code), content=to_error_payload(exc))
