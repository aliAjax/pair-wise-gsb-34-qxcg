import { localDb, submitInspectionTaskOffline } from "../mocks/localDb";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { InspectionTask } from "../types/InspectionTask";
import type { InspectionResultEntry, SubmitInspectionTaskSummary } from "../types/InspectionResult";

const endpoint = "/api/inspection-task";

export async function listInspectionTask(): Promise<InspectionTask[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...localDb.inspectionTask];
}

export async function submitInspectionTask(taskId: number, items: InspectionResultEntry[]): Promise<SubmitInspectionTaskSummary> {
  console.info(LOG_TEMPLATES.InspectionTask[2], `InspectionTask#${taskId}`);
  try {
    const res = await fetch(`${endpoint}/${taskId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    });
    if (res.ok) return await res.json();
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? `submit failed: ${res.status}`);
  } catch (err) {
    if (err instanceof TypeError) {
      // Network failure → fall back to the offline engine with identical semantics.
      return submitInspectionTaskOffline(taskId, items);
    }
    throw err;
  }
}

export async function saveInspectionTask(payload: InspectionTask) {
  console.info("save InspectionTask", payload);
  return payload;
}
