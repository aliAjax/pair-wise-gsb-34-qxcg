from typing import List, TypedDict


class InspectionSubmitItem(TypedDict, total=False):
    device_id: int
    item_code: str
    result_status: str
    measured_value: str
    photo_url: str
    note: str
    severity: str


class InspectionTaskSubmitPayload(TypedDict, total=False):
    items: List[InspectionSubmitItem]
    owner_id: int


InspectionTaskPayload = dict
