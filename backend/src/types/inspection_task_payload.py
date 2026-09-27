from pydantic import BaseModel

class InspectionResultEntryPayload(BaseModel):
    device_id: int
    item_code: str
    result_status: str
    measured_value: str = ""
    photo_url: str = ""
    note: str = ""

class SubmitInspectionTaskPayload(BaseModel):
    items: list[InspectionResultEntryPayload]

InspectionTaskPayload = dict
