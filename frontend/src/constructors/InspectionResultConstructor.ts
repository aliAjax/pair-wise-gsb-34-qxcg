import type { InspectionResult, InspectionResultEntry } from "../types/InspectionResult";

export const createDefaultInspectionResult = (overrides: Partial<InspectionResult> = {}): InspectionResult => ({
  id: 1 as never,
  task_id: 1 as never,
  device_id: 1 as never,
  item_code: "PRESSURE_CHECK" as never,
  result_status: "NORMAL" as never,
  measured_value: "" as never,
  photo_url: "" as never,
  note: "" as never,
  ...overrides
});

export const createInspectionResultForm = createDefaultInspectionResult;
export const createInspectionResultResponse = createDefaultInspectionResult;

export const createInspectionResultEntry = (deviceId: number, itemCode: string): InspectionResultEntry => ({
  device_id: deviceId,
  item_code: itemCode,
  result_status: "NORMAL",
  measured_value: "",
  photo_url: "",
  note: ""
});
