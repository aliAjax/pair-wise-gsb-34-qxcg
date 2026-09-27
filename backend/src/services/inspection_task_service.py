import logging

from src.constants.device_status import DEVICE_STATUS_PENDING_RECTIFY
from src.constants.error_codes import ERROR_CODES
from src.constants.hazard_severity import DEFAULT_SEVERITY_BY_DEVICE_TYPE
from src.constants.log_templates import LOG_TEMPLATES
from src.constants.rectify_status import RECTIFY_STATUS_CLOSED, RECTIFY_STATUS_OPEN
from src.constants.result_status import RESULT_STATUS_ABNORMAL, ResultStatus
from src.constructors.hazard_ticket_factory import create_hazard_ticket_dto
from src.constructors.inspection_result_factory import create_inspection_result_dto
from src.repositories.building_repository import BuildingRepository
from src.repositories.fire_device_repository import FireDeviceRepository
from src.repositories.hazard_ticket_repository import HazardTicketRepository
from src.repositories.inspection_result_repository import InspectionResultRepository
from src.repositories.inspection_task_repository import InspectionTaskRepository
from src.services.service_error import ServiceError
from src.utils.formatters import audit_target, deadline_iso, now_iso

logger = logging.getLogger("fire-inspect")

class InspectionTaskService:
    def __init__(self):
        self.repo = InspectionTaskRepository()
        self.result_repo = InspectionResultRepository()
        self.device_repo = FireDeviceRepository()
        self.hazard_repo = HazardTicketRepository()
        self.building_repo = BuildingRepository()

    def list(self):
        return self.repo.find_all()

    def submit(self, task_id, items):
        """逐项录入并提交巡检结果。

        幂等：结果按 (task_id, device_id, item_code) 覆盖更新，隐患单按 result_id 唯一，
        同一任务重复提交不会产生重复隐患单。
        """
        task = self.repo.find_by_id(task_id)
        if task is None:
            raise ServiceError(ERROR_CODES["TASK_NOT_FOUND"])
        if not items:
            raise ServiceError(ERROR_CODES["EMPTY_CHECKLIST"])
        results = [self._upsert_result(task_id, item) for item in items]
        hazards_created = []
        hazards_reopened = []
        for result in results:
            if result["result_status"] != RESULT_STATUS_ABNORMAL:
                continue
            ticket, created = self._ensure_hazard_ticket(task, result)
            if created:
                hazards_created.append(ticket)
            elif ticket["rectify_status"] == RECTIFY_STATUS_CLOSED:
                ticket["rectify_status"] = RECTIFY_STATUS_OPEN
                ticket["closed_at"] = ""
                self.hazard_repo.save(ticket)
                hazards_reopened.append(ticket)
                logger.info("%s %s result_id=%s", LOG_TEMPLATES["HazardTicket"][2],
                            audit_target("HazardTicket", ticket["id"]), result["id"])
            self._mark_device_pending_rectify(result["device_id"])
        task["status"] = "SUBMITTED"
        task["finished_at"] = now_iso()
        self.repo.save(task)
        logger.info("%s %s results=%d hazards_created=%d hazards_reopened=%d",
                    LOG_TEMPLATES["InspectionTask"][2], audit_target("InspectionTask", task_id),
                    len(results), len(hazards_created), len(hazards_reopened))
        return {
            "task": task,
            "results": results,
            "hazards_created": hazards_created,
            "hazards_reopened": hazards_reopened
        }

    def _upsert_result(self, task_id, item):
        device = self.device_repo.find_by_id(item.device_id)
        if device is None:
            raise ServiceError(ERROR_CODES["DEVICE_NOT_FOUND"])
        if item.result_status not in ResultStatus:
            raise ServiceError(ERROR_CODES["VALIDATION_FAILED"])
        existing = self.result_repo.find_by_task_device_item(task_id, item.device_id, item.item_code)
        if existing is not None:
            existing["result_status"] = item.result_status
            existing["measured_value"] = item.measured_value
            existing["photo_url"] = item.photo_url
            existing["note"] = item.note
            self.result_repo.save(existing)
            logger.info("%s %s", LOG_TEMPLATES["InspectionResult"][1],
                        audit_target("InspectionResult", existing["id"]))
            return existing
        result = create_inspection_result_dto(
            id=self.result_repo.next_id(),
            task_id=task_id,
            device_id=item.device_id,
            item_code=item.item_code,
            result_status=item.result_status,
            measured_value=item.measured_value,
            photo_url=item.photo_url,
            note=item.note
        )
        self.result_repo.save(result)
        logger.info("%s %s", LOG_TEMPLATES["InspectionResult"][0],
                    audit_target("InspectionResult", result["id"]))
        return result

    def _ensure_hazard_ticket(self, task, result):
        existing = self.hazard_repo.find_by_result_id(result["id"])
        if existing is not None:
            return existing, False
        building = self.building_repo.find_by_id(task["building_id"])
        device = self.device_repo.find_by_id(result["device_id"])
        ticket = create_hazard_ticket_dto(
            id=self.hazard_repo.next_id(),
            result_id=result["id"],
            severity=DEFAULT_SEVERITY_BY_DEVICE_TYPE.get(device["device_type"], "MEDIUM") if device else "MEDIUM",
            owner_id=building["manager_id"] if building else task["inspector_id"],
            deadline=deadline_iso(7),
            rectify_status=RECTIFY_STATUS_OPEN,
            rectify_note="",
            closed_at=""
        )
        self.hazard_repo.save(ticket)
        logger.info("%s %s result_id=%s severity=%s", LOG_TEMPLATES["HazardTicket"][0],
                    audit_target("HazardTicket", ticket["id"]), result["id"], ticket["severity"])
        return ticket, True

    def _mark_device_pending_rectify(self, device_id):
        device = self.device_repo.find_by_id(device_id)
        if device is None or device["status"] == DEVICE_STATUS_PENDING_RECTIFY:
            return
        device["status"] = DEVICE_STATUS_PENDING_RECTIFY
        self.device_repo.save(device)
        logger.info("%s %s status=%s", LOG_TEMPLATES["FireDevice"][2],
                    audit_target("FireDevice", device_id), DEVICE_STATUS_PENDING_RECTIFY)
