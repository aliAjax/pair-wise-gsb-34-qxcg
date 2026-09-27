import logging

from src.constants.device_status import DEVICE_STATUS_NORMAL
from src.constants.error_codes import ERROR_CODES
from src.constants.log_templates import LOG_TEMPLATES
from src.constants.rectify_status import RECTIFY_STATUS_CLOSED, RECTIFY_STATUS_OPEN
from src.repositories.fire_device_repository import FireDeviceRepository
from src.repositories.hazard_ticket_repository import HazardTicketRepository
from src.repositories.inspection_result_repository import InspectionResultRepository
from src.services.service_error import ServiceError
from src.utils.formatters import audit_target, now_iso

logger = logging.getLogger("fire-inspect")

class HazardTicketService:
    def __init__(self):
        self.repo = HazardTicketRepository()
        self.result_repo = InspectionResultRepository()
        self.device_repo = FireDeviceRepository()

    def list(self):
        return self.repo.find_all()

    def close(self, ticket_id, rectify_note):
        """复验通过并关闭隐患单；设备上没有其他待整改隐患时恢复为正常。

        幂等：已关闭的单据重复关闭直接返回当前状态，不产生副作用。
        """
        ticket = self.repo.find_by_id(ticket_id)
        if ticket is None:
            raise ServiceError(ERROR_CODES["TICKET_NOT_FOUND"])
        device = self._device_of(ticket)
        if ticket["rectify_status"] == RECTIFY_STATUS_CLOSED:
            return {"ticket": ticket, "device": device, "already_closed": True}
        ticket["rectify_status"] = RECTIFY_STATUS_CLOSED
        ticket["rectify_note"] = rectify_note
        ticket["closed_at"] = now_iso()
        self.repo.save(ticket)
        logger.info("%s %s", LOG_TEMPLATES["HazardTicket"][2],
                    audit_target("HazardTicket", ticket_id))
        if device is not None and not self._has_open_ticket(device["id"]):
            device["status"] = DEVICE_STATUS_NORMAL
            self.device_repo.save(device)
            logger.info("%s %s status=%s", LOG_TEMPLATES["FireDevice"][2],
                        audit_target("FireDevice", device["id"]), DEVICE_STATUS_NORMAL)
        return {"ticket": ticket, "device": device, "already_closed": False}

    def _device_of(self, ticket):
        result = self.result_repo.find_by_id(ticket["result_id"])
        if result is None:
            return None
        return self.device_repo.find_by_id(result["device_id"])

    def _has_open_ticket(self, device_id):
        device_by_result = {row["id"]: row["device_id"] for row in self.result_repo.find_all()}
        return any(
            ticket["rectify_status"] == RECTIFY_STATUS_OPEN
            and device_by_result.get(ticket["result_id"]) == device_id
            for ticket in self.repo.find_all()
        )
