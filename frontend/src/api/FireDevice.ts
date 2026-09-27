import { mockDb } from "../mocks/mockDb";
import type { FireDevice } from "../types/FireDevice";

const endpoint = "/api/fire-device";

export async function listFireDevice(): Promise<FireDevice[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api")) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...mockDb.fireDevice];
}

export async function saveFireDevice(payload: FireDevice) {
  console.info("save FireDevice", payload);
  return payload;
}
