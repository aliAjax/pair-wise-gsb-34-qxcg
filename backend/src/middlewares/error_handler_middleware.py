class BizError(Exception):
    def __init__(self, code, message, status=400):
        super().__init__(message)
        self.code = code
        self.status = status


def to_error_payload(exc):
    return {"code": getattr(exc, "code", "INTERNAL_ERROR"), "message": str(exc)}
