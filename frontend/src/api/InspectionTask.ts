import { ERROR_MESSAGES } from "../constants/errorMessages";
import { mockDb, mockSubmitTask } from "../mocks/mockDb";
import type { InspectionSubmitItem, InspectionTask, InspectionTaskSubmitResponse } from "../types/InspectionTask";

const endpoint = "/api/inspection-task";

export async function listInspectionTask(): Promise<InspectionTask[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api")) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...mockDb.inspectionTask];
}

export async function submitInspectionTask(taskId: number, items: InspectionSubmitItem[]): Promise<InspectionTaskSubmitResponse> {
  try {
    const res = await fetch(`${endpoint}/${taskId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    });
    if (res.ok) return await res.json();
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail?.message ?? ERROR_MESSAGES.VALIDATION_FAILED);
  } catch (err) {
    if (err instanceof TypeError) {
      // Backend unreachable: run the same idempotent flow against local mock data.
      return mockSubmitTask(taskId, items);
    }
    throw err;
  }
}

export async function saveInspectionTask(payload: InspectionTask) {
  console.info("save InspectionTask", payload);
  return payload;
}
