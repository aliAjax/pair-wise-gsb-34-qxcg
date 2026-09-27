from datetime import datetime, timedelta, timezone


def audit_target(kind, id):
    return f"{kind}#{id}"


def now_iso():
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def days_from_now_iso(days):
    return (datetime.now(timezone.utc) + timedelta(days=days)).isoformat(timespec="seconds").replace("+00:00", "Z")
