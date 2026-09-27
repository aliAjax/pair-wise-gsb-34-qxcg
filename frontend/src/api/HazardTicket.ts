import { ERROR_MESSAGES } from "../constants/errorMessages";
import { mockCloseTicket, mockDb } from "../mocks/mockDb";
import type { HazardTicket } from "../types/HazardTicket";

const endpoint = "/api/hazard-ticket";

export async function listHazardTicket(): Promise<HazardTicket[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api")) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...mockDb.hazardTicket];
}

export async function closeHazardTicket(ticketId: number, rectifyNote: string): Promise<HazardTicket> {
  try {
    const res = await fetch(`${endpoint}/${ticketId}/close`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rectify_note: rectifyNote })
    });
    if (res.ok) return await res.json();
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail?.message ?? ERROR_MESSAGES.VALIDATION_FAILED);
  } catch (err) {
    if (err instanceof TypeError) {
      // Backend unreachable: run the same close flow against local mock data.
      return mockCloseTicket(ticketId, rectifyNote);
    }
    throw err;
  }
}

export async function saveHazardTicket(payload: HazardTicket) {
  console.info("save HazardTicket", payload);
  return payload;
}
