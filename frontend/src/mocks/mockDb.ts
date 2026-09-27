import { mockData } from "./seedData";
import type { Building } from "../types/Building";
import type { FireDevice } from "../types/FireDevice";
import type { HazardTicket } from "../types/HazardTicket";
import type { InspectionResult } from "../types/InspectionResult";
import type { InspectionSubmitItem, InspectionTask, InspectionTaskSubmitResponse } from "../types/InspectionTask";

export interface MockDb {
  building: Building[];
  fireDevice: FireDevice[];
  inspectionTask: InspectionTask[];
  inspectionResult: InspectionResult[];
  hazardTicket: HazardTicket[];
}

export const mockDb: MockDb = JSON.parse(JSON.stringify(mockData)) as MockDb;

const nextId = (rows: { id: number }[]) => rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
const nowIso = () => new Date().toISOString();
const daysFromNowIso = (days: number) => new Date(Date.now() + days * 86400000).toISOString();

export function mockSubmitTask(taskId: number, items: InspectionSubmitItem[]): InspectionTaskSubmitResponse {
  const task = mockDb.inspectionTask.find((row) => row.id === taskId);
  if (!task) throw new Error("巡检任务不存在");
  if (!items.length) throw new Error("请至少填写一项检查结果");
  const devices = mockDb.fireDevice.filter((row) => row.building_id === task.building_id);
  const results: InspectionResult[] = [];
  let hazardsCreated = 0;
  for (const item of items) {
    const device = devices.find((row) => row.id === item.device_id);
    if (!device || !item.item_code || !["NORMAL", "ABNORMAL"].includes(item.result_status)) {
      throw new Error("检查项数据不完整或设备不属于该楼栋");
    }
    let result = mockDb.inspectionResult.find(
      (row) => row.task_id === taskId && row.device_id === item.device_id && row.item_code === item.item_code
    );
    if (result) {
      Object.assign(result, {
        result_status: item.result_status,
        measured_value: item.measured_value ?? "",
        photo_url: item.photo_url ?? "",
        note: item.note ?? ""
      });
    } else {
      result = {
        id: nextId(mockDb.inspectionResult),
        task_id: taskId,
        device_id: item.device_id,
        item_code: item.item_code,
        result_status: item.result_status,
        measured_value: item.measured_value ?? "",
        photo_url: item.photo_url ?? "",
        note: item.note ?? ""
      };
      mockDb.inspectionResult.push(result);
    }
    results.push(result);
    if (item.result_status === "ABNORMAL") {
      device.status = "PENDING_RECTIFY";
      const hasOpenTicket = mockDb.hazardTicket.some((row) => row.result_id === result.id && row.rectify_status !== "CLOSED");
      if (!hasOpenTicket) {
        mockDb.hazardTicket.push({
          id: nextId(mockDb.hazardTicket),
          result_id: result.id,
          severity: item.severity ?? "MEDIUM",
          owner_id: 31,
          deadline: daysFromNowIso(7),
          rectify_status: "PENDING",
          rectify_note: "",
          closed_at: ""
        });
        hazardsCreated += 1;
      }
    }
  }
  task.status = "SUBMITTED";
  task.finished_at = nowIso();
  return { task, results, hazards_created: hazardsCreated };
}

export function mockCloseTicket(ticketId: number, rectifyNote: string): HazardTicket {
  const ticket = mockDb.hazardTicket.find((row) => row.id === ticketId);
  if (!ticket) throw new Error("隐患单不存在");
  if (ticket.rectify_status === "CLOSED") throw new Error("隐患单已关闭，请勿重复操作");
  ticket.rectify_status = "CLOSED";
  ticket.rectify_note = rectifyNote;
  ticket.closed_at = nowIso();
  const result = mockDb.inspectionResult.find((row) => row.id === ticket.result_id);
  if (result) {
    const deviceResultIds = mockDb.inspectionResult.filter((row) => row.device_id === result.device_id).map((row) => row.id);
    const stillOpen = mockDb.hazardTicket.some((row) => row.rectify_status !== "CLOSED" && deviceResultIds.includes(row.result_id));
    if (!stillOpen) {
      const device = mockDb.fireDevice.find((row) => row.id === result.device_id);
      if (device) device.status = "NORMAL";
    }
  }
  return ticket;
}
