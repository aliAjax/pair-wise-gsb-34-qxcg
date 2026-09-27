from src.constants.error_messages import ERROR_MESSAGES

class ServiceError(Exception):
    """业务异常：code 取自 constants/error_codes，消息取自 constants/error_messages。"""
    def __init__(self, code, message=None):
        self.code = code
        super().__init__(message or ERROR_MESSAGES.get(code, code))
