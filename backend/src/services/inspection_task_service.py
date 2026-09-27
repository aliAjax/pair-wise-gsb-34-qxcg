from src.constants.error_codes import ERROR_CODES
from src.constants.error_messages import ERROR_MESSAGES
from src.constants.hazard_severity import HazardSeverity
from src.constants.log_templates import LOG_TEMPLATES
from src.constants.result_status import ResultStatus
from src.constructors.hazard_ticket_factory import create_hazard_ticket_dto
from src.constructors.inspection_result_factory import create_inspection_result_dto
from src.middlewares.error_handler_middleware import BizError
from src.repositories.fire_device_repository import FireDeviceRepository
from src.repositories.hazard_ticket_repository import HazardTicketRepository
from src.repositories.inspection_result_repository import InspectionResultRepository
from src.repositories.inspection_task_repository import InspectionTaskRepository
from src.utils.formatters import audit_target, days_from_now_iso, now_iso


class InspectionTaskService:
    def __init__(self):
        self.repo = InspectionTaskRepository()
        self.result_repo = InspectionResultRepository()
        self.hazard_repo = HazardTicketRepository()
        self.device_repo = FireDeviceRepository()

    def list(self):
        return self.repo.find_all()

    def submit(self, task_id, payload):
        task = self.repo.find_by_id(task_id)
        if task is None:
            raise BizError(ERROR_CODES["NOT_FOUND"], ERROR_MESSAGES["TASK_NOT_FOUND"], 404)
        items = (payload or {}).get("items") or []
        if not items:
            raise BizError(ERROR_CODES["VALIDATION_FAILED"], ERROR_MESSAGES["EMPTY_CHECKLIST"])
        devices = {row["id"]: row for row in self.device_repo.find_by_building(task["building_id"])}
        results = []
        hazards_created = 0
        for item in items:
            device_id = item.get("device_id")
            item_code = str(item.get("item_code") or "").strip()
            result_status = item.get("result_status")
            severity = item.get("severity") or "MEDIUM"
            if device_id not in devices or not item_code or result_status not in ResultStatus:
                raise BizError(ERROR_CODES["VALIDATION_FAILED"], ERROR_MESSAGES["INVALID_CHECKLIST_ITEM"])
            if severity not in HazardSeverity:
                raise BizError(ERROR_CODES["VALIDATION_FAILED"], ERROR_MESSAGES["INVALID_SEVERITY"])
            result = self.result_repo.find_one(task_id, device_id, item_code)
            if result is None:
                result = create_inspection_result_dto(
                    id=self.result_repo.next_id(),
                    task_id=task_id,
                    device_id=device_id,
                    item_code=item_code,
                    result_status=result_status,
                    measured_value=item.get("measured_value") or "",
                    photo_url=item.get("photo_url") or "",
                    note=item.get("note") or "",
                )
                self.result_repo.insert(result)
                print(LOG_TEMPLATES["InspectionResult"][0], audit_target("InspectionResult", result["id"]))
            else:
                self.result_repo.update(result["id"], {
                    "result_status": result_status,
                    "measured_value": item.get("measured_value") or "",
                    "photo_url": item.get("photo_url") or "",
                    "note": item.get("note") or "",
                })
                print(LOG_TEMPLATES["InspectionResult"][1], audit_target("InspectionResult", result["id"]))
            results.append(result)
            if result_status == "ABNORMAL":
                if devices[device_id]["status"] != "PENDING_RECTIFY":
                    self.device_repo.update_status(device_id, "PENDING_RECTIFY")
                    print(LOG_TEMPLATES["FireDevice"][2], audit_target("FireDevice", device_id))
                if self.hazard_repo.find_open_by_result(result["id"]) is None:
                    ticket = create_hazard_ticket_dto(
                        id=self.hazard_repo.next_id(),
                        result_id=result["id"],
                        severity=severity,
                        owner_id=(payload or {}).get("owner_id") or 31,
                        deadline=days_from_now_iso(7),
                        rectify_status="PENDING",
                        rectify_note="",
                        closed_at="",
                    )
                    self.hazard_repo.insert(ticket)
                    hazards_created += 1
                    print(LOG_TEMPLATES["HazardTicket"][0], audit_target("HazardTicket", ticket["id"]))
        self.repo.update(task_id, {"status": "SUBMITTED", "finished_at": now_iso()})
        print(LOG_TEMPLATES["InspectionTask"][2], audit_target("InspectionTask", task_id))
        return {"task": self.repo.find_by_id(task_id), "results": results, "hazards_created": hazards_created}
