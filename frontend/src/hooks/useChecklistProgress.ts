import { useMemo } from "react";
import type { ChecklistEntry } from "../types/InspectionResult";

export function useChecklistProgress(entries: ChecklistEntry[] = []) {
  return useMemo(() => {
    const total = entries.length;
    const done = entries.filter((entry) => entry.result_status === "NORMAL" || entry.result_status === "ABNORMAL").length;
    const abnormal = entries.filter((entry) => entry.result_status === "ABNORMAL").length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { done, total, abnormal, percent, allDone: total > 0 && done === total };
  }, [entries]);
}
