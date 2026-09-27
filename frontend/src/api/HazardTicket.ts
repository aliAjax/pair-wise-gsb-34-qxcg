import { closeHazardTicketOffline, localDb } from "../mocks/localDb";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { CloseHazardTicketSummary, HazardTicket } from "../types/HazardTicket";

const endpoint = "/api/hazard-ticket";

export async function listHazardTicket(): Promise<HazardTicket[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...localDb.hazardTicket];
}

export async function closeHazardTicket(ticketId: number, rectifyNote: string): Promise<CloseHazardTicketSummary> {
  console.info(LOG_TEMPLATES.HazardTicket[2], `HazardTicket#${ticketId}`);
  try {
    const res = await fetch(`${endpoint}/${ticketId}/close`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rectify_note: rectifyNote })
    });
    if (res.ok) return await res.json();
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? `close failed: ${res.status}`);
  } catch (err) {
    if (err instanceof TypeError) {
      // Network failure → fall back to the offline engine with identical semantics.
      return closeHazardTicketOffline(ticketId, rectifyNote);
    }
    throw err;
  }
}

export async function saveHazardTicket(payload: HazardTicket) {
  console.info("save HazardTicket", payload);
  return payload;
}
