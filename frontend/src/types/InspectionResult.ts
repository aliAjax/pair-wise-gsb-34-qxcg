import type { InspectionTask } from "./InspectionTask";
import type { HazardTicket } from "./HazardTicket";

export interface InspectionResult {
  id: number;
  task_id: number;
  device_id: number;
  item_code: string;
  result_status: string;
  measured_value: string;
  photo_url: string;
  note: string;
}

export interface InspectionResultEntry {
  device_id: number;
  item_code: string;
  result_status: string;
  measured_value: string;
  photo_url: string;
  note: string;
}

export interface SubmitInspectionTaskSummary {
  task: InspectionTask;
  results: InspectionResult[];
  hazards_created: HazardTicket[];
  hazards_reopened: HazardTicket[];
}
