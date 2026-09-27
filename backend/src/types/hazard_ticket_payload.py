from pydantic import BaseModel

class CloseHazardTicketPayload(BaseModel):
    rectify_note: str = ""

HazardTicketPayload = dict
