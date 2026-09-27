from typing import TypedDict


class HazardTicketClosePayload(TypedDict, total=False):
    rectify_note: str


HazardTicketPayload = dict
