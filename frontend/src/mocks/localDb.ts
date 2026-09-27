import { mockData } from "./seedData";
import { createHazardTicketResponse } from "../constructors/HazardTicketConstructor";
import { createInspectionResultResponse } from "../constructors/InspectionResultConstructor";
import { DEFAULT_SEVERITY_BY_DEVICE_TYPE } from "../constants/HazardSeverity";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import type { Building } from "../types/Building";
import type { FireDevice } from "../types/FireDevice";
import type { InspectionTask } from "../types/InspectionTask";
import type { InspectionResult, InspectionResultEntry, SubmitInspectionTaskSummary } from "../types/InspectionResult";
import type { CloseHazardTicketSummary, HazardTicket } from "../types/HazardTicket";

export interface LocalDb {
  building: Building[];
  fireDevice: FireDevice[];
  inspectionTask: InspectionTask[];
  inspectionResult: InspectionResult[];
  hazardTicket: HazardTicket[];
}

// 接口不可用时的本地可变副本，让离线评审也能走通完整业务流程。
export const localDb: LocalDb = JSON.parse(JSON.stringify(mockData));

const nextId = (rows: { id: number }[]) => rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
const nowIso = () => new Date().toISOString();
const deadlineIso = (days: number) => new Date(Date.now() + days * 86400_000).toISOString();

export function submitInspectionTaskOffline(taskId: number, items: InspectionResultEntry[]): SubmitInspectionTaskSummary {
  const task = localDb.inspectionTask.find((row) => row.id === taskId);
  if (!task) throw new Error(ERROR_MESSAGES.TASK_NOT_FOUND);
  if (items.length === 0) throw new Error(ERROR_MESSAGES.EMPTY_CHECKLIST);
  const results: InspectionResult[] = items.map((item) => {
    const device = localDb.fireDevice.find((row) => row.id === item.device_id);
    if (!device) throw new Error(ERROR_MESSAGES.DEVICE_NOT_FOUND);
    const existing = localDb.inspectionResult.find(
      (row) => row.task_id === taskId && row.device_id === item.device_id && row.item_code === item.item_code
    );
    if (existing) {
      Object.assign(existing, item);
      return existing;
    }
    const created = createInspectionResultResponse({ id: nextId(localDb.inspectionResult), task_id: taskId, ...item });
    localDb.inspectionResult.push(created);
    return created;
  });
  const hazards_created: HazardTicket[] = [];
  const hazards_reopened: HazardTicket[] = [];
  for (const result of results) {
    if (result.result_status !== "ABNORMAL") continue;
    let ticket = localDb.hazardTicket.find((row) => row.result_id === result.id);
    if (!ticket) {
      const device = localDb.fireDevice.find((row) => row.id === result.device_id);
      const building = localDb.building.find((row) => row.id === task.building_id);
      ticket = createHazardTicketResponse({
        id: nextId(localDb.hazardTicket),
        result_id: result.id,
        severity: DEFAULT_SEVERITY_BY_DEVICE_TYPE[device?.device_type ?? ""] ?? "MEDIUM",
        owner_id: building?.manager_id ?? task.inspector_id,
        deadline: deadlineIso(7),
        rectify_status: "OPEN",
        rectify_note: "",
        closed_at: ""
      });
      localDb.hazardTicket.push(ticket);
      hazards_created.push(ticket);
    } else if (ticket.rectify_status === "CLOSED") {
      ticket.rectify_status = "OPEN";
      ticket.closed_at = "";
      hazards_reopened.push(ticket);
    }
    const device = localDb.fireDevice.find((row) => row.id === result.device_id);
    if (device) device.status = "PENDING_RECTIFY";
  }
  task.status = "SUBMITTED";
  task.finished_at = nowIso();
  return { task, results, hazards_created, hazards_reopened };
}

export function closeHazardTicketOffline(ticketId: number, rectifyNote: string): CloseHazardTicketSummary {
  const ticket = localDb.hazardTicket.find((row) => row.id === ticketId);
  if (!ticket) throw new Error(ERROR_MESSAGES.TICKET_NOT_FOUND);
  const result = localDb.inspectionResult.find((row) => row.id === ticket.result_id);
  const device = result ? localDb.fireDevice.find((row) => row.id === result.device_id) : undefined;
  if (ticket.rectify_status === "CLOSED") {
    return { ticket, device, already_closed: true };
  }
  ticket.rectify_status = "CLOSED";
  ticket.rectify_note = rectifyNote;
  ticket.closed_at = nowIso();
  if (device) {
    const hasOpen = localDb.hazardTicket.some(
      (row) => row.rectify_status === "OPEN"
        && localDb.inspectionResult.find((r) => r.id === row.result_id)?.device_id === device.id
    );
    if (!hasOpen) device.status = "NORMAL";
  }
  return { ticket, device, already_closed: false };
}
