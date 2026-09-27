from datetime import datetime, timedelta, timezone

def audit_target(kind, id):
    return f"{kind}#{id}"

def now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

def deadline_iso(days=7):
    return (datetime.now(timezone.utc) + timedelta(days=days)).strftime("%Y-%m-%dT%H:%M:%SZ")
