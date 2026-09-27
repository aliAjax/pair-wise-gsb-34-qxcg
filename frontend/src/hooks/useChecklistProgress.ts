import { useMemo } from "react";
import type { InspectionResultEntry } from "../types/InspectionResult";

// 逐项录入进度：异常项必须填写实测值或备注才算完成。
export function useChecklistProgress(deviceIds: number[], entries: Record<number, InspectionResultEntry>) {
  return useMemo(() => {
    const total = deviceIds.length;
    const done = deviceIds.filter((id) => {
      const entry = entries[id];
      if (!entry || entry.result_status === "") return false;
      if (entry.result_status === "ABNORMAL") {
        return entry.note.trim() !== "" || entry.measured_value.trim() !== "";
      }
      return true;
    }).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, percent, complete: total > 0 && done === total };
  }, [deviceIds, entries]);
}
