import { create } from "zustand";
import { closeHazardTicket, listHazardTicket } from "../api/HazardTicket";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { HazardTicket } from "../types/HazardTicket";
import { useFireDeviceStore } from "./FireDeviceStore";

type State = {
  rows: HazardTicket[];
  loading: boolean;
  closing: boolean;
  load: () => Promise<void>;
  close: (ticketId: number, rectifyNote: string) => Promise<HazardTicket>;
};

export const useHazardTicketStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  closing: false,
  async load() {
    set({ loading: true });
    set({ rows: await listHazardTicket(), loading: false });
  },
  async close(ticketId, rectifyNote) {
    set({ closing: true });
    try {
      const ticket = await closeHazardTicket(ticketId, rectifyNote);
      console.info(LOG_TEMPLATES.HazardTicket[2], `HazardTicket#${ticketId}`);
      await Promise.all([get().load(), useFireDeviceStore.getState().load()]);
      return ticket;
    } finally {
      set({ closing: false });
    }
  }
}));
