from src.constants.error_codes import ERROR_CODES
from src.services.service_error import ServiceError

ROLE_PERMISSIONS = {
    "inspection-task.submit": {"inspector", "admin"},
    "hazard-ticket.close": {"maintainer", "admin"}
}

def allow_roles(user, *roles):
    return bool(user) and user.get("role") in roles

def require_permission(user, action):
    roles = ROLE_PERMISSIONS.get(action, {"admin"})
    if not allow_roles(user, *roles):
        raise ServiceError(ERROR_CODES["RBAC_DENIED"])
