import type { FireDevice } from "./FireDevice";

export interface HazardTicket {
  id: number;
  result_id: number;
  severity: string;
  owner_id: number;
  deadline: string;
  rectify_status: string;
  rectify_note: string;
  closed_at: string;
}

export interface CloseHazardTicketSummary {
  ticket: HazardTicket;
  device?: FireDevice;
  already_closed: boolean;
}
