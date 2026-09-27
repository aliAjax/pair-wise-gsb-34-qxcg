from fastapi import Request
from fastapi.responses import JSONResponse

from src.middlewares.error_handler_middleware import status_for_code, to_error_payload
from src.middlewares.rbac_middleware import require_permission
from src.services.hazard_ticket_service import HazardTicketService
from src.services.service_error import ServiceError
from src.types.hazard_ticket_payload import CloseHazardTicketPayload

service = HazardTicketService()

def list_hazard_ticket():
    return service.list()

def close_hazard_ticket(ticket_id: int, payload: CloseHazardTicketPayload, request: Request):
    try:
        require_permission(request.state.user, "hazard-ticket.close")
        return service.close(ticket_id, payload.rectify_note)
    except ServiceError as exc:
        return JSONResponse(status_code=status_for_code(exc.code), content=to_error_payload(exc))
