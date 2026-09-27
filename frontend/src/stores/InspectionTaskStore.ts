import { create } from "zustand";
import { listInspectionTask, submitInspectionTask } from "../api/InspectionTask";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { InspectionSubmitItem, InspectionTask, InspectionTaskSubmitResponse } from "../types/InspectionTask";
import { useFireDeviceStore } from "./FireDeviceStore";
import { useHazardTicketStore } from "./HazardTicketStore";
import { useInspectionResultStore } from "./InspectionResultStore";

type State = {
  rows: InspectionTask[];
  loading: boolean;
  submitting: boolean;
  load: () => Promise<void>;
  submit: (taskId: number, items: InspectionSubmitItem[]) => Promise<InspectionTaskSubmitResponse>;
};

export const useInspectionTaskStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  submitting: false,
  async load() {
    set({ loading: true });
    set({ rows: await listInspectionTask(), loading: false });
  },
  async submit(taskId, items) {
    set({ submitting: true });
    try {
      const response = await submitInspectionTask(taskId, items);
      console.info(LOG_TEMPLATES.InspectionTask[2], `InspectionTask#${taskId}`);
      await Promise.all([
        get().load(),
        useInspectionResultStore.getState().load(),
        useFireDeviceStore.getState().load(),
        useHazardTicketStore.getState().load()
      ]);
      return response;
    } finally {
      set({ submitting: false });
    }
  }
}));
