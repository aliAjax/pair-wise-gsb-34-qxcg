STATUS_BY_CODE = {
    "AUTH_REQUIRED": 401,
    "RBAC_DENIED": 403,
    "VALIDATION_FAILED": 422,
    "EMPTY_CHECKLIST": 422,
    "RATE_LIMITED": 429,
    "TASK_NOT_FOUND": 404,
    "DEVICE_NOT_FOUND": 404,
    "RESULT_NOT_FOUND": 404,
    "TICKET_NOT_FOUND": 404
}

def to_error_payload(exc):
    return {"code": getattr(exc, "code", "INTERNAL_ERROR"), "message": str(exc)}

def status_for_code(code):
    return STATUS_BY_CODE.get(code, 400)
