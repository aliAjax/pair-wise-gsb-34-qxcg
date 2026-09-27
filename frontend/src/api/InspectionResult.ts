import { mockDb } from "../mocks/mockDb";
import type { InspectionResult } from "../types/InspectionResult";

const endpoint = "/api/inspection-result";

export async function listInspectionResult(): Promise<InspectionResult[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api")) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...mockDb.inspectionResult];
}

export async function saveInspectionResult(payload: InspectionResult) {
  console.info("save InspectionResult", payload);
  return payload;
}
