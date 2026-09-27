import { useEffect, useMemo, useRef, useState } from "react";
import { ChecklistPanel } from "../components/common/ChecklistPanel";
import { EmptyState } from "../components/common/EmptyState";
import { StatusBadge } from "../components/common/StatusBadge";
import { CHECKLIST_ITEMS, DEFAULT_CHECKLIST_ITEM } from "../constants/ChecklistItem";
import { InspectionStatusText } from "../constants/InspectionStatus";
import { useChecklistProgress } from "../hooks/useChecklistProgress";
import { useBuildingStore } from "../stores/BuildingStore";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { useInspectionResultStore } from "../stores/InspectionResultStore";
import { useInspectionTaskStore } from "../stores/InspectionTaskStore";
import type { DeviceType } from "../types/DeviceType";
import type { FireDevice } from "../types/FireDevice";
import type { ChecklistEntry, InspectionResult } from "../types/InspectionResult";
import type { InspectionStatus } from "../types/InspectionStatus";
import type { InspectionTask } from "../types/InspectionTask";
import { formatDate } from "../utils/formatters";

function buildEntries(task: InspectionTask, devices: FireDevice[], results: InspectionResult[]) {
  const next: Record<number, ChecklistEntry> = {};
  for (const device of devices) {
    const item = CHECKLIST_ITEMS[device.device_type as DeviceType] ?? DEFAULT_CHECKLIST_ITEM;
    const existing = results.find((row) => row.task_id === task.id && row.device_id === device.id);
    next[device.id] = existing
      ? {
          device_id: device.id,
          item_code: existing.item_code,
          result_status: existing.result_status,
          measured_value: existing.measured_value,
          note: existing.note,
          severity: "MEDIUM"
        }
      : { device_id: device.id, item_code: item.code, result_status: "", measured_value: "", note: "", severity: "MEDIUM" };
  }
  return next;
}

export function TasksPage() {
  const { rows: tasks, loading, submitting, load: loadTasks, submit } = useInspectionTaskStore();
  const { rows: devices, load: loadDevices } = useFireDeviceStore();
  const { rows: buildings, load: loadBuildings } = useBuildingStore();
  const { rows: results, load: loadResults } = useInspectionResultStore();
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [entries, setEntries] = useState<Record<number, ChecklistEntry>>({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const prefilledFor = useRef<number | null>(null);

  useEffect(() => {
    void loadTasks();
    void loadDevices();
    void loadBuildings();
    void loadResults();
  }, [loadTasks, loadDevices, loadBuildings, loadResults]);

  const activeTask = useMemo(() => tasks.find((task) => task.id === activeTaskId) ?? tasks[0], [tasks, activeTaskId]);
  const buildingDevices = useMemo(
    () => (activeTask ? devices.filter((device) => device.building_id === activeTask.building_id) : []),
    [devices, activeTask]
  );
  const buildingName = buildings.find((row) => row.id === activeTask?.building_id)?.name ?? "";

  useEffect(() => {
    if (!activeTask || !buildingDevices.length) return;
    if (prefilledFor.current === activeTask.id) return;
    prefilledFor.current = activeTask.id;
    setEntries(buildEntries(activeTask, buildingDevices, results));
    setMessage("");
    setError("");
  }, [activeTask, buildingDevices, results]);

  const entryList = useMemo(
    () => buildingDevices.flatMap((device) => (entries[device.id] ? [entries[device.id]] : [])),
    [buildingDevices, entries]
  );
  const progress = useChecklistProgress(entryList);

  const patchEntry = (deviceId: number, patch: Partial<ChecklistEntry>) => {
    setEntries((prev) => ({ ...prev, [deviceId]: { ...prev[deviceId], ...patch } }));
  };

  const onSubmit = async () => {
    if (!activeTask) return;
    setMessage("");
    setError("");
    try {
      const response = await submit(
        activeTask.id,
        entryList.map((entry) => ({
          device_id: entry.device_id,
          item_code: entry.item_code,
          result_status: entry.result_status,
          measured_value: entry.measured_value,
          note: entry.note,
          severity: entry.severity
        }))
      );
      setMessage(
        response.hazards_created > 0
          ? `提交成功：生成 ${response.hazards_created} 张隐患单，异常设备已标记为待整改`
          : "提交成功：全部设备正常，未生成隐患单"
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">inspection</p>
          <h1>巡检任务</h1>
        </div>
        {activeTask && (
          <StatusBadge
            value={activeTask.status}
            label={InspectionStatusText[activeTask.status as InspectionStatus] ?? activeTask.status}
          />
        )}
      </section>
      <div className="grid-2 narrow-first">
        <div className="panel">
          <h2>任务列表</h2>
          {loading && <p className="muted">加载中…</p>}
          {!loading && !tasks.length && <EmptyState title="暂无巡检任务" />}
          {tasks.map((task) => (
            <button
              key={task.id}
              className={"list-item" + (activeTask?.id === task.id ? " active" : "")}
              onClick={() => setActiveTaskId(task.id)}
            >
              <strong>
                #{task.id} {buildings.find((row) => row.id === task.building_id)?.name ?? `楼栋 ${task.building_id}`}
              </strong>
              <span className="meta">
                <span>计划 {formatDate(task.plan_date)}</span>
                <StatusBadge
                  value={task.status}
                  label={InspectionStatusText[task.status as InspectionStatus] ?? task.status}
                />
              </span>
            </button>
          ))}
        </div>
        <div className="panel">
          <h2>逐项录入{buildingName ? ` · ${buildingName}` : ""}</h2>
          {!activeTask && <EmptyState title="请选择左侧任务" />}
          {activeTask && (
            <>
              <p className="muted">
                检查清单版本 {activeTask.checklist_version}，共 {buildingDevices.length} 台设备。
                {activeTask.status === "SUBMITTED" || activeTask.status === "REVIEWED"
                  ? "该任务已提交过，重复提交不会重复生成隐患单。"
                  : "完成全部设备判定后即可提交。"}
              </p>
              <div className="progress">
                <div style={{ width: `${progress.percent}%` }} />
              </div>
              <p className="muted">
                已录入 {progress.done}/{progress.total}，异常 {progress.abnormal} 项
              </p>
              <ChecklistPanel devices={buildingDevices} entries={entries} onChange={patchEntry} disabled={submitting} />
              {message && <p className="banner ok">{message}</p>}
              {error && <p className="banner err">{error}</p>}
              <div className="actions">
                <button className="btn" disabled={!progress.allDone || submitting} onClick={() => void onSubmit()}>
                  {submitting ? "提交中…" : "提交巡检结果"}
                </button>
                {!progress.allDone && <span className="muted">请完成全部设备的判定后再提交</span>}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
