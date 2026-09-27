from fastapi import HTTPException
from src.middlewares.error_handler_middleware import BizError, to_error_payload
from src.services.hazard_ticket_service import HazardTicketService

service = HazardTicketService()


def list_hazard_ticket():
    return service.list()


def close_hazard_ticket(ticket_id: int, payload: dict):
    try:
        return service.close(ticket_id, payload)
    except BizError as exc:
        raise HTTPException(status_code=exc.status, detail=to_error_payload(exc))
