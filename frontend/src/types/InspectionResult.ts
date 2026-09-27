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

export interface ChecklistEntry {
  device_id: number;
  item_code: string;
  result_status: string;
  measured_value: string;
  note: string;
  severity: string;
}
