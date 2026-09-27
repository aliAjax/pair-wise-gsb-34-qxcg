import type { InspectionResult } from "./InspectionResult";

export interface InspectionTask {
  id: number;
  building_id: number;
  inspector_id: number;
  plan_date: string;
  task_type: string;
  status: string;
  checklist_version: string;
  finished_at: string;
}

export interface InspectionSubmitItem {
  device_id: number;
  item_code: string;
  result_status: string;
  measured_value?: string;
  photo_url?: string;
  note?: string;
  severity?: string;
}

export interface InspectionTaskSubmitResponse {
  task: InspectionTask;
  results: InspectionResult[];
  hazards_created: number;
}
