import type { InspectionTask } from "../types/InspectionTask";

export const createDefaultInspectionTask = (overrides: Partial<InspectionTask> = {}): InspectionTask => ({
  id: 1 as never,
  building_id: 1 as never,
  inspector_id: 1 as never,
  plan_date: "2026-09-27T09:00:00Z" as never,
  task_type: "ROUTINE" as never,
  status: "PLANNED" as never,
  checklist_version: "CL-2026-09" as never,
  finished_at: "" as never,
  ...overrides
});

export const createInspectionTaskForm = createDefaultInspectionTask;
export const createInspectionTaskResponse = createDefaultInspectionTask;
