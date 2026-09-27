from src.constants.error_codes import ERROR_CODES
from src.constants.error_messages import ERROR_MESSAGES
from src.constants.log_templates import LOG_TEMPLATES
from src.middlewares.error_handler_middleware import BizError
from src.repositories.fire_device_repository import FireDeviceRepository
from src.repositories.hazard_ticket_repository import HazardTicketRepository
from src.repositories.inspection_result_repository import InspectionResultRepository
from src.utils.formatters import audit_target, now_iso


class HazardTicketService:
    def __init__(self):
        self.repo = HazardTicketRepository()
        self.result_repo = InspectionResultRepository()
        self.device_repo = FireDeviceRepository()

    def list(self):
        return self.repo.find_all()

    def close(self, ticket_id, payload):
        ticket = self.repo.find_by_id(ticket_id)
        if ticket is None:
            raise BizError(ERROR_CODES["NOT_FOUND"], ERROR_MESSAGES["TICKET_NOT_FOUND"], 404)
        if ticket["rectify_status"] == "CLOSED":
            raise BizError(ERROR_CODES["VALIDATION_FAILED"], ERROR_MESSAGES["TICKET_ALREADY_CLOSED"])
        rectify_note = (payload or {}).get("rectify_note") or ""
        self.repo.update(ticket_id, {"rectify_status": "CLOSED", "rectify_note": rectify_note, "closed_at": now_iso()})
        print(LOG_TEMPLATES["HazardTicket"][2], audit_target("HazardTicket", ticket_id))
        result = self.result_repo.find_by_id(ticket["result_id"])
        if result is not None:
            device_id = result["device_id"]
            device_result_ids = {row["id"] for row in self.result_repo.find_all() if row["device_id"] == device_id}
            still_open = [row for row in self.repo.find_all() if row["rectify_status"] != "CLOSED" and row["result_id"] in device_result_ids]
            if not still_open:
                self.device_repo.update_status(device_id, "NORMAL")
                print(LOG_TEMPLATES["FireDevice"][2], audit_target("FireDevice", device_id))
        return self.repo.find_by_id(ticket_id)
