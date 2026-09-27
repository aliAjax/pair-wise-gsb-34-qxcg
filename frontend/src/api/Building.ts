import { localDb } from "../mocks/localDb";
import type { Building } from "../types/Building";

const endpoint = "/api/building";

export async function listBuilding(): Promise<Building[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...localDb.building];
}

export async function saveBuilding(payload: Building) {
  console.info("save Building", payload);
  return payload;
}
